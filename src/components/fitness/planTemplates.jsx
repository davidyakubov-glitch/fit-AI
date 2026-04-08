/**
 * Preset workout plan templates.
 * exercise_id must match keys in exerciseDatabase.js
 */

export const PLAN_TEMPLATES = [
  {
    id: 'beginner_full_body',
    name: 'Beginner Full Body',
    description: 'Perfect starting routine covering all major muscle groups with bodyweight exercises.',
    goal: 'general',
    difficulty: 'beginner',
    estimated_duration_minutes: 25,
    source: 'preset',
    exercises: [
      { exercise_id: 'squat',          exercise_name: 'Bodyweight Squat',   sets: 3, reps: '12', rest_seconds: 60,  notes: 'Focus on depth and form' },
      { exercise_id: 'push_up',        exercise_name: 'Push-Up',            sets: 3, reps: '10', rest_seconds: 60,  notes: 'Drop to knees if needed' },
      { exercise_id: 'glute_bridge',   exercise_name: 'Glute Bridge',       sets: 3, reps: '15', rest_seconds: 45,  notes: 'Squeeze at the top' },
      { exercise_id: 'plank',          exercise_name: 'Plank',              sets: 3, reps: '30s', rest_seconds: 60,  notes: 'Keep hips level' },
      { exercise_id: 'lunge',          exercise_name: 'Forward Lunge',      sets: 2, reps: '10 each', rest_seconds: 60,  notes: 'Alternate legs' },
    ]
  },
  {
    id: 'home_hiit',
    name: 'Home HIIT Blast',
    description: 'High-intensity interval training with no equipment needed. Burns fat and builds endurance.',
    goal: 'weight_loss',
    difficulty: 'intermediate',
    estimated_duration_minutes: 30,
    source: 'preset',
    exercises: [
      { exercise_id: 'jump_squat',       exercise_name: 'Jump Squat',        sets: 4, reps: '15', rest_seconds: 30,  notes: 'Land softly' },
      { exercise_id: 'push_up',          exercise_name: 'Push-Up',           sets: 3, reps: '15', rest_seconds: 30,  notes: 'Maintain plank' },
      { exercise_id: 'mountain_climber', exercise_name: 'Mountain Climbers', sets: 4, reps: '30s', rest_seconds: 30,  notes: 'Steady pace' },
      { exercise_id: 'burpee',           exercise_name: 'Burpee',            sets: 3, reps: '10', rest_seconds: 45,  notes: 'Scale by stepping if needed' },
      { exercise_id: 'lunge',            exercise_name: 'Forward Lunge',     sets: 3, reps: '12 each', rest_seconds: 30,  notes: 'Fast but controlled' },
    ]
  },
  {
    id: 'upper_body_strength',
    name: 'Upper Body Strength',
    description: 'Gym session focused on chest, back, shoulders and arms with compound and isolation moves.',
    goal: 'muscle_gain',
    difficulty: 'intermediate',
    estimated_duration_minutes: 45,
    source: 'preset',
    exercises: [
      { exercise_id: 'bench_press',       exercise_name: 'Barbell Bench Press', sets: 4, reps: '8',  rest_seconds: 90,  notes: 'Control the descent' },
      { exercise_id: 'barbell_row',       exercise_name: 'Barbell Row',         sets: 4, reps: '8',  rest_seconds: 90,  notes: 'Squeeze shoulder blades' },
      { exercise_id: 'shoulder_press',    exercise_name: 'Overhead Press',      sets: 3, reps: '10', rest_seconds: 75,  notes: 'Brace core hard' },
      { exercise_id: 'pull_up',           exercise_name: 'Pull-Up',             sets: 3, reps: '6',  rest_seconds: 90,  notes: 'Full dead hang each rep' },
      { exercise_id: 'bicep_curl',        exercise_name: 'Bicep Curl',          sets: 3, reps: '12', rest_seconds: 60,  notes: 'No swinging' },
      { exercise_id: 'tricep_extension',  exercise_name: 'Tricep Extension',    sets: 3, reps: '12', rest_seconds: 60,  notes: 'Upper arms still' },
    ]
  },
  {
    id: 'leg_day',
    name: 'Leg Day',
    description: 'Complete lower body session targeting quads, hamstrings, glutes, and calves.',
    goal: 'strength',
    difficulty: 'intermediate',
    estimated_duration_minutes: 50,
    source: 'preset',
    exercises: [
      { exercise_id: 'barbell_squat',  exercise_name: 'Barbell Back Squat', sets: 4, reps: '6',  rest_seconds: 120, notes: 'At or below parallel' },
      { exercise_id: 'deadlift',       exercise_name: 'Deadlift',           sets: 3, reps: '5',  rest_seconds: 120, notes: 'Neutral spine throughout' },
      { exercise_id: 'leg_press',      exercise_name: 'Leg Press',          sets: 3, reps: '12', rest_seconds: 75,  notes: 'Full range, don\'t lock out' },
      { exercise_id: 'leg_curl',       exercise_name: 'Leg Curl',           sets: 3, reps: '12', rest_seconds: 60,  notes: 'Slow eccentric' },
      { exercise_id: 'leg_extension',  exercise_name: 'Leg Extension',      sets: 3, reps: '15', rest_seconds: 60,  notes: 'Squeeze at top' },
    ]
  },
  {
    id: 'core_mobility',
    name: 'Core & Stability',
    description: 'Build a strong, stable core and improve body control with these targeted movements.',
    goal: 'general',
    difficulty: 'beginner',
    estimated_duration_minutes: 20,
    source: 'preset',
    exercises: [
      { exercise_id: 'plank',          exercise_name: 'Plank',          sets: 4, reps: '45s', rest_seconds: 45,  notes: 'Perfect alignment' },
      { exercise_id: 'glute_bridge',   exercise_name: 'Glute Bridge',   sets: 3, reps: '20', rest_seconds: 45,  notes: 'Full hip extension' },
      { exercise_id: 'sit_up',         exercise_name: 'Sit-Up / Crunch', sets: 3, reps: '15', rest_seconds: 45, notes: 'Don\'t pull neck' },
      { exercise_id: 'mountain_climber',exercise_name: 'Mountain Climbers', sets: 3, reps: '20s', rest_seconds: 30, notes: 'Hips stay down' },
    ]
  },
  {
    id: 'advanced_athlete',
    name: 'Advanced Power',
    description: 'Challenging full-body power routine for experienced athletes. Not for beginners.',
    goal: 'strength',
    difficulty: 'advanced',
    estimated_duration_minutes: 55,
    source: 'preset',
    exercises: [
      { exercise_id: 'barbell_squat',    exercise_name: 'Barbell Back Squat',       sets: 5, reps: '5',  rest_seconds: 180, notes: 'Max effort' },
      { exercise_id: 'deadlift',         exercise_name: 'Deadlift',                 sets: 4, reps: '4',  rest_seconds: 180, notes: 'Heavy singles to triples' },
      { exercise_id: 'single_leg_squat', exercise_name: 'Single-Leg Squat (Pistol)', sets: 3, reps: '5 each', rest_seconds: 90, notes: 'Controlled descent' },
      { exercise_id: 'pull_up',          exercise_name: 'Pull-Up',                  sets: 4, reps: '8',  rest_seconds: 90,  notes: 'Weighted if possible' },
      { exercise_id: 'jump_squat',       exercise_name: 'Jump Squat',               sets: 4, reps: '10', rest_seconds: 60,  notes: 'Explosive and fast' },
    ]
  },
];