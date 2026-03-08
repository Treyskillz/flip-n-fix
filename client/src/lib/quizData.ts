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
    moduleTitle: 'Investor Mindset & Success Psychology',
    questions: [
      {
        id: 'q-1-1',
        question: 'What is "analysis paralysis" in real estate investing?',
        options: [
          'A legal term for when a property fails inspection',
          'The tendency to over-analyze deals and never take action due to fear of making a mistake',
          'A financial ratio used to evaluate rental properties',
          'A negotiation tactic used by experienced investors',
        ],
        correctIndex: 1,
        explanation: 'Analysis paralysis is one of the top mental traps that prevents new investors from taking action. It occurs when you over-analyze every deal, waiting for the "perfect" opportunity that never comes. The antidote is setting clear criteria and committing to action once those criteria are met.',
      },
      {
        id: 'q-1-2',
        question: 'What is the recommended "learning-to-action" ratio for real estate investors?',
        options: [
          '5:1 — spend 5 hours learning for every 1 hour of action',
          '1:1 — equal time learning and doing',
          '1:2 — for every hour of learning, spend 2 hours taking action',
          '10:1 — master everything before taking any action',
        ],
        correctIndex: 2,
        explanation: 'The recommended ratio is 1:2 — for every hour spent learning (courses, books, podcasts), spend two hours taking action (analyzing deals, making offers, networking). This prevents the common trap of becoming a "professional student" who never actually invests.',
      },
      {
        id: 'q-1-3',
        question: 'In negotiation, what is the "anchoring technique"?',
        options: [
          'Tying your offer to the property\'s anchor bolts',
          'Setting the first number in a negotiation to establish a reference point that influences all subsequent discussion',
          'Refusing to negotiate under any circumstances',
          'Waiting for the seller to make the first offer',
        ],
        correctIndex: 1,
        explanation: 'Anchoring means being the first to state a number in a negotiation. Research shows the first number mentioned heavily influences the final outcome. By presenting your offer first (based on your analysis), you set the psychological reference point around which all negotiation revolves.',
      },
      {
        id: 'q-1-4',
        question: 'What is the "abundance mindset" versus "scarcity mindset" in real estate?',
        options: [
          'Abundance means buying as many properties as possible; scarcity means buying only one',
          'Abundance means believing there are always more deals to find; scarcity means clinging to every deal out of fear',
          'Abundance means spending freely; scarcity means being frugal',
          'They are the same thing described differently',
        ],
        correctIndex: 1,
        explanation: 'An abundance mindset means believing there will always be another deal — which gives you the power to walk away from bad ones. A scarcity mindset makes you overpay or accept bad terms because you fear missing out. Successful investors maintain abundance thinking, which paradoxically leads to better deals.',
      },
    ],
  },
  {
    moduleId: 'mod-2',
    moduleTitle: 'Foundation: Building Your Business',
    questions: [
      {
        id: 'q-2-1',
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
        id: 'q-2-2',
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
        id: 'q-2-3',
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
    moduleId: 'mod-3',
    moduleTitle: 'Finding Deals: Acquisition Strategies',
    questions: [
      {
        id: 'q-3-1',
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
        id: 'q-3-2',
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
        id: 'q-3-3',
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
    moduleId: 'mod-4',
    moduleTitle: 'Fix & Flip Mastery',
    questions: [
      {
        id: 'q-4-1',
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
        id: 'q-4-2',
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
        id: 'q-4-3',
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
      {
        id: 'q-4-4',
        question: 'When is it appropriate to submit a Price Reduction Request to a seller?',
        options: [
          'Whenever you want a lower price, regardless of inspection findings',
          'Only when a professional inspection reveals material defects not anticipated at the time of your offer',
          'For cosmetic issues that were visible during your initial walkthrough',
          'After closing, when you discover additional repair needs',
        ],
        correctIndex: 1,
        explanation: 'A Price Reduction Request should only be submitted when a licensed inspector discovers material defects that were not visible or disclosed before your offer. This is a standard, ethical practice protected by the inspection contingency in your purchase agreement.',
      },
      {
        id: 'q-4-5',
        question: 'Which ninja negotiation tip is MOST effective when presenting a price reduction request?',
        options: [
          'Sending blurry photos to make the property look worse',
          'Itemizing every repair as a separate line item with contractor estimates',
          'Threatening to walk away immediately',
          'Waiting until the last day of the contingency period',
        ],
        correctIndex: 1,
        explanation: 'Itemizing repairs into individual line items (e.g., 25 items at $600 each) with written contractor estimates creates a much stronger, more credible case than a single lump sum. Each line item is documented and defensible.',
      },
    ],
  },
  {
    moduleId: 'mod-5',
    moduleTitle: 'Wholesaling Fundamentals',
    questions: [
      {
        id: 'q-5-1',
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
        id: 'q-5-2',
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
      {
        id: 'q-5-3',
        question: 'What is a typical wholesale assignment fee range?',
        options: [
          '$500 - $1,000',
          '$5,000 - $25,000+',
          '$50,000 - $100,000',
          'A flat 10% of the purchase price',
        ],
        correctIndex: 1,
        explanation: 'Wholesale assignment fees typically range from $5,000 to $25,000 or more, depending on the deal size and spread between your contract price and the end buyer\'s price.',
      },
    ],
  },
  {
    moduleId: 'mod-6',
    moduleTitle: 'The BRRRR Strategy',
    questions: [
      {
        id: 'q-6-1',
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
        id: 'q-6-2',
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
      {
        id: 'q-6-3',
        question: 'What is the "seasoning period" in the BRRRR strategy and why does it matter?',
        options: [
          'The time it takes for paint to dry after renovation',
          'The minimum time you must own a property before a lender will refinance based on the new appraised value (typically 6-12 months)',
          'The period between listing and selling a property',
          'The time required to find a tenant after renovation',
        ],
        correctIndex: 1,
        explanation: 'Most conventional lenders require a 6-12 month seasoning period before they will refinance based on the new appraised value. During this time, you hold the property (usually with a hard money loan) and collect rent.',
      },
    ],
  },
  {
    moduleId: 'mod-7',
    moduleTitle: 'Subject-To Financing',
    questions: [
      {
        id: 'q-7-1',
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
        id: 'q-7-2',
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
      {
        id: 'q-7-3',
        question: 'Why would a seller agree to a subject-to deal?',
        options: [
          'They get a higher price than market value',
          'They are in financial distress (behind on payments, pre-foreclosure, divorce) and need immediate relief from mortgage payments',
          'They want to keep living in the property',
          'They want to refinance at a lower rate',
        ],
        correctIndex: 1,
        explanation: 'Sellers agree to subject-to deals because they are typically in financial distress — behind on payments, facing foreclosure, going through divorce, or relocating urgently. A subject-to deal saves their credit by keeping the mortgage current.',
      },
    ],
  },
  {
    moduleId: 'mod-8',
    moduleTitle: 'Short-Term Rentals (Airbnb/VRBO)',
    questions: [
      {
        id: 'q-8-1',
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
        id: 'q-8-2',
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
      {
        id: 'q-8-3',
        question: 'What is "rental arbitrage" in the short-term rental space?',
        options: [
          'Buying properties at auction and renting them out',
          'Leasing a property with the landlord\'s permission and subletting it as a short-term rental for profit',
          'Renting out your primary residence while on vacation',
          'Arbitrating disputes between landlords and tenants',
        ],
        correctIndex: 1,
        explanation: 'Rental arbitrage means signing a long-term lease (with the landlord\'s written permission to sublet) and then listing the property on Airbnb/VRBO at a higher nightly rate. The profit is the difference between your monthly lease payment and your short-term rental income.',
      },
    ],
  },
  {
    moduleId: 'mod-9',
    moduleTitle: 'Financing Your Deals',
    questions: [
      {
        id: 'q-9-1',
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
        id: 'q-9-2',
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
      {
        id: 'q-9-3',
        question: 'What is the typical interest rate range for hard money loans?',
        options: [
          '2-4% annually',
          '5-7% annually',
          '10-15% annually',
          '25-30% annually',
        ],
        correctIndex: 2,
        explanation: 'Hard money loans typically carry interest rates of 10-15% annually, plus 1-3 origination points. While expensive compared to conventional mortgages, they offer fast closings (7-14 days), flexible qualification (asset-based, not credit-based), and short terms (6-12 months) ideal for fix & flip projects.',
      },
    ],
  },
  {
    moduleId: 'mod-10',
    moduleTitle: 'Freedom One Platform Mastery',
    questions: [
      {
        id: 'q-10-1',
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
        id: 'q-10-2',
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
        id: 'q-10-3',
        question: 'Where can you view all your saved deals and track portfolio performance?',
        options: [
          'Only in the Analyzer page',
          'The Saved Deals page for individual deals and Portfolio Dashboard for aggregate metrics',
          'Only by downloading PDF reports',
          'In the Course page under Module 10',
        ],
        correctIndex: 1,
        explanation: 'The Saved Deals page shows all individual deals with status management, notes, and filtering. The Portfolio Dashboard provides aggregate metrics (total invested, projected profit, average ROI), charts, and a downloadable portfolio summary PDF.',
      },
    ],
  },
  {
    moduleId: 'mod-11',
    moduleTitle: 'Asset Protection & Tax Strategy',
    questions: [
      {
        id: 'q-11-1',
        question: 'What is the primary advantage of a Series LLC for real estate investors?',
        options: [
          'It eliminates all property taxes',
          'Each series isolates liability so a lawsuit against one property cannot reach assets in other series',
          'It allows you to avoid recording deeds with the county',
          'It provides unlimited tax deductions',
        ],
        correctIndex: 1,
        explanation: 'A Series LLC creates separate "series" within a single LLC. Each series has its own assets and liabilities, so if a tenant sues over one property, they can only reach the assets in that specific series. Other properties in other series are protected.',
      },
      {
        id: 'q-11-2',
        question: 'Which of the following is a PROHIBITED transaction in a Self-Directed IRA?',
        options: [
          'Buying a rental property and collecting rent into the IRA',
          'Lending money to another investor at 10% interest',
          'Living in or vacationing at a property owned by your IRA',
          'Purchasing tax liens with IRA funds',
        ],
        correctIndex: 2,
        explanation: 'The IRS strictly prohibits any personal benefit from IRA-owned property. You cannot live in, vacation at, or use a property owned by your IRA. Violating this rule can disqualify your entire IRA, triggering income tax plus a 10% early withdrawal penalty on the full balance.',
      },
      {
        id: 'q-11-3',
        question: 'What is the main benefit of holding property in a Land Trust?',
        options: [
          'It eliminates property taxes',
          'It provides privacy since your name does not appear in public records',
          'It guarantees the property will appreciate in value',
          'It allows you to skip title insurance',
        ],
        correctIndex: 1,
        explanation: 'A land trust holds title to property with a trustee as the legal owner, while you (the beneficiary) control and benefit from the property. Your name does not appear in public records, providing privacy.',
      },
    ],
  },
  {
    moduleId: 'mod-12',
    moduleTitle: 'Creative Financing Mastery',
    questions: [
      {
        id: 'q-12-1',
        question: 'In a seller financing deal, what is a "wrap-around mortgage"?',
        options: [
          'A mortgage that wraps the property in extra insurance',
          'A new mortgage at a higher rate that encompasses the seller\'s existing mortgage, with the seller profiting from the rate spread',
          'A type of FHA loan with flexible terms',
          'A mortgage that requires no down payment',
        ],
        correctIndex: 1,
        explanation: 'A wrap-around mortgage creates a new mortgage at a higher interest rate that "wraps around" the seller\'s existing mortgage. You pay the seller at the higher rate; the seller continues paying their existing mortgage at the lower rate and profits from the interest rate spread.',
      },
      {
        id: 'q-12-2',
        question: 'What is a "sandwich lease option"?',
        options: [
          'A lease that includes a free lunch for tenants',
          'Lease-optioning a property from the owner, then sub-lease-optioning it to a tenant-buyer at higher terms, profiting from both the monthly and price spread',
          'A standard rental agreement with a 30-day notice clause',
          'A lease that only applies to commercial sandwich shops',
        ],
        correctIndex: 1,
        explanation: 'A sandwich lease option involves lease-optioning a property from the owner at one price and monthly payment, then sub-lease-optioning it to a tenant-buyer at a higher price and higher monthly payment. You profit from the monthly payment spread and the purchase price spread when the tenant-buyer exercises their option.',
      },
      {
        id: 'q-12-3',
        question: 'When negotiating seller financing, what is the most effective approach?',
        options: [
          'Always demand 0% interest and no down payment',
          'Offer a higher purchase price in exchange for better financing terms (lower rate, lower down payment, longer amortization)',
          'Tell the seller their property is overpriced',
          'Only negotiate via text message',
        ],
        correctIndex: 1,
        explanation: 'The "terms vs. price" framework is key: the seller controls the price, you control the terms. Offering a higher price in exchange for favorable terms (low interest, low down payment, long amortization) often results in a better deal for you because the terms determine your actual cost, not the sticker price.',
      },
    ],
  },
];
