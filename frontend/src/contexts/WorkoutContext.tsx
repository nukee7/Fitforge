import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface Workout {
  id: number;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  calories: number;
  date: string;
  category: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  caloriesBurned: number;
}

interface WorkoutState {
  exercises: any[];
  workouts: Workout[];
  stats: WorkoutStats;
  loading: boolean;
  currentView: string;
  selectedDate: string;
}

type Action =
  | { type: 'SET_EXERCISES'; payload: any[] }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STATS'; payload: WorkoutStats }
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'SET_SELECTED_DATE'; payload: string };

const WorkoutContext = createContext<{
  state: WorkoutState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function workoutReducer(state: WorkoutState, action: Action): WorkoutState {
  switch (action.type) {
    case 'SET_EXERCISES':
      return { ...state, exercises: action.payload, loading: false };
    case 'ADD_WORKOUT':
      return { ...state, workouts: [...state.workouts, action.payload] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    default:
      return state;
  }
}

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const today = new Date();
  const [state, dispatch] = useReducer(workoutReducer, {
    exercises: [],
    workouts: [
      { id: 1, exerciseName: 'Bench Press', sets: 4, reps: 10, weight: 80, calories: 85, date: new Date(today).toISOString(), category: 'Chest' },
      { id: 2, exerciseName: 'Cable Fly', sets: 3, reps: 12, weight: 30, calories: 45, date: new Date(today).toISOString(), category: 'Chest' },
      { id: 3, exerciseName: 'Squats', sets: 5, reps: 5, weight: 100, calories: 120, date: new Date(today.getTime() - 86400000).toISOString(), category: 'Legs' },
      { id: 4, exerciseName: 'Leg Press', sets: 4, reps: 12, weight: 150, calories: 95, date: new Date(today.getTime() - 86400000).toISOString(), category: 'Legs' },
      { id: 5, exerciseName: 'Deadlift', sets: 3, reps: 8, weight: 120, calories: 150, date: new Date(today.getTime() - 172800000).toISOString(), category: 'Back' },
      { id: 6, exerciseName: 'Bent Over Rows', sets: 4, reps: 10, weight: 70, calories: 75, date: new Date(today.getTime() - 172800000).toISOString(), category: 'Back' },
      { id: 7, exerciseName: 'Shoulder Press', sets: 4, reps: 10, weight: 50, calories: 65, date: new Date(today.getTime() - 259200000).toISOString(), category: 'Shoulders' },
      { id: 8, exerciseName: 'Lateral Raises', sets: 3, reps: 15, weight: 15, calories: 40, date: new Date(today.getTime() - 259200000).toISOString(), category: 'Shoulders' },
      { id: 9, exerciseName: 'Pull-ups', sets: 3, reps: 12, weight: 0, calories: 55, date: new Date(today.getTime() - 345600000).toISOString(), category: 'Back' },
      { id: 10, exerciseName: 'Plank', sets: 3, reps: 1, weight: 0, calories: 30, date: new Date(today.getTime() - 345600000).toISOString(), category: 'Core' },
    ],
    stats: { totalWorkouts: 0, totalSets: 0, totalReps: 0, caloriesBurned: 0 },
    loading: false,
    currentView: 'dashboard',
    selectedDate: today.toDateString()
  });

  useEffect(() => {
    const stats = {
      totalWorkouts: state.workouts.length,
      totalSets: state.workouts.reduce((sum, w) => sum + w.sets, 0),
      totalReps: state.workouts.reduce((sum, w) => sum + (w.sets * w.reps), 0),
      caloriesBurned: state.workouts.reduce((sum, w) => sum + w.calories, 0)
    };
    dispatch({ type: 'SET_STATS', payload: stats });
  }, [state.workouts]);

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
