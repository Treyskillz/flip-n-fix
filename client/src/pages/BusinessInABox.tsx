import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import {
  Calculator, Wrench, ClipboardList, MapPin, Landmark, Megaphone, FileText,
  GraduationCap, CheckSquare, Award, DollarSign, BookOpen, Shield, TrendingUp,
  ArrowRight, Star, Check, Zap, ChevronDown, Package, Users, BarChart3, Play
} from 'lucide-react';
import { useState, useRef } from 'react';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

// Marketing video URLs from Colossyan
const BIB_VIDEO_URL = "https://d16jwoab4xr2kx.cloudfront.net/private/800d295a-986a-40d0-a501-9e67e268423e/videos/13a7ea42-b258-40d9-85f8-ce11eb7fb94a.mp4?Expires=2051222400000&Signature=CimgSXZdk7WeMGupsjff1SU7fJEazFE0fMMvfAjzvF32Tjs79e492B~UNj1PTco-Ps-UZhV3Sct0q3mHrnZbGZrMOdPOZ9SzVAmB5PzQS44aukHDrBt1KpZ3mq~zGcBKDZlfC1w~lKwjDHXIyaBZKWJvxr7tPepnE5Al9Fe5o9-8NW4nmLhqbKOLWnbrgXw-JH-Ff-Tgexwr3StNfpJ54ccQiX5SCWZxbjG6oq0BMBSeJcUVAmlaBfW-SVcAppo50at1XiRRpkkTgvhTh41jEJAdfX7torN7TtaLMRHu0EEbzFydqxhounw95kEdr0f8N5rF7SW5bwQsU2PuB03cjQ__&Key-Pair-Id=K1IMMQ2ZEMWY76";
const CONDENSED_DEMO_URL = "https://d16jwoab4xr2kx.cloudfront.net/private/800d295a-986a-40d0-a501-9e67e268423e/videos/c36fc4f8-2e95-4ae1-a7e1-d9813024b117.mp4?Expires=2051222400000&Signature=Y1NjYRMkT76Y41tJzyi1vxdtdbGipFx7BUWRQRMgEN5uFeMvpvPtSmcDv13NFjlrMb4aOQKfIXIBed2FK6CAg9T-vm~xNSRdwr31h7NLe-A~0NHAuEjEqjw6piEmXxwE8Bsezmq0l1VUsUAWzJ~7P3IOd3K2Y-w~pK1Na9fLKMqdcpnEgIX7FRQBuJt04kL04oSfHCg3dKa3CDre~~FnSt~zpGFPDj4lgljMeJO0QJ38JD35Ntf2ILAgXMj-qyN73Zc9CPXAuNUT1etqkzhq-kNzkiqkEyQ3t7QTntTPqAtWugDU6Mo9jOIXAP2dx2kHnxiaAgbtIVxl0U95wNHQdQ__&Key-Pair-Id=K1IMMQ2ZEMWY76";
const FULL_DEMO_URL = "https://d16jwoab4xr2kx.cloudfront.net/private/800d295a-986a-40d0-a501-9e67e268423e/videos/1a489eec-114f-4a2b-b0f4-b6d2d3588e9d.mp4?Expires=2051222400000&Signature=djSg2lWDQrkB99WxOicP-JLAS4qKcIFSMV49Ie08IkIEDY25w9E4Lnl4v9uabVwtn3hfDsYrMH5myIEPBouoGlRN680FyRBL5B6fkkDRWgHTypC-JN4M8g4Ik6iXnP~HBjJIecgPqLLls3IMZ~BPJYvBuVG1k1iFT0Dw6zz0p4nHww14U76RcntXskymhHVw7vR-1UuaAdE8hmXYgh~gjgpU~ZWG4yUOY~~EevLm3G3fAm32KS-THU2P6SMEb2mQC5Jbtc~J99vkR7ngC3Dv0j4Kllqb~V15UY8dhvZ7uKEr5JTuhHkXmRLQFIbTdQdg4V3HeAMcyKMz3wJlzapWxw__&Key-Pair-Id=K1IMMQ2ZEMWY76";
const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/X2mbdSBH7FFfDzhrqRzFf2/sandbox/zKWPwM8kWvCMfUkxG9CWgB-img-1_1771972190000_na1fn_aGVyby1yZW5vdmF0aW9u.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWDJtYmRTQkg3RkZmRHpocnFSekZmMi9zYW5kYm94L3pLV1B3TThrV3ZDTWZVa3hHOUNXZ0ItaW1nLTFfMTc3MTk3MjE5MDAwMF9uYTFmbl9hR1Z5YnkxeVpXNXZkbUYwYVc5dS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=KEIlWuGpETZNjtFQcGyQSbFkrMJ5~EWaW35l-VRByShs7StAk09cnnK-BLqv5oTDzyJ0LKRy7Zd3DLEXV4wqLlypP9HKmWDyq8uY9gGxpi7XDP17AtAIXV~h1g83-1zM30kDBoxW0CTpAdrdOad2d97ZUPKl5uDyJ1Z-ToGGBzU7mugkVlTkLt9pgi1Ht7eROx22Dktb5IN4BKUuJpG8V~XZccGbl7xJ3ZxK64zNDL0twxfv7fWCbw3LU3uEPXSpV8eC7GsvekkTYeqi-BzZ1FtmV0SauDZ7SOfuebFfwT3r0i7AWc7G8iB0GflTEBfreFJeYCTUPdTKYJI1T21gZg__';

