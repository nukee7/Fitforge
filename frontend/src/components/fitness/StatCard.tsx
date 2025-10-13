import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  onClick?: () => void;
}

export function StatCard({ icon: Icon, label, value, trend, color, onClick }: StatCardProps) {
  const colorClasses = {
    blue: 'from-primary to-[hsl(217,91%,50%)]',
    green: 'from-success to-[hsl(158,64%,52%)]',
    purple: 'from-accent to-[hsl(262,83%,48%)]',
    orange: 'from-warning to-[hsl(31,97%,72%)]'
  };

  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-border"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} transform group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-success bg-[hsl(142,71%,45%,0.1)] px-2 py-1 rounded-lg">
            <TrendingUp size={14} />
            <span className="text-xs font-semibold">{trend}</span>
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
