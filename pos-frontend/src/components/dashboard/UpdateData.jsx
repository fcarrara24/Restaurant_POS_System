import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTables, removeTable, updateTable,
  getCategories, removeCategory, updateCategory,
  getDishes, removeDish, updateDish 
} from '../../https';
import { enqueueSnackbar } from 'notistack';
import { FaTable, FaUtensils, FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import TabNavigation from './components/TabNavigation';
import DataTable from './components/DataTable';
import NoAccess from './components/NoAccess';

const UpdateData = () => {
  // State hooks - always called in the same order
  const [activeTab, setActiveTab] = useState('tables');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();
  
  // Get role from Redux
  const role = useSelector((state) => state?.user?.role || '');
  
  // Set admin status
  useEffect(() => {
    setIsAdmin(role === 'Admin');
  }, [role]);

  // Memoize tab config to prevent unnecessary re-renders
  const tabConfig = useMemo(() => [
    { id: 'tables', label: 'Tables', icon: <FaTable className="mr-2" /> },
    { id: 'categories', label: 'Categories', icon: <FaList className="mr-2" /> },
    { id: 'dishes', label: 'Dishes', icon: <FaUtensils className="mr-2" /> },
  ], []);

  // Data fetching hooks - using enabled option for conditional fetching
  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
    enabled: isAdmin && activeTab === 'tables',
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    enabled: isAdmin && activeTab === 'categories',
  });

  const { data: dishes } = useQuery({
    queryKey: ['dishes'],
    queryFn: getDishes,
    enabled: isAdmin && activeTab === 'dishes',
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

  // Admin check
  if (!isAdmin) {
    return <NoAccess />;
  }

  const getTableData = () => {
    let data = [];
    let columns = [];
    let isLoading = false;
    let error = null;

    // Determine which data to use based on active tab
    if (activeTab === 'tables') {
      data = tables?.data?.tables || [];
      isLoading = !tables && activeTab === 'tables';
      error = tables?.error;
      columns = ['Table No', 'Seats', 'Status'];
      
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
      columns = ['Name', 'Dish Count'];
      
      if (searchTerm) {
        data = data.filter(category => 
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    } else if (activeTab === 'dishes') {
      data = dishes?.data?.dishes || [];
      isLoading = !dishes && activeTab === 'dishes';
      error = dishes?.error;
      columns = ['Name', 'Price', 'Category', 'Status'];
      
      if (searchTerm) {
        data = data.filter(dish => 
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (dish.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        );
      }
    }

    return { data, columns, isLoading, error };
  };

  const renderCellContent = (item, column, tab) => {
    switch (tab) {
      case 'tables':
        if (column === 'Table No') return item.tableNo;
        if (column === 'Seats') return item.seats;
        if (column === 'Status') {
          return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              item.isOccupied 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.isOccupied ? 'Occupied' : 'Available'}
            </span>
          );
        }
        break;
      
      case 'categories':
        if (column === 'Name') return item.name;
        if (column === 'Dish Count') return `${item.dishCount || 0} dishes`;
        break;
      
      case 'dishes':
        if (column === 'Name') return item.name;
        if (column === 'Price') return `$${item.price?.toFixed(2)}`;
        if (column === 'Category') return item.category?.name || 'Uncategorized';
        if (column === 'Status') {
          return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          );
        }
        break;
      
      default:
        return item[column.toLowerCase()] || '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'seats' || name === 'tableNo' 
        ? Number(value) 
        : value
    }));
  };

  const { data, columns, isLoading, error } = getTableData();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
          <p>Error loading {activeTab}. Please try again later.</p>
          <button 
            onClick={() => queryClient.refetchQueries([activeTab])}
            className="mt-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Manage {activeTab}</h1>
      
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabConfig={tabConfig} 
      />

      {/* Search and Add New */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
        <button
          onClick={() => {
            setEditingId('new');
            setEditData({});
          }}
          className="w-full sm:w-auto px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <span>Add New {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      {/* Table */}
      <DataTable 
        data={data}
        columns={columns}
        activeTab={activeTab}
        editingId={editingId}
        editData={editData}
        setEditData={setEditData}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleDelete={handleDelete}
        handleCancel={handleCancel}
        renderCellContent={renderCellContent}
      />
    </div>
  );
};

export default UpdateData;