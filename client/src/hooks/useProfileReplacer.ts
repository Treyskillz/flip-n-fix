import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useCallback, useMemo } from 'react';

export interface ProfileData {
  fullName: string | null;
  companyName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  website: string | null;
  licenseNumber: string | null;
  marketArea: string | null;
  yearsExperience: string | null;
}

/**
 * Hook that fetches the user's profile and provides a function
 * to replace bracketed placeholders in template text.
 */
export function useProfileReplacer() {
  const { isAuthenticated } = useAuth();

  const profileQuery = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  const profile = profileQuery.data as ProfileData | null | undefined;

  const hasProfile = useMemo(() => {
    if (!profile) return false;
    return !!(profile.fullName || profile.companyName || profile.phone || profile.email);
  }, [profile]);

  const fullAddress = useMemo(() => {
    if (!profile) return null;
    const parts = [profile.address, profile.city, profile.state, profile.zip].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  }, [profile]);

  /**
   * Replace all known bracketed placeholders in a text string
   * with the user's profile data. If a field is not set, the
   * placeholder is left as-is (so the user knows to fill it in).
   */
  const replaceInText = useCallback(
    (text: string): string => {
      if (!profile || !hasProfile) return text;

      let result = text;

      // Name replacements
      if (profile.fullName) {
        result = result.replace(/\[Your Name\]/g, profile.fullName);
        result = result.replace(/\[Your name\]/g, profile.fullName);
      }

      // Company replacements
      if (profile.companyName) {
        result = result.replace(/\[Your Company Name\]/g, profile.companyName);
        result = result.replace(/\[Your Company\]/g, profile.companyName);
        result = result.replace(/\[Company\]/g, profile.companyName);
      }

      // Phone
      if (profile.phone) {
        result = result.replace(/\[Phone\]/g, profile.phone);
        result = result.replace(/\[Your Phone\]/g, profile.phone);
      }

      // Email
      if (profile.email) {
        result = result.replace(/\[Email\]/g, profile.email);
        result = result.replace(/\[Your Email\]/g, profile.email);
      }

      // Address
      if (fullAddress) {
        result = result.replace(/\[Your Address\]/g, fullAddress);
        result = result.replace(/\[Address\]/g, fullAddress);
      }

      // City
      if (profile.city) {
        result = result.replace(/\[City\]/g, profile.city);
        result = result.replace(/\[City\/Area\]/g, profile.city);
      }

      // State
      if (profile.state) {
        result = result.replace(/\[State\]/g, profile.state);
      }

      // Website
      if (profile.website) {
        result = result.replace(/\[Your Website\]/g, profile.website);
        result = result.replace(/\[Website\]/g, profile.website);
      }

      // Market area
      if (profile.marketArea) {
        result = result.replace(/\[Your Market Area\]/g, profile.marketArea);
        result = result.replace(/\[Market Area\]/g, profile.marketArea);
      }

      // Years of experience
      if (profile.yearsExperience) {
        result = result.replace(/\[X\] years/g, `${profile.yearsExperience} years`);
      }

      // License number
      if (profile.licenseNumber) {
        result = result.replace(/\[License #\]/g, profile.licenseNumber);
      }

      return result;
    },
    [profile, hasProfile, fullAddress]
  );

  /**
   * Replace placeholders in an array of section objects
   */
  const replaceInSections = useCallback(
    (sections: { heading: string; body: string }[]): { heading: string; body: string }[] => {
      return sections.map((s) => ({
        heading: replaceInText(s.heading),
        body: replaceInText(s.body),
      }));
    },
    [replaceInText]
  );

  return {
    profile,
    hasProfile,
    isLoading: profileQuery.isLoading,
    replaceInText,
    replaceInSections,
  };
}
