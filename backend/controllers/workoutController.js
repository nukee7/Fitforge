const Workout = require('../models/Workout');
const User = require('../models/User');
const Exercise = require('../models/Exercise');

// @desc    Get all workouts for a user
// @route   GET /api/v1/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    const userId = req.user.id;

    // Build filter object
    const filter = { user: userId };
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get workouts with pagination and populate exercise details
    const workouts = await Workout.find(filter)
      .populate('exercise', 'name category difficulty equipment muscleGroups primaryMuscle description')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Workout.countDocuments(filter);

    // Calculate stats
    const stats = await Workout.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalSets: { $sum: '$sets' },
          totalReps: { $sum: { $multiply: ['$sets', '$reps'] } },
          totalCalories: { $sum: '$calories' },
          totalVolume: { $sum: { $multiply: ['$sets', '$reps', '$weight'] } }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        workouts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        },
        stats: stats[0] || {
          totalWorkouts: 0,
          totalSets: 0,
          totalReps: 0,
          totalCalories: 0,
          totalVolume: 0
        }
      }
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get single workout
// @route   GET /api/v1/workouts/:id
// @access  Private
const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Create new workout
// @route   POST /api/v1/workouts
// @access  Private
const createWorkout = async (req, res) => {
  try {
    const { exerciseId, sets, reps, weight, duration, calories, notes, difficulty, date } = req.body;
    const userId = req.user.id;

    // Validate that the exercise exists
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }

    // Create workout with exercise reference
    const workoutData = {
      user: userId,
      exercise: exerciseId,
      exerciseName: exercise.name,
      category: exercise.category,
      sets,
      reps,
      weight,
      duration,
      calories,
      notes,
      difficulty,
      date: date || new Date()
    };

    const workout = await Workout.create(workoutData);

    // Populate exercise details for response
    await workout.populate('exercise', 'name category difficulty equipment muscleGroups primaryMuscle description');

    // Update user stats
    await updateUserStats(userId);

    res.status(201).json({
      status: 'success',
      message: 'Workout created successfully',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Update workout
// @route   PUT /api/v1/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    // Update user stats
    await updateUserStats(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Workout updated successfully',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Delete workout
// @route   DELETE /api/v1/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    // Update user stats
    await updateUserStats(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get workout statistics
// @route   GET /api/v1/workouts/stats
// @access  Private
const getWorkoutStats = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const userId = req.user.id;

    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get daily stats
    const dailyStats = await Workout.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          date: { $first: '$date' },
          workouts: { $sum: 1 },
          sets: { $sum: '$sets' },
          reps: { $sum: { $multiply: ['$sets', '$reps'] } },
          calories: { $sum: '$calories' },
          volume: { $sum: { $multiply: ['$sets', '$reps', '$weight'] } }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Get category breakdown
    const categoryStats = await Workout.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSets: { $sum: '$sets' },
          totalCalories: { $sum: '$calories' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get overall stats
    const overallStats = await Workout.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalSets: { $sum: '$sets' },
          totalReps: { $sum: { $multiply: ['$sets', '$reps'] } },
          totalCalories: { $sum: '$calories' },
          totalVolume: { $sum: { $multiply: ['$sets', '$reps', '$weight'] } },
          avgCaloriesPerWorkout: { $avg: '$calories' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        period,
        dateRange: { startDate, endDate },
        dailyStats,
        categoryStats,
        overallStats: overallStats[0] || {
          totalWorkouts: 0,
          totalSets: 0,
          totalReps: 0,
          totalCalories: 0,
          totalVolume: 0,
          avgCaloriesPerWorkout: 0
        }
      }
    });
  } catch (error) {
    console.error('Get workout stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Helper function to update user stats
const updateUserStats = async (userId) => {
  try {
    const stats = await Workout.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalSets: { $sum: '$sets' },
          totalReps: { $sum: { $multiply: ['$sets', '$reps'] } },
          totalCalories: { $sum: '$calories' }
        }
      }
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(userId, {
        'stats.totalWorkouts': stats[0].totalWorkouts,
        'stats.totalSets': stats[0].totalSets,
        'stats.totalReps': stats[0].totalReps,
        'stats.caloriesBurned': stats[0].totalCalories
      });
    }
  } catch (error) {
    console.error('Update user stats error:', error);
  }
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
};
