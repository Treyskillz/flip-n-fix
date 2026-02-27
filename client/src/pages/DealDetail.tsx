import { useState, useMemo } from 'react';
import { useRoute, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ArrowLeft, MapPin, DollarSign, TrendingUp, Clock,
  Users, Plus, Trash2, Edit, Phone, Mail, Building2,
  FileText, Send, MessageSquare, CheckCircle2, XCircle,
  Target, AlertCircle, Calendar, Briefcase, Save
} from 'lucide-react';
import { ALL_CONTRACTS, ContractTemplate } from '@/lib/contracts';
import { openEmailClient, getDeliverySummary } from '@/lib/documentDelivery';

const fmt = (n: number | null | undefined) => {
  if (n == null) return '—';
  return '$' + n.toLocaleString();
};

const ROLE_LABELS: Record<string, string> = {
  seller: 'Seller', buyer: 'Buyer', listing_agent: 'Listing Agent',
  buyers_agent: "Buyer's Agent", title_company: 'Title Company',
  attorney: 'Attorney', contractor: 'Contractor', lender: 'Lender',
  wholesaler: 'Wholesaler', partner: 'Partner', other: 'Other',
};

const ACTIVITY_ICONS: Record<string, typeof MessageSquare> = {
  note: MessageSquare, stage_change: Target, contact_added: Users,
  document_sent: Send, offer_made: FileText, counter_received: AlertCircle,
  inspection: CheckCircle2, appraisal: DollarSign, closing_scheduled: Calendar,
  rehab_update: Building2, listing_update: Building2, other: MessageSquare,
};

const STAGES = [
  'lead', 'analyzing', 'offer_submitted', 'under_contract',
  'closing', 'rehab', 'listed', 'sold', 'dead',
] as const;

