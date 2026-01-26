import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTables, removeTable, updateTable,
  getCategories, removeCategory, updateCategory,
  getDishes, removeDish, updateDish 
} from '../../https';
import { enqueueSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import DataTable from './UpdateDataComponents/DataTable';
import DataTabs from './UpdateDataComponents/DataTabs';
// import DeleteConfirmation from './UpdateDataComponents/DeleteConfirmation';
// import EditModal from './UpdateDataComponents/EditModal'; 
import NoAccess from './components/NoAccess'; 
import { useDataManagement } from '../../hooks/useDataManagement';

const UpdateData = () => {
  const queryClient = useQueryClient();
  const role = useSelector((state) => state?.user?.role || '');
  const isAdmin = role === 'Admin';
  
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    editingId,
    editData,
    setEditData,
    isEditModalOpen,
    isDeleteModalOpen,
    itemToDelete,
    tabConfig,
    closeEditModal,
    closeDeleteModal,
    columns,
    formFields: getFormFields,
    handleEditClick,
    handleDeleteClick,
    handleInputChange,
    handleSave: handleSaveData,
    handleConfirmDelete
  } = useDataManagement();

  // Data fetching
  const { data: tables, isLoading: isLoadingTables } = useQuery({
    queryKey: ['table'],
    queryFn: getTables,
    enabled: isAdmin && activeTab === 'tables',
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['category/all'],
    queryFn: getCategories,
    enabled: isAdmin && activeTab === 'categories'
  });

  const { data: dishes, isLoading: isLoadingDishes } = useQuery({
    queryKey: ['dishes'],
    queryFn: getDishes,
    enabled: isAdmin && activeTab === 'dishes',
    // Let's keep it simple and handle the data structure in getCurrentData
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (item) => {
      switch (activeTab) {
        case 'tables': return removeTable(item._id);
        case 'categories': return removeCategory(item._id);
        case 'dishes': return removeDish(item._id);
        default: throw new Error('Invalid type');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([activeTab]);
      enqueueSnackbar(`${activeTab.slice(0, -1)} deleted successfully`, { variant: 'success' });
      closeDeleteModal();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete', { variant: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...editData, ...data };
      const id = editingId;
      
      switch (activeTab) {
        case 'tables': return updateTable({ tableId: id, ...payload });
        case 'categories': return updateCategory({ categoryId: id, ...payload });
        case 'dishes': return updateDish({ dishId: id, ...payload });
        default: throw new Error('Invalid type');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([activeTab]);
      closeEditModal();
      enqueueSnackbar(`${activeTab.slice(0, -1)} updated successfully`, { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update', { variant: 'error' });
    },
  });

  if (!isAdmin) {
    return <NoAccess />;
  }

  // Get current data based on active tab
  const getCurrentData = () => {
    // console.log({tables, categories, dishes, activeTab});
    // console.log('Dishes data structure:', { dishes });
    switch (activeTab) {
      case 'tables': 
        return Array.isArray(tables?.data?.data) ? tables.data.data : [];
      case 'categories': 
        return Array.isArray(categories?.data?.data) ? categories.data.data : [];
      case 'dishes': 
        // Handle different possible response structures
        if (Array.isArray(dishes)) return dishes;
        if (Array.isArray(dishes?.data)) return dishes.data;
        if (Array.isArray(dishes?.data?.data)) return dishes.data.data;
        return [];
      default: 
        return [];
    }
  };

  // Handle search
  const filteredData = useMemo(() => {
    const data = getCurrentData();
    if (!searchTerm) return data;

    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      if (activeTab === 'tables') {
        return (
          String(item.tableNo).toLowerCase().includes(searchLower) ||
          String(item.seats).includes(searchLower)
        );
      } else if (activeTab === 'categories') {
        return item.name.toLowerCase().includes(searchLower);
      } else if (activeTab === 'dishes') {
        return (
          item.name.toLowerCase().includes(searchLower) ||
          (item.category?.name?.toLowerCase().includes(searchLower) ?? false)
        );
      }
      return true;
    });
  }, [activeTab, searchTerm, tables, categories, dishes]);

  const isLoading = {
    tables: isLoadingTables,
    categories: isLoadingCategories,
    dishes: isLoadingDishes
  }[activeTab];

  // Use handleSave from useDataManagement but wrap it with mutation handling
  const handleSaveWithMutation = async (formData) => {
    try {
      await updateMutation.mutateAsync(formData);
      await handleSaveData(formData);
    } catch (error) {
      console.error('Error saving data:', error);
      enqueueSnackbar('Failed to save changes', { variant: 'error' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
      
      <DataTabs 
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
        data={filteredData}
        columns={columns}
        activeTab={activeTab}
        editingId={editingId}
        editData={editData}
        setEditData={setEditData}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onSave={handleSaveWithMutation}
        onCancel={closeEditModal}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        renderCellContent={(item, column) => {
          if (column === 'Status') {
            if (activeTab === 'tables') {
              return item.isOccupied ? 'Occupied' : 'Available';
            } else if (activeTab === 'dishes') {
              return item.isAvailable ? 'Available' : 'Unavailable';
            }
          }
          return item[column.toLowerCase().replace(/\s+/g, '')] || '';
        }}
      /> 
    </div>
  );
};

export default UpdateData;