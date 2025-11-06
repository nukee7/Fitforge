const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: [true, 'Exercise reference is required']
  },
  // Keep exercise name for quick access (denormalized)
  exerciseName: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
    maxlength: [100, 'Exercise name cannot be more than 100 characters']
  },
  // Keep category for quick access (denormalized)
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Strength', 'Cardio', 'Core', 'Flexibility', 'Balance']
  },
  sets: {
    type: Number,
    required: [true, 'Number of sets is required'],
    min: [1, 'Sets must be at least 1'],
    max: [50, 'Sets cannot be more than 50']
  },
  reps: {
    type: Number,
    required: [true, 'Number of reps is required'],
    min: [1, 'Reps must be at least 1'],
    max: [1000, 'Reps cannot be more than 1000']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight cannot be negative'],
    max: [1000, 'Weight cannot be more than 1000kg']
  },
  duration: {
    type: Number, // in minutes
    min: [0, 'Duration cannot be negative'],
    max: [480, 'Duration cannot be more than 8 hours']
  },
  calories: {
    type: Number,
    required: [true, 'Calories burned is required'],
    min: [0, 'Calories cannot be negative'],
    max: [2000, 'Calories cannot be more than 2000 per workout']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  date: {
    type: Date,
    required: [true, 'Workout date is required'],
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, category: 1 });
workoutSchema.index({ date: -1 });

// Virtual for total volume (sets * reps * weight)
workoutSchema.virtual('totalVolume').get(function() {
  return this.sets * this.reps * this.weight;
});

// Ensure virtual fields are serialized
workoutSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Workout', workoutSchema);
