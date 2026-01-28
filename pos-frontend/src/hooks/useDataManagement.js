import { useState } from 'react';

export const useDataManagement = (initialTab = 'tables') => {
  // State for active tab
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for edit modal
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // State for delete confirmation
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Tab configuration
  const tabConfig = [
    { id: 'tables', label: 'Tables', icon: 'FaTable' },
    { id: 'categories', label: 'Categories', icon: 'FaList' },
    { id: 'dishes', label: 'Dishes', icon: 'FaUtensils' },
  ];

  // Handle edit button click
  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditData({ ...item });
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Handle input change in forms
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (type === 'number' ? Number(value) : value)
    }));
  };

  // Close modals
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingId(null);
    setEditData({});
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Get columns based on active tab
  const getColumns = () => {
    switch (activeTab) {
      case 'tables':
        return ['Table No', 'Seats', 'Status'];
      case 'categories':
        return ['Name', 'Dish Count'];
      case 'dishes':
        return ['Name', 'Price', 'Category', 'Status'];
      default:
        return [];
    }
  };

  // Get form fields based on active tab
  const getFormFields = () => {
    const commonFields = [];
    
    switch (activeTab) {
      case 'tables':
        return [
          ...commonFields,
          { name: 'tableNo', label: 'Table Number', type: 'number', required: true },
          { name: 'seats', label: 'Number of Seats', type: 'number', required: true },
          { name: 'isOccupied', label: 'Occupied', type: 'checkbox' }
        ];
      case 'categories':
        return [
          ...commonFields,
          { name: 'name', label: 'Category Name', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'text', required: false }
        ];
      case 'dishes':
        return [
          ...commonFields,
          { name: 'name', label: 'Dish Name', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'text', required: false },
          { name: 'price', label: 'Price', type: 'number', step: '0.01', required: true },
          { name: 'isAvailable', label: 'Available', type: 'checkbox', defaultChecked: true },
          // Note: You might want to add category selection here
        ];
      default:
        return [];
    }
  };

  return {
    // State
    activeTab,
    searchTerm,
    editingId,
    editData,
    isEditModalOpen,
    itemToDelete,
    isDeleteModalOpen,
    tabConfig,
    
    // Derived values
    columns: getColumns(),
    formFields: getFormFields(),
    
    // Actions
    setActiveTab,
    setSearchTerm,
    setEditingId,
    setEditData,
    handleEditClick,
    handleDeleteClick,
    handleInputChange,
    closeEditModal,
    closeDeleteModal
  };
};
