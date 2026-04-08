import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const issueCategories = {
  knees_caving_in: {
    category: 'Critical',
    title: 'Knees Caving In',
    description: 'Your knees are collapsing inward during the squat',
    causes: ['Weak glutes', 'Tight hip adductors', 'Stance too narrow'],
    fixes: [
      'Push knees out actively during descent',
      'Widen your stance to shoulder-width or slightly wider',
      'Use a resistance band around knees for awareness',
      'Strengthen glutes with clamshells and hip thrusts'
    ],
    priority: 1
  },
  heels_lifting: {
    category: 'Critical',
    title: 'Heels Lifting',
    description: 'Your heels are coming off the ground',
    causes: ['Limited ankle mobility', 'Weight too far forward', 'Tight calves'],
    fixes: [
      'Keep weight on your heels throughout the movement',
      'Improve ankle mobility with calf stretches',
      'Try elevating heels slightly with plates (temporary)',
      'Focus on sitting back rather than down'
    ],
    priority: 1
  },
  insufficient_depth: {
    category: 'Form',
    title: 'Insufficient Depth',
    description: 'Not reaching proper squat depth',
    causes: ['Limited mobility', 'Lack of confidence', 'Weak legs'],
    fixes: [
      'Work on hip and ankle flexibility',
      'Use box squats to build confidence',
      'Practice deep squat holds',
      'Gradually increase depth over time'
    ],
    priority: 2
  },
  excessive_forward_lean: {
    category: 'Posture',
    title: 'Excessive Forward Lean',
    description: 'Torso leaning too far forward',
    causes: ['Weak core', 'Poor hip mobility', 'Incorrect form'],
    fixes: [
      'Keep chest up and look forward',
      'Engage your core throughout the movement',
      'Strengthen lower back and core',
      'Focus on sitting back rather than folding forward'
    ],
    priority: 2
  },
  knees_too_forward: {
    category: 'Form',
    title: 'Knees Too Far Forward',
    description: 'Knees tracking excessively past toes',
    causes: ['Shifting weight forward', 'Poor squat pattern'],
    fixes: [
      'Sit back more into the squat',
      'Keep weight centered on mid-foot',
      'Engage glutes and hamstrings',
      'Practice wall squats for proper pattern'
    ],
    priority: 2
  },
  stance_too_narrow: {
    category: 'Setup',
    title: 'Narrow Stance',
    description: 'Feet too close together',
    causes: ['Improper setup', 'Lack of awareness'],
    fixes: [
      'Set feet shoulder-width apart or slightly wider',
      'Toes pointed slightly outward (10-15 degrees)',
      'This provides better stability and depth'
    ],
    priority: 2
  },
  hip_shift: {
    category: 'Balance',
    title: 'Hip Shift',
    description: 'Hips shifting to one side',
    causes: ['Muscle imbalance', 'Previous injury', 'Weak side compensation'],
    fixes: [
      'Focus on keeping hips level',
      'Add single-leg exercises to correct imbalances',
      'Reduce weight and focus on symmetry',
      'Consider consulting a professional if persistent'
    ],
    priority: 2
  },
  uneven_leg_descent: {
    category: 'Balance',
    title: 'Uneven Descent',
    description: 'One leg bending more than the other',
    causes: ['Muscle imbalance', 'Poor coordination'],
    fixes: [
      'Slow down and focus on symmetry',
      'Use a mirror to check form',
      'Practice single-leg exercises',
      'Ensure equal weight distribution'
    ],
    priority: 2
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-orange-600';
    case 'low': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
};

const getSeverityBg = (severity) => {
  switch (severity) {
    case 'high': return 'bg-red-50 border-red-200';
    case 'medium': return 'bg-orange-50 border-orange-200';
    case 'low': return 'bg-yellow-50 border-yellow-200';
    default: return 'bg-gray-50 border-gray-200';
  }
};

export default function FormIssuesPanel({ currentIssues = [], issueDetails = {}, isActive }) {
  // Sort issues by priority
  const sortedIssues = currentIssues
    .filter(issue => issueCategories[issue])
    .sort((a, b) => {
      const priorityA = issueCategories[a]?.priority || 999;
      const priorityB = issueCategories[b]?.priority || 999;
      return priorityA - priorityB;
    });

  if (!isActive) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="pt-6 text-center text-gray-500">
          <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Start workout to see form analysis</p>
        </CardContent>
      </Card>
    );
  }

  if (sortedIssues.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-green-900 mb-1">Excellent Form!</h3>
          <p className="text-sm text-green-700">No issues detected. Keep it up!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Form Issues Detected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedIssues.map((issueKey) => {
          const issue = issueCategories[issueKey];
          const details = issueDetails[issueKey] || {};
          const severity = details.severity || 'medium';
          
          return (
            <div
              key={issueKey}
              className={cn(
                "border rounded-lg p-3 space-y-2",
                getSeverityBg(severity)
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn("font-semibold", getSeverityColor(severity))}>
                      {issue.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getSeverityColor(severity))}
                    >
                      {severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-700">{issue.description}</p>
                </div>
              </div>

              {/* Quick Fixes */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-700">Quick Fixes:</div>
                <ul className="space-y-1">
                  {issue.fixes.slice(0, 2).map((fix, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Causes (collapsible hint) */}
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                  Why this happens...
                </summary>
                <ul className="mt-1 space-y-0.5 ml-4">
                  {issue.causes.map((cause, idx) => (
                    <li key={idx} className="text-gray-600">• {cause}</li>
                  ))}
                </ul>
              </details>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}