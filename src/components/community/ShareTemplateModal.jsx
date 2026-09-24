import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Share2, Globe, Users, Lock, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Everyone', icon: Globe },
  { value: 'friends', label: 'Friends', icon: Users },
  { value: 'private', label: 'Only me', icon: Lock }
];

export default function ShareTemplateModal({ onClose }) {
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [exercises, setExercises] = useState([
    { exercise_name: '', sets: 3, reps: '10', rest_seconds: 60 }
  ]);

  const addEx = () => setExercises(e => [...e, { exercise_name: '', sets: 3, reps: '10', rest_seconds: 60 }]);
  const removeEx = (i) => setExercises(e => e.filter((_, j) => j !== i));
  const updateEx = (i, key, val) => setExercises(e => e.map((ex, j) => j === i ? { ...ex, [key]: val } : ex));

  const handleShare = async () => {
    if (!name.trim()) return toast.error('Give your template a name');
    if (exercises.some(e => !e.exercise_name.trim())) return toast.error('Fill in all exercise names');
    setLoading(true);
    try {
      const user = await base44.auth.me();
      await base44.entities.WorkoutPost.create({
        post_type: 'template_share',
        workout_name: name,
        caption,
        privacy,
        author_name: user.full_name || user.email.split('@')[0],
        likes: [],
        template_exercises: exercises
      });
      setDone(true);
      toast.success('Template shared with the community! 💪');
      setTimeout(onClose, 1500);
    } catch {
      toast.error('Failed to share template');
    } finally {
      setLoading(false);
    }
  };

  const INPUT = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          {done ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">Template Shared!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Share Workout Template</h2>
              </div>

              <input className={INPUT} placeholder="Template name" value={name} onChange={e => setName(e.target.value)} />
              <textarea className={INPUT + ' resize-none'} placeholder="Describe this workout... (optional)" rows={2} value={caption} onChange={e => setCaption(e.target.value)} />

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">Exercises</p>
                {exercises.map((ex, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
                    <div className="flex gap-2">
                      <input className={INPUT} placeholder="Exercise name" value={ex.exercise_name} onChange={e => updateEx(i, 'exercise_name', e.target.value)} />
                      {exercises.length > 1 && (
                        <button onClick={() => removeEx(i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Sets</label>
                        <input type="number" className={INPUT} value={ex.sets} onChange={e => updateEx(i, 'sets', parseInt(e.target.value) || 1)} min={1} />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Reps</label>
                        <input className={INPUT} placeholder="10" value={ex.reps} onChange={e => updateEx(i, 'reps', e.target.value)} />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Rest (s)</label>
                        <input type="number" className={INPUT} value={ex.rest_seconds} onChange={e => updateEx(i, 'rest_seconds', parseInt(e.target.value) || 60)} min={0} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addEx} className="w-full border-dashed">
                  <Plus className="h-4 w-4 mr-1" /> Add Exercise
                </Button>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Privacy</p>
                <div className="flex gap-2">
                  {PRIVACY_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setPrivacy(opt.value)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${privacy === opt.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <opt.icon className="h-4 w-4" />{opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button onClick={handleShare} disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Share Template'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}