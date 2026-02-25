import {
  Wrench, Search, Star, Phone, Mail, MapPin, Shield, AlertTriangle,
  CheckCircle2, FileText, Users, ClipboardList, DollarSign, Clock,
  ChevronDown, ChevronUp, Plus, Trash2, Copy, Download, Megaphone,
  MessageSquare, Briefcase, Scale, Building2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

/* ─── Types ─── */
interface Contractor {
  id: string;
  name: string;
  company: string;
  trade: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  rating: number;
  notes: string;
}

type TradeCategory = typeof TRADE_CATEGORIES[number];

/* ─── Static Data ─── */
const TRADE_CATEGORIES = [
  'General Contractor', 'Plumber', 'Electrician', 'HVAC', 'Roofer',
  'Painter', 'Flooring', 'Drywall', 'Framing / Carpentry', 'Landscaping',
  'Concrete / Masonry', 'Windows / Doors', 'Kitchen / Bath', 'Demolition',
  'Pest Control', 'Foundation', 'Handyman', 'Other',
] as const;

const VETTING_CHECKLIST = [
  { text: 'Verify state contractor license (check licensing board website)', icon: Shield },
  { text: 'Confirm General Liability insurance ($1M+ recommended)', icon: Shield },
  { text: 'Confirm Workers\' Compensation insurance', icon: Shield },
  { text: 'Request 3+ references from recent projects', icon: Users },
  { text: 'Check Better Business Bureau (BBB) rating', icon: Star },
  { text: 'Search for complaints on state AG consumer protection site', icon: AlertTriangle },
  { text: 'Verify business registration with Secretary of State', icon: FileText },
  { text: 'Review online reviews (Google, Yelp, Angi, HomeAdvisor)', icon: Star },
  { text: 'Request detailed written bid (not just verbal estimate)', icon: ClipboardList },
  { text: 'Confirm they pull permits for required work', icon: CheckCircle2 },
  { text: 'Ask about warranty on workmanship (1 year minimum)', icon: Shield },
  { text: 'Discuss payment terms (never more than 10% upfront)', icon: DollarSign },
  { text: 'Confirm timeline and availability for your project', icon: Clock },
  { text: 'Visit a current or recent job site to assess quality', icon: Wrench },
];

const FINDING_TIPS = [
  { title: 'Supply Houses', desc: 'Visit Home Depot Pro Desk, Lowe\'s Pro, and local lumber yards. Contractors shop there daily. Ask the staff who their best customers are.' },
  { title: 'REI Meetups & Networking', desc: 'Attend local Real Estate Investor Association (REIA) meetings. Other investors are your best source for contractor referrals.' },
  { title: 'Drive Job Sites', desc: 'When you see active renovation projects in your target neighborhoods, stop and introduce yourself. Exchange cards with the crew lead.' },
  { title: 'Facebook Groups', desc: 'Join local contractor and real estate investor Facebook groups. Post that you\'re looking for specific trades. Referrals come fast.' },
  { title: 'Subcontractor Referrals', desc: 'Once you find one good contractor, ask them who they recommend for other trades. Good contractors know other good contractors.' },
  { title: 'Online Platforms', desc: 'Use Angi (formerly Angie\'s List), HomeAdvisor, Thumbtack, and BuildZoom to find licensed contractors with reviews.' },
];

const PAYMENT_SCHEDULE = [
  { milestone: 'Contract Signing', percent: '10%', note: 'Maximum upfront deposit. Never pay more.' },
  { milestone: 'Demolition Complete', percent: '15%', note: 'After demo and debris removal verified.' },
  { milestone: 'Rough-In Complete', percent: '25%', note: 'After framing, plumbing, electrical rough-in and inspections pass.' },
  { milestone: 'Drywall & Paint', percent: '20%', note: 'After drywall hung, mudded, sanded, and painted.' },
  { milestone: 'Finishes Installed', percent: '20%', note: 'After flooring, cabinets, fixtures, trim installed.' },
  { milestone: 'Final Walkthrough', percent: '10%', note: 'After punch list complete and final inspection passed.' },
];

/* ─── 6 Critical Contractor Documents ─── */
const CRITICAL_DOCUMENTS = [
  {
    title: 'Independent Contractor Agreement',
    icon: Scale,
    description: 'Establishes the working relationship, scope, timeline, and payment terms between you and the contractor.',
    content: `INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement ("Agreement") is entered into as of _____________ ("Effective Date") by and between:

PROPERTY OWNER / INVESTOR ("Client"):
Name: ___________________________________
Address: ___________________________________
Phone: ___________________________________
Email: ___________________________________

CONTRACTOR ("Contractor"):
Name / Company: ___________________________________
Address: ___________________________________
Phone: ___________________________________
Email: ___________________________________
License #: ___________________________________

1. SCOPE OF WORK
Contractor agrees to perform the following work at the property located at:
Property Address: ___________________________________

Work Description:
___________________________________
___________________________________
___________________________________

(See attached Scope of Work document for detailed specifications)

2. TIMELINE
Start Date: ___________________________________
Estimated Completion Date: ___________________________________
Working Hours: Monday through Friday, 8:00 AM to 5:00 PM (unless otherwise agreed)

3. COMPENSATION
Total Contract Price: $___________________________________
Payment Schedule:
  • 10% upon signing: $___________________________________
  • 15% upon demolition completion: $___________________________________
  • 25% upon rough-in completion: $___________________________________
  • 20% upon drywall & paint completion: $___________________________________
  • 20% upon finishes installation: $___________________________________
  • 10% upon final walkthrough & punch list completion: $___________________________________

4. INDEPENDENT CONTRACTOR STATUS
Contractor is an independent contractor, not an employee. Contractor is responsible for all taxes, insurance, and benefits. Contractor controls the manner and means of performing the work.

5. INSURANCE REQUIREMENTS
Contractor shall maintain at all times during the performance of this Agreement:
  • General Liability Insurance: minimum $1,000,000 per occurrence
  • Workers' Compensation Insurance: as required by state law
  • Auto Insurance: if using vehicles on the job site
Contractor shall provide certificates of insurance prior to commencing work.

6. PERMITS AND LICENSES
Contractor is responsible for obtaining all necessary permits and ensuring all work complies with local building codes and regulations. Contractor warrants that they hold all required licenses for the work described herein.

7. MATERIALS
  • Contractor shall use materials as specified in the Scope of Work
  • All materials must be new unless otherwise agreed in writing
  • Contractor shall provide receipts for all materials purchased
  • Unused materials remain the property of the Client

8. CHANGE ORDERS
Any changes to the scope of work must be documented in a written Change Order signed by both parties before additional work begins. No additional compensation will be paid without an approved Change Order.

9. WARRANTY
Contractor warrants all workmanship for a period of _______ year(s) from the date of completion. Contractor shall repair or replace any defective work at no additional cost during the warranty period.

10. LIEN WAIVER
Contractor agrees to provide a signed Lien Waiver with each progress payment and a Final Lien Waiver upon project completion and final payment.

11. TERMINATION
Either party may terminate this Agreement with 7 days written notice. Upon termination:
  • Client shall pay for all completed work and materials on site
  • Contractor shall return all Client-owned materials and keys
  • Contractor shall leave the job site in a clean and safe condition

12. DISPUTE RESOLUTION
Any disputes shall first be addressed through mediation. If mediation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.

13. INDEMNIFICATION
Contractor shall indemnify and hold harmless the Client from any claims, damages, or liabilities arising from Contractor's work, including but not limited to property damage, personal injury, and mechanic's liens.

14. JOB SITE RULES
  • No smoking on the property
  • No alcohol or drugs on the job site
  • Maintain a clean and safe work area at all times
  • All workers must wear appropriate safety equipment
  • Secure the property at the end of each work day
  • No loud music or disruptive behavior
  • Respect neighbors and the surrounding community

SIGNATURES:

Client: ___________________________ Date: _______________

Contractor: ___________________________ Date: _______________`
  },
  {
    title: 'Indemnification & Insurance Agreement',
    icon: Shield,
    description: 'Protects you from liability for injuries, damages, or claims arising from the contractor\'s work.',
    content: `INDEMNIFICATION AND INSURANCE AGREEMENT

This Indemnification and Insurance Agreement ("Agreement") is entered into as of _____________ by and between:

PROPERTY OWNER / INVESTOR ("Owner"):
Name: ___________________________________
Address: ___________________________________

CONTRACTOR ("Contractor"):
Name / Company: ___________________________________
License #: ___________________________________

Property Address: ___________________________________

1. INDEMNIFICATION
Contractor shall indemnify, defend, and hold harmless the Owner, and Owner's agents, employees, and representatives from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorney's fees) arising out of or resulting from:

  a) The performance of the work by Contractor or Contractor's employees, agents, or subcontractors
  b) Any injury to or death of any person, including Contractor's employees
  c) Any damage to or destruction of any property
  d) Any violation of any law, regulation, or ordinance
  e) Any mechanic's lien or claim filed against the property
  f) Any breach of this Agreement or the related Independent Contractor Agreement

2. INSURANCE REQUIREMENTS
Contractor shall maintain the following insurance coverage at all times during the performance of work:

  a) GENERAL LIABILITY INSURANCE
     Minimum Coverage: $1,000,000 per occurrence / $2,000,000 aggregate
     Insurance Company: ___________________________________
     Policy Number: ___________________________________
     Expiration Date: ___________________________________

  b) WORKERS' COMPENSATION INSURANCE
     Coverage: As required by the State of ___________________________________
     Insurance Company: ___________________________________
     Policy Number: ___________________________________
     Expiration Date: ___________________________________

  c) AUTOMOBILE LIABILITY INSURANCE (if applicable)
     Minimum Coverage: $500,000 combined single limit
     Insurance Company: ___________________________________
     Policy Number: ___________________________________

3. ADDITIONAL INSURED
Owner shall be named as an Additional Insured on Contractor's General Liability policy for the duration of the project.

4. CERTIFICATES OF INSURANCE
Contractor shall provide Owner with certificates of insurance evidencing the required coverage prior to commencing any work. Contractor shall provide updated certificates upon renewal of any policy.

5. SUBCONTRACTORS
Contractor shall ensure that all subcontractors maintain insurance coverage meeting the same minimum requirements set forth in this Agreement.

6. NOTICE OF CANCELLATION
Contractor shall provide Owner with 30 days written notice prior to cancellation or material change of any required insurance policy.

SIGNATURES:

Owner: ___________________________ Date: _______________

Contractor: ___________________________ Date: _______________`
  },
  {
    title: 'Payment Schedule Template',
    icon: DollarSign,
    description: 'Milestone-based payment schedule tied to completed work phases. Never pay 100% upfront.',
    content: `CONTRACTOR PAYMENT SCHEDULE

Project: ___________________________________
Property Address: ___________________________________
Contractor: ___________________________________
Total Contract Amount: $___________________________________

Date: ___________________________________

PAYMENT MILESTONES:

┌──────────────────────────────────────────────────────────────────────┐
│ #  │ Milestone              │ %    │ Amount    │ Date Due  │ Paid   │
├──────────────────────────────────────────────────────────────────────┤
│ 1  │ Contract Signing       │ 10%  │ $________ │ _________ │ □      │
│ 2  │ Demolition Complete    │ 15%  │ $________ │ _________ │ □      │
│ 3  │ Rough-In Complete      │ 25%  │ $________ │ _________ │ □      │
│ 4  │ Drywall & Paint Done   │ 20%  │ $________ │ _________ │ □      │
│ 5  │ Finishes Installed     │ 20%  │ $________ │ _________ │ □      │
│ 6  │ Final Walkthrough      │ 10%  │ $________ │ _________ │ □      │
├──────────────────────────────────────────────────────────────────────┤
│    │ TOTAL                  │ 100% │ $________ │           │        │
└──────────────────────────────────────────────────────────────────────┘

PAYMENT CONDITIONS:
1. Each payment is contingent upon satisfactory completion of the milestone
2. Owner will inspect work within 48 hours of milestone completion notification
3. Payment will be issued within 5 business days of approved inspection
4. Contractor must provide a signed Lien Waiver with each payment request
5. All work must pass applicable building inspections before payment is released
6. Final 10% is held until punch list is 100% complete and final inspection passes

CHANGE ORDER PAYMENTS:
• Change orders are paid upon completion of the additional work
• Change orders do not affect the original payment schedule
• All change orders must be approved in writing before work begins

PAYMENT METHOD:
□ Check  □ Bank Transfer  □ Other: _______________
(Never pay in cash — always maintain a paper trail)

LATE PAYMENT:
If Owner fails to make payment within 10 business days of approved milestone, Contractor may suspend work until payment is received.

SIGNATURES:

Owner: ___________________________ Date: _______________

Contractor: ___________________________ Date: _______________`
  },
  {
    title: 'Contractor Lien Waiver',
    icon: FileText,
    description: 'Protects your property from mechanic\'s liens. Get one signed with EVERY payment.',
    content: `CONDITIONAL LIEN WAIVER AND RELEASE UPON PROGRESS PAYMENT

Project: ___________________________________
Property Address: ___________________________________

Upon receipt of payment in the amount of $_________________ for work performed through _________________ (date), the undersigned Contractor waives and releases any and all lien rights, stop-notice rights, and payment bond rights that the undersigned has against the property described above.

This waiver and release is conditioned upon receipt of payment. If the payment is not received, this waiver and release is null and void.

CONTRACTOR INFORMATION:
Name / Company: ___________________________________
Address: ___________________________________
License #: ___________________________________

WORK PERFORMED:
Description of work completed for this payment period:
___________________________________
___________________________________
___________________________________

PAYMENT DETAILS:
Payment Amount: $___________________________________
Payment Period: From _____________ to _____________
Payment Method: □ Check #_______ □ Bank Transfer □ Other

EXCEPTIONS:
The following amounts are disputed or excluded from this waiver:
___________________________________

CERTIFICATION:
The undersigned certifies that:
1. All laborers, subcontractors, and material suppliers have been paid for work through the previous payment period
2. There are no outstanding claims or disputes related to the work performed
3. All materials incorporated into the project are free of liens and encumbrances

CONTRACTOR SIGNATURE:

Signed: ___________________________ Date: _______________
Printed Name: ___________________________________
Title: ___________________________________

NOTARY (if required by state):
State of _______________
County of _______________
Subscribed and sworn before me this _____ day of _____________, 20_____

Notary Public: ___________________________________
My Commission Expires: ___________________________________

─────────────────────────────────────────────

UNCONDITIONAL LIEN WAIVER AND RELEASE UPON FINAL PAYMENT

Upon receipt of final payment in the amount of $_________________, the undersigned Contractor unconditionally waives and releases any and all lien rights, stop-notice rights, and payment bond rights against the property located at:

Property Address: ___________________________________

The undersigned certifies that all work has been completed, all laborers and subcontractors have been paid in full, and there are no outstanding claims against the property.

CONTRACTOR SIGNATURE:

Signed: ___________________________ Date: _______________
Printed Name: ___________________________________`
  },
  {
    title: 'Scope of Work Template',
    icon: ClipboardList,
    description: 'Detailed room-by-room work specification template. Attach to every contractor agreement.',
    content: `SCOPE OF WORK

Project: ___________________________________
Property Address: ___________________________________
Contractor: ___________________________________
Date: ___________________________________

GENERAL REQUIREMENTS:
• All work must comply with local building codes and regulations
• Contractor must obtain all necessary permits
• All materials must be new unless otherwise specified
• Work area must be cleaned daily
• Property must be secured at end of each work day

─────────────────────────────────────────────

KITCHEN:
□ Remove existing cabinets, countertops, and appliances
□ Install new cabinets: ___________________________________
□ Install new countertops: ___________________________________
□ Install new sink and faucet: ___________________________________
□ Install new appliances:
  □ Refrigerator: ___________________________________
  □ Range/Oven: ___________________________________
  □ Dishwasher: ___________________________________
  □ Microwave: ___________________________________
□ Install backsplash: ___________________________________
□ Install new flooring: ___________________________________
□ Install new lighting: ___________________________________
□ Paint walls and ceiling: Color ___________________________________
□ Replace outlets and switches
□ Install garbage disposal

MASTER BATHROOM:
□ Remove existing vanity, toilet, and tub/shower
□ Install new vanity: ___________________________________
□ Install new toilet: ___________________________________
□ Install new tub/shower: ___________________________________
□ Install new tile (floor): ___________________________________
□ Install new tile (walls/surround): ___________________________________
□ Install new faucets and fixtures: ___________________________________
□ Install new mirror and lighting
□ Paint walls and ceiling: Color ___________________________________
□ Install exhaust fan
□ Replace outlets (GFCI)

FULL BATHROOM(S) — Quantity: _____
□ Remove existing vanity, toilet, and fixtures
□ Install new vanity: ___________________________________
□ Install new toilet: ___________________________________
□ Update tub/shower surround: ___________________________________
□ Install new floor tile: ___________________________________
□ Install new faucets and fixtures
□ Install new mirror and lighting
□ Paint walls and ceiling: Color ___________________________________

BEDROOMS — Quantity: _____
□ Install new flooring: ___________________________________
□ Install new baseboards: ___________________________________
□ Paint walls and ceiling: Color ___________________________________
□ Update closet system: ___________________________________
□ Install new light fixtures
□ Replace outlets and switches

LIVING ROOM / FAMILY ROOM:
□ Install new flooring: ___________________________________
□ Install new baseboards: ___________________________________
□ Paint walls and ceiling: Color ___________________________________
□ Install new light fixtures
□ Replace outlets and switches
□ Install ceiling fan: □ Yes □ No

EXTERIOR / LANDSCAPING:
□ Paint exterior: Color ___________________________________
□ Replace front door: ___________________________________
□ Replace garage door: ___________________________________
□ Install new house numbers and mailbox
□ Install new porch light
□ Landscaping: ___________________________________
□ Install new mulch and edging
□ Pressure wash: □ Driveway □ Walkways □ Siding

ROOF (if applicable):
□ Tear off existing roofing
□ Install new shingles: ___________________________________
□ Replace flashing and vents
□ Install new gutters and downspouts

ELECTRICAL:
□ Upgrade electrical panel: ___________________________________
□ Replace all outlets and switches
□ Install new light fixtures throughout
□ Install smoke detectors and CO detectors
□ Ensure all circuits properly grounded

PLUMBING:
□ Replace water heater: ___________________________________
□ Repair/replace supply lines
□ Clean/repair drain lines
□ Fix any leaks

HVAC:
□ Replace furnace: ___________________________________
□ Replace AC unit: ___________________________________
□ Install new thermostat: ___________________________________
□ Clean/repair ductwork

NOTES / SPECIAL INSTRUCTIONS:
___________________________________
___________________________________
___________________________________
___________________________________

MATERIAL SPECIFICATIONS:
(Attach material list with SKUs, quantities, and pricing)

SIGNATURES:

Owner: ___________________________ Date: _______________
Contractor: ___________________________ Date: _______________`
  },
  {
    title: 'W-9 Tax Form (IRS)',
    icon: Building2,
    description: 'Required from every contractor for tax reporting. You must issue a 1099 if you pay $600+ in a year.',
    content: `W-9 FORM — REQUEST FOR TAXPAYER IDENTIFICATION NUMBER

IMPORTANT: Download the official IRS W-9 form from:
https://www.irs.gov/pub/irs-pdf/fw9.pdf

This is a federal tax document. Always use the current version from the IRS website.

─────────────────────────────────────────────

WHY YOU NEED A W-9 FROM EVERY CONTRACTOR:

1. TAX REPORTING REQUIREMENT
   If you pay a contractor $600 or more in a calendar year, you are required by the IRS to:
   • Collect a completed W-9 before making the first payment
   • Issue a 1099-NEC form to the contractor by January 31 of the following year
   • File a copy of the 1099-NEC with the IRS

2. WHAT TO COLLECT
   The W-9 provides:
   • Contractor's legal name (or business name)
   • Business entity type (sole proprietor, LLC, corporation, etc.)
   • Tax Identification Number (SSN or EIN)
   • Address for tax correspondence

3. WHEN TO COLLECT IT
   • BEFORE the first payment — make it part of your onboarding process
   • Keep it on file for at least 4 years
   • Request a new W-9 if contractor's information changes

4. PENALTIES FOR NON-COMPLIANCE
   • Failure to file 1099: $50-$280 per form (depending on how late)
   • Intentional disregard: $570 per form
   • Backup withholding: 24% of payments if no TIN provided

5. RECORD KEEPING
   Maintain a folder for each contractor with:
   □ Completed W-9
   □ Copy of contractor's license
   □ Certificate of insurance
   □ Signed contractor agreement
   □ All invoices and payment records
   □ Signed lien waivers

─────────────────────────────────────────────

DOWNLOAD THE OFFICIAL W-9 FORM:
https://www.irs.gov/pub/irs-pdf/fw9.pdf`
  },
];

/* ─── Marketing Materials for Finding Contractors ─── */
const MARKETING_MATERIALS = [
  {
    title: 'Contractor Bandit Sign Ad',
    description: 'Place these signs near active construction areas and supply houses to attract contractors.',
    content: `BANDIT SIGN TEXT:

━━━━━━━━━━━━━━━━━━━━━━━
    CONTRACTORS WANTED
    
    Steady Rehab Work
    All Trades Needed
    
    Call: [YOUR PHONE]
━━━━━━━━━━━━━━━━━━━━━━━

SIGN SPECIFICATIONS:
• Size: 18" x 24" corrugated plastic
• Colors: Yellow background with black text (highest visibility)
• Font: Bold, block letters — readable from 50+ feet
• Quantity: Order 25-50 signs at a time

PLACEMENT TIPS:
• Near Home Depot and Lowe's parking lots
• At busy intersections near construction areas
• Near lumber yards and supply houses
• Along main roads in your target investment areas
• Replace signs weekly — they get removed

COST: $2-4 per sign when ordered in bulk from BuildASign.com or Amazon`
  },
  {
    title: 'Craigslist Ad — Contractors Wanted',
    description: 'Post this ad on Craigslist to find contractors looking for work.',
    content: `CRAIGSLIST AD — POST UNDER "GIGS > LABOR"

TITLE: Experienced Contractors Wanted — Steady Rehab Work Available

BODY:

We are a local real estate investment company looking for experienced, reliable contractors for ongoing residential renovation projects.

TRADES NEEDED:
• General Contractors
• Plumbers
• Electricians
• HVAC Technicians
• Roofers
• Painters
• Flooring Installers
• Drywall / Finishing
• Framing / Carpentry
• Landscaping
• Concrete / Masonry
• Window & Door Installation
• Kitchen & Bath Specialists
• Demolition Crews

WHAT WE OFFER:
✓ Steady, ongoing work — we do multiple projects per year
✓ Clear scope of work for every project
✓ Milestone-based payments — always on time
✓ Professional working relationship
✓ Referrals to other investors in our network

REQUIREMENTS:
✓ Valid contractor's license (where required by state)
✓ General liability insurance ($1M minimum)
✓ Workers' compensation insurance
✓ References from recent projects
✓ Reliable transportation and own tools
✓ Professional communication and punctuality

TO APPLY:
Please respond with:
1. Your name and company name
2. Trades / specialties
3. Years of experience
4. License number
5. Phone number
6. 2-3 photos of recent completed work

We will schedule a brief phone interview and job site meeting.

Serious inquiries only. We are building long-term relationships with quality contractors.

[YOUR COMPANY NAME]
[YOUR PHONE NUMBER]
[YOUR EMAIL]`
  },
  {
    title: 'Craigslist Ad — Bandit Sign Hanger',
    description: 'Hire someone to place your contractor-wanted bandit signs around town.',
    content: `CRAIGSLIST AD — POST UNDER "GIGS > LABOR"

TITLE: Easy Gig — Place Signs Around Town — $15/hour

BODY:

Looking for a reliable person to place marketing signs at strategic locations around [YOUR CITY].

THE JOB:
• Place 25-50 signs at designated locations
• Take a photo of each placed sign
• Report back with locations and photos
• Replace any signs that have been removed (weekly)

REQUIREMENTS:
• Reliable transportation
• Smartphone for photos
• Available on weekends (best time for placement)
• Know the local area well

PAY:
• $15/hour
• Estimated 3-4 hours per session
• Weekly or bi-weekly schedule available

This is a simple, flexible gig perfect for someone who knows the area and wants easy extra income.

TO APPLY:
Reply with your name, phone number, and the area of town you're most familiar with.

[YOUR PHONE NUMBER]`
  },
];

/* ─── Scripts ─── */
const CONTRACTOR_SCRIPTS = [
  {
    title: 'Contractor Elevator Pitch',
    description: 'Use this 30-second pitch when you meet contractors at supply houses, job sites, or networking events.',
    content: `ELEVATOR PITCH — MEETING CONTRACTORS

"Hi, my name is [YOUR NAME] with [YOUR COMPANY]. I'm a local real estate investor and I'm always looking for quality contractors to work on my renovation projects.

I typically do [NUMBER] projects per year in the [CITY/AREA] area. I provide a clear scope of work for every project, I pay on time based on milestones, and I'm looking for long-term relationships with reliable contractors.

If you're interested in steady work, I'd love to get your card and set up a time to talk about what I'm looking for. I have a project coming up at [ADDRESS/AREA] that I could use help with.

What trades do you specialize in?"

─────────────────────────────────────────────

KEY POINTS TO COMMUNICATE:
✓ You are a professional investor (not a one-time homeowner)
✓ You offer STEADY, ONGOING work
✓ You pay ON TIME
✓ You provide CLEAR scope of work
✓ You want a LONG-TERM relationship

WHAT TO ASK:
• What trades do you specialize in?
• How long have you been in business?
• Are you licensed and insured?
• What's your typical availability?
• Can I see photos of recent work?
• Do you have references I can contact?`
  },
  {
    title: 'Contractor Interview / Phone Script',
    description: 'Use this script when interviewing potential contractors over the phone or in person.',
    content: `CONTRACTOR INTERVIEW SCRIPT

"Hi [CONTRACTOR NAME], thanks for taking the time to speak with me. I'm [YOUR NAME] with [YOUR COMPANY]. I got your information from [SOURCE — Craigslist ad, referral, supply house, etc.].

I'm a real estate investor and I'm looking for reliable contractors for ongoing renovation work. Let me tell you a little about what I do, and then I'd like to ask you some questions."

SECTION 1 — ABOUT YOUR BUSINESS
1. "How long have you been in the contracting business?"
2. "What trades do you specialize in?"
3. "How many crew members do you typically have?"
4. "Are you licensed?" (Record license #: _______________)
5. "Do you carry general liability insurance? What's your coverage amount?"
6. "Do you carry workers' compensation insurance?"

SECTION 2 — EXPERIENCE & QUALITY
7. "Have you worked with real estate investors before?"
8. "What types of projects do you typically work on? (Residential rehabs, new construction, commercial?)"
9. "Can you provide 3 references from recent projects?"
10. "Can you send me photos of your last 2-3 completed projects?"
11. "Do you pull permits for work that requires them?"

SECTION 3 — LOGISTICS & PRICING
12. "What's your current availability? When could you start a new project?"
13. "How do you typically price your work? (Per project, hourly, per square foot?)"
14. "Are you comfortable working from a detailed scope of work?"
15. "What are your payment terms?"
16. "Do you provide a warranty on your workmanship? How long?"

SECTION 4 — RED FLAGS TO WATCH FOR
⚠ No license or insurance → PASS
⚠ Wants more than 10% upfront → NEGOTIATE or PASS
⚠ Can't provide references → PASS
⚠ Vague pricing ("I'll figure it out as we go") → PASS
⚠ No written contract or scope of work → PASS
⚠ Pressures you to start immediately → CAUTION
⚠ Bad-mouths other contractors or clients → CAUTION

CLOSING:
"Great, I appreciate your time. Here's what I'd like to do next:
1. I'll check your references
2. I'll verify your license and insurance
3. If everything checks out, I'd like to have you come look at my next project and give me a bid
4. I'll need you to fill out a contractor application and provide a W-9

Does that sound good? What's the best way to reach you?"

NOTES:
___________________________________
___________________________________`
  },
  {
    title: 'Bandit Sign Voicemail Script',
    description: 'Set up this voicemail on your contractor hotline number so you never miss a lead.',
    content: `VOICEMAIL SCRIPT — CONTRACTOR HOTLINE

"Hi, you've reached [YOUR NAME] with [YOUR COMPANY]. Thanks for calling about our contractor opportunities.

We're a local real estate investment company that does multiple renovation projects every year, and we're always looking for quality contractors in all trades.

Please leave your name, phone number, the trade you specialize in, and whether you're licensed and insured. I'll call you back within 24 hours to discuss our current and upcoming projects.

Again, please leave your name, number, and trade specialty, and I'll get right back to you. Thanks!"

─────────────────────────────────────────────

TIPS FOR YOUR CONTRACTOR HOTLINE:
• Use a dedicated Google Voice number (free)
• Set up the voicemail greeting above
• Check messages daily
• Return calls within 24 hours
• Keep a spreadsheet of all contractor leads
• Schedule phone interviews using the Interview Script`
  },
];

/* ─── Onboarding Documents ─── */
const ONBOARDING_DOCS = [
  {
    title: 'Contractor Application',
    description: 'Have every potential contractor fill this out before hiring them.',
    content: `CONTRACTOR APPLICATION

Date: ___________________________________

COMPANY INFORMATION:
Company Name: ___________________________________
Owner / Contact Name: ___________________________________
Address: ___________________________________
City: ___________________ State: _____ Zip: ___________
Phone: ___________________________________
Email: ___________________________________
Website: ___________________________________

LICENSING:
Contractor License #: ___________________________________
License Type: ___________________________________
State Issued: ___________________________________
Expiration Date: ___________________________________

INSURANCE:
General Liability Insurance: □ Yes □ No
  Company: ___________________________________
  Policy #: ___________________________________
  Coverage Amount: $___________________________________
  Expiration: ___________________________________

Workers' Compensation: □ Yes □ No
  Company: ___________________________________
  Policy #: ___________________________________
  Expiration: ___________________________________

EXPERIENCE:
Years in Business: ___________________________________
Number of Employees: ___________________________________

Trades / Specialties (check all that apply):
□ General Contracting    □ Plumbing           □ Electrical
□ HVAC                   □ Roofing            □ Painting
□ Flooring               □ Drywall            □ Framing / Carpentry
□ Landscaping            □ Concrete / Masonry □ Windows / Doors
□ Kitchen / Bath         □ Demolition         □ Other: ___________

Have you worked with real estate investors before? □ Yes □ No
If yes, how many investor projects have you completed? ___________

REFERENCES (provide 3):
1. Name: ___________________ Phone: ___________________ Project: ___________________
2. Name: ___________________ Phone: ___________________ Project: ___________________
3. Name: ___________________ Phone: ___________________ Project: ___________________

PRICING:
How do you typically price your work?
□ Per project (lump sum)  □ Time & materials  □ Per square foot  □ Other

What is your typical payment structure?
___________________________________

AVAILABILITY:
Current availability: □ Immediately □ 1-2 weeks □ 3-4 weeks □ Other: ___________
Preferred project size: □ Small (<$10K) □ Medium ($10K-$50K) □ Large ($50K+)

CERTIFICATION:
I certify that the information provided above is true and accurate. I authorize verification of the information provided, including license, insurance, and references.

Signature: ___________________________ Date: _______________
Printed Name: ___________________________________`
  },
  {
    title: 'Contractor References Form',
    description: 'Use this form to check contractor references before hiring.',
    content: `CONTRACTOR REFERENCE CHECK FORM

Contractor Being Evaluated: ___________________________________
Reference Provided By: ___________________________________
Reference Phone: ___________________________________
Date of Call: ___________________________________

QUESTIONS:

1. How do you know this contractor?
   □ Hired them for a project  □ Worked with them  □ Other
   Notes: ___________________________________

2. What type of work did they perform?
   ___________________________________

3. When was the project completed?
   ___________________________________

4. Was the project completed on time?
   □ Yes  □ No — How late? ___________________________________

5. Was the project completed within budget?
   □ Yes  □ No — How much over? ___________________________________

6. How was the quality of workmanship? (1-5)
   □ 1 (Poor)  □ 2 (Below Average)  □ 3 (Average)  □ 4 (Good)  □ 5 (Excellent)

7. How was their communication?
   □ 1 (Poor)  □ 2 (Below Average)  □ 3 (Average)  □ 4 (Good)  □ 5 (Excellent)

8. Did they keep the job site clean and organized?
   □ Yes  □ No

9. Were there any issues or disputes?
   □ Yes  □ No
   If yes, describe: ___________________________________

10. Did they handle any warranty or callback issues?
    □ Yes  □ No  □ N/A
    Notes: ___________________________________

11. Would you hire them again?
    □ Definitely  □ Probably  □ Maybe  □ No

12. Any additional comments?
    ___________________________________
    ___________________________________

OVERALL RATING: _____ / 5

EVALUATOR NOTES:
___________________________________
___________________________________

Checked by: ___________________________ Date: _______________`
  },
];

/* ─── Additional Resources ─── */
const ADDITIONAL_RESOURCES = [
  {
    title: 'Change Order Form',
    description: 'Document any changes to the original scope of work. Both parties must sign before additional work begins.',
    content: `CHANGE ORDER FORM

Change Order #: ___________________________________
Date: ___________________________________
Project: ___________________________________
Property Address: ___________________________________
Contractor: ___________________________________

ORIGINAL CONTRACT:
Original Contract Amount: $___________________________________
Previous Change Orders Total: $___________________________________
Current Contract Amount: $___________________________________

CHANGE ORDER DESCRIPTION:
Describe the change in detail:
___________________________________
___________________________________
___________________________________

Reason for Change:
□ Owner requested  □ Unforeseen condition  □ Code requirement  □ Design change  □ Other

COST IMPACT:
Additional Materials: $___________________________________
Additional Labor: $___________________________________
Total Change Order Amount: $___________________________________

SCHEDULE IMPACT:
Additional Days Required: ___________________________________
New Completion Date: ___________________________________

NEW CONTRACT TOTAL:
Previous Contract Amount: $___________________________________
This Change Order: + $___________________________________
New Total Contract Amount: $___________________________________

APPROVAL:

Owner: ___________________________ Date: _______________
Contractor: ___________________________ Date: _______________

NOTE: No additional work shall begin until this Change Order is signed by both parties. Verbal change orders are not valid.`
  },
  {
    title: 'Job Site Code of Honor',
    description: 'Post this at every job site. Sets expectations for all workers on the property.',
    content: `JOB SITE CODE OF HONOR

Property Address: ___________________________________
Project Manager: ___________________________________
Emergency Contact: ___________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALL WORKERS ON THIS JOB SITE MUST FOLLOW THESE RULES:

SAFETY:
1. Wear appropriate PPE at all times (hard hat, safety glasses, steel-toed boots where required)
2. Keep all walkways and exits clear
3. Report any safety hazards immediately
4. No horseplay on the job site
5. Know the location of the first aid kit and fire extinguisher

PROFESSIONALISM:
6. Arrive on time — work hours are _____ AM to _____ PM
7. No alcohol or drugs on the job site — ZERO TOLERANCE
8. No smoking inside the property
9. Professional language only — no profanity
10. Treat all workers, neighbors, and visitors with respect

JOB SITE MANAGEMENT:
11. Clean up your work area at the end of each day
12. Properly dispose of all debris in the designated dumpster
13. Secure the property at the end of each work day (lock all doors and windows)
14. Do not leave tools or materials outside overnight
15. Keep noise to reasonable levels — respect the neighbors

COMMUNICATION:
16. Report any issues or concerns to the project manager immediately
17. Do not make changes to the scope of work without written approval
18. Document any unforeseen conditions with photos before proceeding
19. Coordinate with other trades to avoid conflicts

PROPERTY RULES:
20. Do not use the property's utilities for personal use
21. Do not bring unauthorized persons to the job site
22. Protect all existing finishes and surfaces from damage
23. Use drop cloths and protective coverings as needed
24. No personal vehicles parked on the lawn or landscaping

VIOLATIONS:
• First offense: Verbal warning
• Second offense: Written warning
• Third offense: Removal from job site

By working on this job site, you agree to follow this Code of Honor.

Posted by: [YOUR COMPANY NAME]
Date: ___________________________________`
  },
];

/* ─── State License Requirements ─── */
const STATE_LICENSE_INFO: Record<string, { required: boolean; board: string; url: string; notes: string }> = {
  'Alabama': { required: true, board: 'Alabama Licensing Board for General Contractors', url: 'https://genconbd.alabama.gov/', notes: 'Required for projects over $50,000' },
  'Alaska': { required: true, board: 'Alaska Division of Corporations, Business and Professional Licensing', url: 'https://www.commerce.alaska.gov/web/cbpl/', notes: 'General contractor license required' },
  'Arizona': { required: true, board: 'Arizona Registrar of Contractors', url: 'https://roc.az.gov/', notes: 'License required for all construction work' },
  'Arkansas': { required: true, board: 'Arkansas Contractors Licensing Board', url: 'https://www.aclb.arkansas.gov/', notes: 'Required for projects over $50,000' },
  'California': { required: true, board: 'Contractors State License Board (CSLB)', url: 'https://www.cslb.ca.gov/', notes: 'Required for projects over $500' },
  'Colorado': { required: false, board: 'No state license required', url: '', notes: 'Some cities/counties require local licenses. Check local requirements.' },
  'Connecticut': { required: true, board: 'CT Department of Consumer Protection', url: 'https://portal.ct.gov/DCP', notes: 'Home improvement contractor registration required' },
  'Delaware': { required: false, board: 'No state license required', url: '', notes: 'Business license required. Some trades need specific licenses.' },
  'Florida': { required: true, board: 'Florida DBPR Construction Industry Licensing Board', url: 'https://www.myfloridalicense.com/', notes: 'State certified or county registered license required' },
  'Georgia': { required: true, board: 'Georgia Secretary of State', url: 'https://sos.ga.gov/', notes: 'Residential and general contractor licenses available' },
  'Hawaii': { required: true, board: 'Hawaii DCCA Contractors License Board', url: 'https://cca.hawaii.gov/pvl/', notes: 'License required for all construction work' },
  'Idaho': { required: false, board: 'Idaho Division of Building Safety', url: 'https://dbs.idaho.gov/', notes: 'Registration required but no state license exam' },
  'Illinois': { required: false, board: 'No state license required', url: '', notes: 'Roofing contractors must be licensed. Check local requirements.' },
  'Indiana': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses. Check local requirements.' },
  'Iowa': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses. Check local requirements.' },
  'Kansas': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses. Check local requirements.' },
  'Kentucky': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses. Check local requirements.' },
  'Louisiana': { required: true, board: 'Louisiana State Licensing Board for Contractors', url: 'https://www.lslbc.louisiana.gov/', notes: 'Required for projects over $50,000' },
  'Maine': { required: false, board: 'No state license required', url: '', notes: 'Some municipalities require local registration.' },
  'Maryland': { required: true, board: 'Maryland Home Improvement Commission', url: 'https://www.dllr.state.md.us/license/mhic/', notes: 'MHIC license required for residential work' },
  'Massachusetts': { required: true, board: 'MA Division of Professional Licensure', url: 'https://www.mass.gov/orgs/division-of-professional-licensure', notes: 'Construction supervisor license required' },
  'Michigan': { required: true, board: 'Michigan LARA', url: 'https://www.michigan.gov/lara/', notes: 'Residential builder license required' },
  'Minnesota': { required: true, board: 'Minnesota DLI', url: 'https://www.dli.mn.gov/', notes: 'Residential contractor license required' },
  'Mississippi': { required: true, board: 'Mississippi State Board of Contractors', url: 'https://www.msboc.us/', notes: 'Required for projects over $50,000' },
  'Missouri': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses (St. Louis, Kansas City).' },
  'Montana': { required: false, board: 'No state license required', url: '', notes: 'Registration required with Department of Labor.' },
  'Nebraska': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses. Check local requirements.' },
  'Nevada': { required: true, board: 'Nevada State Contractors Board', url: 'https://www.nscb.nv.gov/', notes: 'License required for all construction work' },
  'New Hampshire': { required: false, board: 'No state license required', url: '', notes: 'Some trades need specific licenses.' },
  'New Jersey': { required: true, board: 'NJ Division of Consumer Affairs', url: 'https://www.njconsumeraffairs.gov/', notes: 'Home improvement contractor registration required' },
  'New Mexico': { required: true, board: 'NM Construction Industries Division', url: 'https://www.rld.nm.gov/construction-industries/', notes: 'License required for all construction work' },
  'New York': { required: false, board: 'No state license required', url: '', notes: 'NYC and many counties require local licenses.' },
  'North Carolina': { required: true, board: 'NC Licensing Board for General Contractors', url: 'https://www.nclbgc.org/', notes: 'Required for projects over $30,000' },
  'North Dakota': { required: true, board: 'ND Secretary of State', url: 'https://sos.nd.gov/', notes: 'Contractor license required' },
  'Ohio': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses. Check local requirements.' },
  'Oklahoma': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses. Check local requirements.' },
  'Oregon': { required: true, board: 'Oregon Construction Contractors Board', url: 'https://www.oregon.gov/ccb/', notes: 'CCB license required for all construction work' },
  'Pennsylvania': { required: false, board: 'No state license required', url: '', notes: 'Home improvement contractor registration required in some areas.' },
  'Rhode Island': { required: true, board: 'RI Contractors Registration Board', url: 'https://crb.ri.gov/', notes: 'Registration required for residential work' },
  'South Carolina': { required: true, board: 'SC LLR Contractors Licensing Board', url: 'https://llr.sc.gov/clb/', notes: 'Required for projects over $5,000' },
  'South Dakota': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses. Check local requirements.' },
  'Tennessee': { required: true, board: 'Tennessee Board for Licensing Contractors', url: 'https://www.tn.gov/commerce/regboards/contractors.html', notes: 'Required for projects over $25,000' },
  'Texas': { required: false, board: 'No state license required', url: '', notes: 'No state GC license. Some cities require local licenses. HVAC, plumbing, electrical need state licenses.' },
  'Utah': { required: true, board: 'Utah DOPL', url: 'https://dopl.utah.gov/', notes: 'Contractor license required' },
  'Vermont': { required: false, board: 'No state license required', url: '', notes: 'Residential contractors must register.' },
  'Virginia': { required: true, board: 'Virginia DPOR', url: 'https://www.dpor.virginia.gov/', notes: 'Class A, B, or C license based on project size' },
  'Washington': { required: true, board: 'Washington L&I', url: 'https://www.lni.wa.gov/', notes: 'Contractor registration required' },
  'West Virginia': { required: true, board: 'WV Division of Labor', url: 'https://labor.wv.gov/', notes: 'Contractor license required' },
  'Wisconsin': { required: false, board: 'No state license required', url: '', notes: 'Dwelling contractor certification required for 1-2 family homes.' },
  'Wyoming': { required: false, board: 'No state license required', url: '', notes: 'Some cities require local licenses. Check local requirements.' },
};

/* ─── Components ─── */
function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange?.(i)} className={`${onChange ? 'cursor-pointer' : 'cursor-default'}`} type="button">
          <Star className={`w-4 h-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
        </button>
      ))}
    </div>
  );
}

function DocumentViewer({ doc }: { doc: { title: string; icon: any; description: string; content: string } }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = doc.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.content);
    toast.success(`${doc.title} copied to clipboard`);
  };

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<html><head><title>${doc.title}</title><style>body{font-family:Courier New,monospace;padding:40px;font-size:12px;line-height:1.6;white-space:pre-wrap;max-width:800px;margin:0 auto;}h1{font-family:Arial,sans-serif;font-size:18px;border-bottom:2px solid #C41E3A;padding-bottom:8px;}</style></head><body><h1>${doc.title}</h1>${doc.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body></html>`);
      w.document.close();
      w.print();
    }
  };

  return (
    <Card className="border-border/60">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/10">
            <Icon className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{doc.title}</h3>
            <p className="text-xs text-muted-foreground">{doc.description}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </div>
      {expanded && (
        <CardContent className="p-4 pt-0 border-t border-border/50">
          <div className="flex gap-2 mb-3">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={handleCopy}>
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={handlePrint}>
              <Download className="w-3.5 h-3.5" /> Print
            </Button>
          </div>
          <pre className="bg-secondary/30 rounded-lg p-4 text-xs leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto max-h-[500px] overflow-y-auto">{doc.content}</pre>
        </CardContent>
      )}
    </Card>
  );
}

