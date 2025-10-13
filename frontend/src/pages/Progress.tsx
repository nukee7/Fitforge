import { useState } from 'react';
import { Calendar, TrendingUp, BarChart3, Target, Flame, Dumbbell } from 'lucide-react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { WorkoutCard } from '@/components/fitness/WorkoutCard';
import { Button } from '@/components/fitness/Button';
import { MainLayout } from '@/layouts/MainLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Progress = () => {
  const { state } = useWorkout();
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  // Group workouts by date
  const workoutsByDate = state.workouts.reduce((acc, workout) => {
    const dateKey = new Date(workout.date).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(workout);
    return acc;
  }, {} as Record<string, typeof state.workouts>);

  // Get last 7 days for calendar
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toDateString());
  }

  // Prepare chart data
  const chartData = last7Days.map(dateStr => {
    const workouts = workoutsByDate[dateStr] || [];
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const totalSets = workouts.reduce((sum, w) => sum + w.sets, 0);
    const totalReps = workouts.reduce((sum, w) => sum + (w.sets * w.reps), 0);
    const date = new Date(dateStr);
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: totalCalories,
      sets: totalSets,
      reps: totalReps,
      workouts: workouts.length
    };
  });

  const selectedWorkouts = workoutsByDate[selectedDate] || [];
  const selectedDateObj = new Date(selectedDate);

  return (
    <MainLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-8 text-primary-foreground shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Your Progress</h1>
            <p className="text-primary-foreground/80 text-lg">Track your fitness journey day by day</p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-primary-foreground/80 text-sm mb-1">Total Workouts</p>
            <p className="text-3xl font-bold">{state.stats.totalWorkouts}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-primary-foreground/80 text-sm mb-1">Total Sets</p>
            <p className="text-3xl font-bold">{state.stats.totalSets}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-primary-foreground/80 text-sm mb-1">Total Reps</p>
            <p className="text-3xl font-bold">{state.stats.totalReps}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-primary-foreground/80 text-sm mb-1">Calories Burned</p>
            <p className="text-3xl font-bold">{state.stats.caloriesBurned}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calories Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="text-warning" size={24} />
            <h2 className="text-xl font-bold text-foreground">Calories Burned (7 Days)</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="calories" stroke="hsl(var(--warning))" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workouts Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-foreground">Daily Workouts (7 Days)</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sets & Reps Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-success" size={24} />
            <h2 className="text-xl font-bold text-foreground">Sets & Reps (7 Days)</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="sets" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
              <Bar dataKey="reps" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-foreground">Muscle Groups Trained</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(
              state.workouts.reduce((acc, w) => {
                acc[w.category] = (acc[w.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, count]) => {
              const percentage = (count / state.workouts.length) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{category}</span>
                    <span className="text-sm text-muted-foreground">{count} exercises</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Calendar View */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar size={28} className="text-primary" />
          Daily Breakdown
        </h2>
        
        {/* Date Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {last7Days.map(dateStr => {
            const date = new Date(dateStr);
            const workouts = workoutsByDate[dateStr] || [];
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === new Date().toDateString();
            
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'bg-card text-foreground border border-border hover:border-primary'
                }`}
              >
                <div className="text-xs mb-1">
                  {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-bold">{date.getDate()}</div>
                {workouts.length > 0 && (
                  <div className="text-xs mt-1">{workouts.length} 🔥</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Details */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">
              {selectedDateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            {selectedWorkouts.length > 0 && (
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Exercises</p>
                  <p className="text-xl font-bold text-primary">{selectedWorkouts.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-xl font-bold text-warning">
                    {selectedWorkouts.reduce((sum, w) => sum + w.calories, 0)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedWorkouts.map(workout => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No workouts logged for this day</p>
              <Button variant="primary" size="sm">
                Log Workout
              </Button>
            </div>
          )}
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

export default Progress;
