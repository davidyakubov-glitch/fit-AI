import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Award, Target, Calendar, Loader2,
  Scale, Plus, Dumbbell, Trophy, Activity
} from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import BodyMeasurementForm from '../components/fitness/BodyMeasurementForm';
import MobileHeader from '../components/MobileHeader';
import PullToRefresh from '../components/PullToRefresh';
import ProgressFilters from '../components/progress/ProgressFilters';
import StatCard from '../components/progress/StatCard';
import FocusAreas from '../components/progress/FocusAreas';
import AchievementsPanel from '../components/fitness/AchievementsPanel';

const GOOD_REP_COLORS = ['#9333ea', '#e5e7eb'];

export default function Progress() {
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [dateRange, setDateRange] = useState(30);
  const [exerciseFilter, setExerciseFilter] = useState('All');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => base44.entities.UserProfile.filter({ created_by: user.email }, '-created_date', 1),
    enabled: !!user
  });
  const userProfile = profiles[0] || null;

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['allSessions', user?.email],
    queryFn: () => base44.entities.WorkoutSession.filter({ created_by: user.email }, '-date', 100),
    enabled: !!user
  });

  const { data: measurements = [], isLoading: measurementsLoading } = useQuery({
    queryKey: ['bodyMeasurements', user?.email],
    queryFn: () => base44.entities.BodyMeasurement.filter({ created_by: user.email }, '-date', 50),
    enabled: !!user
  });

  const { data: exerciseLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['exerciseLogs', user?.email],
    queryFn: () => base44.entities.ExerciseLog.filter({ created_by: user.email }, '-date', 100),
    enabled: !!user
  });

  // Apply filters
  const filteredSessions = useMemo(() => {
    let result = sessions;
    if (dateRange > 0) {
      const cutoff = subDays(new Date(), dateRange);
      result = result.filter(s => isAfter(new Date(s.date), cutoff));
    }
    if (exerciseFilter !== 'All') {
      result = result.filter(s => s.exercise_type === exerciseFilter);
    }
    return result;
  }, [sessions, dateRange, exerciseFilter]);

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['allSessions'] }),
      queryClient.invalidateQueries({ queryKey: ['bodyMeasurements'] }),
      queryClient.invalidateQueries({ queryKey: ['exerciseLogs'] })
    ]);
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">Please log in to view your progress</p>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading || measurementsLoading || logsLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );

  // Stats computed from filtered sessions
  const totalWorkouts = filteredSessions.length;
  const totalReps = filteredSessions.reduce((s, x) => s + (x.total_reps || 0), 0);
  const totalGoodReps = filteredSessions.reduce((s, x) => s + (x.good_reps || 0), 0);
  const avgFormScore = totalWorkouts
    ? Math.round(filteredSessions.reduce((s, x) => s + (x.avg_form_score || 0), 0) / totalWorkouts)
    : 0;
  const avgDepth = totalWorkouts
    ? Math.round(filteredSessions.reduce((s, x) => s + (x.avg_depth_score || 0), 0) / totalWorkouts)
    : 0;
  const totalDuration = Math.round(
    filteredSessions.reduce((s, x) => s + (x.duration_seconds || 0), 0) / 60
  );
  const goodRepPct = totalReps > 0 ? Math.round((totalGoodReps / totalReps) * 100) : 0;

  // Trend: compare first half vs second half of filtered sessions
  const half = Math.floor(filteredSessions.length / 2);
  const firstHalf = filteredSessions.slice(half);
  const secondHalf = filteredSessions.slice(0, half);
  const formTrend = firstHalf.length && secondHalf.length
    ? (secondHalf.reduce((s, x) => s + (x.avg_form_score || 0), 0) / secondHalf.length) -
      (firstHalf.reduce((s, x) => s + (x.avg_form_score || 0), 0) / firstHalf.length)
    : null;

  // Chart data (oldest first)
  const chartData = [...filteredSessions].reverse().map((s) => ({
    date: format(new Date(s.date), 'MMM d'),
    form: s.avg_form_score || 0,
    depth: s.avg_depth_score || 0,
    reps: s.total_reps || 0,
    goodReps: s.good_reps || 0,
    duration: s.duration_seconds ? Math.round(s.duration_seconds / 60) : 0
  }));

  // Good reps donut
  const pieData = [
    { name: 'Good Form', value: totalGoodReps },
    { name: 'Needs Work', value: totalReps - totalGoodReps }
  ];

  // Body measurement chart
  const measurementChartData = [...measurements].reverse().map(m => ({
    date: format(new Date(m.date), 'MMM d'),
    weight: m.weight,
    bodyFat: m.body_fat_percentage,
    muscleMass: m.muscle_mass
  }));

  // Exercise stats
  const exerciseStats = exerciseLogs.reduce((acc, log) => {
    const name = log.exercise_name;
    if (!acc[name]) acc[name] = { name, maxWeight: 0, maxReps: 0, totalSets: 0, count: 0 };
    acc[name].maxWeight = Math.max(acc[name].maxWeight, log.weight || 0);
    acc[name].maxReps = Math.max(acc[name].maxReps, log.reps || 0);
    acc[name].totalSets += log.sets || 0;
    acc[name].count += 1;
    return acc;
  }, {});

  const personalBests = exerciseLogs.filter(log => log.is_personal_best);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <MobileHeader title="Progress Dashboard" />
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">

          {/* Header */}
          <div className="hidden md:block text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">Progress Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Visualize your fitness journey over time</p>
          </div>

          <Tabs defaultValue="workouts" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4">
              <TabsTrigger value="workouts">Workouts</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="exercises">Exercises</TabsTrigger>
              <TabsTrigger value="achievements">🏆</TabsTrigger>
            </TabsList>

            {/* ── WORKOUTS TAB ── */}
            <TabsContent value="workouts" className="space-y-6 mt-6">

              {/* Filters */}
              <ProgressFilters
                dateRange={dateRange}
                setDateRange={setDateRange}
                exerciseFilter={exerciseFilter}
                setExerciseFilter={setExerciseFilter}
              />

              {filteredSessions.length === 0 ? (
                <Card>
                  <CardContent className="pt-10 pb-10 text-center">
                    <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No sessions found</h3>
                    <p className="text-gray-500 text-sm mt-1">Try a different date range or exercise filter.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Workouts" value={totalWorkouts} icon={Calendar} color="purple" />
                    <StatCard label="Total Reps" value={totalReps} icon={TrendingUp} color="green" />
                    <StatCard label="Good Rep Rate" value={goodRepPct} unit="%" icon={Award} color="blue" />
                    <StatCard label="Avg Form Score" value={avgFormScore} unit="%" icon={Target} color="orange" trend={formTrend} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Avg Squat Depth" value={avgDepth} unit="%" icon={Activity} color="purple" />
                    <StatCard label="Total Duration" value={totalDuration} unit="min" icon={Calendar} color="blue" />
                    <StatCard label="Good Reps" value={totalGoodReps} icon={Award} color="green" />
                    <StatCard label="Sessions Logged" value={totalWorkouts} icon={Dumbbell} color="orange" />
                  </div>

                  {/* Form & Depth Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Form Score & Squat Depth Over Time</CardTitle>
                      <CardDescription>Track how your technique improves session to session</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v) => `${v}%`} />
                          <Legend />
                          <Line type="monotone" dataKey="form" stroke="#9333ea" strokeWidth={2.5} dot={false} name="Form Score %" />
                          <Line type="monotone" dataKey="depth" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Depth %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Reps Chart + Good Rep Donut */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Reps Per Workout</CardTitle>
                        <CardDescription>Total vs good form reps</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="reps" fill="#d8b4fe" name="Total Reps" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="goodReps" fill="#7c3aed" name="Good Form Reps" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Good Rep Breakdown</CardTitle>
                        <CardDescription>{goodRepPct}% of reps with good form</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center h-[250px]">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {pieData.map((_, i) => (
                                <Cell key={i} fill={GOOD_REP_COLORS[i]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Duration Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Workout Duration</CardTitle>
                      <CardDescription>Minutes spent per session</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis unit="m" tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v) => `${v} min`} />
                          <Bar dataKey="duration" fill="#06b6d4" name="Duration (min)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Focus Areas */}
                  <FocusAreas sessions={filteredSessions} />

                  {/* Recent Workouts Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {filteredSessions.slice(0, 8).map(session => (
                          <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                  {format(new Date(session.date), 'MMM d, yyyy')}
                                </span>
                                <Badge variant="secondary" className="text-xs capitalize">{session.exercise_type}</Badge>
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {session.total_reps} reps · {session.good_reps} good · {Math.round((session.duration_seconds || 0) / 60)}min
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium text-purple-600">{session.avg_form_score}% form</div>
                              <div className="font-medium text-blue-600">{session.avg_depth_score}% depth</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* ── BODY METRICS TAB ── */}
            <TabsContent value="body" className="space-y-6 mt-6">
              {showMeasurementForm ? (
                <BodyMeasurementForm onClose={() => setShowMeasurementForm(false)} />
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Body Measurements</CardTitle>
                        <CardDescription>Track your body composition over time</CardDescription>
                      </div>
                      <Button onClick={() => setShowMeasurementForm(true)} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Log Measurement
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              )}

              {measurements.length > 0 && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Current Weight" value={measurements[0].weight} icon={Scale} color="purple" />
                    {measurements[0].body_fat_percentage && (
                      <StatCard label="Body Fat" value={measurements[0].body_fat_percentage} unit="%" icon={Target} color="blue" />
                    )}
                    {measurements[0].muscle_mass && (
                      <StatCard label="Muscle Mass" value={measurements[0].muscle_mass} icon={Dumbbell} color="green" />
                    )}
                    {measurements.length > 1 && (
                      <StatCard
                        label="Weight Change"
                        value={Math.abs((measurements[0].weight - measurements[measurements.length - 1].weight).toFixed(1))}
                        icon={TrendingUp}
                        color="orange"
                        trend={measurements[0].weight - measurements[measurements.length - 1].weight}
                      />
                    )}
                  </div>

                  {measurementChartData.length > 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Weight Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart data={measurementChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weight" stroke="#9333ea" strokeWidth={2} name="Weight" dot={false} />
                            {measurementChartData.some(d => d.bodyFat) && (
                              <Line type="monotone" dataKey="bodyFat" stroke="#2563eb" strokeWidth={2} name="Body Fat %" dot={false} />
                            )}
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader><CardTitle>Measurement History</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {measurements.slice(0, 10).map(m => (
                          <div key={m.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-semibold text-sm">{format(new Date(m.date), 'MMM d, yyyy')}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                Weight: {m.weight}
                                {m.body_fat_percentage && ` · Body Fat: ${m.body_fat_percentage}%`}
                                {m.waist && ` · Waist: ${m.waist}`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {measurements.length === 0 && !showMeasurementForm && (
                <Card>
                  <CardContent className="pt-10 pb-10 text-center">
                    <Scale className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">No Measurements Yet</h3>
                    <p className="text-gray-500 text-sm mb-4">Start tracking your body composition</p>
                    <Button onClick={() => setShowMeasurementForm(true)} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />Log First Measurement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* ── EXERCISES TAB ── */}
            <TabsContent value="exercises" className="space-y-6 mt-6">
              {personalBests.length > 0 && (
                <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      Personal Bests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {personalBests.slice(0, 5).map(log => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-yellow-200 rounded-lg">
                          <div>
                            <div className="font-semibold text-sm">{log.exercise_name}</div>
                            <div className="text-xs text-gray-500">{format(new Date(log.date), 'MMM d, yyyy')}</div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {log.sets}×{log.reps}{log.weight > 0 ? ` @ ${log.weight}kg` : ''}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {Object.keys(exerciseStats).length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Exercise Performance</CardTitle>
                    <CardDescription>Your best results per exercise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.values(exerciseStats).map(stat => (
                        <div key={stat.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div>
                            <div className="font-semibold text-sm">{stat.name}</div>
                            <div className="text-xs text-gray-500">{stat.count} sessions · {stat.totalSets} total sets</div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium text-purple-600">Max {stat.maxReps} reps</div>
                            {stat.maxWeight > 0 && <div className="font-medium text-blue-600">{stat.maxWeight}kg</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-10 pb-10 text-center">
                    <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">No Exercise Logs Yet</h3>
                    <p className="text-gray-500 text-sm">Log individual exercises to track performance here</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            {/* ── ACHIEVEMENTS TAB ── */}
            <TabsContent value="achievements" className="space-y-6 mt-6">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Achievements</h2>
                <p className="text-gray-500 text-sm">
                  {userProfile?.achievements?.length || 0} / 8 unlocked
                </p>
              </div>

              {/* Streak highlight */}
              {userProfile && (
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                    <CardContent className="pt-4 pb-4 text-center">
                      <div className="text-3xl mb-1">🔥</div>
                      <div className="text-2xl font-black text-orange-700">{userProfile.streak_days || 0}</div>
                      <div className="text-xs text-orange-500">Current Streak</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                    <CardContent className="pt-4 pb-4 text-center">
                      <div className="text-3xl mb-1">⚡</div>
                      <div className="text-2xl font-black text-purple-700">{userProfile.longest_streak || 0}</div>
                      <div className="text-xs text-purple-500">Best Streak</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <AchievementsPanel
                unlockedIds={userProfile?.achievements || []}
                streak={userProfile?.streak_days || 0}
                totalWorkouts={userProfile?.total_workouts || 0}
                totalReps={userProfile?.total_reps || 0}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PullToRefresh>
    </div>
  );
}