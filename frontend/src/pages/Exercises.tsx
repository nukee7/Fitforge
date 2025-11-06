import { useState, useEffect } from 'react';
import { Plus, Search, Dumbbell, Loader2 } from 'lucide-react';
import { Button } from '@/components/fitness/Button';
import { MainLayout } from '@/layouts/MainLayout';
import { toast } from 'sonner';
import { useExercises } from '@/hooks/useExercises';

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');

  // Use the custom hook to fetch exercises
  const {
    exercises: allExercises,
    loading,
    error,
    filters,
    setFilters
  } = useExercises({
    page: 1,
    limit: 50,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
    equipment: selectedEquipment !== 'All' ? selectedEquipment : undefined,
    muscleGroup: selectedMuscleGroup !== 'All' ? selectedMuscleGroup : undefined,
    search: searchTerm || undefined
  });

  // Get filter options from API response
  const categories = filters ? ['All', ...filters.categories] : ['All'];
  const difficulties = filters ? ['All', ...filters.difficulties] : ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const equipmentTypes = filters ? ['All', ...filters.equipmentTypes] : ['All'];
  const muscleGroups = filters ? ['All', ...filters.muscleGroups] : ['All'];

  // Update filters when user changes selections
  useEffect(() => {
    setFilters({
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
      equipment: selectedEquipment !== 'All' ? selectedEquipment : undefined,
      muscleGroup: selectedMuscleGroup !== 'All' ? selectedMuscleGroup : undefined,
      search: searchTerm || undefined
    });
  }, [selectedCategory, selectedDifficulty, selectedEquipment, selectedMuscleGroup, searchTerm, setFilters]);

  // Filter exercises based on search term (client-side filtering for better UX)
  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(muscle => 
                           muscle.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    return matchesSearch;
  });

  const handleAddToRoutine = (exercise: any) => {
    toast.success(`${exercise.name} added to your routine!`);
  };

  const difficultyColors = {
    Beginner: 'from-success to-success',
    Intermediate: 'from-warning to-warning',
    Advanced: 'from-destructive to-destructive'
  };

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading exercises...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

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
            <p className="text-primary-foreground/80 text-lg">Discover {filteredExercises.length}+ exercises to enhance your routine</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
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

          {/* Equipment Filter */}
          <div>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              {equipmentTypes.map(equipment => (
                <option key={equipment} value={equipment}>{equipment} Equipment</option>
              ))}
            </select>
          </div>

          {/* Muscle Group Filter */}
          <div>
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              {muscleGroups.map(muscle => (
                <option key={muscle} value={muscle}>{muscle} Muscle</option>
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
            key={exercise._id}
            className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-lg mb-2">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
              </div>
              {exercise.isPopular && (
                <div className="px-2 py-1 bg-warning/10 text-warning rounded-lg text-xs font-semibold">
                  Popular
                </div>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Primary Muscle</span>
                <span className="font-semibold text-foreground">{exercise.primaryMuscle}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Equipment</span>
                <span className="font-semibold text-foreground">{exercise.equipment}</span>
              </div>
              {exercise.muscleGroups.length > 1 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Muscle Groups</span>
                  <span className="font-semibold text-foreground text-xs">
                    {exercise.muscleGroups.slice(0, 2).join(', ')}
                    {exercise.muscleGroups.length > 2 && ` +${exercise.muscleGroups.length - 2}`}
                  </span>
                </div>
              )}
              {exercise.caloriesPerMinute > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Calories/min</span>
                  <span className="font-semibold text-foreground">{exercise.caloriesPerMinute}</span>
                </div>
              )}
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

      {/* No Results */}
      {filteredExercises.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No exercises found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSelectedEquipment('All');
              setSelectedMuscleGroup('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
      </div>
    </MainLayout>
  );
};

export default Exercises;
