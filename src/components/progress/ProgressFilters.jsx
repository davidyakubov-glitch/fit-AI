import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter } from 'lucide-react';

const DATE_RANGES = [
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
  { label: 'All Time', value: 0 }
];

const EXERCISE_TYPES = ['All', 'squat', 'lunge', 'plank'];

export default function ProgressFilters({ dateRange, setDateRange, exerciseFilter, setExerciseFilter }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Date Range */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              Date Range
            </div>
            <div className="flex gap-2 flex-wrap">
              {DATE_RANGES.map(r => (
                <button
                  key={r.value}
                  onClick={() => setDateRange(r.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    dateRange === r.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Filter */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <Filter className="h-4 w-4" />
              Exercise Type
            </div>
            <div className="flex gap-2 flex-wrap">
              {EXERCISE_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setExerciseFilter(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                    exerciseFilter === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}