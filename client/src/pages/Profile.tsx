import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { toast } from 'sonner';
import {
  User, Building2, Phone, Mail, MapPin, Globe, Shield, Briefcase, Save,
  Loader2, Lock, CheckCircle2, Info
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface ProfileForm {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  website: string;
  licenseNumber: string;
  marketArea: string;
  yearsExperience: string;
}

const EMPTY_FORM: ProfileForm = {
  fullName: '',
  companyName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  website: '',
  licenseNumber: '',
  marketArea: '',
  yearsExperience: '',
};

export default function Profile() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [hasChanges, setHasChanges] = useState(false);

  const profileQuery = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const upsertMutation = trpc.profile.upsert.useMutation({
    onSuccess: () => {
      toast.success('Profile saved successfully!');
      setHasChanges(false);
      profileQuery.refetch();
    },
    onError: (err) => {
      toast.error('Failed to save profile: ' + err.message);
    },
  });

  // Load profile data into form
  useEffect(() => {
    if (profileQuery.data) {
      setForm({
        fullName: profileQuery.data.fullName || '',
        companyName: profileQuery.data.companyName || '',
        phone: profileQuery.data.phone || '',
        email: profileQuery.data.email || '',
        address: profileQuery.data.address || '',
        city: profileQuery.data.city || '',
        state: profileQuery.data.state || '',
        zip: profileQuery.data.zip || '',
        website: profileQuery.data.website || '',
        licenseNumber: profileQuery.data.licenseNumber || '',
        marketArea: profileQuery.data.marketArea || '',
        yearsExperience: profileQuery.data.yearsExperience || '',
      });
      setHasChanges(false);
    }
  }, [profileQuery.data]);

  // Pre-fill email from auth user if no profile exists yet
  useEffect(() => {
    if (user?.email && !profileQuery.data && !profileQuery.isLoading) {
      setForm(prev => ({ ...prev, email: prev.email || user.email || '' }));
    }
  }, [user, profileQuery.data, profileQuery.isLoading]);

  const updateField = useCallback((field: keyof ProfileForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    upsertMutation.mutate(form);
  }, [form, upsertMutation]);

  // Count filled fields
  const filledCount = Object.values(form).filter(v => v.trim() !== '').length;
  const totalFields = Object.keys(form).length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20 text-center">
          <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to manage your business profile.</p>
          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-14 text-center">
          <User className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Business Profile</h1>
          <p className="text-[oklch(0.6_0_0)] max-w-lg mx-auto">
            Enter your business information once. It will automatically fill in all bracketed fields
            across credibility packets, marketing templates, and other documents.
          </p>
        </div>
      </section>

      <section className="container py-8 max-w-3xl">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-[oklch(0.48_0.20_18)]/5 border border-[oklch(0.48_0.20_18)]/20 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-[oklch(0.48_0.20_18)] shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">How Auto-Fill Works</p>
            <p>
              Once you save your profile, all <code className="text-xs bg-secondary px-1 py-0.5 rounded">[Your Name]</code>,{' '}
              <code className="text-xs bg-secondary px-1 py-0.5 rounded">[Your Company Name]</code>,{' '}
              <code className="text-xs bg-secondary px-1 py-0.5 rounded">[Phone]</code>,{' '}
              <code className="text-xs bg-secondary px-1 py-0.5 rounded">[Email]</code>, and similar placeholders
              in Credibility Packets, Marketing Templates, and other documents will be replaced with your actual information.
            </p>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-[oklch(0.48_0.20_18)] transition-all duration-300"
              style={{ width: `${Math.round((filledCount / totalFields) * 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {filledCount}/{totalFields} fields
          </span>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-[oklch(0.48_0.20_18)]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold flex items-center gap-1">
                    Full Name
                    <span className="text-muted-foreground font-normal">→ [Your Name]</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Smith"
                    value={form.fullName}
                    onChange={e => updateField('fullName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                    <span className="text-muted-foreground font-normal">→ [Email]</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone
                    <span className="text-muted-foreground font-normal">→ [Phone]</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website" className="text-xs font-semibold flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Website
                    <span className="text-muted-foreground font-normal">→ [Your Website]</span>
                  </Label>
                  <Input
                    id="website"
                    placeholder="www.yourcompany.com"
                    value={form.website}
                    onChange={e => updateField('website', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-4.5 h-4.5 text-[oklch(0.48_0.20_18)]" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs font-semibold flex items-center gap-1">
                    Company Name
                    <span className="text-muted-foreground font-normal">→ [Your Company Name]</span>
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Freedom One Properties LLC"
                    value={form.companyName}
                    onChange={e => updateField('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="licenseNumber" className="text-xs font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" /> License #
                  </Label>
                  <Input
                    id="licenseNumber"
                    placeholder="RE-123456"
                    value={form.licenseNumber}
                    onChange={e => updateField('licenseNumber', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="marketArea" className="text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Market Area
                    <span className="text-muted-foreground font-normal">→ [Your Market Area]</span>
                  </Label>
                  <Input
                    id="marketArea"
                    placeholder="Greater Tampa Bay Area"
                    value={form.marketArea}
                    onChange={e => updateField('marketArea', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="yearsExperience" className="text-xs font-semibold flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Years of Experience
                    <span className="text-muted-foreground font-normal">→ [X] years</span>
                  </Label>
                  <Input
                    id="yearsExperience"
                    placeholder="5"
                    value={form.yearsExperience}
                    onChange={e => updateField('yearsExperience', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-[oklch(0.48_0.20_18)]" />
                Business Address
                <span className="text-sm font-normal text-muted-foreground">→ [Your Address]</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, Suite 100"
                  value={form.address}
                  onChange={e => updateField('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold">City</Label>
                  <Input
                    id="city"
                    placeholder="Tampa"
                    value={form.city}
                    onChange={e => updateField('city', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-xs font-semibold">State</Label>
                  <Input
                    id="state"
                    placeholder="FL"
                    value={form.state}
                    onChange={e => updateField('state', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zip" className="text-xs font-semibold">ZIP</Label>
                  <Input
                    id="zip"
                    placeholder="33601"
                    value={form.zip}
                    onChange={e => updateField('zip', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {profileQuery.data?.updatedAt && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  Last saved: {new Date(profileQuery.data.updatedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                  })}
                </span>
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={upsertMutation.isPending || !hasChanges}
              className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white px-8"
            >
              {upsertMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Profile
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
