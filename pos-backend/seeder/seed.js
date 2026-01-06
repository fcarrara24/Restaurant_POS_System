// pos-backend/seed.js
const mongoose = require('mongoose');
// const dotenv = require('../config/env');
const Dish = require('../models/dishModel');
const Category = require('../models/categoryModel');

// dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant-pos';

const categories = [
  { name: 'Starters', description: 'Delicious appetizers to start your meal' },
  { name: 'Main Course', description: 'Hearty main dishes' },
  { name: 'Beverages', description: 'Refreshing drinks' },
  { name: 'Soups', description: 'Warm and comforting soups' },
  { name: 'Desserts', description: 'Sweet endings to your meal' },
  { name: 'Pizzas', description: 'Freshly baked pizzas' },
  { name: 'Alcoholic Drinks', description: 'Fine selection of alcoholic beverages' },
  { name: 'Salads', description: 'Fresh and healthy salads' }
];

const dishes = [
  // Starters
  { name: 'Paneer Tikka', price: 250, category: 'Starters', description: 'Grilled cottage cheese with spices' },
  { name: 'Chicken Tikka', price: 300, category: 'Starters', description: 'Grilled chicken with spices' },
  { name: 'Tandoori Chicken', price: 350, category: 'Starters', description: 'Tandoor roasted chicken' },
  { name: 'Samosa', price: 100, category: 'Starters', description: 'Spiced potato filled pastry' },
  { name: 'Aloo Tikki', price: 120, category: 'Starters', description: 'Spiced potato patties' },
  { name: 'Hara Bhara Kebab', price: 220, category: 'Starters', description: 'Green vegetable kebabs' },
  
  // Main Course
  { name: 'Butter Chicken', price: 400, category: 'Main Course', description: 'Tender chicken in rich tomato gravy' },
  { name: 'Paneer Butter Masala', price: 350, category: 'Main Course', description: 'Cottage cheese in creamy tomato sauce' },
  { name: 'Chicken Biryani', price: 450, category: 'Main Course', description: 'Fragrant rice with chicken' },
  { name: 'Dal Makhani', price: 180, category: 'Main Course', description: 'Creamy black lentils' },
  { name: 'Kadai Paneer', price: 300, category: 'Main Course', description: 'Cottage cheese in spiced gravy' },
  { name: 'Rogan Josh', price: 500, category: 'Main Course', description: 'Aromatic lamb curry' },
  
  // Add more dishes as needed
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Dish.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories and create a map for reference
    const categoryDocs = await Category.insertMany(categories);
    const categoryMap = {};
    categoryDocs.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Prepare dishes with category references
    const dishesWithRefs = dishes.map(dish => ({
      ...dish,
      category: categoryMap[dish.category]
    }));

    // Insert dishes
    await Dish.insertMany(dishesWithRefs);
    console.log('Database seeded successfully');

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();