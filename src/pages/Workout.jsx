import React, { useState, useCallback, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Square, RotateCcw, Sparkles, Lock, Info } from 'lucide-react';
import { toast } from 'sonner';
import StreakBanner from '../components/fitness/StreakBanner';
import PoseDetector from '../components/fitness/PoseDetector';
import useExerciseAnalyzer from '../components/fitness/useExerciseAnalyzer';
import FeedbackDisplay from '../components/fitness/FeedbackDisplay';
import FormIssuesPanel from '../components/fitness/FormIssuesPanel';
import FormTipsCard from '../components/fitness/FormTipsCard';
import AIWorkoutGenerator from '../components/fitness/AIWorkoutGenerator';
import SubscriptionCard from '../components/fitness/SubscriptionCard';
import ExercisePicker from '../components/fitness/ExercisePicker';
import ExerciseVideo from '../components/fitness/ExerciseVideo';
import { getExercise } from '../components/fitness/exerciseDatabase';

export default function Workout() {
  const [isActive, setIsActive] = useState(false);
  const [workoutSavedTick, setWorkoutSavedTick] = useState(0);
  const [landmarks, setLandmarks] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sessionData, setSessionData] = useState({ totalReps: 0, goodReps: 0, depthScores: [], allIssues: [] });
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(getExercise('squat'));

  const startTimeRef = useRef(null);
  const queryClient = useQueryClient();

  const handleWorkoutGenerated = (workout) => {
    setCurrentWorkout(workout);
    setShowGenerator(false);
  };

  const saveSessionMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkoutSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutSessions'] });
      queryClient.invalidateQueries({ queryKey: ['workoutPlans'] });
    }
  });

  const handlePoseDetected = useCallback((detectedLandmarks) => {
    setLandmarks(detectedLandmarks);
  }, []);

  const handleRepComplete = useCallback((repData) => {
    setSessionData(prev => ({
      totalReps: prev.totalReps + 1,
      goodReps: prev.goodReps + (repData.isGoodForm ? 1 : 0),
      depthScores: [...prev.depthScores, repData.depth || 0],
      allIssues: [...prev.allIssues, ...repData.issues]
    }));
    if (repData.isGoodForm) toast.success('Great rep! 💪');
  }, []);

  const handleFeedbackUpdate = useCallback((newFeedback) => {
    setFeedback(newFeedback);
  }, []);

  const startWorkout = () => {
    setIsActive(true);
    startTimeRef.current = Date.now();
    setSessionData({
      totalReps: 0,
      goodReps: 0,
      depthScores: [],
      allIssues: []
    });
    toast.success('Workout started! Get into position.');
  };

  const stopWorkout = async () => {
    setIsActive(false);
    
    if (sessionData.totalReps === 0) {
      toast.info('No reps recorded');
      return;
    }

    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    const avgDepth = sessionData.depthScores.reduce((a, b) => a + b, 0) / sessionData.depthScores.length || 0;
    
    // Calculate form score based on good reps ratio
    const formScore = (sessionData.goodReps / sessionData.totalReps) * 100;
    
    // Get unique issues
    const commonIssues = [...new Set(sessionData.allIssues)];

    const workoutData = {
      date: new Date().toISOString(),
      exercise_type: selectedExercise?.id || 'squat',
      total_reps: sessionData.totalReps,
      good_reps: sessionData.goodReps,
      avg_depth_score: Math.round(avgDepth),
      avg_form_score: Math.round(formScore),
      common_issues: commonIssues,
      duration_seconds: duration
    };

    try {
      await saveSessionMutation.mutateAsync(workoutData);
      toast.success(`Workout saved! ${sessionData.totalReps} reps completed.`);
      setWorkoutSavedTick(t => t + 1);
    } catch (error) {
      toast.error('Failed to save workout');
    }
  };

  const resetWorkout = () => {
    setSessionData({
      totalReps: 0,
      goodReps: 0,
      depthScores: [],
      allIssues: []
    });
    startTimeRef.current = Date.now();
    toast.info('Workout reset');
  };

  const { repCount, holdSeconds } = useExerciseAnalyzer({
    landmarks,
    exerciseId: selectedExercise?.id || 'squat',
    onRepComplete: handleRepComplete,
    onFeedbackUpdate: handleFeedbackUpdate
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Fitness Coach</h1>
          <p className="text-gray-600">Real-time AI form analysis for any exercise</p>
        </div>

        {/* Streak Banner */}
        <StreakBanner onWorkoutSaved={workoutSavedTick > 0 ? workoutSavedTick : undefined} />

        {/* Exercise Selector */}
        {!isActive && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {selectedExercise && (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedExercise.name}</span>
                      <Badge variant="outline" className="text-xs">{selectedExercise.muscleGroup}</Badge>
                      <Badge className={`text-xs capitalize ${
                        selectedExercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        selectedExercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>{selectedExercise.difficulty}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{(selectedExercise.equipment || []).filter(e => e && e !== 'none').join(', ') || 'Bodyweight'}</p>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPicker(!showPicker)}>
                {showPicker ? 'Hide' : 'Change Exercise'}
              </Button>
            </div>
            {showPicker && (
              <ExercisePicker
                selectedId={selectedExercise?.id}
                onSelect={(ex) => { setSelectedExercise(ex); setShowPicker(false); }}
              />
            )}
            {selectedExercise && !showPicker && (
              <ExerciseVideo exerciseId={selectedExercise.id} exerciseName={selectedExercise.name} />
            )}
          </div>
        )}

        {/* Subscription Card */}
        {!isActive && <SubscriptionCard isSubscribed={false} />}

        {/* AI Workout Generator Toggle */}
        {!isActive && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowGenerator(!showGenerator)}
              variant="outline"
              className="border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showGenerator ? 'Hide' : 'Generate AI Workout'}
            </Button>
          </div>
        )}

        {/* AI Workout Generator */}
        {showGenerator && !isActive && (
          <AIWorkoutGenerator onWorkoutGenerated={handleWorkoutGenerated} />
        )}

        {/* Current Workout Display */}
        {currentWorkout && !isActive && (
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Workout: {currentWorkout.workout_name}</span>
                <Button
                  onClick={() => setCurrentWorkout(null)}
                  variant="ghost"
                  size="sm"
                >
                  Clear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {currentWorkout.description}
              </p>
              <div className="grid gap-2">
                {currentWorkout.exercises.map((exercise, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-xs text-gray-500">{exercise.target_muscles}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div>{exercise.sets} × {exercise.reps}</div>
                        <div className="text-xs text-gray-500">{exercise.rest_seconds}s rest</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-3">
          {!isActive ? (
            <Button 
              onClick={startWorkout}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Workout
            </Button>
          ) : (
            <>
              <Button 
                onClick={stopWorkout}
                size="lg"
                variant="destructive"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop & Save
              </Button>
              <Button 
                onClick={resetWorkout}
                size="lg"
                variant="outline"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Camera Feed</CardTitle>
              </CardHeader>
              <CardContent>
                {isActive ? (
                  <PoseDetector 
                    onPoseDetected={handlePoseDetected}
                    isActive={isActive}
                    feedback={feedback}
                    exerciseId={selectedExercise?.id || 'squat'}
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-900 rounded-lg flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-indigo-900/60" />
                    <Lock className="h-10 w-10 text-purple-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <p className="text-white font-semibold text-lg">Camera Feed Locked</p>
                      <p className="text-purple-300 text-sm mt-1">Subscribe to $10/month to unlock live AI form analysis</p>
                    </div>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 relative z-10"
                      onClick={() => toast.info('Enable backend functions in Dashboard → Settings to process payments.')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Unlock for $10/month
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feedback Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {isActive && feedback ? (
                 <FeedbackDisplay 
                   feedback={feedback}
                   repCount={repCount}
                   holdSeconds={holdSeconds}
                   sessionData={sessionData}
                   exerciseId={selectedExercise?.id || 'squat'}
                 />
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Start your workout to see feedback
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Form Analysis */}
        <FormIssuesPanel 
          currentIssues={feedback?.issues || []}
          issueDetails={feedback?.issueDetails || {}}
          isActive={isActive}
        />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Info className="h-4 w-4" /> How to Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                <li>Select your exercise from the picker above</li>
                <li>Allow camera access when prompted</li>
                <li>Position so your <strong>full body</strong> is visible ({selectedExercise?.cameraAngle || 'side view'})</li>
                <li>Click "Start Workout" and begin moving</li>
                <li>Follow real-time feedback to improve form</li>
                <li>Click "Stop & Save" to record your session</li>
              </ol>
              {selectedExercise?.tips && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="font-semibold text-blue-900 text-sm mb-1">Form Tips:</p>
                  <ul className="space-y-1">
                    {selectedExercise.tips.map((tip, i) => (
                      <li key={i} className="text-blue-800 text-sm flex items-start gap-1.5">
                        <span className="text-blue-400 mt-0.5">✓</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Tips */}
          <FormTipsCard />
        </div>
      </div>
    </div>
  );
}