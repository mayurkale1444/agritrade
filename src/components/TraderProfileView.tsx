import React from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Tag,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Edit3,
  ShieldCheck,
  Sprout
} from 'lucide-react';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation } from '../locales';
import { TraderReport, UserProfile } from '../types';
import { COMMODITIES } from '../services/mandiDataService';
import { 
  getTraderProfileById, 
  getTraderReportsByTraderId, 
  getStoredUserProfile, 
  getStoredTraderReports 
} from '../services/traderReportService';

interface TraderProfileViewProps {
  language: SupportedLanguage;
  profile?: UserProfile;
  traderId?: string;
  currentUserId?: string;
  reports?: TraderReport[];
  isCurrentUser?: boolean;
  onBack: () => void;
  onOpenEditProfile?: () => void;
  onAddLocalRate?: () => void;
  onOpenAddLocalRate?: () => void;
  onEditReport?: (report: TraderReport) => void;
}

export const TraderProfileView: React.FC<TraderProfileViewProps> = ({
  language,
  profile: propProfile,
  traderId,
  currentUserId,
  reports: propReports,
  isCurrentUser: propIsCurrentUser,
  onBack,
  onOpenEditProfile,
  onAddLocalRate,
  onOpenAddLocalRate,
  onEditReport
}) => {
  const t = getTranslation(language);

  // Resolve profile and reports
  const currentUser = getStoredUserProfile();
  const profile: UserProfile = propProfile || (traderId ? getTraderProfileById(traderId, currentUser) : null) || currentUser;
  const isCurrentUser = propIsCurrentUser ?? Boolean(currentUserId && profile.id === currentUserId);
  const handleAddRate = onOpenAddLocalRate || onAddLocalRate;

  // Filter reports submitted by this trader
  const allReports = propReports || (traderId ? getTraderReportsByTraderId(traderId) : getStoredTraderReports());
  const traderReports = allReports
    .filter(r => r.traderId === profile.id || r.traderName?.toLowerCase() === profile.name?.toLowerCase())
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const latestReport = traderReports[0];
  const isVerified = profile.verificationStatus === 'VERIFIED';

  return (
    <div className="min-h-screen bg-slate-50 pb-24 w-full max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden" id="trader-profile-view">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="trader-profile-back-btn"
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">
                {t.traderProfileTitle}
              </h1>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {t.traderReportedLocalMarket}
              </span>
            </div>
          </div>

          {isCurrentUser && onOpenEditProfile && (
            <button
              type="button"
              id="profile-edit-btn"
              onClick={onOpenEditProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.editProfileBtn}</span>
            </button>
          )}
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-black shadow-2xs">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 leading-snug">
                    {profile.name}
                  </h2>
                  {/* Verified status only when explicitly established */}
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wider uppercase">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {t.verifiedTrader}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {profile.userType || profile.role || 'Trader'}
                    </span>
                  )}
                </div>

                {profile.businessName && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.businessName}</span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>
                    {profile.district}, {profile.state || 'Maharashtra'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                {t.totalLocalReports}
              </span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">
                {traderReports.length} {language === 'mr' ? 'नोंदी' : 'Reports'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                {t.latestReport}
              </span>
              <span className="text-xs font-black text-slate-900 mt-1 block">
                {latestReport ? (latestReport.reportDate || latestReport.date) : '—'}
              </span>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                {t.mainMarket}
              </span>
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {profile.mainApmc || 'Solapur APMC'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                {t.commoditiesTraded}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.commoditiesHandled && profile.commoditiesHandled.length > 0 ? (
                  profile.commoditiesHandled.map(cid => (
                    <span
                      key={cid}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-[11px]"
                    >
                      {COMMODITIES.find(c => c.id === cid)?.name || cid}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">Onion, Grains</span>
                )}
              </div>
            </div>

            {profile.about && (
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  {t.businessDescription}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                  {profile.about}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Local Market Reports History Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {t.previousReports}
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">
                {t.ratesDisclaimer}
              </span>
            </div>

            {isCurrentUser && handleAddRate && (
              <button
                type="button"
                id="profile-add-rate-btn"
                onClick={handleAddRate}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {t.addLocalRateBtn}
              </button>
            )}
          </div>

          {traderReports.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">
                {t.noReportsTrader}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {traderReports.map(report => (
                <div
                  key={report.id}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">
                          {report.commodity}
                        </span>
                        {report.variety && (
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {report.variety}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                        {report.marketName || report.apmc}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{report.reportDate || report.date}</span>
                    </div>
                  </div>

                  {/* Price Banner */}
                  <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-2.5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                        ₹ / quintal
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        ₹{report.minPrice.toLocaleString('en-IN')} – ₹{report.maxPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {report.modalPrice ? (
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                          {t.modalPriceShort}
                        </span>
                        <span className="text-sm font-black text-emerald-800">
                          ₹{report.modalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Note */}
                  {report.note && (
                    <p className="text-[11px] text-slate-600 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{report.note}"
                    </p>
                  )}

                  {/* Photo Thumbnail if attached */}
                  {report.photoUrl && (
                    <div className="mt-1">
                      <img
                        src={report.photoUrl}
                        alt="Local Rate Poster"
                        className="max-h-40 w-full object-cover rounded-xl border border-slate-200"
                      />
                    </div>
                  )}

                  {/* Edit action if current user */}
                  {isCurrentUser && onEditReport && (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onEditReport(report)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                      >
                        {t.editRate}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
