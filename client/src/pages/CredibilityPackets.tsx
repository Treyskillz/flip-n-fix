import {
  Award, Users, Briefcase, HandshakeIcon, Banknote, Home as HomeIcon, UserCheck,
  FileText, Download, Info, User, Plus, Trash2, Upload, Camera, FileCheck,
  ImageIcon, X, ChevronDown, ChevronUp, DollarSign, Calendar, MapPin, Building2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useState, useRef, useCallback } from 'react';
import { printDocument } from '@/lib/printDocument';
import { useProfileReplacer } from '@/hooks/useProfileReplacer';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';

// ─── Packet Data ──────────────────────────────────────────────

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
        title: 'What We Do as Fix & Flip Investors',
        content: 'We identify undervalued residential properties — often distressed, vacant, or in need of significant repair — and transform them into renovated, market-ready homes. Our process is systematic and data-driven:\n\n• Property Sourcing: We find deals through direct mail campaigns, driving for dollars, MLS listings, wholesalers, foreclosure auctions, probate leads, and referral networks.\n• Due Diligence: Every potential acquisition goes through a rigorous analysis including comparable sales research, rehab cost estimation, ARV (After Repair Value) calculation, and ROI projection using the 70% rule.\n• Acquisition: We close quickly — often within 7-14 days — using cash or hard money financing, giving sellers certainty and speed.\n• Renovation: Our licensed contractor teams execute detailed scopes of work covering structural, mechanical, cosmetic, and curb appeal improvements. We manage every project with milestone-based timelines and budgets.\n• Sale: Completed properties are listed on the MLS with professional photography, staging, and marketing to maximize sale price and minimize days on market.',
      },
      {
        title: 'Our Investment Philosophy',
        content: 'We believe in creating value at every level of a transaction:\n\n• For Sellers: We provide fast, fair solutions for homeowners facing difficult situations — foreclosure, divorce, probate, relocation, or properties that need too much work to sell traditionally.\n• For Buyers: We deliver beautifully renovated homes with modern finishes, updated systems, and move-in ready quality that exceeds expectations.\n• For Neighborhoods: Every property we renovate improves the surrounding community — raising property values, reducing blight, and attracting new families.\n• For Partners: Our contractors, agents, lenders, and vendors benefit from consistent deal flow and professional, reliable business relationships.\n\nWe follow the 70% Rule as our acquisition guideline: we never pay more than 70% of a property\'s After Repair Value minus estimated rehab costs. This conservative approach protects our margins and ensures every deal is profitable.',
      },
      {
        title: 'Our Investment Strategies',
        content: '• Fix & Flip: Purchase distressed properties, complete professional renovations, and sell to retail buyers for profit. This is our primary strategy with typical project timelines of 3-6 months.\n• Wholesale: Connect motivated sellers with qualified investors for quick, hassle-free transactions. We assign contracts for an assignment fee without taking on renovation risk.\n• Buy & Hold: Acquire rental properties that generate consistent monthly cash flow and long-term appreciation. We target properties in strong rental markets with favorable rent-to-price ratios.\n• BRRRR Strategy: Buy, Rehab, Rent, Refinance, Repeat — building a portfolio of cash-flowing rental assets by recycling capital through refinancing after renovation.\n• Subject-To: Acquire properties by taking over existing mortgage payments, allowing us to control properties with minimal capital outlay while providing sellers with relief from their mortgage obligations.',
      },
      {
        title: 'Market Expertise & Target Properties',
        content: 'We focus our operations in [Your Market Area], where we have deep knowledge of neighborhood values, buyer preferences, contractor availability, and market trends.\n\nOur Target Acquisition Criteria:\n• Single-family residential properties (3+ bedrooms preferred)\n• Properties needing $20,000 - $100,000+ in renovation\n• Minimum projected profit of $25,000 per deal\n• Properties that can be acquired at 65-75% of ARV minus rehab costs\n• Neighborhoods with strong comparable sales and buyer demand\n• Properties with clear title or resolvable title issues\n\nWe analyze every deal using our proprietary deal analysis system that evaluates purchase price, rehab costs, holding costs, financing costs, selling costs, and projected profit against multiple exit strategies.',
      },
      {
        title: 'Renovation Standards',
        content: 'Every renovation project follows our comprehensive quality standards:\n\n• All work performed by licensed, insured contractors with verified references\n• Building permits pulled for all required work — we never cut corners on code compliance\n• Detailed Scope of Work (SOW) created before any work begins, with room-by-room specifications\n• Three material tiers available: Rental Grade, Standard, and Luxury — selected based on the target buyer profile and neighborhood comps\n• Quality materials sourced from Home Depot, Lowe\'s, and specialty suppliers\n• Progress inspections at key milestones (demo complete, rough-in, finish work)\n• Final walkthrough and punch list before listing\n• Professional cleaning and staging before photography\n\nCommon renovation items include: new flooring, fresh paint (interior/exterior), kitchen remodel (cabinets, countertops, appliances), bathroom updates, electrical panel upgrades, plumbing repairs, HVAC servicing or replacement, roof repair/replacement, and landscaping.',
      },
      {
        title: 'Recent Projects & Track Record',
        content: '[Your track record projects with before/after photos and closing documents are displayed below. Add your completed projects using the Track Record Manager to build your credibility portfolio.]\n\nEvery project listed includes verified purchase and sale data, before and after photographs documenting the transformation, and closing statements proving the transaction.',
      },
      {
        title: 'Contact Information',
        content: '[Your Name]\n[Your Company Name]\n[Phone]\n[Email]\n[Your Website]\n[Your Address]\n\nLicensed Real Estate Investor | [Your Market Area]',
      },
    ],
    tips: [
      'Customize with your actual company name, market area, and project examples',
      'Add your completed projects in the Track Record Manager below to include real before/after photos',
      'Upload closing statements to prove your deals are real — this is what separates you from beginners',
      'Print on quality card stock for in-person meetings and keep a digital PDF for email',
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
        content: 'We understand that selling your home can be stressful, especially when facing difficult circumstances like foreclosure, divorce, probate, or costly repairs. [Your Company Name] specializes in helping homeowners find solutions — quickly and fairly.\n\nUnlike traditional real estate transactions, we buy properties directly. There are no agent commissions, no repair requirements, and no lengthy waiting periods. We are professional real estate investors who have helped dozens of homeowners in [Your Market Area] move forward with their lives.',
      },
      {
        title: 'Who We Are',
        content: '[Your Company Name] is a local real estate investment company owned and operated by [Your Name]. We are not real estate agents — we are direct buyers who use our own capital (or private funding) to purchase properties.\n\nAs fix and flip investors, we specialize in buying homes that need work — whether it\'s cosmetic updates, major repairs, or complete renovations. We take on the risk and expense of repairs so you don\'t have to. After purchasing your property, we invest in a full renovation and sell the finished home to a new family.\n\nThis means you get a fast, hassle-free sale, and the neighborhood gets a beautifully renovated home. Everyone wins.',
      },
      {
        title: 'How Our Process Works',
        content: '1. Contact Us — Call [Phone] or visit [Your Website]. We\'ll ask a few questions about your property.\n2. Property Evaluation — We\'ll schedule a quick visit to assess the property (usually 15-30 minutes). We look at the condition, layout, and needed repairs.\n3. Fair Cash Offer — Within 24 hours, you\'ll receive a no-obligation cash offer based on comparable sales, repair costs, and current market conditions. We\'ll show you exactly how we calculated our offer.\n4. You Choose the Timeline — Close in as little as 7 days, or on your schedule. Need 30 days? 60 days? We work around your timeline.\n5. Get Paid — Receive your funds at closing through a licensed title company. No hidden fees or surprises.',
      },
      {
        title: 'Our Commitment to You',
        content: '• No obligation — You\'re never pressured to accept our offer\n• No commissions — We are not agents; we buy directly from you\n• No repairs needed — We buy properties as-is, in any condition\n• No closing costs — We cover all standard closing costs\n• Confidential — Your situation stays completely private\n• Transparent — We explain exactly how we arrive at our offer price using comparable sales data\n• Local — We live and invest in [Your Market Area] and care about our community',
      },
      {
        title: 'Situations We Can Help With',
        content: '• Foreclosure or pre-foreclosure — We can close before the auction date\n• Inherited property (probate) — We handle the complexity of estate sales\n• Divorce — Fast sale allows both parties to move forward\n• Costly repairs — Foundation issues, roof damage, fire damage, mold, code violations\n• Vacant or abandoned property — Tired of paying taxes and insurance on a property you don\'t use\n• Relocating — Need to sell quickly for a job transfer\n• Tired landlord — Ready to exit the rental business\n• Behind on payments — We can help you avoid damage to your credit',
      },
      {
        title: 'Our Track Record',
        content: '[Your completed projects with before/after photos are displayed below. These demonstrate our ability to close deals and transform properties.]\n\nWe have successfully purchased and renovated properties throughout [Your Market Area]. Every transaction was handled professionally through a licensed title company with full closing documentation.',
      },
    ],
    tips: [
      'Include your Better Business Bureau rating if applicable',
      'Add your completed projects below with before/after photos — sellers need to see proof',
      'Upload closing statements to show you actually close deals, not just talk about them',
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
        content: '[Your Company Name] is a professional renovation company that transforms distressed properties into beautiful, move-in ready homes. Every project is completed with attention to detail, quality materials, and full compliance with local building codes.\n\nOur renovations are designed to exceed buyer expectations while providing lasting value. We don\'t just flip houses — we create homes that families are proud to live in.',
      },
      {
        title: 'About Our Company',
        content: 'Founded by [Your Name], [Your Company Name] has been renovating homes in [Your Market Area] for [X] years. As experienced fix and flip investors, we understand what today\'s buyers want: modern finishes, energy-efficient systems, open floor plans, and move-in ready quality.\n\nEvery property we renovate goes through a comprehensive renovation process that addresses structural integrity, mechanical systems (electrical, plumbing, HVAC), and cosmetic finishes. We don\'t just cover up problems — we fix them properly.',
      },
      {
        title: 'Our Renovation Standards',
        content: '• All work performed by licensed, insured contractors\n• Building permits pulled for all required work\n• Final inspections passed before listing\n• Quality materials from trusted suppliers (Home Depot, Lowe\'s)\n• Professional-grade fixtures and finishes\n• Energy-efficient upgrades where applicable (windows, insulation, HVAC)\n• 1-year workmanship warranty on all renovations',
      },
      {
        title: 'What\'s Included in Our Renovations',
        content: '• New or refinished flooring throughout (LVP, hardwood, or tile)\n• Fresh interior and exterior paint with modern color palettes\n• Updated kitchen with new cabinets, countertops, and stainless steel appliances\n• Renovated bathrooms with new vanities, fixtures, tile, and hardware\n• Updated electrical panels and outlets (GFCI where required)\n• Plumbing repairs and fixture upgrades\n• New or serviced HVAC system with warranty\n• Roof inspection and repair/replacement as needed\n• Professional landscaping and curb appeal improvements\n• New or refinished garage doors\n• Smart home features where applicable (smart thermostat, USB outlets)',
      },
      {
        title: 'Portfolio & Before/After Gallery',
        content: '[Your completed renovation projects with before/after photos are displayed below. These showcase the quality and scope of our work.]\n\nWe welcome buyer inspections and are happy to provide references from past buyers, our contractors, and real estate professionals we work with regularly.',
      },
    ],
    tips: [
      'Include high-quality before/after photos of your best projects in the Track Record Manager',
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
        content: '[Your Company Name] is an active real estate investment company completing multiple renovation projects per year in [Your Market Area]. We are looking for reliable, skilled contractors to join our team of trusted trade partners.\n\nAs professional fix and flip investors, we provide a consistent pipeline of renovation work. Our projects range from cosmetic refreshes ($15,000-$25,000) to full gut renovations ($50,000-$100,000+). We value long-term relationships and provide consistent, well-organized work to our contractor partners.',
      },
      {
        title: 'What We Do',
        content: 'We purchase distressed residential properties, renovate them to market-ready condition, and sell them to retail buyers. This means we need reliable contractors across all trades:\n\n• General Contractors & Project Managers\n• Electricians & Plumbers\n• HVAC Technicians\n• Roofers\n• Flooring Installers\n• Cabinet & Countertop Installers\n• Painters (Interior & Exterior)\n• Drywall & Framing Crews\n• Foundation & Structural Specialists\n• Landscapers\n• Cleanout & Demo Crews',
      },
      {
        title: 'What We Offer Contractors',
        content: '• Consistent pipeline of renovation projects (no gaps between jobs)\n• Detailed Scope of Work provided before every project with room-by-room specifications\n• Materials pre-ordered and delivered on schedule (or material allowance provided)\n• Clear payment terms: progress payments tied to milestones (typically 3-4 draws)\n• Professional project management and communication\n• Respect for your time, expertise, and schedule\n• Referrals to other investors in our network\n• Volume pricing opportunities for long-term partners',
      },
      {
        title: 'Our Expectations',
        content: '• Licensed and insured (General Liability + Workers\' Comp)\n• Quality workmanship that meets or exceeds local building codes\n• Reliable timeline adherence and proactive communication\n• Clean, professional job sites with daily cleanup\n• Willingness to provide itemized bids within 48 hours\n• References from at least 3 recent clients\n• Ability to start projects within 1-2 weeks of award',
      },
      {
        title: 'How to Get Started',
        content: '1. Submit your company information and trade specialties\n2. Provide proof of license and insurance\n3. Share 3 references from recent clients\n4. We\'ll schedule a meet-and-greet and discuss upcoming projects\n5. Start with a small project to build the relationship\n\nContact: [Your Name] | [Phone] | [Email]',
      },
    ],
    tips: [
      'Bring this to contractor networking events and supply houses',
      'Post in local contractor Facebook groups',
      'Include your completed project photos showing the quality you expect',
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
        content: '[Your Company Name] actively partners with real estate agents to create mutually beneficial opportunities. Whether you have a listing that needs a cash buyer, a client with a distressed property, or you\'re looking for renovated inventory to show your buyers — we can help.\n\nAs active fix and flip investors in [Your Market Area], we buy and sell multiple properties per year. This creates opportunities for agents at both ends of our transactions.',
      },
      {
        title: 'How We Work With Agents',
        content: '• Cash Offers on Listings: We can make competitive cash offers on your listings, providing your sellers with a quick, certain close — no financing contingencies, no appraisal issues\n• Referral Fees: We pay referral fees for deals that close (where legally permitted in your state)\n• Renovated Inventory: We list our completed renovations with agent partners, providing quality inventory for your buyers\n• Off-Market Deals: We can provide off-market opportunities for your investor clients\n• Co-Wholesale: Partner on wholesale deals for shared profits\n• Buyer Agent Opportunities: When we sell our renovated properties, we welcome buyer agents and pay standard commission',
      },
      {
        title: 'Why Agents Choose Us',
        content: '• We close on time, every time — no financing fall-throughs or last-minute surprises\n• Professional, easy-to-work-with team that respects the agent-client relationship\n• Quick response times (within 2 hours on any inquiry)\n• Proof of funds available upon request\n• Track record of successful closings in [Your Market Area]\n• We make agents look good by providing solutions for their toughest listings',
      },
      {
        title: 'Our Track Record',
        content: '[Your completed projects with before/after photos and closing documentation are displayed below. These demonstrate our ability to close deals reliably and produce quality renovations that sell quickly.]\n\nWe have successfully closed multiple transactions with agent partners throughout [Your Market Area].',
      },
      {
        title: 'Get Connected',
        content: 'We\'d love to discuss how we can work together. Whether you have a specific deal or want to establish an ongoing referral relationship, let\'s talk.\n\n[Your Name] | [Phone] | [Email]\n[Your Company Name] | [Your Website]',
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
        content: '[Your Company Name] offers private lending opportunities secured by real estate. Our projects provide attractive returns backed by tangible assets — residential properties in [Your Market Area].\n\nWe are seeking private capital partners who want to earn passive returns secured by real property, with the added benefit of working with an experienced investment team that has a proven track record of successful projects.',
      },
      {
        title: 'What We Do',
        content: 'We are professional fix and flip investors who purchase distressed residential properties, complete comprehensive renovations, and sell the finished homes to retail buyers. Our business model is straightforward:\n\n1. We identify undervalued properties through our marketing and sourcing channels\n2. We analyze each deal using conservative underwriting (70% Rule, verified comps, detailed rehab estimates)\n3. We acquire properties at a significant discount to After Repair Value\n4. We complete professional renovations using licensed contractors\n5. We sell the renovated property on the open market for full retail value\n\nPrivate lenders fund the acquisition and/or renovation costs, earning competitive returns secured by the real property itself.',
      },
      {
        title: 'How Private Lending Works',
        content: '• You provide a short-term loan (typically 6-12 months) secured by real property\n• Your investment is protected by a recorded mortgage/deed of trust in first position\n• You earn competitive annual interest, paid monthly or at maturity (your choice)\n• Loan-to-Value (LTV) ratio never exceeds 70% of After Repair Value — your principal is protected by significant equity\n• Title insurance protects your lien position\n• All loans are serviced through a licensed title company/attorney\n• You receive regular project updates with photos and timeline reports',
      },
      {
        title: 'Our Track Record',
        content: '[Your completed projects with financial details, before/after photos, and closing statements are displayed below. These prove our ability to execute projects profitably and repay lenders on time.]\n\n• Successful projects completed in [Your Market Area]\n• Average project timeline: 4-6 months\n• Zero defaults on private loans\n• All lenders have been repaid on time or early',
      },
      {
        title: 'Security & Protection for Lenders',
        content: '• First-position lien recorded on the property — your loan is secured by real estate\n• Hazard insurance with lender named as loss payee\n• Title insurance policy protecting your interest\n• Personal guarantee from principals of [Your Company Name]\n• Regular project updates with photos and financial reporting\n• You can inspect the property at any time during the project\n• Draw schedule ensures funds are used for intended purpose\n• Conservative LTV ratios (never exceeding 70% of ARV) provide a significant equity cushion',
      },
      {
        title: 'Sample Deal Structure',
        content: 'Here\'s a typical deal structure for illustration:\n\n• Property Purchase Price: $150,000\n• Estimated Rehab Cost: $45,000\n• Total Project Cost: $195,000\n• After Repair Value (ARV): $280,000\n• Loan-to-Value: 69.6% (well under 70% threshold)\n• Lender\'s Equity Cushion: $85,000 (30.4% of ARV)\n• Projected Timeline: 4-5 months\n• Lender Return: Competitive annual interest rate\n\nEven in a worst-case scenario where the property must be sold at a discount, the lender\'s position is protected by the significant equity cushion.',
      },
    ],
    tips: [
      'Present this at REI meetups and networking events',
      'Include actual project case studies with real numbers from your Track Record',
      'Upload closing statements — lenders want to see proof of completed transactions',
      'Have your attorney review before distributing (SEC compliance)',
      'Always include a disclaimer that this is not a securities offering',
    ],
  },
];

