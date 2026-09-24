import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Dumbbell, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';

const EXERCISE_CATALOG = {
  none: {
    muscle_gain: [
      { name: 'Push-Up', target_muscles: 'Chest, Shoulders, Triceps', form_cues: 'Keep body in a straight line, lower chest to floor' },
      { name: 'Bodyweight Squat', target_muscles: 'Quads, Glutes, Hamstrings', form_cues: 'Chest up, knees track over toes, squat to parallel' },
      { name: 'Forward Lunge', target_muscles: 'Quads, Glutes', form_cues: 'Front knee over ankle, back knee just above floor' },
      { name: 'Glute Bridge', target_muscles: 'Glutes, Hamstrings', form_cues: 'Drive hips up, squeeze glutes at the top' },
      { name: 'Single-Leg Squat', target_muscles: 'Quads, Glutes, Core', form_cues: 'Control the descent, keep knee aligned with toes' },
      { name: 'Plank', target_muscles: 'Core, Shoulders', form_cues: 'Hips level, breathe steadily, squeeze core' },
    ],
    weight_loss: [
      { name: 'Jump Squat', target_muscles: 'Quads, Glutes, Calves', form_cues: 'Land softly with knees slightly bent' },
      { name: 'Burpee', target_muscles: 'Full body', form_cues: 'Jump high, land soft, keep core tight throughout' },
      { name: 'Mountain Climbers', target_muscles: 'Core, Shoulders, Hip Flexors', form_cues: 'Hips low, drive knees toward chest alternately' },
      { name: 'Push-Up', target_muscles: 'Chest, Shoulders, Triceps', form_cues: 'Straight body, full range of motion' },
      { name: 'Forward Lunge', target_muscles: 'Quads, Glutes', form_cues: 'Alternate legs, keep torso upright' },
      { name: 'Sit-Up', target_muscles: 'Abs, Hip Flexors', form_cues: 'Feet flat, hands behind head lightly' },
    ],
    endurance: [
      { name: 'Mountain Climbers', target_muscles: 'Core, Full body', form_cues: 'Steady pace, hips stay low' },
      { name: 'Burpee', target_muscles: 'Full body', form_cues: 'Controlled pace, full extension on jump' },
      { name: 'Jump Squat', target_muscles: 'Quads, Glutes', form_cues: 'Consistent depth, explosive up' },
      { name: 'Push-Up', target_muscles: 'Upper body', form_cues: 'Maintain tempo, full range' },
      { name: 'Sit-Up', target_muscles: 'Core', form_cues: 'Steady rhythm, full curl up' },
      { name: 'Plank', target_muscles: 'Core', form_cues: 'Timed hold, breathe steadily' },
    ],
    general: [
      { name: 'Bodyweight Squat', target_muscles: 'Quads, Glutes, Hamstrings', form_cues: 'Squat to parallel, chest up' },
      { name: 'Push-Up', target_muscles: 'Chest, Shoulders, Triceps', form_cues: 'Full range of motion, straight body' },
      { name: 'Plank', target_muscles: 'Core, Shoulders', form_cues: 'Neutral spine, hold position' },
      { name: 'Forward Lunge', target_muscles: 'Quads, Glutes', form_cues: 'Step forward, knee over ankle' },
      { name: 'Glute Bridge', target_muscles: 'Glutes, Hamstrings', form_cues: 'Squeeze at top, controlled descent' },
      { name: 'Sit-Up', target_muscles: 'Core', form_cues: 'Hands behind head lightly' },
    ],
  },
  basic: {
    muscle_gain: [
      { name: 'Dumbbell Squat', target_muscles: 'Quads, Glutes', form_cues: 'Hold dumbbells at sides, squat to parallel' },
      { name: 'Bicep Curl', target_muscles: 'Biceps', form_cues: 'No swinging, slow on the way down' },
      { name: 'Shoulder Press', target_muscles: 'Shoulders, Triceps', form_cues: 'Press overhead, brace core' },
      { name: 'Tricep Extension', target_muscles: 'Triceps', form_cues: 'Upper arms still, extend fully' },
      { name: 'Forward Lunge', target_muscles: 'Quads, Glutes', form_cues: 'Dumbbells at sides, alternate legs' },
      { name: 'Push-Up', target_muscles: 'Chest, Shoulders', form_cues: 'Full range, elbows 45°' },
    ],
    weight_loss: [
      { name: 'Jump Squat', target_muscles: 'Quads, Glutes', form_cues: 'Explosive up, land soft' },
      { name: 'Dumbbell Thruster', target_muscles: 'Full body', form_cues: 'Squat then press overhead in one motion' },
      { name: 'Bicep Curl', target_muscles: 'Biceps', form_cues: 'Controlled, high reps' },
      { name: 'Burpee', target_muscles: 'Full body', form_cues: 'Maintain intensity' },
      { name: 'Shoulder Press', target_muscles: 'Shoulders', form_cues: 'Press and lower steadily' },
      { name: 'Mountain Climbers', target_muscles: 'Core', form_cues: 'Fast feet, hips low' },
    ],
    endurance: [
      { name: 'Dumbbell Squat', target_muscles: 'Quads, Glutes', form_cues: 'High reps, consistent depth' },
      { name: 'Bicep Curl', target_muscles: 'Biceps', form_cues: 'Higher reps, shorter rest' },
      { name: 'Shoulder Press', target_muscles: 'Shoulders', form_cues: 'Lighter weight, more reps' },
      { name: 'Mountain Climbers', target_muscles: 'Core, Cardio', form_cues: 'Steady pace, 30-60s' },
      { name: 'Forward Lunge', target_muscles: 'Legs', form_cues: 'Alternate sides, keep moving' },
      { name: 'Tricep Extension', target_muscles: 'Triceps', form_cues: 'High reps, controlled' },
    ],
    general: [
      { name: 'Dumbbell Squat', target_muscles: 'Quads, Glutes, Hamstrings', form_cues: 'Hold dumbbells, squat to parallel' },
      { name: 'Push-Up', target_muscles: 'Chest, Shoulders', form_cues: 'Full range, straight body' },
      { name: 'Bicep Curl', target_muscles: 'Biceps', form_cues: 'No swinging, slow descent' },
      { name: 'Shoulder Press', target_muscles: 'Shoulders', form_cues: 'Brace core, press overhead' },
      { name: 'Forward Lunge', target_muscles: 'Quads, Glutes', form_cues: 'Step and lunge, alternate' },
      { name: 'Plank', target_muscles: 'Core', form_cues: 'Level hips, breathe' },
    ],
  },
  full_gym: {
    muscle_gain: [
      { name: 'Barbell Bench Press', target_muscles: 'Chest, Shoulders, Triceps', form_cues: 'Control descent, arch naturally, feet flat' },
      { name: 'Barbell Back Squat', target_muscles: 'Quads, Glutes, Hamstrings', form_cues: 'Below parallel, knees out, chest up' },
      { name: 'Barbell Row', target_muscles: 'Back, Biceps', form_cues: 'Hinge at hips, pull to lower chest, squeeze' },
      { name: 'Overhead Press', target_muscles: 'Shoulders, Triceps', form_cues: 'Brace core, press directly overhead' },
      { name: 'Lat Pulldown', target_muscles: 'Lats, Biceps', form_cues: 'Pull to upper chest, full extension on the way up' },
      { name: 'Bicep Curl', target_muscles: 'Biceps', form_cues: 'Slow eccentric, no swinging' },
      { name: 'Tricep Extension', target_muscles: 'Triceps', form_cues: 'Upper arms vertical, extend fully' },
    ],
    weight_loss: [
      { name: 'Barbell Back Squat', target_muscles: 'Quads, Glutes', form_cues: 'Full depth, controlled' },
      { name: 'Deadlift', target_muscles: 'Full posterior chain', form_cues: 'Neutral spine, drive hips forward' },
      { name: 'Barbell Bench Press', target_muscles: 'Chest', form_cues: 'Moderate weight, controlled tempo' },
      { name: 'Barbell Row', target_muscles: 'Back', form_cues: 'Explosive pull, controlled lower' },
      { name: 'Jump Squat', target_muscles: 'Quads, Glutes', form_cues: 'Between sets as a finisher' },
      { name: 'Mountain Climbers', target_muscles: 'Core, Cardio', form_cues: 'Fast feet, hips level' },
    ],
    endurance: [
      { name: 'Leg Press', target_muscles: 'Quads, Glutes', form_cues: 'Higher reps, shorter rest, full range' },
      { name: 'Lat Pulldown', target_muscles: 'Lats', form_cues: 'Lighter weight, 15-20 reps' },
      { name: 'Barbell Bench Press', target_muscles: 'Chest', form_cues: 'Moderate weight, 15 reps' },
      { name: 'Leg Curl', target_muscles: 'Hamstrings', form_cues: 'Full range, slow eccentric' },
      { name: 'Leg Extension', target_muscles: 'Quads', form_cues: 'Squeeze at top' },
      { name: 'Mountain Climbers', target_muscles: 'Core', form_cues: '30-45 seconds steady pace' },
    ],
    general: [
      { name: 'Barbell Back Squat', target_muscles: 'Quads, Glutes, Hamstrings', form_cues: 'Parallel or below, chest up' },
      { name: 'Barbell Bench Press', target_muscles: 'Chest, Shoulders, Triceps', form_cues: 'Control descent, natural arch' },
      { name: 'Barbell Row', target_muscles: 'Back, Biceps', form_cues: 'Hinge at hips, squeeze at top' },
      { name: 'Overhead Press', target_muscles: 'Shoulders', form_cues: 'Core tight, full lockout' },
      { name: 'Leg Press', target_muscles: 'Quads, Glutes', form_cues: 'Full range, knees out' },
      { name: 'Bicep Curl', target_muscles: 'Biceps', form_cues: 'No swinging, controlled' },
    ],
  },
};

