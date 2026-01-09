import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { useMutation } from '@tanstack/react-query';
import { addTable, addCategory, addDish } from '../../https';
import { enqueueSnackbar } from 'notistack';
import CategorySelect from '../common/categorySelect';

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
    description: '',
    isAvailable: true,
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleTableInputChange = (e) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDishInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDishData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar('Image size should be less than 5MB', { variant: 'error' });
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'].includes(file.type)) {
        enqueueSnackbar('Only JPG, PNG, SVG, and WebP images are allowed', { variant: 'error' });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Store the actual File object, not just the preview
      setDishData(prev => ({
        ...prev,
        image: file  // Store the File object directly
      }));
    }
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
      const formData = new FormData();
      formData.append('name', dishData.name);
      formData.append('price', dishData.price);
      formData.append('category', dishData.category);
      formData.append('description', dishData.description);
      formData.append('isAvailable', dishData.isAvailable);
      // if (dishData.image) {
      //   formData.append('image', dishData.image);
      // }
      // Make sure dishData.image is a File object
      if (dishData.image instanceof File) {
        formData.append('image', dishData.image);
      } else if (typeof dishData.image === 'string') {
        // If it's a string (base64), we need to convert it to a File object
        const byteString = atob(dishData.image.split(',')[1]);
        const mimeString = dishData.image.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], 'dish-image.jpg', { type: mimeString });
        formData.append('image', file);
      }
      
      dishMutation.mutate(formData);
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
                <CategorySelect
                  value={dishData.category}
                  onChange={handleDishInputChange}
                  required
                  className="mt-1"
                />
                {/* <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                  <input
                    type="text"
                    name="category"
                    value={dishData.category}
                    onChange={handleDishInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                    placeholder="Enter category ID"
                  />
                </div> */}
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                  Description
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                  <textarea
                    name="description"
                    value={dishData.description}
                    onChange={handleDishInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none resize-none w-full"
                    rows="3"
                    placeholder="Enter dish description"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                  Dish Image
                </label>
                <div className="flex flex-col items-center justify-center w-full">
                  {previewImage ? (
                    <div className="relative w-full">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setDishData(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <IoMdClose size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-[#1f1f1f] hover:bg-[#2a2a2a]">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p className="text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or WebP (MAX. 5MB)</p>
                      </div>
                      <input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden" 
                        accept="image/jpeg,image/png,image/svg+xml,image/webp"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="isAvailable"
                  name="isAvailable"
                  type="checkbox"
                  checked={dishData.isAvailable}
                  onChange={handleDishInputChange}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-300">
                  Available
                </label>
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
