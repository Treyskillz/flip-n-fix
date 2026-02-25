import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calculator, Landmark, Megaphone, FileText, GraduationCap,
  Newspaper, BookOpen, ArrowRight, TrendingUp, DollarSign,
  BarChart3, Wrench, MapPin, Layers, Building2, ClipboardList
} from 'lucide-react';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/X2mbdSBH7FFfDzhrqRzFf2/sandbox/zKWPwM8kWvCMfUkxG9CWgB-img-1_1771972190000_na1fn_aGVyby1yZW5vdmF0aW9u.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWDJtYmRTQkg3RkZmRHpocnFSekZmMi9zYW5kYm94L3pLV1B3TThrV3ZDTWZVa3hHOUNXZ0ItaW1nLTFfMTc3MTk3MjE5MDAwMF9uYTFmbl9hR1Z5YnkxeVpXNXZkbUYwYVc5dS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=KEIlWuGpETZNjtFQcGyQSbFkrMJ5~EWaW35l-VRByShs7StAk09cnnK-BLqv5oTDzyJ0LKRy7Zd3DLEXV4wqLlypP9HKmWDyq8uY9gGxpi7XDP17AtAIXV~h1g83-1zM30kDBoxW0CTpAdrdOad2d97ZUPKl5uDyJ1Z-ToGGBzU7mugkVlTkLt9pgi1Ht7eROx22Dktb5IN4BKUuJpG8V~XZccGbl7xJ3ZxK64zNDL0twxfv7fWCbw3LU3uEPXSpV8eC7GsvekkTYeqi-BzZ1FtmV0SauDZ7SOfuebFfwT3r0i7AWc7G8iB0GflTEBfreFJeYCTUPdTKYJI1T21gZg__';
const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

const FEATURES = [
  {
    icon: Calculator,
    title: 'Deal Analyzer',
    desc: 'Real-time profitability calculations with deal scoring, adjustable ROI targets, and 70% rule analysis.',
    link: '/analyzer',
  },
  {
    icon: Wrench,
    title: 'Rehab Estimator',
    desc: 'Room-by-room condition assessment with material tiers (Rental, Standard, Luxury) and Home Depot pricing.',
    link: '/analyzer',
  },
  {
    icon: ClipboardList,
    title: 'SOW Templates',
    desc: 'Professional scope of work templates for every room — kitchen, bath, bedroom, landscaping, and more.',
    link: '/scope-of-work',
  },
  {
    icon: MapPin,
    title: 'Regional Pricing',
    desc: 'Labor and material costs auto-adjust based on 50+ metro market locations across the U.S.',
    link: '/analyzer',
  },
  {
    icon: Landmark,
    title: 'Lender Directory',
    desc: 'Curated list of hard money and private lenders with rates, terms, and direct contact info.',
    link: '/lenders',
  },
  {
    icon: Megaphone,
    title: 'Marketing Templates',
    desc: 'Direct mail letters, postcards, email sequences, and cold call scripts for property acquisitions.',
    link: '/marketing',
  },
  {
    icon: FileText,
    title: 'Contract Templates',
    desc: 'Assignable purchase agreements and wholesale contracts with "and/or assigns" language.',
    link: '/contracts',
  },
  {
    icon: GraduationCap,
    title: 'Investor Course',
    desc: 'Complete education on fix & flip, wholesaling, BRRRR, subject-to, and short-term rentals.',
    link: '/course',
  },
  {
    icon: Building2,
    title: 'Property Listings',
    desc: 'List your properties for sale with photo galleries, features, and status tracking.',
    link: '/listings',
  },
];

const STATS = [
  { value: '5', label: 'Exit Strategies', icon: Layers },
  { value: '50+', label: 'Metro Markets', icon: MapPin },
  { value: '3', label: 'Material Tiers', icon: Wrench },
  { value: '14', label: 'Room Categories', icon: BarChart3 },
];

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Freedom One branded */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0_0/0.65)] via-[oklch(0.08_0_0/0.45)] to-[oklch(0.08_0_0/0.20)]" />
        </div>
        <div className="container relative py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-sm mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real Estate Investment System</span>
            </div>
            <img src={LOGO_URL} alt="Freedom One" className="h-20 lg:h-28 object-contain mb-6" />
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-5">
              Analyze Deals. Estimate Rehabs.<br />
              <span className="text-[oklch(0.70_0.18_18)]">Maximize Profit.</span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl">
              The complete real estate investing system — from deal analysis and rehab estimation to marketing, 
              contracts, and education on every exit strategy. Built for investors who run on data, not guesswork.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/analyzer">
                <Button size="lg" className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-semibold px-6">
                  <Calculator className="w-4.5 h-4.5" /> Launch Analyzer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/course">
                <Button size="lg" variant="outline" className="gap-2 border-white/25 text-white hover:bg-white/10 font-semibold px-6">
                  <GraduationCap className="w-4.5 h-4.5" /> Start Course
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[oklch(0.15_0_0)] border-b border-[oklch(0.25_0_0)]">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/15">
                    <Icon className="w-5 h-5 text-[oklch(0.65_0.18_18)]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-white">{stat.value}</p>
                    <p className="text-xs text-[oklch(0.55_0_0)]">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Everything You Need to Invest Smarter</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A complete system for real estate investors — analyze deals, estimate rehab costs, 
            find financing, create marketing campaigns, and learn proven strategies.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Link key={i} href={feat.link}>
                <Card className="h-full hover:shadow-lg transition-all group cursor-pointer border-border/60 hover:border-[oklch(0.48_0.20_18)]/30">
                  <CardContent className="p-5">
                    <div className="p-2 rounded-lg w-fit mb-3 bg-[oklch(0.48_0.20_18)]/10">
                      <Icon className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
                    </div>
                    <h3 className="font-bold text-base mb-1.5 group-hover:text-[oklch(0.48_0.20_18)] transition-colors">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-14 text-center">
          <DollarSign className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Ready to Analyze Your Next Deal?</h2>
          <p className="text-[oklch(0.6_0_0)] max-w-lg mx-auto mb-6">
            Enter a property address, add comps, estimate rehab costs, and get instant profitability analysis. 
            No signup required.
          </p>
          <Link href="/analyzer">
            <Button size="lg" className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-semibold px-8">
              <Calculator className="w-4.5 h-4.5" /> Open the Analyzer
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
