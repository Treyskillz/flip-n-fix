// ============================================================
// Fix & Flip Analyzer — Contract Templates
// Assignable contracts for buyers, sellers, and wholesalers
// ============================================================

export interface ContractTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  useCase: string;
  fields: ContractField[];
  sections: ContractSection[];
}

export interface ContractField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'currency' | 'number' | 'textarea';
  placeholder: string;
  required: boolean;
}

export interface ContractSection {
  heading: string;
  body: string; // uses {{fieldId}} for interpolation
}

// ─── ASSIGNABLE PURCHASE & SALE AGREEMENT ────────────────────
export const PURCHASE_AGREEMENT: ContractTemplate = {
  id: 'purchase-agreement',
  title: 'Assignable Purchase & Sale Agreement',
  description: 'Standard real estate purchase agreement with assignment clause. Allows the buyer ("and/or assigns") to assign the contract to another party before closing.',
  icon: '📝',
  useCase: 'Use when purchasing a property with the intent to either close yourself or assign (wholesale) the contract to another buyer.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'buyerName', label: 'Buyer Name (and/or Assigns)', type: 'text', placeholder: 'John Doe and/or Assigns', required: true },
    { id: 'buyerAddress', label: 'Buyer Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'buyerPhone', label: 'Buyer Phone', type: 'text', placeholder: '(555) 123-4567', required: true },
    { id: 'buyerEmail', label: 'Buyer Email', type: 'text', placeholder: 'buyer@email.com', required: true },
    { id: 'sellerName', label: 'Seller Name', type: 'text', placeholder: 'Jane Smith', required: true },
    { id: 'sellerAddress', label: 'Seller Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'sellerPhone', label: 'Seller Phone', type: 'text', placeholder: '(555) 987-6543', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'legalDescription', label: 'Legal Description / APN', type: 'textarea', placeholder: 'Lot 5, Block 2, Subdivision Name, APN: 000-000-000', required: false },
    { id: 'purchasePrice', label: 'Purchase Price', type: 'currency', placeholder: '250000', required: true },
    { id: 'earnestMoney', label: 'Earnest Money Deposit', type: 'currency', placeholder: '5000', required: true },
    { id: 'escrowAgent', label: 'Escrow / Title Company', type: 'text', placeholder: 'ABC Title Company', required: true },
    { id: 'inspectionDays', label: 'Inspection Period (Days)', type: 'number', placeholder: '14', required: true },
    { id: 'closingDate', label: 'Closing Date', type: 'date', placeholder: '', required: true },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'REAL ESTATE PURCHASE AND SALE AGREEMENT',
      body: `This Real Estate Purchase and Sale Agreement ("Agreement") is entered into as of {{effectiveDate}} ("Effective Date"), by and between:

SELLER: {{sellerName}}, with an address at {{sellerAddress}}, Phone: {{sellerPhone}} ("Seller")

BUYER: {{buyerName}}, with an address at {{buyerAddress}}, Phone: {{buyerPhone}}, Email: {{buyerEmail}} ("Buyer")

The Buyer and Seller are collectively referred to as the "Parties."`,
    },
    {
      heading: '1. PROPERTY DESCRIPTION',
      body: `Seller agrees to sell and Buyer agrees to purchase the following described real property ("Property"):

Property Address: {{propertyAddress}}
Legal Description / APN: {{legalDescription}}

Together with all improvements, fixtures, and appurtenances thereto.`,
    },
    {
      heading: '2. PURCHASE PRICE AND PAYMENT',
      body: `The total purchase price for the Property shall be {{purchasePrice}} ("Purchase Price"), payable as follows:

(a) Earnest Money Deposit: Buyer shall deposit {{earnestMoney}} ("Earnest Money") with {{escrowAgent}} ("Escrow Agent") within three (3) business days of the Effective Date. The Earnest Money shall be applied toward the Purchase Price at closing.

(b) Balance: The remaining balance of the Purchase Price shall be paid at closing by cashier's check, wire transfer, or other immediately available funds.`,
    },
    {
      heading: '3. INSPECTION PERIOD',
      body: `Buyer shall have {{inspectionDays}} calendar days from the Effective Date ("Inspection Period") to conduct, at Buyer's expense, any and all inspections, investigations, tests, surveys, and studies of the Property. During the Inspection Period, Buyer may terminate this Agreement for any reason or no reason by providing written notice to Seller, in which case the Earnest Money shall be refunded in full to Buyer.`,
    },
    {
      heading: '4. TITLE AND CLOSING',
      body: `(a) Seller shall convey marketable and insurable fee simple title to the Property by general warranty deed, free and clear of all liens, encumbrances, and defects, except for standard permitted exceptions.

(b) Closing shall take place on or before {{closingDate}} at the offices of {{escrowAgent}}, or at such other time and place as the Parties may mutually agree.

(c) Seller shall pay for the owner's title insurance policy. Buyer shall pay for any lender's title insurance policy.

(d) Real property taxes, assessments, rents, and other customary items shall be prorated as of the closing date.`,
    },
    {
      heading: '5. ASSIGNMENT CLAUSE',
      body: `THIS CONTRACT IS FULLY ASSIGNABLE. Buyer shall have the right to assign this Agreement, in whole or in part, to any person, entity, trust, LLC, or other legal entity ("Assignee") without the prior written consent of Seller. Upon such assignment, the Assignee shall assume all rights and obligations of the Buyer under this Agreement. The original Buyer may, at their option, remain secondarily liable or be fully released from all obligations upon assignment, at the discretion of the Parties. The assignment fee, if any, shall be the sole property of the Buyer and shall not reduce the Purchase Price owed to the Seller.`,
    },
    {
      heading: '6. SELLER REPRESENTATIONS AND WARRANTIES',
      body: `Seller represents and warrants that:
(a) Seller has full authority to enter into this Agreement and convey the Property.
(b) There are no pending or threatened legal actions affecting the Property.
(c) Seller has no knowledge of any environmental hazards or violations on the Property.
(d) All information provided by Seller regarding the Property is true and accurate to the best of Seller's knowledge.
(e) The Property is not subject to any undisclosed liens, encumbrances, or assessments.`,
    },
    {
      heading: '7. DEFAULT AND REMEDIES',
      body: `(a) If Buyer defaults, Seller's sole remedy shall be to retain the Earnest Money as liquidated damages, and both Parties shall be released from further obligations under this Agreement.

(b) If Seller defaults, Buyer may: (i) seek specific performance of this Agreement; (ii) terminate this Agreement and receive a full refund of the Earnest Money; or (iii) pursue any other remedy available at law or in equity.`,
    },
    {
      heading: '8. PROPERTY CONDITION',
      body: `The Property is being sold in "AS-IS, WHERE-IS" condition, with all faults. Seller makes no warranties, express or implied, regarding the condition of the Property, except as specifically stated in this Agreement. Buyer acknowledges that Buyer has had or will have the opportunity to inspect the Property during the Inspection Period.`,
    },
    {
      heading: '9. RISK OF LOSS',
      body: `Risk of loss or damage to the Property shall remain with Seller until closing. If the Property is substantially damaged or destroyed prior to closing, Buyer may terminate this Agreement and receive a full refund of the Earnest Money.`,
    },
    {
      heading: '10. GOVERNING LAW',
      body: `This Agreement shall be governed by and construed in accordance with the laws of the State of {{state}}.`,
    },
    {
      heading: '11. ENTIRE AGREEMENT',
      body: `This Agreement constitutes the entire agreement between the Parties and supersedes all prior negotiations, representations, warranties, commitments, offers, and agreements, whether written or oral. This Agreement may not be amended or modified except by a written instrument signed by both Parties.`,
    },
    {
      heading: '12. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.


BUYER: ___________________________________     Date: _______________
       {{buyerName}}


SELLER: ___________________________________     Date: _______________
        {{sellerName}}`,
    },
  ],
};

// ─── ASSIGNMENT OF CONTRACT ──────────────────────────────────
export const ASSIGNMENT_CONTRACT: ContractTemplate = {
  id: 'assignment-contract',
  title: 'Assignment of Real Estate Contract',
  description: 'Used by wholesalers to assign their purchase agreement rights to an end buyer for an assignment fee.',
  icon: '🔄',
  useCase: 'Use when you have a property under contract and want to assign your purchase rights to another buyer (end buyer/investor) for a fee.',
  fields: [
    { id: 'effectiveDate', label: 'Assignment Date', type: 'date', placeholder: '', required: true },
    { id: 'assignorName', label: 'Assignor Name (Wholesaler)', type: 'text', placeholder: 'John Doe / ABC Investments LLC', required: true },
    { id: 'assignorAddress', label: 'Assignor Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'assigneeName', label: 'Assignee Name (End Buyer)', type: 'text', placeholder: 'Jane Smith / XYZ Holdings LLC', required: true },
    { id: 'assigneeAddress', label: 'Assignee Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'originalContractDate', label: 'Original Contract Date', type: 'date', placeholder: '', required: true },
    { id: 'sellerName', label: 'Original Seller Name', type: 'text', placeholder: 'Property Owner Name', required: true },
    { id: 'originalPurchasePrice', label: 'Original Purchase Price', type: 'currency', placeholder: '250000', required: true },
    { id: 'assignmentFee', label: 'Assignment Fee', type: 'currency', placeholder: '10000', required: true },
    { id: 'assignmentDeposit', label: 'Non-Refundable Assignment Deposit', type: 'currency', placeholder: '2000', required: true },
    { id: 'closingDate', label: 'Closing Date', type: 'date', placeholder: '', required: true },
    { id: 'escrowAgent', label: 'Escrow / Title Company', type: 'text', placeholder: 'ABC Title Company', required: true },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'ASSIGNMENT OF REAL ESTATE PURCHASE CONTRACT',
      body: `This Assignment of Real Estate Purchase Contract ("Assignment") is entered into as of {{effectiveDate}}, by and between:

ASSIGNOR: {{assignorName}}, with an address at {{assignorAddress}} ("Assignor")

ASSIGNEE: {{assigneeName}}, with an address at {{assigneeAddress}} ("Assignee")`,
    },
    {
      heading: '1. RECITALS',
      body: `WHEREAS, Assignor entered into a Real Estate Purchase and Sale Agreement dated {{originalContractDate}} ("Original Contract") with {{sellerName}} ("Seller") for the purchase of real property located at:

{{propertyAddress}}

at an original purchase price of {{originalPurchasePrice}} ("Original Purchase Price");

WHEREAS, the Original Contract contains a provision permitting assignment of the Buyer's rights and obligations;

WHEREAS, Assignor desires to assign all rights, title, and interest in the Original Contract to Assignee, and Assignee desires to accept such assignment;

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:`,
    },
    {
      heading: '2. ASSIGNMENT',
      body: `Assignor hereby assigns, transfers, and conveys to Assignee all of Assignor's right, title, and interest in and to the Original Contract, including but not limited to the right to purchase the Property on the terms and conditions set forth in the Original Contract.`,
    },
    {
      heading: '3. ASSIGNMENT FEE',
      body: `In consideration for this Assignment, Assignee shall pay Assignor an assignment fee of {{assignmentFee}} ("Assignment Fee"), payable as follows:

(a) Non-Refundable Deposit: Assignee shall pay {{assignmentDeposit}} to Assignor upon execution of this Assignment. This deposit is NON-REFUNDABLE and shall be credited toward the Assignment Fee at closing.

(b) Balance: The remaining balance of the Assignment Fee shall be paid at closing through the Escrow Agent.

(c) The Assignment Fee shall be paid from closing proceeds through {{escrowAgent}} and shall appear on the settlement statement (HUD-1 / Closing Disclosure) as an assignment fee.`,
    },
    {
      heading: '4. ASSUMPTION OF OBLIGATIONS',
      body: `Assignee hereby assumes and agrees to perform all obligations and duties of the Buyer under the Original Contract, including but not limited to:

(a) Payment of the Original Purchase Price of {{originalPurchasePrice}} to the Seller at closing.
(b) Compliance with all terms, conditions, and deadlines in the Original Contract.
(c) Closing on or before {{closingDate}}.

Assignee acknowledges having received, reviewed, and accepted the terms of the Original Contract.`,
    },
    {
      heading: '5. RELEASE OF ASSIGNOR',
      body: `Upon closing of the transaction, Assignor shall be fully released and discharged from any and all obligations, liabilities, and duties arising under the Original Contract. If the transaction fails to close due to Assignee's default, Assignor shall retain the Non-Refundable Deposit as liquidated damages.`,
    },
    {
      heading: '6. REPRESENTATIONS AND WARRANTIES',
      body: `(a) Assignor represents that the Original Contract is in full force and effect, has not been modified or amended (except as disclosed herein), and is fully assignable.

(b) Assignor represents that Assignor is not in default under the Original Contract.

(c) Assignee represents that Assignee has the financial capacity and intent to close the transaction on the terms set forth in the Original Contract.

(d) Assignee acknowledges that the Property is being purchased in "AS-IS" condition as stated in the Original Contract.`,
    },
    {
      heading: '7. CONFIDENTIALITY',
      body: `The Assignment Fee and the terms of this Assignment shall remain confidential between the Parties and shall not be disclosed to the Seller or any third party, except as required by law, the Escrow Agent, or as necessary to complete the closing.`,
    },
    {
      heading: '8. GOVERNING LAW',
      body: `This Assignment shall be governed by and construed in accordance with the laws of the State of {{state}}.`,
    },
    {
      heading: '9. ENTIRE AGREEMENT',
      body: `This Assignment, together with the Original Contract, constitutes the entire agreement between the Parties regarding the subject matter hereof. This Assignment may not be amended except in writing signed by both Parties.`,
    },
    {
      heading: '10. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Assignment as of the date first written above.


ASSIGNOR: ___________________________________     Date: _______________
           {{assignorName}}


ASSIGNEE: ___________________________________     Date: _______________
           {{assigneeName}}`,
    },
  ],
};

// ─── WHOLESALE / DOUBLE-CLOSE AGREEMENT ──────────────────────
export const WHOLESALE_AGREEMENT: ContractTemplate = {
  id: 'wholesale-agreement',
  title: 'Wholesale Purchase Agreement (And/Or Assigns)',
  description: 'A streamlined purchase agreement specifically designed for wholesale transactions with built-in assignment language and investor-friendly terms.',
  icon: '💰',
  useCase: 'Use as your primary offer contract when wholesaling. Includes "and/or assigns" language, short inspection period, and flexible closing terms ideal for wholesale deals.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'buyerName', label: 'Buyer / Wholesaler Name', type: 'text', placeholder: 'John Doe and/or Assigns', required: true },
    { id: 'buyerEntity', label: 'Buyer Entity (if applicable)', type: 'text', placeholder: 'ABC Investments LLC', required: false },
    { id: 'buyerAddress', label: 'Buyer Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'buyerPhone', label: 'Buyer Phone', type: 'text', placeholder: '(555) 123-4567', required: true },
    { id: 'buyerEmail', label: 'Buyer Email', type: 'text', placeholder: 'buyer@email.com', required: true },
    { id: 'sellerName', label: 'Seller Name', type: 'text', placeholder: 'Jane Smith', required: true },
    { id: 'sellerAddress', label: 'Seller Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'sellerPhone', label: 'Seller Phone', type: 'text', placeholder: '(555) 987-6543', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'legalDescription', label: 'Legal Description / APN', type: 'textarea', placeholder: 'APN: 000-000-000', required: false },
    { id: 'purchasePrice', label: 'Purchase Price', type: 'currency', placeholder: '200000', required: true },
    { id: 'earnestMoney', label: 'Earnest Money Deposit', type: 'currency', placeholder: '1000', required: true },
    { id: 'inspectionDays', label: 'Inspection / Due Diligence Period (Days)', type: 'number', placeholder: '10', required: true },
    { id: 'closingDays', label: 'Days to Close (from Effective Date)', type: 'number', placeholder: '30', required: true },
    { id: 'escrowAgent', label: 'Escrow / Title Company', type: 'text', placeholder: 'ABC Title Company', required: true },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'WHOLESALE REAL ESTATE PURCHASE AGREEMENT',
      body: `This Wholesale Real Estate Purchase Agreement ("Agreement") is made and entered into as of {{effectiveDate}} ("Effective Date"), by and between:

SELLER: {{sellerName}}, residing at {{sellerAddress}}, Phone: {{sellerPhone}} ("Seller")

BUYER: {{buyerName}}, {{buyerEntity}}, residing at {{buyerAddress}}, Phone: {{buyerPhone}}, Email: {{buyerEmail}}, AND/OR ASSIGNS ("Buyer")

IMPORTANT: The term "Buyer" as used throughout this Agreement shall include the named Buyer and/or any person, entity, trust, LLC, corporation, or other legal entity to whom the Buyer may assign this Agreement.`,
    },
    {
      heading: '1. PROPERTY',
      body: `Seller agrees to sell and convey, and Buyer and/or Assigns agrees to purchase, the following described real property:

Address: {{propertyAddress}}
Legal Description / APN: {{legalDescription}}

Including all improvements, fixtures, and appurtenances ("Property").`,
    },
    {
      heading: '2. PURCHASE PRICE',
      body: `The Purchase Price shall be {{purchasePrice}}, payable at closing by cash, cashier's check, wire transfer, or other immediately available funds.`,
    },
    {
      heading: '3. EARNEST MONEY',
      body: `Buyer shall deposit {{earnestMoney}} as Earnest Money with {{escrowAgent}} within three (3) business days of the Effective Date. Earnest Money shall be applied to the Purchase Price at closing. During the Inspection Period, the Earnest Money is fully refundable upon Buyer's cancellation.`,
    },
    {
      heading: '4. DUE DILIGENCE / INSPECTION PERIOD',
      body: `Buyer shall have {{inspectionDays}} calendar days from the Effective Date ("Inspection Period") to inspect the Property and conduct all due diligence. During this period, Buyer may cancel this Agreement for any reason by providing written notice to Seller, and the Earnest Money shall be returned in full. If Buyer does not cancel within the Inspection Period, the Earnest Money becomes non-refundable (except in the event of Seller's default or title defect).`,
    },
    {
      heading: '5. CLOSING',
      body: `Closing shall occur within {{closingDays}} calendar days from the Effective Date at the offices of {{escrowAgent}}, or at such other location as mutually agreed. Seller shall deliver a general warranty deed conveying marketable title, free and clear of all liens and encumbrances except standard permitted exceptions.`,
    },
    {
      heading: '6. ASSIGNMENT RIGHTS',
      body: `BUYER'S RIGHT TO ASSIGN: Buyer shall have the unrestricted right to assign this Agreement, in whole or in part, to any third party ("Assignee") at any time prior to closing, without the consent of Seller. Upon assignment:

(a) The Assignee shall assume all rights and obligations of the Buyer.
(b) Any assignment fee charged by Buyer to the Assignee is the sole property of the Buyer and shall not affect the Purchase Price owed to Seller.
(c) Seller acknowledges and agrees that Buyer is entering into this Agreement with the intent to assign and that Buyer may profit from such assignment.
(d) Buyer may, at Buyer's option, conduct a simultaneous closing (double close) using transactional funding.`,
    },
    {
      heading: '7. PROPERTY CONDITION',
      body: `The Property is sold in "AS-IS, WHERE-IS" condition. Seller makes no representations or warranties regarding the condition of the Property. Buyer (or Assignee) accepts the Property in its present condition and assumes all responsibility for any repairs, code violations, or environmental conditions.`,
    },
    {
      heading: '8. SELLER DISCLOSURES',
      body: `Seller agrees to disclose any known material defects, pending litigation, code violations, liens, or encumbrances affecting the Property. Seller represents that Seller has the legal authority to sell the Property and that no other party has a claim or interest in the Property.`,
    },
    {
      heading: '9. ACCESS',
      body: `Seller shall provide Buyer and Buyer's agents, contractors, and inspectors reasonable access to the Property during the Inspection Period and prior to closing for the purpose of inspections, appraisals, and showing the Property to potential Assignees or lenders.`,
    },
    {
      heading: '10. DEFAULT',
      body: `(a) Buyer Default: If Buyer fails to close (and has not assigned the contract), Seller's sole remedy shall be to retain the Earnest Money as liquidated damages.

(b) Seller Default: If Seller fails to perform, Buyer may: (i) seek specific performance; (ii) terminate and receive full refund of Earnest Money; or (iii) pursue damages.`,
    },
    {
      heading: '11. GOVERNING LAW',
      body: `This Agreement shall be governed by the laws of the State of {{state}}. Any disputes shall be resolved in the courts of {{state}}.`,
    },
    {
      heading: '12. ENTIRE AGREEMENT',
      body: `This Agreement constitutes the entire understanding between the Parties. No modifications shall be valid unless in writing and signed by both Parties.`,
    },
    {
      heading: '13. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.


BUYER: ___________________________________     Date: _______________
       {{buyerName}}
       {{buyerEntity}}


SELLER: ___________________________________     Date: _______________
        {{sellerName}}


WITNESS: __________________________________     Date: _______________

WITNESS: __________________________________     Date: _______________`,
    },
  ],
};

// ─── JOINT VENTURE AGREEMENT ─────────────────────────────────
export const JOINT_VENTURE_AGREEMENT: ContractTemplate = {
  id: 'joint-venture',
  title: 'Joint Venture Agreement',
  description: 'Partnership agreement for two or more investors collaborating on a real estate deal, defining roles, capital contributions, profit splits, and exit terms.',
  icon: '🤝',
  useCase: 'Use when partnering with another investor on a fix & flip, wholesale deal, or rental acquisition where each party contributes capital, labor, or expertise.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'party1Name', label: 'Party 1 Name', type: 'text', placeholder: 'John Doe / ABC Investments LLC', required: true },
    { id: 'party1Address', label: 'Party 1 Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'party2Name', label: 'Party 2 Name', type: 'text', placeholder: 'Jane Smith / XYZ Holdings LLC', required: true },
    { id: 'party2Address', label: 'Party 2 Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'ventureName', label: 'Joint Venture Name', type: 'text', placeholder: 'Doe-Smith JV', required: false },
    { id: 'party1Contribution', label: 'Party 1 Capital Contribution', type: 'currency', placeholder: '50000', required: true },
    { id: 'party2Contribution', label: 'Party 2 Capital Contribution', type: 'currency', placeholder: '50000', required: true },
    { id: 'profitSplitParty1', label: 'Party 1 Profit Share (%)', type: 'number', placeholder: '50', required: true },
    { id: 'profitSplitParty2', label: 'Party 2 Profit Share (%)', type: 'number', placeholder: '50', required: true },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'JOINT VENTURE AGREEMENT',
      body: `This Joint Venture Agreement ("Agreement") is entered into as of {{effectiveDate}}, by and between:\n\nPARTY 1: {{party1Name}}, with an address at {{party1Address}} ("Party 1")\n\nPARTY 2: {{party2Name}}, with an address at {{party2Address}} ("Party 2")\n\nCollectively referred to as the "Venturers" or "Parties."`,
    },
    {
      heading: '1. PURPOSE',
      body: `The Parties hereby form a Joint Venture ("{{ventureName}}") for the sole purpose of acquiring, renovating, and reselling (or holding) the real property located at:\n\n{{propertyAddress}}\n\nThis Joint Venture is formed solely for the above-described project and shall terminate upon completion of the project and distribution of all profits.`,
    },
    {
      heading: '2. CAPITAL CONTRIBUTIONS',
      body: `Each Party shall contribute the following capital to the Joint Venture:\n\n(a) Party 1 Contribution: {{party1Contribution}}\n(b) Party 2 Contribution: {{party2Contribution}}\n\nAll capital contributions shall be deposited into a jointly controlled bank account within ten (10) business days of executing this Agreement. Additional capital calls, if needed, shall be contributed proportionally unless otherwise agreed in writing.`,
    },
    {
      heading: '3. ROLES AND RESPONSIBILITIES',
      body: `(a) Party 1 shall be responsible for: [Describe — e.g., funding, finding deals, managing contractors, etc.]\n\n(b) Party 2 shall be responsible for: [Describe — e.g., project management, rehab oversight, marketing, etc.]\n\nBoth Parties shall have equal decision-making authority on all material matters including purchase price, renovation budget, listing price, and sale terms. Any dispute shall be resolved per Section 10.`,
    },
    {
      heading: '4. PROFIT AND LOSS DISTRIBUTION',
      body: `Net profits and losses from the Joint Venture shall be distributed as follows:\n\n(a) Party 1: {{profitSplitParty1}}%\n(b) Party 2: {{profitSplitParty2}}%\n\n"Net Profit" is defined as the gross sale price minus: (i) original purchase price, (ii) all renovation costs, (iii) holding costs (taxes, insurance, utilities, loan payments), (iv) closing costs, (v) selling costs (agent commissions, transfer taxes), and (vi) any other agreed-upon expenses.\n\nCapital contributions shall be returned to each Party before profit distribution.`,
    },
    {
      heading: '5. MANAGEMENT AND BANKING',
      body: `(a) A joint bank account shall be opened in the name of the Joint Venture. Both Parties shall be signatories.\n\n(b) All income and expenses related to the project shall flow through the joint account.\n\n(c) Neither Party shall incur expenses exceeding $1,000 without the written consent of the other Party.\n\n(d) Complete and accurate books and records shall be maintained and made available to both Parties at all times.`,
    },
    {
      heading: '6. TERM AND TERMINATION',
      body: `This Joint Venture shall commence on the Effective Date and shall continue until:\n\n(a) The Property has been sold and all profits distributed; or\n(b) The Parties mutually agree in writing to terminate; or\n(c) One Party provides 30 days written notice of withdrawal (subject to buyout provisions in Section 7).`,
    },
    {
      heading: '7. BUYOUT AND WITHDRAWAL',
      body: `If one Party wishes to withdraw before project completion:\n\n(a) The withdrawing Party shall first offer their interest to the remaining Party at fair market value.\n(b) Fair market value shall be determined by mutual agreement or, if disputed, by a licensed appraiser.\n(c) The remaining Party shall have 30 days to accept or decline the buyout.\n(d) If declined, the Parties shall proceed to sell the Property and distribute proceeds per Section 4.`,
    },
    {
      heading: '8. LIABILITY AND INDEMNIFICATION',
      body: `(a) Each Party shall be liable for their own negligent or wrongful acts.\n(b) Neither Party shall bind the other to any obligation without prior written consent.\n(c) Each Party agrees to indemnify and hold harmless the other Party from any claims arising from their individual actions outside the scope of this Agreement.`,
    },
    {
      heading: '9. INSURANCE',
      body: `The Joint Venture shall maintain adequate insurance coverage on the Property, including but not limited to:\n\n(a) Builder's risk / renovation insurance\n(b) General liability insurance\n(c) Property insurance\n\nBoth Parties shall be named as additional insureds on all policies.`,
    },
    {
      heading: '10. DISPUTE RESOLUTION',
      body: `Any disputes arising under this Agreement shall be resolved as follows:\n\n(a) The Parties shall first attempt to resolve disputes through good-faith negotiation.\n(b) If unresolved within 30 days, the dispute shall be submitted to binding mediation.\n(c) If mediation fails, the dispute shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association in the State of {{state}}.`,
    },
    {
      heading: '11. GOVERNING LAW',
      body: `This Agreement shall be governed by and construed in accordance with the laws of the State of {{state}}.`,
    },
    {
      heading: '12. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Joint Venture Agreement as of the date first written above.\n\n\nPARTY 1: ___________________________________     Date: _______________\n         {{party1Name}}\n\n\nPARTY 2: ___________________________________     Date: _______________\n         {{party2Name}}`,
    },
  ],
};

