import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}

export function QuickActionCard({ icon: Icon, title, description, color, onClick }: QuickActionCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-border"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
        <span>Get Started</span>
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
