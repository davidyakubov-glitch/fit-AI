/**
 * Pre-analysis validation gate.
 * Runs BEFORE any exercise analyzer.
 * Returns a rejection result if the pose is not assessable,
 * or null if everything passes and analysis can proceed.
 */

// Required landmarks per exercise category
const REQUIRED_FOR_EXERCISE = {
  lower_body: ['leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle'],
  upper_body: ['leftShoulder','rightShoulder','leftElbow','rightElbow','leftWrist','rightWrist'],
  full_body:  ['leftShoulder','rightShoulder','leftElbow','rightElbow','leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle'],
  core:       ['leftShoulder','rightShoulder','leftHip','rightHip','leftKnee','rightKnee'],
  timed:      ['leftShoulder','rightShoulder','leftElbow','rightElbow','leftHip','rightHip','leftAnkle','rightAnkle'],
};

export const EXERCISE_CATEGORY = {
  squat:          'lower_body',
  lunge:          'lower_body',
  jump_squat:     'lower_body',
  pushup:         'full_body',
  push_up:        'full_body',
  plank:          'timed',
  situp:          'core',
  sit_up:         'core',
  bicep_curl:     'upper_body',
  shoulder_press: 'upper_body',
  jumping_jack:   'full_body',
  mountain_climber: 'timed',
  burpee:         'full_body',
  wall_sit:       'lower_body',
  glute_bridge:   'core',
  single_leg_squat: 'lower_body',
  barbell_squat:  'lower_body',
  deadlift:       'full_body',
  bench_press:    'upper_body',
  lat_pulldown:   'upper_body',
  pull_up:        'upper_body',
  barbell_row:    'upper_body',
  leg_press:      'lower_body',
  leg_curl:       'lower_body',
  leg_extension:  'lower_body',
  tricep_extension: 'upper_body',
};

const MIN_VIS = 0.22;
const MIN_CRITICAL_VIS = 0.15;
const MIN_PASS_FRACTION = 0.45;

function getRequiredLandmarks(exerciseId) {
  const category = EXERCISE_CATEGORY[exerciseId] || 'full_body';
  return REQUIRED_FOR_EXERCISE[category];
}

/**
 * Check if the body is too close to the camera / heavily cropped.
 * Uses the ratio of body height to frame height as a proxy.
 */
function isTooCroppedOrClose(landmarks, exerciseId) {
  const category = EXERCISE_CATEGORY[exerciseId] || 'full_body';
  if (category === 'upper_body') return false;
  const topY =
    category === 'lower_body'
      ? Math.min(landmarks.leftHip?.y ?? 1, landmarks.rightHip?.y ?? 1)
      : Math.min(landmarks.leftShoulder?.y ?? 1, landmarks.rightShoulder?.y ?? 1);
  const bottomY = Math.max(landmarks.leftAnkle?.y ?? 0,   landmarks.rightAnkle?.y ?? 0);
  const bodyHeightFraction = bottomY - topY;

  // If ankles/hips are missing, we can't judge — flag it
  const leftAnkleVisible = (landmarks.leftAnkle?.visibility ?? 0) >= MIN_CRITICAL_VIS;
  const rightAnkleVisible = (landmarks.rightAnkle?.visibility ?? 0) >= MIN_CRITICAL_VIS;
  const leftKneeVisible = (landmarks.leftKnee?.visibility ?? 0) >= MIN_CRITICAL_VIS;
  const rightKneeVisible = (landmarks.rightKnee?.visibility ?? 0) >= MIN_CRITICAL_VIS;
  const leftHipVisible = (landmarks.leftHip?.visibility ?? 0) >= MIN_CRITICAL_VIS;
  const rightHipVisible = (landmarks.rightHip?.visibility ?? 0) >= MIN_CRITICAL_VIS;

  if (!leftAnkleVisible && !rightAnkleVisible) {
    if (category === 'lower_body' && (leftKneeVisible || rightKneeVisible) && (leftHipVisible || rightHipVisible)) {
      return false;
    }
    return true;
  }

  // Body should span at least 50% of frame height and not exceed 95%
  // If < 50%: too far or landmark noise. If > 95%: too close.
  if (bodyHeightFraction < (category === 'lower_body' ? 0.1 : 0.2)) return true;  // too far / partial
  if (bodyHeightFraction > 0.97) return true;  // too close

  return false;
}

/**
 * Check if the person is centered (not at the very edge of frame).
 */
function isOutOfFrame(landmarks) {
  const keyX = ['leftShoulder','rightShoulder','leftHip','rightHip']
    .map(k => landmarks[k]?.x)
    .filter(x => x !== undefined);

  if (keyX.length < 2) return true;
  const minX = Math.min(...keyX);
  const maxX = Math.max(...keyX);

  // If the torso center is too close to frame edges
  return minX < 0.01 || maxX > 0.99;
}