const LEVEL_SETS = { beginner: 2, intermediate: 3, advanced: 4 };
const LEVEL_REPS = {
  beginner:     { default: '12', cardio: '8',  timed: '20s' },
  intermediate: { default: '10', cardio: '12', timed: '30s' },
  advanced:     { default: '8',  cardio: '15', timed: '45s' },
};
const LEVEL_REST = {
  beginner:     { default: 75, cardio: 45 },
  intermediate: { default: 60, cardio: 30 },
  advanced:     { default: 90, cardio: 30 },
};

const CARDIO_NAMES = new Set(['Jump Squat', 'Burpee', 'Mountain Climbers', 'Dumbbell Thruster']);
const TIMED_NAMES = new Set(['Plank', 'Mountain Climbers']);

const DURATION_TO_COUNT = { '15': 3, '30': 4, '45': 5, '60': 6 };

const PLAN_TITLES = {
  muscle_gain: { beginner: 'Beginner Muscle Builder', intermediate: 'Hypertrophy Session', advanced: 'Advanced Mass Protocol' },
  weight_loss:  { beginner: 'Fat Burn Starter', intermediate: 'HIIT Blast', advanced: 'Metabolic Conditioning' },
  endurance:    { beginner: 'Cardio Foundation', intermediate: 'Stamina Circuit', advanced: 'Elite Endurance' },
  general:      { beginner: 'Full Body Basics', intermediate: 'General Fitness', advanced: 'Advanced Full Body' },
};

