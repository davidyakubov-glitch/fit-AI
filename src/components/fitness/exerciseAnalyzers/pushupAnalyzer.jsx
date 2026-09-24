import { calcAngle, hasLandmarks } from './utils';

const REQUIRED = ['leftShoulder','rightShoulder','leftElbow','rightElbow','leftWrist','rightWrist','leftHip','rightHip','leftAnkle','rightAnkle'];
const MIN_VISIBILITY = 0.28;

function visibilityOk(landmarks) {
  return REQUIRED.every(k => (landmarks[k]?.visibility ?? 1) >= MIN_VISIBILITY);
}

export function analyzePushup(landmarks, state) {
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

  const leftElbow  = calcAngle(landmarks.leftShoulder,  landmarks.leftElbow,  landmarks.leftWrist);
  const rightElbow = calcAngle(landmarks.rightShoulder, landmarks.rightElbow, landmarks.rightWrist);
  const avgElbow   = (leftElbow + rightElbow) / 2;
  const elbowAsymmetry = Math.abs(leftElbow - rightElbow);

  // Body line: shoulder → hip → ankle (target ~175–185°)
  const leftAlign  = calcAngle(landmarks.leftShoulder,  landmarks.leftHip,  landmarks.leftAnkle);
  const rightAlign = calcAngle(landmarks.rightShoulder, landmarks.rightHip, landmarks.rightAnkle);
  const avgAlign   = (leftAlign + rightAlign) / 2;

  // Elbow flare angle
  const leftElbowFlare  = calcAngle(landmarks.leftWrist,  landmarks.leftShoulder,  landmarks.rightShoulder);
  const rightElbowFlare = calcAngle(landmarks.rightWrist, landmarks.rightShoulder, landmarks.leftShoulder);

  const issues = [];
  const issueDetails = {};

  // Body alignment — strict: must be 160–195°
  if (avgAlign < 160) {
    issues.push('hips_sagging');
    issueDetails.hips_sagging = {
      severity: avgAlign < 145 ? 'high' : 'medium',
      message: `Body line ${Math.round(avgAlign)}° — brace core, raise hips to straight line`
    };
  } else if (avgAlign > 200) {
    issues.push('hips_raised');
    issueDetails.hips_raised = {
      severity: 'medium',
      message: `Hips too high (${Math.round(avgAlign)}°) — lower until body is flat`
    };
  }

  if (state === 'down') {
    // Depth: must reach ≤90° elbow
    if (avgElbow > 95) {
      issues.push('insufficient_depth');
      issueDetails.insufficient_depth = {
        severity: avgElbow > 120 ? 'high' : 'medium',
        message: `Elbow ${Math.round(avgElbow)}° — lower chest to ground (target ≤ 90°)`
      };
    }
    // Elbow flare > 60° is problematic
    if (leftElbowFlare > 60 || rightElbowFlare > 60) {
      issues.push('elbows_flaring');
      issueDetails.elbows_flaring = {
        severity: 'medium',
        message: 'Elbows flaring out — tuck them 45° toward torso'
      };
    }
  }

  // Asymmetry > 15°
  if (elbowAsymmetry > 15) {
    issues.push('uneven_shoulders');
    issueDetails.uneven_shoulders = {
      severity: elbowAsymmetry > 25 ? 'high' : 'medium',
      message: `Arm asymmetry ${Math.round(elbowAsymmetry)}° — press evenly with both arms`
    };
  }

  let nextState = state;
  let repComplete = false;
  if (state === 'up'   && avgElbow < 110) { nextState = 'down'; }
  else if (state === 'down' && avgElbow > 155) { nextState = 'up'; repComplete = true; }

  const formScore = Math.max(0, 100 - issues.reduce((acc, k) => {
    const s = issueDetails[k]?.severity;
    return acc + (s === 'high' ? 35 : s === 'medium' ? 18 : 5);
  }, 0));

  const highIssues = issues.filter(k => issueDetails[k]?.severity === 'high');
  let message;
  if (state === 'up') {
    message = 'Lower chest to ground — control the descent';
  } else if (highIssues.length > 0) {
    message = issueDetails[highIssues[0]]?.message || 'Fix critical form error';
  } else if (avgElbow > 95) {
    message = `Go lower — elbow at ${Math.round(avgElbow)}° (need ≤ 90°)`;
  } else if (issues.length === 0) {
    message = `Elbow ${Math.round(avgElbow)}° — push up to full extension`;
  } else {
    message = issueDetails[issues[0]]?.message || 'Correct your form';
  }

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && issues.filter(i => issueDetails[i]?.severity !== 'low').length === 0,
    primaryAngle: Math.round(avgElbow),
    issues,
    issueDetails,
    message,
    formScore,
    metrics: {
      elbowAngle: Math.round(avgElbow),
      bodyAlignment: Math.round(avgAlign),
      elbowAsymmetry: Math.round(elbowAsymmetry),
      formScore
    }
  };
}
