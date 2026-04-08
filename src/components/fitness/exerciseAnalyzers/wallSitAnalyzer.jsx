import { calcAngle, hasLandmarks } from './utils';

const REQUIRED = ['leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle','leftShoulder','rightShoulder'];

export function analyzeWallSit(landmarks, state) {
  if (!hasLandmarks(landmarks, REQUIRED)) return null;

  const leftKnee  = calcAngle(landmarks.leftHip,  landmarks.leftKnee,  landmarks.leftAnkle);
  const rightKnee = calcAngle(landmarks.rightHip, landmarks.rightKnee, landmarks.rightAnkle);
  const avgKnee   = (leftKnee + rightKnee) / 2;

  const leftBack  = calcAngle(landmarks.leftAnkle,  landmarks.leftHip,  landmarks.leftShoulder);
  const rightBack = calcAngle(landmarks.rightAnkle, landmarks.rightHip, landmarks.rightShoulder);
  const avgBack   = (leftBack + rightBack) / 2;

  const issues = [];
  const issueDetails = {};

  if (avgKnee > 110) {
    issues.push('not_low_enough');
    issueDetails.not_low_enough = { severity: 'high', message: 'Slide down until thighs are parallel to the floor' };
  }
  if (avgKnee < 70) {
    issues.push('too_low');
    issueDetails.too_low = { severity: 'medium', message: 'Do not go below 90°' };
  }
  if (avgBack < 70) {
    issues.push('leaning_forward');
    issueDetails.leaning_forward = { severity: 'high', message: 'Keep your back flat against the wall' };
  }

  // Wall sit = timed hold, no reps
  return {
    nextState: 'holding',
    repComplete: false,
    isGoodRep: false,
    primaryAngle: Math.round(avgKnee),
    issues,
    issueDetails,
    message: issues.length === 0 ? 'Hold the position!' : issueDetails[issues[0]]?.message,
    metrics: { kneeAngle: Math.round(avgKnee), backAngle: Math.round(avgBack) }
  };
}