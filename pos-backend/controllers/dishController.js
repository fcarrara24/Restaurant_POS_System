const Dish = require('../models/dishModel');
const Category = require('../models/categoryModel');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');

// @desc    Create a new dish
// @route   POST /api/dishes
// @access  Private/Admin
const createDish = async (req, res, next) => {
  try {
    const { name, price, category, description, isAvailable } = req.body;
    const image = req.file; // From multer middleware

    // Validate required fields
    if (!name || !price || !category) {
      throw createHttpError(400, 'Name, price and category are required');
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw createHttpError(400, 'Category not found');
    }

    // Prepare dish data
    const dishData = {
      name,
      price: parseFloat(price),
      category,
      description,
      isAvailable: isAvailable !== 'false' // Default to true if not provided
    };

    // Handle image if uploaded
    if (image) {
      dishData.image = {
        data: image.buffer,
        contentType: image.mimetype,
        size: image.size,
        filename: image.originalname
      };
    }

    // Create and save the dish
    const dish = await Dish.create(dishData);

    res.status(201).json({
      success: true,
      data: dish
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all dishes
// @route   GET /api/dishes
// @access  Public
const getDishes = async (req, res, next) => {
  try {
    // Build query
    const query = {};
    
    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by availability if provided
    if (req.query.available) {
      query.isAvailable = req.query.available === 'true';
    }

    // Search by name or description
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Execute query with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [dishes, total] = await Promise.all([
      Dish.find(query)
        .populate('categoryInfo', 'name')
        .select('-image.data') // Don't send image data in list view
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Dish.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: dishes.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: dishes
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single dish
// @route   GET /api/dishes/:id
// @access  Public
const getDish = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('categoryInfo', 'name');

    if (!dish) {
      throw createHttpError(404, 'Dish not found');
    }

    res.status(200).json({
      success: true,
      data: dish
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update dish
// @route   PUT /api/dishes/:id
// @access  Private/Admin
const updateDish = async (req, res, next) => {
  try {
    const { name, price, category, description, isAvailable } = req.body;
    const image = req.file; // From multer middleware

    // Check if dish exists
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      throw createHttpError(404, 'Dish not found');
    }

    // Update fields if provided
    if (name) dish.name = name;
    if (price) dish.price = parseFloat(price);
    if (description !== undefined) dish.description = description;
    if (isAvailable !== undefined) dish.isAvailable = isAvailable !== 'false';

    // Update category if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        throw createHttpError(400, 'Category not found');
      }
      dish.category = category;
    }

    // Update image if provided
    if (image) {
      dish.image = {
        data: image.buffer,
        contentType: image.mimetype,
        size: image.size,
        filename: image.originalname
      };
    }

    // Save updated dish
    const updatedDish = await dish.save();

    res.status(200).json({
      success: true,
      data: updatedDish
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete dish
// @route   DELETE /api/dishes/:id
// @access  Private/Admin
const deleteDish = async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      throw createHttpError(404, 'Dish not found');
    }

    // TODO: Consider if you want to handle any cleanup (e.g., remove from orders)

    res.status(200).json({
      success: true,
      message: 'Dish deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get dish image
// @route   GET /api/dishes/:id/image
// @access  Public
const getDishImage = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id).select('image');

    if (!dish || !dish.image.data) {
      // Return default image if no image is found
      return res.redirect('/images/default-dish.jpg');
    }

    // Set the content type and send the image data
    res.set('Content-Type', dish.image.contentType);
    res.send(dish.image.data);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDish,
  getDishes,
  getDish,
  updateDish,
  deleteDish,
  getDishImage
};