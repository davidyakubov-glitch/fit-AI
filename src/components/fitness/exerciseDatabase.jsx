/**
 * AI Fitness Coach — Exercise Database
 * Scalable, pose-detection-aware exercise definitions.
 *
 * keypoints: MediaPipe Pose landmark names used for analysis
 * phases: main movement phases for state machine detection
 * mistakes: detectable via pose estimation on mobile camera
 * metrics: what to track per rep/session
 */

export const LOCATIONS = { HOME: 'home', GYM: 'gym', BOTH: 'both' };
export const DIFFICULTY = { BEGINNER: 'beginner', INTERMEDIATE: 'intermediate', ADVANCED: 'advanced' };
export const MUSCLE_GROUPS = {
  LEGS: 'Legs', GLUTES: 'Glutes', CHEST: 'Chest', BACK: 'Back',
  SHOULDERS: 'Shoulders', ARMS: 'Arms', CORE: 'Core', FULL_BODY: 'Full Body'
};

export const EQUIPMENT = {
  NONE: 'none',
  DUMBBELLS: 'dumbbells',
  BARBELL: 'barbell',
  RESISTANCE_BAND: 'resistance band',
  PULL_UP_BAR: 'pull-up bar',
  BENCH: 'bench',
  MACHINE: 'machine',
  CABLE: 'cable machine',
  LEG_PRESS: 'leg press machine',
};

// ─── Reusable pose keypoint sets ─────────────────────────────────────────────
const LOWER_BODY_KEYPOINTS = [
  'left_hip', 'right_hip',
  'left_knee', 'right_knee',
  'left_ankle', 'right_ankle',
  'left_shoulder', 'right_shoulder'
];

const UPPER_BODY_KEYPOINTS = [
  'left_shoulder', 'right_shoulder',
  'left_elbow', 'right_elbow',
  'left_wrist', 'right_wrist',
  'left_hip', 'right_hip'
];

const FULL_BODY_KEYPOINTS = [
  ...LOWER_BODY_KEYPOINTS,
  'left_elbow', 'right_elbow',
  'left_wrist', 'right_wrist'
];

