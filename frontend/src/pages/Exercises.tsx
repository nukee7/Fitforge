import { useState } from 'react';
import { Plus, Search, Dumbbell } from 'lucide-react';
import { Button } from '@/components/fitness/Button';
import { MainLayout } from '@/layouts/MainLayout';
import { toast } from 'sonner';

interface Exercise {
  id: number;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  muscleGroup: string;
  description: string;
}

const EXERCISES: Exercise[] = [
  { id: 1, name: 'Bench Press', category: 'Strength', difficulty: 'Intermediate', equipment: 'Barbell', muscleGroup: 'Chest', description: 'Compound exercise for chest, shoulders, and triceps' },
  { id: 2, name: 'Squats', category: 'Strength', difficulty: 'Intermediate', equipment: 'Barbell', muscleGroup: 'Legs', description: 'King of leg exercises, works entire lower body' },
  { id: 3, name: 'Deadlift', category: 'Strength', difficulty: 'Advanced', equipment: 'Barbell', muscleGroup: 'Back', description: 'Full body compound movement' },
  { id: 4, name: 'Pull-ups', category: 'Strength', difficulty: 'Intermediate', equipment: 'Pull-up Bar', muscleGroup: 'Back', description: 'Bodyweight back exercise' },
  { id: 5, name: 'Push-ups', category: 'Strength', difficulty: 'Beginner', equipment: 'Bodyweight', muscleGroup: 'Chest', description: 'Classic bodyweight chest exercise' },
  { id: 6, name: 'Shoulder Press', category: 'Strength', difficulty: 'Intermediate', equipment: 'Dumbbells', muscleGroup: 'Shoulders', description: 'Overhead pressing movement' },
  { id: 7, name: 'Bicep Curls', category: 'Strength', difficulty: 'Beginner', equipment: 'Dumbbells', muscleGroup: 'Arms', description: 'Isolated bicep exercise' },
  { id: 8, name: 'Tricep Dips', category: 'Strength', difficulty: 'Intermediate', equipment: 'Parallel Bars', muscleGroup: 'Arms', description: 'Compound tricep exercise' },
  { id: 9, name: 'Leg Press', category: 'Strength', difficulty: 'Beginner', equipment: 'Machine', muscleGroup: 'Legs', description: 'Leg strength builder' },
  { id: 10, name: 'Lat Pulldown', category: 'Strength', difficulty: 'Beginner', equipment: 'Cable Machine', muscleGroup: 'Back', description: 'Back width builder' },
  { id: 11, name: 'Plank', category: 'Core', difficulty: 'Beginner', equipment: 'Bodyweight', muscleGroup: 'Core', description: 'Isometric core strengthener' },
  { id: 12, name: 'Russian Twists', category: 'Core', difficulty: 'Intermediate', equipment: 'Medicine Ball', muscleGroup: 'Core', description: 'Oblique strengthening exercise' },
  { id: 13, name: 'Burpees', category: 'Cardio', difficulty: 'Advanced', equipment: 'Bodyweight', muscleGroup: 'Full Body', description: 'High-intensity full body exercise' },
  { id: 14, name: 'Running', category: 'Cardio', difficulty: 'Beginner', equipment: 'None', muscleGroup: 'Full Body', description: 'Cardiovascular endurance' },
  { id: 15, name: 'Jump Rope', category: 'Cardio', difficulty: 'Intermediate', equipment: 'Jump Rope', muscleGroup: 'Full Body', description: 'Cardio and coordination' },
  { id: 16, name: 'Mountain Climbers', category: 'Cardio', difficulty: 'Intermediate', equipment: 'Bodyweight', muscleGroup: 'Full Body', description: 'Dynamic cardio exercise' },
  { id: 17, name: 'Lunges', category: 'Strength', difficulty: 'Beginner', equipment: 'Bodyweight', muscleGroup: 'Legs', description: 'Unilateral leg exercise' },
  { id: 18, name: 'Cable Fly', category: 'Strength', difficulty: 'Intermediate', equipment: 'Cable Machine', muscleGroup: 'Chest', description: 'Isolated chest exercise' },
];

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = ['All', 'Strength', 'Cardio', 'Core'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = EXERCISES.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleAddToRoutine = (exercise: Exercise) => {
    toast.success(`${exercise.name} added to your routine!`);
  };

  const difficultyColors = {
    Beginner: 'from-success to-success',
    Intermediate: 'from-warning to-warning',
    Advanced: 'from-destructive to-destructive'
  };

  return (
    <MainLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-8 text-primary-foreground shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Dumbbell size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Exercise Library</h1>
            <p className="text-primary-foreground/80 text-lg">Discover {EXERCISES.length}+ exercises to enhance your routine</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat} Category</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff} Level</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing <span className="font-bold text-foreground">{filteredExercises.length}</span> exercises
        </p>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <div
            key={exercise.id}
            className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-lg mb-2">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Muscle Group</span>
                <span className="font-semibold text-foreground">{exercise.muscleGroup}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Equipment</span>
                <span className="font-semibold text-foreground">{exercise.equipment}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold">
                {exercise.category}
              </span>
              <span className={`px-3 py-1 bg-gradient-to-r ${difficultyColors[exercise.difficulty]} text-white rounded-lg text-xs font-semibold`}>
                {exercise.difficulty}
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => handleAddToRoutine(exercise)}
              className="w-full"
            >
              Add to Routine
            </Button>
          </div>
        ))}
      </div>
      </div>
    </MainLayout>
  );
};

export default Exercises;
