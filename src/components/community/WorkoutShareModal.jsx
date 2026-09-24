import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Share2, Globe, Users, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Everyone', icon: Globe, color: 'text-green-600' },
  { value: 'friends', label: 'Friends', icon: Users, color: 'text-blue-600' },
  { value: 'private', label: 'Only me', icon: Lock, color: 'text-gray-600' }
];

export default function WorkoutShareModal({ plan, onClose }) {
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      await base44.entities.WorkoutPost.create({
        post_type: 'workout_summary',
        workout_name: plan.name,
        caption,
        privacy,
        author_name: user.full_name || user.email.split('@')[0],
        likes: [],
        stats: {
          exercises_completed: plan.exercises_completed,
          total_reps: plan.total_reps_completed,
          duration_seconds: plan.duration_seconds,
          difficulty: plan.difficulty,
          goal: plan.goal
        }
      });
      setDone(true);
      toast.success('Workout shared to the community! 🎉');
      setTimeout(onClose, 1500);
    } catch {
      toast.error('Failed to share workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-6 space-y-4">
          {done ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">Shared!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Share Workout</h2>
              </div>

              <div className="bg-purple-50 rounded-xl p-3">
                <p className="font-semibold text-gray-900">{plan.name}</p>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  {plan.exercises_completed != null && <span>💪 {plan.exercises_completed} exercises</span>}
                  {plan.total_reps_completed != null && <span>🔁 {plan.total_reps_completed} reps</span>}
                  {plan.duration_seconds && <span>⏱ {Math.round(plan.duration_seconds / 60)}m</span>}
                </div>
              </div>

              <textarea
                placeholder="Add a caption... (optional)"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Who can see this?</p>
                <div className="flex gap-2">
                  {PRIVACY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setPrivacy(opt.value)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                        privacy === opt.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <opt.icon className={`h-4 w-4 ${privacy === opt.value ? 'text-purple-600' : opt.color}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button onClick={handleShare} disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Share'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}