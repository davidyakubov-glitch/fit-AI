import { calcAngle, hasLandmarks } from './utils';

const REQUIRED = ['leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle'];
const MIN_VISIBILITY = 0.28;

function visibilityOk(landmarks) {
  return REQUIRED.every(k => (landmarks[k]?.visibility ?? 1) >= MIN_VISIBILITY);
}

export function analyzeSquat(landmarks, state) {
  if (!hasLandmarks(landmarks, REQUIRED)) return null;

  if (!visibilityOk(landmarks)) {
    return {
      nextState: state, repComplete: false, isGoodRep: false,
      issues: [], issueDetails: {},
      message: 'Adjust camera position — joints not clearly visible',
      formScore: null, lowConfidence: true,
      metrics: {}
    };
  }

  const leftKnee  = calcAngle(landmarks.leftHip,  landmarks.leftKnee,  landmarks.leftAnkle);
  const rightKnee = calcAngle(landmarks.rightHip, landmarks.rightKnee, landmarks.rightAnkle);
  const avgKnee   = (leftKnee + rightKnee) / 2;
  const kneeAsymmetry = Math.abs(leftKnee - rightKnee);

  const hasShoulders = landmarks.leftShoulder && landmarks.rightShoulder;
  const leftBack = hasShoulders
    ? calcAngle(landmarks.leftAnkle, landmarks.leftHip, landmarks.leftShoulder)
    : null;
  const rightBack = hasShoulders
    ? calcAngle(landmarks.rightAnkle, landmarks.rightHip, landmarks.rightShoulder)
    : null;
  const avgBack = Number.isFinite(leftBack) && Number.isFinite(rightBack)
    ? (leftBack + rightBack) / 2
    : null;

  const lKX = landmarks.leftKnee.x,  rKX = landmarks.rightKnee.x;
  const lAX = landmarks.leftAnkle.x, rAX = landmarks.rightAnkle.x;
  const lHX = landmarks.leftHip.x,   rHX = landmarks.rightHip.x;
  const ankleWidth = Math.abs(lAX - rAX);
  const hipWidth   = Math.abs(lHX - rHX);
  const hipHeightDiff = Math.abs(landmarks.leftHip.y - landmarks.rightHip.y);

  const depth = Math.max(0, Math.min(100, Math.round(((170 - avgKnee) / 80) * 100)));

  const issues = [];
  const issueDetails = {};

  if (state === 'down') {
    // Strict depth: must reach ≤100° (15° tolerance beyond that = flag)
    if (avgKnee > 100) {
      issues.push('insufficient_depth');
      issueDetails.insufficient_depth = {
        severity: avgKnee > 130 ? 'high' : 'medium',
        message: `Knee ${Math.round(avgKnee)}° — go deeper (target ≤ 100°)`
      };
    }

    // Knee cave: strictly compare knee vs ankle width
    const kneeWidth = Math.abs(lKX - rKX);
    if (kneeWidth < ankleWidth * 0.8) {
      issues.push('knees_caving');
      issueDetails.knees_caving = {
        severity: kneeWidth < ankleWidth * 0.6 ? 'high' : 'medium',
        message: 'Knees collapsing inward — drive them out over your pinky toes'
      };
    }

    // Forward lean: back angle < 60° is excessive
    if (avgBack != null && avgBack < 60) {
      issues.push('excessive_lean');
      issueDetails.excessive_lean = {
        severity: avgBack < 45 ? 'high' : 'medium',
        message: `Torso ${Math.round(avgBack)}° — keep chest up and back neutral`
      };
    }

    // Stance width
    if (ankleWidth < hipWidth * 0.7) {
      issues.push('stance_too_narrow');
      issueDetails.stance_too_narrow = {
        severity: 'medium',
        message: 'Feet too close — widen to shoulder-width'
      };
    }

    // Asymmetry: left/right knee difference > 15°
    if (kneeAsymmetry > 15) {
      issues.push('hip_shift');
      issueDetails.hip_shift = {
        severity: kneeAsymmetry > 25 ? 'high' : 'medium',
        message: `Knee asymmetry ${Math.round(kneeAsymmetry)}° — distribute weight evenly`
      };
    }
  }

  // Hip shift (both states)
  if (hipHeightDiff > 0.04) {
    if (!issues.includes('hip_shift')) {
      issues.push('hip_shift');
      issueDetails.hip_shift = {
        severity: hipHeightDiff > 0.07 ? 'high' : 'medium',
        message: 'Hips shifting laterally — keep weight centered'
      };
    }
  }

  // State machine
  let nextState = state;
  let repComplete = false;
  if (state === 'up'   && avgKnee < 145) { nextState = 'down'; }
  else if (state === 'down' && avgKnee > 162) { nextState = 'up'; repComplete = true; }

  // Strict score: only high/medium issues penalize
  const formScore = Math.max(0, 100 - issues.reduce((acc, k) => {
    const s = issueDetails[k]?.severity;
    return acc + (s === 'high' ? 35 : s === 'medium' ? 18 : 5);
  }, 0));

  // Strict coaching message — no positivity unless truly good
  let message;
  const highIssues = issues.filter(k => issueDetails[k]?.severity === 'high');
  if (state === 'up') {
    message = 'Squat down — feet shoulder-width, toes out slightly';
  } else if (highIssues.length > 0) {
    const top = highIssues[0];
    message = issueDetails[top]?.message || 'Fix form before continuing';
  } else if (avgKnee > 100) {
    message = `Deeper — knee at ${Math.round(avgKnee)}°, need ≤ 100°`;
  } else if (issues.length === 0) {
    message = `Knee ${Math.round(avgKnee)}° — drive through heels`;
  } else {
    message = issueDetails[issues[0]]?.message || 'Correct your form';
  }

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && depth >= 65 && issues.filter(i => issueDetails[i]?.severity !== 'low').length === 0,
    depth,
    primaryAngle: Math.round(avgKnee),
    issues,
    issueDetails,
    message,
    formScore,
    metrics: {
      kneeAngle: Math.round(avgKnee),
      backAngle: avgBack == null ? null : Math.round(avgBack),
      depth,
      formScore,
      kneeAsymmetry: Math.round(kneeAsymmetry),
    }
  };
}
