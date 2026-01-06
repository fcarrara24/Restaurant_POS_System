const express = require('express');
const {
  createDish,
  getDishes,
  getDish,
  updateDish,
  deleteDish,
  getDishImage
} = require('../controllers/dishController');
const { isVerifiedUser } = require('../middlewares/tokenVerification');
const upload = require('../middlewares/upload');

const router = express.Router();

// At the top of dishRoutes.js, add this import
const Dish = require('../models/dishModel');

// 8000/api/dishes - READ all dishes
router.route('/')
  .get(getDishes) // restituisce tutti i piatti
  .post(isVerifiedUser, upload.single('image'), createDish);

// 8000/api/dishes/:id - READ, UPDATE, DELETE a specific dish
router.route('/:id')
  .get(getDish)
  .put(isVerifiedUser, upload.single('image'), updateDish)
  .delete(isVerifiedUser, deleteDish);

// 8000/api/dishes/:id/image - GET dish image
router.route('/:id/image')
  .get(getDishImage);

// In dishRoutes.js, update the test endpoint
// router.get('/:id/image-test', async (req, res) => {
//   try {
//     const dish = await getDish(req);
    
//     if (!dish || !dish.image || !dish.image.data) {
//       return res.status(404).send('Image not found');
//     }
    
//     // Convert the Buffer to base64
//     const base64Image = dish.image.data.toString('base64');
    
//     // Create a data URL
//     const imageDataUrl = `data:${dish.image.contentType};base64,${base64Image}`;
    
//     // Send the data URL in the response
//     res.json({
//       success: true,
//       data: {
//         contentType: dish.image.contentType,
//         size: dish.image.size,
//         filename: dish.image.filename,
//         imageData: imageDataUrl
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching image:', error);
//     res.status(500).send('Error fetching image');
//   }
// });

// In dishRoutes.js, update the test endpoint
// Simple test endpoint to verify image storage
router.get('/:id/image-test', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).select('image');
    
    if (!dish || !dish.image || !dish.image.data) {
      return res.status(404).json({ 
        success: false,
        message: 'Image not found' 
      });
    }

    // Just return image metadata, not the actual image data
    res.json({
      success: true,
      data: {
        hasImage: true,
        contentType: dish.image.contentType,
        size: dish.image.size,
        filename: dish.image.filename
      }
    });
  } catch (error) {
    console.error('Error checking image:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking image',
      error: error.message
    });
  }
});

// see the image preview
router.get('/:id/preview', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).select('image');
    
    if (!dish || !dish.image || !dish.image.data) {
      return res.status(404).send('Image not found');
    }

    // Set the content type from the stored image
    res.set('Content-Type', dish.image.contentType);
    
    // Send the image data directly
    res.send(dish.image.data);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).send('Error serving image');
  }
});

module.exports = router;