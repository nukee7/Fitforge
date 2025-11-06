const Exercise = require('../models/Exercise');

// @desc    Get all exercises
// @route   GET /api/v1/exercises
// @access  Public
const getExercises = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      difficulty, 
      equipment, 
      muscleGroup,
      search,
      popular 
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
    
    if (popular === 'true') {
      filter.isPopular = true;
    }

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { muscleGroups: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Combine filters
    const finalFilter = { ...filter, ...searchQuery };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get exercises with pagination
    const exercises = await Exercise.find(finalFilter)
      .sort({ isPopular: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Exercise.countDocuments(finalFilter);

    // Get unique values for filters
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
    console.error('Get exercises error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get single exercise
// @route   GET /api/v1/exercises/:id
// @access  Public
const getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!exercise) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        exercise
      }
    });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Create new exercise (Admin only)
// @route   POST /api/v1/exercises
// @access  Private/Admin
const createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Exercise created successfully',
      data: {
        exercise
      }
    });
  } catch (error) {
    console.error('Create exercise error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Exercise with this name already exists'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Update exercise (Admin only)
// @route   PUT /api/v1/exercises/:id
// @access  Private/Admin
const updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!exercise) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Exercise updated successfully',
      data: {
        exercise
      }
    });
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Delete exercise (Admin only)
// @route   DELETE /api/v1/exercises/:id
// @access  Private/Admin
const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!exercise) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get exercise categories
// @route   GET /api/v1/exercises/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Exercise.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get popular exercises
// @route   GET /api/v1/exercises/popular
// @access  Public
const getPopularExercises = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const exercises = await Exercise.find({
      isActive: true,
      isPopular: true
    })
    .sort({ name: 1 })
    .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        exercises
      }
    });
  } catch (error) {
    console.error('Get popular exercises error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  getCategories,
  getPopularExercises
};
