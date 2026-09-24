import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionCard({ isSubscribed, onSubscribe }) {
  const handleSubscribe = () => {
    toast.info('Payment processing requires backend functions to be enabled. Enable them in Dashboard → Settings.');
  };

  if (isSubscribed) return null;

  return (
    <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className="bg-yellow-400 text-yellow-900 font-bold mb-2">PRO PLAN</Badge>
            <h3 className="text-xl font-bold">Unlock AI Workouts</h3>
            <p className="text-purple-200 text-sm mt-1">Personalized plans generated just for you</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold">$10</div>
            <div className="text-purple-200 text-sm">/month</div>
          </div>
        </div>

        <ul className="space-y-2 mb-5">
          {[
            'AI-generated personalized workout plans',
            'Goal-based training (strength, weight loss, endurance)',
            'Equipment-aware exercise selection',
            'Unlimited plan generations',
            'Live camera feed with real-time AI form analysis'
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-300 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={handleSubscribe}
          className="w-full bg-white text-purple-700 hover:bg-purple-50 font-bold"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Subscribe for $10/month
        </Button>

        <p className="text-center text-purple-300 text-xs mt-3">Cancel anytime · No hidden fees</p>
      </CardContent>
    </Card>
  );
}
