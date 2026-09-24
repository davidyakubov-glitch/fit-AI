import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Clock, Dumbbell, Play, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const GOALS = [
  { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
  { value: 'weight_loss', label: 'Weight Loss', icon: '🔥' },
  { value: 'strength', label: 'Strength', icon: '🏋️' },
  { value: 'endurance', label: 'Endurance', icon: '🏃' },
  { value: 'general', label: 'General Fitness', icon: '⭐' }
];
const DURATIONS = ['20', '30', '45', '60'];
const EQUIPMENT_OPTIONS = [
  { value: 'none', label: 'No Equipment' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'full_gym', label: 'Full Gym' }
];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

// Exercise pool by equipment and goal
const EXERCISE_POOL = {
  none: {
    muscle_gain: ['push_up', 'squat', 'lunge', 'glute_bridge', 'sit_up', 'plank', 'single_leg_squat'],
    weight_loss:  ['jump_squat', 'burpee', 'mountain_climber', 'push_up', 'lunge', 'sit_up', 'plank'],
    strength:     ['single_leg_squat', 'push_up', 'pull_up', 'squat', 'lunge', 'glute_bridge'],
    endurance:    ['mountain_climber', 'burpee', 'jump_squat', 'push_up', 'sit_up', 'plank', 'lunge'],
    general:      ['squat', 'push_up', 'plank', 'lunge', 'glute_bridge', 'sit_up', 'mountain_climber'],
  },
  dumbbells: {
    muscle_gain: ['bicep_curl', 'shoulder_press', 'tricep_extension', 'squat', 'lunge', 'push_up', 'glute_bridge'],
    weight_loss:  ['jump_squat', 'bicep_curl', 'shoulder_press', 'burpee', 'lunge', 'mountain_climber', 'push_up'],
    strength:     ['squat', 'shoulder_press', 'bicep_curl', 'tricep_extension', 'lunge', 'push_up', 'glute_bridge'],
    endurance:    ['mountain_climber', 'jump_squat', 'bicep_curl', 'shoulder_press', 'burpee', 'sit_up', 'lunge'],
    general:      ['squat', 'push_up', 'bicep_curl', 'shoulder_press', 'lunge', 'plank', 'glute_bridge'],
  },
  full_gym: {
    muscle_gain: ['bench_press', 'barbell_row', 'barbell_squat', 'shoulder_press', 'bicep_curl', 'tricep_extension', 'lat_pulldown'],
    weight_loss:  ['barbell_squat', 'deadlift', 'bench_press', 'barbell_row', 'jump_squat', 'mountain_climber', 'burpee'],
    strength:     ['barbell_squat', 'deadlift', 'bench_press', 'barbell_row', 'shoulder_press', 'pull_up', 'leg_press'],
    endurance:    ['leg_press', 'lat_pulldown', 'bench_press', 'barbell_row', 'leg_curl', 'leg_extension', 'mountain_climber'],
    general:      ['barbell_squat', 'bench_press', 'barbell_row', 'shoulder_press', 'leg_press', 'bicep_curl', 'plank'],
  },
};

const EXERCISE_NAMES = {
  squat: 'Bodyweight Squat',
  push_up: 'Push-Up',
  plank: 'Plank',
  lunge: 'Forward Lunge',
  glute_bridge: 'Glute Bridge',
  sit_up: 'Sit-Up',
  mountain_climber: 'Mountain Climbers',
  jump_squat: 'Jump Squat',
  burpee: 'Burpee',
  single_leg_squat: 'Single-Leg Squat',
  pull_up: 'Pull-Up',
  bicep_curl: 'Bicep Curl',
  shoulder_press: 'Shoulder Press',
  tricep_extension: 'Tricep Extension',
  barbell_squat: 'Barbell Back Squat',
  deadlift: 'Deadlift',
  bench_press: 'Bench Press',
  barbell_row: 'Barbell Row',
  lat_pulldown: 'Lat Pulldown',
  leg_press: 'Leg Press',
  leg_curl: 'Leg Curl',
  leg_extension: 'Leg Extension',
};

const EXERCISE_NOTES = {
  squat: 'Keep chest up, knees tracking over toes',
  push_up: 'Maintain a straight body line',
  plank: 'Keep hips level, breathe steadily',
  lunge: 'Alternate legs, front knee over ankle',
  glute_bridge: 'Squeeze glutes at the top',
  sit_up: "Don't pull on your neck",
  mountain_climber: 'Hips stay low, steady pace',
  jump_squat: 'Land softly, absorb with knees',
  burpee: 'Scale by stepping if needed',
  single_leg_squat: 'Controlled descent, use support if needed',
  pull_up: 'Full dead hang each rep',
  bicep_curl: 'No swinging, control the descent',
  shoulder_press: 'Brace core, full lockout at top',
  tricep_extension: 'Upper arms stay still',
  barbell_squat: 'At or below parallel, neutral spine',
  deadlift: 'Neutral spine throughout, drive hips forward',
  bench_press: 'Control the descent, arch naturally',
  barbell_row: 'Squeeze shoulder blades at the top',
  lat_pulldown: 'Pull to upper chest, full extension',
  leg_press: "Full range, don't lock out knees",
  leg_curl: 'Slow eccentric phase',
  leg_extension: 'Squeeze quad at the top',
};

const TIMED_EXERCISES = new Set(['plank', 'mountain_climber', 'wall_sit']);
const CARDIO_EXERCISES = new Set(['jump_squat', 'burpee', 'mountain_climber']);
const STRENGTH_EXERCISES = new Set(['barbell_squat', 'deadlift', 'bench_press', 'barbell_row', 'pull_up', 'shoulder_press', 'single_leg_squat']);

const LEVEL_PARAMS = {
  beginner:     { sets: 2, defaultReps: '12', cardioReps: '8',  timedReps: '20s', defaultRest: 75, cardioRest: 45, strengthRest: 90 },
  intermediate: { sets: 3, defaultReps: '10', cardioReps: '12', timedReps: '30s', defaultRest: 60, cardioRest: 30, strengthRest: 75 },
  advanced:     { sets: 4, defaultReps: '8',  cardioReps: '15', timedReps: '45s', defaultRest: 90, cardioRest: 30, strengthRest: 120 },
};

const DURATION_TO_COUNT = { '20': 3, '30': 4, '45': 5, '60': 6 };

const PLAN_NAMES = {
  muscle_gain: { beginner: 'Beginner Gains', intermediate: 'Hypertrophy Session', advanced: 'Advanced Mass Build' },
  weight_loss:  { beginner: 'Cardio Starter', intermediate: 'HIIT Blast', advanced: 'Metabolic Shred' },
  strength:     { beginner: 'Beginner Strength', intermediate: 'Power Session', advanced: 'Max Strength' },
  endurance:    { beginner: 'Beginner Cardio', intermediate: 'Stamina Builder', advanced: 'Elite Endurance' },
  general:      { beginner: 'Beginner Full Body', intermediate: 'General Fitness', advanced: 'Advanced Full Body' },
};

const PLAN_DESCRIPTIONS = {
  muscle_gain: 'Focused on muscle growth with compound and isolation movements.',
  weight_loss:  'High-intensity workout designed to maximize calorie burn and fat loss.',
  strength:     'Heavy compound movements to build raw strength and power.',
  endurance:    'Cardiovascular and muscular endurance with minimal rest.',
  general:      'Balanced workout covering all major muscle groups for overall fitness.',
};

function generatePlan(prefs) {
  const { goal, duration, equipment, level } = prefs;
  const pool = EXERCISE_POOL[equipment]?.[goal] || EXERCISE_POOL.none.general;
  const count = DURATION_TO_COUNT[duration] || 4;
  const params = LEVEL_PARAMS[level];

  const exercises = pool.slice(0, count).map((id) => {
    const isCardio = CARDIO_EXERCISES.has(id);
    const isTimed = TIMED_EXERCISES.has(id);
    const isStrength = STRENGTH_EXERCISES.has(id);

    const reps = isTimed
      ? params.timedReps
      : isCardio
      ? params.cardioReps
      : params.defaultReps;

    const rest = isStrength
      ? params.strengthRest
      : isCardio
      ? params.cardioRest
      : params.defaultRest;

    return {
      exercise_id: id,
      exercise_name: EXERCISE_NAMES[id] || id,
      sets: params.sets,
      reps,
      rest_seconds: rest,
      notes: EXERCISE_NOTES[id] || '',
    };
  });

  return {
    name: PLAN_NAMES[goal]?.[level] || 'Custom Workout',
    description: PLAN_DESCRIPTIONS[goal] || '',
    estimated_duration_minutes: Number(duration),
    exercises,
    goal,
    difficulty: level,
    source: 'ai_generated',
  };
}

export default function AIPlanGenerator({ onPlanGenerated }) {
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [prefs, setPrefs] = useState({ goal: 'general', duration: '30', equipment: 'none', level: 'beginner' });

  const set = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  const generate = async () => {
    setLoading(true);
    // Small delay for UX — feels like something is happening
    await new Promise(r => setTimeout(r, 600));
    try {
      const plan = generatePlan(prefs);
      setGeneratedPlan(plan);
      toast.success('Plan generated!');
    } catch {
      toast.error('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (generatedPlan) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">{generatedPlan.name}</CardTitle>
              </div>
              <p className="text-sm text-gray-600">{generatedPlan.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{generatedPlan.estimated_duration_minutes} min</Badge>
                <Badge variant="outline"><Dumbbell className="h-3 w-3 mr-1" />{generatedPlan.exercises?.length} exercises</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {generatedPlan.exercises?.map((ex, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <span className="font-medium text-sm">{i + 1}. {ex.exercise_name}</span>
                {ex.notes && <p className="text-xs text-gray-500 mt-0.5">{ex.notes}</p>}
              </div>
              <div className="text-right text-sm ml-4">
                <div className="font-semibold">{ex.sets} × {ex.reps}</div>
                <div className="text-xs text-gray-500">{ex.rest_seconds}s rest</div>
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button onClick={() => onPlanGenerated(generatedPlan)} className="flex-1 bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" /> Use This Plan
            </Button>
            <Button onClick={() => setGeneratedPlan(null)} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" /> AI Plan Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Goal */}
        <div>
          <p className="text-sm font-medium mb-2">Goal</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {GOALS.map(g => (
              <button key={g.value} onClick={() => set('goal', g.value)}
                className={`p-2 rounded-lg border-2 text-center transition-all ${prefs.goal === g.value ? 'border-purple-600 bg-purple-100' : 'border-gray-200 hover:border-purple-300'}`}>
                <div className="text-xl">{g.icon}</div>
                <div className="text-xs font-medium mt-1">{g.label}</div>
              </button>
            ))}
          </div>
        </div>
        {/* Duration */}
        <div>
          <p className="text-sm font-medium mb-2">Duration</p>
          <div className="flex gap-2">
            {DURATIONS.map(d => (
              <button key={d} onClick={() => set('duration', d)}
                className={`flex-1 p-2 rounded-lg border-2 text-sm font-medium transition-all ${prefs.duration === d ? 'border-purple-600 bg-purple-100' : 'border-gray-200 hover:border-purple-300'}`}>
                {d} min
              </button>
            ))}
          </div>
        </div>
        {/* Equipment */}
        <div>
          <p className="text-sm font-medium mb-2">Equipment</p>
          <div className="flex gap-2">
            {EQUIPMENT_OPTIONS.map(e => (
              <button key={e.value} onClick={() => set('equipment', e.value)}
                className={`flex-1 p-2 rounded-lg border-2 text-xs font-medium transition-all ${prefs.equipment === e.value ? 'border-purple-600 bg-purple-100' : 'border-gray-200 hover:border-purple-300'}`}>
                {e.label}
              </button>
            ))}
          </div>
        </div>
        {/* Level */}
        <div>
          <p className="text-sm font-medium mb-2">Fitness Level</p>
          <div className="flex gap-2">
            {LEVELS.map(l => (
              <button key={l} onClick={() => set('level', l)}
                className={`flex-1 p-2 rounded-lg border-2 text-xs font-medium capitalize transition-all ${prefs.level === l ? 'border-purple-600 bg-purple-100' : 'border-gray-200 hover:border-purple-300'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={generate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4 mr-2" />Generate Plan</>}
        </Button>
      </CardContent>
    </Card>
  );
}
