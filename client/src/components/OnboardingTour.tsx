import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, Sparkles, RotateCcw } from 'lucide-react';

interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="property-input"]',
    title: '1. Enter Property Details',
    description: 'Start by entering the property address, purchase price, beds, baths, and square footage. Select a regional market to auto-adjust labor and material costs for your area.',
    position: 'bottom',
  },
  {
    target: '[data-tour="comp-manager"]',
    title: '2. Add Comparable Sales',
    description: 'Add 3-5 comparable retail sales of recently renovated properties to determine the After Repair Value (ARV). Use AI Comp Search to find comps automatically, or enter them manually.',
    position: 'bottom',
  },
  {
    target: '[data-tour="rehab-estimator"]',
    title: '3. Estimate Rehab Costs',
    description: 'Use Quick Estimate for a fast ballpark, or Detailed Scope of Work for room-by-room assessment. Choose a material tier (Rental, Standard, Luxury) and set each room\'s condition level.',
    position: 'bottom',
  },
  {
    target: '[data-tour="profit-summary"]',
    title: '4. Review Deal Score',
    description: 'The Deal Score (0-100) updates in real-time as you enter data. It factors in ROI, the 70% Rule, and profit margins. Green = strong deal, yellow = marginal, red = avoid. Hover the "?" icons for explanations.',
    position: 'left',
  },
  {
    target: '[data-tour="investor-report"]',
    title: '5. Share & Export',
    description: 'Generate a professional PDF report, share a live deal link with partners, or email the analysis directly. Property photos you upload will appear in both the shared link and PDF.',
    position: 'bottom',
  },
  {
    target: '[data-tour="save-deal"]',
    title: '6. Save to Portfolio',
    description: 'Click "Save Deal" to store this analysis in your cloud portfolio. View all saved deals on the Saved Deals page, track performance on the Portfolio Dashboard, and download a portfolio summary PDF.',
    position: 'bottom',
  },
];

const TOUR_STORAGE_KEY = 'analyzer-tour-completed';

interface OnboardingTourProps {
  /** If true, force-show the tour regardless of localStorage */
  forceShow?: boolean;
  onComplete?: () => void;
}

export function OnboardingTour({ forceShow = false, onComplete }: OnboardingTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Check if tour should auto-start
  useEffect(() => {
    if (forceShow) {
      setIsActive(true);
      setCurrentStep(0);
      return;
    }
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      // Small delay to let the page render
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStep(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  // Position the tooltip relative to the target element
  const positionTooltip = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    const target = document.querySelector(step.target);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    setHighlightRect(rect);

    // Scroll element into view
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Wait for scroll to finish, then position
    requestAnimationFrame(() => {
      const updatedRect = target.getBoundingClientRect();
      setHighlightRect(updatedRect);

      const tooltipWidth = 380;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200;
      const padding = 16;

      let top = 0;
      let left = 0;

      switch (step.position) {
        case 'bottom':
          top = updatedRect.bottom + padding;
          left = updatedRect.left + updatedRect.width / 2 - tooltipWidth / 2;
          break;
        case 'top':
          top = updatedRect.top - tooltipHeight - padding;
          left = updatedRect.left + updatedRect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = updatedRect.top + updatedRect.height / 2 - tooltipHeight / 2;
          left = updatedRect.left - tooltipWidth - padding;
          break;
        case 'right':
          top = updatedRect.top + updatedRect.height / 2 - tooltipHeight / 2;
          left = updatedRect.right + padding;
          break;
      }

      // Clamp to viewport
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
      top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

      setTooltipPos({ top, left });
    });
  }, [currentStep]);

  useEffect(() => {
    if (!isActive) return;
    // Small delay for scroll
    const timer = setTimeout(positionTooltip, 300);
    window.addEventListener('resize', positionTooltip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', positionTooltip);
    };
  }, [isActive, currentStep, positionTooltip]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    onComplete?.();
  };

  const handleSkip = () => {
    setIsActive(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    onComplete?.();
  };

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9998]" onClick={handleSkip}>
        {/* Semi-transparent overlay with cutout for highlighted element */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="tour-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {highlightRect && (
                <rect
                  x={highlightRect.left - 8}
                  y={highlightRect.top - 8}
                  width={highlightRect.width + 16}
                  height={highlightRect.height + 16}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0" y="0" width="100%" height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#tour-mask)"
          />
        </svg>

        {/* Highlight border */}
        {highlightRect && (
          <div
            className="absolute border-2 border-[oklch(0.48_0.20_18)] rounded-lg pointer-events-none"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
              boxShadow: '0 0 0 4px oklch(0.48 0.20 18 / 0.3)',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] w-[380px] bg-card border border-border rounded-xl shadow-2xl p-5"
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
            <span className="text-xs font-medium text-[oklch(0.48_0.20_18)] uppercase tracking-wide">
              Getting Started
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <h3 className="text-base font-bold mb-2">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep
                  ? 'w-6 bg-[oklch(0.48_0.20_18)]'
                  : i < currentStep
                    ? 'w-1.5 bg-[oklch(0.48_0.20_18)]/50'
                    : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={handlePrev} className="gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
              {currentStep < TOUR_STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Small button to replay the tour */
export function ReplayTourButton() {
  const [showTour, setShowTour] = useState(false);

  const handleReplay = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setShowTour(true);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleReplay}
        className="gap-1.5 text-xs"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Replay Tour
      </Button>
      {showTour && (
        <OnboardingTour forceShow onComplete={() => setShowTour(false)} />
      )}
    </>
  );
}
