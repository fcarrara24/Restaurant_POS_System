// src/pages/UpdateData.jsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTables,
  removeTable,
  updateTable,
  getCategories,
  removeCategory,
  updateCategory,
  getDishes,
  removeDish,
  updateDish,
} from "../../https";
import { enqueueSnackbar } from 'notistack';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const UpdateData = () => {
  const [activeTab, setActiveTab] = useState('tables');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const queryClient = useQueryClient();

  // Fetch data based on active tab
  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
    enabled: activeTab === 'tables',
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    enabled: activeTab === 'categories',
  });

  const { data: dishes } = useQuery({
    queryKey: ['dishes'],
    queryFn: getDishes,
    enabled: activeTab === 'dishes',
  });

  // Mutation for deleting items
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }) => {
      switch (type) {
        case 'table':
          return removeTable(id);
        case 'category':
          return removeCategory(id);
        case 'dish':
          return removeDish(id);
        default:
          throw new Error('Invalid type');
      }
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries([`${type}s`]);
      enqueueSnackbar(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete', { variant: 'error' });
    },
  });

  // Mutation for updating items
  const updateMutation = useMutation({
    mutationFn: async ({ type, id, data }) => {
      const payload = type === 'table' ? { tableId: id, ...data } :
                     type === 'category' ? { categoryId: id, ...data } :
                     { dishId: id, ...data };
      
      if (type === 'table') {
        return updateTable(payload);
      } else if (type === 'category') {
        return updateCategory(payload);
      } else if (type === 'dish') {
        return updateDish(payload);
      }
      throw new Error('Invalid type');
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries([`${type}s`]);
      setEditingId(null);
      enqueueSnackbar(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`, { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update', { variant: 'error' });
    },
  });

  const handleEdit = (item, type) => {
    setEditingId(item._id);
    setEditData({ ...item });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = (type) => {
    updateMutation.mutate({ type, id: editingId, data: editData });
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      deleteMutation.mutate({ type, id });
    }
  };

  const renderTable = () => {
    let data = [];
    let isLoading = false;
    let error = null;

    // Determine which data to use based on active tab
    if (activeTab === 'tables') {
      data = tables?.data?.tables || [];
      isLoading = !tables && activeTab === 'tables';
      error = tables?.error;
    } else if (activeTab === 'categories') {
      data = categories?.data?.categories || [];
      isLoading = !categories && activeTab === 'categories';
      error = categories?.error;
    } else if (activeTab === 'dishes') {
      data = dishes?.data?.dishes || [];
      isLoading = !dishes && activeTab === 'dishes';
      error = dishes?.error;
    }

    if (isLoading) {
      return <div className="text-center py-4 text-gray-400">Loading...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-400">Error loading {activeTab}</div>;
    }

    if (!Array.isArray(data) || data.length === 0) {
      return <div className="text-center py-4 text-gray-400">No {activeTab} found</div>;
    }

    const columns = activeTab === 'tables' ? ['Table No', 'Seats', 'Status'] :
                   activeTab === 'categories' ? ['Name', 'Dish Count'] :
                   ['Name', 'Price', 'Category', 'Status'];

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#1f1f1f] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#2a2a2a]">
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {col}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-[#2a2a2a]">
                {activeTab === 'tables' ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item._id ? (
                        <input
                          type="number"
                          name="tableNo"
                          value={editData.tableNo || ''}
                          onChange={handleInputChange}
                          className="bg-[#333] text-white px-2 py-1 rounded w-20"
                        />
                      ) : (
                        item.tableNo
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item._id ? (
                        <input
                          type="number"
                          name="seats"
                          value={editData.seats || ''}
                          onChange={handleInputChange}
                          className="bg-[#333] text-white px-2 py-1 rounded w-20"
                        />
                      ) : (
                        item.seats
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.isOccupied ? 'Occupied' : 'Available'}
                    </td>
                  </>
                ) : activeTab === 'categories' ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editData.name || ''}
                          onChange={handleInputChange}
                          className="bg-[#333] text-white px-2 py-1 rounded"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.dishCount || 0}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editData.name || ''}
                          onChange={handleInputChange}
                          className="bg-[#333] text-white px-2 py-1 rounded"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item._id ? (
                        <input
                          type="number"
                          name="price"
                          value={editData.price || ''}
                          onChange={handleInputChange}
                          className="bg-[#333] text-white px-2 py-1 rounded w-24"
                        />
                      ) : (
                        `$${item.price}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item._id ? (
                        <select
                          name="category"
                          value={editData.category?._id || ''}
                          onChange={handleInputChange}
                          className="bg-[#333] text-white px-2 py-1 rounded"
                        >
                          {categories?.map(cat => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.category?.name || 'Uncategorized'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item._id ? (
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="isAvailable"
                            checked={editData.isAvailable || false}
                            onChange={handleInputChange}
                            className="form-checkbox h-4 w-4 text-yellow-400"
                          />
                        </label>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      )}
                    </td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === item._id ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdate(activeTab.slice(0, -1))}
                        className="text-green-500 hover:text-green-700"
                        disabled={updateMutation.isLoading}
                      >
                        <FaSave className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => handleEdit(item, activeTab.slice(0, -1))}
                        className="text-yellow-400 hover:text-yellow-600"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(activeTab.slice(0, -1), item._id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={deleteMutation.isLoading}
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <div className="flex border-b border-gray-700 mb-6">
        {['tables', 'categories', 'dishes'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setEditingId(null);
            }}
            className={`px-6 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {renderTable()}
    </div>
  );
};

export default UpdateData;