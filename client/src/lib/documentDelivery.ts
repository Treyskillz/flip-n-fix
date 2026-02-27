// ============================================================
// Document Delivery — Generate email-ready contract content
// and open user's email client with pre-filled fields
// ============================================================

import { ContractTemplate, ContractSection } from './contracts';

export interface DeliveryRecipient {
  name: string;
  email: string;
  role: string;
}

export interface DeliveryOptions {
  template: ContractTemplate;
  fieldValues: Record<string, string>;
  recipient: DeliveryRecipient;
  senderName: string;
  senderCompany: string;
  senderEmail: string;
  senderPhone: string;
  personalMessage?: string;
}

/**
 * Interpolate a contract section body with field values
 */
function interpolateBody(body: string, fieldValues: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => fieldValues[key] || `[${key}]`);
}

/**
 * Generate plain-text version of a contract for email body
 */
export function generateContractText(
  template: ContractTemplate,
  fieldValues: Record<string, string>
): string {
  const lines: string[] = [];
  lines.push(template.title.toUpperCase());
  lines.push('='.repeat(template.title.length));
  lines.push('');

  for (const section of template.sections) {
    lines.push(section.heading.toUpperCase());
    lines.push('-'.repeat(section.heading.length));
    lines.push(interpolateBody(section.body, fieldValues));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate the email subject line
 */
export function generateSubject(
  template: ContractTemplate,
  propertyAddress: string,
  senderCompany: string
): string {
  return `${template.title} — ${propertyAddress} | ${senderCompany}`;
}

/**
 * Generate the full email body with personal message, contract, and signature
 */
export function generateEmailBody(options: DeliveryOptions): string {
  const { template, fieldValues, recipient, senderName, senderCompany, senderEmail, senderPhone, personalMessage } = options;

  const lines: string[] = [];

  // Greeting
  lines.push(`Dear ${recipient.name},`);
  lines.push('');

  // Personal message
  if (personalMessage) {
    lines.push(personalMessage);
    lines.push('');
  } else {
    lines.push(`Please find the ${template.title} attached below for your review.`);
    lines.push('');
  }

  // Contract content
  lines.push('─'.repeat(50));
  lines.push('');
  lines.push(generateContractText(template, fieldValues));
  lines.push('─'.repeat(50));
  lines.push('');

  // Signature
  lines.push('Best regards,');
  lines.push(senderName);
  if (senderCompany) lines.push(senderCompany);
  if (senderPhone) lines.push(`Phone: ${senderPhone}`);
  if (senderEmail) lines.push(`Email: ${senderEmail}`);

  return lines.join('\n');
}

/**
 * Open the user's email client with pre-filled fields via mailto:
 */
export function openEmailClient(options: DeliveryOptions & { propertyAddress: string }): void {
  const subject = generateSubject(options.template, options.propertyAddress, options.senderCompany);
  const body = generateEmailBody(options);

  const mailtoUrl = `mailto:${encodeURIComponent(options.recipient.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.open(mailtoUrl, '_blank');
}

/**
 * Get a summary of what was sent for the activity log
 */
export function getDeliverySummary(options: DeliveryOptions & { propertyAddress: string }): {
  title: string;
  description: string;
  metadata: string;
} {
  return {
    title: `${options.template.title} sent to ${options.recipient.name}`,
    description: `Sent ${options.template.title} for ${options.propertyAddress} to ${options.recipient.name} (${options.recipient.role}) at ${options.recipient.email}`,
    metadata: JSON.stringify({
      templateId: options.template.id,
      templateTitle: options.template.title,
      recipientName: options.recipient.name,
      recipientEmail: options.recipient.email,
      recipientRole: options.recipient.role,
      propertyAddress: options.propertyAddress,
      sentAt: new Date().toISOString(),
    }),
  };
}
