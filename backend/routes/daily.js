const express = require('express');
const {
  getDailyExercises,
  getDailyExercisesRange,
  getTodayExercises,
  getExerciseStreak
} = require('../controllers/dailyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Daily exercise routes
router.get('/today', getTodayExercises);
router.get('/streak', getExerciseStreak);
router.get('/range', getDailyExercisesRange);
router.get('/:date', getDailyExercises);

module.exports = router;