const INCLUDED_ITEMS = [
  { icon: GraduationCap, title: 'Complete Investing Course', desc: '12 Modules, 65+ Micro-Lessons covering Fix & Flip, Wholesale, BRRRR, Subject-To, and Short-Term Rentals' },
  { icon: Megaphone, title: 'Marketing Templates', desc: 'Direct mail letters, postcards, email sequences, and cold call scripts for property acquisitions' },
  { icon: FileText, title: 'Contract Templates', desc: 'Assignable purchase agreements, wholesale contracts, and assignment contracts with "and/or assigns" language' },
  { icon: ClipboardList, title: 'SOW Templates', desc: 'Professional scope of work templates for all 14 room categories — kitchen, bath, bedroom, landscaping, and more' },
  { icon: Landmark, title: 'Lender Directory', desc: 'Curated list of hard money and private lenders with rates, terms, LTV ratios, and direct contact info' },
  { icon: CheckSquare, title: 'Investor Checklists', desc: 'Due diligence, closing, rehab, and property inspection checklists for every deal type' },
  { icon: Award, title: 'Credibility Packet Builder', desc: 'Track record templates, before/after photo layouts, and project summary formats for lender presentations' },
  { icon: Calculator, title: 'Profit Calculator Spreadsheet', desc: 'Excel-based profit calculator covering all 6 investment scenarios with built-in formulas' },
  { icon: DollarSign, title: 'Private Money Prospectus', desc: 'Professional template to attract private money lenders with projected returns and deal structure' },
  { icon: Package, title: '3-Option Seller Brochure', desc: 'Present sellers with three offer options — cash, terms, and creative financing — in one professional document' },
  { icon: Wrench, title: 'Rehab Budget Worksheet', desc: 'Detailed budget tracking template with line items for every renovation category' },
  { icon: MapPin, title: 'State Reference Guide', desc: 'State-by-state guide covering closing customs, title insurance, attorney requirements, and transfer taxes' },
  { icon: BookOpen, title: 'Lead Magnet: 5 Biggest Mistakes', desc: 'Ready-to-use PDF lead magnet to capture investor leads and build your email list' },
  { icon: Shield, title: 'Course Completion Certificate', desc: 'Professional certificate template to showcase your real estate investing education' },
];

const TESTIMONIALS = [
  { name: 'Marcus T.', role: 'Fix & Flip Investor, Atlanta', text: 'The Business-in-a-Box saved me months of research. I had everything I needed to start analyzing deals and marketing for properties on day one.' },
  { name: 'Sarah K.', role: 'Wholesale Investor, Phoenix', text: 'The contract templates alone are worth the investment. I closed my first wholesale deal within 3 weeks using the marketing templates and assignment contracts.' },
  { name: 'David R.', role: 'BRRRR Investor, Dallas', text: 'I was spending $200/month on different tools and courses. Freedom One replaced all of them with one system. The SOW templates and rehab estimator are game changers.' },
];

