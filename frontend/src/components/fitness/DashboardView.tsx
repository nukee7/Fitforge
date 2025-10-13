import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Activity, Flame, Plus, Search, BarChart3, Trophy, Zap, Calendar, CheckCircle, Star } from 'lucide-react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { StatCard } from './StatCard';
import { QuickActionCard } from './QuickActionCard';
import { DayWorkoutCard } from './DayWorkoutCard';
import { AchievementBadge } from './AchievementBadge';
import { Button } from './Button';

export function DashboardView() {
  const { state, dispatch } = useWorkout();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

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
  const last7Days = [];
  for (let i = 2; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.unshift(date.toDateString()); // Add to start to show most recent first
  }

  const todayWorkouts = workoutsByDate[new Date().toDateString()] || [];

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

      {/* Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Your Progress</h2>
          <Button variant="secondary" size="sm" icon={BarChart3}>
            View Analytics
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={TrendingUp}
            label="Total Workouts"
            value={state.stats.totalWorkouts}
            trend="+25%"
            color="blue"
          />
          <StatCard
            icon={Target}
            label="Total Sets"
            value={state.stats.totalSets}
            trend="+15%"
            color="green"
          />
          <StatCard
            icon={Activity}
            label="Total Reps"
            value={state.stats.totalReps}
            trend="+30%"
            color="purple"
          />
          <StatCard
            icon={Flame}
            label="Calories Burned"
            value={state.stats.caloriesBurned}
            trend="+18%"
            color="orange"
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Workout History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionCard
                icon={Plus}
                title="Log Workout"
                description="Record your training session"
                color="from-primary to-[hsl(217,91%,50%)]"
              />
              <QuickActionCard
                icon={Search}
                title="Browse Exercises"
                description="Explore 1000+ exercises"
                color="from-accent to-[hsl(262,83%,48%)]"
              />
              <QuickActionCard
                icon={BarChart3}
                title="View Analytics"
                description="Track your progress"
                color="from-success to-[hsl(158,64%,52%)]"
              />
            </div>
          </div>

          {/* Workout History - Last 7 Days */}
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
              {last7Days.map((dateStr) => {
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
          {/* Today's Goal */}
          <div className="bg-gradient-to-br from-success to-[hsl(158,64%,52%)] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Target size={24} />
              <h3 className="font-bold text-lg">Today's Goal</h3>
            </div>
            <p className="text-success-foreground/90 mb-4">Complete your workout session</p>
            <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span className="font-bold">{todayWorkouts.length > 0 ? '1/1' : '0/1'}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: todayWorkouts.length > 0 ? '100%' : '0%' }}></div>
              </div>
            </div>
            {todayWorkouts.length > 0 ? (
              <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} />
                  <span className="font-semibold">Great job! 🎉</span>
                </div>
                <p className="text-sm text-success-foreground/90">You've completed your workout today!</p>
              </div>
            ) : (
              <Button variant="secondary" className="w-full" icon={Plus}>
                Start Workout
              </Button>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={24} className="text-[hsl(45,93%,55%)]" />
              <h3 className="font-bold text-foreground">Achievements</h3>
            </div>
            <div className="space-y-3">
              <AchievementBadge
                icon={Star}
                title="Week Warrior"
                date="Earned 2 days ago"
              />
              <AchievementBadge
                icon={Flame}
                title="100 Workouts"
                date="Earned 5 days ago"
              />
              <AchievementBadge
                icon={Trophy}
                title="Consistency King"
                date="Earned 1 week ago"
              />
            </div>
          </div>

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
    </div>
  );
}
