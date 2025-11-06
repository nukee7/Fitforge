const express = require('express');
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');
const {
  validateWorkout,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Workout routes
router.route('/')
  .get(validatePagination, getWorkouts)
  .post(validateWorkout, createWorkout);

router.route('/stats')
  .get(getWorkoutStats);

router.route('/:id')
  .get(validateObjectId, getWorkout)
  .put(validateObjectId, validateWorkout, updateWorkout)
  .delete(validateObjectId, deleteWorkout);

module.exports = router;
