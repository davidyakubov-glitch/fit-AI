import { calcAngle, hasLandmarks } from './utils';

const REQUIRED = ['leftShoulder','leftElbow','leftWrist','rightShoulder','rightElbow','rightWrist','leftHip','rightHip'];

export function analyzeShoulderPress(landmarks, state) {
  if (!hasLandmarks(landmarks, REQUIRED)) return null;

  const leftElbow  = calcAngle(landmarks.leftShoulder,  landmarks.leftElbow,  landmarks.leftWrist);
  const rightElbow = calcAngle(landmarks.rightShoulder, landmarks.rightElbow, landmarks.rightWrist);
  const avgElbow   = (leftElbow + rightElbow) / 2;

  const leftBack  = calcAngle(landmarks.leftShoulder,  landmarks.leftHip,  { x: landmarks.leftHip.x, y: landmarks.leftHip.y + 0.1, z: 0 });
  const rightBack = calcAngle(landmarks.rightShoulder, landmarks.rightHip, { x: landmarks.rightHip.x, y: landmarks.rightHip.y + 0.1, z: 0 });
  const avgBack   = (leftBack + rightBack) / 2;

  const issues = [];
  const issueDetails = {};

  if (state === 'up' && avgElbow < 160) {
    issues.push('arms_not_extended');
    issueDetails.arms_not_extended = { severity: 'medium', message: 'Fully extend arms overhead' };
  }

  if (state === 'down' && avgElbow > 100) {
    issues.push('not_low_enough');
    issueDetails.not_low_enough = { severity: 'medium', message: 'Lower the weight to shoulder level' };
  }

  // Check for excessive back arch
  if (avgBack < 160) {
    issues.push('back_arching');
    issueDetails.back_arching = { severity: 'high', message: 'Keep your core tight — avoid arching lower back' };
  }

  let nextState = state;
  let repComplete = false;

  if (state === 'down' && avgElbow > 155) nextState = 'up';
  else if (state === 'up' && avgElbow < 90) {
    nextState = 'down';
    repComplete = true;
  }

  const formScore = Math.max(0, 100 - issues.reduce((acc, k) => {
    const s = issueDetails[k]?.severity;
    return acc + (s === 'high' ? 30 : s === 'medium' ? 15 : 7);
  }, 0));

  let message;
  if (state === 'up') {
    message = avgElbow < 160
      ? `Extend fully — elbow ${Math.round(avgElbow)}° (target ≥ 160°)`
      : `Full extension — lower to shoulder level`;
  } else {
    message = avgElbow > 100
      ? `Lower more — elbow ${Math.round(avgElbow)}° (target ≤ 90°)`
      : `Elbows at 90° — press overhead, lock out`;
  }

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && issues.length === 0,
    primaryAngle: Math.round(avgElbow),
    issues,
    issueDetails,
    message,
    formScore,
    metrics: { elbowAngle: Math.round(avgElbow), formScore }
  };
}