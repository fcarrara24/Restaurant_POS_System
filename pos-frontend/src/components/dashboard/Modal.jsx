import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { useMutation } from '@tanstack/react-query';
import { addTable, addCategory } from '../../https';
import { enqueueSnackbar } from 'notistack';

const Modal = ({ action, onClose }) => {
  const [tableData, setTableData] = useState({
    tableNo: '',
    seats: '',
  });

  const [categoryData, setCategoryData] = useState({
    name: '',
  });

  const [dishData, setDishData] = useState({
    name: '',
    price: '',
    category: '',
  });

  const handleTableInputChange = (e) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDishInputChange = (e) => {
    const { name, value } = e.target;
    setDishData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === 'table') {
      tableMutation.mutate(tableData);
      return;
    }
    
    if (action === 'category') {
      // enqueueSnackbar('Category creation API not implemented yet.', {
      //   variant: 'info',
      // });
      // onClose();
      e.preventDefault();
      categoryMutation.mutate(categoryData);
      return;
      
    }

    if (action === 'dishes') {
      enqueueSnackbar('Dish creation API not implemented yet.', {
        variant: 'info',
      });
      onClose();
      return;
    }

    onClose();
  };

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: (res) => {
      onClose();
      const { data } = res;
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error) => {
      const { data } = error.response;
      enqueueSnackbar(data.message, { variant: 'error' });
      console.log(error);
    },
  });

  const categoryMutation = useMutation({
    mutationFn: (reqData) => addCategory(reqData),
    onSuccess: (res) => {
      onClose();
      const { data } = res;
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error) => {
      const { data } = error.response;
      enqueueSnackbar(data.message, { variant: 'error' });
      console.log(error);
    },
  });

  const dishMutation = useMutation({
    mutationFn: (reqData) => addDish(reqData),
    onSuccess: (res) => {
      onClose();
      const { data } = res;
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error) => {
      const { data } = error.response;
      enqueueSnackbar(data.message, { variant: 'error' });
      console.log(error);
    },
  });


  const modalTitleTable =
    (() => {
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
    })();

  const submitLabel = (()=> {
    switch(action) {
      case 'table':
        return 'Add Table';
      case 'category':
        return 'Add Category';
      case 'dishes':
        return 'Add Dish';
      default:
        return 'Submit';
    }
  })();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96"
      >
        {/* Modal Header */}

        <div className="flex justify-between item-center mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">{modalTitleTable}</h2>
          <button
            onClick={onClose}
            className="text-[#f5f5f5] hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}

        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          {/* HTML table */}
          {action === 'table' && (
            <>
              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                  Table Number
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                  <input
                    type="number"
                    name="tableNo"
                    value={tableData.tableNo}
                    onChange={handleTableInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                  Number of Seats
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                  <input
                    type="number"
                    name="seats"
                    value={tableData.seats}
                    onChange={handleTableInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            </>
          )}
          {/* HTML category  */}
          {action === 'category' && (
            <>
              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                  Category Name
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                  <input
                    type="text"
                    name="name"
                    value={categoryData.name}
                    onChange={handleCategoryInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            </>
          )}
          {/* HTML dishes */}
          {action === 'dishes' && (
            <>
              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                  Dish Name
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                  <input
                    type="text"
                    name="name"
                    value={dishData.name}
                    onChange={handleDishInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                  Price
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                  <input
                    type="number"
                    name="price"
                    value={dishData.price}
                    onChange={handleDishInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                  Category
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                  <input
                    type="text"
                    name="category"
                    value={dishData.category}
                    onChange={handleDishInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full rounded-lg mt-10 mb-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
          >
            {submitLabel}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;
