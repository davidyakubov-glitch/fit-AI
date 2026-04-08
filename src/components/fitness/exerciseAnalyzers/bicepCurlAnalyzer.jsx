import { calcAngle, hasLandmarks } from './utils';

const REQUIRED = ['leftShoulder','leftElbow','leftWrist','rightShoulder','rightElbow','rightWrist'];

export function analyzeBicepCurl(landmarks, state) {
  if (!hasLandmarks(landmarks, REQUIRED)) return null;

  const leftElbow  = calcAngle(landmarks.leftShoulder,  landmarks.leftElbow,  landmarks.leftWrist);
  const rightElbow = calcAngle(landmarks.rightShoulder, landmarks.rightElbow, landmarks.rightWrist);
  const avgElbow   = (leftElbow + rightElbow) / 2;

  // Elbow drift: upper arm should stay vertical (elbow stays close to hip)
  const leftUpperArmDrift  = Math.abs(landmarks.leftElbow.x  - landmarks.leftShoulder.x);
  const rightUpperArmDrift = Math.abs(landmarks.rightElbow.x - landmarks.rightShoulder.x);
  const avgDrift = (leftUpperArmDrift + rightUpperArmDrift) / 2;

  // Asymmetry check
  const elbowAsymmetry = Math.abs(leftElbow - rightElbow);

  const issues = [];
  const issueDetails = {};

  if (state === 'up') {
    // Top of curl: elbow should be <60° for full contraction
    if (avgElbow > 65) {
      issues.push('incomplete_curl');
      issueDetails.incomplete_curl = {
        severity: avgElbow > 90 ? 'high' : 'medium',
        message: `Elbow ${Math.round(avgElbow)}° — curl higher to fully contract bicep (target < 60°)`
      };
    }
    // Elbow drifting forward
    if (avgDrift > 0.10) {
      issues.push('elbow_drifting');
      issueDetails.elbow_drifting = {
        severity: avgDrift > 0.15 ? 'high' : 'medium',
        message: 'Elbows swinging forward — pin them to your sides'
      };
    }
  }

  if (state === 'down') {
    // Full extension at bottom: elbow should be ~160–175°
    if (avgElbow < 145) {
      issues.push('incomplete_extension');
      issueDetails.incomplete_extension = {
        severity: 'low',
        message: `Elbow ${Math.round(avgElbow)}° — fully extend arms at the bottom (target ≥ 155°)`
      };
    }
  }

  // Uneven curl at any point
  if (elbowAsymmetry > 20) {
    issues.push('uneven_curl');
    issueDetails.uneven_curl = {
      severity: 'medium',
      message: `Arms asymmetric by ${Math.round(elbowAsymmetry)}° — curl both arms equally`
    };
  }

  let nextState = state;
  let repComplete = false;
  if (state === 'down'  && avgElbow < 90)  { nextState = 'up'; }
  else if (state === 'up' && avgElbow > 150) { nextState = 'down'; repComplete = true; }

  let message;
  if (state === 'down') {
    message = avgElbow < 145
      ? `Extend arms fully — elbow ${Math.round(avgElbow)}° (target ≥ 155°)`
      : `Curl up — elbows pinned to sides, no swinging`;
  } else {
    message = avgElbow > 65
      ? `Squeeze higher — elbow ${Math.round(avgElbow)}° (target < 60°)`
      : `Peak — lower slowly, 3 sec descent`;
  }

  const formScore = Math.max(0, 100 - issues.reduce((acc, k) => {
    const s = issueDetails[k]?.severity;
    return acc + (s === 'high' ? 30 : s === 'medium' ? 15 : 7);
  }, 0));

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && issues.filter(i => issueDetails[i]?.severity !== 'low').length === 0,
    primaryAngle: Math.round(avgElbow),
    issues,
    issueDetails,
    message,
    formScore,
    metrics: { elbowAngle: Math.round(avgElbow), formScore }
  };
}