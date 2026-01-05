const express = require('express');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const router = express.Router();
const { isVerifiedUser } = require('../middlewares/tokenVerification');

router.route('/').post(isVerifiedUser, createCategory);
router.route('/').get(getCategories);
router.route('/:id').put(isVerifiedUser, updateCategory);
router.route('/:id').delete(isVerifiedUser, deleteCategory);

module.exports = router;
