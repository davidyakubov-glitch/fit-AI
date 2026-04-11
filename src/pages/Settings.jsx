import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Copy, Users, DollarSign, Gift, CheckCircle2, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthUser } from '../lib/useAuthUser';

const COMMISSION_PER_REFERRAL = 2;

function generateCode(email = '') {
  const safeEmail = String(email).trim().toLowerCase();
  const base =
    safeEmail
      .split('@')[0]
      ?.replace(/[^a-z0-9]/gi, '')
      .toUpperCase()
      .slice(0, 6) || 'FITAI';

  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${base}${suffix}`;
}

export default function Referral() {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [applyCode, setApplyCode] = useState('');

  const user = useAuthUser();

  const {
    data: profiles = [],
    isLoading: isProfileLoading,
  } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () =>
      base44.entities.UserProfile.filter(
        { created_by: user.email },
        '-created_date',
        1
      ),
    enabled: !!user?.email,
  });

  const profile = profiles[0] || null;
  const myCode = profile?.referral_code || '';

  const {
    data: referrals = [],
    isLoading: isReferralsLoading,
  } = useQuery({
    queryKey: ['referrals', user?.email],
    queryFn: () =>
      base44.entities.Referral.filter(
        { referrer_email: user.email },
        '-created_date',
        50
      ),
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (!user?.email || isProfileLoading) return;

    const ensureProfile = async () => {
      try {
        if (profiles.length === 0) {
          await base44.entities.UserProfile.create({
            referral_code: generateCode(user.email),
          });
          await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
          return;
        }

        if (profile && !profile.referral_code) {
          await base44.entities.UserProfile.update(profile.id, {
            referral_code: generateCode(user.email),
          });
          await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        }
      } catch {
        toast.error('Could not prepare referral profile');
      }
    };

    ensureProfile();
  }, [user, profiles, profile, isProfileLoading, queryClient]);

  const applyMutation = useMutation({
    mutationFn: async (code) => {
      const normalizedCode = code.trim().toUpperCase();

      if (!normalizedCode) {
        throw new Error('Enter a referral code');
      }

      if (!user?.email) {
        throw new Error('You must be signed in');
      }

      const currentProfiles = await base44.entities.UserProfile.filter(
        { created_by: user.email },
        '-created_date',
        1
      );

      const currentProfile = currentProfiles[0] || null;

      if (!currentProfile) {
        throw new Error('Profile not ready yet. Please try again.');
      }

      if (currentProfile.referred_by) {
        throw new Error('A referral code has already been applied');
      }

      const allProfiles = await base44.entities.UserProfile.filter({}, '-created_date', 200);
      const referrerProfile = allProfiles.find(
        (item) => item.referral_code === normalizedCode
      );

      if (!referrerProfile) {
        throw new Error('Referral code not found');
      }

      if (referrerProfile.created_by === user.email) {
        throw new Error('Cannot use your own code');
      }

      const existingReferral = await base44.entities.Referral.filter(
        { referred_email: user.email },
        '-created_date',
        20
      );

      const alreadyUsed = existingReferral.some(
        (item) => item.referred_email === user.email
      );

      if (alreadyUsed) {
        throw new Error('You have already used a referral code');
      }

      await base44.entities.Referral.create({
        referrer_email: referrerProfile.created_by,
        referred_email: user.email,
        referral_code: normalizedCode,
        status: 'completed',
        commission_amount: COMMISSION_PER_REFERRAL,
        completed_date: new Date().toISOString(),
      });

      await base44.entities.UserProfile.update(referrerProfile.id, {
        referral_earnings:
          (referrerProfile.referral_earnings || 0) + COMMISSION_PER_REFERRAL,
      });

      await base44.entities.UserProfile.update(currentProfile.id, {
        referred_by: normalizedCode,
      });
    },
    onSuccess: async () => {
      toast.success('Referral code applied! Your friend earned $2.');
      setApplyCode('');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
        queryClient.invalidateQueries({ queryKey: ['referrals'] }),
      ]);
    },
    onError: (error) => {
      toast.error(error?.message || 'Could not apply code');
    },
  });

  const completedReferrals = referrals.filter(
    (item) => item.status === 'completed' || item.status === 'paid'
  );

  const totalEarned = Number(profile?.referral_earnings || 0);

  const copyCode = async () => {
    if (!myCode || typeof navigator === 'undefined' || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(myCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Code copied!');
    } catch {
      toast.error('Could not copy code');
    }
  };

  const shareLink = async () => {
    if (!myCode || typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const url = `${window.location.origin}?ref=${myCode}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join AI Fitness Coach',
          text: `Use my code ${myCode} to get started!`,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success('Share link copied!');
      } else {
        toast.error('Sharing is not supported on this device');
      }
    } catch {
      toast.error('Could not share referral link');
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-sm w-full text-center">
          <CardContent className="pt-8 pb-8">
            <Gift className="h-12 w-12 text-purple-400 mx-auto mb-3" />
            <p className="font-semibold text-gray-800">
              Sign in to access your referral dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isProfileLoading || isReferralsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Gift className="h-7 w-7 text-purple-600" />
            Referral Program
          </h1>
          <p className="text-gray-500 text-sm">
            Earn $2 for every friend you bring to AI Fitness Coach
          </p>
        </div>

        {/* Hero earnings card */}
        <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-0 shadow-xl">
          <CardContent className="pt-6 pb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <DollarSign className="h-6 w-6 mx-auto mb-1 text-purple-200" />
                <div className="text-3xl font-black">${totalEarned.toFixed(0)}</div>
                <div className="text-purple-200 text-xs">Total Earned</div>
              </div>
              <div>
                <Users className="h-6 w-6 mx-auto mb-1 text-purple-200" />
                <div className="text-3xl font-black">{completedReferrals.length}</div>
                <div className="text-purple-200 text-xs">Referrals</div>
              </div>
              <div>
                <Gift className="h-6 w-6 mx-auto mb-1 text-purple-200" />
                <div className="text-3xl font-black">$2</div>
                <div className="text-purple-200 text-xs">Per Referral</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My code */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
            <CardDescription>
              Share this code with friends. You earn $2 when they sign up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {myCode ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border-2 border-dashed border-purple-200 rounded-xl py-3 px-4 text-center">
                    <span className="text-2xl font-black tracking-widest text-purple-700">
                      {myCode}
                    </span>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={copyCode}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Button
                  type="button"
                  onClick={shareLink}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share My Code
                </Button>
              </>
            ) : (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Apply someone else's code */}
        {!profile?.referred_by && (
          <Card>
            <CardHeader>
              <CardTitle>Got a Referral Code?</CardTitle>
              <CardDescription>Enter a friend's code to give them credit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code (e.g. JOHN3X)"
                  value={applyCode}
                  onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
                  className="uppercase font-mono"
                  maxLength={10}
                />

                <Button
                  type="button"
                  onClick={() => applyMutation.mutate(applyCode)}
                  disabled={!applyCode.trim() || applyMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {applyMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {profile?.referred_by && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            You were referred using code{' '}
            <span className="font-bold">{profile.referred_by}</span>
          </div>
        )}

        {/* How it works */}
        <Card className="bg-purple-50 border-purple-100">
          <CardHeader>
            <CardTitle className="text-purple-900 text-base">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {[
                ['Share your code', 'Send your unique code to friends via any channel'],
                ['Friend signs up', 'They create an account and enter your code'],
                ['You earn $2', 'Commission is credited instantly to your balance'],
                ['Cash out', 'Request payout once you reach $10 (contact support)'],
              ].map(([title, desc], index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-purple-900 text-sm">{title}</div>
                    <div className="text-purple-700 text-xs">{desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Referral history */}
        {referrals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {referral.referred_email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {referral.completed_date
                          ? new Date(referral.completed_date).toLocaleDateString()
                          : 'Pending'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          referral.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }
                      >
                        {referral.status}
                      </Badge>
                      <span className="text-green-600 font-bold text-sm">
                        +${referral.commission_amount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}