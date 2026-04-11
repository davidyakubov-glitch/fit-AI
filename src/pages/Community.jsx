import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

import CommunityFeed from '../components/community/CommunityFeed';
import ChallengesLeaderboard from '../components/community/ChallengesLeaderboard';
import ShareTemplateModal from '../components/community/ShareTemplateModal';

import { useAuthUser } from '../lib/useAuthUser';

export default function Community() {
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const user = useAuthUser();

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-2xl mx-auto p-4">
          <div className="p-6 text-sm text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-2xl mx-auto p-4">
          <div className="p-6 text-sm text-gray-500">
            Please sign in to access the Community
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-7 w-7 text-purple-600" />
              Community
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Share workouts, compete, and get inspired
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="feed">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4">
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <ChallengesLeaderboard />
          </TabsContent>
        </Tabs>

        {/* Modal */}
        {showTemplateModal && (
          <ShareTemplateModal
            open={showTemplateModal}
            onClose={() => setShowTemplateModal(false)}
          />
        )}
      </div>
    </div>
  );
}