import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  onClick, 
  className = '' 
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg',
    secondary: 'bg-card border-2 border-border hover:border-muted text-foreground hover:bg-secondary',
    success: 'bg-gradient-to-r from-success to-[hsl(158,64%,52%)] hover:opacity-90 text-success-foreground shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      className={`rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${variants[variant]} ${sizes[size]} ${className} active:scale-95`}
    >
      {Icon && <Icon size={size === 'lg' ? 22 : size === 'sm' ? 16 : 18} />}
      {children}
    </button>
  );
}
