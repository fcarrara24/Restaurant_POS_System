import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GrRadialSelected } from 'react-icons/gr';
import { FaShoppingCart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/slices/cartSlice';
import { getAllCategories } from '../../https';
import axios from 'axios';

// ... (previous imports remain the same)

const MenuContainer = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Log component mount and state changes
  useEffect(() => {
    console.log('MenuContainer mounted');
    return () => console.log('MenuContainer unmounted');
  }, []);

  // Log selected category changes
  useEffect(() => {
    console.log('Selected category changed:', selectedCategory?._id);
  }, [selectedCategory]);

  // Log item counts changes
  useEffect(() => {
    console.log('Item counts updated:', itemCounts);
  }, [itemCounts]);

  // Log dishes changes
  useEffect(() => {
    console.log('Dishes updated:', dishes);
  }, [dishes]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      console.log('Fetching categories...');
      try {
        setLoading(true);
        // In the fetchCategories function:
        const response = await getAllCategories();
        console.log('Categories API response:', response);
        // Handle different response structures
        let categoriesData = [];
        if (response) {
          if (Array.isArray(response.data)) {
            categoriesData = response.data;
          } else if (response.data && Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
          }
        }
        console.log('Setting categories:', categoriesData);
        setCategories(categoriesData);
        // Select first category by default if available
        if (categoriesData.length > 0) {
          console.log('Setting initial selected category:', categoriesData[0].name);
          setSelectedCategory(categoriesData[0]);
        } else {
          console.warn('No categories found in response');
          setError('No categories available');
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load categories';
        console.error('Error fetching categories:', {
          message: err.message,
          response: err.response?.data,
          stack: err.stack
        });
        setError(errorMsg);
      } finally {
        console.log('Finished loading categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch dishes when selected category changes
  useEffect(() => {
    const fetchDishes = async () => {
      if (!selectedCategory) {
        console.log('No category selected, skipping dishes fetch');
        return;
      }
      
      console.log(`Fetching dishes for category: ${selectedCategory.name} (${selectedCategory._id})`);
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/dishes?category=${selectedCategory._id}`);
        console.log('Dishes API response:', response.data);
        
        if (response.data && response.data.data) {
          console.log(`Setting ${response.data.data.length} dishes for category ${selectedCategory.name}`);
          setDishes(response.data.data);
        } else {
          console.warn('Unexpected dishes response format:', response.data);
          setDishes([]);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load dishes';
        console.error('Error fetching dishes:', {
          message: err.message,
          response: err.response?.data,
          stack: err.stack
        });
        setError(errorMsg);
        setDishes([]);
      } finally {
        console.log('Finished loading dishes');
        setLoading(false);
      }
    };

    fetchDishes();
  }, [selectedCategory]);

  const incrementCount = (itemId) => {
    console.log(`Incrementing count for item: ${itemId}`);
    setItemCounts((prev) => {
      const newCount = (prev[itemId] || 0) + 1;
      console.log(`New count for item ${itemId}: ${newCount}`);
      return {
        ...prev,
        [itemId]: newCount,
      };
    });
  };

  const decrementCount = (itemId) => {
    console.log(`Decrementing count for item: ${itemId}`);
    setItemCounts((prev) => {
      if (!prev[itemId] || prev[itemId] <= 0) {
        console.log(`Item ${itemId} count is already 0, not decrementing`);
        return prev;
      }
      const newCount = prev[itemId] - 1;
      console.log(`New count for item ${itemId}: ${newCount}`);
      return {
        ...prev,
        [itemId]: newCount,
      };
    });
  };

  const getItemCount = (itemId) => {
    const count = itemCounts[itemId] || 0;
    console.log(`Getting count for item ${itemId}: ${count}`);
    return count;
  };

  const handleAddToCart = (item) => {
    console.log('Adding to cart:', item);
    const count = getItemCount(item._id);
    
    if (count === 0) {
      console.log('Count is 0, not adding to cart');
      return;
    }

    const newObj = {
      id: uuidv4(),
      name: item.name,
      pricePerQuantity: item.price,
      quantity: count,
      price: item.price * count,
    };

    console.log('Dispatching to cart:', newObj);
    dispatch(addItems(newObj));
    
    console.log(`Resetting count for item ${item._id} to 0`);
    setItemCounts((prev) => ({
      ...prev,
      [item._id]: 0,
    }));
  };

  if (loading && categories.length === 0) {
    console.log('Rendering loading state');
    return <div className="text-white text-center p-4">Loading menu...</div>;
  }

  if (error) {
    console.log('Rendering error state:', error);
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  console.log('Rendering with categories:', categories.length, 'selected category:', selectedCategory?._id);
  
  return (
    <>
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {categories.map((category) => {
          console.log(`Rendering category: ${category.name} (${category._id})`);
          return (
            <div
              key={category._id}
              className={`flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer ${
                selectedCategory?._id === category._id ? 'bg-[#2a2a2a]' : 'bg-[#1a1a1a] hover:bg-[#222]'
              }`}
              onClick={() => {
                console.log(`Category clicked: ${category.name} (${category._id})`);
                setSelectedCategory(category);
                setItemCounts({});
              }}
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                  {category.name}
                </h1>
                {selectedCategory?._id === category._id && (
                  <GrRadialSelected className="text-white" size={20} />
                )}
              </div>
              <p className="text-[#ababab] text-sm font-semibold">
                {dishes.length} Items
              </p>
            </div>
          );
        })}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {loading ? (
          <div className="text-white">Loading dishes...</div>
        ) : dishes.length > 0 ? (
          dishes.map((item) => {
            console.log(`Rendering dish: ${item.name} (${item._id}) with count: ${getItemCount(item._id)}`);
            return (
              <div
                key={item._id}
                className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a]"
              >
                <div className="flex items-start justify-between w-full">
                  <h1 className="text-[#f5f5f5] text-lg font-semibold">
                    {item.name}
                  </h1>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg hover:bg-[#3a5a4f]"
                  >
                    <FaShoppingCart size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-[#f5f5f5] text-xl font-bold">
                    €{item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg gap-2 w-[50%]">
                    <button
                      onClick={() => {
                        console.log(`Decrement button clicked for ${item.name}`);
                        decrementCount(item._id);
                      }}
                      className="text-yellow-500 text-2xl hover:text-yellow-400"
                    >
                      &minus;
                    </button>
                    <span className="text-white">{getItemCount(item._id)}</span>
                    <button
                      onClick={() => {
                        console.log(`Increment button clicked for ${item.name}`);
                        incrementCount(item._id);
                      }}
                      className="text-yellow-500 text-2xl hover:text-yellow-400"
                    >
                      &#43;
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-[#ababab]">No dishes available in this category</div>
        )}
      </div>
    </>
  );
};

export default MenuContainer;



























