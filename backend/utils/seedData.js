require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');

const exercises = [
  {
    name: 'Push-ups',
    description: 'A classic upper body exercise that works the chest, shoulders, and triceps. Great for building upper body strength and can be done anywhere.',
    category: 'Strength',
    difficulty: 'Beginner',
    equipment: 'None',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    primaryMuscle: 'Chest',
    instructions: [
      { step: 1, instruction: 'Start in a plank position with hands slightly wider than shoulder-width apart' },
      { step: 2, instruction: 'Lower your body until your chest nearly touches the floor' },
      { step: 3, instruction: 'Push back up to the starting position' },
      { step: 4, instruction: 'Repeat for desired number of repetitions' }
    ],
    tips: [
      'Keep your core engaged throughout the movement',
      'Maintain a straight line from head to heels',
      'Don\'t let your hips sag or pike up'
    ],
    variations: [
      { name: 'Knee Push-ups', description: 'Perform push-ups with knees on the ground for reduced difficulty' },
      { name: 'Diamond Push-ups', description: 'Place hands close together in diamond shape to target triceps more' }
    ],
    caloriesPerMinute: 7,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Squats',
    description: 'Fundamental lower body exercise targeting quads, glutes, and hamstrings. Essential for leg strength and functional movement.',
    category: 'Strength',
    difficulty: 'Beginner',
    equipment: 'None',
    muscleGroups: ['Legs', 'Glutes', 'Core'],
    primaryMuscle: 'Legs',
    instructions: [
      { step: 1, instruction: 'Stand with feet shoulder-width apart, toes slightly pointed out' },
      { step: 2, instruction: 'Lower your body by bending knees and pushing hips back' },
      { step: 3, instruction: 'Keep chest up and back straight throughout the movement' },
      { step: 4, instruction: 'Return to starting position by driving through your heels' }
    ],
    tips: [
      'Keep your weight on your heels',
      'Don\'t let knees cave inward',
      'Go as low as comfortable while maintaining form'
    ],
    variations: [
      { name: 'Jump Squats', description: 'Add an explosive jump at the top for cardio and power' },
      { name: 'Goblet Squats', description: 'Hold a weight at chest level for added resistance' }
    ],
    caloriesPerMinute: 8,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Plank',
    description: 'Isometric core exercise that builds endurance and stability throughout your entire core and shoulders.',
    category: 'Core',
    difficulty: 'Beginner',
    equipment: 'None',
    muscleGroups: ['Core', 'Shoulders'],
    primaryMuscle: 'Core',
    instructions: [
      { step: 1, instruction: 'Start in a forearm plank position with elbows under shoulders' },
      { step: 2, instruction: 'Keep your body in a straight line from head to heels' },
      { step: 3, instruction: 'Engage your core and hold the position' },
      { step: 4, instruction: 'Breathe steadily throughout the hold' }
    ],
    tips: [
      'Don\'t hold your breath',
      'Keep hips level, don\'t let them sag or pike',
      'Focus on quality over duration'
    ],
    variations: [
      { name: 'Side Plank', description: 'Turn to your side, supporting on one forearm' },
      { name: 'Plank with Shoulder Taps', description: 'Alternate tapping opposite shoulders while holding plank' }
    ],
    caloriesPerMinute: 5,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Lunges',
    description: 'Unilateral leg exercise that improves balance, leg strength, and coordination.',
    category: 'Strength',
    difficulty: 'Beginner',
    equipment: 'None',
    muscleGroups: ['Legs', 'Glutes'],
    primaryMuscle: 'Legs',
    instructions: [
      { step: 1, instruction: 'Stand tall with feet hip-width apart' },
      { step: 2, instruction: 'Step forward with one leg and lower your hips' },
      { step: 3, instruction: 'Lower until both knees are bent at approximately 90 degrees' },
      { step: 4, instruction: 'Push back to starting position and alternate legs' }
    ],
    tips: [
      'Keep your torso upright',
      'Don\'t let front knee extend past toes',
      'Push through your front heel to return'
    ],
    variations: [
      { name: 'Reverse Lunges', description: 'Step backward instead of forward' },
      { name: 'Walking Lunges', description: 'Continue moving forward with each lunge' }
    ],
    caloriesPerMinute: 6,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Burpees',
    description: 'Full-body cardio exercise combining squat, plank, and jump for maximum calorie burn and conditioning.',
    category: 'Cardio',
    difficulty: 'Intermediate',
    equipment: 'None',
    muscleGroups: ['Full Body', 'Core', 'Legs'],
    primaryMuscle: 'Full Body',
    instructions: [
      { step: 1, instruction: 'Start standing, then squat down and place hands on floor' },
      { step: 2, instruction: 'Jump feet back into a plank position' },
      { step: 3, instruction: 'Perform a push-up (optional)' },
      { step: 4, instruction: 'Jump feet back to hands and explosively jump up' }
    ],
    tips: [
      'Land softly to protect your joints',
      'Maintain core engagement throughout',
      'Modify by stepping back instead of jumping'
    ],
    variations: [
      { name: 'Half Burpees', description: 'Skip the push-up for reduced intensity' },
      { name: 'Burpee Box Jumps', description: 'Jump onto a box instead of straight up' }
    ],
    caloriesPerMinute: 12,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Mountain Climbers',
    description: 'Dynamic cardio exercise that combines core work with cardiovascular conditioning.',
    category: 'Cardio',
    difficulty: 'Intermediate',
    equipment: 'None',
    muscleGroups: ['Core', 'Shoulders', 'Legs'],
    primaryMuscle: 'Core',
    instructions: [
      { step: 1, instruction: 'Start in a high plank position with hands under shoulders' },
      { step: 2, instruction: 'Bring one knee toward your chest' },
      { step: 3, instruction: 'Quickly switch legs in a running motion' },
      { step: 4, instruction: 'Continue alternating at a steady pace' }
    ],
    tips: [
      'Keep hips level throughout',
      'Don\'t bounce your body up and down',
      'Start slow and build up speed'
    ],
    variations: [
      { name: 'Cross-body Mountain Climbers', description: 'Bring knee toward opposite elbow' },
      { name: 'Slow Mountain Climbers', description: 'Perform slowly with more control' }
    ],
    caloriesPerMinute: 10,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Deadlift',
    description: 'Compound exercise targeting posterior chain muscles. One of the best exercises for overall strength.',
    category: 'Strength',
    difficulty: 'Advanced',
    equipment: 'Barbell',
    muscleGroups: ['Back', 'Glutes', 'Legs'],
    primaryMuscle: 'Back',
    instructions: [
      { step: 1, instruction: 'Stand with feet hip-width apart, barbell over mid-foot' },
      { step: 2, instruction: 'Bend at hips and knees to grip the bar' },
      { step: 3, instruction: 'Keep back straight and lift bar by extending hips and knees' },
      { step: 4, instruction: 'Lower bar back to ground with control' }
    ],
    tips: [
      'Keep the bar close to your body',
      'Engage your lats throughout the lift',
      'Don\'t round your back'
    ],
    variations: [
      { name: 'Romanian Deadlift', description: 'Focus on hip hinge with slight knee bend' },
      { name: 'Sumo Deadlift', description: 'Use a wider stance with toes pointed out' }
    ],
    caloriesPerMinute: 8,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Bench Press',
    description: 'Classic chest exercise performed on a bench with a barbell. King of upper body pressing movements.',
    category: 'Strength',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    primaryMuscle: 'Chest',
    instructions: [
      { step: 1, instruction: 'Lie on bench with feet flat on floor' },
      { step: 2, instruction: 'Grip barbell slightly wider than shoulder-width' },
      { step: 3, instruction: 'Lower bar to mid-chest with control' },
      { step: 4, instruction: 'Press back up to starting position' }
    ],
    tips: [
      'Keep shoulder blades retracted',
      'Maintain slight arch in lower back',
      'Use a spotter for heavy weights'
    ],
    variations: [
      { name: 'Incline Bench Press', description: 'Perform on an inclined bench to target upper chest' },
      { name: 'Dumbbell Bench Press', description: 'Use dumbbells for greater range of motion' }
    ],
    caloriesPerMinute: 7,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Pull-ups',
    description: 'Upper body pulling exercise targeting back and biceps. Excellent for building a strong back.',
    category: 'Strength',
    difficulty: 'Advanced',
    equipment: 'Pull-up Bar',
    muscleGroups: ['Back', 'Biceps', 'Shoulders'],
    primaryMuscle: 'Back',
    instructions: [
      { step: 1, instruction: 'Hang from bar with overhand grip, hands shoulder-width apart' },
      { step: 2, instruction: 'Pull yourself up until chin is over the bar' },
      { step: 3, instruction: 'Lower back down with control to full arm extension' },
      { step: 4, instruction: 'Repeat for desired repetitions' }
    ],
    tips: [
      'Avoid swinging or using momentum',
      'Pull with your back, not just arms',
      'Full range of motion is important'
    ],
    variations: [
      { name: 'Chin-ups', description: 'Use underhand grip to emphasize biceps' },
      { name: 'Assisted Pull-ups', description: 'Use resistance band or machine for assistance' }
    ],
    caloriesPerMinute: 9,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Jumping Jacks',
    description: 'Simple cardio exercise that increases heart rate and warms up the entire body.',
    category: 'Cardio',
    difficulty: 'Beginner',
    equipment: 'None',
    muscleGroups: ['Full Body'],
    primaryMuscle: 'Full Body',
    instructions: [
      { step: 1, instruction: 'Start with feet together and arms at your sides' },
      { step: 2, instruction: 'Jump while spreading legs and raising arms overhead' },
      { step: 3, instruction: 'Jump back to starting position' },
      { step: 4, instruction: 'Repeat at a steady, continuous pace' }
    ],
    tips: [
      'Land softly on balls of feet',
      'Keep movements smooth and controlled',
      'Breathe rhythmically'
    ],
    variations: [
      { name: 'Star Jumps', description: 'Jump higher and spread limbs wider' },
      { name: 'Low-Impact Jacks', description: 'Step side to side instead of jumping' }
    ],
    caloriesPerMinute: 8,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Bicycle Crunches',
    description: 'Core exercise that effectively targets obliques and rectus abdominis.',
    category: 'Core',
    difficulty: 'Intermediate',
    equipment: 'None',
    muscleGroups: ['Core'],
    primaryMuscle: 'Core',
    instructions: [
      { step: 1, instruction: 'Lie on your back with hands behind head' },
      { step: 2, instruction: 'Bring one knee toward chest while rotating opposite elbow to meet it' },
      { step: 3, instruction: 'Switch sides in a pedaling motion' },
      { step: 4, instruction: 'Keep core engaged throughout the movement' }
    ],
    tips: [
      'Don\'t pull on your neck',
      'Focus on rotating your torso, not just moving arms',
      'Keep lower back pressed to floor'
    ],
    variations: [
      { name: 'Slow Bicycle Crunches', description: 'Perform slowly with 2-second holds' },
      { name: 'Extended Bicycle Crunches', description: 'Extend legs further for more difficulty' }
    ],
    caloriesPerMinute: 6,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Dumbbell Rows',
    description: 'Back exercise performed with dumbbells that builds thickness and strength in the back.',
    category: 'Strength',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells',
    muscleGroups: ['Back', 'Biceps'],
    primaryMuscle: 'Back',
    instructions: [
      { step: 1, instruction: 'Place one knee and hand on bench for support' },
      { step: 2, instruction: 'Hold dumbbell in opposite hand with arm extended' },
      { step: 3, instruction: 'Pull dumbbell to hip, keeping elbow close to body' },
      { step: 4, instruction: 'Lower with control and repeat, then switch sides' }
    ],
    tips: [
      'Keep back parallel to ground',
      'Pull with your back, not your arm',
      'Squeeze shoulder blade at the top'
    ],
    variations: [
      { name: 'Bent-Over Rows', description: 'Perform standing, bent at hips with both dumbbells' },
      { name: 'Renegade Rows', description: 'Perform in plank position, alternating arms' }
    ],
    caloriesPerMinute: 6,
    isPopular: false,
    isActive: true
  },
  {
    name: 'Russian Twists',
    description: 'Rotational core exercise that targets obliques and improves rotational strength.',
    category: 'Core',
    difficulty: 'Intermediate',
    equipment: 'None',
    muscleGroups: ['Core'],
    primaryMuscle: 'Core',
    instructions: [
      { step: 1, instruction: 'Sit with knees bent and feet lifted off ground' },
      { step: 2, instruction: 'Lean back slightly and clasp hands together' },
      { step: 3, instruction: 'Rotate torso from side to side' },
      { step: 4, instruction: 'Touch hands to ground beside each hip' }
    ],
    tips: [
      'Keep chest up and back straight',
      'Move with control, not momentum',
      'Breathe naturally throughout'
    ],
    variations: [
      { name: 'Weighted Russian Twists', description: 'Hold a medicine ball or dumbbell' },
      { name: 'Feet-Down Russian Twists', description: 'Keep feet on ground for easier version' }
    ],
    caloriesPerMinute: 6,
    isPopular: false,
    isActive: true
  },
  {
    name: 'Shoulder Press',
    description: 'Overhead pressing movement that builds shoulder strength and stability.',
    category: 'Strength',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells',
    muscleGroups: ['Shoulders', 'Triceps'],
    primaryMuscle: 'Shoulders',
    instructions: [
      { step: 1, instruction: 'Stand or sit with dumbbells at shoulder height' },
      { step: 2, instruction: 'Press weights overhead until arms are fully extended' },
      { step: 3, instruction: 'Lower back to shoulder height with control' },
      { step: 4, instruction: 'Repeat for desired repetitions' }
    ],
    tips: [
      'Keep core engaged to protect lower back',
      'Don\'t arch your back excessively',
      'Press straight up, not forward'
    ],
    variations: [
      { name: 'Arnold Press', description: 'Rotate palms during the press' },
      { name: 'Single-Arm Press', description: 'Press one arm at a time for core challenge' }
    ],
    caloriesPerMinute: 7,
    isPopular: false,
    isActive: true
  },
  {
    name: 'Leg Press',
    description: 'Machine-based lower body exercise that allows for heavy loading with reduced spinal stress.',
    category: 'Strength',
    difficulty: 'Beginner',
    equipment: 'Machine',
    muscleGroups: ['Legs', 'Glutes'],
    primaryMuscle: 'Legs',
    instructions: [
      { step: 1, instruction: 'Sit in leg press machine with feet on platform' },
      { step: 2, instruction: 'Release safety and lower weight by bending knees' },
      { step: 3, instruction: 'Push back up without locking knees completely' },
      { step: 4, instruction: 'Control the movement throughout the entire range' }
    ],
    tips: [
      'Keep lower back against the pad',
      'Don\'t let knees cave inward',
      'Use full range of motion'
    ],
    variations: [
      { name: 'Single-Leg Press', description: 'Press with one leg at a time' },
      { name: 'High-Foot Placement', description: 'Place feet higher on platform to target glutes more' }
    ],
    caloriesPerMinute: 7,
    isPopular: false,
    isActive: true
  }
];

const seedExercises = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('🗑️  Cleared existing exercises');

    // Insert seed data
    const result = await Exercise.insertMany(exercises);
    console.log(`✅ Successfully seeded ${result.length} exercises`);

    // Show summary
    const categories = await Exercise.distinct('category');
    const difficulties = await Exercise.distinct('difficulty');
    const equipmentTypes = await Exercise.distinct('equipment');
    
    console.log('\n📊 Summary:');
    console.log(`Categories: ${categories.join(', ')}`);
    console.log(`Difficulties: ${difficulties.join(', ')}`);
    console.log(`Equipment Types: ${equipmentTypes.join(', ')}`);
    console.log(`Popular exercises: ${result.filter(e => e.isPopular).length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedExercises();