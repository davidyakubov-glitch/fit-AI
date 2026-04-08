import { calcAngle, hasLandmarks, dist } from './utils';

const REQUIRED = ['leftShoulder','rightShoulder','leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle'];

// Burpee phases: standing → squat_down → plank → squat_up → jump
export function analyzeBurpee(landmarks, state) {
  if (!hasLandmarks(landmarks, REQUIRED)) return null;

  const leftKnee  = calcAngle(landmarks.leftHip,  landmarks.leftKnee,  landmarks.leftAnkle);
  const rightKnee = calcAngle(landmarks.rightHip, landmarks.rightKnee, landmarks.rightAnkle);
  const avgKnee   = (leftKnee + rightKnee) / 2;

  const leftAlign  = calcAngle(landmarks.leftShoulder,  landmarks.leftHip,  landmarks.leftAnkle);
  const rightAlign = calcAngle(landmarks.rightShoulder, landmarks.rightHip, landmarks.rightAnkle);
  const avgAlign   = (leftAlign + rightAlign) / 2;

  // Plank position: body straight and horizontal (shoulders and hips at similar heights)
  const shoulderY = (landmarks.leftShoulder.y + landmarks.rightShoulder.y) / 2;
  const hipY      = (landmarks.leftHip.y      + landmarks.rightHip.y)      / 2;
  const ankleY    = (landmarks.leftAnkle.y    + landmarks.rightAnkle.y)    / 2;
  const isHorizontal = Math.abs(shoulderY - hipY) < 0.08;

  const issues = [];
  const issueDetails = {};

  let nextState = state;
  let repComplete = false;

  switch (state) {
    case 'standing':
      if (avgKnee < 130) nextState = 'squat_down';
      break;
    case 'squat_down':
      if (isHorizontal && avgAlign > 155) nextState = 'plank';
      break;
    case 'plank':
      if (avgKnee < 130) nextState = 'squat_up';
      if (avgAlign < 155) {
        issues.push('hips_sagging');
        issueDetails.hips_sagging = { severity: 'high', message: 'Keep body straight in plank' };
      }
      break;
    case 'squat_up':
      if (avgKnee > 155) {
        nextState = 'standing';
        repComplete = true;
      }
      break;
  }

  const phaseMessages = {
    standing:   'Squat down and jump to plank',
    squat_down: 'Jump feet back to plank',
    plank:      'Jump feet forward',
    squat_up:   'Stand up and jump!'
  };

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && issues.length === 0,
    primaryAngle: Math.round(avgKnee),
    issues,
    issueDetails,
    message: phaseMessages[state] || 'Go!',
    metrics: { kneeAngle: Math.round(avgKnee), bodyAlignment: Math.round(avgAlign), phase: state }
  };
}