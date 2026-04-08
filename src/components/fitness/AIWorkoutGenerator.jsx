import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Dumbbell, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function AIWorkoutGenerator({ onWorkoutGenerated }) {
  const [loading, setLoading] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [preferences, setPreferences] = useState({
    goal: 'muscle_gain',
    duration: '30',
    equipment: 'bodyweight'
  });

  const generateWorkout = async () => {
    setLoading(true);
    try {
      const prompt = `Generate a personalized workout plan with the following specifications:
      
Goal: ${preferences.goal === 'muscle_gain' ? 'Muscle gain and strength building' : preferences.goal === 'weight_loss' ? 'Weight loss and fat burning' : preferences.goal === 'endurance' ? 'Endurance and stamina improvement' : 'General fitness'}
Duration: ${preferences.duration} minutes
Equipment: ${preferences.equipment === 'bodyweight' ? 'Bodyweight only (no equipment)' : preferences.equipment === 'basic' ? 'Basic equipment (dumbbells, resistance bands)' : 'Full gym equipment'}

Please provide:
1. A workout name
2. Brief description
3. 5-8 exercises with:
   - Exercise name
   - Target muscles
   - Sets
   - Reps (or duration for time-based exercises)
   - Rest time between sets (in seconds)
   - Form cues/tips

Make it practical, effective, and achievable within the time limit. Focus on exercises that match the available equipment.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            workout_name: { type: 'string' },
            description: { type: 'string' },
            total_duration: { type: 'number' },
            exercises: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  target_muscles: { type: 'string' },
                  sets: { type: 'number' },
                  reps: { type: 'string' },
                  rest_seconds: { type: 'number' },
                  form_cues: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setGeneratedWorkout({
        ...result,
        preferences
      });
      toast.success('Workout plan generated!');
    } catch (error) {
      console.error('Error generating workout:', error);
      toast.error('Failed to generate workout');
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
            {/* Goal Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Fitness Goal</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
                  { value: 'weight_loss', label: 'Weight Loss', icon: '🔥' },
                  { value: 'endurance', label: 'Endurance', icon: '🏃' },
                  { value: 'general', label: 'General Fitness', icon: '⭐' }
                ].map(goal => (
                  <button
                    key={goal.value}
                    onClick={() => setPreferences({ ...preferences, goal: goal.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.goal === goal.value
                        ? 'border-purple-600 bg-purple-100 dark:bg-purple-900'
                        : 'border-gray-200 hover:border-purple-300 dark:border-gray-700'
                    }`}
                  >
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
                {['15', '30', '45', '60'].map(duration => (
                  <button
                    key={duration}
                    onClick={() => setPreferences({ ...preferences, duration })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.duration === duration
                        ? 'border-purple-600 bg-purple-100 dark:bg-purple-900'
                        : 'border-gray-200 hover:border-purple-300 dark:border-gray-700'
                    }`}
                  >
                    <Clock className="h-4 w-4 mx-auto mb-1" />
                    <div className="text-sm font-medium">{duration}min</div>
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
                  { value: 'full_gym', label: 'Full Gym' }
                ].map(equip => (
                  <button
                    key={equip.value}
                    onClick={() => setPreferences({ ...preferences, equipment: equip.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.equipment === equip.value
                        ? 'border-purple-600 bg-purple-100 dark:bg-purple-900'
                        : 'border-gray-200 hover:border-purple-300 dark:border-gray-700'
                    }`}
                  >
                    <Dumbbell className="h-4 w-4 mx-auto mb-1" />
                    <div className="text-xs font-medium">{equip.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={generateWorkout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Workout
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            {/* Generated Workout Display */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {generatedWorkout.workout_name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {generatedWorkout.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <Clock className="h-3 w-3 mr-1" />
                  {generatedWorkout.total_duration || preferences.duration} min
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {generatedWorkout.exercises.length} exercises
                </Badge>
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {generatedWorkout.exercises.map((exercise, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {idx + 1}. {exercise.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {exercise.target_muscles}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {exercise.sets} × {exercise.reps}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {exercise.form_cues}
                  </p>
                  <div className="text-xs text-gray-500">
                    Rest: {exercise.rest_seconds}s between sets
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={saveWorkout}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Target className="h-4 w-4 mr-2" />
                Use This Workout
              </Button>
              <Button
                onClick={() => setGeneratedWorkout(null)}
                variant="outline"
                className="flex-1"
              >
                Generate New
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}