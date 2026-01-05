// import { useState } from 'react';
// import { enqueueSnackbar } from 'notistack';

// const CategoryForm = ({ onSuccess }) => {
//   const [name, setName] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!name.trim()) {
//       enqueueSnackbar('Category name is required', { variant: 'error' });
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       // TODO: Replace with actual API call
//       // await addCategory({ name });
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
//       enqueueSnackbar('Category created successfully', { variant: 'success' });
//       setName('');
//       onSuccess?.();
//     } catch (error) {
//       enqueueSnackbar('Failed to create category', { variant: 'error' });
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//       <div>
//         <label className="block text-[#ababab] mb-2 text-sm font-medium">
//           Category Name
//         </label>
//         <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="bg-transparent flex-1 text-white focus:outline-none"
//             placeholder="e.g., Appetizers, Main Course"
//             required
//           />
//         </div>
//       </div>
//       <button
//         type="submit"
//         disabled={isSubmitting || !name.trim()}
//         className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold disabled:opacity-70"
//       >
//         {isSubmitting ? 'Adding...' : 'Add Category'}
//       </button>
//     </form>
//   );
// };

// export default CategoryForm;

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCategories, 
  removeCategory 
} from '../../https';
import { enqueueSnackbar } from 'notistack';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';


const CategoriesList = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  // Delete category mutation
  const { mutate: deleteCategory } = useMutation({
    mutationFn: removeCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      enqueueSnackbar('Category deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete category';
      enqueueSnackbar(message, { variant: 'error' });
    }
  });

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Categories</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="bg-[#1f1f1f] rounded-lg overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No categories found. Add your first category!
          </div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {categories.map((category) => (
              <li 
                key={category._id} 
                className="flex justify-between items-center p-4 hover:bg-[#2a2a2a] transition-colors"
              >
                <span className="text-white">{category.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-full"
                    aria-label="Edit category"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this category?')) {
                        deleteCategory(category._id);
                      }
                    }}
                    className="p-2 text-red-400 hover:bg-red-900/30 rounded-full"
                    aria-label="Delete category"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Category Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#262626] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <CategoryForm
              initialData={editingCategory}
              isEditing={!!editingCategory}
              onSuccess={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;