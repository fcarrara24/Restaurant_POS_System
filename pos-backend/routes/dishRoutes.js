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

module.exports = router;