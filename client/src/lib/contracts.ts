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

export const ALL_CONTRACTS: ContractTemplate[] = [
  PURCHASE_AGREEMENT,
  ASSIGNMENT_CONTRACT,
  WHOLESALE_AGREEMENT,
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
