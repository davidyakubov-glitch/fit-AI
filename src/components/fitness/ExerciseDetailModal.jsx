import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, PlayCircle, AlertTriangle, CheckCircle2, Camera, Info, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EXERCISE_VIDEO_URLS } from './exerciseVideoCatalog';
import { localizeExercise, translateExerciseValue } from './exerciseTranslations';

const DIFF_COLORS = {
  beginner:     'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced:     'bg-red-100 text-red-800',
};

const TABS = ['Overview', 'Steps', 'Mistakes', 'Tips'];

export default function ExerciseDetailModal({ exercise, onClose }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const localizedExercise = localizeExercise(exercise, language);
  const [tab, setTab]           = useState('Overview');
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const rawId = EXERCISE_VIDEO_URLS[exercise.id]?.split('/embed/')[1];
  const videoUrl = rawId
    ? `https://www.youtube-nocookie.com/embed/${rawId}?autoplay=0&modestbranding=1&rel=0&playsinline=1`
    : EXERCISE_VIDEO_URLS[exercise.id];

  const phases = exercise.phases ? Object.entries(exercise.phases) : [];
  const mistakes = exercise.mistakes || [];
  const tips = exercise.tips || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Sticky header */}
        <div className="flex items-start justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div>
            <h2 className="text-lg font-bold leading-tight">{localizedExercise.name}</h2>
            <div className="flex gap-2 mt-1 flex-wrap">
              <Badge className={cn('text-[10px]', DIFF_COLORS[exercise.difficulty])}>
                {localizedExercise.difficulty}
              </Badge>
              <Badge className="bg-white/20 text-white text-[10px]">{localizedExercise.muscleGroup}</Badge>
              <Badge className="bg-white/20 text-white text-[10px] capitalize">{localizedExercise.location}</Badge>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b bg-white overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap px-2',
                tab === t
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-800'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {tab === 'Overview' && (
            <div className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">{localizedExercise.description}</p>

              {/* Camera angle tip */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Camera className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-blue-800">Best camera angle</div>
                  <div className="text-xs text-blue-700 mt-0.5">{localizedExercise.cameraAngle}</div>
                </div>
              </div>

              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Link to={`/exercise-analysis/${exercise.id}`} onClick={onClose}>
                  Start AI Analysis
                </Link>
              </Button>

              {/* Equipment */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Equipment</div>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.equipment.map((eq, i) => (
                    <Badge key={i} variant="outline" className="text-xs capitalize">
                      {localizedExercise.equipment[i] || translateExerciseValue(eq === 'none' ? 'No equipment' : eq, language)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Video */}
              {videoUrl && (
                <div>
                  {!showVideo ? (
                    <button
                      onClick={() => { setShowVideo(true); setVideoError(false); }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold text-sm transition-all"
                    >
                      <PlayCircle className="h-5 w-5" />
                      Watch Video Demonstration
                    </button>
                  ) : videoError ? (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 py-6 text-center space-y-2 px-4">
                      <AlertTriangle className="h-7 w-7 text-amber-400 mx-auto" />
                      <p className="text-sm text-gray-600">Video unavailable.</p>
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setVideoError(false)} className="text-xs text-purple-600 underline flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" /> Retry
                        </button>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' form tutorial')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-600 underline"
                        >
                          Search YouTube
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-black" style={{ aspectRatio: '16/9' }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={videoUrl}
                          title={exercise.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          onError={() => setVideoError(true)}
                        />
                      </div>
                      <button onClick={() => setShowVideo(false)} className="text-xs text-gray-500 underline">Hide video</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'Steps' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-800">Follow each phase in order. The AI camera will track these phases in real time.</p>
              </div>
              {phases.map(([phaseName, phaseData], idx) => (
                <div key={phaseName} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pb-3 border-b last:border-0">
                    <div className="font-semibold text-sm text-gray-900 capitalize mb-0.5">
                      {phaseName.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs text-gray-600 leading-relaxed">{phaseData.description}</div>
                    {/* Angle targets */}
                    {phaseData.kneeAngle && (
                      <div className="mt-1.5 inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-[10px] text-gray-600">
                        🦵 Knee angle: {phaseData.kneeAngle[0]}–{phaseData.kneeAngle[1]}°
                      </div>
                    )}
                    {phaseData.elbowAngle && (
                      <div className="mt-1.5 inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-[10px] text-gray-600">
                        💪 Elbow angle: {phaseData.elbowAngle[0]}–{phaseData.elbowAngle[1]}°
                      </div>
                    )}
                    {phaseData.hipAngle && (
                      <div className="mt-1.5 inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-[10px] text-gray-600">
                        🎯 Hip angle: {phaseData.hipAngle[0]}–{phaseData.hipAngle[1]}°
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Mistakes' && (
            <div className="space-y-3">
              {mistakes.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No common mistakes listed.</p>
              ) : (
                <>
                  <p className="text-xs text-gray-500">Our AI camera will detect and alert you to these issues in real time.</p>
                  {mistakes.map((m, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm text-red-800">{m.description}</div>
                        <div className="text-xs text-red-600 mt-0.5 italic">{m.detection}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {tab === 'Tips' && (
            <div className="space-y-3">
              {tips.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No tips available.</p>
              ) : (
                tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{tip}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
