import { calcAngle, hasLandmarks } from './utils';

const REQUIRED = ['leftShoulder','rightShoulder','leftHip','rightHip','leftKnee','rightKnee'];
const MIN_VISIBILITY = 0.28;

function visibilityOk(landmarks) {
  return REQUIRED.every(k => (landmarks[k]?.visibility ?? 1) >= MIN_VISIBILITY);
}

export function analyzeSitup(landmarks, state) {
  if (!hasLandmarks(landmarks, REQUIRED)) return null;

  if (!visibilityOk(landmarks)) {
    return {
      nextState: state, repComplete: false, isGoodRep: false,
      issues: [], issueDetails: {},
      message: 'Adjust camera position — joints not clearly visible',
      formScore: null, lowConfidence: true, metrics: {}
    };
  }

  const midShoulder = {
    x: (landmarks.leftShoulder.x + landmarks.rightShoulder.x) / 2,
    y: (landmarks.leftShoulder.y + landmarks.rightShoulder.y) / 2
  };
  const midHip = {
    x: (landmarks.leftHip.x + landmarks.rightHip.x) / 2,
    y: (landmarks.leftHip.y + landmarks.rightHip.y) / 2
  };
  const midKnee = {
    x: (landmarks.leftKnee.x + landmarks.rightKnee.x) / 2,
    y: (landmarks.leftKnee.y + landmarks.rightKnee.y) / 2
  };

  const torsoAngle = calcAngle(midShoulder, midHip, midKnee);

  // Hip asymmetry check
  const hipHeightDiff = Math.abs(landmarks.leftHip.y - landmarks.rightHip.y);

  const issues = [];
  const issueDetails = {};

  if (state === 'up') {
    // Must reach ≥60° torso angle for full crunch
    if (torsoAngle < 60) {
      issues.push('not_fully_up');
      issueDetails.not_fully_up = {
        severity: torsoAngle < 40 ? 'high' : 'medium',
        message: `Torso ${Math.round(torsoAngle)}° — crunch higher, chest to knees (target ≥ 60°)`
      };
    }
  }

  if (state === 'down') {
    // Should fully lower: torso angle should be ≥ 140° (near flat)
    if (torsoAngle < 130) {
      issues.push('incomplete_extension');
      issueDetails.incomplete_extension = {
        severity: 'low',
        message: `Lower back to the floor fully (${Math.round(torsoAngle)}°)`
      };
    }
  }

  // Hip rotation
  if (hipHeightDiff > 0.04) {
    issues.push('hip_shift');
    issueDetails.hip_shift = {
      severity: 'medium',
      message: 'Hips twisting — keep them flat and square'
    };
  }

  let nextState = state;
  let repComplete = false;
  if (state === 'down' && torsoAngle < 90) nextState = 'up';
  else if (state === 'up' && torsoAngle > 130) {
    nextState = 'down';
    repComplete = true;
  }

  const formScore = Math.max(0, 100 - issues.reduce((acc, k) => {
    const s = issueDetails[k]?.severity;
    return acc + (s === 'high' ? 35 : s === 'medium' ? 18 : 5);
  }, 0));

  const highIssues = issues.filter(k => issueDetails[k]?.severity === 'high');
  let message;
  if (state === 'down') {
    message = torsoAngle < 130 ? 'Lower fully to the floor' : `Crunch up — target 60°+ torso angle`;
  } else if (highIssues.length > 0) {
    message = issueDetails[highIssues[0]].message;
  } else if (issues.length > 0) {
    message = issueDetails[issues[0]].message;
  } else {
    message = `Torso ${Math.round(torsoAngle)}° — lower slowly, control the descent`;
  }

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && issues.filter(i => issueDetails[i]?.severity !== 'low').length === 0,
    primaryAngle: Math.round(torsoAngle),
    issues,
    issueDetails,
    message,
    formScore,
    metrics: { torsoAngle: Math.round(torsoAngle), formScore }
  };
}
