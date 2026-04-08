import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const MEAL_CONFIG = {
  breakfast: { label: 'Breakfast', emoji: '🌅', color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  lunch:     { label: 'Lunch',     emoji: '☀️', color: 'bg-green-50 border-green-200',  badge: 'bg-green-100 text-green-700' },
  dinner:    { label: 'Dinner',    emoji: '🌙', color: 'bg-blue-50 border-blue-200',    badge: 'bg-blue-100 text-blue-700' },
  snack:     { label: 'Snack',     emoji: '🍎', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700' },
};

function MealItem({ meal, onEdit }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.MealLog.delete(meal.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealLogs'] });
      toast.success('Meal removed');
    }
  });

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white border border-gray-100 shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm truncate">{meal.food_name}</div>
        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
          <span className="font-bold text-orange-600">{Math.round(meal.calories)} kcal</span>
          {meal.protein > 0 && <span className="text-blue-500">P {Math.round(meal.protein)}g</span>}
          {meal.carbs > 0   && <span className="text-green-500">C {Math.round(meal.carbs)}g</span>}
          {meal.fat > 0     && <span className="text-yellow-500">F {Math.round(meal.fat)}g</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(meal)}>
          <Pencil className="h-3.5 w-3.5 text-gray-400" />
        </Button>
        <Button
          variant="ghost" size="icon" className="h-7 w-7"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="h-3.5 w-3.5 text-red-400" />
        </Button>
      </div>
    </div>
  );
}

export default function MealSection({ meals, onAddMeal, onEditMeal }) {
  const [expanded, setExpanded] = useState({ breakfast: true, lunch: true, dinner: true, snack: true });

  const toggle = (type) => setExpanded(e => ({ ...e, [type]: !e[type] }));

  return (
    <div className="space-y-3">
      {MEAL_TYPES.map(type => {
        const cfg = MEAL_CONFIG[type];
        const items = meals.filter(m => m.meal_type === type);
        const typeCalories = items.reduce((s, m) => s + (m.calories || 0), 0);

        return (
          <div key={type} className={cn('rounded-2xl border-2 overflow-hidden', cfg.color)}>
            {/* Header */}
            <button
              className="w-full flex items-center justify-between px-4 py-3"
              onClick={() => toggle(type)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{cfg.emoji}</span>
                <span className="font-bold text-gray-900 text-sm">{cfg.label}</span>
                {items.length > 0 && (
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', cfg.badge)}>
                    {Math.round(typeCalories)} kcal
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onAddMeal(type); }}
                  className="h-7 w-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-gray-600" />
                </button>
                {expanded[type]
                  ? <ChevronDown className="h-4 w-4 text-gray-400" />
                  : <ChevronRight className="h-4 w-4 text-gray-400" />}
              </div>
            </button>

            {/* Items */}
            {expanded[type] && (
              <div className="px-3 pb-3 space-y-2">
                {items.length === 0 ? (
                  <button
                    onClick={() => onAddMeal(type)}
                    className="w-full py-3 text-xs text-gray-400 border border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:text-gray-500 transition-colors"
                  >
                    + Add {cfg.label.toLowerCase()}
                  </button>
                ) : (
                  items.map(meal => (
                    <MealItem key={meal.id} meal={meal} onEdit={onEditMeal} />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}