// ─── PRIVATE MONEY LENDING AGREEMENT ─────────────────────────
export const PRIVATE_MONEY_AGREEMENT: ContractTemplate = {
  id: 'private-money',
  title: 'Private Money Lending Agreement',
  description: 'Promissory note and lending agreement for borrowing funds from a private lender, secured by real property.',
  icon: '🏦',
  useCase: 'Use when borrowing money from a private individual or entity to fund a real estate purchase or renovation, secured by a deed of trust or mortgage on the property.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'lenderName', label: 'Lender Name', type: 'text', placeholder: 'Jane Smith / Private Capital LLC', required: true },
    { id: 'lenderAddress', label: 'Lender Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'borrowerName', label: 'Borrower Name', type: 'text', placeholder: 'John Doe / ABC Investments LLC', required: true },
    { id: 'borrowerAddress', label: 'Borrower Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'propertyAddress', label: 'Property Address (Collateral)', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'loanAmount', label: 'Loan Amount', type: 'currency', placeholder: '200000', required: true },
    { id: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: '10', required: true },
    { id: 'loanTermMonths', label: 'Loan Term (Months)', type: 'number', placeholder: '12', required: true },
    { id: 'monthlyPayment', label: 'Monthly Interest Payment', type: 'currency', placeholder: '1667', required: true },
    { id: 'originationFee', label: 'Origination Fee (Points)', type: 'text', placeholder: '2 points ($4,000)', required: false },
    { id: 'maturityDate', label: 'Maturity Date', type: 'date', placeholder: '', required: true },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'PRIVATE MONEY LENDING AGREEMENT & PROMISSORY NOTE',
      body: `This Private Money Lending Agreement and Promissory Note ("Agreement") is entered into as of {{effectiveDate}}, by and between:\n\nLENDER: {{lenderName}}, with an address at {{lenderAddress}} ("Lender")\n\nBORROWER: {{borrowerName}}, with an address at {{borrowerAddress}} ("Borrower")`,
    },
    {
      heading: '1. LOAN TERMS',
      body: `(a) Loan Amount: Lender agrees to lend Borrower the sum of {{loanAmount}} ("Loan").\n\n(b) Interest Rate: The Loan shall bear interest at the rate of {{interestRate}}% per annum, calculated on the outstanding principal balance.\n\n(c) Loan Term: The Loan shall have a term of {{loanTermMonths}} months, maturing on {{maturityDate}} ("Maturity Date").\n\n(d) Monthly Payments: Borrower shall make monthly interest-only payments of {{monthlyPayment}} on the first day of each month, beginning 30 days after funding.\n\n(e) Balloon Payment: The entire outstanding principal balance, plus any accrued and unpaid interest, shall be due and payable on the Maturity Date.\n\n(f) Origination Fee: Borrower shall pay an origination fee of {{originationFee}}, deducted from loan proceeds at funding.`,
    },
    {
      heading: '2. SECURITY / COLLATERAL',
      body: `The Loan shall be secured by a Deed of Trust (or Mortgage, as applicable) recorded against the following real property:\n\n{{propertyAddress}}\n\nBorrower shall execute and deliver a Deed of Trust (or Mortgage) in favor of Lender, to be recorded in the county where the Property is located. Lender shall be named as the beneficiary and shall hold a first-position lien (or as otherwise agreed) on the Property.`,
    },
    {
      heading: '3. USE OF FUNDS',
      body: `Borrower shall use the Loan proceeds solely for the purpose of:\n\n(a) Acquiring the Property; and/or\n(b) Renovating and improving the Property; and/or\n(c) Costs associated with the above (closing costs, insurance, permits, etc.)\n\nBorrower shall not use Loan proceeds for any purpose unrelated to the Property without Lender's prior written consent.`,
    },
    {
      heading: '4. INSURANCE AND TAXES',
      body: `(a) Borrower shall maintain adequate property insurance naming Lender as an additional insured and loss payee.\n\n(b) Borrower shall keep all real property taxes current and provide proof of payment upon request.\n\n(c) If Borrower fails to maintain insurance or pay taxes, Lender may do so and add the cost to the outstanding Loan balance.`,
    },
    {
      heading: '5. DEFAULT AND REMEDIES',
      body: `The following shall constitute Events of Default:\n\n(a) Failure to make any payment within 10 days of the due date.\n(b) Failure to maintain insurance on the Property.\n(c) Filing of bankruptcy by or against Borrower.\n(d) Material misrepresentation by Borrower.\n(e) Failure to pay property taxes when due.\n(f) Any material breach of this Agreement.\n\nUpon default, Lender may:\n(i) Declare the entire outstanding balance immediately due and payable.\n(ii) Charge a late fee of 5% of the overdue payment amount.\n(iii) Charge default interest at {{interestRate}}% + 5% per annum.\n(iv) Initiate foreclosure proceedings on the Property.\n(v) Pursue any other remedy available at law or in equity.`,
    },
    {
      heading: '6. PREPAYMENT',
      body: `Borrower may prepay the Loan in whole or in part at any time without penalty. Any prepayment shall be applied first to accrued interest, then to principal.`,
    },
    {
      heading: '7. GOVERNING LAW',
      body: `This Agreement shall be governed by the laws of the State of {{state}}. Borrower consents to jurisdiction in the courts of {{state}}.`,
    },
    {
      heading: '8. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.\n\n\nBORROWER: ___________________________________     Date: _______________\n          {{borrowerName}}\n\n\nLENDER: ___________________________________     Date: _______________\n        {{lenderName}}`,
    },
  ],
};

