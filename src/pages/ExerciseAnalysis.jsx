import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Play, RotateCcw, Square, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PoseDetector from '../components/fitness/PoseDetector';
import ExerciseVideo from '../components/fitness/ExerciseVideo';
import useExerciseAnalyzer from '../components/fitness/useExerciseAnalyzer';
import FeedbackDisplay from '../components/fitness/FeedbackDisplay';
import FormIssuesPanel from '../components/fitness/FormIssuesPanel';
import { getExercise } from '../components/fitness/exerciseDatabase';
import { localizeExercise } from '../components/fitness/exerciseTranslations';

const CAMERA_CHECKLIST = {
  lower_body: [
    'Keep hips, knees, and ankles visible',
    'Stand 2-3 meters from the camera',
    'Use a side or slight-angle view',
  ],
  upper_body: [
    'Keep shoulders, elbows, and wrists visible',
    'Leave some space above your head',
    'Face the camera or use a slight side angle',
  ],
  core: [
    'Keep torso and knees visible',
    'Use a side view whenever possible',
    'Avoid cutting off your shoulders or hips',
  ],
  full_body: [
    'Keep your full body visible from head to ankles',
    'Stand far enough back before starting',
    'Use the recommended angle shown below',
  ],
};

const ANALYSIS_STAGE_UI = {
  not_ready: {
    title: 'Camera not ready',
    tone: 'bg-red-50 border-red-200 text-red-800',
  },
  ready: {
    title: 'Camera ready',
    tone: 'bg-blue-50 border-blue-200 text-blue-800',
  },
  calibrating: {
    title: 'Calibrating start position',
    tone: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  counting: {
    title: 'Counting reps',
    tone: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
};

function getExerciseFocus(exercise) {
  const keypoints = exercise?.keypoints || [];
  const hasArms = keypoints.some((point) => point.includes('elbow') || point.includes('wrist'));
  const hasLegs = keypoints.some((point) => point.includes('knee') || point.includes('ankle'));

  if (hasArms && hasLegs) return 'full_body';
  if (hasArms) return 'upper_body';
  if (exercise?.muscleGroup === 'Core') return 'core';
  return 'lower_body';
}

export default function ExerciseAnalysis() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const { exerciseId } = useParams();
  const exercise = getExercise(exerciseId);
  const localizedExercise = exercise ? localizeExercise(exercise, language) : null;
  const [isActive, setIsActive] = useState(false);
  const [landmarks, setLandmarks] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sessionData, setSessionData] = useState({
    totalReps: 0,
    goodReps: 0,
    depthScores: [],
    allIssues: [],
    byExercise: {},
  });
  const startTimeRef = useRef(null);

  const handlePoseDetected = useCallback((detectedLandmarks) => {
    setLandmarks(detectedLandmarks);
  }, []);

  const handleRepComplete = useCallback((repData) => {
    const id = repData?.exerciseId || exerciseId;
    const isGoodForm = Boolean(repData?.isGoodForm);

    setSessionData((prev) => {
      const currentStats = prev.byExercise?.[id] || {
        totalReps: 0,
        goodReps: 0,
        allIssues: [],
      };

      return {
        totalReps: prev.totalReps + 1,
        goodReps: prev.goodReps + (isGoodForm ? 1 : 0),
        depthScores: [...prev.depthScores, repData?.depth || 0],
        allIssues: [...prev.allIssues, ...(repData?.issues || [])],
        byExercise: {
          ...(prev.byExercise || {}),
          [id]: {
            totalReps: currentStats.totalReps + 1,
            goodReps: currentStats.goodReps + (isGoodForm ? 1 : 0),
            allIssues: [...(currentStats.allIssues || []), ...(repData?.issues || [])],
          },
        },
      };
    });
  }, [exerciseId]);

  const handleFeedbackUpdate = useCallback((newFeedback) => {
    setFeedback(newFeedback);
  }, []);

  const { repCount, holdSeconds } = useExerciseAnalyzer({
    landmarks,
    exerciseId: exerciseId || 'squat',
    onRepComplete: handleRepComplete,
    onFeedbackUpdate: handleFeedbackUpdate,
  });

  const currentExerciseStats = sessionData.byExercise?.[exerciseId] || {
    totalReps: repCount || 0,
    goodReps: 0,
  };
  const analysisStage = feedback?.analysisStage || (isActive ? 'ready' : 'not_ready');
  const stageUi = ANALYSIS_STAGE_UI[analysisStage] || ANALYSIS_STAGE_UI.ready;
  const debug = feedback?.debug || {};

  const focus = useMemo(() => getExerciseFocus(exercise), [exercise]);
  const checklist = CAMERA_CHECKLIST[focus] || CAMERA_CHECKLIST.full_body;

  const startAnalysis = () => {
    startTimeRef.current = Date.now();
    setSessionData({
      totalReps: 0,
      goodReps: 0,
      depthScores: [],
      allIssues: [],
      byExercise: {},
    });
    setFeedback(null);
    setLandmarks(null);
    setIsActive(true);
  };

  const stopAnalysis = () => {
    setIsActive(false);
  };

  const resetAnalysis = () => {
    startTimeRef.current = Date.now();
    setSessionData({
      totalReps: 0,
      goodReps: 0,
      depthScores: [],
      allIssues: [],
      byExercise: {},
    });
    setFeedback(null);
    setLandmarks(null);
  };

  if (!exercise) {
    return <Navigate to="/exercisecatalog" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/exercisecatalog" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4" />
              Back to exercise catalog
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{localizedExercise.name}</h1>
            <p className="mt-1 text-sm text-gray-600">{localizedExercise.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">{localizedExercise.location}</Badge>
            <Badge variant="outline">{localizedExercise.muscleGroup}</Badge>
            <Badge variant="outline" className="capitalize">{localizedExercise.difficulty}</Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-500" />
                  Exercise Preparation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExerciseVideo exerciseId={exercise.id} exerciseName={localizedExercise.name} />
                <div className="rounded-lg border bg-blue-50 px-4 py-3">
                  <div className="text-sm font-semibold text-blue-900">Camera setup</div>
                  <div className="mt-1 text-sm text-blue-700">{exercise.cameraAngle}</div>
                  <ul className="mt-3 space-y-1.5 text-sm text-blue-800">
                    {checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-0.5 text-blue-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-3">
                  {!isActive ? (
                    <Button type="button" onClick={startAnalysis} className="bg-emerald-600 hover:bg-emerald-700">
                      <Play className="mr-2 h-4 w-4" />
                      Start AI Analysis
                    </Button>
                  ) : (
                    <>
                      <Button type="button" onClick={stopAnalysis} variant="destructive">
                        <Square className="mr-2 h-4 w-4" />
                        Stop Analysis
                      </Button>
                      <Button type="button" onClick={resetAnalysis} variant="outline">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Count
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  Live Exercise Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isActive ? (
                  <PoseDetector
                    onPoseDetected={handlePoseDetected}
                    isActive={isActive}
                    feedback={feedback}
                    exerciseId={exercise.id}
                  />
                ) : (
                  <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-lg bg-gray-950 px-4 text-center text-white">
                    <Camera className="h-10 w-10 text-emerald-400" />
                    <div>
                      <div className="text-lg font-semibold">Ready to count your reps</div>
                      <div className="mt-1 text-sm text-gray-300">
                        Start analysis after you set the correct camera angle for {localizedExercise.name}.
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <FormIssuesPanel
              currentIssues={feedback?.issues || []}
              issueDetails={feedback?.issueDetails || {}}
              isActive={isActive}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isActive && (
                  <div className={`rounded-lg border px-4 py-3 ${stageUi.tone}`}>
                    <div className="text-xs font-semibold uppercase tracking-wide">
                      Analysis status
                    </div>
                    <div className="mt-1 text-sm font-bold">{stageUi.title}</div>
                    {analysisStage === 'calibrating' && (
                      <div className="mt-2">
                        <div className="h-2 overflow-hidden rounded-full bg-white/80">
                          <div
                            className="h-full rounded-full bg-amber-500 transition-all duration-300"
                            style={{ width: `${debug.calibrationProgress ?? 0}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs">
                          Hold your start position for a moment: {debug.calibrationProgress ?? 0}%
                        </div>
                      </div>
                    )}
                    {feedback?.hint && (
                      <div className="mt-2 text-xs opacity-90">{feedback.hint}</div>
                    )}
                  </div>
                )}

                {isActive && feedback ? (
                  <FeedbackDisplay
                    feedback={feedback}
                    repCount={repCount}
                    holdSeconds={holdSeconds}
                    sessionData={sessionData}
                    currentExerciseStats={currentExerciseStats}
                    exerciseId={exercise.id}
                  />
                ) : (
                  <div className="py-10 text-center text-sm text-gray-500">
                    Start analysis to see rep counting and live form feedback.
                  </div>
                )}

                {isActive && (
                  <div className="rounded-lg border bg-gray-950 px-4 py-3 text-xs text-gray-100">
                    <div className="font-semibold uppercase tracking-wide text-gray-400">
                      Debug
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <div>
                        <div className="text-gray-400">Stage</div>
                        <div className="font-bold">{analysisStage}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Metric</div>
                        <div className="font-bold">{debug.counterMetric || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Phase</div>
                        <div className="font-bold">{debug.counterPhase || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Current</div>
                        <div className="font-bold">{debug.counterValue ?? '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Baseline</div>
                        <div className="font-bold">{debug.baselineValue ?? '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Frames</div>
                        <div className="font-bold">{debug.validFrameCount ?? 0}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-emerald-900">Current Set Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-emerald-900">
                <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                  <span>Total reps</span>
                  <span className="text-xl font-bold">{sessionData.totalReps}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                  <span>Clean reps</span>
                  <span className="text-xl font-bold">{sessionData.goodReps}</span>
                </div>
                <div className="rounded-lg bg-white px-3 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Form tips
                  </div>
                  <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                    {(exercise.tips || []).map((tip) => (
                      <li key={tip} className="flex items-start gap-2">
                        <span className="mt-0.5 text-emerald-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
