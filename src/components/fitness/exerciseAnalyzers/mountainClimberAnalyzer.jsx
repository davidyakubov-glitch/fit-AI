import { calcAngle, hasLandmarks } from './utils';

const REQUIRED = ['leftShoulder','rightShoulder','leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle'];

export function analyzeMountainClimber(landmarks, state) {
  if (!hasLandmarks(landmarks, REQUIRED)) return null;

  const leftKnee  = calcAngle(landmarks.leftHip,  landmarks.leftKnee,  landmarks.leftAnkle);
  const rightKnee = calcAngle(landmarks.rightHip, landmarks.rightKnee, landmarks.rightAnkle);

  // Body alignment
  const leftAlign  = calcAngle(landmarks.leftShoulder,  landmarks.leftHip,  landmarks.leftAnkle);
  const rightAlign = calcAngle(landmarks.rightShoulder, landmarks.rightHip, landmarks.rightAnkle);
  const avgAlign   = (leftAlign + rightAlign) / 2;

  const issues = [];
  const issueDetails = {};

  if (avgAlign < 155) {
    issues.push('hips_raised');
    issueDetails.hips_raised = { severity: 'high', message: 'Lower your hips — maintain plank position' };
  }

  // Detect which leg is driven in (lower knee = leg driven forward)
  const driveLeg = leftKnee < rightKnee ? 'left' : 'right';
  const driveAngle = Math.min(leftKnee, rightKnee);

  let nextState = state;
  let repComplete = false;

  // Rep = one drive in + leg return
  if (state === 'neutral' && driveAngle < 90) nextState = 'driving';
  else if (state === 'driving' && driveAngle > 140) {
    nextState = 'neutral';
    repComplete = true;
  }

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && issues.length === 0,
    primaryAngle: Math.round(driveAngle),
    issues,
    issueDetails,
    message: state === 'driving' ? 'Switch legs fast' : 'Drive knee to chest',
    metrics: { driveAngle: Math.round(driveAngle), bodyAlignment: Math.round(avgAlign) }
  };
}