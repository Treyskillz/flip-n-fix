import { Award, Download, Users, Briefcase, HandshakeIcon, Banknote, Home as HomeIcon, UserCheck, FileText, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PacketSection {
  title: string;
  content: string;
}

interface CredibilityPacket {
  id: string;
  title: string;
  icon: typeof Award;
  color: string;
  audience: string;
  description: string;
  sections: PacketSection[];
  tips: string[];
}

const PACKETS: CredibilityPacket[] = [
  {
    id: 'general',
    title: 'General Investor',
    icon: Briefcase,
    color: 'oklch(0.48 0.20 18)',
    audience: 'Great for beginners establishing credibility with anyone',
    description: 'A versatile credibility packet that introduces you as a professional real estate investor. Perfect for networking events, meetups, and initial conversations.',
    sections: [
      {
        title: 'Company Overview',
        content: '[Your Company Name] is a real estate investment company specializing in residential property acquisitions, renovations, and sales. We are committed to revitalizing neighborhoods by transforming distressed properties into beautiful, move-in ready homes.\n\nOur team brings [X] years of combined experience in real estate investing, construction management, and property analysis. We operate with integrity, transparency, and a commitment to creating win-win outcomes for all parties involved.',
      },
      {
        title: 'Our Investment Approach',
        content: '• Fix & Flip: We purchase distressed properties, complete professional renovations, and sell to retail buyers\n• Wholesale: We connect motivated sellers with qualified investors for quick, hassle-free transactions\n• Buy & Hold: We acquire rental properties that generate consistent cash flow and long-term appreciation\n• BRRRR Strategy: Buy, Rehab, Rent, Refinance, Repeat — building a portfolio of cash-flowing assets',
      },
      {
        title: 'Why Work With Us',
        content: '• Professional, licensed, and insured operations\n• Transparent communication throughout every transaction\n• Quick closing capability (as fast as 7-14 days)\n• Flexible terms tailored to each situation\n• Strong network of contractors, lenders, and real estate professionals\n• Track record of successful projects in [Your Market Area]',
      },
      {
        title: 'Recent Projects',
        content: '[Include 2-3 before/after project summaries with addresses, purchase price, rehab cost, and sale price. Example:]\n\n• 123 Main St — Purchased at $150,000, invested $45,000 in renovations, sold for $265,000\n• 456 Oak Ave — Complete kitchen and bathroom remodel, new roof, landscaping. Sold in 12 days on market.',
      },
    ],
    tips: [
      'Customize with your actual company name, market area, and project examples',
      'Include professional headshot and company logo',
      'Print on quality card stock for in-person meetings',
      'Keep a digital version as a PDF for email attachments',
    ],
  },
  {
    id: 'sellers',
    title: 'For Sellers',
    icon: HomeIcon,
    color: 'oklch(0.50 0.15 145)',
    audience: 'Designed for motivated sellers considering your offer',
    description: 'Build trust with property sellers by demonstrating your professionalism, track record, and ability to close quickly.',
    sections: [
      {
        title: 'A Message to Homeowners',
        content: 'We understand that selling your home can be stressful, especially when facing difficult circumstances like foreclosure, divorce, probate, or costly repairs. [Your Company Name] specializes in helping homeowners find solutions — quickly and fairly.\n\nUnlike traditional real estate transactions, we buy properties directly. There are no agent commissions, no repair requirements, and no lengthy waiting periods.',
      },
      {
        title: 'How Our Process Works',
        content: '1. Contact Us — Call or fill out our form. We\'ll ask a few questions about your property.\n2. Property Evaluation — We\'ll schedule a quick visit to assess the property (usually 15-30 minutes).\n3. Fair Cash Offer — Within 24 hours, you\'ll receive a no-obligation cash offer.\n4. You Choose the Timeline — Close in as little as 7 days, or on your schedule.\n5. Get Paid — Receive your funds at closing. No hidden fees or surprises.',
      },
      {
        title: 'Our Commitment to You',
        content: '• No obligation — You\'re never pressured to accept our offer\n• No commissions — We are not agents; we buy directly\n• No repairs needed — We buy properties as-is, in any condition\n• No closing costs — We cover all standard closing costs\n• Confidential — Your situation stays private\n• Transparent — We explain exactly how we arrive at our offer price',
      },
      {
        title: 'Testimonials',
        content: '[Include 2-3 seller testimonials. Example:]\n\n"I was facing foreclosure and didn\'t know what to do. [Company] made me a fair offer and closed in 10 days. They saved my credit and gave me peace of mind." — J. Smith, [City]\n\n"The process was so easy. No repairs, no showings, no stress. I would recommend them to anyone." — M. Johnson, [City]',
      },
    ],
    tips: [
      'Include your Better Business Bureau rating if applicable',
      'Add photos of properties you\'ve purchased (before/after)',
      'Include your direct phone number for immediate contact',
      'Use this as a leave-behind after meeting with sellers',
    ],
  },
  {
    id: 'buyers',
    title: 'For Buyers',
    icon: Users,
    color: 'oklch(0.45 0.15 250)',
    audience: 'For end buyers purchasing your renovated properties',
    description: 'Showcase your renovation quality and professionalism to retail buyers and their agents.',
    sections: [
      {
        title: 'Quality Renovations You Can Trust',
        content: '[Your Company Name] is a professional renovation company that transforms distressed properties into beautiful, move-in ready homes. Every project is completed with attention to detail, quality materials, and full compliance with local building codes.\n\nOur renovations are designed to exceed buyer expectations while providing lasting value.',
      },
      {
        title: 'Our Renovation Standards',
        content: '• All work performed by licensed, insured contractors\n• Building permits pulled for all required work\n• Final inspections passed before listing\n• Quality materials from trusted suppliers (Home Depot, Lowe\'s)\n• Professional-grade fixtures and finishes\n• Energy-efficient upgrades where applicable (windows, insulation, HVAC)\n• 1-year workmanship warranty on all renovations',
      },
      {
        title: 'What\'s Included in Our Renovations',
        content: '• New or refinished flooring throughout\n• Fresh interior and exterior paint\n• Updated kitchen with modern cabinets, countertops, and appliances\n• Renovated bathrooms with new fixtures and tile\n• Updated electrical and plumbing as needed\n• New or serviced HVAC system\n• Roof inspection and repair/replacement as needed\n• Professional landscaping and curb appeal improvements',
      },
      {
        title: 'Portfolio & References',
        content: '[Include 3-4 completed project photos with descriptions]\n\nWe welcome buyer inspections and are happy to provide references from past buyers, our contractors, and real estate professionals we work with regularly.',
      },
    ],
    tips: [
      'Include high-quality before/after photos of your best projects',
      'List specific brands and materials used (shows quality commitment)',
      'Provide your contractor\'s license numbers',
      'Have copies available at open houses',
    ],
  },
  {
    id: 'contractors',
    title: 'For Contractors',
    icon: HandshakeIcon,
    color: 'oklch(0.55 0.18 80)',
    audience: 'Attract quality contractors to work on your projects',
    description: 'Present yourself as a serious, reliable investor that contractors want to work with repeatedly.',
    sections: [
      {
        title: 'Partnership Opportunity',
        content: '[Your Company Name] is an active real estate investment company completing [X] renovation projects per year in [Your Market Area]. We are looking for reliable, skilled contractors to join our team of trusted trade partners.\n\nWe value long-term relationships and provide consistent, well-organized work to our contractor partners.',
      },
      {
        title: 'What We Offer Contractors',
        content: '• Consistent pipeline of renovation projects (no gaps between jobs)\n• Detailed Scope of Work provided before every project\n• Materials pre-ordered and delivered on schedule\n• Clear payment terms: progress payments tied to milestones\n• Professional project management and communication\n• Respect for your time, expertise, and schedule\n• Referrals to other investors in our network',
      },
      {
        title: 'Our Expectations',
        content: '• Licensed and insured (General Liability + Workers\' Comp)\n• Quality workmanship that meets or exceeds code\n• Reliable timeline adherence and communication\n• Clean, professional job sites\n• Willingness to provide itemized bids\n• References from recent projects',
      },
      {
        title: 'How to Get Started',
        content: '1. Submit your company information and trade specialties\n2. Provide proof of license and insurance\n3. Share 3 references from recent clients\n4. We\'ll schedule a meet-and-greet and discuss upcoming projects\n5. Start with a small project to build the relationship\n\nContact: [Your Name] | [Phone] | [Email]',
      },
    ],
    tips: [
      'Bring this to contractor networking events and supply houses',
      'Post in local contractor Facebook groups',
      'Include specific project photos showing the quality you expect',
      'Emphasize consistent work — this is what contractors value most',
    ],
  },
  {
    id: 'agents',
    title: 'For Real Estate Agents',
    icon: UserCheck,
    color: 'oklch(0.50 0.18 320)',
    audience: 'Build referral relationships with real estate agents',
    description: 'Show agents why referring deals to you benefits their clients and their business.',
    sections: [
      {
        title: 'Agent Partnership Program',
        content: '[Your Company Name] actively partners with real estate agents to create mutually beneficial opportunities. Whether you have a listing that needs a cash buyer, a client with a distressed property, or you\'re looking for renovated inventory to show your buyers — we can help.',
      },
      {
        title: 'How We Work With Agents',
        content: '• Cash Offers on Listings: We can make competitive cash offers on your listings, providing your sellers with a quick, certain close\n• Referral Fees: We pay referral fees for deals that close (where legally permitted)\n• Renovated Inventory: We list our completed renovations with agent partners, providing quality inventory for your buyers\n• Off-Market Deals: We can provide off-market opportunities for your investor clients\n• Co-Wholesale: Partner on wholesale deals for shared profits',
      },
      {
        title: 'Why Agents Choose Us',
        content: '• We close on time, every time — no financing fall-throughs\n• Professional, easy-to-work-with team\n• We protect the agent-client relationship\n• Quick response times (within 2 hours)\n• Proof of funds available upon request\n• Track record of [X] successful closings in [Year]',
      },
      {
        title: 'Get Connected',
        content: 'We\'d love to discuss how we can work together. Whether you have a specific deal or want to explore a long-term partnership, reach out anytime.\n\nContact: [Your Name] | [Phone] | [Email]\n\nWe look forward to building a profitable relationship!',
      },
    ],
    tips: [
      'Deliver in person to top-producing agents in your market',
      'Include proof of funds letter from your lender',
      'Follow up within 48 hours of delivering the packet',
      'Offer to take agents to lunch to discuss partnership',
    ],
  },
  {
    id: 'private-money',
    title: 'For Private Lenders',
    icon: Banknote,
    color: 'oklch(0.45 0.18 145)',
    audience: 'Attract private money lenders to fund your deals',
    description: 'Present a professional case for why private lenders should fund your real estate investments.',
    sections: [
      {
        title: 'Investment Opportunity',
        content: '[Your Company Name] offers private lending opportunities secured by real estate. Our projects provide attractive returns backed by tangible assets — residential properties in [Your Market Area].\n\nWe are seeking private capital partners who want to earn passive returns secured by real property, with the added benefit of working with an experienced investment team.',
      },
      {
        title: 'How Private Lending Works',
        content: '• You provide a short-term loan (typically 6-12 months) secured by real property\n• Your investment is protected by a recorded mortgage/deed of trust\n• You earn [X]% annual interest, paid monthly or at maturity\n• Loan-to-Value (LTV) ratio never exceeds 70% of After Repair Value\n• Title insurance protects your position\n• All loans are serviced through a licensed title company/attorney',
      },
      {
        title: 'Our Track Record',
        content: '• [X] projects completed successfully\n• $[X] in total project value\n• Average project timeline: [X] months\n• Zero defaults on private loans\n• Average return to lenders: [X]% annually\n• All lenders have been repaid on time or early\n\n[Include 2-3 case studies with numbers]',
      },
      {
        title: 'Security & Protection',
        content: '• First-position lien recorded on the property\n• Hazard insurance with lender named as loss payee\n• Title insurance policy protecting your interest\n• Personal guarantee from principals\n• Regular project updates with photos\n• You can inspect the property at any time\n• Draw schedule ensures funds are used for intended purpose',
      },
    ],
    tips: [
      'Present this at REI meetups and networking events',
      'Include actual project case studies with real numbers',
      'Have your attorney review before distributing (SEC compliance)',
      'Always include a disclaimer that this is not a securities offering',
    ],
  },
];

function PacketCard({ packet, onSelect }: { packet: CredibilityPacket; onSelect: () => void }) {
  const Icon = packet.icon;
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={onSelect}>
      <CardContent className="p-5">
        <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: `${packet.color}15` }}>
          <Icon className="w-5 h-5" style={{ color: packet.color }} />
        </div>
        <h3 className="font-bold text-base mb-1 group-hover:text-[oklch(0.48_0.20_18)] transition-colors">
          {packet.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{packet.audience}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{packet.description}</p>
      </CardContent>
    </Card>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function PacketDetail({ packet, onBack }: { packet: CredibilityPacket; onBack: () => void }) {
  const Icon = packet.icon;

  const handlePrint = () => window.print();

  const allContent = packet.sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');

  return (
    <div>
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1">
        ← Back to all packets
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${packet.color}15` }}>
            <Icon className="w-6 h-6" style={{ color: packet.color }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{packet.title}</h2>
            <p className="text-sm text-muted-foreground">{packet.audience}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <CopyButton text={allContent} />
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4 mb-8">
        {packet.sections.map((section, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base">{section.title}</h3>
                <CopyButton text={section.content} />
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card className="bg-muted/50">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[oklch(0.48_0.20_18)]" /> Tips for Using This Packet
          </h3>
          <ul className="space-y-1.5">
            {packet.tips.map((tip, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-[oklch(0.48_0.20_18)] mt-1">•</span> {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CredibilityPackets() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPacket = PACKETS.find(p => p.id === selected);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-14 text-center">
          <Award className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Business Credibility Packets</h1>
          <p className="text-[oklch(0.6_0_0)] max-w-lg mx-auto">
            Professional, editable credibility packets for every audience — sellers, buyers, agents,
            contractors, and private lenders. Copy, customize, and print.
          </p>
        </div>
      </section>

      <section className="container py-12">
        {selectedPacket ? (
          <PacketDetail packet={selectedPacket} onBack={() => setSelected(null)} />
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Choose a Packet</h2>
              <p className="text-muted-foreground text-sm">
                Each packet is fully customizable. Click to view, copy sections, or print the entire packet.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PACKETS.map(p => (
                <PacketCard key={p.id} packet={p} onSelect={() => setSelected(p.id)} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
