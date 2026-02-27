import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { COURSE_MODULES } from '@/lib/course';
import type { CourseModule, CourseLesson } from '@/lib/course';
import { VIDEO_SCRIPTS } from '@/lib/videoScripts';
import type { VideoScript, VideoSegment } from '@/lib/videoScripts';
import { MODULE_QUIZZES } from '@/lib/quizData';
import type { ModuleQuiz } from '@/lib/quizData';
import { QuizModal } from '@/components/QuizModal';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { toast } from 'sonner';
import {
  GraduationCap, ChevronDown, ChevronRight, BookOpen, Clock,
  PlayCircle, Video, FileText, Camera, Monitor, Presentation,
  PenLine, Clapperboard, Eye, EyeOff, CheckCircle2, Circle,
  RotateCcw, Loader2, Lock, Trophy, Award, Download
} from 'lucide-react';
import { generateCertificate } from '@/lib/generateCertificate';
import { useState, useMemo, useCallback } from 'react';
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
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" /> {script.segments.length} Segments
          </span>
        </div>
      </div>

      {/* Opening Hook */}
      <div className="p-4 border-b border-border/50">
        <p className="text-xs font-semibold text-[oklch(0.50_0.18_25)] uppercase tracking-wider mb-1">Opening Hook</p>
        <p className="text-sm font-medium">{script.openingHook}</p>
      </div>

      {/* Segments */}
      <div className="divide-y divide-border/50">
        {script.segments.map((seg, i) => {
          const isExpanded = expandedSegment === i;
          const SegIcon = SEGMENT_ICONS[seg.type] || Camera;
          return (
            <div key={i}>
              <button
                onClick={() => setExpandedSegment(isExpanded ? null : i)}
                className="w-full text-left p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-6 shrink-0">#{i + 1}</span>
                  <SegmentBadge type={seg.type} />
                  <span className="text-sm font-medium flex-1">{seg.title}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {seg.duration}
                  </span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 ml-9 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Script</p>
                    <div className="text-sm leading-relaxed whitespace-pre-line bg-background/80 p-3 border border-border/50">
                      {seg.script}
                    </div>
                  </div>
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
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
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

        <div className="absolute top-4 right-4">
          <Badge className="bg-[oklch(0.50_0.18_25)] text-white border-none text-xs flex items-center gap-1.5 px-3 py-1">
            <Video className="w-3.5 h-3.5" />
            Video Coming Soon
          </Badge>
        </div>

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

function CertificateSection({ totalLessons, totalModules }: { totalLessons: number; totalModules: number }) {
  const certQuery = trpc.certificate.eligibility.useQuery(undefined, { retry: false });

  if (certQuery.isLoading) return null;
  if (!certQuery.data) return null;

  const { quizzesPassed, userName } = certQuery.data;
  const allQuizzesPassed = quizzesPassed >= totalModules;

  const handleDownload = () => {
    const name = userName || 'Course Graduate';
    generateCertificate({
      recipientName: name,
      completionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalLessons,
      totalModules,
      quizzesPassed,
    });
  };

  return (
    <div className="mt-4 p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-amber-500/15">
          <Award className="w-6 h-6 text-amber-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base mb-1">Course Completion Certificate</h3>
          {allQuizzesPassed ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                You've completed all lessons and passed all {totalModules} module quizzes.
                Download your personalized certificate of completion!
                {!userName && (
                  <span className="block mt-1 text-xs">
                    Tip: <a href="/profile" className="text-[oklch(0.48_0.20_18)] hover:underline font-medium">Set up your profile</a> to show your name on the certificate.
                  </span>
                )}
              </p>
              <Button
                onClick={handleDownload}
                className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                size="sm"
              >
                <Download className="w-4 h-4" />
                Download Certificate
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                You've completed all lessons! To earn your certificate, pass all {totalModules} module quizzes.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={(quizzesPassed / totalModules) * 100} className="h-1.5 flex-1 max-w-[200px]" />
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                  {quizzesPassed}/{totalModules} quizzes passed
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Course() {
  const [expandedModule, setExpandedModule] = useState<string | null>('mod-1');
  const [activeLesson, setActiveLesson] = useState<string | null>('l-1-1');
  const [showScript, setShowScript] = useState(false);
  const [quizModule, setQuizModule] = useState<ModuleQuiz | null>(null);

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Fetch progress from database (only if authenticated)
  const progressQuery = trpc.courseProgress.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const toggleMutation = trpc.courseProgress.toggle.useMutation({
    onSuccess: () => {
      progressQuery.refetch();
    },
    onError: (err) => {
      toast.error('Failed to update progress');
    },
  });

  const completeModuleMutation = trpc.courseProgress.completeModule.useMutation({
    onSuccess: (data) => {
      progressQuery.refetch();
      toast.success(`Module complete! ${data.added} lesson${data.added !== 1 ? 's' : ''} marked.`);
    },
    onError: () => {
      toast.error('Failed to mark module complete');
    },
  });

  const resetMutation = trpc.courseProgress.reset.useMutation({
    onSuccess: () => {
      progressQuery.refetch();
      toast.success('Progress reset successfully');
    },
    onError: () => {
      toast.error('Failed to reset progress');
    },
  });

  // Build completed set
  const completedLessons = useMemo(() => {
    const set = new Set<string>();
    if (progressQuery.data) {
      for (const row of progressQuery.data) {
        set.add(row.lessonId);
      }
    }
    return set;
  }, [progressQuery.data]);

  // Compute progress stats
  const allLessonIds = useMemo(() => {
    return COURSE_MODULES.flatMap(m => m.lessons.map(l => l.id));
  }, []);

  const totalLessons = allLessonIds.length;
  const completedCount = completedLessons.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const totalScripts = Object.keys(VIDEO_SCRIPTS).length;

  const currentModule = COURSE_MODULES.find(m => m.id === expandedModule);
  const currentLesson = currentModule?.lessons.find(l => l.id === activeLesson);
  const currentScript = activeLesson ? VIDEO_SCRIPTS[activeLesson] : undefined;

  // Module-level progress
  const getModuleProgress = useCallback((mod: CourseModule) => {
    const modLessonIds = mod.lessons.map(l => l.id);
    const completed = modLessonIds.filter(id => completedLessons.has(id)).length;
    return { completed, total: modLessonIds.length, percent: modLessonIds.length > 0 ? Math.round((completed / modLessonIds.length) * 100) : 0 };
  }, [completedLessons]);

  const handleToggleLesson = useCallback((lessonId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to track your progress');
      return;
    }
    toggleMutation.mutate({ lessonId });
  }, [isAuthenticated, toggleMutation]);

  const handleCompleteModule = useCallback((mod: CourseModule) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to track your progress');
      return;
    }
    const lessonIds = mod.lessons.map(l => l.id);
    completeModuleMutation.mutate({ lessonIds });
  }, [isAuthenticated, completeModuleMutation]);

  const handleReset = useCallback(() => {
    if (!isAuthenticated) return;
    if (confirm('Are you sure you want to reset all course progress? This cannot be undone.')) {
      resetMutation.mutate();
    }
  }, [isAuthenticated, resetMutation]);

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

          {/* Progress Bar */}
          {isAuthenticated && (
            <div className="mt-4 p-4 bg-secondary/40 border border-border/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {progressPercent === 100 ? (
                    <Trophy className="w-5 h-5 text-amber-500" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-primary" />
                  )}
                  <span className="text-sm font-semibold">
                    {progressPercent === 100 ? 'Course Complete!' : 'Your Progress'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums text-primary">
                    {completedCount}/{totalLessons} lessons
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {progressPercent}%
                  </span>
                  {completedCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      disabled={resetMutation.isPending}
                      className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
                    >
                      {resetMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <Progress value={progressPercent} className="h-2" />
              {progressPercent === 100 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                  Congratulations! You've completed all {totalLessons} lessons. Keep reviewing to reinforce your knowledge.
                </p>
              )}
            </div>
          )}

          {/* Certificate Section */}
          {isAuthenticated && progressPercent === 100 && (
            <CertificateSection totalLessons={totalLessons} totalModules={COURSE_MODULES.length} />
          )}

          {/* Sign in prompt for non-authenticated users */}
          {!isAuthenticated && !authLoading && (
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sign in to track your progress</p>
                <p className="text-xs text-muted-foreground">Your lesson completions will be saved to your account so you can pick up where you left off.</p>
              </div>
              <Button size="sm" asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            </div>
          )}

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
              const modProgress = getModuleProgress(mod);
              const isModuleComplete = modProgress.completed === modProgress.total;
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
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">Module {mod.number}</p>
                              {isAuthenticated && isModuleComplete && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                              )}
                            </div>
                            <CardTitle className="text-sm leading-tight">{mod.title}</CardTitle>
                            {/* Module progress bar */}
                            {isAuthenticated && modProgress.total > 0 && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <Progress value={modProgress.percent} className="h-1 flex-1" />
                                <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                                  {modProgress.completed}/{modProgress.total}
                                </span>
                              </div>
                            )}
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
                            const isCompleted = completedLessons.has(lesson.id);
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
                                  {isAuthenticated && isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-500" />
                                  ) : (
                                    <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                                  )}
                                  <span className={`flex-1 truncate ${isCompleted ? 'line-through opacity-70' : ''}`}>{lesson.title}</span>
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
                        {/* Mark Module Complete button */}
                        {isAuthenticated && !isModuleComplete && (
                          <div className="ml-8 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteModule(mod);
                              }}
                              disabled={completeModuleMutation.isPending}
                              className="text-xs w-full gap-1.5"
                            >
                              {completeModuleMutation.isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              Mark Module Complete
                            </Button>
                          </div>
                        )}
                        {/* Quiz button */}
                        {(() => {
                          const modQuiz = MODULE_QUIZZES.find(q => q.moduleId === mod.id);
                          if (!modQuiz) return null;
                          return (
                            <div className="ml-8 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuizModule(modQuiz);
                                }}
                                className="text-xs w-full gap-1.5 border-[oklch(0.48_0.20_18)]/40 text-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.48_0.20_18)]/10"
                              >
                                <Trophy className="w-3 h-3" />
                                Take Quiz
                              </Button>
                            </div>
                          );
                        })()}
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
                    <div className="flex items-center gap-2">
                      {/* Mark Complete / Undo button */}
                      {isAuthenticated && (
                        <Button
                          variant={completedLessons.has(currentLesson.id) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleLesson(currentLesson.id)}
                          disabled={toggleMutation.isPending}
                          className={`text-xs gap-1.5 ${completedLessons.has(currentLesson.id) ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                        >
                          {toggleMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : completedLessons.has(currentLesson.id) ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          {completedLessons.has(currentLesson.id) ? 'Completed' : 'Mark Complete'}
                        </Button>
                      )}
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

                  {/* Bottom: Mark Complete + Next Lesson */}
                  {isAuthenticated && (
                    <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between">
                      <Button
                        variant={completedLessons.has(currentLesson.id) ? 'default' : 'outline'}
                        onClick={() => handleToggleLesson(currentLesson.id)}
                        disabled={toggleMutation.isPending}
                        className={`gap-2 ${completedLessons.has(currentLesson.id) ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                      >
                        {toggleMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : completedLessons.has(currentLesson.id) ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        {completedLessons.has(currentLesson.id) ? 'Completed — Click to Undo' : 'Mark as Complete'}
                      </Button>
                      {/* Next lesson button */}
                      {(() => {
                        const flatLessons = COURSE_MODULES.flatMap(m => m.lessons);
                        const currentIdx = flatLessons.findIndex(l => l.id === currentLesson.id);
                        const nextLesson = currentIdx >= 0 && currentIdx < flatLessons.length - 1 ? flatLessons[currentIdx + 1] : null;
                        const nextModule = nextLesson ? COURSE_MODULES.find(m => m.lessons.some(l => l.id === nextLesson.id)) : null;
                        if (!nextLesson) return null;
                        return (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setActiveLesson(nextLesson.id);
                              if (nextModule && nextModule.id !== expandedModule) {
                                setExpandedModule(nextModule.id);
                              }
                              setShowScript(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-xs gap-1.5"
                          >
                            Next: {nextLesson.title}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                        );
                      })()}
                    </div>
                  )}
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

      {/* Quiz Modal */}
      {quizModule && (
        <QuizModal
          quiz={quizModule}
          open={!!quizModule}
          onOpenChange={(open) => { if (!open) setQuizModule(null); }}
        />
      )}
    </div>
  );
}
