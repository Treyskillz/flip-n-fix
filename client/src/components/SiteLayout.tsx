import { Link, useLocation } from 'wouter';
import {
  Calculator, Landmark, Megaphone, FileText, GraduationCap,
  Newspaper, BookOpen, Menu, X, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/analyzer', label: 'Analyzer', icon: Calculator },
  { path: '/lenders', label: 'Lenders', icon: Landmark },
  { path: '/marketing', label: 'Marketing', icon: Megaphone },
  { path: '/contracts', label: 'Contracts', icon: FileText },
  { path: '/course', label: 'Course', icon: GraduationCap },
  { path: '/blog', label: 'Blog', icon: Newspaper },
  { path: '/manual', label: 'Manual', icon: BookOpen },
] as const;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/50">
        <div className="container flex items-center h-14 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 no-underline">
            <div className="w-8 h-8 rounded-lg bg-[oklch(0.50_0.18_25)] flex items-center justify-center">
              <Calculator className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight hidden sm:inline">FlipAnalyzer</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
              return (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
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
            className="lg:hidden ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background">
            <nav className="container py-2 space-y-0.5">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
                return (
                  <Link key={item.path} href={item.path} onClick={closeMobile}>
                    <button
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
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

      {/* Footer */}
      <footer className="border-t border-border/50 bg-secondary/30">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[oklch(0.50_0.18_25)] flex items-center justify-center">
              <Calculator className="w-3 h-3 text-white" />
            </div>
            <span>FlipAnalyzer &mdash; Real Estate Investment Platform</span>
          </div>
          <p className="text-xs">For educational purposes. Not financial or legal advice. Consult professionals before investing.</p>
        </div>
      </footer>
    </div>
  );
}