// ─── LEASE OPTION AGREEMENT ──────────────────────────────────
export const LEASE_OPTION_AGREEMENT: ContractTemplate = {
  id: 'lease-option',
  title: 'Lease with Option to Purchase Agreement',
  description: 'Combined lease and option agreement giving the tenant the right (but not obligation) to purchase the property during or at the end of the lease term.',
  icon: '🔑',
  useCase: 'Use for lease-option (rent-to-own) deals where a tenant-buyer leases the property with an option to purchase at a predetermined price.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'landlordName', label: 'Landlord/Seller Name', type: 'text', placeholder: 'John Doe / ABC Properties LLC', required: true },
    { id: 'landlordAddress', label: 'Landlord Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'tenantName', label: 'Tenant/Buyer Name', type: 'text', placeholder: 'Jane Smith', required: true },
    { id: 'tenantAddress', label: 'Tenant Current Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'monthlyRent', label: 'Monthly Rent', type: 'currency', placeholder: '1500', required: true },
    { id: 'rentCredit', label: 'Monthly Rent Credit Toward Purchase', type: 'currency', placeholder: '300', required: true },
    { id: 'optionFee', label: 'Option Fee (Non-Refundable)', type: 'currency', placeholder: '5000', required: true },
    { id: 'purchasePrice', label: 'Option Purchase Price', type: 'currency', placeholder: '250000', required: true },
    { id: 'leaseTerm', label: 'Lease Term (Months)', type: 'number', placeholder: '24', required: true },
    { id: 'optionExpiry', label: 'Option Expiration Date', type: 'date', placeholder: '', required: true },
    { id: 'securityDeposit', label: 'Security Deposit', type: 'currency', placeholder: '1500', required: true },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'LEASE WITH OPTION TO PURCHASE AGREEMENT',
      body: `This Lease with Option to Purchase Agreement ("Agreement") is entered into as of {{effectiveDate}}, by and between:\n\nLANDLORD/SELLER: {{landlordName}}, with an address at {{landlordAddress}} ("Landlord")\n\nTENANT/BUYER: {{tenantName}}, currently residing at {{tenantAddress}} ("Tenant")`,
    },
    {
      heading: 'PART A: LEASE AGREEMENT',
      body: `1. PROPERTY: Landlord leases to Tenant the property located at {{propertyAddress}} ("Property").\n\n2. LEASE TERM: The lease term shall be {{leaseTerm}} months, commencing on {{effectiveDate}}.\n\n3. RENT: Tenant shall pay monthly rent of {{monthlyRent}}, due on the 1st of each month. A late fee of 5% shall apply to payments received after the 5th.\n\n4. SECURITY DEPOSIT: Tenant shall pay a security deposit of {{securityDeposit}}, refundable per state law upon lease termination (if option is not exercised).\n\n5. MAINTENANCE: Tenant shall maintain the Property in good condition and shall be responsible for all repairs and maintenance during the lease term. Tenant shall maintain the lawn, landscaping, and general upkeep.\n\n6. INSURANCE: Tenant shall maintain renter's insurance with a minimum of $100,000 liability coverage.\n\n7. UTILITIES: Tenant shall be responsible for all utilities including electric, gas, water, sewer, trash, cable, and internet.`,
    },
    {
      heading: 'PART B: OPTION TO PURCHASE',
      body: `8. OPTION FEE: Tenant shall pay a non-refundable option fee of {{optionFee}} upon execution of this Agreement. The option fee shall be credited toward the purchase price if Tenant exercises the option.\n\n9. PURCHASE PRICE: The purchase price shall be {{purchasePrice}} if Tenant exercises the option on or before {{optionExpiry}}.\n\n10. RENT CREDITS: Of the monthly rent of {{monthlyRent}}, a credit of {{rentCredit}} per month shall be applied toward the purchase price, provided rent is paid on time (by the 5th of each month). Late payments forfeit that month's rent credit.\n\n11. EXERCISE OF OPTION: Tenant must provide written notice of intent to exercise the option at least 60 days before the option expiration date. Tenant is responsible for obtaining their own financing.\n\n12. OPTION EXPIRATION: If Tenant does not exercise the option by {{optionExpiry}}, the option expires, all option fees and rent credits are forfeited, and the lease terminates per its terms.\n\n13. NON-ASSIGNABLE: This option is personal to Tenant and may not be assigned or transferred without Landlord's written consent.`,
    },
    {
      heading: 'PART C: GENERAL TERMS',
      body: `14. DEFAULT: If Tenant defaults on rent or any lease term, Landlord may terminate both the lease and the option. All option fees and rent credits are forfeited upon default.\n\n15. PROPERTY CONDITION: Tenant accepts the Property in its current "AS-IS" condition.\n\n16. GOVERNING LAW: This Agreement shall be governed by the laws of the State of {{state}}.\n\n17. ENTIRE AGREEMENT: This Agreement constitutes the entire agreement between the Parties.`,
    },
    {
      heading: '18. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.\n\n\nLANDLORD/SELLER: ___________________________________     Date: _______________\n                 {{landlordName}}\n\n\nTENANT/BUYER: ___________________________________     Date: _______________\n              {{tenantName}}`,
    },
  ],
};

