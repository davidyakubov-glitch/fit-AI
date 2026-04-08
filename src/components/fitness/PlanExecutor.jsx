import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play, Square, RotateCcw, ChevronRight, CheckCircle2,
  Clock, Dumbbell, SkipForward, Pause
} from 'lucide-react';
import { toast } from 'sonner';
import PoseDetector from './PoseDetector';
import SquatAnalyzer from './SquatAnalyzer';
import FeedbackDisplay from './FeedbackDisplay';
import ExerciseVideo from './ExerciseVideo';
import { getExercise } from './exerciseDatabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

// Rest timer component
function RestTimer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onDone]);

  const pct = ((seconds - remaining) / seconds) * 100;
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="text-6xl font-bold text-purple-600">{remaining}</div>
      <p className="text-gray-600 font-medium">Rest Time</p>
      <Progress value={pct} className="w-full h-3" />
      <Button variant="outline" size="sm" onClick={onDone}>Skip Rest</Button>
    </div>
  );
}

export default function PlanExecutor({ plan, onFinish, onCancel }) {
  const [phase, setPhase] = useState('intro'); // intro | exercise | rest | done
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [landmarks, setLandmarks] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sessionData, setSessionData] = useState({ totalReps: 0, goodReps: 0, depthScores: [], allIssues: [] });
  const [exerciseLogs, setExerciseLogs] = useState([]); // per-exercise summaries
  const [elapsed, setElapsed] = useState(0);

  const startTimeRef = useRef(null);
  const elapsedRef = useRef(null);
  const queryClient = useQueryClient();

  const currentExerciseDef = plan.exercises[exerciseIdx];
  const currentExercise = getExercise(currentExerciseDef?.exercise_id);
  const totalExercises = plan.exercises.length;
  const totalSets = currentExerciseDef?.sets || 1;
  const progressPct = Math.round(((exerciseIdx * totalSets + setIdx) / (totalExercises * totalSets)) * 100);

  useEffect(() => {
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    startTimeRef.current = Date.now();
    return () => clearInterval(elapsedRef.current);
  }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const savePlanMutation = useMutation({
    mutationFn: (data) => base44.entities.StructuredPlan.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planHistory'] });
    }
  });

  const saveSessionMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkoutSession.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workoutSessions'] })
  });

  const handlePoseDetected = useCallback((lm) => setLandmarks(lm), []);

  const handleRepComplete = useCallback((repData) => {
    setSessionData(prev => ({
      totalReps: prev.totalReps + 1,
      goodReps: prev.goodReps + (repData.isGoodForm ? 1 : 0),
      depthScores: [...prev.depthScores, repData.depth],
      allIssues: [...prev.allIssues, ...repData.issues]
    }));
    if (repData.isGoodForm) toast.success('Great rep! 💪', { duration: 1200 });
  }, []);

  const handleFeedbackUpdate = useCallback((f) => setFeedback(f), []);

  const { repCount } = SquatAnalyzer({
    landmarks: isRecording ? landmarks : null,
    onSquatComplete: handleRepComplete,
    onFeedbackUpdate: handleFeedbackUpdate
  });

  const finishSet = () => {
    setIsRecording(false);
    const isLastSet = setIdx + 1 >= totalSets;
    const isLastExercise = exerciseIdx + 1 >= totalExercises;

    // Log exercise session
    const formScore = sessionData.totalReps > 0 ? (sessionData.goodReps / sessionData.totalReps) * 100 : 0;
    saveSessionMutation.mutate({
      date: new Date().toISOString(),
      exercise_type: currentExerciseDef.exercise_id,
      total_reps: sessionData.totalReps,
      good_reps: sessionData.goodReps,
      avg_form_score: Math.round(formScore),
      duration_seconds: Math.round((Date.now() - startTimeRef.current) / 1000)
    });

    setExerciseLogs(prev => [...prev, {
      name: currentExerciseDef.exercise_name,
      sets: setIdx + 1,
      reps: sessionData.totalReps,
      formScore: Math.round(formScore)
    }]);

    setSessionData({ totalReps: 0, goodReps: 0, depthScores: [], allIssues: [] });

    if (isLastExercise && isLastSet) {
      finishPlan();
    } else if (isLastSet) {
      setExerciseIdx(i => i + 1);
      setSetIdx(0);
      setPhase('rest');
    } else {
      setSetIdx(s => s + 1);
      setPhase('rest');
    }
  };

  const finishPlan = async () => {
    clearInterval(elapsedRef.current);
    setPhase('done');
    const totalDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
    await savePlanMutation.mutateAsync({
      name: plan.name,
      description: plan.description,
      goal: plan.goal,
      difficulty: plan.difficulty,
      exercises: plan.exercises,
      source: plan.source || 'preset',
      completed_date: new Date().toISOString(),
      exercises_completed: totalExercises,
      total_reps_completed: exerciseLogs.reduce((s, e) => s + e.reps, 0) + sessionData.totalReps,
      duration_seconds: totalDuration
    });
    toast.success('Workout complete! Great job! 🎉');
  };

  const startSet = () => {
    setIsRecording(true);
    setPhase('exercise');
    startTimeRef.current = Date.now();
  };

  const skipExercise = () => {
    setIsRecording(false);
    const isLast = exerciseIdx + 1 >= totalExercises;
    if (isLast) { finishPlan(); return; }
    setExerciseIdx(i => i + 1);
    setSetIdx(0);
    setPhase('rest');
    setSessionData({ totalReps: 0, goodReps: 0, depthScores: [], allIssues: [] });
    toast.info('Exercise skipped');
  };

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <p className="text-gray-600">{plan.description}</p>
            <div className="flex gap-2 flex-wrap mt-2">
              <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{plan.estimated_duration_minutes} min</Badge>
              <Badge variant="outline"><Dumbbell className="h-3 w-3 mr-1" />{plan.exercises.length} exercises</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-semibold text-gray-800">Exercises in this plan:</p>
            {plan.exercises.map((ex, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <span className="font-medium">{i + 1}. {ex.exercise_name}</span>
                  {ex.notes && <p className="text-xs text-gray-500">{ex.notes}</p>}
                </div>
                <Badge variant="outline">{ex.sets} × {ex.reps}</Badge>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setPhase('exercise')} size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                <Play className="h-5 w-5 mr-2" /> Start Workout
              </Button>
              <Button onClick={onCancel} variant="outline" size="lg">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const totalReps = exerciseLogs.reduce((s, e) => s + e.reps, 0);
    const avgForm = exerciseLogs.length > 0
      ? Math.round(exerciseLogs.reduce((s, e) => s + e.formScore, 0) / exerciseLogs.length)
      : 0;
    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardContent className="pt-8 pb-6 text-center space-y-6">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{plan.name}</h2>
            <p className="text-gray-600 mt-1">Workout Complete!</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-purple-600">{formatTime(elapsed)}</div>
              <div className="text-sm text-gray-500">Duration</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-green-600">{totalReps}</div>
              <div className="text-sm text-gray-500">Total Reps</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-blue-600">{avgForm}%</div>
              <div className="text-sm text-gray-500">Avg Form</div>
            </div>
          </div>
          <div className="space-y-2 text-left">
            <p className="font-semibold text-gray-800">Exercise Summary:</p>
            {exerciseLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm font-medium">{log.name}</span>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>{log.sets} sets · {log.reps} reps</span>
                  <Badge className={`${log.formScore >= 80 ? 'bg-green-100 text-green-800' : log.formScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {log.formScore}% form
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={onFinish} size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
            Back to Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── REST ───────────────────────────────────────────────────────────────────
  if (phase === 'rest') {
    const nextEx = plan.exercises[exerciseIdx];
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rest Time</CardTitle>
          <p className="text-sm text-gray-600">Up next: <strong>{nextEx?.exercise_name}</strong> — Set {setIdx + 1}/{nextEx?.sets}</p>
        </CardHeader>
        <CardContent>
          <RestTimer
            seconds={currentExerciseDef?.rest_seconds || 60}
            onDone={startSet}
          />
        </CardContent>
      </Card>
    );
  }

  // ── EXERCISE ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <Progress value={progressPct} className="flex-1 h-2" />
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {exerciseIdx + 1}/{totalExercises} · {formatTime(elapsed)}
        </span>
      </div>

      {/* Exercise Header */}
      <Card className="border-purple-200">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                Exercise {exerciseIdx + 1} of {totalExercises}
              </p>
              <CardTitle className="text-xl mt-1">{currentExerciseDef.exercise_name}</CardTitle>
              <p className="text-gray-600 text-sm mt-1">{currentExercise?.description}</p>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              Set {setIdx + 1}/{totalSets}
            </Badge>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline"><Dumbbell className="h-3 w-3 mr-1" />{currentExerciseDef.reps} reps</Badge>
            {currentExerciseDef.notes && (
              <Badge variant="outline" className="text-xs">{currentExerciseDef.notes}</Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Camera + Feedback */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-2">
              {isRecording ? (
                <PoseDetector onPoseDetected={handlePoseDetected} isActive={isRecording} />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg gap-4">
                  {currentExercise && (
                    <ExerciseVideo exerciseId={currentExercise.id} exerciseName={currentExercise.name} />
                  )}
                  <Button onClick={startSet} size="lg" className="bg-green-600 hover:bg-green-700">
                    <Play className="h-5 w-5 mr-2" /> Start Set {setIdx + 1}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardContent className="pt-4">
              {isRecording && feedback ? (
                <FeedbackDisplay feedback={feedback} repCount={repCount} sessionData={sessionData} />
              ) : (
                <div className="space-y-3 py-4">
                  <p className="font-semibold text-sm text-gray-800">Form Tips:</p>
                  {currentExercise?.tips?.map((tip, i) => (
                    <p key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-green-500">✓</span>{tip}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      {isRecording && (
        <div className="flex gap-3">
          <Button onClick={finishSet} size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700">
            <CheckCircle2 className="h-5 w-5 mr-2" /> Complete Set
          </Button>
          <Button onClick={skipExercise} variant="outline" size="lg">
            <SkipForward className="h-5 w-5 mr-1" /> Skip
          </Button>
          <Button onClick={onCancel} variant="ghost" size="lg">
            <Square className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}