import { Link, useLocation } from 'wouter';
import {
  Calculator, Landmark, Megaphone, FileText, GraduationCap,
  Newspaper, BookOpen, Menu, X, Home, Building2, ClipboardList, Save, Shield, CreditCard,
  Wrench, MapPin, Award, CheckSquare, HelpCircle, ChevronDown, Zap, Paintbrush
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useRef, useEffect } from 'react';

// Main Freedom One logo (shield + red text, transparent background)
const MAIN_LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

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
  { path: '/pricing', label: 'Pricing', icon: CreditCard },
];

const RESOURCES_NAV: NavItem[] = [
  { path: '/lenders', label: 'Lender Directory', icon: Landmark },
  { path: '/marketing', label: 'Marketing Templates', icon: Megaphone },
  { path: '/contracts', label: 'Contract Templates', icon: FileText },
  { path: '/checklists', label: 'Investor Checklists', icon: CheckSquare },
  { path: '/credibility-packets', label: 'Credibility Packets', icon: Award },
  { path: '/state-guide', label: 'State Reference Guide', icon: MapPin },
  { path: '/contractors', label: 'Contractor System', icon: Wrench },
  { path: '/listings', label: 'Property Listings', icon: Building2 },
  { path: '/blog', label: 'Blog', icon: Newspaper },
  { path: '/manual', label: 'Manual', icon: BookOpen },
  { path: '/saved-deals', label: 'Saved Deals', icon: Save },
  { path: '/support', label: 'Support', icon: HelpCircle },
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

      {/* Footer - Freedom One branded */}
      <footer className="border-t border-[oklch(0.4_0_0)] bg-[oklch(0.25_0_0)]">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={MAIN_LOGO_URL} alt="Freedom One" className="h-12 w-auto object-contain" />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[oklch(0.6_0_0)]">
              <Link href="/support" className="hover:text-[oklch(0.65_0.18_18)] transition-colors">Support</Link>
              <Link href="/pricing" className="hover:text-[oklch(0.65_0.18_18)] transition-colors">Pricing</Link>
              <Link href="/disclaimers" className="hover:text-[oklch(0.65_0.18_18)] transition-colors flex items-center gap-1">
                <Shield className="w-3 h-3" /> Legal Disclaimers
              </Link>
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
