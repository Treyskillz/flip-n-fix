import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Gift, Shield, Search, UserPlus, X, Clock, CheckCircle, XCircle,
  ArrowLeft, Crown, RefreshCw, Plus, Calendar, AlertTriangle
} from 'lucide-react';
import { Link } from 'wouter';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

const PLAN_COLORS: Record<string, string> = {
  pro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  elite: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  team: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const DURATION_OPTIONS = [
  { label: 'Permanent (Never Expires)', value: '0' },
  { label: '7 Days', value: '7' },
  { label: '14 Days', value: '14' },
  { label: '30 Days (1 Month)', value: '30' },
  { label: '60 Days (2 Months)', value: '60' },
  { label: '90 Days (3 Months)', value: '90' },
  { label: '180 Days (6 Months)', value: '180' },
  { label: '365 Days (1 Year)', value: '365' },
];

export default function AdminGiftedSubs() {
  const { user } = useAuth();

  const [showGrantForm, setShowGrantForm] = useState(false);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantPlan, setGrantPlan] = useState<'pro' | 'elite' | 'team'>('pro');
  const [grantDuration, setGrantDuration] = useState('30');
  const [grantReason, setGrantReason] = useState('');
  const [extendId, setExtendId] = useState<number | null>(null);
  const [extendDays, setExtendDays] = useState('30');

  const giftedList = trpc.giftedSubs.list.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });

  const grantMutation = trpc.giftedSubs.grant.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.plan.toUpperCase()} plan granted to ${data.userEmail}${data.expiresAt ? ` until ${new Date(data.expiresAt).toLocaleDateString()}` : ' (permanent)'}`);
      setShowGrantForm(false);
      setGrantEmail('');
      setGrantReason('');
      giftedList.refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const revokeMutation = trpc.giftedSubs.revoke.useMutation({
    onSuccess: () => {
      toast.success('The gifted subscription has been revoked.');
      giftedList.refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const extendMutation = trpc.giftedSubs.extend.useMutation({
    onSuccess: (data) => {
      toast.success(`Subscription extended — new expiration: ${new Date(data.newExpiresAt).toLocaleDateString()}`);
      setExtendId(null);
      giftedList.refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
            <Link href="/">
              <Button className="mt-4">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeGifts = giftedList.data?.filter(g => !g.revokedAt && (!g.expiresAt || new Date(g.expiresAt) > new Date())) || [];
  const expiredOrRevoked = giftedList.data?.filter(g => g.revokedAt || (g.expiresAt && new Date(g.expiresAt) <= new Date())) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-[oklch(0.25_0_0)]">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-white">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20">
                <Gift className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Gifted Subscriptions</h1>
                <p className="text-muted-foreground text-sm">Grant, manage, and revoke free subscriptions for users</p>
              </div>
            </div>
            <Button
              onClick={() => setShowGrantForm(true)}
              className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
            >
              <Plus className="w-4 h-4" /> Grant Subscription
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/15">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeGifts.length}</p>
                <p className="text-xs text-muted-foreground">Active Gifts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/15">
                <Crown className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeGifts.filter(g => g.plan === 'pro').length}</p>
                <p className="text-xs text-muted-foreground">Pro Gifts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/15">
                <Crown className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeGifts.filter(g => g.plan === 'elite').length}</p>
                <p className="text-xs text-muted-foreground">Elite Gifts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/15">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeGifts.filter(g => g.plan === 'team').length}</p>
                <p className="text-xs text-muted-foreground">Team Gifts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grant Form Modal */}
        {showGrantForm && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5 text-amber-400" />
                Grant Free Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>User Email *</Label>
                  <Input
                    placeholder="user@example.com"
                    value={grantEmail}
                    onChange={(e) => setGrantEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">The user must already have an account</p>
                </div>
                <div className="space-y-2">
                  <Label>Plan Tier *</Label>
                  <Select value={grantPlan} onValueChange={(v) => setGrantPlan(v as 'pro' | 'elite' | 'team')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pro">Pro — Full access to all tools</SelectItem>
                      <SelectItem value="elite">Elite — Pro + premium bonus modules</SelectItem>
                      <SelectItem value="team">Team — Everything + team features</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={grantDuration} onValueChange={setGrantDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reason (optional)</Label>
                  <Input
                    placeholder="e.g., Referral bonus, Contest winner, VIP..."
                    value={grantReason}
                    onChange={(e) => setGrantReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    if (!grantEmail) {
                      toast.error('Email is required');
                      return;
                    }
                    grantMutation.mutate({
                      userEmail: grantEmail,
                      plan: grantPlan,
                      durationDays: grantDuration === '0' ? undefined : parseInt(grantDuration),
                      reason: grantReason || undefined,
                    });
                  }}
                  disabled={grantMutation.isPending}
                  className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
                >
                  <Gift className="w-4 h-4" />
                  {grantMutation.isPending ? 'Granting...' : 'Grant Subscription'}
                </Button>
                <Button variant="outline" onClick={() => setShowGrantForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Gifted Subscriptions */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Active Gifted Subscriptions ({activeGifts.length})
          </h2>
          {activeGifts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Gift className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No active gifted subscriptions yet.</p>
                <p className="text-sm mt-1">Click "Grant Subscription" to gift access to a user.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeGifts.map((gift) => (
                <Card key={gift.id} className="border-[oklch(0.25_0_0)]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <Crown className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{gift.userName || 'Unknown User'}</span>
                            <Badge variant="outline" className={PLAN_COLORS[gift.plan]}>
                              {gift.plan.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{gift.userEmail}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Granted: {new Date(gift.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {gift.expiresAt
                                ? `Expires: ${new Date(gift.expiresAt).toLocaleDateString()}`
                                : 'Permanent'}
                            </span>
                            {gift.reason && (
                              <span className="text-[oklch(0.55_0_0)]">Reason: {gift.reason}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {extendId === gift.id ? (
                          <div className="flex items-center gap-2">
                            <Select value={extendDays} onValueChange={setExtendDays}>
                              <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7">+7 days</SelectItem>
                                <SelectItem value="14">+14 days</SelectItem>
                                <SelectItem value="30">+30 days</SelectItem>
                                <SelectItem value="90">+90 days</SelectItem>
                                <SelectItem value="365">+365 days</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => extendMutation.mutate({ id: gift.id, additionalDays: parseInt(extendDays) })}
                              disabled={extendMutation.isPending}
                              className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                            >
                              Extend
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setExtendId(null)} className="h-8 text-xs">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setExtendId(gift.id)}
                              className="h-8 text-xs gap-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Extend
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (confirm(`Revoke ${gift.plan.toUpperCase()} access for ${gift.userEmail}?`)) {
                                  revokeMutation.mutate({ id: gift.id });
                                }
                              }}
                              disabled={revokeMutation.isPending}
                              className="h-8 text-xs gap-1 text-red-400 border-red-500/30 hover:bg-red-500/10"
                            >
                              <XCircle className="w-3 h-3" /> Revoke
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Expired / Revoked */}
        {expiredOrRevoked.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-muted-foreground">
              <XCircle className="w-5 h-5" />
              Expired / Revoked ({expiredOrRevoked.length})
            </h2>
            <div className="space-y-2">
              {expiredOrRevoked.map((gift) => (
                <Card key={gift.id} className="border-[oklch(0.20_0_0)] opacity-60">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-[oklch(0.20_0_0)]">
                          <Crown className="w-4 h-4 text-[oklch(0.40_0_0)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{gift.userName || 'Unknown'}</span>
                            <Badge variant="outline" className="text-[10px] opacity-60">{gift.plan.toUpperCase()}</Badge>
                            <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/20">
                              {gift.revokedAt ? 'Revoked' : 'Expired'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{gift.userEmail}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {gift.revokedAt
                          ? `Revoked ${new Date(gift.revokedAt).toLocaleDateString()}`
                          : gift.expiresAt
                            ? `Expired ${new Date(gift.expiresAt).toLocaleDateString()}`
                            : ''}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Usage Tips */}
        <Card className="border-[oklch(0.25_0_0)]">
          <CardContent className="p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              How Gifted Subscriptions Work
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Granting Access</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>User must have an existing account (they need to sign up first)</li>
                  <li>Gifted access overrides their current plan if it's a higher tier</li>
                  <li>If they also have a paid Stripe subscription, they keep the higher of the two</li>
                  <li>Set "Permanent" for lifetime access or choose a duration</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Use Cases</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Lead Magnets:</strong> Gift 7-14 day Pro access for email signups</li>
                  <li><strong>Referral Rewards:</strong> Gift 30-day Elite access for referrals</li>
                  <li><strong>Contest Winners:</strong> Gift permanent Team access as prizes</li>
                  <li><strong>VIP Partners:</strong> Gift permanent Elite access to JV partners</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
