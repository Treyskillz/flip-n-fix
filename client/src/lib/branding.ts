// ============================================================
// Centralized Branding System
// ============================================================
// 3-tier branding logic:
//   1. Admin (owner) → Full Freedom One: logo + name + contact info
//   2. All other subscribers (Free/Pro/Elite) → Freedom One logo + name, NO contact info
//   3. Team tier with white-label → Fully custom: their logo, name, contact info
// ============================================================

import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useMemo } from 'react';

// ─── Logo URLs ──────────────────────────────────────────────
const LOGO_TRANSPARENT_BLACK = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/logo-transparent-black_1d2d479c.png';
const LOGO_UPLOADED = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png';

// ─── Admin (Owner) Branding — Full contact info ─────────────
export const ADMIN_BRANDING = {
  companyName: 'Freedom One Properties',
  tagline: 'System of Real Estate Investing',
  logoUrl: LOGO_TRANSPARENT_BLACK,
  logoUrlAlt: LOGO_UPLOADED,
  brandColor: '#c53030',
  phone: '831-498-6237',
  email: 'contact@freedomoneproperties.com',
  website: 'freedomoneproperties.com',
  footerText: 'Freedom One Real Estate Investment System',
  disclaimerText: 'This document was prepared using the Freedom One Real Estate Investment System. All information should be verified independently. This is not legal, financial, or investment advice.',
} as const;

// ─── Subscriber Branding — Logo + name, NO contact info ─────
export const SUBSCRIBER_BRANDING = {
  companyName: 'Freedom One Properties',
  tagline: 'System of Real Estate Investing',
  logoUrl: LOGO_TRANSPARENT_BLACK,
  logoUrlAlt: LOGO_UPLOADED,
  brandColor: '#c53030',
  phone: '',
  email: '',
  website: '',
  footerText: 'Freedom One Real Estate Investment System',
  disclaimerText: 'This document was prepared using the Freedom One Real Estate Investment System. All projections are estimates based on user-provided data. Actual results may vary. Always perform independent due diligence and consult with qualified professionals before making investment decisions.',
} as const;

// ─── Branding Type ──────────────────────────────────────────
export interface BrandingConfig {
  companyName: string;
  tagline: string;
  logoUrl: string;
  logoUrlAlt: string;
  brandColor: string;
  phone: string;
  email: string;
  website: string;
  footerText: string;
  disclaimerText: string;
  isAdmin: boolean;
  isWhiteLabel: boolean;
}

/**
 * React hook that returns the correct branding for the current user.
 * - Admin → Full Freedom One branding with contact info
 * - Team tier with white-label → Fully custom branding
 * - Everyone else → Freedom One logo + name, no contact info
 */
export function useBranding(): { branding: BrandingConfig; isLoading: boolean } {
  const { user, isAuthenticated } = useAuth();
  const { data: subStatus, isLoading: subLoading } = trpc.subscription.status.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: whiteLabelData, isLoading: wlLoading } = trpc.whiteLabel.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const branding = useMemo<BrandingConfig>(() => {
    const isAdmin = user?.role === 'admin';

    // 1. Admin always gets full Freedom One branding with contact info
    if (isAdmin) {
      return {
        ...ADMIN_BRANDING,
        isAdmin: true,
        isWhiteLabel: false,
      };
    }

    // 2. Team tier with white-label enabled and configured → fully custom
    if (
      subStatus?.plan === 'team' &&
      whiteLabelData &&
      whiteLabelData.enabled === 1 &&
      whiteLabelData.companyName
    ) {
      return {
        companyName: whiteLabelData.companyName || '',
        tagline: whiteLabelData.tagline || '',
        logoUrl: whiteLabelData.logoUrl || '',
        logoUrlAlt: whiteLabelData.logoUrl || '',
        brandColor: whiteLabelData.brandColor || '#1a1a1a',
        phone: whiteLabelData.phone || '',
        email: whiteLabelData.email || '',
        website: whiteLabelData.website || '',
        footerText: whiteLabelData.companyName || 'Real Estate Investment Analysis',
        disclaimerText: `This document was prepared by ${whiteLabelData.companyName}. All projections are estimates based on user-provided data. Actual results may vary. Always perform independent due diligence and consult with qualified professionals before making investment decisions.`,
        isAdmin: false,
        isWhiteLabel: true,
      };
    }

    // 3. Everyone else → Freedom One logo + name, no contact info
    return {
      ...SUBSCRIBER_BRANDING,
      isAdmin: false,
      isWhiteLabel: false,
    };
  }, [user, subStatus, whiteLabelData]);

  return {
    branding,
    isLoading: subLoading || wlLoading,
  };
}

// ─── Static helper for non-React contexts ───────────────────
export function getBrandingForRole(role: string | undefined | null): BrandingConfig {
  if (role === 'admin') {
    return { ...ADMIN_BRANDING, isAdmin: true, isWhiteLabel: false };
  }
  return { ...SUBSCRIBER_BRANDING, isAdmin: false, isWhiteLabel: false };
}

// ─── PDF Header HTML Generator ──────────────────────────────
export function buildBrandedHeaderHtml(branding: BrandingConfig, opts?: { title?: string; subtitle?: string; meta?: string }): string {
  const logoHtml = branding.logoUrl
    ? `<img src="${branding.logoUrl}" alt="${branding.companyName}" style="height:50px;object-fit:contain;" onerror="this.style.display='none'" />`
    : '';

  const contactParts: string[] = [];
  if (branding.phone) contactParts.push(branding.phone);
  if (branding.email) contactParts.push(branding.email);
  if (branding.website) contactParts.push(branding.website);

  return `
    <div style="display:flex;align-items:center;gap:20px;border-bottom:3px solid ${branding.brandColor};padding-bottom:20px;margin-bottom:30px;">
      ${logoHtml}
      <div style="flex:1;">
        ${opts?.title ? `<h1 style="font-size:24px;color:${branding.brandColor};margin:0 0 2px 0;letter-spacing:1px;">${opts.title}</h1>` : `<div style="font-size:16px;font-weight:700;color:${branding.brandColor};">${branding.companyName}</div>`}
        ${opts?.subtitle ? `<div style="font-size:16px;font-weight:600;color:#333;">${opts.subtitle}</div>` : (branding.tagline ? `<div style="font-size:11px;color:#666;">${branding.tagline}</div>` : '')}
        ${opts?.meta ? `<div style="font-size:12px;color:#888;margin-top:4px;">${opts.meta}</div>` : ''}
      </div>
      ${contactParts.length > 0 ? `<div style="text-align:right;font-size:10px;color:#888;line-height:1.6;">${contactParts.join('<br/>')}</div>` : ''}
    </div>`;
}

// ─── PDF Footer HTML Generator ──────────────────────────────
export function buildBrandedFooterHtml(branding: BrandingConfig): string {
  return `
    <div style="margin-top:40px;text-align:center;font-size:11px;color:#999;border-top:2px solid #e5e5e5;padding-top:16px;">
      <p><strong>${branding.footerText}</strong></p>
      <p style="margin-top:4px;">${branding.disclaimerText}</p>
    </div>`;
}

// ─── Accent Color CSS Helper ────────────────────────────────
export function getBrandAccentCss(branding: BrandingConfig): string {
  return branding.brandColor || '#c53030';
}
