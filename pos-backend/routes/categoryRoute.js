const express = require('express');
const {
  createCategory,
  getCategories,
  getAllCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const router = express.Router();
const { isVerifiedUser, isAdmin } = require('../middlewares/tokenVerification');

// Public routes
router.get('/', getCategories);

// Protected routes (require authentication)
router.use(isVerifiedUser);

// Admin-only routes
router.get('/all', getAllCategories);
router.post('/', isAdmin, createCategory);
router.route('/:id')
  .put(isAdmin, updateCategory)
  .delete(isAdmin, deleteCategory);

module.exports = router;
