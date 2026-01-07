// pos-backend/seeder/seed.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/database');
const Dish = require('../models/dishModel');
const Category = require('../models/categoryModel');
const { createCategory, createDish } = require('../controllers/categoryController');

// Helper function to read image file
const readImageFile = (filename) => {
  try {
    const imagePath = path.join(__dirname, 'img', filename);
    const imageBuffer = fs.readFileSync(imagePath);
    return {
      data: imageBuffer,
      contentType: `image/${path.extname(filename).slice(1)}` // gets jpg/png from filename
    };
  } catch (error) {
    console.error(`Error reading image ${filename}:`, error);
    return null;
  }
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to database');

    // Sample data
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
      {
        name: 'Paneer Tikka',
        price: 250,
        category: 'Starters',
        description: 'Grilled cottage cheese with spices',
        isAvailable: true
      },
      {
        name: 'Butter Chicken',
        price: 400,
        category: 'Main Course',
        description: 'Tender chicken in rich tomato gravy',
        isAvailable: true, 
        image: readImageFile('gulab-jamun.webp')
        // image: readImageFile('butter-chicken.jpg') // trying image
      },
      // Add more dishes as needed
    ];

    // Clear existing data
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');
    await Dish.deleteMany({});
    console.log('🗑️  Cleared existing dishes');

    // Create categories
    const createdCategories = await Promise.all(
      categories.map(category => new Category(category).save())
    );
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create a map of category names to their IDs
    const categoryMap = {};
    createdCategories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    // Create dishes
    const createdDishes = await Promise.all(
      dishes.map(dish => {
        const categoryId = categoryMap[dish.category];
        if (!categoryId) {
          throw new Error(`Category '${dish.category}' not found`);
        }
        
        return new Dish({
          ...dish,
          category: categoryId
        }).save();
      })
    );

    console.log(`✅ Created ${createdDishes.length} dishes`);
    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedDatabase().catch(console.error);
}