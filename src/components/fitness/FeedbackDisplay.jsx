import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, AlertTriangle, Timer, Zap, Activity, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Issue catalog ────────────────────────────────────────────────────────────
const ISSUES = {
  insufficient_depth:   { text: 'Not deep enough',       icon: TrendingUp,    color: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-300', p: 7 },
  knees_caving:         { text: 'Knees caving in',        icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-300',    p: 10 },
  knees_caving_in:      { text: 'Knees caving in',        icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-300',    p: 10 },
  excessive_lean:       { text: 'Torso too forward',      icon: AlertCircle,   color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-300', p: 8 },
  hip_shift:            { text: 'Hips uneven',            icon: AlertCircle,   color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-300', p: 8 },
  stance_too_narrow:    { text: 'Stance too narrow',      icon: AlertCircle,   color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-300',   p: 5 },
  hips_sagging:         { text: 'Hips sagging',           icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-300',    p: 10 },
  hips_raised:          { text: 'Hips too high',          icon: AlertCircle,   color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-300', p: 7 },
  elbows_flaring:       { text: 'Elbows flaring',         icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-300', p: 8 },
  uneven_shoulders:     { text: 'Asymmetric arms',        icon: AlertCircle,   color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-300', p: 6 },
  elbow_position:       { text: 'Elbows misaligned',      icon: AlertCircle,   color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-300',   p: 3 },
  knee_too_forward:     { text: 'Knee past toes',         icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-300',    p: 9 },
  back_leg_bent:        { text: 'Extend back leg',        icon: AlertCircle,   color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-300',   p: 3 },
  incomplete_curl:      { text: 'Curl higher',            icon: AlertCircle,   color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-300', p: 6 },
  incomplete_extension: { text: 'Extend arms fully',      icon: AlertCircle,   color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-300',   p: 3 },
  elbow_drifting:       { text: 'Elbows drifting',        icon: AlertCircle,   color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-300',   p: 5 },
  uneven_curl:          { text: 'Uneven curl',            icon: AlertCircle,   color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-300', p: 6 },
  hip_rotation:         { text: 'Hips rotating',          icon: AlertCircle,   color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-300', p: 7 },
  back_arching:         { text: 'Back arching',           icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-300',    p: 9 },
  arms_not_extended:    { text: 'Extend arms fully',      icon: AlertCircle,   color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-300', p: 6 },
  not_low_enough:       { text: 'Lower to shoulders',     icon: AlertCircle,   color: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-300', p: 6 },
  arms_not_raised:      { text: 'Raise arms fully',       icon: AlertCircle,   color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-300',   p: 4 },
  legs_not_spread:      { text: 'Spread legs wider',      icon: AlertCircle,   color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-300',   p: 4 },
  neck_forward:         { text: 'Neck forward',           icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-300', p: 9 },
  spine_not_neutral:    { text: 'Back not neutral',       icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-300',    p: 10 },
  knee_asymmetry:       { text: 'Uneven knees',           icon: AlertCircle,   color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-300', p: 8 },
  elbow_asymmetry:      { text: 'Uneven elbows',          icon: AlertCircle,   color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-300', p: 8 },
  shoulder_asymmetry:   { text: 'Uneven shoulders',       icon: AlertCircle,   color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-300', p: 8 },
};

// ─── Score → Status ───────────────────────────────────────────────────────────
function getStatus(score) {
  if (score === null || score === undefined) return null;
  if (score >= 90) return { label: 'Excellent', color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-300' };
  if (score >= 70) return { label: 'Good',      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-300' };
  if (score >= 50) return { label: 'Needs Work', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-300' };
  return              { label: 'Poor Form',    color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-300' };
}

// ─── Gauge config per exercise ────────────────────────────────────────────────
const GAUGE_CONFIG = {
  squat:          { key: 'kneeAngle',      goodMin: 80,  goodMax: 100, label: 'Knee' },
  barbell_squat:  { key: 'kneeAngle',      goodMin: 75,  goodMax: 105, label: 'Knee' },
  jump_squat:     { key: 'kneeAngle',      goodMin: 80,  goodMax: 115, label: 'Knee' },
  single_leg_squat: { key: 'kneeAngle',    goodMin: 60,  goodMax: 115, label: 'Knee' },
  lunge:          { key: 'frontKneeAngle', goodMin: 80,  goodMax: 105, label: 'Front Knee' },
  push_up:        { key: 'elbowAngle',     goodMin: 60,  goodMax: 95,  label: 'Elbow' },
  pushup:         { key: 'elbowAngle',     goodMin: 60,  goodMax: 95,  label: 'Elbow' },
  bench_press:    { key: 'elbowAngle',     goodMin: 70,  goodMax: 110, label: 'Elbow' },
  bicep_curl:     { key: 'elbowAngle',     goodMin: 30,  goodMax: 65,  label: 'Elbow (top)' },
  tricep_extension: { key: 'elbowAngle',   goodMin: 150, goodMax: 180, label: 'Elbow' },
  lat_pulldown:   { key: 'elbowAngle',     goodMin: 70,  goodMax: 115, label: 'Elbow' },
  pull_up:        { key: 'elbowAngle',     goodMin: 45,  goodMax: 100, label: 'Elbow' },
  barbell_row:    { key: 'elbowAngle',     goodMin: 70,  goodMax: 115, label: 'Elbow' },
  shoulder_press: { key: 'elbowAngle',     goodMin: 150, goodMax: 180, label: 'Elbow (press)' },
  plank:          { key: 'spineAngle',     goodMin: 170, goodMax: 185, label: 'Spine' },
  glute_bridge:   { key: 'spineAngle',     goodMin: 160, goodMax: 185, label: 'Hip Line' },
  mountain_climber: { key: 'spineAngle',   goodMin: 155, goodMax: 180, label: 'Spine' },
  situp:          { key: 'torsoAngle',     goodMin: 30,  goodMax: 90,  label: 'Torso' },
  sit_up:         { key: 'torsoAngle',     goodMin: 30,  goodMax: 90,  label: 'Torso' },
  deadlift:       { key: 'backAngle',      goodMin: 150, goodMax: 180, label: 'Back' },
  leg_press:      { key: 'kneeAngle',      goodMin: 70,  goodMax: 110, label: 'Knee' },
  leg_curl:       { key: 'kneeAngle',      goodMin: 60,  goodMax: 95,  label: 'Knee' },
  leg_extension:  { key: 'kneeAngle',      goodMin: 150, goodMax: 180, label: 'Knee' },
  jumping_jack:   { key: 'armAngle',       goodMin: 120, goodMax: 180, label: 'Arms' },
};

const BODY_ANGLE_ROWS = [
  ['Knees', 'leftKneeAngle', 'rightKneeAngle'],
  ['Hips', 'leftHipAngle', 'rightHipAngle'],
  ['Elbows', 'leftElbowAngle', 'rightElbowAngle'],
  ['Shoulders', 'leftShoulderAngle', 'rightShoulderAngle'],
  ['Back', 'backAngle', 'spineAngle'],
  ['Neck', 'neckAngle', null],
];

// ─── Angle Gauge ──────────────────────────────────────────────────────────────
function AngleGauge({ angle, goodMin, goodMax, label }) {
  if (angle === undefined || angle === null) return null;
  const inRange = angle >= goodMin && angle <= goodMax;
  const clampedAngle = Math.max(0, Math.min(180, angle));
  const r = 38, circumHalf = Math.PI * r;
  const pct = clampedAngle / 180;
  const dashOffset = circumHalf * (1 - pct);

  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="50" viewBox="0 0 90 50">
        <path d="M 6 46 A 39 39 0 0 1 84 46" fill="none" stroke="#e5e7eb" strokeWidth="7" strokeLinecap="round" />
        <path
          d="M 6 46 A 39 39 0 0 1 84 46"
          fill="none"
          stroke={inRange ? '#22c55e' : angle < goodMin ? '#f59e0b' : '#ef4444'}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumHalf}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.25s ease, stroke 0.25s ease' }}
        />
        <text x="45" y="40" textAnchor="middle" fontSize="14" fontWeight="bold"
          fill={inRange ? '#16a34a' : '#dc2626'}>
          {angle}°
        </text>
      </svg>
      <span className="text-[10px] text-gray-400 uppercase tracking-wide -mt-1">{label}</span>
      <span className={cn('text-[10px] font-semibold', inRange ? 'text-green-600' : 'text-orange-500')}>
        {inRange ? '✓ In range' : `target ${goodMin}–${goodMax}°`}
      </span>
    </div>
  );
}

// ─── Score Card ───────────────────────────────────────────────────────────────
function ScoreCard({ score, repFormDegradation }) {
  const status = getStatus(score);
  if (!status) return null;
  const pct = Math.min(100, Math.max(0, score));
  const barColor = pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-blue-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={cn('rounded-xl border-2 p-3 space-y-1.5', status.bg, status.border)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Score</span>
        <div className="flex items-center gap-2">
          <span className={cn('text-xl font-black', status.color)}>{pct}/100</span>
          <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border', status.color, status.bg, status.border)}>
            {status.label}
          </span>
        </div>
      </div>
      <div className="h-2 bg-white/60 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', barColor)} style={{ width: `${pct}%` }} />
      </div>
      {repFormDegradation && (
        <div className="text-xs text-orange-700 font-semibold flex items-center gap-1 pt-0.5">
          <AlertTriangle className="h-3 w-3" /> Form dropping — reset posture
        </div>
      )}
    </div>
  );
}

// ─── Rep Counter ─────────────────────────────────────────────────────────────
function RepCounter({ repCount, goodReps, currentExerciseStats }) {
  const [flash, setFlash] = useState(false);
  const prevCount = useRef(repCount);

  useEffect(() => {
    if (repCount > prevCount.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }
    prevCount.current = repCount;
  }, [repCount]);

  const pct = repCount > 0 ? Math.round((goodReps / repCount) * 100) : 0;
  const exerciseTotal = currentExerciseStats?.totalReps ?? repCount;
  const exerciseGood = currentExerciseStats?.goodReps ?? goodReps;
  const exercisePct =
    exerciseTotal > 0 ? Math.round((exerciseGood / exerciseTotal) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className={cn(
          'bg-white rounded-xl border-2 p-3 text-center transition-all duration-300',
          flash ? 'border-purple-500 bg-purple-50 scale-105' : 'border-gray-200'
        )}>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Reps</div>
          <div className={cn('text-3xl font-black leading-tight transition-colors', flash ? 'text-purple-600' : 'text-gray-900')}>
            {repCount}
          </div>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-3 text-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Good Form</div>
          <div className={cn('text-3xl font-black leading-tight', pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500')}>
            {goodReps ?? 0}
          </div>
          {repCount > 0 && (
            <div className={cn('text-[10px] font-semibold', pct >= 80 ? 'text-green-500' : pct >= 50 ? 'text-yellow-500' : 'text-red-400')}>
              {pct}%
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-gray-50 px-3 py-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wide text-gray-400">
            Current exercise
          </span>
          <span className="font-black text-gray-800">
            {exerciseGood}/{exerciseTotal} clean
          </span>
        </div>
        {exerciseTotal > 0 && (
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-white">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                exercisePct >= 80 ? 'bg-green-500' : exercisePct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              )}
              style={{ width: `${exercisePct}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FeedbackDisplay({
  feedback,
  repCount,
  holdSeconds,
  sessionData,
  currentExerciseStats,
  exerciseId,
}) {
  if (!feedback) return null;

  const { issues = [], issueDetails = {}, metrics = {}, message, hint, state, lowConfidence, formScore: rawScore, notAssessable } = feedback;
  const formScore = rawScore ?? metrics.formScore;

  // Consistency degradation: good form ratio dropping below 50% after 5+ reps
  const repFormDegradation = repCount >= 5
    && sessionData?.goodReps != null
    && (sessionData.goodReps / repCount) < 0.5;

  // Gauge
  const gaugeCfg = GAUGE_CONFIG[exerciseId] || GAUGE_CONFIG.squat;
  const gaugeValue = metrics[gaugeCfg?.key];

  // Sort issues by priority — show TOP 2 only (per spec)
  const sortedIssues = [...issues]
    .filter(k => ISSUES[k])
    .sort((a, b) => (ISSUES[b]?.p || 0) - (ISSUES[a]?.p || 0))
    .slice(0, 2);

  const primaryKey = sortedIssues[0] || null;
  const primaryCfg = primaryKey ? ISSUES[primaryKey] : null;
  const secondaryKey = sortedIssues[1] || null;
  const secondaryCfg = secondaryKey ? ISSUES[secondaryKey] : null;

  const isGood = issues.length === 0 && !lowConfidence;
  const hasHighIssue = sortedIssues.some(k => issueDetails[k]?.severity === 'high');

  return (
    <div className="space-y-3">

      {/* NOT ASSESSABLE — full body not visible or out of position */}
      {notAssessable && (
        <div className="rounded-xl bg-gray-900 text-white px-4 py-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Camera className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            {message || 'Adjust your position'}
          </div>
          {hint && (
            <p className="text-xs text-gray-400 pl-6">{hint}</p>
          )}
        </div>
      )}

      {/* Low confidence (joints detected but below threshold) — only show if not already notAssessable */}
      {!notAssessable && lowConfidence && (
        <div className="rounded-xl bg-gray-800 text-white px-4 py-3 flex items-center gap-2 text-sm font-semibold">
          <Camera className="h-4 w-4 text-gray-300 flex-shrink-0" />
          {message || 'Adjust camera position'}
        </div>
      )}

      {/* Coaching banner (only when assessable and not low confidence) */}
      {!notAssessable && !lowConfidence && message && (
        <div className={cn(
          'rounded-xl px-4 py-2.5 text-center font-bold text-sm flex items-center justify-center gap-2 transition-colors duration-300',
          isGood
            ? 'bg-gray-800 text-white'
            : hasHighIssue
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-gray-900 text-white'
        )}>
          {isGood
            ? <Activity className="h-4 w-4 text-green-400 flex-shrink-0" />
            : <Zap className="h-4 w-4 text-yellow-400 flex-shrink-0" />
          }
          {message}
        </div>
      )}

      {/* Rep counter or hold timer — hide when not assessable */}
      {!notAssessable && (
        feedback.isTimeBased ? (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-center">
            <Timer className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="text-4xl font-black text-blue-600">{holdSeconds ?? 0}s</div>
            <div className="text-xs text-blue-400">Hold time</div>
          </div>
        ) : (
          <RepCounter
            repCount={repCount ?? 0}
            goodReps={currentExerciseStats?.goodReps ?? sessionData?.goodReps ?? 0}
            currentExerciseStats={currentExerciseStats}
          />
        )
      )}

      {/* Score card */}
      {!notAssessable && !lowConfidence && formScore != null && (
        <ScoreCard score={formScore} repFormDegradation={repFormDegradation} />
      )}

      {/* Angle Gauge */}
      {!notAssessable && !lowConfidence && gaugeValue !== undefined && (
        <div className="bg-white rounded-xl border p-2 flex justify-center">
          <AngleGauge
            angle={gaugeValue}
            goodMin={gaugeCfg.goodMin}
            goodMax={gaugeCfg.goodMax}
            label={gaugeCfg.label}
          />
        </div>
      )}

      {!notAssessable && !lowConfidence && (
        <div className="bg-white rounded-xl border p-3 space-y-2">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">
            Full body angles
          </div>
          <div className="grid grid-cols-2 gap-2">
            {BODY_ANGLE_ROWS.map(([label, leftKey, rightKey]) => {
              const left = metrics[leftKey];
              const right = rightKey ? metrics[rightKey] : null;
              if (left == null && right == null) return null;

              return (
                <div key={label} className="rounded-lg bg-gray-50 px-2 py-1.5">
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">
                    {label}
                  </div>
                  <div className="text-sm font-black text-gray-800">
                    {rightKey ? (
                      <>
                        {left ?? '-'}° / {right ?? '-'}°
                      </>
                    ) : (
                      <>{left ?? '-'}°</>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Primary issue — max 2 shown */}
      {!notAssessable && !lowConfidence && primaryCfg && (
        <div className={cn('flex items-start gap-3 p-3 rounded-xl border-2', primaryCfg.bg, primaryCfg.border)}>
          <primaryCfg.icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', primaryCfg.color)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('font-bold text-sm', primaryCfg.color)}>{primaryCfg.text}</span>
              {issueDetails[primaryKey]?.severity && (
                <span className={cn(
                  'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
                  issueDetails[primaryKey].severity === 'high' ? 'bg-red-100 text-red-700' :
                  issueDetails[primaryKey].severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                )}>
                  {issueDetails[primaryKey].severity}
                </span>
              )}
            </div>
            {issueDetails[primaryKey]?.message && (
              <div className="text-xs mt-0.5 text-gray-600">{issueDetails[primaryKey].message}</div>
            )}
          </div>
        </div>
      )}

      {/* Secondary issue */}
      {!notAssessable && !lowConfidence && secondaryCfg && (
        <div className={cn('flex items-start gap-2 p-2.5 rounded-lg border', secondaryCfg.bg, secondaryCfg.border)}>
          <secondaryCfg.icon className={cn('h-4 w-4 flex-shrink-0 mt-0.5', secondaryCfg.color)} />
          <div>
            <div className={cn('font-semibold text-xs', secondaryCfg.color)}>{secondaryCfg.text}</div>
            {issueDetails[secondaryKey]?.message && (
              <div className="text-gray-500 text-xs mt-0.5">{issueDetails[secondaryKey].message}</div>
            )}
          </div>
        </div>
      )}

      {/* Good form — only when assessable, truly no issues AND score is genuinely high */}
      {!notAssessable && !lowConfidence && isGood && formScore != null && formScore >= 92 && (
        <div className="flex items-center gap-2 p-3 rounded-xl border-2 bg-green-50 border-green-300">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="font-bold text-sm text-green-700">Clean rep — hold this standard</span>
        </div>
      )}

      {/* State indicator */}
      {!notAssessable && !lowConfidence && (
        <div className="flex items-center gap-1.5">
          <Activity className={cn('h-3.5 w-3.5', state === 'down' || state === 'holding' ? 'text-purple-500 animate-pulse' : 'text-gray-300')} />
          <span className="text-[11px] text-gray-400 capitalize">{state?.replace(/_/g, ' ')}</span>
        </div>
      )}
    </div>
  );
}
