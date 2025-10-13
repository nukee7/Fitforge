import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AchievementBadgeProps {
  icon: LucideIcon;
  title: string;
  date: string;
}

export function AchievementBadge({ icon: Icon, title, date }: AchievementBadgeProps) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-[hsl(45,93%,85%)] to-[hsl(25,90%,85%)] rounded-xl p-3 border border-[hsl(45,93%,70%)]">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(45,93%,55%)] to-warning flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}