function VettingSection() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-bold text-base mb-1">Contractor Vetting Checklist</h3>
        <p className="text-xs text-muted-foreground mb-4">Complete this checklist before hiring any contractor. Click items to mark as verified.</p>
        <div className="text-xs text-muted-foreground mb-3">{checked.size} of {VETTING_CHECKLIST.length} verified</div>
        <div className="w-full bg-muted rounded-full h-1.5 mb-4">
          <div className="h-1.5 rounded-full bg-[oklch(0.50_0.15_145)] transition-all" style={{ width: `${(checked.size / VETTING_CHECKLIST.length) * 100}%` }} />
        </div>
        <div className="space-y-1">
          {VETTING_CHECKLIST.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} onClick={() => toggle(i)} className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${checked.has(i) ? 'bg-[oklch(0.50_0.15_145)]/10' : 'hover:bg-muted/50'}`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${checked.has(i) ? 'text-[oklch(0.50_0.15_145)]' : 'text-muted-foreground/30'}`} />
                <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className={`text-sm ${checked.has(i) ? 'line-through text-muted-foreground' : ''}`}>{item.text}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ContractorRolodex() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterTrade, setFilterTrade] = useState('');
  const [form, setForm] = useState({ name: '', company: '', trade: 'General Contractor', phone: '', email: '', city: '', state: '', rating: 3, notes: '' });

  const filtered = useMemo(() => {
    if (!filterTrade) return contractors;
    return contractors.filter(c => c.trade === filterTrade);
  }, [contractors, filterTrade]);

  const addContractor = () => {
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return; }
    setContractors(prev => [...prev, { ...form, id: Date.now().toString() }]);
    setForm({ name: '', company: '', trade: 'General Contractor', phone: '', email: '', city: '', state: '', rating: 3, notes: '' });
    setShowForm(false);
    toast.success('Contractor added to your rolodex');
  };

  const removeContractor = (id: string) => { setContractors(prev => prev.filter(c => c.id !== id)); toast.success('Contractor removed'); };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base">Contractor Rolodex</h3>
            <p className="text-xs text-muted-foreground">Track and organize your contractor contacts</p>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>

        {showForm && (
          <div className="border border-border rounded-lg p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Contact Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
              <input placeholder="Company Name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
              <select value={form.trade} onChange={e => setForm(f => ({ ...f, trade: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm">
                {TRADE_CATEGORIES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input placeholder="Phone *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
              <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
              <div className="flex gap-2">
                <input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                <input placeholder="ST" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="w-16 px-3 py-2 rounded-md border border-border bg-background text-sm" maxLength={2} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <StarRating rating={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            </div>
            <textarea placeholder="Notes (specialties, pricing, reliability...)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm" rows={2} />
            <div className="flex gap-2">
              <Button size="sm" onClick={addContractor} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">Save Contractor</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {contractors.length > 0 && (
          <div className="mb-3">
            <select value={filterTrade} onChange={e => setFilterTrade(e.target.value)} className="px-3 py-1.5 rounded-md border border-border bg-background text-xs">
              <option value="">All Trades ({contractors.length})</option>
              {TRADE_CATEGORIES.map(t => {
                const count = contractors.filter(c => c.trade === t).length;
                return count > 0 ? <option key={t} value={t}>{t} ({count})</option> : null;
              })}
            </select>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No contractors yet. Click "Add" to start building your rolodex.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <div className="w-9 h-9 rounded-full bg-[oklch(0.48_0.20_18)]/10 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{c.name}</span>
                    {c.company && <span className="text-xs text-muted-foreground">— {c.company}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="px-1.5 py-0.5 rounded bg-muted">{c.trade}</span>
                    {c.city && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{c.city}{c.state ? `, ${c.state}` : ''}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {c.phone && <a href={`tel:${c.phone}`} className="text-xs text-[oklch(0.48_0.20_18)] flex items-center gap-0.5"><Phone className="w-3 h-3" />{c.phone}</a>}
                    {c.email && <a href={`mailto:${c.email}`} className="text-xs text-[oklch(0.48_0.20_18)] flex items-center gap-0.5"><Mail className="w-3 h-3" />{c.email}</a>}
                  </div>
                  <StarRating rating={c.rating} />
                  {c.notes && <p className="text-xs text-muted-foreground mt-1">{c.notes}</p>}
                </div>
                <button onClick={() => removeContractor(c.id)} className="text-muted-foreground/40 hover:text-destructive transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Note: Contractor data is stored locally in your browser. For persistent storage, upgrade to a paid plan.
        </p>
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ─── */
export default function Contractors() {
  const [activeTab, setActiveTab] = useState<'rolodex' | 'find' | 'documents' | 'vetting' | 'payment' | 'licenses'>('rolodex');
  const [selectedState, setSelectedState] = useState('');

  const tabs = [
    { id: 'rolodex' as const, label: 'Rolodex', icon: Users },
    { id: 'find' as const, label: 'Find Contractors', icon: Search },
    { id: 'documents' as const, label: '6 Critical Documents', icon: FileText },
    { id: 'vetting' as const, label: 'Vetting', icon: Shield },
    { id: 'payment' as const, label: 'Payment', icon: DollarSign },
    { id: 'licenses' as const, label: 'State Licenses', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-14 text-center">
          <Wrench className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Contractor Lead System</h1>
          <p className="text-[oklch(0.6_0_0)] max-w-lg mx-auto">
            Find, vet, and manage contractors for your renovation projects.
            Includes all documents, scripts, and templates you need.
          </p>
        </div>
      </section>

      <section className="container py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[oklch(0.48_0.20_18)] text-white font-medium'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Rolodex Tab */}
        {activeTab === 'rolodex' && <ContractorRolodex />}

        {/* Find Contractors Tab */}
        {activeTab === 'find' && (
          <div className="space-y-6">
            {/* Marketing Materials */}
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-1">Marketing Materials</h2>
              <p className="text-sm text-muted-foreground mb-4">Use these ads and signs to attract contractors to your projects.</p>
              <div className="space-y-3">
                {MARKETING_MATERIALS.map((doc, i) => (
                  <DocumentViewer key={i} doc={{ ...doc, icon: Megaphone }} />
                ))}
              </div>
            </div>

            {/* Scripts */}
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-1">Scripts</h2>
              <p className="text-sm text-muted-foreground mb-4">Use these scripts when meeting, interviewing, or following up with contractors.</p>
              <div className="space-y-3">
                {CONTRACTOR_SCRIPTS.map((doc, i) => (
                  <DocumentViewer key={i} doc={{ ...doc, icon: MessageSquare }} />
                ))}
              </div>
            </div>

            {/* Onboarding */}
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-1">Onboarding</h2>
              <p className="text-sm text-muted-foreground mb-4">Collect this information from every contractor before hiring them.</p>
              <div className="space-y-3">
                {ONBOARDING_DOCS.map((doc, i) => (
                  <DocumentViewer key={i} doc={{ ...doc, icon: Briefcase }} />
                ))}
              </div>
            </div>

            {/* Finding Tips */}
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-4">Where to Find Contractors</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FINDING_TIPS.map((tip, i) => (
                  <Card key={i}>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-sm mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Online Resources */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-3">Online Resources</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Angi (Angie\'s List)', url: 'https://www.angi.com', desc: 'Verified reviews and background checks' },
                    { name: 'HomeAdvisor', url: 'https://www.homeadvisor.com', desc: 'Pre-screened contractors with cost guides' },
                    { name: 'Thumbtack', url: 'https://www.thumbtack.com', desc: 'Get quotes from local professionals' },
                    { name: 'BuildZoom', url: 'https://www.buildzoom.com', desc: 'License verification and permit history' },
                    { name: 'Houzz', url: 'https://www.houzz.com', desc: 'Portfolio-based contractor search' },
                    { name: 'Nextdoor', url: 'https://www.nextdoor.com', desc: 'Neighborhood recommendations' },
                  ].map(resource => (
                    <a key={resource.name} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 p-3 rounded-lg border border-border hover:border-[oklch(0.48_0.20_18)]/30 transition-colors">
                      <Search className="w-4 h-4 text-[oklch(0.48_0.20_18)] mt-0.5 shrink-0" />
                      <div>
                        <span className="text-sm font-medium">{resource.name}</span>
                        <p className="text-xs text-muted-foreground">{resource.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 6 Critical Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-1">6 Critical Documents for Hiring Contractors</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Never hire a contractor without these 6 documents. They protect your investment, your property, and your legal rights.
                Click each document to view, copy, or print.
              </p>
              <div className="space-y-3">
                {CRITICAL_DOCUMENTS.map((doc, i) => (
                  <DocumentViewer key={i} doc={doc} />
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-1">Additional Project Documents</h2>
              <p className="text-sm text-muted-foreground mb-4">Change orders, job site rules, and other project management documents.</p>
              <div className="space-y-3">
                {ADDITIONAL_RESOURCES.map((doc, i) => (
                  <DocumentViewer key={i} doc={{ ...doc, icon: FileText }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vetting Tab */}
        {activeTab === 'vetting' && <VettingSection />}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <Card>
            <CardContent className="p-5">
              <h3 className="font-bold text-base mb-1">Recommended Payment Schedule</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Never pay contractors 100% upfront. Tie payments to completed milestones to protect your investment.
              </p>
              <div className="space-y-0">
                {PAYMENT_SCHEDULE.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b border-border last:border-0">
                    <div className="w-16 text-center shrink-0">
                      <span className="text-lg font-bold text-[oklch(0.48_0.20_18)]">{item.percent}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.milestone}</p>
                      <p className="text-xs text-muted-foreground">{item.note}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[oklch(0.48_0.20_18)]/5 border border-[oklch(0.48_0.20_18)]/10">
                <p className="text-xs font-medium text-[oklch(0.48_0.20_18)] mb-1">Important Tips:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Always get a signed contract before any work begins</li>
                  <li>• Document each milestone with photos before releasing payment</li>
                  <li>• Hold 10% retainage until final walkthrough and punch list completion</li>
                  <li>• Pay with check or bank transfer for a paper trail — never cash</li>
                  <li>• Get lien waivers with each progress payment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* State License Requirements Tab */}
        {activeTab === 'licenses' && (
          <Card>
            <CardContent className="p-5">
              <h3 className="font-bold text-base mb-1">Contractor License Requirements by State</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Select a state to see if a contractor license is required and where to verify licenses.
              </p>
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full max-w-sm px-3 py-2 rounded-md border border-border bg-background text-sm mb-4"
              >
                <option value="">Select a state...</option>
                {Object.keys(STATE_LICENSE_INFO).sort().map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              {selectedState && STATE_LICENSE_INFO[selectedState] && (
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-bold text-lg">{selectedState}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATE_LICENSE_INFO[selectedState].required ? 'bg-[oklch(0.48_0.20_18)]/10 text-[oklch(0.48_0.20_18)]' : 'bg-muted text-muted-foreground'}`}>
                      {STATE_LICENSE_INFO[selectedState].required ? 'License Required' : 'No State License Required'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Licensing Board:</strong> {STATE_LICENSE_INFO[selectedState].board}</p>
                    {STATE_LICENSE_INFO[selectedState].url && (
                      <p><strong>Website:</strong> <a href={STATE_LICENSE_INFO[selectedState].url} target="_blank" rel="noopener noreferrer" className="text-[oklch(0.48_0.20_18)] hover:underline">{STATE_LICENSE_INFO[selectedState].url}</a></p>
                    )}
                    <p><strong>Notes:</strong> {STATE_LICENSE_INFO[selectedState].notes}</p>
                  </div>
                </div>
              )}

              {!selectedState && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(STATE_LICENSE_INFO).sort(([a], [b]) => a.localeCompare(b)).map(([state, info]) => (
                    <button
                      key={state}
                      onClick={() => setSelectedState(state)}
                      className="flex items-center justify-between p-2 rounded-md border border-border hover:border-[oklch(0.48_0.20_18)]/30 transition-colors text-left"
                    >
                      <span className="text-sm">{state}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${info.required ? 'bg-[oklch(0.48_0.20_18)]/10 text-[oklch(0.48_0.20_18)]' : 'bg-muted text-muted-foreground'}`}>
                        {info.required ? 'Required' : 'Not Required'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
