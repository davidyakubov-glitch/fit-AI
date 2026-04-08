import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Dumbbell, Plus, Medal, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';

const typeIcon = { reps: Dumbbell, streak: Flame, duration: Trophy };
const typeLabel = { reps: 'Reps', streak: 'Day Streak', duration: 'Minutes' };

const PRESET_CHALLENGES = [
  { title: '100 Push-ups Challenge', description: 'Hit 100 push-ups in a single session', challenge_type: 'reps', exercise_name: 'Push-up', target_value: 100, is_active: true, entries: [] },
  { title: '7-Day Workout Streak', description: 'Work out every day for 7 days straight', challenge_type: 'streak', target_value: 7, is_active: true, entries: [] },
  { title: 'Squat King', description: 'Most squats completed in one session', challenge_type: 'reps', exercise_name: 'Squat', target_value: 50, is_active: true, entries: [] }
];

function ChallengeCard({ challenge, user, onSubmit }) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const Icon = typeIcon[challenge.challenge_type] || Trophy;
  const entries = [...(challenge.entries || [])].sort((a, b) => b.value - a.value);
  const myEntry = entries.find(e => e.user_email === user?.email);
  const isEnded = challenge.end_date && new Date(challenge.end_date) < new Date();

  const handleSubmit = async () => {
    const num = parseFloat(value);
    if (!num || num <= 0) return toast.error('Enter a valid number');
    setSubmitting(true);
    await onSubmit(challenge, num);
    setValue('');
    setSubmitting(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{challenge.title}</p>
              <p className="text-xs text-gray-500">{challenge.description}</p>
            </div>
          </div>
          <button onClick={() => setExpanded(e => !e)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <Badge variant="outline" className="text-xs capitalize">{typeLabel[challenge.challenge_type]}</Badge>
          {challenge.exercise_name && <Badge variant="outline" className="text-xs">{challenge.exercise_name}</Badge>}
          <Badge className={`text-xs ml-auto ${isEnded ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
            {isEnded ? 'Ended' : 'Active'}
          </Badge>
        </div>

        {/* Top 3 mini leaderboard */}
        {entries.length > 0 && (
          <div className="mt-3 space-y-1">
            {entries.slice(0, 3).map((entry, i) => (
              <div key={i} className={`flex items-center justify-between text-xs px-2 py-1 rounded-lg ${entry.user_email === user?.email ? 'bg-purple-50 text-purple-800' : 'bg-gray-50 text-gray-700'}`}>
                <span className="flex items-center gap-2">
                  <span className="font-bold">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                  {entry.user_name || entry.user_email.split('@')[0]}
                </span>
                <span className="font-semibold">{entry.value} {typeLabel[challenge.challenge_type]}</span>
              </div>
            ))}
          </div>
        )}

        {expanded && (
          <div className="mt-3 space-y-3">
            {entries.length > 3 && (
              <div className="space-y-1">
                {entries.slice(3).map((entry, i) => (
                  <div key={i} className={`flex items-center justify-between text-xs px-2 py-1 rounded-lg ${entry.user_email === user?.email ? 'bg-purple-50 text-purple-800' : 'text-gray-600'}`}>
                    <span className="flex items-center gap-2"><span className="w-5 text-center text-gray-400">{i + 4}</span>{entry.user_name || entry.user_email.split('@')[0]}</span>
                    <span className="font-semibold">{entry.value}</span>
                  </div>
                ))}
              </div>
            )}

            {user && !isEnded && (
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <input
                  type="number"
                  placeholder={`Your ${typeLabel[challenge.challenge_type].toLowerCase()}...`}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <Button size="sm" onClick={handleSubmit} disabled={submitting} className="bg-purple-600 hover:bg-purple-700">
                  {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : myEntry ? 'Update' : 'Submit'}
                </Button>
              </div>
            )}
          </div>
        )}

        {!user && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            <a href={createPageUrl('Auth')} className="text-purple-600 underline">Sign in</a> to participate
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ChallengesLeaderboard() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ['user'], queryFn: () => base44.auth.me().catch(() => null) });
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const db = await base44.entities.Challenge.list('-created_date', 20);
      return db.length > 0 ? db : PRESET_CHALLENGES.map((c, i) => ({ ...c, id: 'preset-' + i }));
    }
  });

  const submitMutation = useMutation({
    mutationFn: async ({ challenge, value }) => {
      if (challenge.id?.startsWith('preset-')) {
        // First create it in db
        const created = await base44.entities.Challenge.create({
          ...challenge,
          id: undefined,
          entries: [{
            user_email: user.email,
            user_name: user.full_name || user.email.split('@')[0],
            value,
            submitted_at: new Date().toISOString()
          }]
        });
        return created;
      }
      const entries = [...(challenge.entries || [])];
      const idx = entries.findIndex(e => e.user_email === user.email);
      const newEntry = { user_email: user.email, user_name: user.full_name || user.email.split('@')[0], value, submitted_at: new Date().toISOString() };
      if (idx >= 0) entries[idx] = newEntry; else entries.push(newEntry);
      return base44.entities.Challenge.update(challenge.id, { entries });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Score submitted! 🏆');
    },
    onError: () => toast.error('Failed to submit score')
  });

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <p className="text-sm text-gray-600">{challenges.length} active challenge{challenges.length !== 1 ? 's' : ''}</p>
        </div>
        <Medal className="h-5 w-5 text-gray-400" />
      </div>

      {challenges.map((ch, i) => (
        <ChallengeCard
          key={ch.id || i}
          challenge={ch}
          user={user}
          onSubmit={(challenge, value) => submitMutation.mutateAsync({ challenge, value })}
        />
      ))}
    </div>
  );
}