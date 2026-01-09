// src/components/common/categorySelect.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../https';
import { enqueueSnackbar } from 'notistack';

const CategorySelect = ({ value, onChange, required = false, className = '' }) => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    onError: (error) => {
      enqueueSnackbar('Error loading categories', { variant: 'error' });
      console.error('Error fetching categories:', error);
    }
  });

  console.log({categories: response});
  // Extract categories from the response
  const categories = response?.data?.data || [];

  if (isLoading) {
    return (
      <select 
        className={`bg-[#1f1f1f] text-white rounded-lg p-3 w-full ${className}`}
        disabled
      >
        <option>Loading categories...</option>
      </select>
    );
  }

  if (error || !categories) {
    return (
      <select 
        className={`bg-[#1f1f1f] text-white rounded-lg p-3 w-full ${className}`}
        disabled
      >
        <option>Error loading categories</option>
      </select>
    );
  }

  return (
    <select
      name="category"
      value={value}
      onChange={onChange}
      required={required}
      className={`bg-[#1f1f1f] text-white rounded-lg p-3 w-full focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${className}`}
    >
      <option value="">Select a category</option>
      {Array.isArray(categories) && categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;