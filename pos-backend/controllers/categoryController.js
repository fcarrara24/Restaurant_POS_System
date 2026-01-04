const Category = require('../models/categoryModel');
const Dish = require('../models/dishModel');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw createHttpError(400, 'Category name is required');
    }

    // Check if category already exists (case-insensitive)
    const categoryExists = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (categoryExists) {
      throw createHttpError(400, 'Category already exists');
    }

    const category = await Category.create({ name });
    
    res.status(201).json({
      success: true,
      data: category
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid category ID');
    }

    if (!name) {
      throw createHttpError(400, 'Category name is required');
    }

    // Check if new name already exists (case-insensitive)
    const categoryExists = await Category.findOne({ 
      _id: { $ne: id }, // Exclude current category
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (categoryExists) {
      throw createHttpError(400, 'Category with this name already exists');
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw createHttpError(404, 'Category not found');
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid category ID');
    }

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      throw createHttpError(404, 'Category not found');
    }

    // Check if any dishes are using this category
    const dishesWithCategory = await Dish.findOne({ category: id });
    if (dishesWithCategory) {
      throw createHttpError(400, 'Cannot delete category that is in use by dishes');
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};