/**
 * Returns true if the user appears to be in a valid standing upright
 * starting position (for squat, lunge etc.)
 */
function isUprightStance(landmarks) {
  if (!landmarks.leftHip || !landmarks.leftShoulder || !landmarks.leftAnkle) return true; // can't check
  const shoulderY = (landmarks.leftShoulder.y + landmarks.rightShoulder.y) / 2;
  const hipY      = (landmarks.leftHip.y      + landmarks.rightHip.y)      / 2;
  const ankleY    = (landmarks.leftAnkle.y    + landmarks.rightAnkle.y)    / 2;
  // In normalized coords, y increases downward. Shoulders should be above hips, hips above ankles.
  return shoulderY < hipY && hipY < ankleY;
}

function notAssessable(message, hint) {
  return {
    notAssessable: true,
    nextState: undefined, // preserve caller's state
    repComplete: false,
    isGoodRep: false,
    issues: [],
    issueDetails: {},
    message,
    hint: hint || null,
    formScore: null,
    lowConfidence: true,
    metrics: {}
  };
}

/**
 * Run all validation gates.
 * @param {object} landmarks  - normalized MediaPipe landmark map
 * @param {string} exerciseId - exercise identifier
 * @returns {object|null} rejection result if invalid, null if valid
 */
export function validatePose(landmarks, exerciseId) {
  if (!landmarks) {
    return notAssessable('No pose detected — position yourself in front of the camera.');
  }

  const required = getRequiredLandmarks(exerciseId);

  // Gate 1: enough required landmarks must exist and be visible.
  const missingOrHidden = required.filter(k => {
    const lm = landmarks[k];
    return !lm || (lm.visibility !== undefined && lm.visibility < MIN_VIS);
  });

  const visibleCount = required.length - missingOrHidden.length;
  const passFraction = visibleCount / required.length;
  const criticalMissing = required
    .filter((key) => ['leftHip', 'rightHip', 'leftShoulder', 'rightShoulder'].includes(key))
    .filter((key) => {
      const lm = landmarks[key];
      return !lm || (lm.visibility !== undefined && lm.visibility < MIN_CRITICAL_VIS);
    });

  if (passFraction < MIN_PASS_FRACTION || criticalMissing.length > 0) {
    const needsAnkles = missingOrHidden.some(k => k.includes('nkle'));
    const needsKnees  = missingOrHidden.some(k => k.includes('nee'));
    const needsHips   = missingOrHidden.some(k => k.includes('ip'));
    const needsElbows = missingOrHidden.some(k => k.includes('lbow'));

    let msg = 'Step back — ';
    if (needsAnkles || needsKnees) {
      msg = 'Step back so your full body is visible — ankles and knees must be in frame.';
    } else if (needsHips) {
      msg = 'Move back so your hips are visible in the frame.';
    } else if (needsElbows) {
      msg = 'Ensure your arms are visible — move back or adjust angle.';
    } else {
      msg = `Step back — ${missingOrHidden.length} key joints not visible.`;
    }

    return notAssessable(msg, 'Center yourself in the frame with full body visible.');
  }

  // Gate 2: Frame cropping / too close
  if (isTooCroppedOrClose(landmarks, exerciseId)) {
    return notAssessable(
      'Step back so your full body fits in the frame.',
      'We need to see your shoulders, hips, knees, and ankles clearly.'
    );
  }

  // Gate 3: Out-of-frame torso
  if (isOutOfFrame(landmarks)) {
    return notAssessable(
      'Center yourself in the frame — your body is near the edge.',
      'Move sideways until your full torso is centered.'
    );
  }

  // Gate 4: Orientation check for standing exercises
  const standingExercises = ['squat','lunge','jump_squat','wall_sit'];
  if (standingExercises.includes(exerciseId)) {
    const hasVerticalCheckPoints =
      (landmarks.leftShoulder?.visibility ?? 0) >= MIN_CRITICAL_VIS &&
      (landmarks.rightShoulder?.visibility ?? 0) >= MIN_CRITICAL_VIS &&
      ((landmarks.leftAnkle?.visibility ?? 0) >= MIN_CRITICAL_VIS ||
        (landmarks.rightAnkle?.visibility ?? 0) >= MIN_CRITICAL_VIS);

    if (hasVerticalCheckPoints && !isUprightStance(landmarks)) {
      return notAssessable(
        'Stand upright in the starting position.',
        'Feet shoulder-width apart, head aligned with spine, hips level.'
      );
    }
  }

  return null; // All gates passed — proceed with analysis
}
