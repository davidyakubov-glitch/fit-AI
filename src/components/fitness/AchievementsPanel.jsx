import React from 'react';
import { ACHIEVEMENTS } from './StreakBanner';
import { cn } from '@/lib/utils';

export default function AchievementsPanel({ unlockedIds = [], streak = 0, totalWorkouts = 0, totalReps = 0 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ACHIEVEMENTS.map(a => {
        const unlocked = unlockedIds.includes(a.id);
        return (
          <div
            key={a.id}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all',
              unlocked
                ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm'
                : 'border-gray-100 bg-gray-50 opacity-40 grayscale'
            )}
          >
            <span className="text-2xl">{a.icon}</span>
            <div className={cn('text-xs font-bold', unlocked ? 'text-purple-800' : 'text-gray-500')}>{a.label}</div>
            <div className="text-[10px] text-gray-400 leading-tight">{a.desc}</div>
            {unlocked && <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">Unlocked</span>}
          </div>
        );
      })}
    </div>
  );
}