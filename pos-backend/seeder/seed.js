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
        // image: readImageFile('butter-chicken.jpg') // trying image
      },
      { 
        name: 'Garlic Bread', 
        description: 'Toasted bread with garlic butter and herbs', 
        price: 4.99, 
        category: 'Starters',
        isAvailable: true
      },
      { 
        name: 'Bruschetta', 
        description: 'Toasted bread topped with tomatoes, garlic, and basil', 
        price: 6.99, 
        category: 'Starters',
        isAvailable: true
      },
      { 
        name: 'Spring Rolls', 
        description: 'Crispy vegetable spring rolls with sweet chili sauce', 
        price: 5.99, 
        category: 'Starters',
        isAvailable: true
      },
      // Main Course
      { 
        name: 'Grilled Salmon', 
        description: 'Fresh salmon fillet with lemon butter sauce', 
        price: 22.99, 
        category: 'Main Course',
        isAvailable: true
      },
      { 
        name: 'Beef Tenderloin', 
        description: '8oz grass-fed beef with red wine reduction', 
        price: 28.99, 
        category: 'Main Course',
        isAvailable: true
      },
      { 
        name: 'Vegetable Pasta', 
        description: 'Penne with seasonal vegetables in tomato sauce', 
        price: 16.99, 
        category: 'Main Course',
        isAvailable: true
      },
      // Beverages
      { 
        name: 'Fresh Orange Juice', 
        description: 'Freshly squeezed orange juice', 
        price: 3.99, 
        category: 'Beverages',
        isAvailable: true
      },
      { 
        name: 'Iced Tea', 
        description: 'Homemade iced tea with lemon', 
        price: 2.99, 
        category: 'Beverages',
        isAvailable: true
      },
      { 
        name: 'Lemonade', 
        description: 'Freshly made lemonade with mint', 
        price: 3.49, 
        category: 'Beverages',
        isAvailable: true
      },
      // Soups
      { 
        name: 'Tomato Basil', 
        description: 'Creamy tomato soup with fresh basil', 
        price: 5.99, 
        category: 'Soups',
        isAvailable: true
      },
      { 
        name: 'Chicken Noodle', 
        description: 'Classic chicken noodle soup', 
        price: 6.49, 
        category: 'Soups',
        isAvailable: true
      },
      // Desserts
      { 
        name: 'Chocolate Lava Cake', 
        description: 'Warm chocolate cake with gooey center', 
        price: 7.99, 
        category: 'Desserts',
        isAvailable: true
      },
      { 
        name: 'Tiramisu', 
        description: 'Classic Italian coffee-flavored dessert', 
        price: 8.49, 
        category: 'Desserts',
        isAvailable: true
      },
      // Pizzas
      { 
        name: 'Margherita', 
        description: 'Classic pizza with tomato sauce and mozzarella', 
        price: 12.99, 
        category: 'Pizzas',
        isAvailable: true
      },
      { 
        name: 'Pepperoni', 
        description: 'Pizza with tomato sauce, mozzarella, and pepperoni', 
        price: 14.99, 
        category: 'Pizzas',
        isAvailable: true
      },
      // Alcoholic Drinks
      { 
        name: 'House Red Wine', 
        description: 'Glass of our finest red wine', 
        price: 7.99, 
        category: 'Alcoholic Drinks',
        isAvailable: true
      },
      { 
        name: 'Craft Beer', 
        description: 'Local craft beer selection', 
        price: 6.99, 
        category: 'Alcoholic Drinks',
        isAvailable: true
      },
      // Salads
      { 
        name: 'Caesar Salad', 
        description: 'Romaine lettuce, croutons, parmesan with Caesar dressing', 
        price: 9.99, 
        category: 'Salads',
        isAvailable: true
      },
      { 
        name: 'Greek Salad', 
        description: 'Fresh vegetables, feta, and olives with olive oil dressing', 
        price: 10.99, 
        category: 'Salads',
        isAvailable: true
      }
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