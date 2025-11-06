const express = require('express');
const {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  getCategories,
  getPopularExercises
} = require('../controllers/exerciseController');
const { protect, adminOnly } = require('../middleware/auth');
const {
  validateExercise,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.route('/')
  .get(validatePagination, getExercises);

router.route('/categories')
  .get(getCategories);

router.route('/popular')
  .get(getPopularExercises);

router.route('/:id')
  .get(validateObjectId, getExercise);

// Admin only routes
router.use(protect, adminOnly);

router.route('/')
  .post(validateExercise, createExercise);

router.route('/:id')
  .put(validateObjectId, validateExercise, updateExercise)
  .delete(validateObjectId, deleteExercise);

module.exports = router;
