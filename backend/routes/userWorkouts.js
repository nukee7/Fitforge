const express = require('express');
const router = express.Router();
const { addExerciseToWorkout, getUserWorkouts, getAvailableExercises } = require('../controllers/userWorkoutController');
const { protect } = require('../middleware/auth');

// @route   POST /api/v1/user-workouts/add-exercise
// @desc    Add exercise to user's workout
// @access  Private
router.post('/add-exercise', protect, addExerciseToWorkout);

// @route   GET /api/v1/user-workouts
// @desc    Get user's workout history
// @access  Private
router.get('/', protect, getUserWorkouts);

// @route   GET /api/v1/user-workouts/available-exercises
// @desc    Get available exercises for user to choose from
// @access  Private
router.get('/available-exercises', protect, getAvailableExercises);

module.exports = router;
