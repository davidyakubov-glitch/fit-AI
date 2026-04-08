import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
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

export default function AIPlanGenerator({ onPlanGenerated }) {
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [prefs, setPrefs] = useState({ goal: 'general', duration: '30', equipment: 'none', level: 'beginner' });

  const set = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  const generate = async () => {
    setLoading(true);
    try {
      const equipmentDesc = prefs.equipment === 'none'
        ? 'bodyweight only, no equipment'
        : prefs.equipment === 'dumbbells'
        ? 'dumbbells and bodyweight'
        : 'full gym including barbells, cables, machines';

      const prompt = `Create a structured ${prefs.duration}-minute ${prefs.level} workout plan for ${prefs.goal.replace('_', ' ')}.
Equipment available: ${equipmentDesc}.

Return 5-7 exercises with specific sets, reps, and rest times. Use real exercise names.
For the exercise_id field, use one of these exact IDs if it matches: squat, lunge, push_up, plank, sit_up, glute_bridge, mountain_climber, burpee, jump_squat, single_leg_squat, barbell_squat, deadlift, bench_press, shoulder_press, lat_pulldown, pull_up, barbell_row, leg_press, leg_curl, leg_extension, bicep_curl, tricep_extension.
If no exact match, use the closest one or null.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            estimated_duration_minutes: { type: 'number' },
            exercises: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  exercise_id: { type: 'string' },
                  exercise_name: { type: 'string' },
                  sets: { type: 'number' },
                  reps: { type: 'string' },
                  rest_seconds: { type: 'number' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setGeneratedPlan({
        ...result,
        goal: prefs.goal,
        difficulty: prefs.level,
        source: 'ai_generated'
      });
      toast.success('AI plan generated!');
    } catch (e) {
      toast.error('Failed to generate plan');
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