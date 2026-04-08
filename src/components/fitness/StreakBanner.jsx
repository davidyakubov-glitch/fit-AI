import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Flame, Trophy, Zap } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';

const ACHIEVEMENTS = [
  { id: 'first_workout',   label: 'First Step',      desc: 'Complete your first workout',   icon: '🎯', trigger: w => w >= 1 },
  { id: 'streak_3',        label: 'On Fire',          desc: '3-day workout streak',           icon: '🔥', trigger: (_, s) => s >= 3 },
  { id: 'streak_7',        label: 'Week Warrior',     desc: '7-day streak',                   icon: '⚡', trigger: (_, s) => s >= 7 },
  { id: 'streak_30',       label: 'Unstoppable',      desc: '30-day streak',                  icon: '🏆', trigger: (_, s) => s >= 30 },
  { id: 'reps_100',        label: 'Century',          desc: '100 total reps',                 icon: '💯', trigger: (_, __, r) => r >= 100 },
  { id: 'reps_1000',       label: 'Rep Monster',      desc: '1,000 total reps',               icon: '💪', trigger: (_, __, r) => r >= 1000 },
  { id: 'workouts_10',     label: 'Dedicated',        desc: '10 workouts completed',          icon: '🥇', trigger: w => w >= 10 },
  { id: 'workouts_50',     label: 'Elite',            desc: '50 workouts completed',          icon: '🌟', trigger: w => w >= 50 },
];

export function checkAchievements(totalWorkouts, streak, totalReps, unlocked = []) {
  return ACHIEVEMENTS.filter(a => !unlocked.includes(a.id) && a.trigger(totalWorkouts, streak, totalReps));
}

export { ACHIEVEMENTS };

export default function StreakBanner({ onWorkoutSaved }) {
  const [profile, setProfile] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  // Called from parent after a workout is saved
  useEffect(() => {
    if (onWorkoutSaved) {
      updateStreak();
    }
  }, [onWorkoutSaved]);

  async function loadProfile() {
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email }, '-created_date', 1);
      setProfile(profiles[0] || null);
    } catch {}
  }

  async function updateStreak() {
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email }, '-created_date', 1);
      const today = format(new Date(), 'yyyy-MM-dd');
      let prof = profiles[0];

      let streak = prof?.streak_days || 0;
      const lastDate = prof?.last_workout_date;

      if (lastDate) {
        const diff = differenceInDays(new Date(today), parseISO(lastDate));
        if (diff === 0) {
          // already logged today — no change
        } else if (diff === 1) {
          streak += 1;
        } else {
          streak = 1; // streak broken
        }
      } else {
        streak = 1;
      }

      const totalWorkouts = (prof?.total_workouts || 0) + 1;
      const totalReps = (prof?.total_reps || 0);
      const unlocked = prof?.achievements || [];
      const newOnes = checkAchievements(totalWorkouts, streak, totalReps, unlocked);

      const updateData = {
        streak_days: streak,
        longest_streak: Math.max(streak, prof?.longest_streak || 0),
        last_workout_date: today,
        total_workouts: totalWorkouts,
        achievements: [...unlocked, ...newOnes.map(a => a.id)],
      };

      if (prof) {
        await base44.entities.UserProfile.update(prof.id, updateData);
      } else {
        await base44.entities.UserProfile.create(updateData);
      }

      if (newOnes.length > 0) setNewAchievements(newOnes);
      setProfile({ ...(prof || {}), ...updateData });
    } catch {}
  }

  const streak = profile?.streak_days || 0;
  const longest = profile?.longest_streak || 0;

  // Show a motivational "start streak" prompt for new users too
  return (
    <>
      {/* Streak bar */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl px-4 py-3">
        <Flame className={`h-6 w-6 flex-shrink-0 ${streak >= 3 ? 'text-orange-500 animate-pulse' : 'text-orange-400'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-800 text-lg">{streak} day streak</span>
            {streak >= 7 && <Zap className="h-4 w-4 text-yellow-500" />}
          </div>
          <p className="text-xs text-orange-600">Best: {longest} days · Keep it up!</p>
        </div>
        {profile?.total_workouts > 0 && (
          <div className="text-right">
            <div className="text-xs font-bold text-orange-700">{profile.total_workouts}</div>
            <div className="text-[10px] text-orange-500">workouts</div>
          </div>
        )}
      </div>

      {/* New achievement toasts */}
      {newAchievements.map(a => (
        <div key={a.id} className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl px-4 py-3 shadow-lg">
          <span className="text-2xl">{a.icon}</span>
          <div>
            <div className="font-bold text-sm">Achievement Unlocked: {a.label}</div>
            <div className="text-purple-200 text-xs">{a.desc}</div>
          </div>
          <Trophy className="h-5 w-5 text-yellow-300 ml-auto flex-shrink-0" />
        </div>
      ))}
    </>
  );
}