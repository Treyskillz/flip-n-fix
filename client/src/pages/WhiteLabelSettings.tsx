import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  Palette, Upload, Building2, Phone, Mail, Globe, Tag,
  Loader2, Save, CheckCircle2, Crown, Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const DEFAULT_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/logo-transparent-black_1d2d479c.png";

export default function WhiteLabelSettings() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: subStatus, isLoading: subLoading } = trpc.subscription.status.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: settings, isLoading: settingsLoading } = trpc.whiteLabel.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const [companyName, setCompanyName] = useState("");
  const [brandColor, setBrandColor] = useState("#c53030");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [tagline, setTagline] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form from existing settings
  useEffect(() => {
    if (settings && !initialized) {
      setCompanyName(settings.companyName || "");
      setBrandColor(settings.brandColor || "#c53030");
      setPhone(settings.phone || "");
      setEmail(settings.email || "");
      setWebsite(settings.website || "");
      setTagline(settings.tagline || "");
      setEnabled(settings.enabled === 1);
      if (settings.logoUrl) setLogoPreview(settings.logoUrl);
      setInitialized(true);
    }
  }, [settings, initialized]);

  const saveMutation = trpc.whiteLabel.save.useMutation({
    onSuccess: () => {
      toast.success("White-label settings saved!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save settings");
    },
  });

  const uploadLogoMutation = trpc.whiteLabel.uploadLogo.useMutation({
    onSuccess: (data) => {
      setLogoPreview(data.logoUrl);
      toast.success("Logo uploaded successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to upload logo");
    },
  });

  const handleSave = useCallback(() => {
    saveMutation.mutate({
      companyName,
      brandColor,
      phone,
      email,
      website,
      tagline,
      enabled,
    });
  }, [companyName, brandColor, phone, email, website, tagline, enabled, saveMutation]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadLogoMutation.mutate({
        fileName: file.name,
        base64Data: base64,
        contentType: file.type || "image/png",
      });
    };
    reader.readAsDataURL(file);
  }, [uploadLogoMutation]);

  const isTeam = user?.role === 'admin' || subStatus?.plan === "team";

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-20 text-center max-w-lg mx-auto">
        <Crown className="w-12 h-12 mx-auto mb-4 text-amber-500" />
        <h1 className="text-2xl font-bold mb-3">White-Label Branding</h1>
        <p className="text-muted-foreground mb-6">
          Sign in to access white-label branding settings.
        </p>
        <a href={getLoginUrl()}>
          <Button>Sign In</Button>
        </a>
      </div>
    );
  }

  if (!isTeam) {
    return (
      <div className="container py-20 text-center max-w-lg mx-auto">
        <Crown className="w-12 h-12 mx-auto mb-4 text-amber-500" />
        <h1 className="text-2xl font-bold mb-3">White-Label Branding</h1>
        <p className="text-muted-foreground mb-6">
          White-label branding is available exclusively on the <strong>Team plan</strong>.
          Replace the Freedom One branding with your own company logo, name, colors, and contact info
          on all investor reports, portfolio PDFs, and shared deal links.
        </p>
        <Link href="/pricing">
          <Button className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            <Crown className="w-4 h-4" /> Upgrade to Team Plan
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/15">
              <Palette className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold">White-Label Branding</h1>
          </div>
          <p className="text-muted-foreground">
            Customize your branding on investor reports, portfolio PDFs, and shared deal links.
            Your logo and company info will replace the default Freedom One branding.
          </p>
        </div>

        {/* Enable/Disable Toggle */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Enable White-Label Branding</p>
                <p className="text-sm text-muted-foreground">
                  When enabled, your custom branding appears on all reports and shared links.
                </p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              Company Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-secondary/30 overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs">No logo</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLogoMutation.isPending}
                  className="gap-2"
                >
                  {uploadLogoMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, SVG, or WebP. Max 2MB. Transparent background recommended.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="w-4 h-4 text-amber-500" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" /> Company Name
                </Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Investment Company LLC"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Tagline
                </Label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Your Trusted Investment Partner"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> Phone
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@yourcompany.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Globe className="w-3 h-3" /> Website
                </Label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Palette className="w-3 h-3" /> Brand Color
                </Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    placeholder="#c53030"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Report Header Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="rounded-lg p-6 text-white"
              style={{ backgroundColor: enabled ? brandColor : "#c53030" }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={enabled && logoPreview ? logoPreview : DEFAULT_LOGO}
                  alt="Logo"
                  className="h-12 object-contain bg-white/90 rounded-md p-1"
                />
                <div>
                  <h3 className="text-lg font-bold">
                    {enabled && companyName ? companyName : "Freedom One Properties"}
                  </h3>
                  {(enabled && tagline) && (
                    <p className="text-sm opacity-80">{tagline}</p>
                  )}
                  <div className="flex gap-4 text-xs opacity-70 mt-1">
                    {(enabled && phone) && <span>{phone}</span>}
                    {(enabled && email) && <span>{email}</span>}
                    {(enabled && website) && <span>{website}</span>}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This is how your branding will appear on investor reports, portfolio PDFs, and shared deal links.
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="w-full gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
          size="lg"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saveMutation.isSuccess ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saveMutation.isPending ? "Saving..." : saveMutation.isSuccess ? "Saved!" : "Save White-Label Settings"}
        </Button>
      </div>
    </div>
  );
}
