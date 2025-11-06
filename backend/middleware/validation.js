const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  body('weight')
    .optional()
    .isFloat({ min: 20, max: 300 })
    .withMessage('Weight must be between 20 and 300 kg'),
  body('height')
    .optional()
    .isInt({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('fitnessLevel')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Fitness level must be Beginner, Intermediate, or Advanced'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  body('weight')
    .optional()
    .isFloat({ min: 20, max: 300 })
    .withMessage('Weight must be between 20 and 300 kg'),
  body('height')
    .optional()
    .isInt({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('fitnessLevel')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Fitness level must be Beginner, Intermediate, or Advanced'),
  body('goals')
    .optional()
    .isArray()
    .withMessage('Goals must be an array'),
  body('goals.*')
    .optional()
    .isIn(['Weight Loss', 'Muscle Gain', 'Endurance', 'Strength', 'General Fitness'])
    .withMessage('Invalid goal type'),
  handleValidationErrors
];

// Workout validation rules
const validateWorkout = [
  body('exerciseName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Exercise name must be between 1 and 100 characters'),
  body('category')
    .isIn(['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'])
    .withMessage('Invalid category'),
  body('sets')
    .isInt({ min: 1, max: 50 })
    .withMessage('Sets must be between 1 and 50'),
  body('reps')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Reps must be between 1 and 1000'),
  body('weight')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Weight must be between 0 and 1000 kg'),
  body('calories')
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Calories must be between 0 and 2000'),
  body('duration')
    .optional()
    .isInt({ min: 0, max: 480 })
    .withMessage('Duration must be between 0 and 480 minutes'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot be more than 500 characters'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  handleValidationErrors
];

// Exercise validation rules
const validateExercise = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Exercise name must be between 1 and 100 characters'),
  body('category')
    .isIn(['Strength', 'Cardio', 'Core', 'Flexibility', 'Balance'])
    .withMessage('Invalid category'),
  body('difficulty')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
  body('equipment')
    .isIn(['Bodyweight', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Bands', 'Machine', 'Cable Machine', 'Pull-up Bar', 'Parallel Bars', 'Medicine Ball', 'Jump Rope', 'None'])
    .withMessage('Invalid equipment type'),
  body('muscleGroups')
    .isArray({ min: 1 })
    .withMessage('At least one muscle group is required'),
  body('muscleGroups.*')
    .isIn(['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Glutes', 'Calves', 'Forearms', 'Full Body'])
    .withMessage('Invalid muscle group'),
  body('primaryMuscle')
    .isIn(['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Glutes', 'Calves', 'Forearms', 'Full Body'])
    .withMessage('Invalid primary muscle group'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  handleValidationErrors
];

// Parameter validation
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateWorkout,
  validateExercise,
  validateObjectId,
  validatePagination
};
