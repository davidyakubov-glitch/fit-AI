import { calcAngle } from './utils';

const VIS = 0.22;

const has = (landmarks, keys) =>
  keys.every((key) => landmarks[key] && (landmarks[key].visibility ?? 1) >= VIS);

const avg = (...values) => {
  const nums = values.filter((value) => Number.isFinite(value));
  return nums.length ? nums.reduce((sum, value) => sum + value, 0) / nums.length : null;
};

const round = (value) => (Number.isFinite(value) ? Math.round(value) : null);

function angle(landmarks, a, b, c) {
  if (!has(landmarks, [a, b, c])) return null;
  return calcAngle(landmarks[a], landmarks[b], landmarks[c]);
}

function addIssue(issues, issueDetails, key, severity, message) {
  if (!issues.includes(key)) issues.push(key);
  const current = issueDetails[key];
  if (!current || current.severity !== 'high') {
    issueDetails[key] = { severity, message };
  }
}

export function analyzeBiomechanics(landmarks) {
  if (!landmarks) {
    return {
      issues: [],
      issueDetails: {},
      metrics: {},
      message: null,
      formScore: null,
    };
  }

  const leftKnee = angle(landmarks, 'leftHip', 'leftKnee', 'leftAnkle');
  const rightKnee = angle(landmarks, 'rightHip', 'rightKnee', 'rightAnkle');
  const kneeAngle = avg(leftKnee, rightKnee);

  const leftHip = angle(landmarks, 'leftShoulder', 'leftHip', 'leftKnee');
  const rightHip = angle(landmarks, 'rightShoulder', 'rightHip', 'rightKnee');
  const hipAngle = avg(leftHip, rightHip);

  const leftElbow = angle(landmarks, 'leftShoulder', 'leftElbow', 'leftWrist');
  const rightElbow = angle(landmarks, 'rightShoulder', 'rightElbow', 'rightWrist');
  const elbowAngle = avg(leftElbow, rightElbow);

  const leftShoulder = angle(landmarks, 'leftElbow', 'leftShoulder', 'leftHip');
  const rightShoulder = angle(landmarks, 'rightElbow', 'rightShoulder', 'rightHip');
  const shoulderAngle = avg(leftShoulder, rightShoulder);

  const leftBack = angle(landmarks, 'leftKnee', 'leftHip', 'leftShoulder');
  const rightBack = angle(landmarks, 'rightKnee', 'rightHip', 'rightShoulder');
  const backAngle = avg(leftBack, rightBack);

  const leftSpine = angle(landmarks, 'leftShoulder', 'leftHip', 'leftAnkle');
  const rightSpine = angle(landmarks, 'rightShoulder', 'rightHip', 'rightAnkle');
  const spineAngle = avg(leftSpine, rightSpine);

  const leftNeck = angle(landmarks, 'leftHip', 'leftShoulder', 'leftEar');
  const rightNeck = angle(landmarks, 'rightHip', 'rightShoulder', 'rightEar');
  const neckAngle = avg(leftNeck, rightNeck);

  const kneeAsymmetry =
    Number.isFinite(leftKnee) && Number.isFinite(rightKnee)
      ? Math.abs(leftKnee - rightKnee)
      : null;
  const elbowAsymmetry =
    Number.isFinite(leftElbow) && Number.isFinite(rightElbow)
      ? Math.abs(leftElbow - rightElbow)
      : null;
  const shoulderAsymmetry =
    Number.isFinite(leftShoulder) && Number.isFinite(rightShoulder)
      ? Math.abs(leftShoulder - rightShoulder)
      : null;
  const hipAsymmetry =
    landmarks.leftHip && landmarks.rightHip
      ? Math.abs(landmarks.leftHip.y - landmarks.rightHip.y)
      : null;

  const issues = [];
  const issueDetails = {};

  if (Number.isFinite(neckAngle) && neckAngle < 145) {
    addIssue(
      issues,
      issueDetails,
      'neck_forward',
      neckAngle < 130 ? 'high' : 'medium',
      `Neck ${round(neckAngle)}° — keep your head neutral, don't crane forward`
    );
  }

  if (Number.isFinite(spineAngle) && spineAngle < 145) {
    addIssue(
      issues,
      issueDetails,
      'spine_not_neutral',
      spineAngle < 130 ? 'high' : 'medium',
      `Spine ${round(spineAngle)}° — brace your core and keep your back straighter`
    );
  }

  if (Number.isFinite(backAngle) && backAngle < 45) {
    addIssue(
      issues,
      issueDetails,
      'excessive_lean',
      backAngle < 35 ? 'high' : 'medium',
      `Back ${round(backAngle)}° — lift chest and reduce forward lean`
    );
  }

  if (Number.isFinite(kneeAsymmetry) && kneeAsymmetry > 18) {
    addIssue(
      issues,
      issueDetails,
      'knee_asymmetry',
      kneeAsymmetry > 30 ? 'high' : 'medium',
      `Knees differ by ${round(kneeAsymmetry)}° — move evenly with both legs`
    );
  }

  if (Number.isFinite(elbowAsymmetry) && elbowAsymmetry > 18) {
    addIssue(
      issues,
      issueDetails,
      'elbow_asymmetry',
      elbowAsymmetry > 30 ? 'high' : 'medium',
      `Elbows differ by ${round(elbowAsymmetry)}° — press or pull evenly with both arms`
    );
  }

  if (Number.isFinite(shoulderAsymmetry) && shoulderAsymmetry > 22) {
    addIssue(
      issues,
      issueDetails,
      'shoulder_asymmetry',
      shoulderAsymmetry > 35 ? 'high' : 'medium',
      `Shoulders differ by ${round(shoulderAsymmetry)}° — level your shoulders`
    );
  }

  if (Number.isFinite(hipAsymmetry) && hipAsymmetry > 0.055) {
    addIssue(
      issues,
      issueDetails,
      'hip_shift',
      hipAsymmetry > 0.08 ? 'high' : 'medium',
      'Hips are uneven — keep your pelvis level and weight centered'
    );
  }

  const formScore = Math.max(
    0,
    100 -
      issues.reduce((score, key) => {
        const severity = issueDetails[key]?.severity;
        return score + (severity === 'high' ? 25 : severity === 'medium' ? 12 : 5);
      }, 0)
  );

  const topIssue = issues.find((key) => issueDetails[key]?.severity === 'high') || issues[0];

  return {
    issues,
    issueDetails,
    message: topIssue ? issueDetails[topIssue]?.message : null,
    formScore,
    metrics: {
      leftKneeAngle: round(leftKnee),
      rightKneeAngle: round(rightKnee),
      kneeAngle: round(kneeAngle),
      leftHipAngle: round(leftHip),
      rightHipAngle: round(rightHip),
      hipAngle: round(hipAngle),
      leftElbowAngle: round(leftElbow),
      rightElbowAngle: round(rightElbow),
      elbowAngle: round(elbowAngle),
      leftShoulderAngle: round(leftShoulder),
      rightShoulderAngle: round(rightShoulder),
      shoulderAngle: round(shoulderAngle),
      backAngle: round(backAngle),
      spineAngle: round(spineAngle),
      neckAngle: round(neckAngle),
      kneeAsymmetry: round(kneeAsymmetry),
      elbowAsymmetry: round(elbowAsymmetry),
      shoulderAsymmetry: round(shoulderAsymmetry),
      formScore,
    },
  };
}
