import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { COURSE_MODULES } from '@/lib/course';
import type { CourseModule, CourseLesson } from '@/lib/course';
import { GraduationCap, ChevronDown, ChevronRight, BookOpen, Clock } from 'lucide-react';
import { useState } from 'react';
import { Streamdown } from 'streamdown';

export default function Course() {
  const [expandedModule, setExpandedModule] = useState<string | null>('mod-1');
  const [activeLesson, setActiveLesson] = useState<string | null>('l-1-1');

  const currentModule = COURSE_MODULES.find(m => m.id === expandedModule);
  const currentLesson = currentModule?.lessons.find(l => l.id === activeLesson);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[oklch(0.92_0.06_155)]">
              <GraduationCap className="w-6 h-6 text-[oklch(0.45_0.12_155)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Fix & Flip Mastery 2026</h1>
              <p className="text-sm text-muted-foreground">Complete Course — {COURSE_MODULES.length} Modules</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            A comprehensive course covering every aspect of real estate investing — from finding deals and analyzing properties 
            to all five major exit strategies: Fix & Flip, Wholesaling, BRRRR, Subject-To, and Short-Term Rentals.
          </p>
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
                          {mod.lessons.map((lesson: CourseLesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson.id)}
                              className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                                activeLesson === lesson.id
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'hover:bg-secondary/60 text-muted-foreground'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                                <span className="flex-1 truncate">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-1 ml-5.5 mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{lesson.duration}</span>
                              </div>
                            </button>
                          ))}
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
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      Module {currentModule?.number}
                    </Badge>
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {currentLesson.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:p-2 [&_th]:bg-secondary/60 [&_th]:font-semibold [&_td]:p-2 [&_td]:border-b [&_td]:border-border/50 [&_strong]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
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
      </div>
    </div>
  );
}
