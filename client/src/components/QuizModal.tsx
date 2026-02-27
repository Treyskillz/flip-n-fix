import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import type { ModuleQuiz, QuizQuestion } from '@/lib/quizData';

interface QuizModalProps {
  quiz: ModuleQuiz;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type QuizState = 'taking' | 'reviewing';

export function QuizModal({ quiz, open, onOpenChange }: QuizModalProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    () => quiz.questions.map(() => null)
  );
  const [state, setState] = useState<QuizState>('taking');
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.quiz.submit.useMutation({
    onSuccess: () => {
      toast.success('Quiz results saved!');
    },
    onError: (err) => {
      toast.error(`Failed to save quiz: ${err.message}`);
    },
  });

  const utils = trpc.useUtils();

  const score = useMemo(() => {
    if (!submitted) return 0;
    return quiz.questions.reduce((acc, q, i) => {
      return acc + (selectedAnswers[i] === q.correctIndex ? 1 : 0);
    }, 0);
  }, [submitted, selectedAnswers, quiz.questions]);

  const percentage = Math.round((score / quiz.questions.length) * 100);

  const handleSelectAnswer = (optionIndex: number) => {
    if (submitted) return;
    const updated = [...selectedAnswers];
    updated[currentQ] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleSubmit = () => {
    // Check all questions answered
    const unanswered = selectedAnswers.findIndex(a => a === null);
    if (unanswered !== -1) {
      setCurrentQ(unanswered);
      toast.error(`Please answer question ${unanswered + 1} before submitting.`);
      return;
    }

    setSubmitted(true);
    setState('reviewing');
    setCurrentQ(0);

    // Calculate score
    const finalScore = quiz.questions.reduce((acc, q, i) => {
      return acc + (selectedAnswers[i] === q.correctIndex ? 1 : 0);
    }, 0);

    // Save to database
    submitMutation.mutate({
      moduleId: quiz.moduleId,
      score: finalScore,
      totalQuestions: quiz.questions.length,
      answers: JSON.stringify(selectedAnswers),
    }, {
      onSuccess: () => {
        utils.quiz.list.invalidate();
        utils.quiz.getModuleBest.invalidate({ moduleId: quiz.moduleId });
      },
    });
  };

  const handleRetake = () => {
    setSelectedAnswers(quiz.questions.map(() => null));
    setCurrentQ(0);
    setState('taking');
    setSubmitted(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      handleRetake();
    }, 300);
  };

  const question = quiz.questions[currentQ];
  const isCorrect = submitted && selectedAnswers[currentQ] === question.correctIndex;
  const answeredCount = selectedAnswers.filter(a => a !== null).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
            {submitted ? 'Quiz Results' : 'Module Quiz'}
          </DialogTitle>
          <DialogDescription>{quiz.moduleTitle}</DialogDescription>
        </DialogHeader>

        {/* Score Summary (shown after submission) */}
        {submitted && state === 'reviewing' && currentQ === 0 && (
          <div className="mb-4 p-4 rounded-lg bg-secondary/50 text-center">
            <Trophy className={`w-10 h-10 mx-auto mb-2 ${percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
            <p className="text-2xl font-bold">{score} / {quiz.questions.length}</p>
            <p className="text-sm text-muted-foreground">{percentage}% correct</p>
            <p className="text-sm mt-1 font-medium">
              {percentage >= 80 ? 'Excellent! You\'ve mastered this module.' :
               percentage >= 60 ? 'Good job! Review the explanations below to strengthen your knowledge.' :
               'Keep studying! Review the lesson content and try again.'}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Question {currentQ + 1} of {quiz.questions.length}</span>
            {!submitted && <span>{answeredCount} answered</span>}
          </div>
          <div className="flex gap-1">
            {quiz.questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                  i === currentQ
                    ? 'bg-[oklch(0.48_0.20_18)]'
                    : submitted
                      ? selectedAnswers[i] === q.correctIndex
                        ? 'bg-green-500'
                        : 'bg-red-400'
                      : selectedAnswers[i] !== null
                        ? 'bg-[oklch(0.48_0.20_18)]/50'
                        : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="mb-4">
          <h3 className="text-base font-semibold mb-3">{question.question}</h3>

          <div className="space-y-2">
            {question.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ] === optIdx;
              const isCorrectOption = question.correctIndex === optIdx;

              let optionClass = 'border-border hover:border-[oklch(0.48_0.20_18)]/50 hover:bg-secondary/30 cursor-pointer';
              if (isSelected && !submitted) {
                optionClass = 'border-[oklch(0.48_0.20_18)] bg-[oklch(0.48_0.20_18)]/10';
              }
              if (submitted) {
                if (isCorrectOption) {
                  optionClass = 'border-green-500 bg-green-500/10';
                } else if (isSelected && !isCorrectOption) {
                  optionClass = 'border-red-400 bg-red-400/10';
                } else {
                  optionClass = 'border-border opacity-60 cursor-default';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(optIdx)}
                  disabled={submitted}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${optionClass}`}
                >
                  <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5 ${
                    isSelected && !submitted ? 'border-[oklch(0.48_0.20_18)] text-[oklch(0.48_0.20_18)]' :
                    submitted && isCorrectOption ? 'border-green-500 text-green-500' :
                    submitted && isSelected ? 'border-red-400 text-red-400' :
                    'border-muted-foreground/40 text-muted-foreground/60'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm leading-relaxed">{option}</span>
                  {submitted && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 ml-auto mt-0.5" />
                  )}
                  {submitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-auto mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation (shown after submission) */}
        {submitted && (
          <div className={`p-3 rounded-lg text-sm leading-relaxed ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
            <p className="font-semibold mb-1">{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
            disabled={currentQ === 0}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <div className="flex items-center gap-2">
            {submitted && (
              <Button variant="outline" size="sm" onClick={handleRetake} className="gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Retake
              </Button>
            )}

            {currentQ < quiz.questions.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setCurrentQ(prev => prev + 1)}
                className="gap-1 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : !submitted ? (
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="gap-1 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleClose}
                className="gap-1 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
