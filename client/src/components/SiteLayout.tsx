import { Link, useLocation } from 'wouter';
import {
  Calculator, Landmark, Megaphone, FileText, GraduationCap,
  Newspaper, BookOpen, Menu, X, Home, Building2, ClipboardList, Save, Shield, CreditCard,
  Wrench, MapPin, Award, CheckSquare, HelpCircle, ChevronDown, Zap, Paintbrush, BarChart3,
  Kanban, TrendingUp, Briefcase, DollarSign, Hammer, Palette, Crown, Headphones, Package, Gift, LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

// Main Freedom One logo (shield + red text, transparent background)
const MAIN_LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/logo-transparent-black_1d2d479c.png";

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
}

const PRIMARY_NAV: NavItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/analyzer', label: 'Analyzer', icon: Calculator },
  { path: '/quick-check', label: 'Quick Check', icon: Zap },
  { path: '/scope-of-work', label: 'SOW', icon: ClipboardList },
  { path: '/course', label: 'Course', icon: GraduationCap },
  { path: '/renovation-designer', label: 'Designer', icon: Paintbrush },
  { path: '/profit-calculator', label: 'Profit Calc', icon: TrendingUp },
  { path: '/pipeline', label: 'Pipeline', icon: Kanban },
  { path: '/portfolio', label: 'Portfolio', icon: BarChart3 },
  { path: '/pricing', label: 'Pricing', icon: CreditCard },
];

const RESOURCES_NAV: NavItem[] = [
  { path: '/lenders', label: 'Lender Directory', icon: Landmark },
  { path: '/marketing', label: 'Marketing Templates', icon: Megaphone },
  { path: '/contracts', label: 'Contract Templates', icon: FileText },
  { path: '/price-reduction-form', label: 'Price Reduction Form', icon: FileText },
  { path: '/private-money-prospectus', label: 'Private Money Prospectus', icon: DollarSign },
  { path: '/3-option-brochure', label: '3-Option Brochure', icon: Briefcase },
  { path: '/rehab-budget', label: 'Rehab Budget Worksheet', icon: Hammer },
  { path: '/local-pricing', label: 'Local Area Pricing', icon: MapPin },
  { path: '/profit-calc-guide', label: 'Profit Calc Guide', icon: BookOpen },
  { path: '/checklists', label: 'Investor Checklists', icon: CheckSquare },
  { path: '/credibility-packets', label: 'Credibility Packets', icon: Award },
  { path: '/state-guide', label: 'State Reference Guide', icon: MapPin },
  { path: '/contractors', label: 'Contractor System', icon: Wrench },
  { path: '/listings', label: 'Property Listings', icon: Building2 },
  { path: '/blog', label: 'Blog', icon: Newspaper },
  { path: '/manual', label: 'Manual', icon: BookOpen },
  { path: '/saved-deals', label: 'Saved Deals', icon: Save },
  { path: '/support', label: 'Support', icon: HelpCircle },
  { path: '/profile', label: 'My Profile', icon: Shield },
  { path: '/white-label', label: 'White-Label Branding', icon: Palette },
  { path: '/material-costs', label: 'Material Cost Tracker', icon: LineChart },
  { path: '/analytics', label: 'Analytics Dashboard', icon: BarChart3 },
];

const ADMIN_NAV: NavItem[] = [
  { path: '/admin/product-catalog', label: 'Product Catalog', icon: Package },
  { path: '/admin/blog', label: 'Blog Manager', icon: Newspaper },
  { path: '/admin/gifted-subs', label: 'Gifted Subscriptions', icon: Gift },
];

const ALL_NAV = [...PRIMARY_NAV, ...RESOURCES_NAV];

