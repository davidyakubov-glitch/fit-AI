/**
 * Universal exercise analyzer hook with exponential smoothing
 * and form-consistency tracking across reps.
 */
import { useEffect, useRef, useState } from 'react';
import { getAnalyzer } from './exerciseAnalyzers/index';
import { validatePose } from './exerciseAnalyzers/validationGate';

const SMOOTH = 0.35;

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

function useExerciseAnalyzer({ exerciseId, landmarks, onRepComplete, onFeedbackUpdate }) {
  const analyzer      = getAnalyzer(exerciseId);
  const stateRef      = useRef(analyzer.initialState);
  const [repCount,    setRepCount]    = useState(0);
  const [holdSeconds, setHoldSeconds] = useState(0);

  const repCountRef   = useRef(0);
  const holdTimerRef  = useRef(null);
  const prevMetrics   = useRef(null);

  // Track last N rep form scores for degradation detection
  const repScoreHistory = useRef([]);

  // Reset on exercise change
  useEffect(() => {
    stateRef.current = analyzer.initialState;
    repCountRef.current = 0;
    prevMetrics.current = null;
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
    if (!landmarks) return;

    // Run validation gate BEFORE the analyzer
    const rejection = validatePose(landmarks, exerciseId);
    if (rejection) {
      onFeedbackUpdate?.({
        state:         stateRef.current,
        message:       rejection.message,
        hint:          rejection.hint,
        issues:        [],
        issueDetails:  {},
        metrics:       {},
        primaryAngle:  null,
        formScore:     null,
        lowConfidence: true,
        isTimeBased:   analyzer.isTimeBased,
        isDegrading:   false,
        notAssessable: true,
        depth: 0, kneeAngle: 0, backAngle: 0, elbowAngle: 0, spineAngle: 0,
      });
      return;
    }

    const result = analyzer.analyze(landmarks, stateRef.current);
    if (!result) return;

    stateRef.current = result.nextState;

    if (result.repComplete) {
      repCountRef.current += 1;
      setRepCount(repCountRef.current);

      // Track rep scores for consistency
      if (result.formScore != null) {
        repScoreHistory.current = [...repScoreHistory.current.slice(-4), result.formScore];
      }

      onRepComplete?.({
        rep: repCountRef.current,
        isGoodRep: result.isGoodRep,
        isGoodForm: result.isGoodRep,
        issues: result.issues,
        metrics: result.metrics,
        depth: result.metrics?.depth ?? 0,
      });
    }

    const smoothed = smoothMetrics(prevMetrics.current, result.metrics);
    prevMetrics.current = smoothed;

    // Detect degradation: last 3 reps trending down
    const history = repScoreHistory.current;
    const isDegrading = history.length >= 3
      && history[history.length - 1] < history[history.length - 3] - 15;

    onFeedbackUpdate?.({
      state:         result.nextState,
      message:       result.message,
      issues:        result.issues,
      issueDetails:  result.issueDetails,
      metrics:       smoothed,
      primaryAngle:  result.primaryAngle,
      formScore:     smoothed?.formScore ?? result.formScore,
      lowConfidence: result.lowConfidence ?? false,
      isTimeBased:   analyzer.isTimeBased,
      isDegrading,
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