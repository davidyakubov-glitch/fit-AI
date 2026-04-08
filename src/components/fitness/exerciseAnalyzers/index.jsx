/**
 * Central exercise analyzer registry.
 * To add a new exercise: import its analyzer and add an entry to EXERCISE_ANALYZERS.
 *
 * Each entry: {
 *   analyze: (landmarks, state, extra) => result | null,
 *   initialState: string,
 *   isTimeBased: boolean,   // true for plank / wall-sit
 *   stateLabels: { up, down } or custom
 * }
 */

import { analyzeSquat }         from './squatAnalyzer';
import { analyzePushup }        from './pushupAnalyzer';
import { analyzePlank }         from './plankAnalyzer';
import { analyzeLunge }         from './lungeAnalyzer';
import { analyzeShoulderPress } from './shoulderPressAnalyzer';
import { analyzeBicepCurl }     from './bicepCurlAnalyzer';
import { analyzeSitup }         from './situpAnalyzer';
import { analyzeJumpingJack }   from './jumpingJackAnalyzer';

export const EXERCISE_ANALYZERS = {
  squat: {
    analyze: (lm, state) => analyzeSquat(lm, state),
    initialState: 'up',
    isTimeBased: false
  },
  lunge: {
    analyze: (lm, state) => analyzeLunge(lm, state),
    initialState: 'up',
    isTimeBased: false
  },
  jump_squat: {
    analyze: (lm, state) => analyzeSquat(lm, state), // Same mechanics
    initialState: 'up',
    isTimeBased: false
  },
  pushup: {
    analyze: (lm, state) => analyzePushup(lm, state),
    initialState: 'up',
    isTimeBased: false
  },
  shoulder_press: {
    analyze: (lm, state) => analyzeShoulderPress(lm, state),
    initialState: 'down',
    isTimeBased: false
  },
  bicep_curl: {
    analyze: (lm, state) => analyzeBicepCurl(lm, state),
    initialState: 'down',
    isTimeBased: false
  },
  plank: {
    analyze: (lm, state, extra) => analyzePlank(lm, state, extra?.holdSeconds || 0),
    initialState: 'adjusting',
    isTimeBased: true
  },
  situp: {
    analyze: (lm, state) => analyzeSitup(lm, state),
    initialState: 'down',
    isTimeBased: false
  },
  jumping_jack: {
    analyze: (lm, state) => analyzeJumpingJack(lm, state),
    initialState: 'closed',
    isTimeBased: false
  }
};

/**
 * Map exercise IDs from the exercise database to analyzer keys.
 * Add new mappings here when new exercises are added to the database.
 */
export const EXERCISE_ID_MAP = {
  squat: 'squat',
  lunge: 'lunge',
  jump_squat: 'jump_squat',
  wall_sit: 'plank',        // Treat wall sit as plank (time-based)
  pushup: 'pushup',
  push_up: 'pushup',
  chest_press: 'pushup',
  shoulder_press: 'shoulder_press',
  tricep_dip: 'pushup',     // Similar elbow mechanics
  bicep_curl: 'bicep_curl',
  plank: 'plank',
  situp: 'situp',
  sit_up: 'situp',
  mountain_climber: 'plank', // Plank-derived
  burpee: 'squat',           // Simplified: detect the squat phase
  jumping_jack: 'jumping_jack'
};

export function getAnalyzer(exerciseId) {
  const key = EXERCISE_ID_MAP[exerciseId] || exerciseId;
  return EXERCISE_ANALYZERS[key] || EXERCISE_ANALYZERS.squat; // Default to squat
}