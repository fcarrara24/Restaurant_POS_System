import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTables, removeTable, updateTable,
  getCategories, removeCategory, updateCategory,
  getDishes, removeDish, updateDish 
} from '../../https';
import { enqueueSnackbar } from 'notistack';
import { FaEdit, FaTrash, FaSave, FaTimes, FaTable, FaUtensils, FaList, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const UpdateData = () => {
  const [activeTab, setActiveTab] = useState('tables');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();
  const role = useSelector((state) => {
    return state?.user?.role || '';  // Return the role string directly
  });
  useEffect(() => {
    // Check if user is admin when component mounts or role changes
    setIsAdmin(role == 'Admin');
  }, [role]);

  const tabConfig = [
    { id: 'tables', label: 'Tables', icon: <FaTable className="mr-2" /> },
    { id: 'categories', label: 'Categories', icon: <FaList className="mr-2" /> },
    { id: 'dishes', label: 'Dishes', icon: <FaUtensils className="mr-2" /> },
  ];

  // Show unauthorized message if user is not admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full max-w-2xl">
          <div className="flex items-center">
            <FaLock className="mr-2" />
            <div>
              <h3 className="font-bold">Access Denied</h3>
              <p>You don't have admin privileges to access this section.</p>
              <p className="text-sm mt-2">
                Please contact your administrator if you believe this is a mistake.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch data based on active tab
  const { data: tables, error: tablesError } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
    enabled: activeTab === 'tables' && isAdmin,
    onError: (error) => {
      if (error?.response?.status === 403) {
        enqueueSnackbar('Admin access required', { variant: 'error' });
      }
    },
  });

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    enabled: activeTab === 'categories' && isAdmin,
    onError: (error) => {
      if (error?.response?.status === 403) {
        enqueueSnackbar('Admin access required', { variant: 'error' });
      }
    },
  });

  const { data: dishes, error: dishesError } = useQuery({
    queryKey: ['dishes'],
    queryFn: getDishes,
    enabled: activeTab === 'dishes' && isAdmin,
    onError: (error) => {
      if (error?.response?.status === 403) {
        enqueueSnackbar('Admin access required', { variant: 'error' });
      }
    },
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
      
      // Filter tables based on search term
      if (searchTerm) {
        data = data.filter(table => 
          String(table.tableNo).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(table.seats).includes(searchTerm)
        );
      }
    } else if (activeTab === 'categories') {
      data = categories?.data?.categories || [];
      isLoading = !categories && activeTab === 'categories';
      error = categories?.error;
      
      // Filter categories based on search term
      if (searchTerm) {
        data = data.filter(category => 
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    } else if (activeTab === 'dishes') {
      data = dishes?.data?.dishes || [];
      isLoading = !dishes && activeTab === 'dishes';
      error = dishes?.error;
      
      // Filter dishes based on search term
      if (searchTerm) {
        data = data.filter(dish => 
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (dish.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        );
      }
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
          <p>Error loading {activeTab}. Please try again later.</p>
          <button 
            onClick={() => queryClient.refetchQueries([activeTab])}
            className="mt-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-2">
            No {activeTab} found{searchTerm ? ` matching "${searchTerm}"` : ''}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-yellow-400 hover:text-yellow-300 text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      );
    }

    const columns = activeTab === 'tables' ? ['Table No', 'Seats', 'Status'] :
                   activeTab === 'categories' ? ['Name', 'Dish Count'] :
                   ['Name', 'Price', 'Category', 'Status'];

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#262626]">
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={col} 
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                    index === 0 ? 'rounded-tl-lg' : ''
                  } ${index === columns.length - 1 ? 'rounded-tr-lg' : ''}`}
                >
                  {col}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#1f1f1f] divide-y divide-gray-800">
            {data.map((item, index) => (
              <motion.tr 
                key={item._id} 
                className="hover:bg-[#2a2a2a] transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {activeTab === 'tables' ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item._id ? (
                        <input
                          type="number"
                          name="tableNo"
                          value={editData.tableNo || ''}
                          onChange={handleInputChange}
                          className="bg-[#333] text-white px-3 py-1.5 rounded-md w-24 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                          min="1"
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
                          className="bg-[#333] text-white px-3 py-1.5 rounded-md w-20 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                          min="1"
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
                          className="bg-[#333] text-white px-3 py-1.5 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:outline-none"
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
                          className="bg-[#333] text-white px-3 py-1.5 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item._id ? (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                          <input
                            type="number"
                            name="price"
                            value={editData.price || ''}
                            onChange={handleInputChange}
                            className="bg-[#333] text-white pl-8 pr-3 py-1.5 rounded-md w-32 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            min="0"
                            step="0.01"
                          />
                        </div>
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
                          className="bg-[#333] text-white px-3 py-1.5 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:outline-none"
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
                        <label className="inline-flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="isAvailable"
                              checked={editData.isAvailable || false}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </div>
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
                        className="p-1.5 text-green-500 hover:bg-green-900/30 rounded-full transition-colors"
                        disabled={updateMutation.isLoading}
                        title="Save changes"
                      >
                        <FaSave className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1.5 text-gray-400 hover:bg-gray-700/50 rounded-full transition-colors"
                        title="Cancel editing"
                      >
                        <FaTimes className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(item, activeTab.slice(0, -1))}
                        className="p-1.5 text-yellow-400 hover:bg-yellow-900/30 rounded-full transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(activeTab.slice(0, -1), item._id)}
                        className="p-1.5 text-red-500 hover:bg-red-900/30 rounded-full transition-colors"
                        disabled={deleteMutation.isLoading}
                        title="Delete"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex space-x-1 p-1 bg-[#262626] rounded-lg">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingId(null);
                setSearchTerm('');
              }}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-yellow-500 text-gray-900 shadow-md'
                  : 'text-gray-400 hover:bg-[#333] hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#262626] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1f1f1f] rounded-xl p-4 shadow-lg"
      >
        {renderTable()}
      </motion.div>
    </div>
  );
};

export default UpdateData;