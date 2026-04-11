import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  LayoutList,
  History,
  Loader2,
  Clock,
  CheckCircle2,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import PlanBrowser from '../components/fitness/PlanBrowser';
import AIPlanGenerator from '../components/fitness/AIPlanGenerator';
import PlanExecutor from '../components/fitness/PlanExecutor';
import WorkoutShareModal from '../components/community/WorkoutShareModal';
import { useAuthUser } from '../lib/useAuthUser';

export default function WorkoutPlan() {
  const [activePlan, setActivePlan] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [sharingPlan, setSharingPlan] = useState(null);

  const user = useAuthUser();

  const {
    data: history = [],
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['planHistory', user?.email],
    queryFn: () =>
      base44.entities.StructuredPlan.filter(
        { created_by: user.email },
        '-created_date',
        20
      ),
    enabled: !!user?.email,
  });

  const completedPlans = history.filter((plan) => plan.completed_date);

  const handleSelectPlan = (plan) => {
    setActivePlan(plan);
    toast.success(`"${plan.name}" selected! Ready to start.`);
  };

  const handleStartExecution = () => {
    if (!activePlan) return;
    setExecuting(true);
  };

  const handleFinish = async () => {
    setExecuting(false);
    setActivePlan(null);
    await refetchHistory();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '—';
    const totalSeconds = Number(seconds) || 0;
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-purple-600" />
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Please sign in to access workout plans</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Workout Plans</h1>
            <p className="text-gray-600">
              Choose a preset, generate with AI, or start your session
            </p>
          </div>

          {/* Active Plan Banner */}
          {activePlan && !executing && (
            <Card className="border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                      Ready to go
                    </p>
                    <p className="font-bold text-gray-900 text-lg">{activePlan.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {activePlan.estimated_duration_minutes || '?'} min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {activePlan.exercises?.length || 0} exercises
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleStartExecution}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Start <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setActivePlan(null)}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Executor */}
          {executing && activePlan && (
            <PlanExecutor
              plan={activePlan}
              onFinish={handleFinish}
              onCancel={() => {
                setExecuting(false);
                toast.info('Workout cancelled');
              }}
            />
          )}

          {/* Tabs — hidden while executing */}
          {!executing && (
            <Tabs defaultValue="browse">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browse">
                  <LayoutList className="h-4 w-4 mr-2" /> Browse Plans
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkles className="h-4 w-4 mr-2" /> AI Generate
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" /> History
                </TabsTrigger>
              </TabsList>

              {/* Browse Presets */}
              <TabsContent value="browse" className="mt-4">
                <PlanBrowser
                  onSelectPlan={handleSelectPlan}
                  activePlanId={activePlan?.id}
                />
              </TabsContent>

              {/* AI Generator */}
              <TabsContent value="ai" className="mt-4">
                <AIPlanGenerator onPlanGenerated={handleSelectPlan} />
              </TabsContent>

              {/* History */}
              <TabsContent value="history" className="mt-4">
                {historyLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : completedPlans.length === 0 ? (
                  <Card className="border-dashed border-2 border-gray-200">
                    <CardContent className="pt-12 pb-12 text-center">
                      <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No completed workouts yet</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Complete a plan to see your history here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 font-medium">
                      {completedPlans.length} completed workout
                      {completedPlans.length !== 1 ? 's' : ''}
                    </p>

                    {completedPlans.map((plan) => (
                      <Card key={plan.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="font-semibold text-gray-900 truncate">
                                  {plan.name}
                                </span>
                              </div>

                              <p className="text-xs text-gray-500">
                                {plan.completed_date
                                  ? new Date(plan.completed_date).toLocaleDateString(
                                      undefined,
                                      {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                      }
                                    )
                                  : '—'}
                              </p>

                              <div className="flex gap-2 mt-2 flex-wrap">
                                {plan.difficulty && (
                                  <Badge variant="outline" className="text-xs">
                                    {plan.difficulty}
                                  </Badge>
                                )}
                                {plan.goal && (
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {String(plan.goal).replace('_', ' ')}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="text-right text-sm space-y-1 flex-shrink-0">
                              {plan.exercises_completed != null && (
                                <div>
                                  <span className="font-bold text-purple-600">
                                    {plan.exercises_completed}
                                  </span>
                                  <span className="text-gray-500 text-xs"> exercises</span>
                                </div>
                              )}

                              {plan.total_reps_completed != null && (
                                <div>
                                  <span className="font-bold text-green-600">
                                    {plan.total_reps_completed}
                                  </span>
                                  <span className="text-gray-500 text-xs"> reps</span>
                                </div>
                              )}

                              {plan.duration_seconds != null && (
                                <div className="text-gray-500 text-xs">
                                  {formatDuration(plan.duration_seconds)}
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => setSharingPlan(plan)}
                                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 mt-1 ml-auto"
                              >
                                <Share2 className="h-3 w-3" /> Share
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {sharingPlan && (
        <WorkoutShareModal
          plan={sharingPlan}
          onClose={() => setSharingPlan(null)}
        />
      )}
    </>
  );
}