const PLAN_DESCRIPTIONS = {
  muscle_gain: 'Focused on hypertrophy and strength through compound and isolation movements.',
  weight_loss:  'High-intensity session to maximize calorie burn and metabolic rate.',
  endurance:    'Circuit-style training to build cardiovascular and muscular endurance.',
  general:      'Balanced workout covering all major muscle groups.',
};

function buildWorkout({ goal, duration, equipment, level = 'intermediate' }) {
  const catalog = EXERCISE_CATALOG[equipment]?.[goal] || EXERCISE_CATALOG.none.general;
  const count = DURATION_TO_COUNT[duration] || 4;
  const sets = LEVEL_SETS[level] || 3;
  const repsMap = LEVEL_REPS[level] || LEVEL_REPS.intermediate;
  const restMap = LEVEL_REST[level] || LEVEL_REST.intermediate;

  const exercises = catalog.slice(0, count).map((ex) => {
    const isCardio = CARDIO_NAMES.has(ex.name);
    const isTimed = TIMED_NAMES.has(ex.name);
    return {
      ...ex,
      sets,
      reps: isTimed ? repsMap.timed : isCardio ? repsMap.cardio : repsMap.default,
      rest_seconds: isCardio ? restMap.cardio : restMap.default,
    };
  });

  return {
    workout_name: PLAN_TITLES[goal]?.[level] || 'Custom Workout',
    description: PLAN_DESCRIPTIONS[goal] || '',
    total_duration: Number(duration),
    exercises,
  };
}