// ─── Add Contact Dialog ───────────────────────────────────
function AddContactDialog({ dealId, open, onClose, onCreated }: { dealId: number; open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', role: 'other', phone: '', email: '', company: '', notes: '' });
  const createContact = trpc.pipeline.createContact.useMutation({
    onSuccess: () => { toast.success('Contact added'); onCreated(); onClose(); setForm({ name: '', role: 'other', phone: '', email: '', company: '', notes: '' }); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)] text-white">
        <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Name *</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Role</Label>
            <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
              <SelectTrigger className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-[oklch(0.6_0_0)]">Phone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 123-4567" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
            </div>
            <div>
              <Label className="text-xs text-[oklch(0.6_0_0)]">Email</Label>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@email.com" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Company</Label>
            <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="ABC Realty" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)]">Cancel</Button>
          <Button onClick={() => createContact.mutate({ dealId, name: form.name, role: form.role as any, phone: form.phone || undefined, email: form.email || undefined, company: form.company || undefined, notes: form.notes || undefined })} disabled={createContact.isPending || !form.name.trim()} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            {createContact.isPending ? 'Adding...' : 'Add Contact'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Send Document Dialog ─────────────────────────────────
function SendDocumentDialog({ deal, contacts, open, onClose, onSent }: { deal: any; contacts: any[]; open: boolean; onClose: () => void; onSent: () => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const profileQuery = trpc.profile.get.useQuery();
  const addActivity = trpc.pipeline.addActivity.useMutation({
    onSuccess: () => { onSent(); onClose(); },
    onError: (err) => toast.error(err.message),
  });

  const emailContacts = contacts.filter(c => c.email);
  const template = ALL_CONTRACTS.find(c => c.id === selectedTemplate);
  const contact = contacts.find(c => c.id === Number(selectedContactId));

  const handleSend = () => {
    if (!template || !contact?.email) { toast.error('Select a template and contact with email'); return; }
    const profile = profileQuery.data;

    // Build field values from deal data
    const fieldValues: Record<string, string> = {
      effectiveDate: new Date().toLocaleDateString(),
      buyerName: profile?.fullName || '[Your Name]',
      buyerAddress: [profile?.address, profile?.city, profile?.state, profile?.zip].filter(Boolean).join(', ') || '[Your Address]',
      buyerPhone: profile?.phone || '[Your Phone]',
      buyerEmail: profile?.email || '[Your Email]',
      sellerName: contact.name,
      sellerAddress: '',
      sellerPhone: contact.phone || '',
      propertyAddress: deal.propertyAddress,
      purchasePrice: deal.purchasePrice ? deal.purchasePrice.toLocaleString() : '',
    };

    const deliveryOptions = {
      template,
      fieldValues,
      recipient: { name: contact.name, email: contact.email, role: ROLE_LABELS[contact.role] || contact.role },
      senderName: profile?.fullName || 'Investor',
      senderCompany: profile?.companyName || '',
      senderEmail: profile?.email || '',
      senderPhone: profile?.phone || '',
      personalMessage: personalMessage || undefined,
      propertyAddress: deal.propertyAddress,
    };

    // Open email client
    openEmailClient(deliveryOptions);

    // Log activity
    const summary = getDeliverySummary(deliveryOptions);
    addActivity.mutate({
      dealId: deal.id,
      type: 'document_sent',
      title: summary.title,
      description: summary.description,
      metadata: summary.metadata,
    });

    toast.success(`Opening email to ${contact.name} with ${template.title}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)] text-white">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Send className="w-4 h-4 text-[oklch(0.48_0.20_18)]" /> Send Document</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Contract / Document</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white"><SelectValue placeholder="Select a contract template" /></SelectTrigger>
              <SelectContent>
                {ALL_CONTRACTS.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.icon} {c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Send To</Label>
            {emailContacts.length === 0 ? (
              <p className="text-xs text-[oklch(0.65_0.18_18)] mt-1">No contacts with email addresses. Add a contact with an email first.</p>
            ) : (
              <Select value={selectedContactId} onValueChange={setSelectedContactId}>
                <SelectTrigger className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white"><SelectValue placeholder="Select a contact" /></SelectTrigger>
                <SelectContent>
                  {emailContacts.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name} ({ROLE_LABELS[c.role] || c.role}) — {c.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Personal Message (optional)</Label>
            <Textarea value={personalMessage} onChange={e => setPersonalMessage(e.target.value)} rows={3} placeholder="Add a personal note to the recipient..." className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
          </div>
          {template && (
            <div className="p-2 rounded bg-[oklch(0.12_0_0)] border border-[oklch(0.25_0_0)]">
              <p className="text-xs text-[oklch(0.5_0_0)]">Preview: {template.title}</p>
              <p className="text-[10px] text-[oklch(0.4_0_0)] mt-1">{template.description}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)]">Cancel</Button>
          <Button onClick={handleSend} disabled={!template || !contact?.email || addActivity.isPending} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            <Send className="w-3.5 h-3.5 mr-1" /> Send via Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Note Dialog ──────────────────────────────────────
function AddNoteDialog({ dealId, open, onClose, onCreated }: { dealId: number; open: boolean; onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('note');
  const addActivity = trpc.pipeline.addActivity.useMutation({
    onSuccess: () => { toast.success('Note added'); onCreated(); onClose(); setTitle(''); setDescription(''); setType('note'); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)] text-white">
        <DialogHeader><DialogTitle>Add Activity Note</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="offer_made">Offer Made</SelectItem>
                <SelectItem value="counter_received">Counter Received</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="appraisal">Appraisal</SelectItem>
                <SelectItem value="closing_scheduled">Closing Scheduled</SelectItem>
                <SelectItem value="rehab_update">Rehab Update</SelectItem>
                <SelectItem value="listing_update">Listing Update</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Title *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Seller countered at $185K" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Details</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Additional details..." className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)]">Cancel</Button>
          <Button onClick={() => addActivity.mutate({ dealId, type: type as any, title, description: description || undefined })} disabled={addActivity.isPending || !title.trim()} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            {addActivity.isPending ? 'Adding...' : 'Add Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Deal Detail Page ────────────────────────────────
export default function DealDetail() {
  const [, params] = useRoute('/pipeline/:id');
  const [, navigate] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const dealId = Number(params?.id);

  const [addContactOpen, setAddContactOpen] = useState(false);
  const [sendDocOpen, setSendDocOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const utils = trpc.useUtils();
  const dealsQuery = trpc.pipeline.listDeals.useQuery(undefined, { enabled: isAuthenticated });
  const contactsQuery = trpc.pipeline.listContacts.useQuery({ dealId }, { enabled: isAuthenticated && !!dealId });
  const activitiesQuery = trpc.pipeline.listActivities.useQuery({ dealId }, { enabled: isAuthenticated && !!dealId });
  const updateDeal = trpc.pipeline.updateDeal.useMutation({
    onSuccess: () => { toast.success('Deal updated'); utils.pipeline.listDeals.invalidate(); setEditMode(false); },
    onError: (err) => toast.error(err.message),
  });
  const deleteContact = trpc.pipeline.deleteContact.useMutation({
    onSuccess: () => { toast.success('Contact removed'); utils.pipeline.listContacts.invalidate(); },
    onError: (err) => toast.error(err.message),
  });
  const deleteDeal = trpc.pipeline.deleteDeal.useMutation({
    onSuccess: () => { toast.success('Deal deleted'); navigate('/pipeline'); },
    onError: (err) => toast.error(err.message),
  });

  const deal = useMemo(() => dealsQuery.data?.find((d: any) => d.id === dealId), [dealsQuery.data, dealId]);

  const handleRefresh = () => {
    utils.pipeline.listContacts.invalidate();
    utils.pipeline.listActivities.invalidate();
    utils.pipeline.listDeals.invalidate();
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[oklch(0.48_0.20_18)]" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-4">Sign in to view deal details.</p>
          <Button asChild className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
      </div>
    );
  }

  if (!deal && !dealsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-[oklch(0.5_0_0)]" />
          <h2 className="text-xl font-bold mb-2">Deal Not Found</h2>
          <Button variant="outline" onClick={() => navigate('/pipeline')} className="mt-2"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Pipeline</Button>
        </div>
      </div>
    );
  }

  if (!deal) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[oklch(0.48_0.20_18)]" /></div>;
  }

  const tags = deal.tags ? JSON.parse(deal.tags) : [];
  const daysInStage = deal.stageEnteredAt ? Math.floor((Date.now() - new Date(deal.stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-[oklch(0.25_0_0)] bg-[oklch(0.12_0_0)]">
        <div className="container py-4">
          <button onClick={() => navigate('/pipeline')} className="flex items-center gap-1 text-xs text-[oklch(0.5_0_0)] hover:text-white transition-colors mb-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Pipeline
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{deal.propertyAddress}</h1>
              {deal.city && (
                <p className="text-sm text-[oklch(0.5_0_0)] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {deal.city}{deal.state ? `, ${deal.state}` : ''} {deal.zip || ''}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(0.48_0.20_18/0.15)] text-[oklch(0.65_0.18_18)] font-medium capitalize">
                  {deal.stage.replace('_', ' ')}
                </span>
                {daysInStage != null && (
                  <span className="text-xs text-[oklch(0.5_0_0)] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {daysInStage} days in stage
                  </span>
                )}
                {tags.map((tag: string) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[oklch(0.25_0_0)] text-[oklch(0.6_0_0)]">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSendDocOpen(true)} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)] hover:bg-white/5 text-xs">
                <Send className="w-3.5 h-3.5 mr-1" /> Send Document
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setEditMode(true); setEditForm({ ...deal }); }} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)] hover:bg-white/5 text-xs">
                <Edit className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Deal Info + Contacts */}
          <div className="lg:col-span-1 space-y-4">
            {/* Financials */}
            <div className="rounded-lg border border-[oklch(0.25_0_0)] bg-[oklch(0.13_0_0)] p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[oklch(0.65_0.18_145)]" /> Financials
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[oklch(0.5_0_0)]">Purchase Price</span><span className="text-white font-medium">{fmt(deal.purchasePrice)}</span></div>
                <div className="flex justify-between"><span className="text-[oklch(0.5_0_0)]">ARV</span><span className="text-white font-medium">{fmt(deal.arv)}</span></div>
                <div className="flex justify-between"><span className="text-[oklch(0.5_0_0)]">Rehab Cost</span><span className="text-white font-medium">{fmt(deal.rehabCost)}</span></div>
                <div className="flex justify-between border-t border-[oklch(0.25_0_0)] pt-2">
                  <span className="text-[oklch(0.5_0_0)] font-medium">Est. Profit</span>
                  <span className={`font-bold ${(deal.estimatedProfit || 0) > 0 ? 'text-[oklch(0.65_0.18_145)]' : 'text-[oklch(0.65_0.18_18)]'}`}>{fmt(deal.estimatedProfit)}</span>
                </div>
                {deal.dealScore && (
                  <div className="flex justify-between"><span className="text-[oklch(0.5_0_0)]">Deal Score</span><span className="text-white font-medium">{deal.dealScore}/100</span></div>
                )}
              </div>
            </div>

            {/* Contacts */}
            <div className="rounded-lg border border-[oklch(0.25_0_0)] bg-[oklch(0.13_0_0)] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[oklch(0.65_0.15_250)]" /> Contacts
                </h3>
                <button onClick={() => setAddContactOpen(true)} className="p-1 rounded hover:bg-white/10 transition-colors">
                  <Plus className="w-4 h-4 text-[oklch(0.5_0_0)]" />
                </button>
              </div>
              {contactsQuery.isLoading && <p className="text-xs text-[oklch(0.4_0_0)]">Loading...</p>}
              {contactsQuery.data?.length === 0 && (
                <p className="text-xs text-[oklch(0.4_0_0)] text-center py-3">No contacts yet. Add sellers, agents, or contractors.</p>
              )}
              <div className="space-y-2">
                {contactsQuery.data?.map((contact: any) => (
                  <div key={contact.id} className="p-2 rounded bg-[oklch(0.16_0_0)] border border-[oklch(0.22_0_0)] group">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{contact.name}</p>
                        <p className="text-[10px] text-[oklch(0.48_0.20_18)] capitalize">{ROLE_LABELS[contact.role] || contact.role}</p>
                      </div>
                      <button onClick={() => deleteContact.mutate({ id: contact.id })} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all">
                        <Trash2 className="w-3 h-3 text-[oklch(0.5_0_0)]" />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="text-[10px] text-[oklch(0.55_0_0)] hover:text-white flex items-center gap-0.5 transition-colors">
                          <Phone className="w-3 h-3" /> {contact.phone}
                        </a>
                      )}
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="text-[10px] text-[oklch(0.55_0_0)] hover:text-white flex items-center gap-0.5 transition-colors">
                          <Mail className="w-3 h-3" /> {contact.email}
                        </a>
                      )}
                    </div>
                    {contact.company && <p className="text-[10px] text-[oklch(0.4_0_0)] mt-1 flex items-center gap-0.5"><Briefcase className="w-3 h-3" /> {contact.company}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {deal.notes && (
              <div className="rounded-lg border border-[oklch(0.25_0_0)] bg-[oklch(0.13_0_0)] p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Notes</h3>
                <p className="text-sm text-[oklch(0.6_0_0)] whitespace-pre-wrap">{deal.notes}</p>
              </div>
            )}

            {/* Danger Zone */}
            <div className="rounded-lg border border-[oklch(0.65_0.18_18/0.2)] bg-[oklch(0.13_0_0)] p-4">
              <Button variant="outline" size="sm" onClick={() => { if (confirm('Delete this deal and all related contacts/activities?')) deleteDeal.mutate({ id: deal.id }); }} className="w-full border-[oklch(0.65_0.18_18/0.3)] text-[oklch(0.65_0.18_18)] hover:bg-[oklch(0.65_0.18_18/0.1)] text-xs">
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Deal
              </Button>
            </div>
          </div>

          {/* Right: Activity Timeline */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-[oklch(0.25_0_0)] bg-[oklch(0.13_0_0)] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[oklch(0.65_0.15_60)]" /> Activity Timeline
                </h3>
                <Button size="sm" variant="outline" onClick={() => setAddNoteOpen(true)} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)] hover:bg-white/5 text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Note
                </Button>
              </div>
              {activitiesQuery.isLoading && <p className="text-xs text-[oklch(0.4_0_0)]">Loading...</p>}
              {activitiesQuery.data?.length === 0 && (
                <p className="text-xs text-[oklch(0.4_0_0)] text-center py-6">No activity yet. Add notes, send documents, or move the deal to a new stage.</p>
              )}
              <div className="space-y-0">
                {activitiesQuery.data?.map((activity: any, i: number) => {
                  const Icon = ACTIVITY_ICONS[activity.type] || MessageSquare;
                  const isLast = i === (activitiesQuery.data?.length || 0) - 1;
                  return (
                    <div key={activity.id} className="flex gap-3">
                      {/* Timeline line + dot */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-[oklch(0.20_0_0)] border border-[oklch(0.3_0_0)] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-[oklch(0.55_0_0)]" />
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-[oklch(0.25_0_0)] min-h-[20px]" />}
                      </div>
                      {/* Content */}
                      <div className="pb-4 flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        {activity.description && <p className="text-xs text-[oklch(0.55_0_0)] mt-0.5">{activity.description}</p>}
                        <p className="text-[10px] text-[oklch(0.4_0_0)] mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddContactDialog dealId={dealId} open={addContactOpen} onClose={() => setAddContactOpen(false)} onCreated={handleRefresh} />
      <SendDocumentDialog deal={deal} contacts={contactsQuery.data || []} open={sendDocOpen} onClose={() => setSendDocOpen(false)} onSent={handleRefresh} />
      <AddNoteDialog dealId={dealId} open={addNoteOpen} onClose={() => setAddNoteOpen(false)} onCreated={handleRefresh} />

      {/* Edit Deal Dialog */}
      {editMode && (
        <Dialog open={editMode} onOpenChange={() => setEditMode(false)}>
          <DialogContent className="max-w-lg bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)] text-white">
            <DialogHeader><DialogTitle>Edit Deal</DialogTitle></DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <Label className="text-xs text-[oklch(0.6_0_0)]">Property Address</Label>
                <Input value={editForm.propertyAddress || ''} onChange={e => setEditForm((f: any) => ({ ...f, propertyAddress: e.target.value }))} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label className="text-xs text-[oklch(0.6_0_0)]">City</Label><Input value={editForm.city || ''} onChange={e => setEditForm((f: any) => ({ ...f, city: e.target.value }))} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" /></div>
                <div><Label className="text-xs text-[oklch(0.6_0_0)]">State</Label><Input value={editForm.state || ''} onChange={e => setEditForm((f: any) => ({ ...f, state: e.target.value }))} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" /></div>
                <div><Label className="text-xs text-[oklch(0.6_0_0)]">ZIP</Label><Input value={editForm.zip || ''} onChange={e => setEditForm((f: any) => ({ ...f, zip: e.target.value }))} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" /></div>
              </div>
              <div>
                <Label className="text-xs text-[oklch(0.6_0_0)]">Stage</Label>
                <Select value={editForm.stage || 'lead'} onValueChange={v => setEditForm((f: any) => ({ ...f, stage: v }))}>
                  <SelectTrigger className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs text-[oklch(0.6_0_0)]">Purchase Price</Label><Input type="number" value={editForm.purchasePrice || ''} onChange={e => setEditForm((f: any) => ({ ...f, purchasePrice: e.target.value ? Number(e.target.value) : null }))} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" /></div>
                <div><Label className="text-xs text-[oklch(0.6_0_0)]">ARV</Label><Input type="number" value={editForm.arv || ''} onChange={e => setEditForm((f: any) => ({ ...f, arv: e.target.value ? Number(e.target.value) : null }))} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" /></div>
                <div><Label className="text-xs text-[oklch(0.6_0_0)]">Rehab Cost</Label><Input type="number" value={editForm.rehabCost || ''} onChange={e => setEditForm((f: any) => ({ ...f, rehabCost: e.target.value ? Number(e.target.value) : null }))} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" /></div>
                <div><Label className="text-xs text-[oklch(0.6_0_0)]">Est. Profit</Label><Input type="number" value={editForm.estimatedProfit || ''} onChange={e => setEditForm((f: any) => ({ ...f, estimatedProfit: e.target.value ? Number(e.target.value) : null }))} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" /></div>
              </div>
              <div><Label className="text-xs text-[oklch(0.6_0_0)]">Notes</Label><Textarea value={editForm.notes || ''} onChange={e => setEditForm((f: any) => ({ ...f, notes: e.target.value }))} rows={3} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" /></div>
              {editForm.stage === 'dead' && (
                <div><Label className="text-xs text-[oklch(0.6_0_0)]">Dead Reason</Label><Input value={editForm.deadReason || ''} onChange={e => setEditForm((f: any) => ({ ...f, deadReason: e.target.value }))} placeholder="Why did this deal die?" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" /></div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditMode(false)} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)]">Cancel</Button>
              <Button onClick={() => updateDeal.mutate({ id: deal.id, propertyAddress: editForm.propertyAddress, city: editForm.city || null, state: editForm.state || null, zip: editForm.zip || null, stage: editForm.stage, purchasePrice: editForm.purchasePrice, arv: editForm.arv, rehabCost: editForm.rehabCost, estimatedProfit: editForm.estimatedProfit, notes: editForm.notes || null, deadReason: editForm.deadReason || null })} disabled={updateDeal.isPending} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
                <Save className="w-3.5 h-3.5 mr-1" /> {updateDeal.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
