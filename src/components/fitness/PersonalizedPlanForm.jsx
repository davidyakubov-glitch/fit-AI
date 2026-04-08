import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PersonalizedPlanForm({ onGenerate, isGenerating }) {
  const [preferences, setPreferences] = useState({
    fitness_level: 'beginner',
    primary_goal: 'strength',
    sessions_per_week: 3,
    session_duration: 30
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(preferences);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Create Your Personalized Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fitness Level */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Your Current Fitness Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPreferences({...preferences, fitness_level: level})}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all capitalize",
                    preferences.fitness_level === level
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Goal */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Primary Training Goal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'strength', label: 'Build Strength', icon: '💪' },
                { value: 'endurance', label: 'Improve Endurance', icon: '🏃' },
                { value: 'flexibility', label: 'Increase Flexibility', icon: '🧘' },
                { value: 'weight_loss', label: 'Lose Weight', icon: '🔥' }
              ].map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setPreferences({...preferences, primary_goal: goal.value})}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-left",
                    preferences.primary_goal === goal.value
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                  )}
                >
                  <div className="text-lg mb-1">{goal.icon}</div>
                  <div className="text-sm font-medium">{goal.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sessions Per Week */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Sessions Per Week
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPreferences({...preferences, sessions_per_week: num})}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all font-semibold",
                    preferences.sessions_per_week === num
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Session Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Session Duration (minutes)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[20, 30, 45, 60].map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setPreferences({...preferences, session_duration: duration})}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all font-semibold",
                    preferences.session_duration === duration
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                  )}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Your Plan Summary:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-purple-100 text-purple-800">
                {preferences.fitness_level} level
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                {preferences.primary_goal.replace('_', ' ')}
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                {preferences.sessions_per_week}x/week
              </Badge>
              <Badge className="bg-orange-100 text-orange-800">
                {preferences.session_duration} min
              </Badge>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Generating Your Plan...
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5 mr-2" />
                Generate Personalized Plan
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}