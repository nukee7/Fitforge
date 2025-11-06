const express = require('express');
const {
  getProfile,
  updateProfile,
  deleteAccount,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(validateUserUpdate, updateProfile)
  .delete(deleteAccount);

router.route('/stats')
  .get(getUserStats);

module.exports = router;
