import React from 'react';
import { UserProfile } from '../types';
import { SupportedLanguage } from '../services/i18nService';

export interface ProfileContextBarProps {
  userProfile?: UserProfile | null;
  language: SupportedLanguage;
  activeState?: string;
  activeDistrict?: string;
  activeApmc?: string;
  activeCommodityName?: string;
  onEditProfile?: () => void;
  onSelectOtherMarket?: () => void;
  showIncompleteBanner?: boolean;
}

/**
 * ProfileContextBar
 * Note: Visible profile/APMC banner box removed as per requirement:
 * "Remove the “Your Primary APMC/Profile” box from ALL screens; keep personalization working silently in the background."
 * Personalization continues silently in the background across all views.
 */
export const ProfileContextBar: React.FC<ProfileContextBarProps> = () => {
  return null;
};
