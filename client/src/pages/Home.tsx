import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calculator, Landmark, Megaphone, FileText, GraduationCap,
  Newspaper, BookOpen, ArrowRight, TrendingUp, DollarSign,
  BarChart3, Wrench, MapPin, Layers
} from 'lucide-react';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/X2mbdSBH7FFfDzhrqRzFf2/sandbox/zKWPwM8kWvCMfUkxG9CWgB-img-1_1771972190000_na1fn_aGVyby1yZW5vdmF0aW9u.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWDJtYmRTQkg3RkZmRHpocnFSekZmMi9zYW5kYm94L3pLV1B3TThrV3ZDTWZVa3hHOUNXZ0ItaW1nLTFfMTc3MTk3MjE5MDAwMF9uYTFmbl9hR1Z5YnkxeVpXNXZkbUYwYVc5dS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=KEIlWuGpETZNjtFQcGyQSbFkrMJ5~EWaW35l-VRByShs7StAk09cnnK-BLqv5oTDzyJ0LKRy7Zd3DLEXV4wqLlypP9HKmWDyq8uY9gGxpi7XDP17AtAIXV~h1g83-1zM30kDBoxW0CTpAdrdOad2d97ZUPKl5uDyJ1Z-ToGGBzU7mugkVlTkLt9pgi1Ht7eROx22Dktb5IN4BKUuJpG8V~XZccGbl7xJ3ZxK64zNDL0twxfv7fWCbw3LU3uEPXSpV8eC7GsvekkTYeqi-BzZ1FtmV0SauDZ7SOfuebFfwT3r0i7AWc7G8iB0GflTEBfreFJeYCTUPdTKYJI1T21gZg__';

const FEATURES = [
  {
    icon: Calculator,
    title: 'Deal Analyzer',
    desc: 'Real-time profitability calculations with deal scoring, ROI, and 70% rule analysis.',
    link: '/analyzer',
    color: 'oklch(0.50 0.18 25)',
  },
  {
    icon: Wrench,
    title: 'Rehab Estimator',
    desc: 'Room-by-room scope of work with material tiers (Rental, Standard, Luxury) and regional cost adjustments.',
    link: '/analyzer',
    color: 'oklch(0.55 0.15 40)',
  },
  {
    icon: BarChart3,
    title: 'Gantt Timeline',
    desc: 'Visual rehab timeline with phase dependencies, durations, and cost breakdowns.',
    link: '/analyzer',
    color: 'oklch(0.5 0.15 260)',
  },
  {
    icon: MapPin,
    title: 'Regional Pricing',
    desc: 'Labor and material costs auto-adjust based on the property market location.',
    link: '/analyzer',
    color: 'oklch(0.5 0.12 30)',
  },
  {
    icon: Landmark,
    title: 'Lender Directory',
    desc: 'Curated list of hard money and private lenders with rates, terms, and contact info.',
    link: '/lenders',
    color: 'oklch(0.45 0.12 250)',
  },
  {
    icon: Megaphone,
    title: 'Marketing Templates',
    desc: 'Direct mail letters, postcards, email sequences, and cold call scripts for acquisitions.',
    link: '/marketing',
    color: 'oklch(0.55 0.18 25)',
  },
  {
    icon: FileText,
    title: 'Contract Templates',
    desc: 'Assignable purchase agreements and wholesale contracts ready to customize.',
    link: '/contracts',
    color: 'oklch(0.45 0.12 200)',
  },
  {
    icon: GraduationCap,
    title: 'Investor Course',
    desc: 'Complete education on fix & flip, wholesaling, BRRRR, subject-to, and short-term rentals.',
    link: '/course',
    color: 'oklch(0.50 0.18 25)',
  },
  {
    icon: Newspaper,
    title: 'Investor Blog',
    desc: 'Market updates, strategy guides, and educational articles for real estate investors.',
    link: '/blog',
    color: 'oklch(0.5 0.12 250)',
  },
];

const STATS = [
  { value: '5', label: 'Exit Strategies', icon: Layers },
  { value: '50+', label: 'Metro Markets', icon: MapPin },
  { value: '3', label: 'Material Tiers', icon: Wrench },
  { value: '13', label: 'Rehab Phases', icon: BarChart3 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.02_25/0.92)] via-[oklch(0.15_0.02_25/0.8)] to-[oklch(0.15_0.02_25/0.5)]" />
        </div>
        <div className="container relative py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-sm mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real Estate Investment Platform</span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-5">
              Analyze Deals.<br />
              <span className="text-[oklch(0.85_0.15_25)]">Maximize Profit.</span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl">
              The complete fix & flip toolkit — from deal analysis and rehab estimation to marketing, contracts, 
              and education on every exit strategy. Built for investors who run on data, not guesswork.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/analyzer">
                <Button size="lg" className="gap-2 bg-[oklch(0.50_0.18_25)] hover:bg-[oklch(0.45_0.18_25)] text-white font-semibold px-6">
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
      <section className="bg-[oklch(0.97_0.005_25)] border-b border-border/50">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[oklch(0.50_0.18_25)]/10">
                    <Icon className="w-5 h-5 text-[oklch(0.50_0.18_25)]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
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
            A complete platform for real estate investors — analyze deals, estimate rehab costs, 
            find financing, create marketing campaigns, and learn proven strategies.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Link key={i} href={feat.link}>
                <Card className="h-full hover:shadow-lg transition-all group cursor-pointer border-border/60 hover:border-border">
                  <CardContent className="p-5">
                    <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: `${feat.color}15` }}>
                      <Icon className="w-5 h-5" style={{ color: feat.color }} />
                    </div>
                    <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[oklch(0.50_0.18_25)] text-white">
        <div className="container py-14 text-center">
          <DollarSign className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Ready to Analyze Your Next Deal?</h2>
          <p className="text-white/75 max-w-lg mx-auto mb-6">
            Enter a property address, add comps, estimate rehab costs, and get instant profitability analysis. 
            No signup required.
          </p>
          <Link href="/analyzer">
            <Button size="lg" className="gap-2 bg-white text-[oklch(0.3_0.15_25)] hover:bg-white/90 font-semibold px-8">
              <Calculator className="w-4.5 h-4.5" /> Open the Analyzer
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
