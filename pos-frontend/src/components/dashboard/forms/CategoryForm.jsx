import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

const CategoryForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      enqueueSnackbar('Category name is required', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      // await addCategory({ name });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      enqueueSnackbar('Category created successfully', { variant: 'success' });
      setName('');
      onSuccess?.();
    } catch (error) {
      enqueueSnackbar('Failed to create category', { variant: 'error' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-[#ababab] mb-2 text-sm font-medium">
          Category Name
        </label>
        <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent flex-1 text-white focus:outline-none"
            placeholder="e.g., Appetizers, Main Course"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold disabled:opacity-70"
      >
        {isSubmitting ? 'Adding...' : 'Add Category'}
      </button>
    </form>
  );
};

export default CategoryForm;
