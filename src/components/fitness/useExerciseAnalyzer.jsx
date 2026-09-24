/**
 * Universal exercise analyzer hook with exponential smoothing
 * and form-consistency tracking across reps.
 */
import { useEffect, useRef, useState } from 'react';
import { getAnalyzer } from './exerciseAnalyzers/index';
import { validatePose } from './exerciseAnalyzers/validationGate';
import { analyzeBiomechanics } from './exerciseAnalyzers/biomechanics';

const SMOOTH = 0.35;
const VALIDATION_GRACE_FRAMES = 6;
const REP_COOLDOWN_MS = 500;
const GOOD_REP_MIN_SCORE = 70;
const CALIBRATION_FRAMES = 18;

const BAD_SEVERITIES = new Set(['high']);

const REP_COUNTERS = {
  squat: { metric: 'kneeAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 18 },
  barbell_squat: { metric: 'kneeAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 18 },
  single_leg_squat: { metric: 'kneeAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  jump_squat: { metric: 'kneeAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  lunge: { metric: 'frontKneeAngle', fallbackMetric: 'kneeAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  leg_press: { metric: 'kneeAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  leg_curl: { metric: 'kneeAngle', direction: 'decrease', engageDelta: 8, returnDelta: 5, minTravel: 14 },
  pushup: { metric: 'elbowAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  push_up: { metric: 'elbowAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  bench_press: { metric: 'elbowAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  bicep_curl: { metric: 'elbowAngle', direction: 'decrease', engageDelta: 12, returnDelta: 8, minTravel: 22 },
  lat_pulldown: { metric: 'elbowAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 18 },
  pull_up: { metric: 'elbowAngle', direction: 'decrease', engageDelta: 12, returnDelta: 8, minTravel: 20 },
  barbell_row: { metric: 'elbowAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  shoulder_press: { metric: 'elbowAngle', direction: 'increase', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  tricep_extension: { metric: 'elbowAngle', direction: 'increase', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  leg_extension: { metric: 'kneeAngle', direction: 'increase', engageDelta: 10, returnDelta: 6, minTravel: 16 },
  glute_bridge: { metric: 'hipAngle', fallbackMetric: 'spineAngle', direction: 'increase', engageDelta: 8, returnDelta: 5, minTravel: 14 },
  deadlift: { metric: 'hipAngle', fallbackMetric: 'backAngle', direction: 'increase', engageDelta: 8, returnDelta: 5, minTravel: 14 },
  situp: { metric: 'torsoAngle', fallbackMetric: 'hipAngle', direction: 'decrease', engageDelta: 8, returnDelta: 5, minTravel: 14 },
  sit_up: { metric: 'torsoAngle', fallbackMetric: 'hipAngle', direction: 'decrease', engageDelta: 8, returnDelta: 5, minTravel: 14 },
};

function getCounterConfig(exerciseId, metrics = {}) {
  const direct = REP_COUNTERS[exerciseId];
  if (direct) return direct;
  if (Number.isFinite(metrics.elbowAngle)) {
    return { metric: 'elbowAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 };
  }
  if (Number.isFinite(metrics.kneeAngle)) {
    return { metric: 'kneeAngle', direction: 'decrease', engageDelta: 10, returnDelta: 6, minTravel: 16 };
  }
  if (Number.isFinite(metrics.hipAngle)) {
    return { metric: 'hipAngle', direction: 'increase', engageDelta: 8, returnDelta: 5, minTravel: 14 };
  }
  return null;
}

function getMetricValue(metrics = {}, config) {
  const value = metrics[config.metric];
  if (Number.isFinite(value)) return value;
  const fallback = metrics[config.fallbackMetric];
  return Number.isFinite(fallback) ? fallback : null;
}

function accumulateCalibration(ref, metrics = {}) {
  Object.entries(metrics).forEach(([key, value]) => {
    if (!Number.isFinite(value)) return;
    const current = ref[key] || { sum: 0, count: 0 };
    ref[key] = {
      sum: current.sum + value,
      count: current.count + 1,
    };
  });
}

function finalizeCalibration(accumulator = {}) {
  return Object.fromEntries(
    Object.entries(accumulator)
      .filter(([, entry]) => entry.count > 0)
      .map(([key, entry]) => [key, Math.round(entry.sum / entry.count)])
  );
}

function updateMotionCounter(counter, exerciseId, metrics, baselineMetrics) {
  const config = getCounterConfig(exerciseId, metrics);
  if (!config) return { repComplete: false, inMotion: false };

  const value = getMetricValue(metrics, config);
  if (!Number.isFinite(value)) return { repComplete: false, inMotion: false };
  const baselineValue = getMetricValue(baselineMetrics || {}, config);
  if (!Number.isFinite(baselineValue)) {
    return { repComplete: false, inMotion: false, metric: config.metric, value };
  }

  let phase = counter.phase || 'start';
  let repComplete = false;
  const minTravel = config.minTravel ?? 16;
  const engageDelta = config.engageDelta ?? Math.max(8, Math.round(minTravel * 0.5));
  const returnDelta = config.returnDelta ?? Math.max(5, Math.round(engageDelta * 0.6));
  const displacement = value - baselineValue;
  const movedAway =
    config.direction === 'decrease'
      ? displacement <= -engageDelta
      : displacement >= engageDelta;
  const backNearBaseline = Math.abs(displacement) <= returnDelta;

  if (phase === 'start' && movedAway) {
    phase = 'active';
    counter.extremeValue = value;
  }

  if (phase === 'active') {
    counter.extremeValue = Number.isFinite(counter.extremeValue)
      ? (config.direction === 'decrease'
          ? Math.min(counter.extremeValue, value)
          : Math.max(counter.extremeValue, value))
      : value;

    const travel = Math.abs((counter.extremeValue ?? value) - baselineValue);
    if (travel >= minTravel && backNearBaseline) {
      phase = 'start';
      repComplete = true;
      counter.extremeValue = null;
    }
  } else if (phase === 'start') {
    counter.extremeValue = null;
  }

  counter.phase = phase;
  counter.lastValue = value;
  counter.metric = config.metric;

  return {
    repComplete,
    inMotion: phase === 'active',
    metric: config.metric,
    value,
    baselineValue: Math.round(baselineValue),
    thresholdLow: config.direction === 'decrease' ? Math.round(baselineValue - engageDelta) : Math.round(baselineValue - returnDelta),
    thresholdHigh: config.direction === 'increase' ? Math.round(baselineValue + engageDelta) : Math.round(baselineValue + returnDelta),
  };
}

function smoothMetrics(prev, next) {
  if (!prev || !next) return next;
  const result = { ...next };
  for (const key of Object.keys(next)) {
    if (typeof next[key] === 'number' && typeof prev[key] === 'number') {
      result[key] = Math.round(prev[key] * (1 - SMOOTH) + next[key] * SMOOTH);
    }
  }
  return result;
}

function mergeAnalyzerResult(result, biomechanics) {
  if (!biomechanics) return result;

  if (!result) {
    return {
      nextState: 'tracking',
      repComplete: false,
      isGoodRep: biomechanics.issues.length === 0,
      issues: biomechanics.issues,
      issueDetails: biomechanics.issueDetails,
      message: biomechanics.message || 'Tracking full-body angles',
      formScore: biomechanics.formScore,
      metrics: biomechanics.metrics,
      primaryAngle: biomechanics.metrics?.kneeAngle ?? biomechanics.metrics?.elbowAngle ?? null,
      lowConfidence: false,
    };
  }

  const issueDetails = {
    ...(result.issueDetails || {}),
    ...(biomechanics.issueDetails || {}),
  };

  const issues = [...new Set([...(result.issues || []), ...(biomechanics.issues || [])])];
  const topBiomechIssue =
    biomechanics.issues?.find((key) => biomechanics.issueDetails?.[key]?.severity === 'high') ||
    biomechanics.issues?.[0];

  return {
    ...result,
    issues,
    issueDetails,
    message:
      topBiomechIssue && biomechanics.issueDetails?.[topBiomechIssue]?.severity === 'high'
        ? biomechanics.issueDetails[topBiomechIssue].message
        : result.message || biomechanics.message,
    formScore:
      result.formScore != null && biomechanics.formScore != null
        ? Math.min(result.formScore, biomechanics.formScore)
        : result.formScore ?? biomechanics.formScore,
    metrics: {
      ...(biomechanics.metrics || {}),
      ...(result.metrics || {}),
      formScore:
        result.formScore != null && biomechanics.formScore != null
          ? Math.min(result.formScore, biomechanics.formScore)
          : result.formScore ?? biomechanics.formScore,
    },
  };
}

function hasBadIssue(issues = [], issueDetails = {}) {
  return issues.some((key) => BAD_SEVERITIES.has(issueDetails[key]?.severity));
}

function useExerciseAnalyzer({ exerciseId, landmarks, onRepComplete, onFeedbackUpdate }) {
  const analyzer      = getAnalyzer(exerciseId);
  const stateRef      = useRef(analyzer.initialState);
  const [repCount,    setRepCount]    = useState(0);
  const [holdSeconds, setHoldSeconds] = useState(0);

  const repCountRef   = useRef(0);
  const holdTimerRef  = useRef(null);
  const prevMetrics   = useRef(null);
  const calibrationAccumulatorRef = useRef({});
  const baselineMetricsRef = useRef(null);
  const invalidFrameCountRef = useRef(0);
  const validFrameCountRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastRepAtRef = useRef(0);
  const motionCounterRef = useRef({ phase: 'start', lastValue: null, metric: null });
  const activeRepRef = useRef({
    started: false,
    startFrame: 0,
    minScore: 100,
    hadBadIssue: false,
  });

  // Track last N rep form scores for degradation detection
  const repScoreHistory = useRef([]);

  // Reset on exercise change
  useEffect(() => {
    stateRef.current = analyzer.initialState;
    repCountRef.current = 0;
    prevMetrics.current = null;
    calibrationAccumulatorRef.current = {};
    baselineMetricsRef.current = null;
    invalidFrameCountRef.current = 0;
    validFrameCountRef.current = 0;
    frameCountRef.current = 0;
    lastRepAtRef.current = 0;
    motionCounterRef.current = { phase: 'start', lastValue: null, metric: null };
    activeRepRef.current = {
      started: false,
      startFrame: 0,
      minScore: 100,
      hadBadIssue: false,
    };
    repScoreHistory.current = [];
    setRepCount(0);
    setHoldSeconds(0);
    clearInterval(holdTimerRef.current);
  }, [exerciseId]);

  // Hold timer for timed exercises
  useEffect(() => {
    if (analyzer.isTimeBased && landmarks) {
      holdTimerRef.current = setInterval(() => setHoldSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(holdTimerRef.current);
  }, [analyzer.isTimeBased, !!landmarks]);

  useEffect(() => {
    if (!landmarks) {
      motionCounterRef.current = { phase: 'start', lastValue: null, metric: null, extremeValue: null };
      activeRepRef.current = {
        started: false,
        startFrame: 0,
        minScore: 100,
        hadBadIssue: false,
      };
      onFeedbackUpdate?.({
        state: stateRef.current,
        message: 'No body detected',
        hint: 'Stand in front of the camera to begin calibration.',
        issues: [],
        issueDetails: {},
        metrics: {},
        primaryAngle: null,
        formScore: null,
        lowConfidence: true,
        isTimeBased: analyzer.isTimeBased,
        isDegrading: false,
        notAssessable: true,
        analysisStage: 'not_ready',
        debug: {
          exerciseId,
          calibrated: false,
          calibrationProgress: 0,
          validFrameCount: validFrameCountRef.current,
          invalidFrameCount: invalidFrameCountRef.current,
        },
      });
      return;
    }
    frameCountRef.current += 1;

    // Run validation as a feedback hint. Reps are still counted from visible movement.
    const rejection = validatePose(landmarks, exerciseId);
    invalidFrameCountRef.current = rejection ? invalidFrameCountRef.current + 1 : 0;
    if (!rejection) {
      validFrameCountRef.current += 1;
    }

    const biomechanics = analyzeBiomechanics(landmarks);
    const result = mergeAnalyzerResult(
      analyzer.analyze(landmarks, stateRef.current, { holdSeconds }),
      biomechanics
    );
    if (!result) return;

    const previousState = stateRef.current;
    stateRef.current = result.nextState;
    const currentFrame = frameCountRef.current;
    const score = result.formScore ?? result.metrics?.formScore;
    const hasCurrentBadIssue = hasBadIssue(result.issues, result.issueDetails);
    const shouldCalibrate =
      !baselineMetricsRef.current &&
      !rejection &&
      !analyzer.isTimeBased;

    if (shouldCalibrate) {
      accumulateCalibration(calibrationAccumulatorRef.current, result.metrics);
      if (validFrameCountRef.current >= CALIBRATION_FRAMES) {
        baselineMetricsRef.current = finalizeCalibration(calibrationAccumulatorRef.current);
      }
    }

    const motion = updateMotionCounter(
      motionCounterRef.current,
      exerciseId,
      result.metrics,
      baselineMetricsRef.current
    );
    const calibrationProgress = Math.min(
      100,
      Math.round((validFrameCountRef.current / CALIBRATION_FRAMES) * 100)
    );
    const analysisStage = rejection && invalidFrameCountRef.current >= VALIDATION_GRACE_FRAMES
      ? 'not_ready'
      : !baselineMetricsRef.current
        ? (validFrameCountRef.current < 4 ? 'ready' : 'calibrating')
        : 'counting';
    const canCountRep = analysisStage === 'counting' && !rejection;

    const repMovedAwayFromStart =
      motion.inMotion ||
      result.nextState !== analyzer.initialState ||
      previousState !== analyzer.initialState;

    if (!analyzer.isTimeBased && repMovedAwayFromStart && !activeRepRef.current.started) {
      activeRepRef.current = {
        started: true,
        startFrame: currentFrame,
        minScore: Number.isFinite(score) ? score : 100,
        hadBadIssue: hasCurrentBadIssue,
      };
    }

    if (activeRepRef.current.started) {
      activeRepRef.current.minScore = Math.min(
        activeRepRef.current.minScore,
        Number.isFinite(score) ? score : activeRepRef.current.minScore
      );
      activeRepRef.current.hadBadIssue =
        activeRepRef.current.hadBadIssue || hasCurrentBadIssue;
    }

    const repComplete = canCountRep && (result.repComplete || motion.repComplete);

    if (repComplete) {
      const now = Date.now();
      const activeRep = activeRepRef.current.started
        ? activeRepRef.current
        : {
            started: true,
            startFrame: currentFrame,
            minScore: Number.isFinite(score) ? score : 100,
            hadBadIssue: hasCurrentBadIssue,
          };
      const accepted = now - lastRepAtRef.current >= REP_COOLDOWN_MS;

      activeRepRef.current = {
        started: false,
        startFrame: currentFrame,
        minScore: 100,
        hadBadIssue: false,
      };

      const stableGoodRep =
        !activeRep.hadBadIssue &&
        !hasCurrentBadIssue &&
        activeRep.minScore >= GOOD_REP_MIN_SCORE;

      if (accepted) {
        lastRepAtRef.current = now;
        repCountRef.current += 1;
        setRepCount(repCountRef.current);

        // Track rep scores for consistency
        if (result.formScore != null) {
          repScoreHistory.current = [...repScoreHistory.current.slice(-4), result.formScore];
        }

        onRepComplete?.({
          rep: repCountRef.current,
          isGoodRep: stableGoodRep,
          isGoodForm: stableGoodRep,
          issues: result.issues,
          metrics: result.metrics,
          depth: result.metrics?.depth ?? 0,
          exerciseId,
          minFormScore: Math.round(activeRep.minScore),
        });
      }
    }

    const smoothed = smoothMetrics(prevMetrics.current, result.metrics);
    prevMetrics.current = smoothed;

    // Detect degradation: last 3 reps trending down
    const history = repScoreHistory.current;
    const isDegrading = history.length >= 3
      && history[history.length - 1] < history[history.length - 3] - 15;

    onFeedbackUpdate?.({
      state:         result.nextState,
      message:
        rejection && invalidFrameCountRef.current >= VALIDATION_GRACE_FRAMES
          ? rejection.message
          : result.message,
      hint:
        rejection && invalidFrameCountRef.current >= VALIDATION_GRACE_FRAMES
          ? rejection.hint
          : null,
      issues:        result.issues,
      issueDetails:  result.issueDetails,
      metrics:       smoothed,
      primaryAngle:  result.primaryAngle,
      formScore:     smoothed?.formScore ?? result.formScore,
      lowConfidence:
        result.lowConfidence ||
        (rejection && invalidFrameCountRef.current >= VALIDATION_GRACE_FRAMES),
      isTimeBased:   analyzer.isTimeBased,
      isDegrading,
      notAssessable: rejection && invalidFrameCountRef.current >= VALIDATION_GRACE_FRAMES,
      analysisStage,
      debug: {
        exerciseId,
        calibrated: Boolean(baselineMetricsRef.current),
        calibrationProgress,
        validFrameCount: validFrameCountRef.current,
        invalidFrameCount: invalidFrameCountRef.current,
        counterMetric: motion.metric,
        counterValue: motion.value != null ? Math.round(motion.value) : null,
        baselineValue: motion.baselineValue,
        thresholdLow: motion.thresholdLow != null ? Math.round(motion.thresholdLow) : null,
        thresholdHigh: motion.thresholdHigh != null ? Math.round(motion.thresholdHigh) : null,
        counterPhase: motionCounterRef.current.phase,
      },
      // legacy fields
      depth:       smoothed?.depth       ?? 0,
      kneeAngle:   smoothed?.kneeAngle   ?? result.primaryAngle ?? 0,
      backAngle:   smoothed?.backAngle   ?? 0,
      elbowAngle:  smoothed?.elbowAngle  ?? 0,
      spineAngle:  smoothed?.spineAngle  ?? 0,
    });
  }, [landmarks]);

  return { repCount, holdSeconds, isTimedHold: analyzer.isTimeBased };
}

export default useExerciseAnalyzer;
