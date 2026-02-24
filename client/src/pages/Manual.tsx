import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MANUAL_SECTIONS } from '@/lib/manual';
import type { ManualSection } from '@/lib/manual';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Streamdown } from 'streamdown';

export default function Manual() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const current = MANUAL_SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">User Manual</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Step-by-step guide to using every feature of the Fix & Flip Analyzer.
          </p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-1">
            {MANUAL_SECTIONS.map((section: ManualSection) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-2.5 transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-secondary/60 text-muted-foreground'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-sm">{section.title}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <Card>
            <CardContent className="p-6">
              {current && (
                <div className="prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-semibold">
                  <Streamdown>{current.content}</Streamdown>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
