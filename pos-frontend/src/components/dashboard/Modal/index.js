import React from 'react';
import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import TableForm from '../forms/TableForm';
import CategoryForm from '../forms/CategoryForm';
import DishForm from '../forms/DishForm';

const Modal = ({ action, onClose }) => {
  const renderForm = () => {
    switch (action) {
      case 'table':
        return <TableForm onSuccess={onClose} />;
      case 'category':
        return <CategoryForm onSuccess={onClose} />;
      case 'dishes':
        return <DishForm onSuccess={onClose} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (action) {
      case 'table':
        return 'Add Table';
      case 'category':
        return 'Add Category';
      case 'dishes':
        return 'Add Dish';
      default:
        return 'Add';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-[#f5f5f5] hover:text-red-500 transition-colors"
            aria-label="Close modal"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {renderForm()}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
