import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Dumbbell, ChevronRight, Search } from 'lucide-react';
import { exerciseDatabase, LOCATIONS, allMuscleGroups } from './exerciseDatabase';
import { translateUiText } from '../AutoTranslator';
import { localizeExercise, translateExerciseValue, RU_LABELS } from './exerciseTranslations';

const DIFF_COLORS = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
};

const LOC_ICONS = { home: Home, gym: Dumbbell, both: Dumbbell };

export default function ExercisePicker({ onSelect, selectedId }) {
  const { i18n } = useTranslation();
  const [locationFilter, setLocationFilter] = useState('all');
  const [muscleFilter, setMuscleFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [search, setSearch] = useState('');

  const language = i18n.resolvedLanguage || i18n.language;
  const normalizedSearch = search.trim().toLowerCase();
  const isRussian = String(language).startsWith('ru');

  const exercises = Object.values(exerciseDatabase).filter((ex) => {
    if (locationFilter !== 'all' && ex.location !== locationFilter && ex.location !== LOCATIONS.BOTH) return false;
    if (muscleFilter !== 'all' && ex.muscleGroup !== muscleFilter) return false;
    if (diffFilter !== 'all' && ex.difficulty !== diffFilter) return false;

    if (normalizedSearch) {
      const localized = localizeExercise(ex, language);
      const searchableText = [
        ex.name,
        ex.description,
        ex.muscleGroup,
        ex.difficulty,
        ex.location,
        ...(ex.equipment || []),
        translateUiText(ex.name, language),
        translateUiText(ex.description, language),
        translateUiText(ex.muscleGroup, language),
        translateUiText(ex.difficulty, language),
        translateUiText(ex.location, language),
        ...(ex.equipment || []).map((item) => translateUiText(item, language)),
        localized.name,
        localized.description,
        localized.muscleGroup,
        localized.difficulty,
        localized.location,
        ...(localized.equipment || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(normalizedSearch)) return false;
    }

    return true;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-purple-600" />
          {translateExerciseValue('Choose Exercise', language)}
        </CardTitle>

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={translateExerciseValue('Search exercises...', language)}
            className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div className="space-y-2 mt-3">
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'home', 'gym'].map((loc) => (
              <button
                key={loc}
                onClick={() => setLocationFilter(loc)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                  locationFilter === loc
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100'
                }`}
              >
                {loc === 'all' ? translateExerciseValue('All Locations', language) : translateExerciseValue(loc, language)}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setMuscleFilter('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                muscleFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100'
              }`}
            >
              {translateExerciseValue('All Muscles', language)}
            </button>
            {allMuscleGroups.map((mg) => (
              <button
                key={mg}
                onClick={() => setMuscleFilter(mg)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  muscleFilter === mg
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100'
                }`}
              >
                {translateExerciseValue(mg, language)}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {['all', 'beginner', 'intermediate', 'advanced'].map((d) => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                  diffFilter === d
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-teal-100'
                }`}
              >
                {d === 'all' ? translateExerciseValue('All Levels', language) : translateExerciseValue(d, language)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-xs text-gray-400 mb-2">
          {exercises.length} {isRussian ? RU_LABELS.exercises : 'exercises'}
        </p>
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {exercises.map((ex) => {
            const displayExercise = localizeExercise(ex, language);
            const LocIcon = LOC_ICONS[ex.location] || Dumbbell;
            const isSelected = selectedId === ex.id;

            return (
              <button
                key={ex.id}
                onClick={() => onSelect(ex)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <LocIcon className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className="min-w-0">
                    <div className={`text-sm font-medium truncate ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-800 dark:text-gray-200'}`}>
                      {displayExercise.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {displayExercise.muscleGroup} · {displayExercise.equipment.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <Badge className={`text-[10px] px-1.5 py-0 border ${DIFF_COLORS[ex.difficulty]}`}>
                    {displayExercise.difficulty}
                  </Badge>
                  <ChevronRight className={`h-4 w-4 ${isSelected ? 'text-purple-600' : 'text-gray-300'}`} />
                </div>
              </button>
            );
          })}
          {exercises.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-400">
              {translateExerciseValue('No exercises match your filters', language)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
