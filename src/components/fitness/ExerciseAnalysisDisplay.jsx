/**
 * Real-time analysis display panel — works for all exercises.
 * Shows: reps or hold time, live message, form issues, joint metrics.
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, Repeat } from 'lucide-react';

const SEVERITY_COLORS = {
  high:   'bg-red-50   border-red-200   text-red-800',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  low:    'bg-blue-50  border-blue-200  text-blue-800',
};

function formatHold(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ExerciseAnalysisDisplay({ repCount, holdSeconds, analysisResult, sessionData, isTimedHold }) {
  if (!analysisResult) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">Get into position and start moving</p>
      </div>
    );
  }

  const { message, issues, issueDetails, metrics } = analysisResult;
  const hasIssues = issues && issues.length > 0;

  return (
    <div className="space-y-4">
      {/* Rep count or hold time */}
      <div className="flex items-center justify-center gap-6">
        {isTimedHold ? (
          <div className="text-center">
            <div className="flex items-center gap-1.5 text-purple-600 justify-center">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Hold</span>
            </div>
            <p className="text-5xl font-bold text-gray-900 tabular-nums">{formatHold(holdSeconds)}</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="flex items-center gap-1.5 text-purple-600 justify-center">
                <Repeat className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Reps</span>
              </div>
              <p className="text-5xl font-bold text-gray-900 tabular-nums">{repCount}</p>
            </div>
            {sessionData?.goodReps !== undefined && (
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-green-600 justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Good</span>
                </div>
                <p className="text-3xl font-bold text-green-600 tabular-nums">{sessionData.goodReps}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Live coaching message */}
      <div className={`rounded-xl px-4 py-3 text-center font-semibold text-sm border ${
        hasIssues
          ? 'bg-orange-50 border-orange-200 text-orange-800'
          : 'bg-green-50 border-green-200 text-green-800'
      }`}>
        {hasIssues ? <AlertTriangle className="h-4 w-4 inline mr-1.5" /> : <CheckCircle2 className="h-4 w-4 inline mr-1.5" />}
        {message}
      </div>

      {/* Form issues */}
      {hasIssues && (
        <div className="space-y-2">
          {issues.slice(0, 3).map((issue) => {
            const detail = issueDetails?.[issue];
            if (!detail) return null;
            return (
              <div key={issue} className={`rounded-lg px-3 py-2 border text-xs flex items-start gap-2 ${SEVERITY_COLORS[detail.severity] || SEVERITY_COLORS.low}`}>
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{detail.message}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Joint metrics */}
      {metrics && Object.keys(metrics).length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(metrics).map(([key, value]) => {
            if (typeof value !== 'number') return null;
            const label = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
            const unit  = key.toLowerCase().includes('angle') ? '°' : '';
            return (
              <div key={key} className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                <p className="text-xs text-gray-500 truncate">{label}</p>
                <p className="text-lg font-bold text-gray-900">{value}{unit}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}