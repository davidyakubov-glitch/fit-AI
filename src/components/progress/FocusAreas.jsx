import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const ISSUE_LABELS = {
  go_lower: 'Depth Issues',
  back_too_forward: 'Forward Lean',
  back_too_straight: 'Too Upright',
  uneven_knees: 'Leg Imbalance',
  knees_caving: 'Knees Caving',
  knees_caving_in: 'Knees Caving',
  heels_lifting: 'Heels Lifting',
  stance_too_narrow: 'Narrow Stance',
  stance_too_wide: 'Wide Stance',
  knees_too_forward: 'Knees Past Toes',
  insufficient_depth: 'Depth Issues',
  excessive_forward_lean: 'Forward Lean',
  hip_shift: 'Hip Shift',
  uneven_leg_descent: 'Leg Imbalance'
};

export default function FocusAreas({ sessions }) {
  const allIssues = sessions.flatMap(s => s.common_issues || []);
  const freq = {};
  allIssues.forEach(i => { freq[i] = (freq[i] || 0) + 1; });
  const sorted = Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 5);

  if (sorted.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Areas Needing Focus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.map(([issue, count]) => {
            const pct = Math.round((count / sessions.length) * 100);
            return (
              <div key={issue}>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 text-xs">
                    {ISSUE_LABELS[issue] || issue}
                  </Badge>
                  <span className="text-xs text-gray-500">{pct}% of workouts</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}