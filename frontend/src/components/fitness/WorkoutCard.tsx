import React from 'react';
import { Flame, CheckCircle } from 'lucide-react';
import { Workout } from '@/contexts/WorkoutContext';

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <div className="bg-gradient-to-br from-secondary to-card rounded-xl p-4 border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-bold text-foreground mb-1">{workout.exerciseName}</h4>
          <p className="text-sm text-muted-foreground">
            {workout.sets} sets × {workout.reps} reps {workout.weight > 0 && `@ ${workout.weight}kg`}
          </p>
        </div>
        <div className="flex items-center gap-1 text-warning bg-[hsl(25,95%,53%,0.1)] px-2 py-1 rounded-lg">
          <Flame size={12} />
          <span className="text-xs font-semibold">{workout.calories} cal</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold">
          {workout.category}
        </span>
        <CheckCircle size={14} className="text-success" />
      </div>
    </div>
  );
}
