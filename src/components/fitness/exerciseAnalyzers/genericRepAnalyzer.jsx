import { calcAngle, hasLandmarks } from './utils';

const CONFIGS = {
  barbell_squat: {
    type: 'down-up',
    metric: 'kneeAngle',
    startState: 'up',
    downBelow: 120,
    completeAbove: 158,
    goodRange: [75, 110],
    messageDown: 'Squat down with knees tracking toes',
    messageUp: 'Drive up evenly through both legs',
  },
  single_leg_squat: {
    type: 'down-up',
    metric: 'kneeAngle',
    startState: 'up',
    downBelow: 125,
    completeAbove: 155,
    goodRange: [60, 115],
    messageDown: 'Lower under control and keep balance',
    messageUp: 'Drive through the stance heel',
  },
  leg_press: {
    type: 'down-up',
    metric: 'kneeAngle',
    startState: 'up',
    downBelow: 120,
    completeAbove: 155,
    goodRange: [70, 110],
    messageDown: 'Lower the platform with control',
    messageUp: 'Press up without locking knees hard',
  },
  leg_curl: {
    type: 'down-up',
    metric: 'kneeAngle',
    startState: 'extended',
    downBelow: 105,
    completeAbove: 145,
    goodRange: [60, 95],
    messageDown: 'Curl heels toward glutes',
    messageUp: 'Extend slowly with control',
  },
  leg_extension: {
    type: 'up-down',
    metric: 'kneeAngle',
    startState: 'down',
    upAbove: 150,
    completeBelow: 115,
    goodRange: [150, 180],
    messageDown: 'Extend legs until knees are nearly straight',
    messageUp: 'Lower under control',
  },
  bench_press: {
    type: 'down-up',
    metric: 'elbowAngle',
    startState: 'up',
    downBelow: 115,
    completeAbove: 155,
    goodRange: [70, 110],
    messageDown: 'Lower bar to chest with elbows controlled',
    messageUp: 'Press evenly to full extension',
  },
  lat_pulldown: {
    type: 'down-up',
    metric: 'elbowAngle',
    startState: 'extended',
    downBelow: 115,
    completeAbove: 150,
    goodRange: [70, 115],
    messageDown: 'Pull elbows down toward your sides',
    messageUp: 'Return slowly to full stretch',
  },
  pull_up: {
    type: 'down-up',
    metric: 'elbowAngle',
    startState: 'extended',
    downBelow: 105,
    completeAbove: 150,
    goodRange: [45, 100],
    messageDown: 'Pull chest toward the bar',
    messageUp: 'Lower to a controlled full hang',
  },
  barbell_row: {
    type: 'down-up',
    metric: 'elbowAngle',
    startState: 'extended',
    downBelow: 115,
    completeAbove: 150,
    goodRange: [70, 115],
    messageDown: 'Row elbows back toward your ribs',
    messageUp: 'Lower the bar under control',
  },
  tricep_extension: {
    type: 'up-down',
    metric: 'elbowAngle',
    startState: 'bent',
    upAbove: 150,
    completeBelow: 105,
    goodRange: [150, 180],
    messageDown: 'Extend arms fully and squeeze triceps',
    messageUp: 'Bend back with control, upper arms still',
  },
  glute_bridge: {
    type: 'up-down',
    metric: 'hipAngle',
    startState: 'down',
    upAbove: 155,
    completeBelow: 125,
    goodRange: [155, 180],
    messageDown: 'Drive hips up and squeeze glutes',
    messageUp: 'Lower hips with control',
  },
  deadlift: {
    type: 'up-down',
    metric: 'hipAngle',
    startState: 'down',
    upAbove: 155,
    completeBelow: 125,
    goodRange: [145, 180],
    messageDown: 'Stand tall by driving hips forward',
    messageUp: 'Hinge back down with a neutral spine',
  },
};

const REQUIRED = [
  'leftShoulder',
  'rightShoulder',
  'leftElbow',
  'rightElbow',
  'leftWrist',
  'rightWrist',
  'leftHip',
  'rightHip',
  'leftKnee',
  'rightKnee',
  'leftAnkle',
  'rightAnkle',
];

const REQUIRED_BY_METRIC = {
  kneeAngle: ['leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'],
  elbowAngle: ['leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist', 'rightWrist'],
  hipAngle: ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'leftKnee', 'rightKnee'],
};

function avg(...values) {
  const nums = values.filter((value) => Number.isFinite(value));
  return nums.length ? nums.reduce((sum, value) => sum + value, 0) / nums.length : null;
}

