import React, { useState } from 'react';
import { exerciseDatabase, DIFFICULTY, MUSCLE_GROUPS } from '../components/fitness/exerciseDatabase';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Dumbbell, ChevronRight, Filter } from 'lucide-react';
import ExerciseDetailModal from '../components/fitness/ExerciseDetailModal';
import { cn } from '@/lib/utils';

const DIFF_COLORS = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
};

const MUSCLE_ICONS = {
  Legs: '🦵',
  Glutes: '🍑',
  Chest: '💪',
  Back: '🔙',
  Shoulders: '🏋️',
  Arms: '💪',
  Core: '🎯',
  'Full Body': '⚡',
};

export default function ExerciseCatalog() {
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [locFilter, setLocFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const allExercises = Object.values(exerciseDatabase);

  const muscles = ['All', ...Object.values(MUSCLE_GROUPS)];
  const diffs = ['All', ...Object.values(DIFFICULTY)];
  const locations = ['All', 'home', 'gym', 'both'];

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = allExercises.filter((ex) => {
    const name = ex.name?.toLowerCase() || '';
    const description = ex.description?.toLowerCase() || '';

    if (
      normalizedSearch &&
      !name.includes(normalizedSearch) &&
      !description.includes(normalizedSearch)
    ) {
      return false;
    }

    if (muscleFilter !== 'All' && ex.muscleGroup !== muscleFilter) {
      return false;
    }

    if (diffFilter !== 'All' && ex.difficulty !== diffFilter) {
      return false;
    }

    if (locFilter !== 'All' && ex.location !== locFilter && ex.location !== 'both') {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900">Exercise Catalog</h1>
            <Badge variant="secondary" className="ml-auto">
              {filtered.length} exercises
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search exercises..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        {/* Filters */}
        <div className="space-y-2">
          {/* Difficulty + Location */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {diffs.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDiffFilter(d)}
                className={cn(
                  'flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all',
                  diffFilter === d
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                )}
              >
                {d === 'All' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}

            <span className="mx-1 text-gray-300 self-center">|</span>

            {locations.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocFilter(l)}
                className={cn(
                  'flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all',
                  locFilter === l
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                )}
              >
                {l === 'All' ? 'All Places' : l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>

          {/* Muscle groups */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {muscles.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMuscleFilter(m)}
                className={cn(
                  'flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all',
                  muscleFilter === m
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                )}
              >
                {m !== 'All' && MUSCLE_ICONS[m] ? `${MUSCLE_ICONS[m]} ` : ''}
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Filter className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No exercises match your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelected(ex)}
                className="bg-white rounded-xl border hover:border-purple-300 hover:shadow-md transition-all text-left p-4 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-gray-900 text-sm">{ex.name}</span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {ex.description || 'No description available.'}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      <Badge className={cn('text-[10px] border', DIFF_COLORS[ex.difficulty])}>
                        {ex.difficulty}
                      </Badge>

                      <Badge variant="outline" className="text-[10px]">
                        {MUSCLE_ICONS[ex.muscleGroup] || '🏋️'} {ex.muscleGroup}
                      </Badge>

                      <Badge variant="outline" className="text-[10px] capitalize">
                        {ex.location}
                      </Badge>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500 flex-shrink-0 mt-1 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ExerciseDetailModal
          exercise={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}