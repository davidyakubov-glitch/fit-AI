import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { PlayCircle, XCircle, AlertTriangle, RefreshCw, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EXERCISE_VIDEO_CATALOG } from './exerciseVideoCatalog';

const Exercise3DDemo = lazy(() => import('./Exercise3DDemo'));

const fallbackIds = {
  squat:          'U3HlEF_E9fo',
  push_up:        'ukLjGCHpBrU',
  plank:          'ASdvN_XEl_c',
  deadlift:       'r4MzxtBKyNE',
  bench_press:    'gRVjAtPip0Y',
  shoulder_press: 'qEwKCR5JCog',
  bicep_curl:     'in7PaeGZ6O0',
};

// Exercises that have a 3D animation defined
const HAS_3D = new Set(['squat','lunge','push_up','plank','bicep_curl','shoulder_press','barbell_squat']);

function buildEmbedUrl(videoId) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
}

export default function ExerciseVideo({ exerciseId, exerciseName }) {
  const [mode, setMode]             = useState('idle'); // idle | video | 3d
  const [phase, setPhase]           = useState('idle'); // idle | playing | error
  const [retries, setRetries]       = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const iframeRef                   = useRef(null);
  const containerRef                = useRef(null);

  const videoData  = EXERCISE_VIDEO_CATALOG[exerciseId];
  const primaryId  = videoData?.id;
  const fallbackId = fallbackIds[exerciseId];
  const currentId  = useFallback ? fallbackId : primaryId;
  const can3D      = HAS_3D.has(exerciseId);

  // Reset when exercise changes
  useEffect(() => {
    setMode('idle');
    setPhase('idle');
    setRetries(0);
    setUseFallback(false);
  }, [exerciseId]);

  if (!videoData) return null;

  const handleIframeError = () => {
    if (retries < 1) {
      setRetries(r => r + 1);
      setPhase('idle');
      setTimeout(() => setPhase('playing'), 300);
    } else if (!useFallback && fallbackId) {
      setUseFallback(true);
      setRetries(0);
      setPhase('playing');
    } else {
      setPhase('error');
    }
  };

  const reset = () => { setMode('idle'); setPhase('idle'); setUseFallback(false); setRetries(0); };

  return (
    <div ref={containerRef} className="mt-4 space-y-2">

      {/* ── Idle thumbnail with two launch buttons ── */}
      {mode === 'idle' && (
        <div className="space-y-2">
          <button
            onClick={() => { setMode('video'); setPhase('playing'); }}
            className="relative w-full rounded-xl overflow-hidden group cursor-pointer border-2 border-transparent hover:border-purple-400 transition-all"
            style={{ aspectRatio: '16/9' }}
          >
            <img
              src={videoData.thumb}
              alt={exerciseName}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
              <div className="bg-red-600 rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-transform">
                <PlayCircle className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-white text-xs font-semibold drop-shadow">
              ▶ Watch: {exerciseName}
            </div>
          </button>

          {/* 3D demo button (only for supported exercises) */}
          {can3D && (
            <button
              onClick={() => setMode('3d')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-purple-200 hover:border-purple-400 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-all"
            >
              <Box className="h-3.5 w-3.5" />
              View 3D Skeleton Demo
            </button>
          )}
        </div>
      )}

      {/* ── YouTube player ── */}
      {mode === 'video' && (
        <div className="space-y-2">
          {useFallback && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              Video unavailable, loading alternative…
            </div>
          )}

          {phase !== 'error' && currentId && (
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-black" style={{ aspectRatio: '16/9' }}>
              <iframe
                ref={iframeRef}
                key={`${currentId}-${retries}`}
                className="absolute top-0 left-0 w-full h-full"
                src={buildEmbedUrl(currentId)}
                title={exerciseName}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                onError={handleIframeError}
              />
            </div>
          )}

          {phase === 'error' && (
            <div className="w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 py-8 text-center px-4">
              <AlertTriangle className="h-8 w-8 text-amber-400" />
              <div>
                <p className="font-semibold text-gray-700 text-sm">Video unavailable</p>
                <p className="text-xs text-gray-500 mt-1">Try searching "{exerciseName}" on YouTube.</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setPhase('playing'); setRetries(0); setUseFallback(false); }}>
                  <RefreshCw className="h-3 w-3 mr-1" /> Retry
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' form tutorial')}`} target="_blank" rel="noopener noreferrer">
                    Search YouTube
                  </a>
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700 underline flex items-center gap-1">
              <XCircle className="h-3 w-3" /> Hide
            </button>
            {can3D && (
              <button onClick={() => setMode('3d')} className="text-xs text-purple-600 hover:text-purple-800 underline flex items-center gap-1">
                <Box className="h-3 w-3" /> Switch to 3D demo
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 3D skeleton demo ── */}
      {mode === '3d' && (
        <div className="space-y-2">
          <Suspense fallback={
            <div className="w-full h-[340px] rounded-xl bg-slate-100 flex items-center justify-center text-sm text-gray-400">
              Loading 3D…
            </div>
          }>
            <Exercise3DDemo exerciseId={exerciseId} exerciseName={exerciseName} />
          </Suspense>
          <div className="flex items-center gap-3">
            <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700 underline flex items-center gap-1">
              <XCircle className="h-3 w-3" /> Hide
            </button>
            <button onClick={() => { setMode('video'); setPhase('playing'); }} className="text-xs text-red-600 hover:text-red-800 underline flex items-center gap-1">
              <PlayCircle className="h-3 w-3" /> Switch to video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
