import { calcAngle, hasLandmarks } from './utils';

const REQUIRED = ['leftShoulder','rightShoulder','leftHip','rightHip','leftAnkle','rightAnkle','leftElbow','rightElbow'];
const MIN_VISIBILITY = 0.55;

function visibilityOk(landmarks) {
  return REQUIRED.every(k => (landmarks[k]?.visibility ?? 1) >= MIN_VISIBILITY);
}

export function analyzePlank(landmarks, state) {
  if (!hasLandmarks(landmarks, REQUIRED)) return null;

  if (!visibilityOk(landmarks)) {
    return {
      nextState: 'holding', repComplete: false, isGoodRep: false,
      issues: [], issueDetails: {},
      message: 'Adjust camera position — joints not clearly visible',
      formScore: null, lowConfidence: true,
      metrics: {}
    };
  }

  const leftSpine  = calcAngle(landmarks.leftShoulder,  landmarks.leftHip,  landmarks.leftAnkle);
  const rightSpine = calcAngle(landmarks.rightShoulder, landmarks.rightHip, landmarks.rightAnkle);
  const avgSpine   = (leftSpine + rightSpine) / 2;

  const hipHeightDiff = Math.abs(landmarks.leftHip.y - landmarks.rightHip.y);

  const leftElbowOffset  = Math.abs(landmarks.leftElbow.x  - landmarks.leftShoulder.x);
  const rightElbowOffset = Math.abs(landmarks.rightElbow.x - landmarks.rightShoulder.x);

  const issues = [];
  const issueDetails = {};

  // Strict body line: target 170–185°, deviation >10° = flag
  if (avgSpine < 165) {
    issues.push('hips_sagging');
    issueDetails.hips_sagging = {
      severity: avgSpine < 150 ? 'high' : 'medium',
      message: `Body angle ${Math.round(avgSpine)}° — brace core, raise hips (target 170–185°)`
    };
  } else if (avgSpine > 190) {
    issues.push('hips_raised');
    issueDetails.hips_raised = {
      severity: 'medium',
      message: `Hips piking at ${Math.round(avgSpine)}° — lower until body is flat`
    };
  }

  // Hip rotation
  if (hipHeightDiff > 0.03) {
    issues.push('hip_rotation');
    issueDetails.hip_rotation = {
      severity: hipHeightDiff > 0.055 ? 'high' : 'medium',
      message: 'Hips rotating — keep them level and square'
    };
  }

  // Elbow misalignment
  if (leftElbowOffset > 0.07 || rightElbowOffset > 0.07) {
    issues.push('elbow_position');
    issueDetails.elbow_position = {
      severity: 'low',
      message: 'Move elbows directly under shoulders'
    };
  }

  const formScore = Math.max(0, 100 - issues.reduce((acc, k) => {
    const s = issueDetails[k]?.severity;
    return acc + (s === 'high' ? 35 : s === 'medium' ? 18 : 5);
  }, 0));

  const highIssues = issues.filter(k => issueDetails[k]?.severity === 'high');
  let message;
  if (highIssues.length > 0) {
    message = issueDetails[highIssues[0]]?.message;
  } else if (issues.length > 0) {
    message = issueDetails[issues[0]]?.message;
  } else {
    // Only show positive if spine is truly in range
    const inRange = avgSpine >= 170 && avgSpine <= 185;
    message = inRange
      ? `Body angle ${Math.round(avgSpine)}° — hold position`
      : `Body angle ${Math.round(avgSpine)}° — adjust alignment (target 170–185°)`;
  }

  return {
    nextState: 'holding',
    repComplete: false,
    isGoodRep: false,
    primaryAngle: Math.round(avgSpine),
    issues,
    issueDetails,
    message,
    formScore,
    isTimeBased: true,
    metrics: { spineAngle: Math.round(avgSpine), formScore }
  };
}