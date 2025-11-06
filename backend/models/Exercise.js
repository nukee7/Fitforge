const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Exercise name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Strength', 'Cardio', 'Core', 'Flexibility', 'Balance']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  equipment: {
    type: String,
    required: [true, 'Equipment is required'],
    enum: ['Bodyweight', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Bands', 'Machine', 'Cable Machine', 'Pull-up Bar', 'Parallel Bars', 'Medicine Ball', 'Jump Rope', 'None']
  },
  muscleGroups: [{
    type: String,
    required: true,
    enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Glutes', 'Calves', 'Forearms', 'Full Body']
  }],
  primaryMuscle: {
    type: String,
    required: [true, 'Primary muscle group is required'],
    enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Glutes', 'Calves', 'Forearms', 'Full Body']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true,
      maxlength: [500, 'Instruction cannot be more than 500 characters']
    }
  }],
  tips: [{
    type: String,
    maxlength: [300, 'Tip cannot be more than 300 characters']
  }],
  variations: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  caloriesPerMinute: {
    type: Number,
    min: [0, 'Calories per minute cannot be negative'],
    max: [50, 'Calories per minute cannot be more than 50']
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
exerciseSchema.index({ name: 'text', description: 'text' });
exerciseSchema.index({ category: 1, difficulty: 1 });
exerciseSchema.index({ muscleGroups: 1 });
exerciseSchema.index({ equipment: 1 });
exerciseSchema.index({ isPopular: 1, isActive: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