// ─── SUBJECT-TO PURCHASE AGREEMENT ───────────────────────────
export const SUBJECT_TO_AGREEMENT: ContractTemplate = {
  id: 'subject-to',
  title: 'Subject-To Purchase Agreement',
  description: 'Agreement for purchasing property "subject to" the existing mortgage remaining in the seller\'s name while the buyer takes title and makes payments.',
  icon: '🏠',
  useCase: 'Use when purchasing a property by taking over the existing mortgage payments without formally assuming the loan. The deed transfers to the buyer while the loan stays in the seller\'s name.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'buyerName', label: 'Buyer Name', type: 'text', placeholder: 'John Doe / ABC Investments LLC', required: true },
    { id: 'buyerAddress', label: 'Buyer Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'sellerName', label: 'Seller Name', type: 'text', placeholder: 'Jane Smith', required: true },
    { id: 'sellerAddress', label: 'Seller Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'existingLoanBalance', label: 'Existing Loan Balance (Approx)', type: 'currency', placeholder: '180000', required: true },
    { id: 'monthlyMortgage', label: 'Monthly Mortgage Payment (PITI)', type: 'currency', placeholder: '1200', required: true },
    { id: 'lenderName', label: 'Current Lender Name', type: 'text', placeholder: 'Wells Fargo / Bank of America', required: true },
    { id: 'loanNumber', label: 'Loan Number (Last 4 digits)', type: 'text', placeholder: 'XXXX', required: true },
    { id: 'cashToSeller', label: 'Cash to Seller at Closing', type: 'currency', placeholder: '5000', required: false },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'SUBJECT-TO REAL ESTATE PURCHASE AGREEMENT',
      body: `This Subject-To Real Estate Purchase Agreement ("Agreement") is entered into as of {{effectiveDate}}, by and between:\n\nSELLER: {{sellerName}}, with an address at {{sellerAddress}} ("Seller")\n\nBUYER: {{buyerName}}, with an address at {{buyerAddress}} ("Buyer")`,
    },
    {
      heading: '1. PROPERTY',
      body: `Seller agrees to sell and convey to Buyer the real property located at:\n\n{{propertyAddress}}\n\nincluding all improvements, fixtures, and appurtenances ("Property").`,
    },
    {
      heading: '2. PURCHASE TERMS — SUBJECT TO EXISTING FINANCING',
      body: `The Property is being purchased SUBJECT TO the existing mortgage/deed of trust held by:\n\nLender: {{lenderName}}\nApproximate Loan Balance: {{existingLoanBalance}}\nLoan Number (Last 4): {{loanNumber}}\nMonthly Payment (PITI): {{monthlyMortgage}}\n\nBuyer shall take title to the Property subject to the existing financing. THE EXISTING LOAN SHALL REMAIN IN SELLER'S NAME. Buyer agrees to make all mortgage payments directly to the lender on or before the due date each month.\n\nAdditional Cash to Seller at Closing: {{cashToSeller}}`,
    },
    {
      heading: '3. DUE-ON-SALE CLAUSE DISCLOSURE',
      body: `IMPORTANT DISCLOSURE: Seller acknowledges and understands that most mortgage loans contain a "due-on-sale" clause that gives the lender the right (but not the obligation) to call the entire loan balance due and payable upon transfer of the Property. While lenders rarely exercise this right when payments are being made on time, there is a risk that the lender may accelerate the loan.\n\nSeller acknowledges:\n(a) Seller has been advised to seek independent legal counsel regarding this transaction.\n(b) Seller understands the due-on-sale risk and voluntarily proceeds with this transaction.\n(c) If the lender calls the loan due, Buyer shall either pay off the loan, refinance, or return the Property to Seller.`,
    },
    {
      heading: '4. BUYER OBLIGATIONS',
      body: `Buyer agrees to:\n\n(a) Make all mortgage payments on time each month.\n(b) Maintain property insurance with Seller named as an additional insured.\n(c) Pay all property taxes when due.\n(d) Maintain the Property in good condition.\n(e) Not allow any additional liens to be placed on the Property.\n(f) Provide Seller with proof of payment upon request.`,
    },
    {
      heading: '5. SELLER PROTECTIONS',
      body: `(a) Seller shall receive monthly confirmation that mortgage payments have been made (via lender statement or payment confirmation).\n(b) If Buyer fails to make a payment within 15 days of the due date, Seller may cure the default and pursue remedies including reconveyance of the Property.\n(c) Seller retains the right to monitor the loan status with the lender.`,
    },
    {
      heading: '6. TITLE TRANSFER',
      body: `Seller shall convey title to Buyer by warranty deed or grant deed at closing. Title shall be transferred through a title company or attorney to ensure proper recording.`,
    },
    {
      heading: '7. PROPERTY CONDITION',
      body: `The Property is sold in "AS-IS" condition. Buyer accepts the Property in its present state.`,
    },
    {
      heading: '8. GOVERNING LAW',
      body: `This Agreement shall be governed by the laws of the State of {{state}}.`,
    },
    {
      heading: '9. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.\n\n\nBUYER: ___________________________________     Date: _______________\n       {{buyerName}}\n\n\nSELLER: ___________________________________     Date: _______________\n        {{sellerName}}\n\n\nWITNESS: __________________________________     Date: _______________`,
    },
  ],
};