// ─── Exercise Database ────────────────────────────────────────────────────────
export const exerciseDatabase = {

  // ══════════════════════════════════════════════════════════════════════════
  // HOME EXERCISES
  // ══════════════════════════════════════════════════════════════════════════

  squat: {
    id: 'squat',
    name: 'Bodyweight Squat',
    location: LOCATIONS.BOTH,
    muscleGroup: MUSCLE_GROUPS.LEGS,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.NONE],
    description: 'Fundamental lower-body movement targeting quads, hamstrings and glutes.',
    cameraAngle: 'side or slight angle — full body visible',
    keypoints: LOWER_BODY_KEYPOINTS,
    phases: {
      start:       { kneeAngle: [160, 180], description: 'Standing upright, feet shoulder-width apart' },
      eccentric:   { kneeAngle: [90, 160],  description: 'Descending — hips hinge back, knees track toes' },
      bottom:      { kneeAngle: [60, 90],   description: 'Thighs parallel or below parallel to floor' },
      concentric:  { kneeAngle: [90, 160],  description: 'Driving through heels to rise' },
      lockout:     { kneeAngle: [160, 180], description: 'Full hip and knee extension at top' }
    },
    mistakes: [
      { id: 'knees_caving_in',       description: 'Knees collapse inward (valgus)',    detection: 'knee width < hip width during descent' },
      { id: 'heels_lifting',         description: 'Heels rise off the floor',           detection: 'ankle angle change > 15°' },
      { id: 'insufficient_depth',    description: 'Squat not reaching parallel',        detection: 'knee angle > 100° at bottom' },
      { id: 'excessive_forward_lean',description: 'Torso leans too far forward',        detection: 'shoulder-hip-ankle angle > 50°' },
      { id: 'hip_shift',             description: 'Hips shift laterally',               detection: 'left/right hip asymmetry > 10px' },
      { id: 'uneven_leg_descent',    description: 'One leg leads the movement',         detection: 'knee angle difference L/R > 15°' },
      { id: 'stance_too_narrow',     description: 'Feet too close together',            detection: 'ankle width < 0.6× shoulder width' },
    ],
    metrics: ['reps', 'depth_score', 'form_score', 'knee_angle', 'symmetry'],
    analyzerKey: 'squat',
    tips: [
      'Keep chest up and core braced',
      'Drive knees out over little toes',
      'Weight through mid-foot and heels',
    ]
  },

  lunge: {
    id: 'lunge',
    name: 'Forward Lunge',
    location: LOCATIONS.HOME,
    muscleGroup: MUSCLE_GROUPS.LEGS,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.NONE],
    description: 'Unilateral lower-body exercise improving balance and leg strength.',
    cameraAngle: 'side view — full body visible',
    keypoints: LOWER_BODY_KEYPOINTS,
    phases: {
      start:      { description: 'Stand tall, feet together' },
      step:       { description: 'Step forward, lower back knee toward floor' },
      bottom:     { frontKneeAngle: [85, 95], description: 'Front thigh parallel, back knee near floor' },
      push_back:  { description: 'Push through front heel to return' },
      lockout:    { description: 'Feet together, standing tall' }
    },
    mistakes: [
      { id: 'front_knee_caves',    description: 'Front knee collapses inward',       detection: 'front knee x < front ankle x' },
      { id: 'knee_past_toes',      description: 'Front knee extends far past toes',  detection: 'knee x > ankle x + threshold' },
      { id: 'torso_leaning',       description: 'Torso leans forward excessively',   detection: 'shoulder-hip vertical angle > 20°' },
      { id: 'insufficient_depth',  description: 'Back knee not near floor',           detection: 'back knee y not close to ground' },
      { id: 'hip_drop',            description: 'Hip drops to one side',              detection: 'hip landmark height asymmetry > 15px' },
    ],
    metrics: ['reps', 'depth_score', 'form_score', 'symmetry'],
    analyzerKey: 'lunge',
    tips: [
      'Keep your torso upright',
      'Front knee tracks over second toe',
      'Lower slowly — 2 seconds down',
    ]
  },

  push_up: {
    id: 'push_up',
    name: 'Push-Up',
    location: LOCATIONS.HOME,
    muscleGroup: MUSCLE_GROUPS.CHEST,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.NONE],
    description: 'Classic upper-body pressing movement targeting chest, shoulders and triceps.',
    cameraAngle: 'side view — full body horizontal',
    keypoints: FULL_BODY_KEYPOINTS,
    phases: {
      start:      { elbowAngle: [160, 180], description: 'Arms extended, body straight (plank position)' },
      eccentric:  { elbowAngle: [90, 160],  description: 'Lower chest toward floor, elbows 45° from torso' },
      bottom:     { elbowAngle: [70, 95],   description: 'Chest near floor, elbows fully bent' },
      concentric: { elbowAngle: [90, 160],  description: 'Press up through palms' },
      lockout:    { elbowAngle: [160, 180], description: 'Arms extended, body still straight' }
    },
    mistakes: [
      { id: 'hips_sagging',     description: 'Hips drop below straight line',     detection: 'hip y > shoulder y + threshold' },
      { id: 'hips_piking',      description: 'Hips rise above straight line',     detection: 'hip y < shoulder y - threshold' },
      { id: 'elbows_flaring',   description: 'Elbows flare > 90° from torso',    detection: 'elbow-shoulder-hip angle > 80°' },
      { id: 'head_dropping',    description: 'Head droops / chin juts forward',   detection: 'shoulder-ear alignment deviation' },
      { id: 'incomplete_range', description: 'Chest does not reach near floor',   detection: 'shoulder y not near floor level' },
    ],
    metrics: ['reps', 'form_score', 'elbow_angle', 'body_alignment'],
    analyzerKey: 'push_up',
    tips: [
      'Keep a rigid plank throughout',
      'Elbows at ~45° to your torso',
      'Full range: chest within 5cm of floor',
    ]
  },

  plank: {
    id: 'plank',
    name: 'Plank',
    location: LOCATIONS.HOME,
    muscleGroup: MUSCLE_GROUPS.CORE,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.NONE],
    description: 'Isometric core exercise building stability and anti-extension strength.',
    cameraAngle: 'side view — full body horizontal',
    keypoints: FULL_BODY_KEYPOINTS,
    phases: {
      hold: { description: 'Body forms straight line from head to heels' }
    },
    mistakes: [
      { id: 'hips_sagging',  description: 'Hips drop',                  detection: 'hip y > shoulder y + 15px' },
      { id: 'hips_piking',   description: 'Hips rise above shoulders',  detection: 'hip y < shoulder y - 15px' },
      { id: 'head_dropping', description: 'Head drops toward floor',    detection: 'ear y > shoulder y + 20px' },
    ],
    metrics: ['duration_seconds', 'form_score', 'body_alignment'],
    analyzerKey: 'plank',
    tips: [
      'Squeeze glutes and abs simultaneously',
      'Neutral neck — look at floor slightly ahead',
      'Breathe steadily; don\'t hold your breath',
    ]
  },

  sit_up: {
    id: 'sit_up',
    name: 'Sit-Up / Crunch',
    location: LOCATIONS.HOME,
    muscleGroup: MUSCLE_GROUPS.CORE,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.NONE],
    description: 'Core flexion exercise targeting the rectus abdominis.',
    cameraAngle: 'side view — torso and legs visible',
    keypoints: ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip',
                'left_knee', 'right_knee', 'nose'],
    phases: {
      start:      { hipAngle: [160, 180], description: 'Lying flat, knees bent ~90°' },
      concentric: { hipAngle: [60, 110],  description: 'Curl torso toward knees' },
      top:        { hipAngle: [45, 70],   description: 'Shoulder blades fully off floor' },
      eccentric:  { hipAngle: [110, 160], description: 'Lower back down with control' },
    },
    mistakes: [
      { id: 'pulling_neck',     description: 'Hands pulling on neck',           detection: 'wrist near ear during ascent' },
      { id: 'feet_lifting',     description: 'Feet lift off floor',              detection: 'ankle y rises during movement' },
      { id: 'incomplete_range', description: 'Shoulder blades stay on floor',   detection: 'shoulder y not rising sufficiently' },
    ],
    metrics: ['reps', 'form_score', 'range_of_motion'],
    analyzerKey: 'sit_up',
    tips: [
      'Cross arms on chest or fingertips behind ears — don\'t pull',
      'Exhale on the way up',
      'Control the descent — don\'t flop down',
    ]
  },

  glute_bridge: {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    location: LOCATIONS.HOME,
    muscleGroup: MUSCLE_GROUPS.GLUTES,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.NONE],
    description: 'Hip extension exercise isolating the glutes and hamstrings.',
    cameraAngle: 'side view — lying position, full body visible',
    keypoints: ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip',
                'left_knee', 'right_knee', 'left_ankle', 'right_ankle'],
    phases: {
      start:      { hipHeight: 'low',  description: 'Lying on back, knees bent, feet flat' },
      concentric: { hipAngle: [130, 170], description: 'Drive hips up, squeezing glutes' },
      top:        { hipAngle: [160, 180], description: 'Hips fully extended — shoulder-hip-knee line' },
      eccentric:  { description: 'Lower hips back to floor' },
    },
    mistakes: [
      { id: 'knees_caving',       description: 'Knees fall inward at top',       detection: 'knee width < ankle width' },
      { id: 'incomplete_extension',description: 'Hips not fully extended at top', detection: 'hip angle < 150°' },
      { id: 'lumbar_hyperextension',description: 'Lower back arches excessively', detection: 'hip rises above shoulder-knee line' },
    ],
    metrics: ['reps', 'form_score', 'hip_extension_angle'],
    analyzerKey: 'glute_bridge',
    tips: [
      'Squeeze glutes hard at the top',
      'Push through heels, not toes',
      'Keep ribs down — don\'t flare them',
    ]
  },

  mountain_climber: {
    id: 'mountain_climber',
    name: 'Mountain Climbers',
    location: LOCATIONS.HOME,
    muscleGroup: MUSCLE_GROUPS.FULL_BODY,
    difficulty: DIFFICULTY.INTERMEDIATE,
    equipment: [EQUIPMENT.NONE],
    description: 'Dynamic cardio + core exercise performed in plank position.',
    cameraAngle: 'side view — full body in plank',
    keypoints: FULL_BODY_KEYPOINTS,
    phases: {
      plank:       { description: 'Arms extended, body straight' },
      drive_left:  { description: 'Left knee drives toward chest' },
      extend_left: { description: 'Left leg returns' },
      drive_right: { description: 'Right knee drives toward chest' },
    },
    mistakes: [
      { id: 'hips_rising',      description: 'Hips pike up during climbers',    detection: 'hip y above shoulder y' },
      { id: 'hips_sagging',     description: 'Hips sag below straight line',    detection: 'hip y below shoulder y + threshold' },
      { id: 'incomplete_drive', description: 'Knee not reaching chest',          detection: 'knee x not reaching wrist x' },
    ],
    metrics: ['reps', 'tempo', 'form_score'],
    analyzerKey: 'mountain_climber',
    tips: [
      'Maintain a tight plank throughout',
      'Drive knees toward opposite elbow for oblique activation',
      'Control speed — quality over pace',
    ]
  },

  burpee: {
    id: 'burpee',
    name: 'Burpee',
    location: LOCATIONS.HOME,
    muscleGroup: MUSCLE_GROUPS.FULL_BODY,
    difficulty: DIFFICULTY.INTERMEDIATE,
    equipment: [EQUIPMENT.NONE],
    description: 'Full-body conditioning exercise combining squat, plank, push-up and jump.',
    cameraAngle: 'side view — enough space to see full height',
    keypoints: FULL_BODY_KEYPOINTS,
    phases: {
      stand:       { description: 'Standing upright' },
      squat_down:  { description: 'Hinge to squat, hands to floor' },
      plank:       { description: 'Jump or step feet back to plank' },
      push_up:     { description: 'Optional: perform a push-up' },
      jump_in:     { description: 'Jump or step feet to hands' },
      jump_up:     { description: 'Explosive jump with arms overhead' },
    },
    mistakes: [
      { id: 'hips_sagging_plank', description: 'Hips sag in plank phase',       detection: 'hip y > shoulder y + threshold' },
      { id: 'no_jump',            description: 'Jump phase missing / minimal',   detection: 'body height at jump < threshold' },
      { id: 'sloppy_transition',  description: 'Uncontrolled foot placement',    detection: 'rapid unexpected landmark shift' },
    ],
    metrics: ['reps', 'tempo', 'form_score'],
    analyzerKey: 'burpee',
    tips: [
      'Land softly from the jump to protect joints',
      'Keep core tight throughout all phases',
      'Scale by stepping instead of jumping',
    ]
  },

  jump_squat: {
    id: 'jump_squat',
    name: 'Jump Squat',
    location: LOCATIONS.HOME,
    muscleGroup: MUSCLE_GROUPS.LEGS,
    difficulty: DIFFICULTY.INTERMEDIATE,
    equipment: [EQUIPMENT.NONE],
    description: 'Plyometric squat developing explosive leg power.',
    cameraAngle: 'side view — enough vertical space visible',
    keypoints: LOWER_BODY_KEYPOINTS,
    phases: {
      start:      { description: 'Standing, feet shoulder-width' },
      eccentric:  { description: 'Rapid squat down, loading energy' },
      launch:     { description: 'Explosive drive through floor' },
      airborne:   { description: 'Full body off the ground' },
      landing:    { description: 'Soft landing, absorb through ankles-knees-hips' },
    },
    mistakes: [
      { id: 'knees_caving_landing', description: 'Knees cave on landing',        detection: 'knee width < ankle width at landing' },
      { id: 'stiff_landing',        description: 'Landing with locked knees',    detection: 'knee angle > 160° on landing impact' },
      { id: 'shallow_squat',        description: 'Squat too shallow before jump',detection: 'min knee angle > 110° in eccentric' },
    ],
    metrics: ['reps', 'form_score', 'jump_height'],
    analyzerKey: 'jump_squat',
    tips: [
      'Land toe-ball-heel to absorb impact',
      'Keep core tight through the entire rep',
      'Aim for consistent depth each rep',
    ]
  },

  single_leg_squat: {
    id: 'single_leg_squat',
    name: 'Single-Leg Squat (Pistol)',
    location: LOCATIONS.HOME,
    muscleGroup: MUSCLE_GROUPS.LEGS,
    difficulty: DIFFICULTY.ADVANCED,
    equipment: [EQUIPMENT.NONE],
    description: 'Unilateral squat demanding balance, strength and mobility.',
    cameraAngle: 'front or slight angle — full body visible',
    keypoints: LOWER_BODY_KEYPOINTS,
    phases: {
      start:      { description: 'Standing on one leg, other extended forward' },
      eccentric:  { description: 'Lower on stance leg, keep extended leg up' },
      bottom:     { description: 'Stance knee at max flexion, balanced' },
      concentric: { description: 'Drive back up through stance heel' },
    },
    mistakes: [
      { id: 'knee_valgus',     description: 'Stance knee caves inward',          detection: 'knee x deviation from ankle' },
      { id: 'hip_drop',        description: 'Non-stance hip drops',              detection: 'hip height asymmetry' },
      { id: 'forward_lean',    description: 'Excessive forward torso lean',      detection: 'shoulder-hip angle > 50°' },
    ],
    metrics: ['reps', 'form_score', 'balance_score', 'depth_score'],
    analyzerKey: 'single_leg_squat',
    tips: [
      'Use a wall or TRX for assistance when learning',
      'Keep extended leg straight and at hip height',
      'Focus point ahead to maintain balance',
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GYM EXERCISES
  // ══════════════════════════════════════════════════════════════════════════

  barbell_squat: {
    id: 'barbell_squat',
    name: 'Barbell Back Squat',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.LEGS,
    difficulty: DIFFICULTY.INTERMEDIATE,
    equipment: [EQUIPMENT.BARBELL],
    description: 'King of lower-body exercises. Barbell on upper traps, squat to parallel or below.',
    cameraAngle: 'side view — full body, rack visible',
    keypoints: LOWER_BODY_KEYPOINTS,
    phases: {
      unrack:     { description: 'Lift bar from rack, step back, brace' },
      start:      { kneeAngle: [165, 180], description: 'Standing with bar, braced' },
      eccentric:  { kneeAngle: [90, 165],  description: 'Hips back and down, knees track toes' },
      bottom:     { kneeAngle: [60, 90],   description: 'At or below parallel' },
      concentric: { kneeAngle: [90, 165],  description: 'Drive through floor, hips and chest rise together' },
      lockout:    { kneeAngle: [165, 180], description: 'Full extension' },
    },
    mistakes: [
      { id: 'good_morning_squat', description: 'Hips rise faster than shoulders', detection: 'hip ascent rate > shoulder ascent rate' },
      { id: 'knees_caving_in',    description: 'Knee valgus under load',          detection: 'knee width < hip width' },
      { id: 'butt_wink',          description: 'Pelvis posteriorly tilts at bottom',detection: 'lumbar curve reversal' },
      { id: 'heels_lifting',      description: 'Heels rise under load',            detection: 'ankle angle change' },
      { id: 'insufficient_depth', description: 'Above parallel at bottom',         detection: 'knee angle > 100°' },
    ],
    metrics: ['reps', 'depth_score', 'form_score', 'symmetry'],
    analyzerKey: 'squat',
    tips: [
      'Brace your core like you\'re about to be punched',
      'Chest up — bar stays over mid-foot',
      'Cue: "spread the floor" with your feet',
    ]
  },

  deadlift: {
    id: 'deadlift',
    name: 'Deadlift',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.BACK,
    difficulty: DIFFICULTY.INTERMEDIATE,
    equipment: [EQUIPMENT.BARBELL],
    description: 'Posterior chain king — hamstrings, glutes, erectors and lats under load.',
    cameraAngle: 'side view — full body, bar on floor visible',
    keypoints: FULL_BODY_KEYPOINTS,
    phases: {
      setup:      { description: 'Bar over mid-foot, hip-width stance, neutral spine' },
      pull:       { description: 'Push floor away, bar stays close to body, hips and shoulders rise together' },
      lockout:    { description: 'Full hip and knee extension, shoulders behind bar' },
      eccentric:  { description: 'Hinge at hips first, then bend knees as bar passes knees' },
    },
    mistakes: [
      { id: 'rounded_back',     description: 'Lumbar spine rounds under load',  detection: 'shoulder-hip-ankle angle deviation' },
      { id: 'bar_drifting',     description: 'Bar swings away from body',       detection: 'wrist x vs ankle x separation' },
      { id: 'hips_rising_fast', description: 'Hips rise before shoulders',      detection: 'hip ascent rate > shoulder ascent rate' },
      { id: 'hyperextension',   description: 'Excessive back arch at lockout',   detection: 'lumbar hyperextension angle' },
    ],
    metrics: ['reps', 'form_score', 'back_angle', 'symmetry'],
    analyzerKey: 'deadlift',
    tips: [
      'Neutral spine from setup to lockout',
      'Pull the bar into your shins — keep it close',
      'Think "push the floor away" not "pull the bar up"',
    ]
  },

  bench_press: {
    id: 'bench_press',
    name: 'Barbell Bench Press',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.CHEST,
    difficulty: DIFFICULTY.INTERMEDIATE,
    equipment: [EQUIPMENT.BARBELL, EQUIPMENT.BENCH],
    description: 'Primary horizontal pressing movement for chest, anterior delts and triceps.',
    cameraAngle: 'side view — lying on bench, bar path visible',
    keypoints: UPPER_BODY_KEYPOINTS,
    phases: {
      setup:      { description: 'Arch, retract scapula, feet flat, bar over lower chest' },
      unrack:     { description: 'Bar over chest at arm\'s length' },
      eccentric:  { elbowAngle: [90, 160], description: 'Lower bar to lower chest, elbows ~45-75° from torso' },
      touch:      { description: 'Bar touches chest — no bounce' },
      concentric: { description: 'Press to lockout, bar travels slight arc' },
      lockout:    { elbowAngle: [160, 180], description: 'Arms locked out, bar over lower chest' },
    },
    mistakes: [
      { id: 'elbows_flaring',   description: 'Elbows >75° from torso',          detection: 'elbow-shoulder angle' },
      { id: 'bar_bounce',       description: 'Bouncing bar off chest',           detection: 'sudden velocity spike at touch' },
      { id: 'feet_lifting',     description: 'Feet leave floor',                 detection: 'ankle landmark rises' },
      { id: 'incomplete_range', description: 'Bar not touching chest',           detection: 'wrist not reaching chest level' },
    ],
    metrics: ['reps', 'form_score', 'elbow_angle', 'range_of_motion'],
    analyzerKey: 'push_up',
    tips: [
      'Retract and depress scapulae before each set',
      'Elbows at 45-60° to torso to protect shoulders',
      'Drive feet into floor for leg drive',
    ]
  },

  shoulder_press: {
    id: 'shoulder_press',
    name: 'Overhead Press',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.SHOULDERS,
    difficulty: DIFFICULTY.INTERMEDIATE,
    equipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELLS],
    description: 'Vertical pressing movement targeting deltoids and upper chest.',
    cameraAngle: 'side or front view — full torso visible',
    keypoints: UPPER_BODY_KEYPOINTS,
    phases: {
      rack:       { description: 'Bar at clavicle height, elbows slightly forward' },
      press:      { elbowAngle: [90, 180], description: 'Press bar vertically over base of skull' },
      lockout:    { elbowAngle: [165, 180], description: 'Arms locked, bar stacked over hips' },
      eccentric:  { description: 'Lower bar back to clavicle level' },
    },
    mistakes: [
      { id: 'elbow_flare',    description: 'Elbows flare excessively at start', detection: 'elbow position behind bar' },
      { id: 'lumbar_arch',    description: 'Excessive lower back arch',          detection: 'hip-shoulder angle > 15°' },
      { id: 'bar_path_curve', description: 'Bar drifts forward on way up',       detection: 'wrist x deviation from shoulder x' },
    ],
    metrics: ['reps', 'form_score', 'elbow_angle', 'torso_angle'],
    analyzerKey: 'shoulder_press',
    tips: [
      'Brace core hard — this protects your spine',
      'Bar should travel in straight vertical line',
      'At lockout — shrug slightly to pack shoulders',
    ]
  },

  lat_pulldown: {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.BACK,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.CABLE],
    description: 'Vertical pulling movement targeting latissimus dorsi and biceps.',
    cameraAngle: 'front or slight side view — arms fully visible',
    keypoints: UPPER_BODY_KEYPOINTS,
    phases: {
      start:      { elbowAngle: [160, 180], description: 'Arms extended overhead, slight lean back' },
      pull:       { elbowAngle: [90, 140],  description: 'Pull bar to upper chest, elbows drive down' },
      bottom:     { elbowAngle: [70, 90],   description: 'Bar at upper chest, elbows at sides' },
      eccentric:  { description: 'Control bar back to start — don\'t let it pull you' },
    },
    mistakes: [
      { id: 'using_momentum',   description: 'Swinging torso to assist pull',   detection: 'shoulder x oscillation > threshold' },
      { id: 'partial_range',    description: 'Bar not reaching chest',           detection: 'wrist y not reaching shoulder y' },
      { id: 'elbows_forward',   description: 'Elbows flare forward vs down',    detection: 'elbow x deviation' },
    ],
    metrics: ['reps', 'form_score', 'elbow_angle', 'range_of_motion'],
    analyzerKey: 'lat_pulldown',
    tips: [
      'Lead with elbows — think of them as hooks',
      'Slight backward lean is fine; avoid excessive swing',
      'Squeeze lats at the bottom of the rep',
    ]
  },

  pull_up: {
    id: 'pull_up',
    name: 'Pull-Up',
    location: LOCATIONS.BOTH,
    muscleGroup: MUSCLE_GROUPS.BACK,
    difficulty: DIFFICULTY.ADVANCED,
    equipment: [EQUIPMENT.PULL_UP_BAR],
    description: 'Bodyweight vertical pulling exercise. Excellent lat and bicep developer.',
    cameraAngle: 'side or front view — full hanging body visible',
    keypoints: UPPER_BODY_KEYPOINTS,
    phases: {
      dead_hang:  { elbowAngle: [160, 180], description: 'Full hang, arms extended, shoulders packed' },
      pull:       { elbowAngle: [90, 140],  description: 'Pull chest toward bar, elbows drive down' },
      top:        { elbowAngle: [45, 70],   description: 'Chin or chest above bar' },
      eccentric:  { description: 'Slow controlled descent to dead hang' },
    },
    mistakes: [
      { id: 'kipping',           description: 'Using hip swing for momentum',   detection: 'hip x oscillation' },
      { id: 'partial_range',     description: 'Arms not fully extending at bottom', detection: 'elbow angle < 150° at bottom' },
      { id: 'chin_not_above_bar',description: 'Chin does not clear bar',         detection: 'wrist y vs chin y' },
    ],
    metrics: ['reps', 'form_score', 'range_of_motion', 'tempo'],
    analyzerKey: 'pull_up',
    tips: [
      'Start every rep from a full dead hang',
      'Pack shoulders before initiating the pull',
      'Cross ankles and keep legs straight to reduce swing',
    ]
  },

  barbell_row: {
    id: 'barbell_row',
    name: 'Barbell Row',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.BACK,
    difficulty: DIFFICULTY.INTERMEDIATE,
    equipment: [EQUIPMENT.BARBELL],
    description: 'Horizontal pulling movement for mid/upper back, lats and biceps.',
    cameraAngle: 'side view — hinged position and bar visible',
    keypoints: FULL_BODY_KEYPOINTS,
    phases: {
      setup:      { description: 'Hip hinge ~45°, bar hanging, neutral spine' },
      pull:       { description: 'Row bar toward lower chest, elbows drive back' },
      top:        { description: 'Bar touches lower ribcage, elbows behind torso' },
      eccentric:  { description: 'Lower bar under control, maintain hinge' },
    },
    mistakes: [
      { id: 'rounding_back',    description: 'Spine rounds during row',          detection: 'shoulder-hip angle deviation' },
      { id: 'jerking',          description: 'Using momentum to row',            detection: 'sudden velocity spike' },
      { id: 'bar_too_high',     description: 'Bar pulled to upper chest (bicep row)', detection: 'wrist reaching too high' },
    ],
    metrics: ['reps', 'form_score', 'torso_angle', 'elbow_angle'],
    analyzerKey: 'barbell_row',
    tips: [
      'Maintain a neutral spine throughout',
      'Drive elbows past torso — don\'t just lift arms',
      'Squeeze shoulder blades together at the top',
    ]
  },

  leg_press: {
    id: 'leg_press',
    name: 'Leg Press',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.LEGS,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.LEG_PRESS],
    description: 'Machine-based quad/glute pressing exercise. Lower injury risk than barbell squat.',
    cameraAngle: 'side view — machine seat and legs visible',
    keypoints: ['left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'],
    phases: {
      start:      { kneeAngle: [160, 180], description: 'Legs extended, feet hip-width on platform' },
      eccentric:  { kneeAngle: [90, 160],  description: 'Lower platform toward chest' },
      bottom:     { kneeAngle: [70, 90],   description: 'Knees near chest, lower back stays on seat' },
      concentric: { description: 'Press platform away through full extension' },
      lockout:    { kneeAngle: [155, 175], description: 'Legs extended — do not lock knees fully' },
    },
    mistakes: [
      { id: 'butt_lifting',    description: 'Lower back / butt lifts off seat', detection: 'hip y changes on seat' },
      { id: 'knees_caving',    description: 'Knees track inward',               detection: 'knee width < ankle width' },
      { id: 'locking_knees',   description: 'Full knee lockout at top',         detection: 'knee angle > 175°' },
    ],
    metrics: ['reps', 'form_score', 'knee_angle', 'range_of_motion'],
    analyzerKey: 'leg_press',
    tips: [
      'Never fully lock out your knees at extension',
      'Feet higher on platform = more glutes; lower = more quads',
      'Keep lower back pressed into the pad',
    ]
  },

  leg_curl: {
    id: 'leg_curl',
    name: 'Leg Curl',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.LEGS,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.MACHINE],
    description: 'Hamstring isolation exercise on a lying or seated machine.',
    cameraAngle: 'side view — legs and pad clearly visible',
    keypoints: ['left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'],
    phases: {
      start:      { kneeAngle: [160, 180], description: 'Legs extended on pad' },
      concentric: { kneeAngle: [60, 90],   description: 'Curl heels toward glutes' },
      bottom:     { description: 'Heels near glutes' },
      eccentric:  { description: 'Slow controlled extension' },
    },
    mistakes: [
      { id: 'hips_lifting',    description: 'Hips rise off pad during curl',    detection: 'hip y rises significantly' },
      { id: 'partial_range',   description: 'Heels not reaching near glutes',   detection: 'knee angle > 100° at peak' },
    ],
    metrics: ['reps', 'form_score', 'knee_angle', 'range_of_motion'],
    analyzerKey: 'leg_curl',
    tips: [
      'Keep hips pressed into the pad',
      'Control the eccentric — don\'t let weight crash',
      'Full range: heels as close to glutes as possible',
    ]
  },

  leg_extension: {
    id: 'leg_extension',
    name: 'Leg Extension',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.LEGS,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.MACHINE],
    description: 'Quad isolation exercise on a seated machine.',
    cameraAngle: 'side view — seated, full leg visible',
    keypoints: ['left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'],
    phases: {
      start:      { kneeAngle: [70, 90],   description: 'Seated, knees at ~90°' },
      concentric: { kneeAngle: [140, 180], description: 'Extend legs to near full extension' },
      lockout:    { kneeAngle: [160, 180], description: 'Quads fully contracted' },
      eccentric:  { description: 'Controlled return to start' },
    },
    mistakes: [
      { id: 'momentum',        description: 'Using swing to extend',            detection: 'velocity spike at start' },
      { id: 'partial_range',   description: 'Not reaching full extension',       detection: 'knee angle < 150° at peak' },
    ],
    metrics: ['reps', 'form_score', 'knee_angle'],
    analyzerKey: 'leg_extension',
    tips: [
      'Slow eccentric (3-4 seconds) for better quad stimulus',
      'Pause and squeeze at the top',
      'Toes slightly up to increase VMO activation',
    ]
  },

  bicep_curl: {
    id: 'bicep_curl',
    name: 'Bicep Curl',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.ARMS,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.DUMBBELLS, EQUIPMENT.BARBELL],
    description: 'Classic elbow flexion exercise isolating the biceps brachii.',
    cameraAngle: 'front or side view — full arms visible',
    keypoints: UPPER_BODY_KEYPOINTS,
    phases: {
      start:      { elbowAngle: [160, 180], description: 'Arms hanging, palms forward' },
      concentric: { elbowAngle: [60, 130],  description: 'Curl weight toward shoulders' },
      peak:       { elbowAngle: [30, 60],   description: 'Peak contraction, squeeze bicep' },
      eccentric:  { description: 'Lower with control to full extension' },
    },
    mistakes: [
      { id: 'elbow_drift',   description: 'Elbows swing forward',              detection: 'elbow x moves ahead of shoulder x' },
      { id: 'body_swing',    description: 'Using back swing for momentum',     detection: 'shoulder x oscillation' },
      { id: 'partial_range', description: 'Not fully extending at bottom',      detection: 'elbow angle < 150° at bottom' },
    ],
    metrics: ['reps', 'form_score', 'elbow_angle', 'range_of_motion'],
    analyzerKey: 'bicep_curl',
    tips: [
      'Keep elbows pinned to sides throughout',
      'Supinate (rotate) wrist at the top for peak contraction',
      'Slow eccentric = more muscle stimulus',
    ]
  },

  tricep_extension: {
    id: 'tricep_extension',
    name: 'Tricep Extension',
    location: LOCATIONS.GYM,
    muscleGroup: MUSCLE_GROUPS.ARMS,
    difficulty: DIFFICULTY.BEGINNER,
    equipment: [EQUIPMENT.DUMBBELLS, EQUIPMENT.CABLE],
    description: 'Elbow extension exercise isolating the triceps brachii.',
    cameraAngle: 'side view — full arm visible',
    keypoints: UPPER_BODY_KEYPOINTS,
    phases: {
      start:      { elbowAngle: [70, 90],   description: 'Elbows bent, upper arms stationary' },
      eccentric:  { elbowAngle: [40, 70],   description: 'Controlled bend toward full flexion' },
      concentric: { elbowAngle: [90, 170],  description: 'Extend arms fully' },
      lockout:    { elbowAngle: [160, 180], description: 'Arms straight, triceps contracted' },
    },
    mistakes: [
      { id: 'elbow_flare',   description: 'Elbows splay outward',              detection: 'elbow x > shoulder x' },
      { id: 'upper_arm_move',description: 'Upper arm swings instead of staying still', detection: 'elbow y movement > threshold' },
      { id: 'partial_range', description: 'Arms not fully extending',           detection: 'elbow angle < 150° at lockout' },
    ],
    metrics: ['reps', 'form_score', 'elbow_angle'],
    analyzerKey: 'tricep_extension',
    tips: [
      'Keep upper arms perpendicular to floor',
      'Only your forearms should move',
      'Squeeze triceps hard at full extension',
    ]
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Filter exercises by location, muscleGroup and/or difficulty */
export function filterExercises({ location, muscleGroup, difficulty, equipment } = {}) {
  return Object.values(exerciseDatabase).filter(ex => {
    if (location && ex.location !== location && ex.location !== LOCATIONS.BOTH) return false;
    if (muscleGroup && ex.muscleGroup !== muscleGroup) return false;
    if (difficulty && ex.difficulty !== difficulty) return false;
    if (equipment && !ex.equipment.includes(equipment)) return false;
    return true;
  });
}

/** Get a single exercise by id */
export function getExercise(id) {
  return exerciseDatabase[id] || null;
}

/** All unique muscle groups present in database */
export const allMuscleGroups = [...new Set(Object.values(exerciseDatabase).map(e => e.muscleGroup))];
/** All unique difficulties */
export const allDifficulties = [DIFFICULTY.BEGINNER, DIFFICULTY.INTERMEDIATE, DIFFICULTY.ADVANCED];
/** All unique locations */
export const allLocations = [LOCATIONS.HOME, LOCATIONS.GYM, LOCATIONS.BOTH];