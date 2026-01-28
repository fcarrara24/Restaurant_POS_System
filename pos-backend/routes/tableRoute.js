const express = require('express');
const {
  addTable,
  getTables,
  updateTable,
  removeTable
} = require('../controllers/tableController');
const router = express.Router();
const { isVerifiedUser, isAdmin } = require('../middlewares/tokenVerification');

router.route('/').post(isAdmin, addTable);
router.route('/').get(isVerifiedUser, getTables);
router.route('/:id').put(isAdmin, updateTable);
router.route('/:id').delete(isAdmin, removeTable);

module.exports = router;
