import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

// TODO: Replace with actual categories from API/constants
const SAMPLE_CATEGORIES = [
  { id: '1', name: 'Appetizers' },
  { id: '2', name: 'Main Course' },
  { id: '3', name: 'Desserts' },
  { id: '4', name: 'Beverages' },
];

const DishForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || !formData.categoryId) {
      enqueueSnackbar('Please fill all required fields', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      // await addDish(formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      enqueueSnackbar('Dish added successfully', { variant: 'success' });
      setFormData({ name: '', price: '', categoryId: '', description: '' });
      onSuccess?.();
    } catch (error) {
      enqueueSnackbar('Failed to add dish', { variant: 'error' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-[#ababab] mb-2 text-sm font-medium">
          Dish Name <span className="text-red-500">*</span>
        </label>
        <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-transparent flex-1 text-white focus:outline-none"
            placeholder="e.g., Spaghetti Carbonara"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="bg-transparent flex-1 text-white focus:outline-none"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="flex item-center rounded-lg p-2 bg-[#1f1f1f]">
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="bg-transparent flex-1 text-white focus:outline-none p-2 w-full"
              required
            >
              <option value="">Select a category</option>
              {SAMPLE_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[#ababab] mb-2 text-sm font-medium">
          Description (Optional)
        </label>
        <div className="flex item-center rounded-lg p-4 bg-[#1f1f1f]">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="bg-transparent flex-1 text-white focus:outline-none min-h-[80px] resize-none"
            placeholder="Add a brief description..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !formData.name || !formData.price || !formData.categoryId}
        className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold disabled:opacity-70"
      >
        {isSubmitting ? 'Adding...' : 'Add Dish'}
      </button>
    </form>
  );
};

export default DishForm;