// ─── SELLER FINANCING AGREEMENT ──────────────────────────────
export const SELLER_FINANCING_AGREEMENT: ContractTemplate = {
  id: 'seller-financing',
  title: 'Seller Financing / Owner Carry Agreement',
  description: 'Agreement where the seller acts as the lender, carrying a note secured by the property. Buyer makes payments directly to the seller instead of a bank.',
  icon: '📋',
  useCase: 'Use when the seller agrees to finance the purchase directly — no bank involved. Common in creative deals where the buyer cannot qualify for traditional financing.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'sellerName', label: 'Seller Name', type: 'text', placeholder: 'Jane Smith', required: true },
    { id: 'sellerAddress', label: 'Seller Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'buyerName', label: 'Buyer Name', type: 'text', placeholder: 'John Doe / ABC Investments LLC', required: true },
    { id: 'buyerAddress', label: 'Buyer Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'purchasePrice', label: 'Purchase Price', type: 'currency', placeholder: '250000', required: true },
    { id: 'downPayment', label: 'Down Payment', type: 'currency', placeholder: '25000', required: true },
    { id: 'financedAmount', label: 'Financed Amount', type: 'currency', placeholder: '225000', required: true },
    { id: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: '6', required: true },
    { id: 'monthlyPayment', label: 'Monthly Payment', type: 'currency', placeholder: '1349', required: true },
    { id: 'loanTermYears', label: 'Loan Term (Years)', type: 'number', placeholder: '30', required: true },
    { id: 'balloonYears', label: 'Balloon Payment Due (Years)', type: 'number', placeholder: '5', required: false },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'SELLER FINANCING AGREEMENT',
      body: `This Seller Financing Agreement ("Agreement") is entered into as of {{effectiveDate}}, by and between:\n\nSELLER/LENDER: {{sellerName}}, with an address at {{sellerAddress}} ("Seller")\n\nBUYER/BORROWER: {{buyerName}}, with an address at {{buyerAddress}} ("Buyer")`,
    },
    {
      heading: '1. SALE OF PROPERTY',
      body: `Seller agrees to sell and Buyer agrees to purchase the real property located at:\n\n{{propertyAddress}}\n\nfor a total purchase price of {{purchasePrice}}.`,
    },
    {
      heading: '2. FINANCING TERMS',
      body: `(a) Down Payment: Buyer shall pay {{downPayment}} at closing.\n\n(b) Financed Amount: Seller shall carry a note in the amount of {{financedAmount}}, secured by a Deed of Trust (or Mortgage) on the Property.\n\n(c) Interest Rate: {{interestRate}}% per annum, fixed.\n\n(d) Monthly Payment: {{monthlyPayment}} (principal and interest), due on the 1st of each month.\n\n(e) Amortization: The note shall be amortized over {{loanTermYears}} years.\n\n(f) Balloon Payment: The entire remaining balance shall be due and payable {{balloonYears}} years from the date of closing (if applicable).\n\n(g) Late Fee: A late fee of 5% of the monthly payment shall apply to payments received more than 10 days late.\n\n(h) Prepayment: Buyer may prepay the note in whole or in part at any time without penalty.`,
    },
    {
      heading: '3. SECURITY',
      body: `The note shall be secured by a Deed of Trust (or Mortgage) recorded against the Property in favor of Seller. Seller shall hold a first-position lien on the Property.`,
    },
    {
      heading: '4. BUYER OBLIGATIONS',
      body: `Buyer shall:\n(a) Maintain property insurance naming Seller as loss payee.\n(b) Pay all property taxes when due.\n(c) Maintain the Property in good condition.\n(d) Not place any additional liens on the Property without Seller's consent.`,
    },
    {
      heading: '5. DEFAULT',
      body: `If Buyer fails to make any payment within 30 days of the due date, or breaches any material term, Seller may:\n(a) Declare the entire balance due and payable.\n(b) Initiate foreclosure proceedings.\n(c) Pursue any other remedy available at law or in equity.\n\nBuyer shall have a 30-day cure period after written notice of default.`,
    },
    {
      heading: '6. TITLE TRANSFER',
      body: `Seller shall convey title to Buyer by warranty deed at closing, subject to the Deed of Trust securing the seller-financed note.`,
    },
    {
      heading: '7. GOVERNING LAW',
      body: `This Agreement shall be governed by the laws of the State of {{state}}.`,
    },
    {
      heading: '8. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.\n\n\nSELLER: ___________________________________     Date: _______________\n        {{sellerName}}\n\n\nBUYER: ___________________________________     Date: _______________\n       {{buyerName}}`,
    },
  ],
};

