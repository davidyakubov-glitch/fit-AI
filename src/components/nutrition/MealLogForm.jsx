import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileSelect } from '@/components/ui/mobile-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import FoodSearch from './FoodSearch';

export default function MealLogForm({ onClose, initialFood = null, defaultMealType = 'lunch', editingMeal = null }) {
  const queryClient = useQueryClient();
  const isEditing = !!editingMeal;

  const [showSearch, setShowSearch] = useState(!initialFood && !isEditing);
  const [meal, setMeal] = useState({
    date: editingMeal?.date ? new Date(editingMeal.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    meal_type: editingMeal?.meal_type || defaultMealType,
    food_name: editingMeal?.food_name || initialFood?.name || '',
    quantity: editingMeal ? 1 : 1,
    calories: editingMeal?.calories || initialFood?.calories || '',
    protein: editingMeal?.protein || initialFood?.protein || '',
    carbs: editingMeal?.carbs || initialFood?.carbs || '',
    fat: editingMeal?.fat || initialFood?.fat || '',
    notes: editingMeal?.notes || ''
  });

  const saveMutation = useMutation({
    mutationFn: (data) => isEditing
      ? base44.entities.MealLog.update(editingMeal.id, data)
      : base44.entities.MealLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealLogs'] });
      toast.success(isEditing ? 'Meal updated!' : 'Meal logged!');
      onClose?.();
    }
  });

  const handleSelectFood = (food) => {
    setMeal({ ...meal, food_name: food.name, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat });
    setShowSearch(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = parseFloat(meal.quantity) || 1;
    const data = {
      date: new Date(meal.date).toISOString(),
      meal_type: meal.meal_type,
      food_name: meal.food_name,
      quantity: qty,
      calories: parseFloat(meal.calories) * qty,
      protein: meal.protein ? parseFloat(meal.protein) * qty : 0,
      carbs: meal.carbs ? parseFloat(meal.carbs) * qty : 0,
      fat: meal.fat ? parseFloat(meal.fat) * qty : 0,
      notes: meal.notes || undefined
    };
    saveMutation.mutate(data);
  };

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-purple-600" />
            {isEditing ? 'Edit Meal' : 'Log Meal'}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSearch ? (
          <div className="space-y-3">
            <FoodSearch onSelectFood={handleSelectFood} />
            <Button variant="outline" size="sm" onClick={() => setShowSearch(false)} className="w-full">
              Enter manually instead
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Meal Type *</Label>
                <MobileSelect
                  value={meal.meal_type}
                  onValueChange={(v) => setMeal({ ...meal, meal_type: v })}
                  placeholder="Select meal type"
                  label="Meal Type"
                  options={[
                    { value: 'breakfast', label: '🌅 Breakfast' },
                    { value: 'lunch',     label: '☀️ Lunch' },
                    { value: 'dinner',    label: '🌙 Dinner' },
                    { value: 'snack',     label: '🍎 Snack' }
                  ]}
                />
              </div>
              <div>
                <Label className="text-xs">Date *</Label>
                <Input
                  type="date"
                  value={meal.date}
                  onChange={(e) => setMeal({ ...meal, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Food Name *</Label>
              <Input
                value={meal.food_name}
                onChange={(e) => setMeal({ ...meal, food_name: e.target.value })}
                placeholder="e.g. Grilled Chicken Breast"
                required
              />
              <button type="button" onClick={() => setShowSearch(true)} className="text-xs text-purple-600 mt-1 hover:underline">
                🔍 Search food database
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Calories / serving *</Label>
                <Input type="number" value={meal.calories} onChange={(e) => setMeal({ ...meal, calories: e.target.value })} required placeholder="e.g. 300" />
              </div>
              <div>
                <Label className="text-xs">Servings</Label>
                <Input type="number" step="0.5" value={meal.quantity} onChange={(e) => setMeal({ ...meal, quantity: e.target.value })} min="0.5" />
              </div>
              <div>
                <Label className="text-xs">Protein (g)</Label>
                <Input type="number" step="0.1" value={meal.protein} onChange={(e) => setMeal({ ...meal, protein: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs">Carbs (g)</Label>
                <Input type="number" step="0.1" value={meal.carbs} onChange={(e) => setMeal({ ...meal, carbs: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs">Fat (g)</Label>
                <Input type="number" step="0.1" value={meal.fat} onChange={(e) => setMeal({ ...meal, fat: e.target.value })} placeholder="0" />
              </div>
              <div className="flex items-end">
                <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-100 w-full text-center">
                  <div className="text-[10px] text-purple-500 font-semibold uppercase">Total</div>
                  <div className="text-lg font-black text-purple-700">
                    {(parseFloat(meal.calories || 0) * parseFloat(meal.quantity || 1)).toFixed(0)}
                  </div>
                  <div className="text-[10px] text-purple-400">kcal</div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saveMutation.isPending} className="w-full bg-purple-600 hover:bg-purple-700">
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : isEditing ? 'Update Meal' : 'Log Meal'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}