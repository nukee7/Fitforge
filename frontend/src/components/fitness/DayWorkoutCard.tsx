import React from 'react';
import { Calendar, CheckCircle, Plus, ChevronRight } from 'lucide-react';
import { Workout } from '@/contexts/WorkoutContext';
import { Button } from './Button';

interface DayWorkoutCardProps {
  date: string;
  workouts: Workout[];
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function DayWorkoutCard({ date, workouts, isToday, isSelected, onClick }: DayWorkoutCardProps) {
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalExercises = workouts.length;
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNum = dateObj.getDate();

  return (
    <div 
      onClick={onClick}
      className={`bg-card rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isToday && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-bold">TODAY</span>
            )}
            <h3 className="text-lg font-bold text-foreground">{dayName}, {dayNum}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        {totalExercises > 0 && (
          <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-lg">
            <CheckCircle size={14} />
            <span className="text-xs font-semibold">{totalExercises}</span>
          </div>
        )}
      </div>

      {totalExercises === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm mb-3">Rest Day</p>
          <Button variant="outline" size="sm" icon={Plus}>
            Log Workout
          </Button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Exercises</p>
              <p className="text-xl font-bold text-primary">{totalExercises}</p>
            </div>
            <div className="bg-warning/5 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Calories</p>
              <p className="text-xl font-bold text-warning">{totalCalories}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-3">
            {workouts.slice(0, 2).map(workout => (
              <div key={workout.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium truncate flex-1">{workout.exerciseName}</span>
                <span className="text-muted-foreground text-xs ml-2">{workout.sets}×{workout.reps}</span>
              </div>
            ))}
            {workouts.length > 2 && (
              <p className="text-xs text-muted-foreground">+ {workouts.length - 2} more exercises</p>
            )}
          </div>

          <button className="w-full text-primary font-semibold text-sm hover:text-primary/80 flex items-center justify-center gap-1 transition-colors">
            View Details
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
