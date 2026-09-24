import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Plus, Loader2, Settings2, Flame } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';

import MealSection from '@/components/nutrition/MealSection';
import MealLogForm from '@/components/nutrition/MealLogForm';
import CalorieGoalModal from '@/components/nutrition/CalorieGoalModal';
import AIMealPlanGenerator from '@/components/nutrition/AIMealPlanGenerator';
import MobileHeader from '../components/MobileHeader';
import PullToRefresh from '../components/PullToRefresh';

const GOAL_KEY = 'nutrition_calorie_goal';
const DEFAULT_GOAL = 2000;

function MacroBar({ label, value, max, color, unit = 'g' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="text-gray-500">
          {Math.round(value)}
          {unit}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Nutrition() {
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [defaultType, setDefaultType] = useState('lunch');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState(() => {
    const savedGoal = localStorage.getItem(GOAL_KEY);
    const parsedGoal = savedGoal ? parseInt(savedGoal, 10) : DEFAULT_GOAL;
    return Number.isNaN(parsedGoal) ? DEFAULT_GOAL : parsedGoal;
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: mealLogs = [], isLoading: isMealLogsLoading } = useQuery({
    queryKey: ['mealLogs', user?.email],
    queryFn: () =>
      base44.entities.MealLog.filter({ created_by: user.email }, '-date', 200),
    enabled: !!user?.email,
  });

  const { data: sessions = [], isLoading: isSessionsLoading } = useQuery({
    queryKey: ['workoutSessions', user?.email],
    queryFn: () =>
      base44.entities.WorkoutSession.filter(
        { created_by: user.email },
        '-date',
        30
      ),
    enabled: !!user?.email,
  });

  const handleSaveGoal = (goal) => {
    setCalorieGoal(goal);
    localStorage.setItem(GOAL_KEY, String(goal));
  };

  const handleAddMeal = (mealType = 'lunch') => {
    setDefaultType(mealType);
    setEditingMeal(null);
    setShowMealForm(true);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setShowMealForm(true);
  };

  const handleFormClose = () => {
    setShowMealForm(false);
    setEditingMeal(null);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Please log in to track nutrition</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isMealLogsLoading || isSessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  const todayStart = startOfDay(new Date(`${selectedDate}T12:00:00`));
  const todayEnd = endOfDay(new Date(`${selectedDate}T12:00:00`));

  const todayMeals = mealLogs.filter((log) => {
    const d = new Date(log.date);
    return d >= todayStart && d <= todayEnd;
  });

  const todayTotals = todayMeals.reduce(
    (acc, log) => ({
      calories: acc.calories + (log.calories || 0),
      protein: acc.protein + (log.protein || 0),
      carbs: acc.carbs + (log.carbs || 0),
      fat: acc.fat + (log.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const todayBurned = sessions
    .filter((s) => {
      const d = new Date(s.date);
      return d >= todayStart && d <= todayEnd;
    })
    .reduce((sum, s) => sum + (s.total_reps || 0) * 8, 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const weeklyData = last7Days.map((date) => {
    const ds = startOfDay(date);
    const de = endOfDay(date);

    const dayMeals = mealLogs.filter((log) => {
      const d = new Date(log.date);
      return d >= ds && d <= de;
    });

    const totals = dayMeals.reduce(
      (a, l) => ({
        calories: a.calories + (l.calories || 0),
        protein: a.protein + (l.protein || 0),
        carbs: a.carbs + (l.carbs || 0),
        fat: a.fat + (l.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      date: format(date, 'EEE'),
      ...totals,
      goal: calorieGoal,
    };
  });

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['user'] }),
      queryClient.invalidateQueries({ queryKey: ['mealLogs'] }),
      queryClient.invalidateQueries({ queryKey: ['workoutSessions'] }),
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileHeader title="Nutrition" />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="max-w-2xl mx-auto p-4 pb-10 space-y-5">
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Nutrition
              </h1>
              <p className="text-gray-500 text-sm">
                Track your daily food intake
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowGoalModal(true)}
                type="button"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Set Goal
              </Button>

              <Button
                onClick={() => handleAddMeal()}
                className="bg-green-600 hover:bg-green-700"
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Log Meal
              </Button>
            </div>
          </div>

          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="ai_plan">AI Plan</TabsTrigger>
            </TabsList>

            {/* TODAY TAB */}
            <TabsContent value="today" className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                />

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowGoalModal(true)}
                  className="flex-shrink-0"
                >
                  <Settings2 className="h-4 w-4 mr-1" />
                  Goal
                </Button>
              </div>

              <CalorieSummaryCard
                consumed={todayTotals.calories}
                burned={todayBurned}
                goal={calorieGoal}
              />

              <Card>
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                    Macronutrients
                  </div>

                  <MacroBar
                    label="Protein"
                    value={todayTotals.protein}
                    max={calorieGoal * 0.075}
                    color="bg-blue-500"
                  />
                  <MacroBar
                    label="Carbohydrates"
                    value={todayTotals.carbs}
                    max={calorieGoal * 0.125}
                    color="bg-green-500"
                  />
                  <MacroBar
                    label="Fat"
                    value={todayTotals.fat}
                    max={calorieGoal * 0.033}
                    color="bg-yellow-500"
                  />
                </CardContent>
              </Card>

              {(() => {
                const mealEmojis = {
                  breakfast: '🌅',
                  lunch: '☀️',
                  dinner: '🌙',
                  snack: '🍎',
                };

                return (
                  <div className="grid grid-cols-4 gap-2 md:hidden">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleAddMeal(type)}
                        className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-xl py-3 hover:border-purple-400 hover:bg-purple-50 transition-colors"
                      >
                        <span className="text-xl">{mealEmojis[type]}</span>
                        <span className="text-[10px] text-gray-500 capitalize mt-1">
                          {type}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })()}

              {showMealForm && (
                <MealLogForm
                  onClose={handleFormClose}
                  defaultMealType={defaultType}
                  editingMeal={editingMeal}
                />
              )}

              <MealSection
                meals={todayMeals}
                onAddMeal={handleAddMeal}
                onEditMeal={handleEditMeal}
              />

              <button
                type="button"
                onClick={() => handleAddMeal()}
                className="md:hidden fixed bottom-24 right-4 z-40 h-14 w-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <Plus className="h-7 w-7" />
              </button>
            </TabsContent>

            {/* HISTORY TAB */}
            <TabsContent value="history" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Daily Calories — Last 7 Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={weeklyData} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar
                        dataKey="calories"
                        fill="#a855f7"
                        radius={[6, 6, 0, 0]}
                        name="Calories"
                      />
                      <Bar
                        dataKey="goal"
                        fill="#e5e7eb"
                        radius={[6, 6, 0, 0]}
                        name="Goal"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Macro Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="protein"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        name="Protein (g)"
                      />
                      <Line
                        type="monotone"
                        dataKey="carbs"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        name="Carbs (g)"
                      />
                      <Line
                        type="monotone"
                        dataKey="fat"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                        name="Fat (g)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Meals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mealLogs.slice(0, 30).map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-gray-400">
                              {meal.date
                                ? format(new Date(meal.date), 'MMM d')
                                : '—'}
                            </span>
                            <span className="text-xs font-semibold capitalize text-purple-600">
                              {meal.meal_type || 'meal'}
                            </span>
                          </div>

                          <div className="font-semibold text-sm text-gray-900">
                            {meal.food_name || 'Unnamed meal'}
                          </div>

                          <div className="text-xs text-gray-500">
                            {Math.round(meal.calories || 0)} kcal
                            {(meal.protein || 0) > 0 &&
                              ` · P ${Math.round(meal.protein)}g`}
                            {(meal.carbs || 0) > 0 &&
                              ` · C ${Math.round(meal.carbs)}g`}
                            {(meal.fat || 0) > 0 &&
                              ` · F ${Math.round(meal.fat)}g`}
                          </div>
                        </div>

                        <Flame className="h-4 w-4 text-orange-400 flex-shrink-0" />
                      </div>
                    ))}

                    {mealLogs.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-8">
                        No meals logged yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI PLAN TAB */}
            <TabsContent value="ai_plan" className="mt-4">
              <AIMealPlanGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </PullToRefresh>

      {showGoalModal && (
        <CalorieGoalModal
          currentGoal={calorieGoal}
          onSave={handleSaveGoal}
          onClose={() => setShowGoalModal(false)}
        />
      )}
    </div>
  );
}
