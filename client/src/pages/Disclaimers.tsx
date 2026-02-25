import { Shield, AlertTriangle, Scale, FileWarning, BookOpen } from 'lucide-react';

export default function Disclaimers() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-[oklch(0.48_0.20_18)]/20">
              <Shield className="w-6 h-6 text-[oklch(0.65_0.18_18)]" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Legal Disclaimers & Terms of Use</h1>
          </div>
          <p className="text-[oklch(0.6_0_0)] text-sm max-w-2xl mt-3">
            Last updated: February 2026. Please read these terms carefully before using the Freedom One System.
          </p>
        </div>
      </section>

      <section className="container py-10 max-w-4xl">
        <div className="space-y-10">

          {/* General Disclaimer */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
              <h2 className="text-xl font-bold">General Disclaimer</h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed space-y-3">
              <p>
                The Freedom One System of Real Estate Investing ("Freedom One," "we," "us," or "our") provides this website, 
                tools, educational content, templates, and related materials (collectively, the "Platform") for <strong>informational 
                and educational purposes only</strong>. Nothing on this Platform constitutes professional financial, legal, tax, 
                investment, construction, or real estate advice.
              </p>
              <p>
                <strong>We make no representations, warranties, or guarantees of any kind</strong>, express or implied, regarding 
                the accuracy, completeness, reliability, suitability, or availability of any information, tools, calculations, 
                estimates, templates, or content provided through this Platform. Any reliance you place on such information is 
                strictly at your own risk.
              </p>
              <p>
                Real estate investing involves substantial risk, including the potential loss of your entire investment. Past 
                performance, case studies, examples, or projected returns discussed on this Platform are not indicative of future 
                results. <strong>We cannot and do not guarantee any specific results, outcomes, or returns on investment.</strong>
              </p>
            </div>
          </div>

          {/* No Liability */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
              <h2 className="text-xl font-bold">Limitation of Liability</h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed space-y-3">
              <p>
                To the fullest extent permitted by applicable law, Freedom One System of Real Estate Investing, its owners, 
                operators, affiliates, employees, agents, and licensors shall <strong>not be liable for any direct, indirect, 
                incidental, special, consequential, or punitive damages</strong> arising out of or related to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of or inability to use the Platform, tools, calculators, or any content provided herein</li>
                <li>Any investment decisions you make based on information obtained from this Platform</li>
                <li>Any errors, inaccuracies, or omissions in the calculations, estimates, cost projections, or data provided by our tools</li>
                <li>Any losses, damages, or expenses resulting from real estate transactions, renovations, or investments</li>
                <li>Any contracts, agreements, or legal documents generated, downloaded, or adapted from templates on this Platform</li>
                <li>Any reliance on scope of work estimates, material costs, labor rates, or rehab projections</li>
                <li>The actions or omissions of any third parties, including contractors, lenders, agents, or other service providers referenced on this Platform</li>
              </ul>
              <p>
                <strong>We have no way of knowing whether you have implemented any strategies, tools, or information correctly.</strong> 
                We cannot verify your specific circumstances, property conditions, market conditions, financial situation, or 
                the competence of any professionals you engage. Therefore, we expressly disclaim any and all liability for 
                outcomes resulting from your use of this Platform.
              </p>
            </div>
          </div>

          {/* Seek Professional Advice */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
              <h2 className="text-xl font-bold">Seek Professional Advice</h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed space-y-3">
              <p>
                Before making any real estate investment, entering into any contract, beginning any renovation, or taking 
                any financial action based on information from this Platform, <strong>you must consult with qualified, licensed 
                professionals</strong>, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Real Estate Attorney:</strong> For all legal matters, contract review, title issues, and compliance with local, state, and federal laws</li>
                <li><strong>Certified Public Accountant (CPA):</strong> For tax implications, entity structuring, and financial planning</li>
                <li><strong>Licensed Real Estate Agent/Broker:</strong> For property valuations, comparable market analysis, and transaction guidance</li>
                <li><strong>Licensed General Contractor:</strong> For accurate renovation estimates, building permits, code compliance, and construction oversight</li>
                <li><strong>Financial Advisor:</strong> For investment suitability, risk assessment, and portfolio allocation</li>
                <li><strong>Insurance Professional:</strong> For proper coverage during acquisition, renovation, and holding periods</li>
                <li><strong>Home Inspector:</strong> For thorough property condition assessments before purchase</li>
              </ul>
              <p>
                The templates, contracts, and legal documents provided on this Platform are <strong>generic samples for 
                educational reference only</strong>. They are not tailored to your specific situation, jurisdiction, or 
                transaction. Laws vary significantly by state, county, and municipality. <strong>Never use any template 
                or contract without first having it reviewed and approved by a licensed attorney in your jurisdiction.</strong>
              </p>
            </div>
          </div>

          {/* Calculator & Tool Disclaimer */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileWarning className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
              <h2 className="text-xl font-bold">Calculator, Estimator & Tool Disclaimers</h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed space-y-3">
              <p>
                The Deal Analyzer, Rehab Estimator, Scope of Work Templates, Gantt Charts, and all other calculators and 
                estimation tools on this Platform produce <strong>rough estimates based on generalized assumptions</strong>. 
                These tools are designed to provide a starting point for analysis, not definitive financial projections.
              </p>
              <p>Specifically:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Rehab cost estimates</strong> are based on national averages adjusted by regional factors. Actual costs will vary significantly based on property condition, local labor markets, material availability, and contractor pricing.</li>
                <li><strong>Home Depot product links and prices</strong> are provided for reference only. Prices change frequently and may not reflect current availability or local pricing.</li>
                <li><strong>ARV (After Repair Value) calculations</strong> based on comparable sales are estimates only. Actual property values depend on numerous factors including market conditions, buyer demand, and property-specific characteristics.</li>
                <li><strong>Financing cost projections</strong> (hard money rates, points, holding costs) are illustrative. Actual terms depend on your creditworthiness, lender requirements, and market conditions.</li>
                <li><strong>Regional cost adjustments</strong> are approximations based on publicly available cost indices. They may not accurately reflect your specific local market.</li>
                <li><strong>Profitability projections and deal verdicts</strong> are mathematical calculations based on the data you input. They do not account for unforeseen circumstances, market changes, construction delays, or other risks inherent in real estate investing.</li>
              </ul>
            </div>
          </div>

          {/* No Guarantee of Results */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
              <h2 className="text-xl font-bold">No Guarantee of Results</h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed space-y-3">
              <p>
                The educational content, course materials, strategies, and techniques discussed on this Platform are based on 
                general real estate investing principles. <strong>We do not guarantee that you will achieve any specific results, 
                earn any money, or avoid losses</strong> by using the information, tools, or strategies provided.
              </p>
              <p>
                Your results will depend entirely on your own efforts, skills, knowledge, market conditions, financial resources, 
                risk tolerance, and many other factors beyond our control. The fact that we provide educational content about 
                real estate investing strategies does not mean that those strategies will work for you in your specific situation.
              </p>
              <p>
                Any testimonials, case studies, or examples of successful investments are presented for illustrative purposes 
                only and should not be construed as a promise or guarantee of similar results. Individual results will vary.
              </p>
            </div>
          </div>

          {/* Third-Party Links */}
          <div>
            <h2 className="text-xl font-bold mb-4">Third-Party Links & References</h2>
            <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed space-y-3">
              <p>
                This Platform may contain links to third-party websites, products, services, or resources (including but not 
                limited to Home Depot product pages, lender websites, and educational resources). These links are provided for 
                convenience only. We do not endorse, control, or assume responsibility for the content, privacy policies, or 
                practices of any third-party sites or services. Your interactions with third parties are solely between you and 
                the third party.
              </p>
            </div>
          </div>

          {/* Indemnification */}
          <div>
            <h2 className="text-xl font-bold mb-4">Indemnification</h2>
            <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed space-y-3">
              <p>
                You agree to indemnify, defend, and hold harmless Freedom One System of Real Estate Investing, its owners, 
                operators, affiliates, employees, agents, and licensors from and against any and all claims, liabilities, 
                damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your 
                use of the Platform, your violation of these terms, or your violation of any rights of another party.
              </p>
            </div>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="text-xl font-bold mb-4">Governing Law</h2>
            <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed space-y-3">
              <p>
                These terms shall be governed by and construed in accordance with the laws of the State of California, 
                without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject 
                to the exclusive jurisdiction of the courts located in the State of California.
              </p>
            </div>
          </div>

          {/* Acceptance */}
          <div className="bg-[oklch(0.48_0.20_18)]/5 border border-[oklch(0.48_0.20_18)]/20 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-3">Acceptance of Terms</h2>
            <p className="text-sm text-foreground/85 leading-relaxed">
              By accessing or using this Platform, you acknowledge that you have read, understood, and agree to be bound by 
              these disclaimers and terms of use. If you do not agree with any part of these terms, you must discontinue use 
              of the Platform immediately. We reserve the right to modify these terms at any time without prior notice. Your 
              continued use of the Platform following any changes constitutes acceptance of those changes.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
