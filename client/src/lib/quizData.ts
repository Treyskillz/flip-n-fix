export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  moduleId: string;
  moduleTitle: string;
  questions: QuizQuestion[];
}

export const MODULE_QUIZZES: ModuleQuiz[] = [
  {
    moduleId: 'mod-1',
    moduleTitle: 'Foundation: The Real Estate Investor Mindset',
    questions: [
      {
        id: 'q-1-1',
        question: 'What is the primary advantage of forming an LLC for your real estate investing business?',
        options: [
          'It eliminates all taxes on profits',
          'It provides personal liability protection separating personal assets from business risks',
          'It guarantees loan approval from banks',
          'It allows you to skip property inspections',
        ],
        correctIndex: 1,
        explanation: 'An LLC (Limited Liability Company) creates a legal separation between your personal assets and your business. If something goes wrong with a property, creditors can only go after business assets, not your personal home, savings, or other assets.',
      },
      {
        id: 'q-1-2',
        question: 'Which of the following is NOT typically part of a real estate investor\'s "Power Team"?',
        options: [
          'Real estate attorney',
          'Licensed general contractor',
          'Social media influencer',
          'CPA or tax advisor',
        ],
        correctIndex: 2,
        explanation: 'A Power Team consists of professionals who directly support your investing business: attorneys, contractors, CPAs, lenders, title companies, insurance agents, and real estate agents. While marketing is important, a social media influencer is not a core team member.',
      },
      {
        id: 'q-1-3',
        question: 'What is the approximate housing deficit in the U.S. that creates opportunity for fix & flip investors?',
        options: [
          '500,000 - 1 million homes',
          '1 - 2 million homes',
          '4 - 6 million homes',
          '10 - 15 million homes',
        ],
        correctIndex: 2,
        explanation: 'The U.S. faces a structural housing deficit of approximately 4-6 million homes. This shortage supports property values and ensures strong demand for renovated homes, creating consistent opportunity for fix & flip investors.',
      },
    ],
  },
  {
    moduleId: 'mod-2',
    moduleTitle: 'Finding Deals: Acquisition Strategies',
    questions: [
      {
        id: 'q-2-1',
        question: 'What is "driving for dollars" in real estate investing?',
        options: [
          'Calculating the cost per mile to visit properties',
          'Physically driving through neighborhoods to identify distressed properties',
          'Measuring the distance between comparable sales',
          'Tracking fuel expenses as a tax deduction',
        ],
        correctIndex: 1,
        explanation: 'Driving for dollars means physically driving through target neighborhoods looking for signs of distressed properties — overgrown yards, boarded windows, deferred maintenance, code violations. These properties often have motivated sellers.',
      },
      {
        id: 'q-2-2',
        question: 'Which lead source typically produces the highest-quality motivated seller leads?',
        options: [
          'Zillow listings',
          'Direct mail to absentee owners and pre-foreclosure lists',
          'Social media ads to the general public',
          'Open houses at retail properties',
        ],
        correctIndex: 1,
        explanation: 'Direct mail campaigns targeting specific distressed lists (absentee owners, pre-foreclosures, probate, tax liens) produce high-quality leads because these owners have specific motivations to sell quickly, often below market value.',
      },
      {
        id: 'q-2-3',
        question: 'What is the recommended minimum number of comparable sales (comps) to determine ARV?',
        options: [
          '1 comp',
          '2 comps',
          '3-5 comps',
          '10+ comps',
        ],
        correctIndex: 2,
        explanation: 'Using 3-5 comparable sales provides a reliable ARV estimate. Fewer comps may not capture market variation, while too many may include less relevant properties. Focus on recently sold, renovated properties within 0.5-1 mile of your subject property.',
      },
    ],
  },
  {
    moduleId: 'mod-3',
    moduleTitle: 'Exit Strategy #1: Fix & Flip',
    questions: [
      {
        id: 'q-3-1',
        question: 'What does the "70% Rule" in fix & flip investing state?',
        options: [
          'You should spend 70% of your budget on renovations',
          'Your maximum offer should be 70% of ARV minus repair costs',
          '70% of flips are profitable in any market',
          'You should aim for a 70% return on investment',
        ],
        correctIndex: 1,
        explanation: 'The 70% Rule states: Maximum Allowable Offer (MAO) = ARV × 70% - Repair Costs. This formula ensures enough margin for holding costs, closing costs, and profit. For example, if ARV is $300,000 and repairs are $50,000, your MAO is $160,000.',
      },
      {
        id: 'q-3-2',
        question: 'What is the typical timeline for a fix & flip project from purchase to sale?',
        options: [
          '1-2 weeks',
          '1-2 months',
          '4-6 months',
          '1-2 years',
        ],
        correctIndex: 2,
        explanation: 'Most fix & flip projects take 4-6 months from purchase to sale: 1-2 weeks for planning, 2-3 months for renovations, and 1-2 months for listing and closing. Holding costs accumulate during this entire period, so speed matters.',
      },
      {
        id: 'q-3-3',
        question: 'Which renovation typically provides the highest ROI in a fix & flip?',
        options: [
          'Adding a swimming pool',
          'Kitchen remodel',
          'Building a home theater',
          'Installing gold-plated fixtures',
        ],
        correctIndex: 1,
        explanation: 'Kitchen remodels consistently provide the highest ROI in fix & flip projects. Buyers prioritize kitchens when evaluating homes. A well-done kitchen renovation can recoup 70-80% of costs while making the entire home feel updated.',
      },
    ],
  },
  {
    moduleId: 'mod-4',
    moduleTitle: 'Exit Strategy #2: Wholesaling',
    questions: [
      {
        id: 'q-4-1',
        question: 'What is wholesaling in real estate?',
        options: [
          'Buying properties in bulk at a discount',
          'Getting a property under contract and assigning that contract to an end buyer for a fee',
          'Selling properties at wholesale prices below market value',
          'Operating a real estate brokerage with multiple agents',
        ],
        correctIndex: 1,
        explanation: 'Wholesaling means finding a motivated seller, getting the property under contract at a below-market price, then assigning that purchase contract to an end buyer (usually a fix & flip investor) for an assignment fee, typically $5,000-$25,000+.',
      },
      {
        id: 'q-4-2',
        question: 'What contract clause is essential for wholesaling?',
        options: [
          'A home warranty clause',
          'An "and/or assigns" clause allowing contract assignment',
          'A mandatory inspection clause',
          'A seller financing clause',
        ],
        correctIndex: 1,
        explanation: 'The "and/or assigns" clause in the purchase agreement allows you to assign the contract to another buyer. Without this language, you cannot legally transfer your contractual rights to an end buyer, which is the core mechanism of wholesaling.',
      },
    ],
  },
  {
    moduleId: 'mod-5',
    moduleTitle: 'Exit Strategy #3: Fix & Rent (BRRRR)',
    questions: [
      {
        id: 'q-5-1',
        question: 'What does BRRRR stand for?',
        options: [
          'Buy, Renovate, Rent, Refinance, Repeat',
          'Buy, Repair, Resell, Reinvest, Retire',
          'Borrow, Rehab, Rent, Return, Repeat',
          'Build, Renovate, Rent, Refinance, Resell',
        ],
        correctIndex: 0,
        explanation: 'BRRRR stands for Buy, Renovate, Rent, Refinance, Repeat. You buy a distressed property, renovate it, rent it out, refinance to pull out your invested capital, then use that capital to repeat the process with another property.',
      },
      {
        id: 'q-5-2',
        question: 'What is the key financial goal of the "Refinance" step in BRRRR?',
        options: [
          'To get the lowest possible interest rate',
          'To pull out most or all of your original invested capital so you can reinvest it',
          'To convert from a fixed-rate to an adjustable-rate mortgage',
          'To add a second mortgage for additional cash',
        ],
        correctIndex: 1,
        explanation: 'The refinance step aims to recover your initial investment (purchase + rehab costs) by refinancing based on the property\'s new, higher appraised value. Ideally, you pull out 100% of your capital while keeping positive cash flow from rent.',
      },
    ],
  },
  {
    moduleId: 'mod-6',
    moduleTitle: 'Exit Strategy #4: Subject-To',
    questions: [
      {
        id: 'q-6-1',
        question: 'What does "buying subject-to" mean in real estate?',
        options: [
          'Buying a property subject to a home inspection',
          'Taking ownership while the existing mortgage stays in the seller\'s name',
          'Purchasing a property subject to zoning approval',
          'Buying only if the property appraises at the purchase price',
        ],
        correctIndex: 1,
        explanation: 'Subject-to means you take ownership of the property via deed transfer while the existing mortgage remains in the seller\'s name. You make the mortgage payments, but the loan stays as-is. This lets you acquire properties with little or no money down.',
      },
      {
        id: 'q-6-2',
        question: 'What is the main risk of a subject-to acquisition?',
        options: [
          'The property might decrease in value',
          'The lender could call the "due on sale" clause, demanding full loan payoff',
          'The seller might want the property back',
          'Property taxes could increase',
        ],
        correctIndex: 1,
        explanation: 'Most mortgages contain a "due on sale" clause that technically allows the lender to demand full loan repayment when ownership transfers. While lenders rarely enforce this (as long as payments are current), it remains the primary risk of subject-to deals.',
      },
    ],
  },
  {
    moduleId: 'mod-7',
    moduleTitle: 'Exit Strategy #5: Short-Term Rentals',
    questions: [
      {
        id: 'q-7-1',
        question: 'What is the most critical factor to research before starting a short-term rental?',
        options: [
          'The color scheme for interior design',
          'Local regulations, permits, and HOA rules regarding short-term rentals',
          'The best photography equipment for listing photos',
          'Which smart home devices to install',
        ],
        correctIndex: 1,
        explanation: 'Local regulations are the most critical factor. Many cities have banned or restricted short-term rentals, require special permits, limit the number of rental days per year, or have specific zoning requirements. HOAs may also prohibit them entirely.',
      },
      {
        id: 'q-7-2',
        question: 'What metric do short-term rental investors use to measure daily income potential?',
        options: [
          'Cap Rate',
          'ADR (Average Daily Rate)',
          'GRM (Gross Rent Multiplier)',
          'DSCR (Debt Service Coverage Ratio)',
        ],
        correctIndex: 1,
        explanation: 'ADR (Average Daily Rate) measures the average income per booked night. Combined with occupancy rate, it determines your gross rental income. Tools like AirDNA can help estimate ADR for specific markets and property types.',
      },
    ],
  },
  {
    moduleId: 'mod-8',
    moduleTitle: 'Financing Your Deals',
    questions: [
      {
        id: 'q-8-1',
        question: 'What is the typical LTV (Loan-to-Value) ratio for a hard money loan?',
        options: [
          '95-100% LTV',
          '80-90% LTV',
          '65-80% LTV',
          '40-50% LTV',
        ],
        correctIndex: 2,
        explanation: 'Hard money lenders typically offer 65-80% LTV, meaning they\'ll lend 65-80% of the property\'s value (usually based on ARV or purchase price). The remaining 20-35% must come from your own funds or gap funding.',
      },
      {
        id: 'q-8-2',
        question: 'What is "gap funding" in real estate investing?',
        options: [
          'A government grant for first-time investors',
          'A second-position loan that covers part or all of your down payment gap',
          'Insurance that covers gaps in property coverage',
          'A savings account specifically for real estate investing',
        ],
        correctIndex: 1,
        explanation: 'Gap funding is a second-position loan that covers the difference between what your primary lender provides and the total capital needed. If your hard money lender covers 70% LTV, a gap funder can cover some or all of the remaining 30%.',
      },
    ],
  },
  {
    moduleId: 'mod-9',
    moduleTitle: 'Mastering the Freedom One Platform',
    questions: [
      {
        id: 'q-9-1',
        question: 'What is the Deal Score in the Freedom One Analyzer?',
        options: [
          'The property\'s credit score',
          'A 0-100 composite rating based on ROI, 70% Rule compliance, and profit margins',
          'The number of comparable sales found',
          'The property\'s condition rating from 1-10',
        ],
        correctIndex: 1,
        explanation: 'The Deal Score is a composite 0-100 rating that factors in ROI percentage, 70% Rule compliance, net profit margin, and cash-on-cash return. Scores above 70 indicate strong deals, 40-70 are marginal, and below 40 should generally be avoided.',
      },
      {
        id: 'q-9-2',
        question: 'What are the three material tiers available in the Rehab Estimator?',
        options: [
          'Basic, Premium, Ultra',
          'Rental Grade, Standard, Luxury',
          'Economy, Mid-Range, High-End',
          'Bronze, Silver, Gold',
        ],
        correctIndex: 1,
        explanation: 'The three material tiers are Rental Grade (builder-grade, cost-effective), Standard (mid-range popular materials), and Luxury (high-end premium finishes). Each tier applies different cost multipliers based on real Home Depot and supplier pricing.',
      },
      {
        id: 'q-9-3',
        question: 'Where can you view all your saved deals and track portfolio performance?',
        options: [
          'Only in the Analyzer page',
          'The Saved Deals page for individual deals and Portfolio Dashboard for aggregate metrics',
          'Only by downloading PDF reports',
          'In the Course page under Module 9',
        ],
        correctIndex: 1,
        explanation: 'The Saved Deals page shows all individual deals with status management, notes, and filtering. The Portfolio Dashboard provides aggregate metrics (total invested, projected profit, average ROI), charts, and a downloadable portfolio summary PDF.',
      },
    ],
  },
];
