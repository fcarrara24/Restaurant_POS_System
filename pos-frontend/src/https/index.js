import { axiosWrapper } from './axiosWrapper';

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post('/api/user/login', data);
export const register = (data) => axiosWrapper.post('/api/user/register', data);
export const getUserData = () => axiosWrapper.get('/api/user');
export const logout = () => axiosWrapper.post('/api/user/logout');

// Table Endpoints
export const addTable = (data) => axiosWrapper.post('/api/table/', data);
export const getTables = () => axiosWrapper.get('/api/table');
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/table/${tableId}`, tableData);
export const removeTable = (tableId) => axiosWrapper.delete(`/api/table/${tableId}`);

// Category Endpoints 
export const addCategory = (data) => axiosWrapper.post('/api/category', data);
export const getCategories = () => axiosWrapper.get('/api/category');
export const updateCategory = ({ categoryId, ...categoryData }) =>
  axiosWrapper.put(`/api/category/${categoryId}`, categoryData);
export const removeCategory = (categoryId) => axiosWrapper.delete(`/api/category/${categoryId}`);

// Dish Endpoints
// export const addDish = (data) => axiosWrapper.post('/api/dishes', data);
// In src/https/index.js
export const addDish = (formData) => 
  axiosWrapper.post('/api/dishes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
export const getDishes = () => axiosWrapper.get('/api/dishes');
export const updateDish = ({ dishId, ...dishData }) =>
  axiosWrapper.put(`/api/dishes/${dishId}`, dishData);
export const removeDish = (dishId) => axiosWrapper.delete(`/api/dishes/${dishId}`);
export const popularDishes = () => axiosWrapper.get('/api/dishes/popular');

// Payment Endpoints
export const createOrderRazorpay = (data) =>
  axiosWrapper.post('/api/payment/create-order', data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post('/api/payment//verify-payment', data);

// Order Endpoints
export const addOrder = (data) => axiosWrapper.post('/api/order/', data);
export const getOrders = () => axiosWrapper.get('/api/order');
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });
