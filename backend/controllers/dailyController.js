const Workout = require('../models/Workout');
const User = require('../models/User');

// @desc    Get daily exercise data for a specific date
// @route   GET /api/v1/daily/:date
// @access  Private
const getDailyExercises = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;

    // Parse the date (expecting YYYY-MM-DD format)
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Set start and end of the day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all workouts for the specific date
    const dailyWorkouts = await Workout.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: 1 });

    // Calculate daily totals
    const dailyTotals = dailyWorkouts.reduce((totals, workout) => {
      totals.totalExercises += 1;
      totals.totalSets += workout.sets;
      totals.totalReps += (workout.sets * workout.reps);
      totals.totalCalories += workout.calories;
      totals.totalVolume += (workout.sets * workout.reps * workout.weight);
      totals.totalDuration += workout.duration || 0;
      return totals;
    }, {
      totalExercises: 0,
      totalSets: 0,
      totalReps: 0,
      totalCalories: 0,
      totalVolume: 0,
      totalDuration: 0
    });

    // Group exercises by category
    const exercisesByCategory = dailyWorkouts.reduce((categories, workout) => {
      if (!categories[workout.category]) {
        categories[workout.category] = [];
      }
      categories[workout.category].push(workout);
      return categories;
    }, {});

    // Get exercise frequency (how many times each exercise was done)
    const exerciseFrequency = dailyWorkouts.reduce((freq, workout) => {
      const exerciseName = workout.exerciseName;
      if (!freq[exerciseName]) {
        freq[exerciseName] = {
          name: exerciseName,
          category: workout.category,
          count: 0,
          totalSets: 0,
          totalReps: 0,
          totalWeight: 0,
          totalCalories: 0
        };
      }
      freq[exerciseName].count += 1;
      freq[exerciseName].totalSets += workout.sets;
      freq[exerciseName].totalReps += (workout.sets * workout.reps);
      freq[exerciseName].totalWeight += (workout.sets * workout.reps * workout.weight);
      freq[exerciseName].totalCalories += workout.calories;
      return freq;
    }, {});

    res.status(200).json({
      status: 'success',
      data: {
        date: targetDate.toISOString().split('T')[0],
        summary: dailyTotals,
        workouts: dailyWorkouts,
        exercisesByCategory,
        exerciseFrequency: Object.values(exerciseFrequency),
        totalWorkouts: dailyWorkouts.length
      }
    });
  } catch (error) {
    console.error('Get daily exercises error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get daily exercise data for a date range
// @route   GET /api/v1/daily/range
// @access  Private
const getDailyExercisesRange = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const userId = req.user.id;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'startDate and endDate are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Set time boundaries
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Build aggregation pipeline based on groupBy
    let groupStage;
    switch (groupBy) {
      case 'day':
        groupStage = {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          date: { $first: '$date' }
        };
        break;
      case 'week':
        groupStage = {
          _id: {
            year: { $year: '$date' },
            week: { $week: '$date' }
          },
          date: { $first: '$date' }
        };
        break;
      case 'month':
        groupStage = {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          date: { $first: '$date' }
        };
        break;
      default:
        groupStage = {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          date: { $first: '$date' }
        };
    }

    // Get aggregated daily data
    const dailyData = await Workout.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          ...groupStage,
          totalExercises: { $sum: 1 },
          totalSets: { $sum: '$sets' },
          totalReps: { $sum: { $multiply: ['$sets', '$reps'] } },
          totalCalories: { $sum: '$calories' },
          totalVolume: { $sum: { $multiply: ['$sets', '$reps', '$weight'] } },
          totalDuration: { $sum: '$duration' },
          exercises: { $push: '$exerciseName' },
          categories: { $addToSet: '$category' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Get most frequent exercises in the period
    const frequentExercises = await Workout.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$exerciseName',
          count: { $sum: 1 },
          category: { $first: '$category' },
          totalSets: { $sum: '$sets' },
          totalReps: { $sum: { $multiply: ['$sets', '$reps'] } },
          totalCalories: { $sum: '$calories' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get category breakdown for the period
    const categoryBreakdown = await Workout.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSets: { $sum: '$sets' },
          totalCalories: { $sum: '$calories' },
          avgCaloriesPerWorkout: { $avg: '$calories' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        period: {
          startDate: startDate,
          endDate: endDate,
          groupBy
        },
        dailyData,
        frequentExercises,
        categoryBreakdown,
        summary: {
          totalDays: dailyData.length,
          totalExercises: dailyData.reduce((sum, day) => sum + day.totalExercises, 0),
          totalSets: dailyData.reduce((sum, day) => sum + day.totalSets, 0),
          totalReps: dailyData.reduce((sum, day) => sum + day.totalReps, 0),
          totalCalories: dailyData.reduce((sum, day) => sum + day.totalCalories, 0),
          totalVolume: dailyData.reduce((sum, day) => sum + day.totalVolume, 0)
        }
      }
    });
  } catch (error) {
    console.error('Get daily exercises range error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get today's exercises
// @route   GET /api/v1/daily/today
// @access  Private
const getTodayExercises = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    
    // Set start and end of today
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Get today's workouts
    const todayWorkouts = await Workout.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: 1 });

    // Calculate today's totals
    const todayTotals = todayWorkouts.reduce((totals, workout) => {
      totals.totalExercises += 1;
      totals.totalSets += workout.sets;
      totals.totalReps += (workout.sets * workout.reps);
      totals.totalCalories += workout.calories;
      totals.totalVolume += (workout.sets * workout.reps * workout.weight);
      totals.totalDuration += workout.duration || 0;
      return totals;
    }, {
      totalExercises: 0,
      totalSets: 0,
      totalReps: 0,
      totalCalories: 0,
      totalVolume: 0,
      totalDuration: 0
    });

    // Get unique exercises done today
    const uniqueExercises = [...new Set(todayWorkouts.map(w => w.exerciseName))];

    // Get categories worked today
    const categoriesWorked = [...new Set(todayWorkouts.map(w => w.category))];

    res.status(200).json({
      status: 'success',
      data: {
        date: today.toISOString().split('T')[0],
        summary: todayTotals,
        workouts: todayWorkouts,
        uniqueExercises,
        categoriesWorked,
        totalWorkouts: todayWorkouts.length,
        isWorkoutDay: todayWorkouts.length > 0
      }
    });
  } catch (error) {
    console.error('Get today exercises error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get exercise streak data
// @route   GET /api/v1/daily/streak
// @access  Private
const getExerciseStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    
    // Get last 30 days of workout data
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const workoutDays = await Workout.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: thirtyDaysAgo }
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
          exerciseCount: { $sum: 1 },
          totalCalories: { $sum: '$calories' }
        }
      },
      { $sort: { date: -1 } }
    ]);

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const todayStr = today.toISOString().split('T')[0];
    const workoutDates = workoutDays.map(day => day.date.toISOString().split('T')[0]);
    
    // Check if today has workouts
    const hasWorkoutToday = workoutDates.includes(todayStr);
    
    // Calculate streaks
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (workoutDates.includes(dateStr)) {
        if (i === 0 || (i > 0 && workoutDates.includes(new Date(checkDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]))) {
          tempStreak++;
          if (i === 0) currentStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        currentStreak,
        longestStreak,
        hasWorkoutToday,
        workoutDays: workoutDays.length,
        last30Days: workoutDays,
        streakGoal: 7 // Can be made configurable
      }
    });
  } catch (error) {
    console.error('Get exercise streak error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = {
  getDailyExercises,
  getDailyExercisesRange,
  getTodayExercises,
  getExerciseStreak
};