function ResourcesDropdown({ location }: { location: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isResourceActive = RESOURCES_NAV.some(item => location === item.path || (item.path !== '/' && location.startsWith(item.path)));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
          isResourceActive
            ? 'bg-[oklch(0.48_0.20_18)]/20 text-[oklch(0.65_0.18_18)] font-medium'
            : 'text-[oklch(0.6_0_0)] hover:text-white hover:bg-white/10'
        }`}
      >
        Resources
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-[oklch(0.18_0_0)] border border-[oklch(0.3_0_0)] rounded-lg shadow-xl py-1 z-50">
          {RESOURCES_NAV.map(item => {
            const Icon = item.icon;
            const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path} onClick={() => setOpen(false)}>
                <button
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-[oklch(0.48_0.20_18)]/20 text-[oklch(0.65_0.18_18)] font-medium'
                      : 'text-[oklch(0.6_0_0)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminDropdown({ location }: { location: string }) {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isAuthenticated || !user || user.role !== 'admin') return null;

  const isAdminActive = ADMIN_NAV.some(item => location === item.path || location.startsWith(item.path));

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
          isAdminActive
            ? 'bg-amber-500/20 text-amber-400 font-medium'
            : 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10'
        }`}
      >
        <Crown className="w-3.5 h-3.5" />
        Admin
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-52 bg-[oklch(0.18_0_0)] border border-amber-500/30 rounded-lg shadow-xl py-1 z-50">
          {ADMIN_NAV.map(item => {
            const Icon = item.icon;
            const isActive = location === item.path || location.startsWith(item.path);
            return (
              <Link key={item.path} href={item.path} onClick={() => setOpen(false)}>
                <button
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 font-medium'
                      : 'text-[oklch(0.6_0_0)] hover:text-amber-400 hover:bg-amber-500/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminMobileNav({ closeMobile, location }: { closeMobile: () => void; location: string }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user || user.role !== 'admin') return null;

  return (
    <>
      <p className="text-[10px] uppercase tracking-wider text-amber-400/60 px-3 pt-3 pb-1">Admin</p>
      {ADMIN_NAV.map(item => {
        const Icon = item.icon;
        const isActive = location === item.path || location.startsWith(item.path);
        return (
          <Link key={item.path} href={item.path} onClick={closeMobile}>
            <button
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 font-medium'
                  : 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          </Link>
        );
      })}
    </>
  );
}

function UserBadges() {
  const { user, isAuthenticated } = useAuth();
  const subQuery = trpc.subscription.status.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  if (!isAuthenticated || !user) return null;

  const isAdmin = user.role === 'admin';
  const plan = subQuery.data?.plan || 'free';
  const isEliteOrAbove = plan === 'elite' || plan === 'team';

  return (
    <div className="hidden lg:flex items-center gap-1.5">
      {isAdmin && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Crown className="w-3 h-3" /> Admin
        </span>
      )}
      {isEliteOrAbove && !isAdmin && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
          <Headphones className="w-3 h-3" /> Priority Support
        </span>
      )}
      {plan !== 'free' && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          plan === 'team' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          plan === 'elite' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        }`}>
          {plan}
        </span>
      )}
    </div>
  );
}

const SubscriptionTour = lazy(() => import('./SubscriptionTour'));

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav - Freedom One branded */}
      <header className="sticky top-0 z-50 bg-[oklch(0.15_0_0)]/98 backdrop-blur supports-[backdrop-filter]:bg-[oklch(0.15_0_0)]/95 border-b border-[oklch(0.3_0_0)]">
        <div className="container flex items-center h-20 gap-4">
          {/* Main Logo */}
          <Link href="/" className="shrink-0 no-underline">
            <img
              src={MAIN_LOGO_URL}
              alt="Freedom One - System of Real Estate Investing"
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {PRIMARY_NAV.map(item => {
              const Icon = item.icon;
              const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
              return (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                      isActive
                        ? 'bg-[oklch(0.48_0.20_18)]/20 text-[oklch(0.65_0.18_18)] font-medium'
                        : 'text-[oklch(0.6_0_0)] hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                </Link>
              );
            })}
            <ResourcesDropdown location={location} />
          </nav>

          {/* Admin Nav (desktop) */}
          <AdminDropdown location={location} />

          {/* User Badges */}
          <div className="hidden lg:flex items-center ml-auto">
            <UserBadges />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden ml-auto text-white hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[oklch(0.3_0_0)] bg-[oklch(0.15_0_0)] max-h-[70vh] overflow-y-auto">
            <nav className="container py-2 space-y-0.5">
              <p className="text-[10px] uppercase tracking-wider text-[oklch(0.4_0_0)] px-3 pt-2 pb-1">Main</p>
              {PRIMARY_NAV.map(item => {
                const Icon = item.icon;
                const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
                return (
                  <Link key={item.path} href={item.path} onClick={closeMobile}>
                    <button
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-[oklch(0.48_0.20_18)]/20 text-[oklch(0.65_0.18_18)] font-medium'
                          : 'text-[oklch(0.6_0_0)] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </Link>
                );
              })}
              <AdminMobileNav closeMobile={closeMobile} location={location} />
              <p className="text-[10px] uppercase tracking-wider text-[oklch(0.4_0_0)] px-3 pt-3 pb-1">Resources</p>
              {RESOURCES_NAV.map(item => {
                const Icon = item.icon;
                const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
                return (
                  <Link key={item.path} href={item.path} onClick={closeMobile}>
                    <button
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-[oklch(0.48_0.20_18)]/20 text-[oklch(0.65_0.18_18)] font-medium'
                          : 'text-[oklch(0.6_0_0)] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Subscription Onboarding Tour */}
      <Suspense fallback={null}>
        <SubscriptionTour />
      </Suspense>

      {/* Footer - Freedom One branded */}
      <footer className="border-t border-[oklch(0.4_0_0)] bg-[oklch(0.25_0_0)]">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={MAIN_LOGO_URL} alt="Freedom One" className="h-12 w-auto object-contain" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.7)) drop-shadow(0 0 4px rgba(255,255,255,0.9))' }} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[oklch(0.6_0_0)]">
                <Link href="/support" className="hover:text-[oklch(0.65_0.18_18)] transition-colors">Support</Link>
                <Link href="/pricing" className="hover:text-[oklch(0.65_0.18_18)] transition-colors">Pricing</Link>
                <Link href="/disclaimers" className="hover:text-[oklch(0.65_0.18_18)] transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Legal Disclaimers
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[oklch(0.55_0_0)]">
                <a href="mailto:trey@freedomoneproperties.com" className="hover:text-[oklch(0.65_0.18_18)] transition-colors">trey@freedomoneproperties.com</a>
                <a href="tel:831-498-6237" className="hover:text-[oklch(0.65_0.18_18)] transition-colors">831-498-6237</a>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[oklch(0.35_0_0)]">
            <p className="text-xs text-[oklch(0.5_0_0)]">For educational purposes only. Not financial or legal advice. Consult professionals before investing. &copy; {new Date().getFullYear()} Freedom One Properties.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
