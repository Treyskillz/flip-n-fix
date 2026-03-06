import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import {
  X, ChevronRight, ChevronLeft, Sparkles, Calculator, ClipboardList,
  FileText, Megaphone, Landmark, GraduationCap, TrendingUp, Building2,
  Palette, BarChart3, Download, Crown, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';

// ─── Tour Steps per Tier ────────────────────────────────────
interface TourStep {
  title: string;
  description: string;
  icon: typeof Calculator;
  link?: string;
  highlight?: string;
}

const FREE_STEPS: TourStep[] = [
  {
    title: 'Deal Analyzer',
    description: 'Analyze any fix & flip deal with the 70% Rule, rehab estimates, and profit projections. You get 3 analyses per month on the Free plan.',
    icon: Calculator,
    link: '/analyzer',
  },
  {
    title: 'Marketing Templates',
    description: 'Browse professional direct mail letters, postcards, and email sequences for property acquisitions. View-only on the Free plan.',
    icon: Megaphone,
    link: '/marketing',
  },
  {
    title: 'Blog & Education',
    description: 'Read expert articles on fix & flip strategies, market analysis, and investment tips.',
    icon: GraduationCap,
    link: '/blog',
  },
  {
    title: 'Upgrade for More',
    description: 'Unlock unlimited deals, rehab estimator, SOW templates, contracts, lender directory, and much more with Pro.',
    icon: Crown,
    link: '/pricing',
    highlight: 'Upgrade to Pro for $99/mo',
  },
];

const PRO_STEPS: TourStep[] = [
  {
    title: 'Unlimited Deal Analysis',
    description: 'Save unlimited deals with full rehab estimation using real Home Depot SKU pricing. No more monthly limits.',
    icon: Calculator,
    link: '/analyzer',
  },
  {
    title: 'SOW Templates (14 Rooms)',
    description: 'Professional scope of work templates for every room — kitchen, bath, bedroom, landscaping, and more. Print or download.',
    icon: ClipboardList,
    link: '/scope-of-work',
  },
  {
    title: 'Investor Reports',
    description: 'Generate professional PDF reports with property details, comp analysis, rehab breakdown, and deal scoring to share with partners.',
    icon: FileText,
    link: '/analyzer',
  },
  {
    title: 'Contract & Marketing Templates',
    description: 'Download assignable purchase agreements, wholesale contracts, direct mail letters, and cold call scripts.',
    icon: Megaphone,
    link: '/contracts',
  },
  {
    title: 'Lender Directory',
    description: 'Access our curated list of hard money and private lenders with rates, terms, and direct contact info.',
    icon: Landmark,
    link: '/lenders',
  },
  {
    title: 'Regional Cost Adjustments',
    description: 'Labor and material costs auto-adjust based on 50+ metro market locations across the U.S.',
    icon: TrendingUp,
    link: '/analyzer',
  },
];

const ELITE_STEPS: TourStep[] = [
  {
    title: 'Everything in Pro, Plus...',
    description: 'You have full access to all Pro features — unlimited deals, SOW templates, investor reports, contracts, and more.',
    icon: CheckCircle2,
  },
  {
    title: 'Profit Calculator (6 Scenarios)',
    description: 'Model Fix & Flip, Wholesale, BRRRR, Subject-To, Short-Term Rental, and Seller Finance — all from one deal.',
    icon: TrendingUp,
    link: '/profit-calculator',
  },
  {
    title: 'Full Course Access',
    description: '8 comprehensive modules covering every exit strategy, plus bonus content on market analysis and deal sourcing.',
    icon: GraduationCap,
    link: '/course',
  },
  {
    title: 'Property Listings',
    description: 'List your properties for sale with photo galleries, features, and status tracking.',
    icon: Building2,
    link: '/listings',
  },
  {
    title: 'Gantt Chart Export',
    description: 'Export your rehab timeline as a professional PDF with phase bars, costs, and project summary.',
    icon: Download,
    link: '/analyzer',
  },
  {
    title: 'Priority Support',
    description: 'You have priority support status — look for the badge in the header. Your requests are handled first.',
    icon: Zap,
    highlight: 'Priority Support Active',
  },
];

const TEAM_STEPS: TourStep[] = [
  {
    title: 'Everything in Elite, Plus...',
    description: 'You have full access to all Elite features — Profit Calculator, Course, Listings, Gantt Export, and Priority Support.',
    icon: CheckCircle2,
  },
  {
    title: 'White-Label Branding',
    description: 'Upload your logo, set your brand color, and add your contact info. All reports, PDFs, and shared pages will use YOUR branding.',
    icon: Palette,
    link: '/white-label',
    highlight: 'Set up your branding now',
  },
  {
    title: 'AI Deal Summary Generator',
    description: 'One-click AI-powered professional deal analysis. Get an investor-ready narrative summary for any saved deal.',
    icon: Sparkles,
    link: '/saved-deals',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Portfolio performance charts showing ROI trends, deal velocity, profit tracking, and score distributions.',
    icon: BarChart3,
    link: '/analytics',
  },
  {
    title: 'Deal Comparison Reports',
    description: 'Select 2-6 deals and generate a branded side-by-side comparison PDF with automatic best-value highlighting.',
    icon: FileText,
    link: '/saved-deals',
    highlight: 'Select deals → Compare',
  },
  {
    title: 'Full Database Export',
    description: 'Export all your saved deals to CSV with one click — perfect for spreadsheet analysis or backup.',
    icon: Download,
    link: '/saved-deals',
  },
];

function getStepsForPlan(plan: string): TourStep[] {
  switch (plan) {
    case 'team': return TEAM_STEPS;
    case 'elite': return ELITE_STEPS;
    case 'pro': return PRO_STEPS;
    default: return FREE_STEPS;
  }
}

function getPlanLabel(plan: string): string {
  switch (plan) {
    case 'team': return 'Team';
    case 'elite': return 'Elite';
    case 'pro': return 'Pro';
    default: return 'Free';
  }
}

function getPlanColor(plan: string): string {
  switch (plan) {
    case 'team': return '#10b981';
    case 'elite': return '#a855f7';
    case 'pro': return '#c53030';
    default: return '#3b82f6';
  }
}

// ─── Local Storage Key ──────────────────────────────────────
const TOUR_SEEN_KEY = 'freedom-one-subscription-tour-seen';

function getTourSeen(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(TOUR_SEEN_KEY) || '{}');
  } catch {
    return {};
  }
}