// ─── PROPERTY MANAGEMENT AGREEMENT ───────────────────────────
export const PROPERTY_MANAGEMENT_AGREEMENT: ContractTemplate = {
  id: 'property-management',
  title: 'Property Management Agreement',
  description: 'Agreement between a property owner and a property manager defining management duties, fees, authority, and terms for managing a rental property.',
  icon: '🏢',
  useCase: 'Use when hiring a property manager to handle your rental property — tenant screening, rent collection, maintenance, and day-to-day management.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'ownerName', label: 'Property Owner Name', type: 'text', placeholder: 'John Doe / ABC Investments LLC', required: true },
    { id: 'ownerAddress', label: 'Owner Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'managerName', label: 'Property Manager Name', type: 'text', placeholder: 'XYZ Property Management LLC', required: true },
    { id: 'managerAddress', label: 'Manager Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'managementFee', label: 'Monthly Management Fee (%)', type: 'number', placeholder: '10', required: true },
    { id: 'leaseUpFee', label: 'Lease-Up / Placement Fee', type: 'text', placeholder: 'One month rent or 50% of first month', required: true },
    { id: 'maintenanceLimit', label: 'Maintenance Spending Limit (per item)', type: 'currency', placeholder: '500', required: true },
    { id: 'termMonths', label: 'Agreement Term (Months)', type: 'number', placeholder: '12', required: true },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'PROPERTY MANAGEMENT AGREEMENT',
      body: `This Property Management Agreement ("Agreement") is entered into as of {{effectiveDate}}, by and between:\n\nOWNER: {{ownerName}}, with an address at {{ownerAddress}} ("Owner")\n\nMANAGER: {{managerName}}, with an address at {{managerAddress}} ("Manager")`,
    },
    {
      heading: '1. PROPERTY',
      body: `Owner hereby appoints Manager as the exclusive managing agent for the property located at:\n\n{{propertyAddress}}\n\nincluding all units, common areas, and appurtenances ("Property").`,
    },
    {
      heading: '2. MANAGER DUTIES',
      body: `Manager shall:\n\n(a) Market the Property and procure qualified tenants.\n(b) Screen prospective tenants (credit, background, income verification, rental history).\n(c) Execute leases on behalf of Owner.\n(d) Collect rent and other charges from tenants.\n(e) Handle tenant complaints, requests, and communications.\n(f) Coordinate and oversee maintenance and repairs.\n(g) Conduct periodic property inspections (minimum quarterly).\n(h) Handle lease violations, notices, and eviction proceedings as needed.\n(i) Provide monthly financial statements to Owner.\n(j) Deposit rental income into Owner's designated bank account.`,
    },
    {
      heading: '3. COMPENSATION',
      body: `(a) Management Fee: Owner shall pay Manager {{managementFee}}% of gross monthly rent collected.\n\n(b) Lease-Up Fee: {{leaseUpFee}} for each new tenant placed.\n\n(c) Lease Renewal Fee: $200 per lease renewal.\n\n(d) Maintenance Markup: Manager may charge a 10% markup on maintenance and repair costs coordinated by Manager.\n\n(e) Eviction Fee: $500 per eviction proceeding managed by Manager (excluding legal fees).`,
    },
    {
      heading: '4. MAINTENANCE AND REPAIRS',
      body: `(a) Manager is authorized to make repairs and incur expenses up to {{maintenanceLimit}} per item without prior Owner approval.\n\n(b) For expenses exceeding {{maintenanceLimit}}, Manager shall obtain Owner's written approval before proceeding, except in emergencies threatening life, safety, or property.\n\n(c) Manager shall obtain multiple bids for repairs exceeding $1,000.`,
    },
    {
      heading: '5. TERM AND TERMINATION',
      body: `(a) This Agreement shall be for an initial term of {{termMonths}} months, automatically renewing for successive 12-month periods unless either Party provides 60 days written notice of non-renewal.\n\n(b) Either Party may terminate this Agreement with 30 days written notice for cause (material breach).\n\n(c) Upon termination, Manager shall transfer all keys, records, tenant files, security deposits, and funds to Owner within 30 days.`,
    },
    {
      heading: '6. OWNER OBLIGATIONS',
      body: `Owner shall:\n(a) Maintain adequate property insurance and liability coverage.\n(b) Fund a maintenance reserve account as agreed.\n(c) Comply with all applicable fair housing laws and local ordinances.\n(d) Indemnify Manager against claims arising from Owner's negligence.`,
    },
    {
      heading: '7. GOVERNING LAW',
      body: `This Agreement shall be governed by the laws of the State of {{state}}.`,
    },
    {
      heading: '8. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.\n\n\nOWNER: ___________________________________     Date: _______________\n       {{ownerName}}\n\n\nMANAGER: ___________________________________     Date: _______________\n         {{managerName}}`,
    },
  ],
};

