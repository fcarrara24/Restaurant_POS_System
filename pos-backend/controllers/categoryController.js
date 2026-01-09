const Category = require('../models/categoryModel');
const Dish = require('../models/dishModel');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

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

    const category = await Category.create({ 
      name,
      description: description || ''
    });
    
    res.status(201).json({
      success: true,
      data: category
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get active categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories (including inactive)
// @route   GET /api/categories/all
// @access  Private/Admin
const getAllCategories = async (req, res, next) => {
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
    const { name, description, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid category ID');
    }

    const updateData = {};
    
    if (name !== undefined) {
      // Check if another category with the same name exists (case-insensitive)
      const categoryExists = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name}$`, 'i') }
      });

      if (categoryExists) {
        throw createHttpError(400, 'Category with this name already exists');
      }
      updateData.name = name;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
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

// @desc    Delete a category (soft delete)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid category ID');
    }

    // Check if any active dishes are using this category
    const activeDishesUsingCategory = await Dish.findOne({ 
      category: id,
      isAvailable: true 
    });
    
    if (activeDishesUsingCategory) {
      throw createHttpError(400, 'Cannot deactivate category that is being used by active dishes');
    }

    // Soft delete by setting isActive to false
    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      throw createHttpError(404, 'Category not found');
    }

    // Set all dishes in this category as unavailable
    await Dish.updateMany(
      { category: id },
      { isAvailable: false }
    );

    res.status(200).json({
      success: true,
      data: category,
      message: 'Category deactivated successfully. All associated dishes have been marked as unavailable.'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getAllCategories,
  updateCategory,
  deleteCategory
};