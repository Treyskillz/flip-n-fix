import { Link, useLocation } from 'wouter';
import {
  Calculator, Landmark, Megaphone, FileText, GraduationCap,
  Newspaper, BookOpen, Menu, X, Home, Building2, ClipboardList, Save, Shield, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';

// Main Freedom One logo (shield + red text, transparent background)
const MAIN_LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/analyzer', label: 'Analyzer', icon: Calculator },
  { path: '/scope-of-work', label: 'SOW Templates', icon: ClipboardList },
  { path: '/lenders', label: 'Lenders', icon: Landmark },
  { path: '/marketing', label: 'Marketing', icon: Megaphone },
  { path: '/contracts', label: 'Contracts', icon: FileText },
  { path: '/course', label: 'Course', icon: GraduationCap },
  { path: '/blog', label: 'Blog', icon: Newspaper },
  { path: '/manual', label: 'Manual', icon: BookOpen },
  { path: '/listings', label: 'Listings', icon: Building2 },
  { path: '/saved-deals', label: 'Saved Deals', icon: Save },
  { path: '/pricing', label: 'Pricing', icon: CreditCard },
] as const;

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
            {NAV_ITEMS.map(item => {
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
          <div className="lg:hidden border-t border-[oklch(0.3_0_0)] bg-[oklch(0.15_0_0)]">
            <nav className="container py-2 space-y-0.5">
              {NAV_ITEMS.map(item => {
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
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <img src={MAIN_LOGO_URL} alt="Freedom One" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/disclaimers" className="text-xs text-[oklch(0.65_0_0)] hover:text-[oklch(0.65_0.18_18)] transition-colors flex items-center gap-1">
              <Shield className="w-3 h-3" /> Legal Disclaimers
            </Link>
            <p className="text-xs text-[oklch(0.65_0_0)]">For educational purposes only. Not financial or legal advice. Consult professionals before investing.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