// ─── INDEPENDENT CONTRACTOR AGREEMENT ────────────────────────
export const CONTRACTOR_AGREEMENT: ContractTemplate = {
  id: 'contractor-agreement',
  title: 'Independent Contractor Agreement',
  description: 'Agreement between a property owner/investor and a contractor for renovation or construction work, defining scope, payment terms, timeline, and liability.',
  icon: '🔨',
  useCase: 'Use when hiring a general contractor or subcontractor for renovation work. Establishes the contractor as an independent contractor (not employee) and defines all project terms.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'ownerName', label: 'Property Owner Name', type: 'text', placeholder: 'John Doe / ABC Investments LLC', required: true },
    { id: 'ownerAddress', label: 'Owner Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'contractorName', label: 'Contractor Name', type: 'text', placeholder: 'Mike Johnson / Johnson Construction LLC', required: true },
    { id: 'contractorAddress', label: 'Contractor Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'contractorLicense', label: 'Contractor License Number', type: 'text', placeholder: 'CSLB #123456', required: false },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'totalContractPrice', label: 'Total Contract Price', type: 'currency', placeholder: '50000', required: true },
    { id: 'startDate', label: 'Project Start Date', type: 'date', placeholder: '', required: true },
    { id: 'completionDate', label: 'Expected Completion Date', type: 'date', placeholder: '', required: true },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'INDEPENDENT CONTRACTOR AGREEMENT',
      body: `This Independent Contractor Agreement ("Agreement") is entered into as of {{effectiveDate}}, by and between:\n\nOWNER: {{ownerName}}, with an address at {{ownerAddress}} ("Owner")\n\nCONTRACTOR: {{contractorName}}, with an address at {{contractorAddress}}, License #: {{contractorLicense}} ("Contractor")`,
    },
    {
      heading: '1. SCOPE OF WORK',
      body: `Contractor agrees to perform the following work at the property located at {{propertyAddress}}:\n\n[Attach detailed Scope of Work as Exhibit A — include room-by-room breakdown, materials, specifications, and quality standards]\n\nAll work shall be performed in a professional, workmanlike manner and in compliance with all applicable building codes, permits, and regulations.`,
    },
    {
      heading: '2. CONTRACT PRICE AND PAYMENT',
      body: `(a) Total Contract Price: {{totalContractPrice}}\n\n(b) Payment Schedule:\n    • 10% upon signing this Agreement (mobilization)\n    • 25% upon completion of demolition and rough framing\n    • 25% upon completion of rough mechanical (plumbing, electrical, HVAC)\n    • 25% upon completion of drywall, flooring, and paint\n    • 15% upon final completion and Owner's walkthrough approval\n\n(c) Final payment shall be withheld until:\n    • All work passes final inspection\n    • Contractor provides final lien waiver\n    • All permits are closed\n    • Property is broom-clean`,
    },
    {
      heading: '3. TIMELINE',
      body: `(a) Start Date: {{startDate}}\n(b) Completion Date: {{completionDate}}\n(c) Contractor shall provide a detailed project schedule within 5 days of signing.\n(d) If Contractor fails to complete work by the Completion Date (absent Owner-caused delays or force majeure), a penalty of $100 per day shall be deducted from the final payment.`,
    },
    {
      heading: '4. INDEPENDENT CONTRACTOR STATUS',
      body: `Contractor is an independent contractor, NOT an employee of Owner. Contractor shall:\n(a) Provide their own tools, equipment, and transportation.\n(b) Hire and supervise their own workers and subcontractors.\n(c) Be responsible for all payroll taxes, workers' compensation, and insurance for their employees.\n(d) Maintain their own business licenses and contractor's license.`,
    },
    {
      heading: '5. INSURANCE AND LIABILITY',
      body: `Contractor shall maintain:\n(a) General liability insurance with minimum $1,000,000 per occurrence.\n(b) Workers' compensation insurance as required by state law.\n(c) Auto insurance for all vehicles used on the project.\n\nContractor shall provide certificates of insurance naming Owner as additional insured before commencing work. Contractor shall indemnify and hold Owner harmless from any claims arising from Contractor's work.`,
    },
    {
      heading: '6. PERMITS AND INSPECTIONS',
      body: `(a) Contractor shall obtain all necessary building permits at Contractor's expense (unless otherwise agreed).\n(b) Contractor shall schedule and pass all required inspections.\n(c) Contractor shall provide copies of all permits and inspection reports to Owner.`,
    },
    {
      heading: '7. CHANGE ORDERS',
      body: `Any changes to the scope of work must be documented in a written Change Order signed by both Parties before the work is performed. Change orders shall include:\n(a) Description of the changed work\n(b) Cost adjustment (increase or decrease)\n(c) Timeline adjustment (if any)\n\nNo verbal change orders shall be honored.`,
    },
    {
      heading: '8. WARRANTY',
      body: `Contractor warrants all work for a period of one (1) year from the date of completion. During the warranty period, Contractor shall repair any defects in workmanship or materials at no additional cost to Owner.`,
    },
    {
      heading: '9. LIEN WAIVERS',
      body: `Contractor shall provide:\n(a) Partial lien waivers with each progress payment request.\n(b) Final lien waiver upon completion and final payment.\n(c) Lien waivers from all subcontractors and material suppliers.`,
    },
    {
      heading: '10. TERMINATION',
      body: `(a) Owner may terminate this Agreement at any time with 5 days written notice. Contractor shall be paid for all work completed to date.\n(b) If Contractor abandons the project or fails to maintain progress, Owner may terminate immediately and hire a replacement contractor. Contractor shall be liable for any increased costs.`,
    },
    {
      heading: '11. GOVERNING LAW',
      body: `This Agreement shall be governed by the laws of the State of {{state}}.`,
    },
    {
      heading: '12. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.\n\n\nOWNER: ___________________________________     Date: _______________\n       {{ownerName}}\n\n\nCONTRACTOR: ___________________________________     Date: _______________\n            {{contractorName}}\n            License #: {{contractorLicense}}`,
    },
  ],
};

