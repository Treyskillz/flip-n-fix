import { MapPin, Search, Scale, DollarSign, FileText, Clock, AlertTriangle, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useMemo } from 'react';

interface StateData {
  name: string;
  abbr: string;
  closingType: 'Attorney' | 'Escrow' | 'Both';
  titleInsurance: string;
  transferTax: string;
  recordingFee: string;
  disclosureRequired: boolean;
  foreclosureType: 'Judicial' | 'Non-Judicial' | 'Both';
  foreclosureTimeline: string;
  redemptionPeriod: string;
  propertyTaxRate: string;
  wholesaleLegal: 'Yes' | 'Yes (with restrictions)' | 'Gray area';
  licenseRequired: string;
  notes: string;
}

const STATES: StateData[] = [
  { name: 'Alabama', abbr: 'AL', closingType: 'Attorney', titleInsurance: 'Negotiable', transferTax: '$0.50/$500', recordingFee: '$25-50', disclosureRequired: false, foreclosureType: 'Non-Judicial', foreclosureTimeline: '49-74 days', redemptionPeriod: '12 months', propertyTaxRate: '0.41%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Caveat emptor state — limited seller disclosure requirements. One of the lowest property tax rates in the nation.' },
  { name: 'Alaska', abbr: 'AK', closingType: 'Escrow', titleInsurance: 'Split', transferTax: 'None', recordingFee: '$25', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '105 days', redemptionPeriod: 'None (12 months for judicial)', propertyTaxRate: '1.19%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No state income tax or transfer tax. Remote areas may have limited comparable sales data.' },
  { name: 'Arizona', abbr: 'AZ', closingType: 'Escrow', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$30', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '91 days', redemptionPeriod: 'None', propertyTaxRate: '0.62%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Very investor-friendly state. Fast non-judicial foreclosure with no redemption period. No transfer tax.' },
  { name: 'Arkansas', abbr: 'AR', closingType: 'Attorney', titleInsurance: 'Negotiable', transferTax: '$3.30/$1,000', recordingFee: '$15', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '70-120 days', redemptionPeriod: '12 months (judicial)', propertyTaxRate: '0.62%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Relatively low property taxes. Both judicial and non-judicial foreclosure available.' },
  { name: 'California', abbr: 'CA', closingType: 'Escrow', titleInsurance: 'Split', transferTax: '$1.10/$1,000', recordingFee: '$50-225', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '117 days', redemptionPeriod: 'None (non-judicial)', propertyTaxRate: '0.73%', wholesaleLegal: 'Yes (with restrictions)', licenseRequired: 'No license for own properties; wholesaling has AB 1837 restrictions', notes: 'AB 1837 (2024) restricts wholesaling — requires disclosure and limits assignment fees. Prop 13 caps property tax increases. Very high median prices.' },
  { name: 'Colorado', abbr: 'CO', closingType: 'Both', titleInsurance: 'Buyer', transferTax: '$0.01/$100', recordingFee: '$13 first page', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '110-125 days', redemptionPeriod: '75 days', propertyTaxRate: '0.51%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Low property tax rate. Short redemption period. Active investor market in Denver metro.' },
  { name: 'Connecticut', abbr: 'CT', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '0.75%-1.25%', recordingFee: '$60', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '180-270 days', redemptionPeriod: 'None', propertyTaxRate: '2.14%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'One of the highest property tax rates. Judicial foreclosure only — slow process. Attorney required for closings.' },
  { name: 'Delaware', abbr: 'DE', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '4% (split)', recordingFee: '$33', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '180-270 days', redemptionPeriod: 'None', propertyTaxRate: '0.57%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'High transfer tax (4% split buyer/seller). Judicial foreclosure only. Low property taxes.' },
  { name: 'Florida', abbr: 'FL', closingType: 'Both', titleInsurance: 'Seller (Miami-Dade: Buyer)', transferTax: '$0.70/$100', recordingFee: '$10 first page', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '180-365 days', redemptionPeriod: 'None', propertyTaxRate: '0.89%', wholesaleLegal: 'Yes (with restrictions)', licenseRequired: 'No license for own properties; new wholesaling disclosure laws', notes: 'No state income tax. Judicial foreclosure can be slow. New wholesaling laws require contract assignment disclosure. Very active investor market.' },
  { name: 'Georgia', abbr: 'GA', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$1/$1,000', recordingFee: '$25-50', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '37-60 days', redemptionPeriod: 'None', propertyTaxRate: '0.92%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Very fast non-judicial foreclosure (as quick as 37 days). No redemption period. Active Atlanta metro market.' },
  { name: 'Hawaii', abbr: 'HI', closingType: 'Escrow', titleInsurance: 'Buyer', transferTax: '$0.10-$1.25/$100', recordingFee: '$26', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '220-480 days', redemptionPeriod: 'None', propertyTaxRate: '0.28%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Lowest property tax rate in the US. Very high median home prices. Slow foreclosure process.' },
  { name: 'Idaho', abbr: 'ID', closingType: 'Escrow', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$10', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '150 days', redemptionPeriod: 'None', propertyTaxRate: '0.69%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No transfer tax. Fast-growing market, especially Boise metro. Investor-friendly.' },
  { name: 'Illinois', abbr: 'IL', closingType: 'Attorney', titleInsurance: 'Seller', transferTax: '$0.50/$500 + county', recordingFee: '$50-100', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '300-450 days', redemptionPeriod: '7 months (residential)', propertyTaxRate: '2.27%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Very high property taxes (especially Cook County). Slow judicial foreclosure with long redemption period. Chicago is an active investor market.' },
  { name: 'Indiana', abbr: 'IN', closingType: 'Both', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$10-25', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '150-270 days', redemptionPeriod: 'None', propertyTaxRate: '0.85%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No transfer tax. Moderate property taxes. Indianapolis is a popular cash flow market for rental investors.' },
  { name: 'Iowa', abbr: 'IA', closingType: 'Both', titleInsurance: 'Buyer', transferTax: '$0.80/$500', recordingFee: '$5 first page', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '160-200 days', redemptionPeriod: '12 months (judicial)', propertyTaxRate: '1.57%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Long redemption period for judicial foreclosure. Above-average property taxes.' },
  { name: 'Kansas', abbr: 'KS', closingType: 'Escrow', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$21', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '120-200 days', redemptionPeriod: '3-12 months', propertyTaxRate: '1.41%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No transfer tax. Variable redemption period based on mortgage length. Kansas City metro spans KS/MO border.' },
  { name: 'Kentucky', abbr: 'KY', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$0.50/$500', recordingFee: '$20-30', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '150-210 days', redemptionPeriod: '12 months', propertyTaxRate: '0.86%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Long 12-month redemption period. Judicial foreclosure only. Louisville and Lexington are primary investor markets.' },
  { name: 'Louisiana', abbr: 'LA', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$25-75', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '180-270 days', redemptionPeriod: 'None', propertyTaxRate: '0.55%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Napoleonic Code state — unique legal system. No transfer tax. Low property taxes. Flood insurance often required.' },
  { name: 'Maine', abbr: 'ME', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$2.20/$500', recordingFee: '$13-33', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '180-365 days', redemptionPeriod: '90 days', propertyTaxRate: '1.36%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Judicial foreclosure only. Seasonal market — vacation properties can be good investments.' },
  { name: 'Maryland', abbr: 'MD', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '0.5%-1.5%', recordingFee: '$60-120', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '90-150 days', redemptionPeriod: 'None', propertyTaxRate: '1.07%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Transfer tax varies by county. Baltimore is a popular investor market with low entry prices.' },
  { name: 'Massachusetts', abbr: 'MA', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$2.28/$500', recordingFee: '$75-155', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '75-90 days', redemptionPeriod: 'None', propertyTaxRate: '1.23%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'High entry prices but strong appreciation. Non-judicial foreclosure is relatively fast.' },
  { name: 'Michigan', abbr: 'MI', closingType: 'Both', titleInsurance: 'Buyer', transferTax: '$3.75/$500', recordingFee: '$15-30', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '60-90 days (non-judicial)', redemptionPeriod: '6 months', propertyTaxRate: '1.54%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Detroit has very low entry prices. 6-month redemption period. Above-average property taxes.' },
  { name: 'Minnesota', abbr: 'MN', closingType: 'Both', titleInsurance: 'Seller', transferTax: '$1.65/$500', recordingFee: '$46', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '60-90 days (non-judicial)', redemptionPeriod: '6 months', propertyTaxRate: '1.12%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Seller typically pays title insurance. 6-month redemption period. Minneapolis-St. Paul is the primary market.' },
  { name: 'Mississippi', abbr: 'MS', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$25', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '60-90 days', redemptionPeriod: 'None', propertyTaxRate: '0.81%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No transfer tax. Fast non-judicial foreclosure. Low property values and taxes.' },
  { name: 'Missouri', abbr: 'MO', closingType: 'Both', titleInsurance: 'Negotiable', transferTax: 'None', recordingFee: '$24', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '60-90 days', redemptionPeriod: '12 months (judicial only)', propertyTaxRate: '0.97%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No transfer tax. Fast non-judicial foreclosure. Kansas City and St. Louis are active investor markets.' },
  { name: 'Montana', abbr: 'MT', closingType: 'Escrow', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$12', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '150 days', redemptionPeriod: 'None', propertyTaxRate: '0.84%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No state income tax or transfer tax. Growing market, especially in Bozeman and Missoula areas.' },
  { name: 'Nebraska', abbr: 'NE', closingType: 'Both', titleInsurance: 'Buyer', transferTax: '$2.25/$1,000', recordingFee: '$10', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '120-180 days', redemptionPeriod: 'None', propertyTaxRate: '1.73%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'High property taxes. Judicial foreclosure only. Omaha is the primary investor market.' },
  { name: 'Nevada', abbr: 'NV', closingType: 'Escrow', titleInsurance: 'Buyer', transferTax: '$1.95/$500', recordingFee: '$30-50', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '120 days', redemptionPeriod: 'None', propertyTaxRate: '0.60%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No state income tax. Low property taxes. Las Vegas is a major investor market with strong rental demand.' },
  { name: 'New Hampshire', abbr: 'NH', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$7.50/$1,000 (each party)', recordingFee: '$25', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '59 days', redemptionPeriod: 'None', propertyTaxRate: '2.18%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Very high property taxes. No state income tax. Fast non-judicial foreclosure.' },
  { name: 'New Jersey', abbr: 'NJ', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '1% (varies)', recordingFee: '$50-100', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '270-450 days', redemptionPeriod: '10 days', propertyTaxRate: '2.49%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Highest property taxes in the nation. Very slow judicial foreclosure. Dense market with strong rental demand.' },
  { name: 'New Mexico', abbr: 'NM', closingType: 'Escrow', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$25-50', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '120-180 days', redemptionPeriod: '9 months', propertyTaxRate: '0.80%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No transfer tax. Long redemption period. Albuquerque is the primary market.' },
  { name: 'New York', abbr: 'NY', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$2/$500 + mansion tax', recordingFee: '$50-250', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '365-600+ days', redemptionPeriod: 'None', propertyTaxRate: '1.72%', wholesaleLegal: 'Yes (with restrictions)', licenseRequired: 'No license for own properties; restrictions on marketing contracts', notes: 'Extremely slow judicial foreclosure (can take 2+ years). High taxes and closing costs. NYC has additional taxes and regulations.' },
  { name: 'North Carolina', abbr: 'NC', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$1/$500', recordingFee: '$26 first page', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '90-120 days', redemptionPeriod: 'None', propertyTaxRate: '0.84%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Investor-friendly state. Fast non-judicial foreclosure. Charlotte and Raleigh are growing markets.' },
  { name: 'North Dakota', abbr: 'ND', closingType: 'Both', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$10', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '150-210 days', redemptionPeriod: '60 days', propertyTaxRate: '0.98%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No transfer tax. Small market with limited inventory. Oil boom areas may have unique opportunities.' },
  { name: 'Ohio', abbr: 'OH', closingType: 'Both', titleInsurance: 'Buyer', transferTax: '$1/$1,000 + county', recordingFee: '$28', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '150-210 days', redemptionPeriod: 'None', propertyTaxRate: '1.56%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Above-average property taxes. Cleveland, Columbus, and Cincinnati are popular investor markets with low entry prices.' },
  { name: 'Oklahoma', abbr: 'OK', closingType: 'Both', titleInsurance: 'Buyer', transferTax: '$0.75/$500', recordingFee: '$8-18', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '90-180 days', redemptionPeriod: 'None (non-judicial)', propertyTaxRate: '0.90%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Low closing costs. Oklahoma City and Tulsa are affordable investor markets.' },
  { name: 'Oregon', abbr: 'OR', closingType: 'Escrow', titleInsurance: 'Split', transferTax: 'None (most counties)', recordingFee: '$55-111', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '150-180 days', redemptionPeriod: 'None', propertyTaxRate: '0.97%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No state sales tax. Portland is the primary market. Rent control laws apply in some areas.' },
  { name: 'Pennsylvania', abbr: 'PA', closingType: 'Both', titleInsurance: 'Buyer', transferTax: '2% (split)', recordingFee: '$25-50', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '270-365 days', redemptionPeriod: 'None', propertyTaxRate: '1.58%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'High transfer tax (2% split). Slow judicial foreclosure. Philadelphia and Pittsburgh are active investor markets.' },
  { name: 'Rhode Island', abbr: 'RI', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$2.30/$500', recordingFee: '$25-50', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '60-90 days', redemptionPeriod: 'None', propertyTaxRate: '1.63%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Small state with limited inventory. High property taxes. Fast non-judicial foreclosure.' },
  { name: 'South Carolina', abbr: 'SC', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$1.85/$500', recordingFee: '$10-25', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '150-210 days', redemptionPeriod: 'None', propertyTaxRate: '0.57%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Low property taxes. Judicial foreclosure only. Charleston and Greenville are growing markets.' },
  { name: 'South Dakota', abbr: 'SD', closingType: 'Both', titleInsurance: 'Buyer', transferTax: '$0.50/$500', recordingFee: '$10-30', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '90-150 days', redemptionPeriod: '60-180 days', propertyTaxRate: '1.32%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No state income tax. Small market. Sioux Falls is the primary investor area.' },
  { name: 'Tennessee', abbr: 'TN', closingType: 'Both', titleInsurance: 'Negotiable', transferTax: '$0.37/$100', recordingFee: '$10-25', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '40-60 days', redemptionPeriod: '2 years (if no power of sale)', propertyTaxRate: '0.71%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No state income tax. Very fast non-judicial foreclosure. Nashville and Memphis are hot investor markets.' },
  { name: 'Texas', abbr: 'TX', closingType: 'Escrow', titleInsurance: 'Seller', transferTax: 'None', recordingFee: '$15-50', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '27-41 days', redemptionPeriod: 'None', propertyTaxRate: '1.80%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No state income tax or transfer tax. Fastest foreclosure in the nation. High property taxes offset no income tax. Massive investor market (DFW, Houston, San Antonio, Austin).' },
  { name: 'Utah', abbr: 'UT', closingType: 'Escrow', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$10-40', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '120-150 days', redemptionPeriod: 'None', propertyTaxRate: '0.63%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No transfer tax. Low property taxes. Salt Lake City metro is the primary market. Strong appreciation.' },
  { name: 'Vermont', abbr: 'VT', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '1.25%-1.45%', recordingFee: '$15', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '210-365 days', redemptionPeriod: '6 months', propertyTaxRate: '1.90%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'High property taxes and transfer tax. Slow judicial foreclosure with 6-month redemption. Small market.' },
  { name: 'Virginia', abbr: 'VA', closingType: 'Attorney', titleInsurance: 'Buyer', transferTax: '$1.67/$500', recordingFee: '$25-50', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '45-60 days', redemptionPeriod: 'None', propertyTaxRate: '0.82%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Fast non-judicial foreclosure. Northern Virginia (DC suburbs) has high prices but strong demand. Hampton Roads is more affordable.' },
  { name: 'Washington', abbr: 'WA', closingType: 'Escrow', titleInsurance: 'Split', transferTax: '1.1%-3%', recordingFee: '$50-100', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '120-180 days', redemptionPeriod: 'None', propertyTaxRate: '1.03%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No state income tax. Transfer tax varies by sale price (tiered). Seattle is expensive; Spokane and Tacoma offer better entry points.' },
  { name: 'West Virginia', abbr: 'WV', closingType: 'Both', titleInsurance: 'Buyer', transferTax: '$1.10/$500 + $0.55/$500', recordingFee: '$15-25', disclosureRequired: true, foreclosureType: 'Non-Judicial', foreclosureTimeline: '60-90 days', redemptionPeriod: 'None', propertyTaxRate: '0.58%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'Low property values and taxes. Fast non-judicial foreclosure. Limited market size.' },
  { name: 'Wisconsin', abbr: 'WI', closingType: 'Both', titleInsurance: 'Seller', transferTax: '$3/$1,000', recordingFee: '$30', disclosureRequired: true, foreclosureType: 'Judicial', foreclosureTimeline: '290-365 days', redemptionPeriod: '12 months', propertyTaxRate: '1.85%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'High property taxes. Very long foreclosure + redemption period. Milwaukee is the primary investor market.' },
  { name: 'Wyoming', abbr: 'WY', closingType: 'Both', titleInsurance: 'Buyer', transferTax: 'None', recordingFee: '$12', disclosureRequired: true, foreclosureType: 'Both', foreclosureTimeline: '60-90 days', redemptionPeriod: '3 months (judicial)', propertyTaxRate: '0.61%', wholesaleLegal: 'Yes', licenseRequired: 'No license required for own properties', notes: 'No state income tax or transfer tax. Very small market. Low property taxes. Good for LLC formation (privacy).' },
];

function StateDetail({ state, onBack }: { state: StateData; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1">
        ← Back to all states
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-[oklch(0.48_0.20_18)]/10 flex items-center justify-center font-bold text-lg text-[oklch(0.48_0.20_18)]">
          {state.abbr}
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{state.name}</h2>
          <p className="text-sm text-muted-foreground">Real Estate Investor Reference Guide</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[oklch(0.48_0.20_18)]" /> Costs & Taxes
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Property Tax Rate</span><span className="font-medium">{state.propertyTaxRate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Transfer Tax</span><span className="font-medium">{state.transferTax}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Recording Fee</span><span className="font-medium">{state.recordingFee}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Title Insurance Paid By</span><span className="font-medium">{state.titleInsurance}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[oklch(0.48_0.20_18)]" /> Legal & Closing
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Closing Type</span><span className="font-medium">{state.closingType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Seller Disclosure</span><span className="font-medium">{state.disclosureRequired ? 'Required' : 'Not Required'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Wholesale Legal</span><span className="font-medium">{state.wholesaleLegal}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">License</span><span className="font-medium text-xs text-right max-w-[200px]">{state.licenseRequired}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[oklch(0.48_0.20_18)]" /> Foreclosure
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{state.foreclosureType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Timeline</span><span className="font-medium">{state.foreclosureTimeline}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Redemption Period</span><span className="font-medium">{state.redemptionPeriod}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[oklch(0.48_0.20_18)]" /> Notes
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{state.notes}</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Data is for general reference only. Laws and fees change frequently. Always verify with local professionals before making investment decisions.
      </p>
    </div>
  );
}

export default function StateGuide() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return STATES;
    const q = search.toLowerCase();
    return STATES.filter(s => s.name.toLowerCase().includes(q) || s.abbr.toLowerCase().includes(q));
  }, [search]);

  const selectedState = STATES.find(s => s.abbr === selected);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-14 text-center">
          <MapPin className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">State Reference Guide</h1>
          <p className="text-[oklch(0.6_0_0)] max-w-lg mx-auto">
            Closing procedures, transfer taxes, foreclosure timelines, property tax rates,
            and wholesaling legality for all 50 states.
          </p>
        </div>
      </section>

      <section className="container py-12">
        {selectedState ? (
          <StateDetail state={selectedState} onBack={() => setSelected(null)} />
        ) : (
          <>
            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by state name or abbreviation..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.20_18)]/30"
                />
              </div>
            </div>

            {/* State Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {filtered.map(state => (
                <button
                  key={state.abbr}
                  onClick={() => setSelected(state.abbr)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border hover:border-[oklch(0.48_0.20_18)]/40 hover:bg-[oklch(0.48_0.20_18)]/5 transition-colors text-left"
                >
                  <span className="font-bold text-sm text-[oklch(0.48_0.20_18)] w-7">{state.abbr}</span>
                  <span className="text-xs truncate">{state.name}</span>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No states match your search.</p>
            )}

            {/* Quick Comparison Table */}
            <div className="mt-12">
              <h2 className="text-xl font-bold tracking-tight mb-4">Quick Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">State</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Prop Tax</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Transfer Tax</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Closing</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Foreclosure</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Timeline</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Wholesale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.abbr} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(s.abbr)}>
                        <td className="py-1.5 px-2 font-medium">{s.abbr}</td>
                        <td className="py-1.5 px-2">{s.propertyTaxRate}</td>
                        <td className="py-1.5 px-2">{s.transferTax}</td>
                        <td className="py-1.5 px-2">{s.closingType}</td>
                        <td className="py-1.5 px-2">{s.foreclosureType}</td>
                        <td className="py-1.5 px-2">{s.foreclosureTimeline}</td>
                        <td className="py-1.5 px-2">{s.wholesaleLegal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Data compiled from state statutes, county records, and industry sources. For general reference only — verify with local professionals.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