function getMetrics(landmarks) {
  const leftKnee = calcAngle(landmarks.leftHip, landmarks.leftKnee, landmarks.leftAnkle);
  const rightKnee = calcAngle(landmarks.rightHip, landmarks.rightKnee, landmarks.rightAnkle);
  const leftElbow = calcAngle(landmarks.leftShoulder, landmarks.leftElbow, landmarks.leftWrist);
  const rightElbow = calcAngle(landmarks.rightShoulder, landmarks.rightElbow, landmarks.rightWrist);
  const leftHip = calcAngle(landmarks.leftShoulder, landmarks.leftHip, landmarks.leftKnee);
  const rightHip = calcAngle(landmarks.rightShoulder, landmarks.rightHip, landmarks.rightKnee);

  return {
    kneeAngle: avg(leftKnee, rightKnee),
    elbowAngle: avg(leftElbow, rightElbow),
    hipAngle: avg(leftHip, rightHip),
    kneeAsymmetry: Math.abs(leftKnee - rightKnee),
    elbowAsymmetry: Math.abs(leftElbow - rightElbow),
    hipAsymmetry: Math.abs(leftHip - rightHip),
  };
}

function scoreIssues(config, value, metrics) {
  const issues = [];
  const issueDetails = {};
  const [goodMin, goodMax] = config.goodRange;

  if (config.type === 'down-up' && value > goodMax && value < 145) {
    issues.push('insufficient_depth');
    issueDetails.insufficient_depth = {
      severity: value > goodMax + 25 ? 'high' : 'medium',
      message: `${config.metric} ${Math.round(value)}° — reach the target range ${goodMin}-${goodMax}°`,
    };
  }

  if (config.type === 'up-down' && value < goodMin && value > 120) {
    issues.push('incomplete_extension');
    issueDetails.incomplete_extension = {
      severity: value < goodMin - 25 ? 'high' : 'medium',
      message: `${config.metric} ${Math.round(value)}° — extend to ${goodMin}-${goodMax}°`,
    };
  }

  if (metrics.kneeAsymmetry > 25 && ['kneeAngle', 'hipAngle'].includes(config.metric)) {
    issues.push('knee_asymmetry');
    issueDetails.knee_asymmetry = {
      severity: 'medium',
      message: `Knees differ by ${Math.round(metrics.kneeAsymmetry)}° — move both legs evenly`,
    };
  }

  if (metrics.elbowAsymmetry > 25 && config.metric === 'elbowAngle') {
    issues.push('elbow_asymmetry');
    issueDetails.elbow_asymmetry = {
      severity: 'medium',
      message: `Elbows differ by ${Math.round(metrics.elbowAsymmetry)}° — move both arms evenly`,
    };
  }

  const formScore = Math.max(
    0,
    100 -
      issues.reduce((sum, key) => {
        const severity = issueDetails[key]?.severity;
        return sum + (severity === 'high' ? 35 : severity === 'medium' ? 18 : 6);
      }, 0)
  );

  return { issues, issueDetails, formScore };
}

export function hasGenericAnalyzer(exerciseId) {
  return Boolean(CONFIGS[exerciseId]);
}

export function getGenericInitialState(exerciseId) {
  return CONFIGS[exerciseId]?.startState || 'up';
}

export function analyzeGenericRep(exerciseId, landmarks, state) {
  const config = CONFIGS[exerciseId];
  const required = REQUIRED_BY_METRIC[config?.metric] || REQUIRED;
  if (!config || !hasLandmarks(landmarks, required, 0.3)) return null;

  const metrics = getMetrics(landmarks);
  const value = metrics[config.metric];
  if (!Number.isFinite(value)) return null;

  const { issues, issueDetails, formScore } = scoreIssues(config, value, metrics);
  let nextState = state || config.startState;
  let repComplete = false;

  if (config.type === 'down-up') {
    if (nextState === config.startState && value < config.downBelow) {
      nextState = 'loaded';
    } else if (nextState === 'loaded' && value > config.completeAbove) {
      nextState = config.startState;
      repComplete = true;
    }
  } else if (config.type === 'up-down') {
    if (nextState === config.startState && value > config.upAbove) {
      nextState = 'extended';
    } else if (nextState === 'extended' && value < config.completeBelow) {
      nextState = config.startState;
      repComplete = true;
    }
  }

  const highIssue = issues.find((key) => issueDetails[key]?.severity === 'high');
  const message =
    highIssue
      ? issueDetails[highIssue].message
      : nextState === config.startState
        ? config.messageDown
        : config.messageUp;

  return {
    nextState,
    repComplete,
    isGoodRep: repComplete && issues.length === 0 && formScore >= 80,
    primaryAngle: Math.round(value),
    issues,
    issueDetails,
    message,
    formScore,
    metrics: {
      ...Object.fromEntries(
        Object.entries(metrics).map(([key, metricValue]) => [
          key,
          Number.isFinite(metricValue) ? Math.round(metricValue) : metricValue,
        ])
      ),
      formScore,
    },
  };
}