// ─── GENERAL RELEASE & HOLD HARMLESS ─────────────────────────
export const RELEASE_AGREEMENT: ContractTemplate = {
  id: 'release-hold-harmless',
  title: 'General Release & Hold Harmless Agreement',
  description: 'A release of liability agreement protecting against future claims related to a real estate transaction or property condition.',
  icon: '🛡️',
  useCase: 'Use when closing a transaction, settling a dispute, or whenever you need the other party to release you from liability claims related to the property or deal.',
  fields: [
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', placeholder: '', required: true },
    { id: 'releasorName', label: 'Releasor Name (Party Giving Release)', type: 'text', placeholder: 'Jane Smith', required: true },
    { id: 'releasorAddress', label: 'Releasor Address', type: 'text', placeholder: '123 Main St, City, State ZIP', required: true },
    { id: 'releaseeName', label: 'Releasee Name (Party Being Released)', type: 'text', placeholder: 'John Doe / ABC Investments LLC', required: true },
    { id: 'releaseeAddress', label: 'Releasee Address', type: 'text', placeholder: '456 Oak Ave, City, State ZIP', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Elm St, City, State ZIP', required: true },
    { id: 'transactionDate', label: 'Transaction/Closing Date', type: 'date', placeholder: '', required: true },
    { id: 'consideration', label: 'Consideration (if any)', type: 'text', placeholder: '$500 / mutual release / closing of transaction', required: false },
    { id: 'state', label: 'Governing State', type: 'text', placeholder: 'California', required: true },
  ],
  sections: [
    {
      heading: 'GENERAL RELEASE AND HOLD HARMLESS AGREEMENT',
      body: `This General Release and Hold Harmless Agreement ("Agreement") is entered into as of {{effectiveDate}}, by and between:\n\nRELEASOR: {{releasorName}}, with an address at {{releasorAddress}} ("Releasor")\n\nRELEASEE: {{releaseeName}}, with an address at {{releaseeAddress}} ("Releasee")`,
    },
    {
      heading: '1. RECITALS',
      body: `WHEREAS, the Parties were involved in a real estate transaction involving the property located at {{propertyAddress}}, which closed on or about {{transactionDate}};\n\nWHEREAS, the Parties desire to fully and finally resolve any and all claims, disputes, or potential disputes arising from or related to said transaction and/or the condition of the Property;\n\nNOW, THEREFORE, in consideration of {{consideration}} and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:`,
    },
    {
      heading: '2. RELEASE',
      body: `Releasor hereby RELEASES, ACQUITS, AND FOREVER DISCHARGES Releasee, and Releasee's heirs, successors, assigns, agents, employees, officers, directors, partners, members, and affiliates, from any and all claims, demands, actions, causes of action, suits, debts, obligations, liabilities, damages, losses, costs, and expenses (including attorney's fees) of every kind and nature, whether known or unknown, suspected or unsuspected, which Releasor now has, has ever had, or may hereafter have, arising out of or in any way related to:\n\n(a) The real estate transaction involving the Property at {{propertyAddress}}.\n(b) The condition of the Property, including but not limited to structural, environmental, mechanical, or cosmetic conditions.\n(c) Any representations, warranties, or disclosures (or lack thereof) made in connection with the transaction.\n(d) Any other matter arising from the Parties' dealings related to the Property.`,
    },
    {
      heading: '3. HOLD HARMLESS AND INDEMNIFICATION',
      body: `Releasor agrees to INDEMNIFY, DEFEND, AND HOLD HARMLESS Releasee from and against any and all claims, demands, losses, damages, liabilities, costs, and expenses (including reasonable attorney's fees) arising from or related to any breach of this Agreement by Releasor or any claim by a third party related to Releasor's ownership, use, or occupancy of the Property.`,
    },
    {
      heading: '4. ACKNOWLEDGMENTS',
      body: `Releasor acknowledges and agrees that:\n\n(a) This release is given voluntarily and with full knowledge of its significance.\n(b) Releasor has had the opportunity to consult with an attorney before signing.\n(c) This release covers claims that are currently unknown or unanticipated.\n(d) The Property was purchased in "AS-IS" condition.\n(e) Releasor is not relying on any statements or representations not contained in the original purchase agreement.`,
    },
    {
      heading: '5. GOVERNING LAW',
      body: `This Agreement shall be governed by the laws of the State of {{state}}.`,
    },
    {
      heading: '6. SIGNATURES',
      body: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.\n\n\nRELEASOR: ___________________________________     Date: _______________\n          {{releasorName}}\n\n\nRELEASEE: ___________________________________     Date: _______________\n          {{releaseeName}}\n\n\nWITNESS: __________________________________     Date: _______________\n\nNOTARY (if required by state law):\n\nState of {{state}}, County of _______________\nSworn and subscribed before me on _______________\nNotary Public: ___________________________________\nMy Commission Expires: _______________`,
    },
  ],
};

export const ALL_CONTRACTS: ContractTemplate[] = [
  PURCHASE_AGREEMENT,
  ASSIGNMENT_CONTRACT,
  WHOLESALE_AGREEMENT,
  JOINT_VENTURE_AGREEMENT,
  PRIVATE_MONEY_AGREEMENT,
  LEASE_OPTION_AGREEMENT,
  SUBJECT_TO_AGREEMENT,
  SELLER_FINANCING_AGREEMENT,
  PROPERTY_MANAGEMENT_AGREEMENT,
  CONTRACTOR_AGREEMENT,
  RELEASE_AGREEMENT,
];

/**
 * Interpolate field values into contract text
 */
export function renderContract(template: ContractTemplate, values: Record<string, string>): string {
  let fullText = '';
  for (const section of template.sections) {
    let heading = section.heading;
    let body = section.body;
    // Replace all {{fieldId}} placeholders
    for (const [key, val] of Object.entries(values)) {
      const placeholder = `{{${key}}}`;
      const displayVal = val || `[${template.fields.find(f => f.id === key)?.label || key}]`;
      heading = heading.replaceAll(placeholder, displayVal);
      body = body.replaceAll(placeholder, displayVal);
    }
    // Replace any remaining unreplaced placeholders with bracket notation
    heading = heading.replace(/\{\{(\w+)\}\}/g, (_, id) => {
      const field = template.fields.find(f => f.id === id);
      return `[${field?.label || id}]`;
    });
    body = body.replace(/\{\{(\w+)\}\}/g, (_, id) => {
      const field = template.fields.find(f => f.id === id);
      return `[${field?.label || id}]`;
    });
    fullText += `\n${heading}\n${'─'.repeat(heading.length)}\n\n${body}\n\n`;
  }
  return fullText;
}

/**
 * Format currency fields for display in contracts
 */
export function formatContractCurrency(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
