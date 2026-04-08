import { calcAngle, hasLandmarks } from './utils';

const REQUIRED = ['leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle','leftShoulder','rightShoulder'];
const MIN_VISIBILITY = 0.55;

function visibilityOk(landmarks) {
  return REQUIRED.every(k => (landmarks[k]?.visibility ?? 1) >= MIN_VISIBILITY);
}

export function analyzeLunge(landmarks, state) {
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

  const frontKnee = Math.min(leftKnee, rightKnee);
  const backKnee  = Math.max(leftKnee, rightKnee);

  const leftBack  = calcAngle(landmarks.leftAnkle,  landmarks.leftHip,  landmarks.leftShoulder);
  const rightBack = calcAngle(landmarks.rightAnkle, landmarks.rightHip, landmarks.rightShoulder);
  const avgBack   = (leftBack + rightBack) / 2;

  const hipHeightDiff = Math.abs(landmarks.leftHip.y - landmarks.rightHip.y);

  const frontIsLeft = leftKnee < rightKnee;
  const frontKneeLandmark  = frontIsLeft ? landmarks.leftKnee  : landmarks.rightKnee;
  const frontAnkleLandmark = frontIsLeft ? landmarks.leftAnkle : landmarks.rightAnkle;
  const kneeAnkleForward   = Math.abs(frontKneeLandmark.x - frontAnkleLandmark.x);

  const issues = [];
  const issueDetails = {};

  if (state === 'down') {
    // Strict depth: front knee must reach ≤105°
    if (frontKnee > 105) {
      issues.push('insufficient_depth');
      issueDetails.insufficient_depth = {
        severity: frontKnee > 125 ? 'high' : 'medium',
        message: `Front knee ${Math.round(frontKnee)}° — lunge deeper (target ~90°)`
      };
    }

    // Knee past toes
    if (kneeAnkleForward > 0.055) {
      issues.push('knee_too_forward');
      issueDetails.knee_too_forward = {
        severity: 'high',
        message: 'Front knee past toes — step further forward, keep shin vertical'
      };
    }

    // Back leg extension
    if (backKnee < 135) {
      issues.push('back_leg_bent');
      issueDetails.back_leg_bent = {
        severity: backKnee < 110 ? 'medium' : 'low',
        message: `Back leg ${Math.round(backKnee)}° — extend rear leg fully`
      };
    }

    // Torso upright: strict > 65°
    if (avgBack < 65) {
      issues.push('excessive_lean');
      issueDetails.excessive_lean = {
        severity: avgBack < 45 ? 'high' : 'medium',
        message: `Torso at ${Math.round(avgBack)}° — stand tall, chest up`
      };
    }
  }

  // Hip level
  if (hipHeightDiff > 0.045) {
    issues.push('hip_shift');
    issueDetails.hip_shift = {
      severity: hipHeightDiff > 0.07 ? 'high' : 'medium',
      message: 'Hips uneven — keep them level and squared forward'
    };
  }

  let nextState = state;
  let repComplete = false;
  if (state === 'up'   && frontKnee < 135) { nextState = 'down'; }
  else if (state === 'down' && frontKnee > 158) { nextState = 'up'; repComplete = true; }

  const formScore = Math.max(0, 100 - issues.reduce((acc, k) => {
    const s = issueDetails[k]?.severity;
    return acc + (s === 'high' ? 35 : s === 'medium' ? 18 : 5);
  }, 0));

  const highIssues = issues.filter(k => issueDetails[k]?.severity === 'high');
  let message;
  if (state === 'up') {
    message = 'Step forward — front knee over ankle, torso upright';
  } else if (highIssues.length > 0) {
    message = issueDetails[highIssues[0]]?.message || 'Fix critical error';
  } else if (frontKnee > 105) {
    message = `Sink lower — front knee ${Math.round(frontKnee)}° (target ~90°)`;
  } else if (issues.length === 0) {
    message = `Knee ${Math.round(frontKnee)}° — drive through front heel to stand`;
  } else {
    message = issueDetails[issues[0]]?.message || 'Correct your form';
  }

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && issues.filter(i => issueDetails[i]?.severity !== 'low').length === 0,
    primaryAngle: Math.round(frontKnee),
    issues,
    issueDetails,
    message,
    formScore,
    metrics: {
      frontKneeAngle: Math.round(frontKnee),
      backKneeAngle: Math.round(backKnee),
      torsoAngle: Math.round(avgBack),
      formScore,
    }
  };
}