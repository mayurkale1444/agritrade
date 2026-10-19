import React from 'react';
import { UserProfile } from '../types';
import { SupportedLanguage } from '../services/i18nService';

export interface UserProfileBannerProps {
  userProfile?: UserProfile | null;
  language?: SupportedLanguage;
  onOpenEditProfile?: () => void;
  className?: string;
  sectionTitle?: string;
  showTraderType?: boolean;
}

/**
 * UserProfileBanner
 * Note: Visible profile banner box removed as per requirement:
 * "Remove the “Your Primary APMC/Profile” box from ALL screens; keep personalization working silently in the background."
 * Personalization continues silently in the background across all views.
 */
export const UserProfileBanner: React.FC<UserProfileBannerProps> = () => {
  return null;
};