function setTourSeen(plan: string) {
  const seen = getTourSeen();
  seen[plan] = true;
  localStorage.setItem(TOUR_SEEN_KEY, JSON.stringify(seen));
}

// ─── Main Component ─────────────────────────────────────────
export default function SubscriptionTour() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: subStatus, isLoading: subLoading } = trpc.subscription.status.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const [, navigate] = useLocation();

  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const plan = subStatus?.plan || 'free';
  const steps = getStepsForPlan(plan);
  const planLabel = getPlanLabel(plan);
  const planColor = getPlanColor(plan);

  // Show tour if user hasn't seen it for this plan
  useEffect(() => {
    if (authLoading || subLoading || !isAuthenticated || dismissed) return;
    // Don't show for admin — they know the system
    if (user?.role === 'admin') return;
    const seen = getTourSeen();
    if (!seen[plan]) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [plan, authLoading, subLoading, isAuthenticated, dismissed, user]);

  const handleDismiss = useCallback(() => {
    setTourSeen(plan);
    setVisible(false);
    setDismissed(true);
  }, [plan]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleDismiss();
    }
  }, [currentStep, steps.length, handleDismiss]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  }, [currentStep]);

  const handleGoTo = useCallback((link: string) => {
    handleDismiss();
    navigate(link);
  }, [handleDismiss, navigate]);

  if (!visible || !isAuthenticated) return null;

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={handleDismiss}
      />

      {/* Tour Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg bg-[oklch(0.14_0_0)] border border-[oklch(0.3_0_0)] rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div className="h-1 bg-[oklch(0.2_0_0)]">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, background: planColor }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: `${planColor}22`, color: planColor, border: `1px solid ${planColor}44` }}
              >
                Welcome to {planLabel}
              </span>
              <span className="text-xs text-[oklch(0.5_0_0)]">
                {currentStep + 1} of {steps.length}
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-white/10 text-[oklch(0.5_0_0)] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 p-3 rounded-xl"
                style={{ background: `${planColor}15`, border: `1px solid ${planColor}30` }}
              >
                <Icon className="w-7 h-7" style={{ color: planColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[oklch(0.65_0_0)] leading-relaxed">{step.description}</p>
                {step.highlight && (
                  <div
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: `${planColor}20`, color: planColor, border: `1px solid ${planColor}40` }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {step.highlight}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-6 pb-5 gap-3">
            <div className="flex items-center gap-2">
              {step.link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)] hover:text-white hover:bg-white/5"
                  onClick={() => handleGoTo(step.link!)}
                >
                  Go There <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-[oklch(0.6_0_0)] hover:text-white hover:bg-white/5"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back
                </Button>
              )}
              <Button
                size="sm"
                className="gap-1.5 text-xs font-semibold text-white"
                style={{ background: planColor }}
                onClick={handleNext}
              >
                {isLast ? 'Get Started' : 'Next'}
                {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          {/* Step Dots */}
          <div className="flex items-center justify-center gap-1.5 pb-4">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i === currentStep ? planColor : 'oklch(0.3 0 0)',
                  transform: i === currentStep ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Hook to manually trigger the subscription tour (e.g., from a "Take Tour" button in Profile)
 */
export function useSubscriptionTourTrigger() {
  const resetTour = useCallback((plan?: string) => {
    if (plan) {
      const seen = getTourSeen();
      delete seen[plan];
      localStorage.setItem(TOUR_SEEN_KEY, JSON.stringify(seen));
    } else {
      localStorage.removeItem(TOUR_SEEN_KEY);
    }
    window.location.reload();
  }, []);

  return { resetTour };
}
