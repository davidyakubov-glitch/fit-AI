import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Share2, Plus } from 'lucide-react';
import CommunityFeed from '../components/community/CommunityFeed';
import ChallengesLeaderboard from '../components/community/ChallengesLeaderboard';
import ShareTemplateModal from '../components/community/ShareTemplateModal';
import { createPageUrl } from '@/utils';

export default function Community() {
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me().catch(() => null)
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-7 w-7 text-purple-600" /> Community
            </h1>
            <p className="text-gray-500 text-sm mt-1">Share workouts, compete, and get inspired</p>
          </div>
          {user && (
            <Button onClick={() => setShowTemplateModal(true)} size="sm" className="bg-purple-600 hover:bg-purple-700 flex-shrink-0">
              <Plus className="h-4 w-4 mr-1" /> Share Template
            </Button>
          )}
        </div>

        {!user && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white text-center">
            <p className="font-bold text-lg">Join the Community</p>
            <p className="text-purple-200 text-sm mt-1 mb-4">Share workouts, compete on leaderboards, and discover community templates</p>
            <a href={createPageUrl('Auth')} className="inline-block bg-white text-purple-700 font-semibold px-5 py-2 rounded-xl text-sm hover:bg-purple-50 transition-colors">
              Sign Up Free
            </a>
          </div>
        )}

        <Tabs defaultValue="feed">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">
              <Share2 className="h-4 w-4 mr-2" /> Activity Feed
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <Trophy className="h-4 w-4 mr-2" /> Challenges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4">
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="challenges" className="mt-4">
            <ChallengesLeaderboard />
          </TabsContent>
        </Tabs>
      </div>

      {showTemplateModal && <ShareTemplateModal onClose={() => setShowTemplateModal(false)} />}
    </div>
  );
}