import React from 'react';
import { Flame, Target, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalorieSummaryCard({ consumed, burned, goal }) {
  const net = consumed - burned;
  const remaining = goal - consumed;
  const pct = Math.min(100, Math.round((consumed / goal) * 100));
  const exceeded = consumed > goal;

  const barColor = exceeded
    ? 'bg-red-500'
    : pct >= 85
    ? 'bg-yellow-500'
    : 'bg-green-500';

  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-purple-200 mb-1">Today's Calories</div>
          <div className="flex items-end gap-1.5">
            <span className="text-5xl font-black leading-none">{Math.round(consumed)}</span>
            <span className="text-lg font-semibold text-purple-200 mb-1">/ {goal}</span>
          </div>
          <div className="text-xs text-purple-200 mt-1">kcal consumed</div>
        </div>
        <div className={cn(
          'rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5',
          exceeded ? 'bg-red-500/30 text-red-100' : 'bg-white/20 text-white'
        )}>
          {exceeded
            ? <><TrendingUp className="h-3.5 w-3.5" /> Over limit</>
            : remaining <= 0
            ? <><Minus className="h-3.5 w-3.5" /> Goal met</>
            : <><TrendingDown className="h-3.5 w-3.5" /> {Math.abs(remaining)} kcal left</>
          }
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-purple-200 mb-1.5">
          <span>0</span>
          <span className="font-semibold">{pct}%</span>
          <span>{goal} kcal</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Consumed',  value: Math.round(consumed),        icon: Flame,        color: 'text-orange-300' },
          { label: 'Burned',    value: Math.round(burned),          icon: TrendingDown,  color: 'text-green-300' },
          { label: 'Net',       value: Math.round(net),             icon: Target,        color: net > 0 ? 'text-yellow-300' : 'text-green-300' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/10 rounded-xl p-2.5 text-center">
            <Icon className={cn('h-4 w-4 mx-auto mb-1', color)} />
            <div className="text-base font-black leading-none">{value}</div>
            <div className="text-[10px] text-purple-200 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Feedback message */}
      <div className={cn(
        'mt-3 rounded-xl px-3 py-2 text-xs font-semibold text-center',
        exceeded
          ? 'bg-red-500/25 text-red-100'
          : remaining < 200
          ? 'bg-yellow-500/20 text-yellow-100'
          : 'bg-white/10 text-purple-100'
      )}>
        {exceeded
          ? `⚠️ You exceeded your calorie limit by ${Math.round(consumed - goal)} kcal`
          : remaining < 200
          ? `✅ You are within your goal — great job!`
          : `🎯 ${Math.round(remaining)} kcal remaining to reach your goal`}
      </div>
    </div>
  );
}