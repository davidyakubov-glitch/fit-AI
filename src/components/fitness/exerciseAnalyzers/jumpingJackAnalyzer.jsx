import { hasLandmarks, dist } from './utils';

const REQUIRED = ['leftWrist','rightWrist','leftAnkle','rightAnkle','leftShoulder','rightShoulder'];

export function analyzeJumpingJack(landmarks, state) {
  if (!hasLandmarks(landmarks, REQUIRED, 0.3)) return null;

  // Arm spread: distance between wrists vs shoulder width
  const wristSpread    = dist(landmarks.leftWrist,    landmarks.rightWrist);
  const shoulderWidth  = dist(landmarks.leftShoulder, landmarks.rightShoulder);
  const ankleSpread    = dist(landmarks.leftAnkle,    landmarks.rightAnkle);

  const armsUp  = wristSpread > shoulderWidth * 1.8;
  const legsOut = ankleSpread > shoulderWidth * 1.2;
  const armsDown = wristSpread < shoulderWidth * 0.8;
  const legsTogether = ankleSpread < shoulderWidth * 0.5;

  const issues = [];
  const issueDetails = {};

  let nextState = state;
  let repComplete = false;

  // Open phase: arms up + legs apart
  if ((state === 'closed' || state === 'start') && armsUp && legsOut) {
    nextState = 'open';
  }
  // Close phase: arms down + legs together
  else if (state === 'open' && armsDown && legsTogether) {
    nextState = 'closed';
    repComplete = true;
  }

  if (state === 'open' && !armsUp) {
    issues.push('arms_not_raised');
    issueDetails.arms_not_raised = { severity: 'low', message: 'Raise arms fully overhead' };
  }
  if (state === 'open' && !legsOut) {
    issues.push('legs_not_spread');
    issueDetails.legs_not_spread = { severity: 'low', message: 'Spread your feet wider apart' };
  }

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && issues.length === 0,
    primaryAngle: Math.round(wristSpread * 100),
    issues,
    issueDetails,
    message: state === 'open' ? 'Jump feet together, arms down' : 'Jump out, raise arms!',
    metrics: { wristSpread: Math.round(wristSpread * 100), ankleSpread: Math.round(ankleSpread * 100) }
  };
}