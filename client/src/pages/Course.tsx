import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { COURSE_MODULES } from '@/lib/course';
import type { CourseModule, CourseLesson } from '@/lib/course';
import { VIDEO_SCRIPTS } from '@/lib/videoScripts';
import type { VideoScript, VideoSegment } from '@/lib/videoScripts';
import {
  GraduationCap, ChevronDown, ChevronRight, BookOpen, Clock,
  PlayCircle, Video, FileText, Camera, Monitor, Presentation,
  PenLine, Clapperboard, Eye, EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { Streamdown } from 'streamdown';

// Segment type icons
const SEGMENT_ICONS: Record<string, typeof Camera> = {
  'talking-head': Camera,
  'screen-recording': Monitor,
  'slides': Presentation,
  'b-roll': Clapperboard,
  'whiteboard': PenLine,
};

const SEGMENT_LABELS: Record<string, string> = {
  'talking-head': 'On Camera',
  'screen-recording': 'Screen Recording',
  'slides': 'Slides',
  'b-roll': 'B-Roll',
  'whiteboard': 'Whiteboard',
};

function SegmentBadge({ type }: { type: VideoSegment['type'] }) {
  const Icon = SEGMENT_ICONS[type] || Camera;
  const label = SEGMENT_LABELS[type] || type;
  return (
    <Badge variant="outline" className="text-xs flex items-center gap-1 shrink-0">
      <Icon className="w-3 h-3" /> {label}
    </Badge>
  );
}

function VideoScriptViewer({ script }: { script: VideoScript }) {
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);

  return (
    <div className="mt-6 border border-[oklch(0.50_0.18_25)]/20 bg-[oklch(0.50_0.18_25)]/5">
      {/* Script Header */}
      <div className="p-4 border-b border-[oklch(0.50_0.18_25)]/20 bg-[oklch(0.50_0.18_25)]/10">
        <div className="flex items-center gap-2 mb-2">
          <Clapperboard className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
          <h3 className="font-bold text-sm">Video Production Script</h3>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Runtime: {script.estimatedRuntime}
          </span>
          <span className="flex items-center gap-1">
            <Camera className="w-3 h-3" /> {script.equipment}
          </span>
        </div>
      </div>

      {/* Opening Hook */}
      <div className="p-4 border-b border-border/50">
        <p className="text-xs font-semibold text-[oklch(0.50_0.18_25)] uppercase tracking-wider mb-1">Opening Hook</p>
        <p className="text-sm italic text-foreground/80">{script.openingHook}</p>
      </div>

      {/* Segments */}
      <div className="divide-y divide-border/50">
        {script.segments.map((seg, i) => {
          const isExpanded = expandedSegment === i;
          return (
            <div key={i} className="group">
              <button
                onClick={() => setExpandedSegment(isExpanded ? null : i)}
                className="w-full text-left p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-[oklch(0.50_0.18_25)]/15 text-[oklch(0.50_0.18_25)] text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{seg.title}</span>
                      <SegmentBadge type={seg.type} />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {seg.duration}
                      </span>
                    </div>
                  </div>
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  }
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 ml-9 space-y-3">
                  {/* Script Text */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Script</p>
                    <div className="text-sm leading-relaxed whitespace-pre-line bg-background/80 p-3 border border-border/50">
                      {seg.script}
                    </div>
                  </div>
                  {/* Directions */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Production Directions</p>
                    <p className="text-sm text-muted-foreground italic bg-background/80 p-3 border border-border/50">
                      {seg.directions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Closing CTA */}
      <div className="p-4 border-t border-border/50">
        <p className="text-xs font-semibold text-[oklch(0.50_0.18_25)] uppercase tracking-wider mb-1">Closing CTA</p>
        <p className="text-sm font-medium">{script.closingCTA}</p>
      </div>

      {/* B-Roll Suggestions */}
      {script.bRollSuggestions.length > 0 && (
        <div className="p-4 border-t border-border/50 bg-secondary/20">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">B-Roll Suggestions</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {script.bRollSuggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2">
                <Clapperboard className="w-3 h-3 mt-1 shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function VideoPlaceholder({ lessonId, script }: { lessonId: string; script?: VideoScript }) {
  const duration = script?.estimatedRuntime || '—';
  const segmentCount = script?.segments.length || 0;

  return (
    <div className="mb-6">
      <div className="relative bg-[oklch(0.15_0.01_25)] overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Center play button area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center bg-[oklch(0.50_0.18_25)] transition-transform hover:scale-105">
            <PlayCircle className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm mt-1">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {duration}
              </span>
              {segmentCount > 0 && (
                <span className="ml-3 inline-flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> {segmentCount} segments
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Coming Soon badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-[oklch(0.50_0.18_25)] text-white border-none text-xs flex items-center gap-1.5 px-3 py-1">
            <Video className="w-3.5 h-3.5" />
            Video Coming Soon
          </Badge>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[oklch(0.25_0.01_25)]">
          <div className="h-full w-0 bg-[oklch(0.50_0.18_25)]" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center italic">
        Video lesson will be available here. {script ? 'Toggle the script below to view the production script.' : 'Follow along with the written content below.'}
      </p>
    </div>
  );
}

export default function Course() {
  const [expandedModule, setExpandedModule] = useState<string | null>('mod-1');
  const [activeLesson, setActiveLesson] = useState<string | null>('l-1-1');
  const [showScript, setShowScript] = useState(false);

  const currentModule = COURSE_MODULES.find(m => m.id === expandedModule);
  const currentLesson = currentModule?.lessons.find(l => l.id === activeLesson);
  const currentScript = activeLesson ? VIDEO_SCRIPTS[activeLesson] : undefined;

  const totalLessons = COURSE_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalScripts = Object.keys(VIDEO_SCRIPTS).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[oklch(0.92_0.06_25)]">
              <GraduationCap className="w-6 h-6 text-[oklch(0.50_0.18_25)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Fix & Flip Mastery 2026</h1>
              <p className="text-sm text-muted-foreground">
                Complete Course — {COURSE_MODULES.length} Modules • {totalLessons} Video Lessons
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            A comprehensive course covering every aspect of real estate investing — from finding deals and analyzing properties 
            to all five major exit strategies: Fix & Flip, Wholesaling, BRRRR, Subject-To, and Short-Term Rentals.
          </p>

          {/* Course Stats Bar */}
          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
              <span>{totalLessons} Video Lessons</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
              <span>Written Guides Included</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clapperboard className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
              <span>{totalScripts} Production Scripts</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
              <span>~8 Hours Total</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar: Module List */}
          <div className="space-y-2">
            {COURSE_MODULES.map((mod: CourseModule) => {
              const isExpanded = expandedModule === mod.id;
              return (
                <Collapsible key={mod.id} open={isExpanded}>
                  <Card className={`transition-all ${isExpanded ? 'border-primary shadow-sm' : ''}`}>
                    <CollapsibleTrigger
                      onClick={() => {
                        setExpandedModule(isExpanded ? null : mod.id);
                        if (!isExpanded && mod.lessons.length > 0) {
                          setActiveLesson(mod.lessons[0].id);
                          setShowScript(false);
                        }
                      }}
                      className="w-full text-left"
                    >
                      <CardHeader className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{mod.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Module {mod.number}</p>
                            <CardTitle className="text-sm leading-tight">{mod.title}</CardTitle>
                          </div>
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-3 px-3">
                        <div className="space-y-1 ml-8">
                          {mod.lessons.map((lesson: CourseLesson) => {
                            const hasScript = !!VIDEO_SCRIPTS[lesson.id];
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  setActiveLesson(lesson.id);
                                  setShowScript(false);
                                }}
                                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                                  activeLesson === lesson.id
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'hover:bg-secondary/60 text-muted-foreground'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span className="flex-1 truncate">{lesson.title}</span>
                                  {hasScript && (
                                    <FileText className="w-3 h-3 shrink-0 text-[oklch(0.50_0.18_25)]" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1 ml-5.5 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs">{lesson.duration}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>

          {/* Main Content: Active Lesson */}
          <div>
            {currentLesson ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Module {currentModule?.number}
                      </Badge>
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {currentLesson.duration}
                      </Badge>
                      {currentScript && (
                        <Badge className="text-xs flex items-center gap-1 bg-[oklch(0.50_0.18_25)] text-white border-none">
                          <FileText className="w-3 h-3" /> Script Available
                        </Badge>
                      )}
                    </div>
                    {currentScript && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowScript(!showScript)}
                        className="text-xs gap-1.5"
                      >
                        {showScript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showScript ? 'Hide Script' : 'View Script'}
                      </Button>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Video Placeholder */}
                  <VideoPlaceholder lessonId={currentLesson.id} script={currentScript} />

                  {/* Video Script Viewer (toggled) */}
                  {showScript && currentScript && (
                    <VideoScriptViewer script={currentScript} />
                  )}

                  {/* Written Content */}
                  <div className={`prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:p-2 [&_th]:bg-secondary/60 [&_th]:font-semibold [&_td]:p-2 [&_td]:border-b [&_td]:border-border/50 [&_strong]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground ${showScript ? 'mt-6' : ''}`}>
                    <Streamdown>{currentLesson.content}</Streamdown>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Select a lesson to begin</p>
                  <p className="text-sm text-muted-foreground">Choose a module and lesson from the sidebar to start learning.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Course Disclaimer */}
        <div className="mt-8 p-4 bg-secondary/40 border border-border/50 rounded-lg">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-[oklch(0.48_0.20_18)] shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>
                <strong>Educational Disclaimer:</strong> This course is provided for educational and informational purposes only. 
                The strategies, techniques, and information presented are based on general real estate investing principles and 
                do not constitute professional financial, legal, or investment advice.
              </p>
              <p>
                We do not guarantee any specific results, outcomes, or returns on investment. Your results will depend entirely 
                on your own efforts, skills, market conditions, and many other factors beyond our control. We have no way of 
                knowing whether you have implemented any strategies correctly.
              </p>
              <p>
                Always consult with licensed professionals (attorney, CPA, financial advisor) before making investment decisions. 
                <a href="/disclaimers" className="text-[oklch(0.48_0.20_18)] hover:underline font-medium">Read full Legal Disclaimers →</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
