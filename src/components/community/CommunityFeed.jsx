import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Globe, Users, Lock, Clock, Dumbbell, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { useAuthUser } from '../../lib/useAuthUser';

const privacyIcon = { public: Globe, friends: Users, private: Lock };

const formatDur = (s) => {
  if (!s) return null;
  const m = Math.floor(s / 60);
  return `${m}m`;
};

function PostCard({ post, currentUser, onLike, onUseTemplate }) {
  const liked = (post.likes || []).includes(currentUser?.email);
  const Icon = privacyIcon[post.privacy] || Globe;
  const isTemplate = post.post_type === 'template_share';
  const isOwn = post.created_by === currentUser?.email;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(post.author_name || 'A')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {post.author_name || 'Athlete'}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {new Date(post.created_date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          {isTemplate && (
            <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
              Template
            </Badge>
          )}
        </div>

        <div className="mt-3 p-3 bg-gray-50 rounded-xl">
          <p className="font-semibold text-gray-900 text-sm">{post.workout_name}</p>

          {post.stats && (
            <div className="flex gap-3 mt-1 flex-wrap">
              {post.stats.exercises_completed != null && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" />
                  {post.stats.exercises_completed} exercises
                </span>
              )}

              {post.stats.total_reps != null && (
                <span className="text-xs text-gray-500">
                  🔁 {post.stats.total_reps} reps
                </span>
              )}

              {post.stats.duration_seconds && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDur(post.stats.duration_seconds)}
                </span>
              )}

              {post.stats.difficulty && (
                <Badge variant="outline" className="text-xs capitalize">
                  {post.stats.difficulty}
                </Badge>
              )}
            </div>
          )}

          {isTemplate && post.template_exercises && (
            <div className="mt-2 space-y-1">
              {post.template_exercises.slice(0, 3).map((ex, i) => (
                <p key={i} className="text-xs text-gray-500">
                  {ex.exercise_name} — {ex.sets}×{ex.reps}
                </p>
              ))}
              {post.template_exercises.length > 3 && (
                <p className="text-xs text-gray-400">
                  +{post.template_exercises.length - 3} more
                </p>
              )}
            </div>
          )}
        </div>

        {post.caption && <p className="mt-2 text-sm text-gray-700">{post.caption}</p>}

        <div className="mt-3 flex items-center gap-2">
          {currentUser && (
            <button
              type="button"
              onClick={() => onLike(post)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
                liked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
              {(post.likes || []).length}
            </button>
          )}

          {isTemplate && currentUser && !isOwn && (
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => onUseTemplate(post)}
              className="text-xs ml-auto"
            >
              <Download className="h-3 w-3 mr-1" />
              Use Template
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommunityFeed() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const user = useAuthUser();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['communityFeed'],
    queryFn: () =>
      base44.entities.WorkoutPost.filter({ privacy: 'public' }, '-created_date', 30),
  });

  const likeMutation = useMutation({
    mutationFn: async (post) => {
      const likes = post.likes || [];
      const alreadyLiked = likes.includes(user.email);
      const newLikes = alreadyLiked
        ? likes.filter((e) => e !== user.email)
        : [...likes, user.email];

      return base44.entities.WorkoutPost.update(post.id, { likes: newLikes });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['communityFeed'] }),
    onError: () => {},
  });

  const handleUseTemplate = async (post) => {
    try {
      await base44.entities.StructuredPlan.create({
        name: `${post.workout_name} (community)`,
        exercises: (post.template_exercises || []).map((ex) => ({
          exercise_name: ex.exercise_name,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest_seconds,
        })),
        source: 'custom',
        is_template: false,
      });
      toast.success('Template saved to your plans!');
    } catch {
      toast.error('Failed to save template');
    }
  };

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.post_type === filter);

  if (isLoading || user === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!user && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm text-purple-700">
            <a href={createPageUrl('Auth')} className="font-semibold underline">
              Sign in
            </a>{' '}
            to like posts, share workouts, and join challenges.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {[
          ['all', 'All'],
          ['workout_summary', 'Workouts'],
          ['template_share', 'Templates'],
        ].map(([val, label]) => (
          <button
            key={val}
            type="button"
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === val
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-medium">Nothing here yet</p>
          <p className="text-sm mt-1">Be the first to share a workout!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={user}
              onLike={(post) =>
                user ? likeMutation.mutate(post) : toast.info('Sign in to like posts')
              }
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>
      )}
    </div>
  );
}