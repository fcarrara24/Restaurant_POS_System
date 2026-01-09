const express = require('express');
const {
  addTable,
  getTables,
  updateTable,
  removeTable
} = require('../controllers/tableController');
const router = express.Router();
const { isVerifiedUser } = require('../middlewares/tokenVerification');

router.route('/').post(isVerifiedUser, addTable);
router.route('/').get(isVerifiedUser, getTables);
router.route('/:id').put(isVerifiedUser, updateTable);
router.route('/:id').delete(isVerifiedUser, removeTable);

module.exports = router;
