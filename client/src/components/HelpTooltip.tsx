import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface HelpTooltipProps {
  /** Short explanation shown on hover */
  text: string;
  /** Optional longer description shown below the main text */
  detail?: string;
  /** Size of the icon in pixels (default 14) */
  size?: number;
  /** Side of the tooltip relative to the trigger */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Additional className for the trigger wrapper */
  className?: string;
}

/**
 * A small "?" icon that shows a contextual help tooltip on hover.
 * Use next to labels, metrics, or field names to explain complex concepts.
 *
 * Usage:
 *   <label>Deal Score <HelpTooltip text="A 0-100 score..." /></label>
 */
export function HelpTooltip({
  text,
  detail,
  size = 14,
  side = 'top',
  className = '',
}: HelpTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${className}`}
          aria-label="Help"
          tabIndex={0}
        >
          <HelpCircle style={{ width: size, height: size }} />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        className="max-w-[280px] bg-popover text-popover-foreground border border-border shadow-lg px-3 py-2 text-xs leading-relaxed"
      >
        <p className="font-medium">{text}</p>
        {detail && (
          <p className="mt-1 text-muted-foreground text-[11px]">{detail}</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Pre-defined tooltip definitions for common real estate investing terms.
 * Import and use: <HelpTooltip {...HELP_TIPS.dealScore} />
 */
export const HELP_TIPS = {
  dealScore: {
    text: 'A 0–100 composite score rating the overall quality of this deal.',
    detail:
      'Factors in ROI, 70% rule compliance, profit margin, and cash-on-cash return. 80+ is excellent, 60–79 is good, 40–59 is fair, below 40 is poor.',
  },
  seventyPercentRule: {
    text: 'The 70% Rule: Max offer = (ARV × 70%) − Rehab Cost.',
    detail:
      'A quick investor formula to ensure enough profit margin. Conservative investors use 65%, aggressive investors may go up to 75%.',
  },
  arv: {
    text: 'After Repair Value — the estimated market value after all renovations are complete.',
    detail:
      'Determined by comparing 3–5 recently sold, renovated properties (comps) in the same area with similar size and features.',
  },
  roi: {
    text: 'Return on Investment — net profit divided by total cash invested, expressed as a percentage.',
    detail:
      'ROI = (Net Profit ÷ Total Investment) × 100. A healthy flip typically targets 15–25% ROI.',
  },
  cashOnCash: {
    text: 'Cash-on-Cash Return — annual pre-tax cash flow divided by total cash invested.',
    detail:
      'Measures the return on your actual out-of-pocket cash. Especially useful when using leverage (loans). 8–12% is considered good for rentals.',
  },
  capRate: {
    text: 'Capitalization Rate — Net Operating Income (NOI) divided by the property value.',
    detail:
      'Used to evaluate rental properties. Cap Rate = (Annual NOI ÷ Property Value) × 100. Higher cap rates indicate higher potential returns but often more risk.',
  },
  totalInvested: {
    text: 'The total capital deployed across all your saved deals.',
    detail:
      'Includes purchase prices, rehab costs, financing costs, holding costs, and closing costs for every deal in your portfolio.',
  },
  projectedProfit: {
    text: 'The combined estimated net profit from all deals in your portfolio.',
    detail:
      'Calculated as the sum of (ARV − Total Investment) for each deal. Actual profit may vary based on market conditions and final sale price.',
  },
  avgRoi: {
    text: 'The average ROI across all deals in your portfolio.',
    detail:
      'Weighted by deal count. Helps you track your overall investment performance over time.',
  },
  materialTier: {
    text: 'The quality level of renovation materials: Rental, Standard, or Luxury.',
    detail:
      'Rental: basic builder-grade ($). Standard: mid-range buyer-friendly ($$). Luxury: high-end premium finishes ($$$). Each tier affects rehab cost significantly.',
  },
  regionalAdjustment: {
    text: 'A cost multiplier applied based on your selected metro market.',
    detail:
      'Labor and material costs vary significantly by region. For example, San Francisco may have a 1.4x multiplier while Memphis may be 0.85x.',
  },
  maxAllowableOffer: {
    text: 'The maximum price you should offer based on the 70% rule.',
    detail:
      'MAO = (ARV × 70%) − Estimated Rehab Cost. This is your ceiling — offering above this reduces your profit margin.',
  },
  netProfit: {
    text: 'Your estimated profit after all costs are subtracted from the sale price.',
    detail:
      'Net Profit = ARV − Purchase Price − Rehab − Financing Costs − Holding Costs − Closing Costs. Does not include income taxes.',
  },
  holdingCosts: {
    text: 'Monthly expenses incurred while you own the property during renovation.',
    detail:
      'Includes mortgage/loan payments, property taxes, insurance, utilities, and HOA fees. Typically $1,500–$3,000/month depending on the property.',
  },
  closingCosts: {
    text: 'Transaction fees paid when buying and selling the property.',
    detail:
      'Buy-side: 1–3% (title, inspection, appraisal). Sell-side: 6–10% (agent commissions, title, transfer taxes, concessions).',
  },
} as const;
