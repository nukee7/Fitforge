const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

// @desc    Add exercise to user's workout
// @route   POST /api/v1/user-workouts/add-exercise
// @access  Private
const addExerciseToWorkout = async (req, res) => {
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

    // Create workout entry
    const workoutData = {
      user: userId,
      exercise: exerciseId,
      exerciseName: exercise.name,
      category: exercise.category,
      sets: sets || 1,
      reps: reps || 10,
      weight: weight || 0,
      duration: duration || 0,
      calories: calories || 0,
      notes: notes || '',
      difficulty: difficulty || 'Medium',
      date: date ? new Date(date) : new Date()
    };

    const workout = await Workout.create(workoutData);

    // Populate exercise details for response
    await workout.populate('exercise', 'name category difficulty equipment muscleGroups primaryMuscle description');

    // Update user stats
    await updateUserStats(userId);

    res.status(201).json({
      status: 'success',
      message: 'Exercise added to workout successfully',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Add exercise to workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get user's workout history
// @route   GET /api/v1/user-workouts
// @access  Private
const getUserWorkouts = async (req, res) => {
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

    // Get workouts with exercise details
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
    console.error('Get user workouts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get available exercises for user to choose from
// @route   GET /api/v1/user-workouts/available-exercises
// @access  Private
const getAvailableExercises = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      difficulty, 
      equipment, 
      muscleGroup,
      search 
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (equipment) {
      filter.equipment = equipment;
    }
    
    if (muscleGroup) {
      filter.muscleGroups = muscleGroup;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get exercises
    const exercises = await Exercise.find(filter)
      .select('name category difficulty equipment muscleGroups primaryMuscle description caloriesPerMinute isPopular')
      .sort({ isPopular: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Exercise.countDocuments(filter);

    // Get filter options
    const categories = await Exercise.distinct('category', { isActive: true });
    const difficulties = await Exercise.distinct('difficulty', { isActive: true });
    const equipmentTypes = await Exercise.distinct('equipment', { isActive: true });
    const muscleGroups = await Exercise.distinct('muscleGroups', { isActive: true });

    res.status(200).json({
      status: 'success',
      data: {
        exercises,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        },
        filters: {
          categories,
          difficulties,
          equipmentTypes,
          muscleGroups
        }
      }
    });
  } catch (error) {
    console.error('Get available exercises error:', error);
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
          caloriesBurned: { $sum: '$calories' }
        }
      }
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(userId, {
        'stats.totalWorkouts': stats[0].totalWorkouts,
        'stats.totalSets': stats[0].totalSets,
        'stats.totalReps': stats[0].totalReps,
        'stats.caloriesBurned': stats[0].caloriesBurned
      });
    }
  } catch (error) {
    console.error('Update user stats error:', error);
  }
};

module.exports = {
  addExerciseToWorkout,
  getUserWorkouts,
  getAvailableExercises
};
