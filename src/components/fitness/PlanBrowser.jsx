import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Dumbbell, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { PLAN_TEMPLATES } from './planTemplates';
import ExerciseVideo from './ExerciseVideo';

const GOAL_LABELS = {
  muscle_gain: 'Muscle Gain',
  weight_loss: 'Weight Loss',
  endurance: 'Endurance',
  strength: 'Strength',
  general: 'General Fitness'
};

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

const GOAL_COLORS = {
  muscle_gain: 'bg-blue-100 text-blue-800',
  weight_loss: 'bg-orange-100 text-orange-800',
  endurance: 'bg-cyan-100 text-cyan-800',
  strength: 'bg-purple-100 text-purple-800',
  general: 'bg-gray-100 text-gray-800'
};

export default function PlanBrowser({ onSelectPlan, activePlanId }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filterGoal, setFilterGoal] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const filtered = PLAN_TEMPLATES.filter(p => {
    if (filterGoal !== 'all' && p.goal !== filterGoal) return false;
    if (filterDifficulty !== 'all' && p.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 flex-wrap">
          {['all', 'muscle_gain', 'weight_loss', 'endurance', 'strength', 'general'].map(g => (
            <button
              key={g}
              onClick={() => setFilterGoal(g)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filterGoal === g ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 text-gray-600 hover:border-purple-400'
              }`}
            >
              {g === 'all' ? 'All Goals' : GOAL_LABELS[g]}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {['all', 'beginner', 'intermediate', 'advanced'].map(d => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filterDifficulty === d ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-600 hover:border-gray-500'
              }`}
            >
              {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4">
        {filtered.map(plan => {
          const isExpanded = expandedId === plan.id;
          const isActive = activePlanId === plan.id;
          return (
            <Card key={plan.id} className={`transition-all ${isActive ? 'border-2 border-purple-500 shadow-md' : 'hover:shadow-sm'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      {isActive && <Badge className="bg-purple-600 text-white text-xs">Active</Badge>}
                    </div>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge className={DIFFICULTY_COLORS[plan.difficulty]}>{plan.difficulty}</Badge>
                      <Badge className={GOAL_COLORS[plan.goal]}>{GOAL_LABELS[plan.goal]}</Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {plan.estimated_duration_minutes} min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Dumbbell className="h-3 w-3 mr-1" />
                        {plan.exercises.length} exercises
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => onSelectPlan(plan)}
                      className={isActive ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {isActive ? 'Start' : 'Select'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedId(isExpanded ? null : plan.id)}
                      className="text-xs"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 border-t">
                  <div className="space-y-2 mt-3">
                    {plan.exercises.map((ex, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
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
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}