import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Activity, Flame, Plus, Search, BarChart3, Trophy, Zap, Calendar, Dumbbell, Loader2, Clock, Repeat, ChevronLeft, ChevronRight, X, Edit2, Star } from 'lucide-react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useExercises } from '@/hooks/useExercises';
import { StatCard } from './StatCard';
import { QuickActionCard } from './QuickActionCard';
import { DayWorkoutCard } from './DayWorkoutCard';
import { AchievementBadge } from './AchievementBadge';
import { Button } from './Button';

export function DashboardView() {
  const { state, dispatch } = useWorkout();
  const [greeting, setGreeting] = useState('');
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [weeklyRoutine, setWeeklyRoutine] = useState<Record<number, any[]>>({
    0: [], // Monday
    1: [], // Tuesday
    2: [], // Wednesday
    3: [], // Thursday
    4: [], // Friday
    5: [], // Saturday
    6: []  // Sunday
  });
  
  // Fetch exercises from backend
  const {
    exercises: allExercises,
    loading: exercisesLoading,
    error: exercisesError
  } = useExercises({
    page: 1,
    limit: 50
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    // Initialize routine with some exercises for demo
    if (allExercises.length > 0 && Object.values(weeklyRoutine).every(day => day.length === 0)) {
      const initialRoutine: Record<number, any[]> = {
        0: allExercises.slice(0, 2),
        1: allExercises.slice(2, 4),
        2: allExercises.slice(4, 6),
        3: allExercises.slice(6, 8),
        4: allExercises.slice(8, 10),
        5: [],
        6: []
      };
      setWeeklyRoutine(initialRoutine);
    }
  }, [allExercises]);

  const handlePreviousDay = () => {
    setCurrentDayIndex((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prev) => (prev === 6 ? 0 : prev + 1));
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleAddExerciseToDay = (exercise: any) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [currentDayIndex]: [...prev[currentDayIndex], exercise]
    }));
    setShowExerciseModal(false);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [currentDayIndex]: prev[currentDayIndex].filter(ex => ex._id !== exerciseId)
    }));
  };

  // Group workouts by date
  const workoutsByDate: Record<string, typeof state.workouts> = {};
  state.workouts.forEach(workout => {
    const dateKey = new Date(workout.date).toDateString();
    if (!workoutsByDate[dateKey]) {
      workoutsByDate[dateKey] = [];
    }
    workoutsByDate[dateKey].push(workout);
  });

  // Get last 3 days
  const last3Days = [];
  for (let i = 2; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last3Days.unshift(date.toDateString());
  }

  // Show loading state for exercises
  if (exercisesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-[hsl(217,91%,50%)] to-accent rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-foreground/80 mb-2 font-medium">{greeting}</p>
              <h1 className="text-4xl font-bold mb-2">Ready to Forge Your Fitness?</h1>
              <p className="text-primary-foreground/90 text-lg">Let's make today count! 💪</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Trophy size={20} className="text-[hsl(45,93%,70%)]" />
                <span className="font-semibold">Current Streak</span>
              </div>
              <p className="text-3xl font-bold">12 Days</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Target size={20} className="text-[hsl(158,64%,72%)]" />
                <span className="font-semibold">Weekly Goal</span>
              </div>
              <p className="text-3xl font-bold">3/4 Days</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Zap size={20} className="text-[hsl(31,97%,72%)]" />
                <span className="font-semibold">Energy Level</span>
              </div>
              <p className="text-3xl font-bold">High 🔥</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Routine - Day Wise Slider */}
      <div className="bg-gradient-to-br from-primary to-[hsl(217,91%,60%)] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={24} />
            <h3 className="font-bold text-xl">Weekly Routine</h3>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            icon={isEditMode ? X : Edit2}
            onClick={handleToggleEditMode}
          >
            {isEditMode ? 'Done' : 'Edit Routine'}
          </Button>
        </div>
        
        {allExercises && allExercises.length > 0 ? (
          <div className="relative">
            {/* Navigation Arrows */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePreviousDay}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-white/20"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="text-center">
                <h4 className="text-lg font-bold">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][currentDayIndex]}
                </h4>
                <p className="text-xs text-primary-foreground/70">
                  {currentDayIndex === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) ? 'Today' : ''}
                </p>
              </div>
              
              <button
                onClick={handleNextDay}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-white/20"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day Content with Slide Animation */}
            <div className="overflow-hidden">
              <div 
                className="transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(0%)` }}
              >
                {(() => {
                  const dayExercises = weeklyRoutine[currentDayIndex] || [];
                  const isToday = currentDayIndex === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                  
                  return (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-primary-foreground/70">
                          {dayExercises.length} exercise{dayExercises.length !== 1 ? 's' : ''} planned
                        </span>
                        {isToday && (
                          <span className="px-3 py-1 bg-white/30 rounded-full text-xs font-semibold">
                            Today's Workout
                          </span>
                        )}
                      </div>
                      
                      {dayExercises.length > 0 ? (
                        <div className="space-y-3">
                          {dayExercises.map((exercise) => (
                            <div key={exercise._id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors relative group">
                              {isEditMode && (
                                <button
                                  onClick={() => handleRemoveExercise(exercise._id)}
                                  className="absolute top-2 right-2 w-6 h-6 bg-destructive hover:bg-destructive/80 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <X size={14} />
                                </button>
                              )}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-base mb-1">{exercise.name}</h5>
                                  <p className="text-sm text-primary-foreground/70">{exercise.primaryMuscle}</p>
                                </div>
                                <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold ml-2">
                                  {exercise.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5">
                                  <Repeat size={14} />
                                  <span>3 sets</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Target size={14} />
                                  <span>12 reps</span>
                                </div>
                                {exercise.caloriesPerMinute > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <Flame size={14} />
                                    <span>{exercise.caloriesPerMinute} cal/min</span>
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 text-xs text-primary-foreground/60">
                                Equipment: {exercise.equipment}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-primary-foreground/70 mb-4">
                            {isEditMode ? 'No exercises planned - Add some below' : 'Rest day - No exercises planned'}
                          </p>
                        </div>
                      )}
                      
                      {isEditMode && (
                        <Button 
                          variant="secondary" 
                          className="w-full mt-4" 
                          icon={Plus}
                          onClick={() => setShowExerciseModal(true)}
                        >
                          Add Exercise to {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][currentDayIndex]}
                        </Button>
                      )}
                      
                      {!isEditMode && isToday && dayExercises.length > 0 && (
                        <Button variant="secondary" className="w-full mt-4" icon={Dumbbell}>
                          Start Today's Workout
                        </Button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Day Indicators */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDayIndex(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    index === currentDayIndex
                      ? 'bg-white text-primary scale-110'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} />
            </div>
            <p className="text-primary-foreground/90 mb-4">No routine set for this week</p>
            <Button variant="secondary" icon={Plus}>
              Create Weekly Routine
            </Button>
          </div>
        )}
      </div>

      {/* Exercise Selection Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">Add Exercise</h3>
              <button
                onClick={() => setShowExerciseModal(false)}
                className="w-10 h-10 bg-secondary hover:bg-secondary/80 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allExercises.map(exercise => (
                  <div
                    key={exercise._id}
                    className="bg-secondary rounded-xl p-4 hover:bg-secondary/80 transition-colors cursor-pointer border border-border"
                    onClick={() => handleAddExerciseToDay(exercise)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-1">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">{exercise.primaryMuscle}</p>
                      </div>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold ml-2">
                        {exercise.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{exercise.equipment}</span>
                      <span>•</span>
                      <span className={`${
                        exercise.difficulty === 'Beginner' ? 'text-success' :
                        exercise.difficulty === 'Intermediate' ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - Full Width Horizontal */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => window.location.href = '/workouts'}>
            <QuickActionCard
              icon={Plus}
              title="Log Workout"
              description="Record your training session"
              color="from-primary to-[hsl(217,91%,50%)]"
            />
          </div>
          <div onClick={() => window.location.href = '/exercises'}>
            <QuickActionCard
              icon={Search}
              title="Browse Exercises"
              description="Explore 1000+ exercises"
              color="from-accent to-[hsl(262,83%,48%)]"
            />
          </div>
          <div onClick={() => window.location.href = '/analytics'}>
            <QuickActionCard
              icon={BarChart3}
              title="View Analytics"
              description="Track your progress"
              color="from-success to-[hsl(158,64%,52%)]"
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Workout History */}
        <div className="lg:col-span-2 space-y-6">

          {/* Workout History - Last 3 Days */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Calendar size={28} className="text-primary" />
                Last 3 Days
              </h2>
              <Button variant="outline" size="sm">
                View All History
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {last3Days.map((dateStr) => {
                const workouts = workoutsByDate[dateStr] || [];
                const isToday = dateStr === new Date().toDateString();
                const isSelected = dateStr === state.selectedDate;
                
                return (
                  <DayWorkoutCard
                    key={dateStr}
                    date={dateStr}
                    workouts={workouts}
                    isToday={isToday}
                    isSelected={isSelected}
                    onClick={() => dispatch({ type: 'SET_SELECTED_DATE', payload: dateStr })}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Motivational Quote */}
          <div className="bg-gradient-to-br from-accent to-[hsl(320,85%,58%)] rounded-2xl p-6 text-white shadow-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={24} />
              </div>
              <p className="font-bold text-lg mb-2">"Your only limit is you"</p>
              <p className="text-accent-foreground/90 text-sm">Stay focused and push harder today!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements - Horizontal at End */}
      <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={24} className="text-[hsl(45,93%,55%)]" />
          <h3 className="font-bold text-foreground text-xl">Recent Achievements</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[hsl(45,93%,55%)] to-[hsl(45,93%,45%)] rounded-xl p-4 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Star size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base">Week Warrior</h4>
                <p className="text-xs text-white/80">Earned 2 days ago</p>
              </div>
            </div>
            <p className="text-sm text-white/90">Completed 7 consecutive days of workouts</p>
          </div>
          <div className="bg-gradient-to-br from-[hsl(15,100%,60%)] to-[hsl(15,100%,50%)] rounded-xl p-4 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Flame size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base">100 Workouts</h4>
                <p className="text-xs text-white/80">Earned 5 days ago</p>
              </div>
            </div>
            <p className="text-sm text-white/90">Reached the milestone of 100 total workouts</p>
          </div>
          <div className="bg-gradient-to-br from-primary to-[hsl(217,91%,50%)] rounded-xl p-4 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base">Consistency King</h4>
                <p className="text-xs text-white/80">Earned 1 week ago</p>
              </div>
            </div>
            <p className="text-sm text-white/90">Maintained workout streak for 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}