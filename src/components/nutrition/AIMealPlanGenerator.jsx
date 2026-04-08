import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, RefreshCw, Flame, Beef, Wheat, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const GOALS = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Endurance'];
const DIETS  = ['No Restriction', 'Vegetarian', 'Vegan', 'Keto', 'Gluten-Free'];
const CALORIES = ['1500', '1800', '2000', '2200', '2500', '3000'];

const MEAL_COLORS = {
  breakfast: 'bg-orange-50 border-orange-200',
  lunch:     'bg-green-50 border-green-200',
  dinner:    'bg-blue-50 border-blue-200',
  snack:     'bg-purple-50 border-purple-200',
};

function MealCard({ meal }) {
  const [open, setOpen] = useState(false);
  const colorClass = MEAL_COLORS[meal.meal_type] || 'bg-gray-50 border-gray-200';

  return (
    <div className={cn('border rounded-xl overflow-hidden', colorClass)}>
      <button
        className="w-full flex items-center justify-between p-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 capitalize">{meal.meal_type}</span>
          <div className="font-semibold text-gray-900 text-sm mt-0.5">{meal.name}</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="text-xs text-orange-600 flex items-center gap-0.5"><Flame className="h-3 w-3" />{meal.calories} kcal</span>
            <span className="text-xs text-blue-600">P {meal.protein}g</span>
            <span className="text-xs text-green-600">C {meal.carbs}g</span>
            <span className="text-xs text-yellow-600">F {meal.fat}g</span>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 border-t border-black/5 pt-2">
          {meal.ingredients?.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Ingredients</div>
              <ul className="space-y-0.5">
                {meal.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>{ing}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {meal.instructions && (
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">How to prepare</div>
              <p className="text-xs text-gray-700 leading-relaxed">{meal.instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AIMealPlanGenerator() {
  const [goal, setGoal]       = useState('Maintenance');
  const [diet, setDiet]       = useState('No Restriction');
  const [calories, setCalories] = useState('2000');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan]       = useState(null);

  const generate = async () => {
    setLoading(true);
    setPlan(null);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a full 1-day personalized meal plan for someone with the following preferences:
- Fitness goal: ${goal}
- Dietary restriction: ${diet}
- Target daily calories: ${calories} kcal

Return a JSON object with:
- summary: { total_calories, total_protein, total_carbs, total_fat, tips (array of 2-3 short tips) }
- meals: array of 4-5 meals, each with:
  - meal_type: "breakfast" | "lunch" | "dinner" | "snack"
  - name: string (meal name)
  - calories: number
  - protein: number (grams)
  - carbs: number (grams)
  - fat: number (grams)
  - ingredients: array of strings (5-8 items with quantities)
  - instructions: string (2-3 sentence prep guide)

Make the plan realistic, varied and nutritious. Match the dietary restriction strictly.`,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: {
            type: 'object',
            properties: {
              total_calories: { type: 'number' },
              total_protein:  { type: 'number' },
              total_carbs:    { type: 'number' },
              total_fat:      { type: 'number' },
              tips:           { type: 'array', items: { type: 'string' } }
            }
          },
          meals: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                meal_type:    { type: 'string' },
                name:         { type: 'string' },
                calories:     { type: 'number' },
                protein:      { type: 'number' },
                carbs:        { type: 'number' },
                fat:          { type: 'number' },
                ingredients:  { type: 'array', items: { type: 'string' } },
                instructions: { type: 'string' }
              }
            }
          }
        }
      }
    });
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Preferences */}
      <div className="bg-white rounded-xl border p-4 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" /> Customize your plan
        </h3>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Goal</div>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => (
              <button key={g} onClick={() => setGoal(g)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                  goal === g ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300')}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Diet</div>
          <div className="flex flex-wrap gap-2">
            {DIETS.map(d => (
              <button key={d} onClick={() => setDiet(d)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                  diet === d ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300')}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Daily Calories Target</div>
          <div className="flex flex-wrap gap-2">
            {CALORIES.map(c => (
              <button key={c} onClick={() => setCalories(c)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                  calories === c ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300')}>
                {c} kcal
              </button>
            ))}
          </div>
        </div>

        <Button onClick={generate} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
          {loading
            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating your plan…</>
            : <><Sparkles className="h-4 w-4 mr-2" /> Generate Meal Plan</>}
        </Button>
      </div>

      {/* Results */}
      {plan && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-4">
            <div className="font-bold text-sm mb-2">Daily Totals</div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Calories', value: plan.summary.total_calories, unit: 'kcal' },
                { label: 'Protein',  value: plan.summary.total_protein,  unit: 'g' },
                { label: 'Carbs',    value: plan.summary.total_carbs,    unit: 'g' },
                { label: 'Fat',      value: plan.summary.total_fat,      unit: 'g' },
              ].map(s => (
                <div key={s.label} className="bg-white/15 rounded-lg p-2">
                  <div className="text-lg font-black">{s.value}</div>
                  <div className="text-[10px] opacity-80">{s.label}</div>
                </div>
              ))}
            </div>
            {plan.summary.tips?.length > 0 && (
              <div className="mt-3 space-y-1">
                {plan.summary.tips.map((tip, i) => (
                  <div key={i} className="text-xs opacity-90 flex items-start gap-1.5">
                    <span className="mt-0.5">💡</span>{tip}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meals */}
          <div className="space-y-2">
            {plan.meals.map((meal, i) => <MealCard key={i} meal={meal} />)}
          </div>

          <Button variant="outline" onClick={generate} disabled={loading} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" /> Regenerate Plan
          </Button>
        </div>
      )}
    </div>
  );
}