const FAQ = [
  { q: 'What exactly is included in the Business-in-a-Box?', a: 'You get the complete Freedom One real estate investing course (12 modules, 65+ lessons), all marketing templates, contract templates, SOW templates, lender directory, investor checklists, credibility packet builder, profit calculator spreadsheet, and every resource document listed above. It is everything you need to run a real estate investing business.' },
  { q: 'Is this a one-time payment or a subscription?', a: 'This is a one-time payment of $1,997. You get lifetime access to all course materials and templates. No monthly fees, no recurring charges. All future course updates are included at no extra cost.' },
  { q: 'Do I need the app to use the Business-in-a-Box?', a: 'No. The Business-in-a-Box works independently as a complete education and template system. However, the Freedom One app (available as an optional upgrade) adds powerful digital tools like the Deal Analyzer, Rehab Estimator, and Pipeline CRM that complement the course materials.' },
  { q: 'What if I am a complete beginner?', a: 'The course starts from the fundamentals and builds up to advanced strategies. Module 1 covers investor mindset and goal setting, and each subsequent module builds on the previous one. The templates and checklists guide you through every step of your first deal.' },
  { q: 'Can I get a refund?', a: 'Due to the digital nature of the product and immediate access to all materials, all sales are final. We are confident in the value of this system — it contains everything a professional investor needs to analyze, acquire, and profit from real estate deals.' },
  { q: 'How do I access the materials after purchase?', a: 'After purchase, you will receive immediate access to download all templates, contracts, and course materials. You will also receive login credentials to access the online course platform where all video lessons and interactive content are hosted.' },
];