export default function AIWorkoutGenerator({ onWorkoutGenerated }) {
  const [loading, setLoading] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [preferences, setPreferences] = useState({
    goal: 'muscle_gain',
    duration: '30',
    equipment: 'bodyweight',
    level: 'intermediate',
  });

  const generateWorkout = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    try {
      const result = buildWorkout({
        goal: preferences.goal,
        duration: preferences.duration,
        equipment: preferences.equipment === 'bodyweight' ? 'none' : preferences.equipment,
        level: preferences.level,
      });
      setGeneratedWorkout({ ...result, preferences });
      toast.success('Workout generated!');
    } catch {
      toast.error('Failed to generate workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveWorkout = () => {
    if (generatedWorkout && onWorkoutGenerated) {
      onWorkoutGenerated(generatedWorkout);
      toast.success('Workout saved! Start your session below.');
      setGeneratedWorkout(null);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-purple-200 dark:border-purple-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          AI Workout Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generatedWorkout ? (
          <>
            {/* Goal */}
            <div>
              <label className="block text-sm font-medium mb-2">Fitness Goal</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
                  { value: 'weight_loss', label: 'Weight Loss', icon: '🔥' },
                  { value: 'endurance', label: 'Endurance', icon: '🏃' },
                  { value: 'general', label: 'General Fitness', icon: '⭐' },
                ].map(goal => (
                  <button key={goal.value}
                    onClick={() => setPreferences({ ...preferences, goal: goal.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${preferences.goal === goal.value ? 'border-purple-600 bg-purple-100 dark:bg-purple-900' : 'border-gray-200 hover:border-purple-300 dark:border-gray-700'}`}>
                    <div className="text-2xl mb-1">{goal.icon}</div>
                    <div className="text-xs font-medium">{goal.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {['15', '30', '45', '60'].map(d => (
                  <button key={d}
                    onClick={() => setPreferences({ ...preferences, duration: d })}
                    className={`p-3 rounded-lg border-2 transition-all ${preferences.duration === d ? 'border-purple-600 bg-purple-100 dark:bg-purple-900' : 'border-gray-200 hover:border-purple-300 dark:border-gray-700'}`}>
                    <Clock className="h-4 w-4 mx-auto mb-1" />
                    <div className="text-sm font-medium">{d} min</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium mb-2">Available Equipment</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'bodyweight', label: 'Bodyweight' },
                  { value: 'basic', label: 'Basic Equipment' },
                  { value: 'full_gym', label: 'Full Gym' },
                ].map(equip => (
                  <button key={equip.value}
                    onClick={() => setPreferences({ ...preferences, equipment: equip.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${preferences.equipment === equip.value ? 'border-purple-600 bg-purple-100 dark:bg-purple-900' : 'border-gray-200 hover:border-purple-300 dark:border-gray-700'}`}>
                    <Dumbbell className="h-4 w-4 mx-auto mb-1" />
                    <div className="text-xs font-medium">{equip.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium mb-2">Fitness Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map(l => (
                  <button key={l}
                    onClick={() => setPreferences({ ...preferences, level: l })}
                    className={`p-2 rounded-lg border-2 text-xs font-medium capitalize transition-all ${preferences.level === l ? 'border-purple-600 bg-purple-100 dark:bg-purple-900' : 'border-gray-200 hover:border-purple-300 dark:border-gray-700'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={generateWorkout} disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4 mr-2" />Generate Workout</>}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{generatedWorkout.workout_name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{generatedWorkout.description}</p>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <Clock className="h-3 w-3 mr-1" />{generatedWorkout.total_duration} min
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {generatedWorkout.exercises.length} exercises
                </Badge>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {generatedWorkout.exercises.map((exercise, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{idx + 1}. {exercise.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{exercise.target_muscles}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">{exercise.sets} × {exercise.reps}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{exercise.form_cues}</p>
                  <div className="text-xs text-gray-500">Rest: {exercise.rest_seconds}s between sets</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={saveWorkout} className="flex-1 bg-green-600 hover:bg-green-700">
                <Target className="h-4 w-4 mr-2" />Use This Workout
              </Button>
              <Button onClick={() => setGeneratedWorkout(null)} variant="outline" className="flex-1">
                Generate New
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
