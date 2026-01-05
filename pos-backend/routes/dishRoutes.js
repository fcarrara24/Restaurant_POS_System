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

router.route('/')
  .get(getDishes)
  .post(isVerifiedUser, upload.single('image'), createDish);

router.route('/:id')
  .get(getDish)
  .put(isVerifiedUser, upload.single('image'), updateDish)
  .delete(isVerifiedUser, deleteDish);

router.route('/:id/image')
  .get(getDishImage);

module.exports = router;