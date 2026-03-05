import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ALL_CONTRACTS, renderContract } from '@/lib/contracts';
import type { ContractTemplate } from '@/lib/contracts';
import { FileText, ChevronDown, ChevronRight, Copy, Check, AlertTriangle, Download, Info, User } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { printDocument } from '@/lib/printDocument';
import { useBranding } from '@/lib/branding';
import { useProfileReplacer } from '@/hooks/useProfileReplacer';
import { Link } from 'wouter';

/**
 * Map profile fields to contract placeholder field IDs.
 * When a user has a profile, these buyer fields are pre-filled.
 */
function getProfilePlaceholderValues(profile: Record<string, string | undefined> | null): Record<string, string> {
  if (!profile) return {};
  const map: Record<string, string> = {};

  if (profile.fullName) {
    map['buyerName'] = `${profile.fullName} and/or Assigns`;
  }
  if (profile.address || profile.city || profile.state || profile.zip) {
    const parts = [profile.address, profile.city, profile.state, profile.zip].filter(Boolean);
    map['buyerAddress'] = parts.join(', ');
  }
  if (profile.phone) {
    map['buyerPhone'] = profile.phone;
  }
  if (profile.email) {
    map['buyerEmail'] = profile.email;
  }

  return map;
}

export default function Contracts() {
  const { branding } = useBranding();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { profile, hasProfile, replaceInText } = useProfileReplacer();

  // Build profile-based placeholder values for contract fields
  const profilePlaceholders = useMemo(() => {
    if (!profile) return {};
    return getProfilePlaceholderValues(profile as unknown as Record<string, string | undefined>);
  }, [profile]);

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast.success('Contract template copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const handlePrint = useCallback((contract: ContractTemplate, renderedText: string) => {
    const paragraphs = renderedText.split(/\n\n+/).filter(p => p.trim());
    const sections: { heading: string; body: string }[] = [];

    paragraphs.forEach((para, i) => {
      if (i === 0) {
        sections.push({ heading: 'Agreement', body: para.trim() });
      } else {
        const headerMatch = para.match(/^(\d+\.\s+[A-Z][A-Z\s/&]+)/m);
        if (headerMatch) {
          const heading = headerMatch[1].replace(/^\d+\.\s+/, '').trim();
          const body = para.replace(headerMatch[0], '').trim();
          sections.push({ heading: heading || `Section ${i}`, body: body || para.trim() });
        } else {
          sections.push({ heading: '', body: para.trim() });
        }
      }
    });

    if (sections.length <= 1) {
      sections.length = 0;
      sections.push({ heading: contract.title, body: renderedText });
    }

    printDocument({
      title: contract.title,
      subtitle: contract.useCase,
      sections,
      footer: `LEGAL DISCLAIMER: This contract template is provided for educational and informational purposes only. It is NOT legal advice. Real estate laws vary by state and locality. You MUST have a licensed real estate attorney in your state review and customize this contract before use. Freedom One System of Real Estate Investing assumes no liability for any consequences arising from the use of this template.`,
      branding,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Contract Templates</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Assignable purchase agreements and wholesale contracts with built-in assignment language. 
            These templates give the purchaser the right to assign the contract to another person or entity.
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="mb-6 p-4 rounded-lg bg-[oklch(0.92_0.06_80)] border border-[oklch(0.85_0.08_80)] flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[oklch(0.55_0.15_80)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[oklch(0.4_0.1_80)] mb-1">Important Legal Notice</p>
            <p className="text-sm text-[oklch(0.35_0.05_80)]">
              These contract templates are provided for educational and informational purposes only. They are NOT legal advice. 
              Real estate laws vary by state and locality. You MUST have a licensed real estate attorney in your state review 
              and customize any contract before use. Using these templates without legal review is at your own risk. 
              Freedom One System of Real Estate Investing assumes no liability for any consequences arising from the use of these templates.
            </p>
            <a href="/disclaimers" className="text-xs text-[oklch(0.48_0.20_18)] hover:underline font-medium mt-1 inline-block">Read full Legal Disclaimers →</a>
          </div>
        </div>

        {/* Profile auto-fill banner */}
        {!hasProfile && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-700 dark:text-amber-400">Auto-fill buyer info</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                <Link href="/profile" className="text-[oklch(0.48_0.20_18)] hover:underline font-medium">
                  Set up your Business Profile →
                </Link>{' '}
                to auto-fill Buyer Name, Address, Phone, and Email in all contract templates.
              </p>
            </div>
          </div>
        )}

        {hasProfile && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2.5">
            <User className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Your business profile is auto-filling buyer fields.{' '}
              <Link href="/profile" className="underline font-medium">Edit profile →</Link>
            </p>
          </div>
        )}

        {/* Contract Templates */}
        <div className="space-y-4">
          {ALL_CONTRACTS.map((contract: ContractTemplate) => {
            const isExpanded = expandedId === contract.id;
            const isCopied = copiedId === contract.id;

            // Build placeholder values: profile auto-fills buyer fields, rest show [Label]
            const placeholderValues: Record<string, string> = {};
            contract.fields.forEach(f => {
              if (profilePlaceholders[f.id]) {
                placeholderValues[f.id] = profilePlaceholders[f.id];
              } else {
                placeholderValues[f.id] = `[${f.label}]`;
              }
            });
            const renderedText = replaceInText(renderContract(contract, placeholderValues));

            return (
              <Collapsible key={contract.id} open={isExpanded}>
                <Card className="hover:shadow-sm transition-shadow">
                  <CollapsibleTrigger
                    onClick={() => setExpandedId(isExpanded ? null : contract.id)}
                    className="w-full text-left"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{contract.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <CardTitle className="text-lg">{contract.title}</CardTitle>
                          </div>
                          <p className="text-sm text-muted-foreground">{contract.description}</p>
                          <p className="text-xs text-muted-foreground mt-1 italic">{contract.useCase}</p>
                        </div>
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-1" /> : <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {/* Fields needed */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs font-semibold text-muted-foreground mr-1">Fields to fill in:</span>
                        {contract.fields.map((f) => (
                          <Badge
                            key={f.id}
                            variant={profilePlaceholders[f.id] ? 'default' : 'outline'}
                            className={`text-xs ${profilePlaceholders[f.id] ? 'bg-green-600/80 text-white' : ''}`}
                          >
                            {f.label} {profilePlaceholders[f.id] ? '✓' : f.required ? '*' : ''}
                          </Badge>
                        ))}
                      </div>

                      {/* Rendered Contract */}
                      <div className="relative">
                        <pre className="p-4 rounded-lg bg-secondary/60 text-sm whitespace-pre-wrap font-sans leading-relaxed max-h-[600px] overflow-y-auto">
                          {renderedText}
                        </pre>
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1.5"
                            onClick={(e) => { e.stopPropagation(); handlePrint(contract, renderedText); }}
                          >
                            <Download className="w-3.5 h-3.5" /> Print
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1.5"
                            onClick={(e) => { e.stopPropagation(); handleCopy(contract.id, renderedText); }}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {isCopied ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}
