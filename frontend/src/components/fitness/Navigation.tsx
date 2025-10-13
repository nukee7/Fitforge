import React from 'react';
import { Dumbbell, Search, Plus, User, TrendingUp, Calendar } from 'lucide-react';
import { Button } from './Button';

export function Navigation() {
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-card/90 border-b border-border sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Dumbbell size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FitForge</h1>
                <p className="text-xs text-muted-foreground">Forge Your Fitness</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="text-foreground font-semibold border-b-2 border-primary pb-1">Dashboard</a>
              <a href="/exercises" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Exercises</a>
              <a href="/progress" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Progress</a>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-secondary rounded-xl transition-colors">
                <Search size={20} className="text-muted-foreground" />
              </button>
              <Button variant="primary" size="sm" icon={Plus}>
                New Workout
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center cursor-pointer">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 border-t border-border px-4 py-3 backdrop-blur-lg z-50">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <TrendingUp size={24} />
            <span className="text-xs font-semibold">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <Plus size={24} />
            <span className="text-xs">Log</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <User size={24} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
}