// ─── Track Record Project Manager ──────────────────────────────

type AttachmentType = 'before_photo' | 'after_photo' | 'closing_statement' | 'bill_of_sale' | 'other_document';

interface ProjectFormData {
  projectName: string;
  address: string;
  city: string;
  state: string;
  purchasePrice: string;
  rehabCost: string;
  salePrice: string;
  profit: string;
  purchaseDate: string;
  saleDate: string;
  daysToComplete: string;
  description: string;
}

const emptyForm: ProjectFormData = {
  projectName: '', address: '', city: '', state: '',
  purchasePrice: '', rehabCost: '', salePrice: '', profit: '',
  purchaseDate: '', saleDate: '', daysToComplete: '', description: '',
};

function TrackRecordManager() {
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState<ProjectFormData>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ projectId: number; type: AttachmentType } | null>(null);

  const utils = trpc.useUtils();
  const projectsQuery = trpc.credibility.listProjects.useQuery(undefined, { enabled: isAuthenticated });
  const createProject = trpc.credibility.createProject.useMutation({
    onSuccess: () => { utils.credibility.listProjects.invalidate(); setForm(emptyForm); toast.success('Project added to your track record'); },
  });
  const updateProject = trpc.credibility.updateProject.useMutation({
    onSuccess: () => { utils.credibility.listProjects.invalidate(); setEditingId(null); setForm(emptyForm); toast.success('Project updated'); },
  });
  const deleteProject = trpc.credibility.deleteProject.useMutation({
    onSuccess: () => { utils.credibility.listProjects.invalidate(); toast.success('Project removed'); },
  });
  const uploadAttachment = trpc.credibility.uploadAttachment.useMutation({
    onSuccess: () => { setUploading(false); if (expandedProject) utils.credibility.listAttachments.invalidate({ projectId: expandedProject }); toast.success('File uploaded'); },
    onError: () => { setUploading(false); toast.error('Upload failed'); },
  });
  const deleteAttachment = trpc.credibility.deleteAttachment.useMutation({
    onSuccess: () => { if (expandedProject) utils.credibility.listAttachments.invalidate({ projectId: expandedProject }); toast.success('File removed'); },
  });

  const handleSubmit = () => {
    if (!form.projectName.trim()) { toast.error('Project name is required'); return; }
    const data = {
      projectName: form.projectName,
      address: form.address || undefined,
      city: form.city || undefined,
      state: form.state || undefined,
      purchasePrice: form.purchasePrice ? parseInt(form.purchasePrice) : undefined,
      rehabCost: form.rehabCost ? parseInt(form.rehabCost) : undefined,
      salePrice: form.salePrice ? parseInt(form.salePrice) : undefined,
      profit: form.profit ? parseInt(form.profit) : undefined,
      purchaseDate: form.purchaseDate || undefined,
      saleDate: form.saleDate || undefined,
      daysToComplete: form.daysToComplete ? parseInt(form.daysToComplete) : undefined,
      description: form.description || undefined,
    };
    if (editingId) {
      updateProject.mutate({ id: editingId, ...data });
    } else {
      createProject.mutate(data);
    }
  };

  const startEdit = (project: any) => {
    setEditingId(project.id);
    setForm({
      projectName: project.projectName || '',
      address: project.address || '',
      city: project.city || '',
      state: project.state || '',
      purchasePrice: project.purchasePrice?.toString() || '',
      rehabCost: project.rehabCost?.toString() || '',
      salePrice: project.salePrice?.toString() || '',
      profit: project.profit?.toString() || '',
      purchaseDate: project.purchaseDate || '',
      saleDate: project.saleDate || '',
      daysToComplete: project.daysToComplete?.toString() || '',
      description: project.description || '',
    });
  };

  const triggerUpload = (projectId: number, type: AttachmentType) => {
    setUploadTarget({ projectId, type });
    setExpandedProject(projectId);
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB)'); return; }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      uploadAttachment.mutate({
        projectId: uploadTarget.projectId,
        type: uploadTarget.type,
        base64,
        filename: file.name,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [uploadTarget, uploadAttachment, toast]);

  const fmt = (n: number | null | undefined) => n != null ? `$${n.toLocaleString()}` : '—';

  if (!isAuthenticated) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <Award className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Sign in to manage your track record projects with before/after photos and closing documents.</p>
        </CardContent>
      </Card>
    );
  }

  const projects = projectsQuery.data || [];

  return (
    <div>
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} />

      {/* Add / Edit Project Form */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
            {editingId ? 'Edit Project' : 'Add Completed Project'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="sm:col-span-2">
              <Label className="text-xs mb-1">Project Name *</Label>
              <Input placeholder="e.g. 123 Main St Flip" value={form.projectName} onChange={e => setForm(f => ({ ...f, projectName: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs mb-1">Address</Label>
              <Input placeholder="Property address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs mb-1">City</Label>
              <Input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs mb-1">State</Label>
              <Input placeholder="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs mb-1">Purchase Price</Label>
              <Input type="number" placeholder="150000" value={form.purchasePrice} onChange={e => setForm(f => ({ ...f, purchasePrice: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs mb-1">Rehab Cost</Label>
              <Input type="number" placeholder="45000" value={form.rehabCost} onChange={e => setForm(f => ({ ...f, rehabCost: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs mb-1">Sale Price</Label>
              <Input type="number" placeholder="265000" value={form.salePrice} onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs mb-1">Profit</Label>
              <Input type="number" placeholder="35000" value={form.profit} onChange={e => setForm(f => ({ ...f, profit: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs mb-1">Purchase Date</Label>
              <Input placeholder="MM/YYYY" value={form.purchaseDate} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs mb-1">Sale Date</Label>
              <Input placeholder="MM/YYYY" value={form.saleDate} onChange={e => setForm(f => ({ ...f, saleDate: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs mb-1">Days to Complete</Label>
              <Input type="number" placeholder="120" value={form.daysToComplete} onChange={e => setForm(f => ({ ...f, daysToComplete: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs mb-1">Project Description</Label>
              <Textarea placeholder="Describe the renovation scope, challenges, and outcome..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={createProject.isPending || updateProject.isPending} className="gap-1.5 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
              {editingId ? 'Update Project' : 'Add Project'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project List */}
      {projects.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="p-8 text-center">
            <Building2 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mb-1">No projects yet</p>
            <p className="text-xs text-muted-foreground/70">Add your first completed deal above to start building your credibility portfolio.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isExpanded={expandedProject === project.id}
              onToggle={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              onEdit={() => startEdit(project)}
              onDelete={() => { if (confirm('Delete this project and all its attachments?')) deleteProject.mutate({ id: project.id }); }}
              onUpload={triggerUpload}
              onDeleteAttachment={(id) => deleteAttachment.mutate({ id })}
              uploading={uploading && uploadTarget?.projectId === project.id}
              fmt={fmt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project, isExpanded, onToggle, onEdit, onDelete, onUpload, onDeleteAttachment, uploading, fmt,
}: {
  project: any;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpload: (projectId: number, type: AttachmentType) => void;
  onDeleteAttachment: (id: number) => void;
  uploading: boolean;
  fmt: (n: number | null | undefined) => string;
}) {
  const attachmentsQuery = trpc.credibility.listAttachments.useQuery(
    { projectId: project.id },
    { enabled: isExpanded }
  );
  const attachments = attachmentsQuery.data || [];
  const beforePhotos = attachments.filter(a => a.type === 'before_photo');
  const afterPhotos = attachments.filter(a => a.type === 'after_photo');
  const closingDocs = attachments.filter(a => a.type === 'closing_statement');
  const billOfSale = attachments.filter(a => a.type === 'bill_of_sale');
  const otherDocs = attachments.filter(a => a.type === 'other_document');

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header */}
        <button onClick={onToggle} className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/10 shrink-0">
              <Building2 className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm truncate">{project.projectName}</h4>
              {project.address && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" /> {project.address}{project.city ? `, ${project.city}` : ''}{project.state ? `, ${project.state}` : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {project.profit && (
              <Badge variant="outline" className="text-green-600 border-green-600/30 text-xs">
                {fmt(project.profit)} profit
              </Badge>
            )}
            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t">
            {/* Financial Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Purchase</p>
                <p className="font-bold text-sm">{fmt(project.purchasePrice)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rehab Cost</p>
                <p className="font-bold text-sm">{fmt(project.rehabCost)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Sale Price</p>
                <p className="font-bold text-sm">{fmt(project.salePrice)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Profit</p>
                <p className="font-bold text-sm text-green-600">{fmt(project.profit)}</p>
              </div>
            </div>

            {project.description && (
              <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{project.description}</p>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
              {project.purchaseDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Purchased: {project.purchaseDate}</span>}
              {project.saleDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Sold: {project.saleDate}</span>}
              {project.daysToComplete && <span className="flex items-center gap-1">Timeline: {project.daysToComplete} days</span>}
            </div>

            {/* Before/After Photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" /> Before Photos
                  </h5>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => onUpload(project.id, 'before_photo')} disabled={uploading}>
                    <Upload className="w-3 h-3" /> Add
                  </Button>
                </div>
                {beforePhotos.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-4 text-center text-xs text-muted-foreground/60 cursor-pointer hover:border-[oklch(0.48_0.20_18)]/30 transition-colors" onClick={() => onUpload(project.id, 'before_photo')}>
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
                    Click to upload before photos
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {beforePhotos.map(photo => (
                      <div key={photo.id} className="relative group">
                        <img src={photo.url} alt={photo.filename || 'Before'} className="w-full h-24 object-cover rounded-lg" />
                        <button onClick={() => onDeleteAttachment(photo.id)} className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" /> After Photos
                  </h5>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => onUpload(project.id, 'after_photo')} disabled={uploading}>
                    <Upload className="w-3 h-3" /> Add
                  </Button>
                </div>
                {afterPhotos.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-4 text-center text-xs text-muted-foreground/60 cursor-pointer hover:border-[oklch(0.48_0.20_18)]/30 transition-colors" onClick={() => onUpload(project.id, 'after_photo')}>
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
                    Click to upload after photos
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {afterPhotos.map(photo => (
                      <div key={photo.id} className="relative group">
                        <img src={photo.url} alt={photo.filename || 'After'} className="w-full h-24 object-cover rounded-lg" />
                        <button onClick={() => onDeleteAttachment(photo.id)} className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Closing Documents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5" /> Closing Statements
                  </h5>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => onUpload(project.id, 'closing_statement')} disabled={uploading}>
                    <Upload className="w-3 h-3" /> Add
                  </Button>
                </div>
                {closingDocs.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-3 text-center text-xs text-muted-foreground/60 cursor-pointer hover:border-[oklch(0.48_0.20_18)]/30 transition-colors" onClick={() => onUpload(project.id, 'closing_statement')}>
                    <FileText className="w-5 h-5 mx-auto mb-1 opacity-40" />
                    Upload HUD-1 or closing statement
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {closingDocs.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg group">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[oklch(0.48_0.20_18)] hover:underline truncate flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 shrink-0" /> {doc.filename || 'Closing Statement'}
                        </a>
                        <button onClick={() => onDeleteAttachment(doc.id)} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5" /> Bill of Sale
                  </h5>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => onUpload(project.id, 'bill_of_sale')} disabled={uploading}>
                    <Upload className="w-3 h-3" /> Add
                  </Button>
                </div>
                {billOfSale.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-3 text-center text-xs text-muted-foreground/60 cursor-pointer hover:border-[oklch(0.48_0.20_18)]/30 transition-colors" onClick={() => onUpload(project.id, 'bill_of_sale')}>
                    <FileText className="w-5 h-5 mx-auto mb-1 opacity-40" />
                    Upload bill of sale document
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {billOfSale.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg group">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[oklch(0.48_0.20_18)] hover:underline truncate flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 shrink-0" /> {doc.filename || 'Bill of Sale'}
                        </a>
                        <button onClick={() => onDeleteAttachment(doc.id)} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Other Documents */}
            {otherDocs.length > 0 && (
              <div className="mb-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Other Documents</h5>
                <div className="space-y-1.5">
                  {otherDocs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg group">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[oklch(0.48_0.20_18)] hover:underline truncate flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 shrink-0" /> {doc.filename}
                      </a>
                      <button onClick={() => onDeleteAttachment(doc.id)} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={onEdit}>
                Edit Details
              </Button>
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-destructive hover:text-destructive" onClick={onDelete}>
                <Trash2 className="w-3 h-3" /> Delete
              </Button>
              <Button variant="ghost" size="sm" className="text-xs gap-1 ml-auto" onClick={() => onUpload(project.id, 'other_document')} disabled={uploading}>
                <Upload className="w-3 h-3" /> Upload Other Doc
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Packet Components ──────────────────────────────────────────

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

function PacketDetail({
  packet,
  onBack,
  replaceInText,
  hasProfile,
}: {
  packet: CredibilityPacket;
  onBack: () => void;
  replaceInText: (text: string) => string;
  hasProfile: boolean;
}) {
  const Icon = packet.icon;

  const handlePrint = () => {
    printDocument({
      title: packet.title,
      subtitle: packet.audience,
      sections: packet.sections.map((s) => ({
        heading: replaceInText(s.title),
        body: replaceInText(s.content),
      })),
      footer: hasProfile
        ? `Prepared by ${replaceInText('[Your Company Name]')} using the Freedom One Real Estate Investment System. This document is a template — not legal, financial, or investment advice.`
        : `Prepared using the Freedom One Real Estate Investment System. All bracketed fields [like this] should be customized with your actual business information before distributing. This document is a template — not legal, financial, or investment advice.`,
    });
  };

  return (
    <div>
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1">
        ← Back to all packets
      </button>

      {/* Profile auto-fill banner */}
      {!hasProfile && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-700 dark:text-amber-400">Bracketed fields not yet filled</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              <Link href="/profile" className="text-[oklch(0.48_0.20_18)] hover:underline font-medium">
                Set up your Business Profile →
              </Link>{' '}
              to auto-fill [Your Name], [Company], [Phone], [Email], and other fields across all documents.
            </p>
          </div>
        </div>
      )}

      {hasProfile && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2.5">
          <User className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400">
            Your business profile is auto-filling bracketed fields below.{' '}
            <Link href="/profile" className="underline font-medium">Edit profile →</Link>
          </p>
        </div>
      )}

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
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 shrink-0">
          <Download className="w-3.5 h-3.5" /> Print / Save PDF
        </Button>
      </div>

      {/* Document Preview */}
      <div className="space-y-6 mb-8">
        {packet.sections.map((section, i) => (
          <div key={i}>
            <h3 className="font-bold text-lg mb-2 text-[oklch(0.48_0.20_18)]">{section.title}</h3>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {replaceInText(section.content)}
            </div>
          </div>
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

// ─── Main Page ──────────────────────────────────────────────────

export default function CredibilityPackets() {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('packets');
  const selectedPacket = PACKETS.find(p => p.id === selected);
  const { replaceInText, hasProfile } = useProfileReplacer();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-14 text-center">
          <Award className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Business Credibility Packets</h1>
          <p className="text-[oklch(0.6_0_0)] max-w-2xl mx-auto">
            Professional credibility packets for every audience — sellers, buyers, agents,
            contractors, and private lenders. Includes detailed company information about your fix & flip business,
            before/after project photos, and closing documentation to prove your track record.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <Tabs value={selected ? 'packets' : activeTab} onValueChange={(v) => { setActiveTab(v); if (v === 'track-record') setSelected(null); }}>
          <TabsList className="mb-6">
            <TabsTrigger value="packets" className="gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Credibility Packets
            </TabsTrigger>
            <TabsTrigger value="track-record" className="gap-1.5">
              <Award className="w-3.5 h-3.5" /> Track Record Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packets">
            {selectedPacket ? (
              <PacketDetail
                packet={selectedPacket}
                onBack={() => setSelected(null)}
                replaceInText={replaceInText}
                hasProfile={hasProfile}
              />
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Choose a Packet</h2>
                  <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                    Each packet includes detailed sections about your fix & flip business, investment philosophy,
                    renovation standards, and track record. Click to preview, then print as a professional document.
                    {!hasProfile && (
                      <>
                        {' '}<Link href="/profile" className="text-[oklch(0.48_0.20_18)] hover:underline font-medium">
                          Set up your profile
                        </Link>{' '}to auto-fill your business info.
                      </>
                    )}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PACKETS.map(p => (
                    <PacketCard key={p.id} packet={p} onSelect={() => setSelected(p.id)} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="track-record">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Track Record Manager</h2>
              <p className="text-muted-foreground text-sm max-w-2xl">
                Add your completed fix & flip projects with financial details, before/after photos, and closing
                documents (HUD-1 statements, bills of sale). This builds your credibility portfolio that you can
                reference in any packet and share with sellers, lenders, agents, and partners.
              </p>
            </div>
            <TrackRecordManager />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