export default function BusinessInABox() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState<'bib' | 'condensed' | 'full'>('bib');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const VIDEO_OPTIONS = [
    { key: 'bib' as const, label: 'Business Overview', duration: '2:51', url: BIB_VIDEO_URL },
    { key: 'condensed' as const, label: 'Quick Demo', duration: '2:02', url: CONDENSED_DEMO_URL },
    { key: 'full' as const, label: 'Full Platform Demo', duration: '5:31', url: FULL_DEMO_URL },
  ];

  const handleVideoSwitch = (key: 'bib' | 'condensed' | 'full') => {
    setActiveVideo(key);
    setVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
    }
  };

  const createCheckout = trpc.bib.createCheckout.useMutation();

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckout.mutateAsync({
        productKey: 'main',
        origin: window.location.origin,
        email: user?.email || undefined,
        name: user?.name || undefined,
      });
      if (result.url) {
        toast.info('Redirecting to secure checkout...');
        window.open(result.url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white">
      {/* Minimal Header */}
      <header className="border-b border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={LOGO_URL} alt="Freedom One" className="h-10 object-contain" />
          <span className="text-sm text-white/50">Business-in-a-Box</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.06_0_0/0.96)] via-[oklch(0.06_0_0/0.88)] to-[oklch(0.06_0_0/0.65)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.48_0.20_18)]/15 border border-[oklch(0.48_0.20_18)]/30 text-[oklch(0.70_0.18_18)] text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              <span>Complete Business System</span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
              Everything You Need to<br />
              <span className="text-[oklch(0.70_0.18_18)]">Build a Real Estate<br />Investing Business</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 leading-relaxed mb-8 max-w-xl">
              The complete system — course, templates, contracts, marketing materials, and resources — 
              all in one package. Stop piecing together your investing business from a dozen different sources.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <Button
                size="lg"
                onClick={handleBuyNow}
                disabled={isLoading}
                className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-bold px-8 py-6 text-lg"
              >
                {isLoading ? 'Processing...' : 'Get the Business-in-a-Box — $1,997'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-400" /> One-Time Payment</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-400" /> Lifetime Access</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-400" /> Instant Download</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-[oklch(0.10_0_0)]">
        <div className="max-w-5xl mx-auto px-4 py-16 lg:py-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">See What You Are Getting</h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm">
              Watch our AI-hosted walkthrough to see exactly what is inside the Business-in-a-Box.
            </p>
          </div>
          {/* Video Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            {VIDEO_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleVideoSwitch(opt.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeVideo === opt.key
                    ? 'bg-[oklch(0.48_0.20_18)] text-white'
                    : 'bg-[oklch(0.16_0_0)] text-white/60 hover:text-white/80 hover:bg-[oklch(0.20_0_0)]'
                }`}
              >
                {opt.label}
                <span className="ml-1.5 text-xs opacity-60">({opt.duration})</span>
              </button>
            ))}
          </div>
          {/* Video Player */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-video max-w-4xl mx-auto">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              preload="metadata"
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
            >
              <source src={VIDEO_OPTIONS.find(v => v.key === activeVideo)?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!videoPlaying && (
              <button
                onClick={() => { videoRef.current?.play(); setVideoPlaying(true); }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-[oklch(0.48_0.20_18)] flex items-center justify-center shadow-2xl">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Value Stats */}
      <section className="bg-[oklch(0.12_0_0)] border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-[oklch(0.70_0.18_18)]">65+</p>
              <p className="text-sm text-white/50 mt-1">Video Lessons</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[oklch(0.70_0.18_18)]">14</p>
              <p className="text-sm text-white/50 mt-1">Template Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[oklch(0.70_0.18_18)]">5</p>
              <p className="text-sm text-white/50 mt-1">Exit Strategies</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[oklch(0.70_0.18_18)]">$1,997</p>
              <p className="text-sm text-white/50 mt-1">One-Time Investment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Agitation */}
      <section className="max-w-4xl mx-auto px-4 py-16 lg:py-20">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-6">
          Are You Tired of Piecing Together Your<br />
          <span className="text-[oklch(0.70_0.18_18)]">Investing Business from Scratch?</span>
        </h2>
        <div className="space-y-4 text-lg text-white/70 leading-relaxed max-w-3xl mx-auto">
          <p>
            Most new investors spend months — and thousands of dollars — buying separate courses, downloading random templates, 
            hiring attorneys for contracts, and searching for lenders. They piece together their business from a dozen different 
            sources, never knowing if they have everything they need.
          </p>
          <p>
            The result? Wasted time, wasted money, and deals that slip through the cracks because they did not have the right 
            system in place. The investors who succeed are the ones who start with a complete system from day one.
          </p>
          <p className="font-semibold text-white">
            That is exactly what the Freedom One Business-in-a-Box gives you.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-[oklch(0.10_0_0)]">
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">Everything Included in the Box</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              14 complete categories of resources, templates, and education — everything a professional real estate investor needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDED_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-5 rounded-lg bg-[oklch(0.14_0_0)] border border-white/8 hover:border-[oklch(0.48_0.20_18)]/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-[oklch(0.48_0.20_18)]/12 shrink-0">
                      <Icon className="w-5 h-5 text-[oklch(0.65_0.18_18)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-white/55 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Breakdown */}
      <section className="max-w-6xl mx-auto px-4 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">The Complete Investing Course</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            12 comprehensive modules covering every exit strategy, from your first deal to scaling your business.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { num: '01', title: 'Investor Mindset & Goals', lessons: 5 },
            { num: '02', title: 'Market Analysis & Research', lessons: 5 },
            { num: '03', title: 'Fix & Flip Strategy', lessons: 7 },
            { num: '04', title: 'Wholesale Strategy', lessons: 6 },
            { num: '05', title: 'BRRRR Strategy', lessons: 6 },
            { num: '06', title: 'Subject-To & Creative Financing', lessons: 5 },
            { num: '07', title: 'Short-Term Rentals', lessons: 5 },
            { num: '08', title: 'Deal Analysis & Numbers', lessons: 6 },
            { num: '09', title: 'Rehab Estimation & Management', lessons: 5 },
            { num: '10', title: 'Marketing & Lead Generation', lessons: 6 },
            { num: '11', title: 'Asset Protection & Tax Strategy', lessons: 4 },
            { num: '12', title: 'Scaling Your Business', lessons: 5 },
          ].map((mod) => (
            <div key={mod.num} className="flex items-start gap-3 p-4 rounded-lg bg-[oklch(0.12_0_0)] border border-white/6">
              <span className="text-2xl font-bold text-[oklch(0.48_0.20_18)]/40">{mod.num}</span>
              <div>
                <h4 className="font-semibold text-sm">{mod.title}</h4>
                <p className="text-xs text-white/45">{mod.lessons} Micro-Lessons</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-[oklch(0.10_0_0)]">
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-20">
          <h2 className="text-3xl font-bold text-center mb-10">What Investors Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 rounded-lg bg-[oklch(0.14_0_0)] border border-white/8">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[oklch(0.75_0.15_85)] text-[oklch(0.75_0.15_85)]" />
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-white/45">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Stack */}
      <section className="max-w-4xl mx-auto px-4 py-16 lg:py-20">
        <h2 className="text-3xl font-bold text-center mb-10">The Value You Are Getting</h2>
        <div className="space-y-3 mb-8">
          {[
            { item: 'Complete 12-Module Investing Course (65+ Lessons)', value: '$2,497' },
            { item: 'Marketing Templates (Direct Mail, Email, Cold Call)', value: '$497' },
            { item: 'Contract Templates (Purchase, Wholesale, Assignment)', value: '$397' },
            { item: 'SOW Templates (14 Room Categories)', value: '$297' },
            { item: 'Lender Directory with Rates & Terms', value: '$197' },
            { item: 'Investor Checklists & Due Diligence Guides', value: '$197' },
            { item: 'Credibility Packet Builder', value: '$197' },
            { item: 'Profit Calculator Spreadsheet (6 Scenarios)', value: '$147' },
            { item: 'Private Money Prospectus + 3-Option Brochure', value: '$197' },
            { item: 'Rehab Budget Worksheet + State Guide', value: '$147' },
            { item: 'Lead Magnet PDF + Course Certificate', value: '$97' },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3 px-4 rounded-lg bg-[oklch(0.12_0_0)] border border-white/6">
              <span className="text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                {row.item}
              </span>
              <span className="text-sm font-semibold text-white/40 line-through">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="text-center p-6 rounded-xl bg-[oklch(0.14_0_0)] border-2 border-[oklch(0.48_0.20_18)]/40">
          <p className="text-white/50 text-sm mb-1">Total Value</p>
          <p className="text-3xl font-bold text-white/40 line-through mb-1">$4,867</p>
          <p className="text-white/50 text-sm mb-3">Your Price Today</p>
          <p className="text-5xl font-bold text-[oklch(0.70_0.18_18)] mb-4">$1,997</p>
          <p className="text-sm text-white/50 mb-6">One-time payment. Lifetime access. No recurring fees.</p>
          <Button
            size="lg"
            onClick={handleBuyNow}
            disabled={isLoading}
            className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-bold px-10 py-6 text-lg"
          >
            {isLoading ? 'Processing...' : 'Get Instant Access — $1,997'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[oklch(0.10_0_0)]">
        <div className="max-w-3xl mx-auto px-4 py-16 lg:py-20">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <div key={i} className="rounded-lg bg-[oklch(0.14_0_0)] border border-white/8 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white/40 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 lg:py-20 text-center">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Ready to Build Your Real Estate<br />
          <span className="text-[oklch(0.70_0.18_18)]">Investing Business?</span>
        </h2>
        <p className="text-white/60 max-w-xl mx-auto mb-8">
          Join investors who stopped guessing and started building with a complete system. 
          Everything you need — course, templates, contracts, and resources — in one package.
        </p>
        <Button
          size="lg"
          onClick={handleBuyNow}
          disabled={isLoading}
          className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-bold px-10 py-6 text-lg"
        >
          {isLoading ? 'Processing...' : 'Get the Business-in-a-Box — $1,997'}
          <ArrowRight className="w-5 h-5" />
        </Button>
        <p className="text-xs text-white/30 mt-4">Secure checkout powered by Stripe. One-time payment.</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>Freedom One Properties &mdash; contact@freedomoneproperties.com</span>
          <span>&copy; {new Date().getFullYear()} Freedom One. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
