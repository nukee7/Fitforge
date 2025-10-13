import { ReactNode } from 'react';
import { Navigation } from '@/components/fitness/Navigation';
import { WorkoutProvider } from '@/contexts/WorkoutContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </WorkoutProvider>
  );
}
