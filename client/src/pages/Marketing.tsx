import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MARKETING_TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/marketing';
import { Megaphone, ChevronDown, ChevronRight, Copy, Check, Lightbulb, Download } from 'lucide-react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { printDocument } from '@/lib/printDocument';

export default function Marketing() {
  const [activeCategory, setActiveCategory] = useState<string>('letter');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? MARKETING_TEMPLATES
    : MARKETING_TEMPLATES.filter(t => t.category === activeCategory);

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast.success('Template copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const handlePrint = useCallback((template: typeof MARKETING_TEMPLATES[0]) => {
    // Split the body into logical paragraphs as sections
    const paragraphs = template.body.split(/\n\n+/).filter(p => p.trim());
    const sections = paragraphs.map((para, i) => ({
      heading: i === 0 ? template.title : '',
      body: para.trim(),
    }));

    printDocument({
      title: template.title,
      subtitle: `${template.category.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} — Target: ${template.target}`,
      sections,
      footer: `Marketing template from the Freedom One Real Estate Investment System. Customize all bracketed fields with your business information before use. This is a template — not legal or financial advice.`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[oklch(0.92_0.06_25)]">
              <Megaphone className="w-6 h-6 text-[oklch(0.55_0.22_25)]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Marketing Templates</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Ready-to-use marketing materials for property acquisition. Customize these templates with your information 
            and start generating motivated seller leads immediately.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TEMPLATE_CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              size="sm"
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat.id)}
              className="gap-1.5"
            >
              <span>{cat.icon}</span> {cat.label}
            </Button>
          ))}
        </div>

        {/* Templates */}
        <div className="space-y-4">
          {filtered.map(template => {
            const isExpanded = expandedId === template.id;
            const isCopied = copiedId === template.id;

            return (
              <Collapsible key={template.id} open={isExpanded}>
                <Card className="hover:shadow-sm transition-shadow">
                  <CollapsibleTrigger
                    onClick={() => setExpandedId(isExpanded ? null : template.id)}
                    className="w-full text-left"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <CardTitle className="text-base">{template.title}</CardTitle>
                            <Badge variant="outline" className="text-xs capitalize">{template.category.replace('_', ' ')}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">Target:</span> {template.target}
                          </p>
                        </div>
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-1" /> : <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {/* Template Body */}
                      <div className="relative">
                        <pre className="p-4 rounded-lg bg-secondary/60 text-sm whitespace-pre-wrap font-sans leading-relaxed max-h-[500px] overflow-y-auto">
                          {template.body}
                        </pre>
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1.5"
                            onClick={(e) => { e.stopPropagation(); handlePrint(template); }}
                          >
                            <Download className="w-3.5 h-3.5" /> Print
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1.5"
                            onClick={(e) => { e.stopPropagation(); handleCopy(template.id, template.body); }}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {isCopied ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>

                      {/* Tips */}
                      {template.tips.length > 0 && (
                        <div className="p-3 rounded-lg bg-[oklch(0.92_0.06_80)] border border-[oklch(0.85_0.08_80)]">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Lightbulb className="w-4 h-4 text-[oklch(0.55_0.15_80)]" />
                            <span className="text-sm font-semibold text-[oklch(0.4_0.1_80)]">Pro Tips</span>
                          </div>
                          <ul className="space-y-1">
                            {template.tips.map((tip, i) => (
                              <li key={i} className="text-sm text-[oklch(0.35_0.05_80)] flex gap-2">
                                <span className="text-[oklch(0.55_0.15_80)] shrink-0">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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
