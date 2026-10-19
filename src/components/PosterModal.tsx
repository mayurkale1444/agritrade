import React, { useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldAlert,
  Calendar,
  MapPin,
  User,
  CheckCircle2,
  ExternalLink,
  Tag,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { TraderReport } from '../types';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation } from '../locales';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: TraderReport | null;
  language: SupportedLanguage;
  onViewTraderProfile?: (traderId: string) => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({
  isOpen,
  onClose,
  report,
  language,
  onViewTraderProfile
}) => {
  const t = getTranslation(language);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen || !report) return null;

  const posterImage = report.posterUrl || report.photoUrl;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const isExtractionReliable = report.extractionStatus === 'EXTRACTED' || report.extractionStatus === 'MANUAL';
  const qualityList = report.qualityRates && report.qualityRates.length > 0 ? report.qualityRates : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="poster-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95 sticky top-0 z-20">
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600/30 text-blue-300 border border-blue-500/50 uppercase tracking-wider">
                🔵 {t.traderReportedLocalMarket}
              </span>
              {report.verificationStatus === 'VERIFIED' && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
                  ✓ VERIFIED TRADER
                </span>
              )}
            </div>
            <h2 id="poster-modal-title" className="text-base font-black text-white mt-1 truncate">
              {report.businessName || report.traderName} — {report.commodity || report.commodityName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 truncate">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {report.marketName || report.apmc}, {report.district}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {report.reportDate || report.date}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            id="close-poster-modal-btn"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {/* Strict Data Safety Warning Banner */}
          <div className="bg-amber-950/60 border border-amber-600/60 rounded-2xl p-3 text-amber-200 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-300 font-bold block mb-0.5">
                {language === 'mr' ? 'स्थानिक व्यापारी नोंद — अधिकृत शासकीय डेटा नव्हे (अपुष्ट असू शकतात)' : 'Trader Reported — Not Official Government Data (May Be Unverified)'}
              </strong>
              <span>
                {language === 'mr'
                  ? 'हा दर स्थानिक व्यापाऱ्याने स्वतःच्या फलकावरून नोंदवला आहे आणि तो अपुष्ट असू शकतो. विविध प्रत, आर्द्रता व गुणवत्तेनुसार दर वेगळे असू शकतात. अधिकृत APMC बेंचमार्क किंवा शासकीय आकडेवारी मानू नये.'
                  : 'This poster and rate breakdown are reported directly by the local trader and may be unverified. Rates vary by quality, grade, moisture, and lot condition. Never treated as official APMC benchmark or government data.'}
              </span>
            </div>
          </div>

          {/* Original Poster Image Canvas with Zoom Toolbar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 px-1">
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-blue-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {language === 'mr' ? 'मूळ व्यापारी भाव फलक (Original Poster)' : 'Original Trader Rate Poster'}
              </span>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.75}
                  className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1 font-bold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 2.5}
                  className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1 rounded-lg hover:bg-slate-700 text-slate-300"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Poster Viewer Frame */}
            <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center min-h-[260px] max-h-[500px]">
              {posterImage ? (
                <div
                  className="transition-transform duration-200 ease-out p-2 flex items-center justify-center w-full"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={posterImage}
                    alt="Original Trader Rate Poster"
                    className="max-h-[460px] w-auto max-w-full object-contain rounded-xl shadow-lg border border-slate-800/80"
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <AlertTriangle className="w-8 h-8 mx-auto text-amber-400" />
                  <p className="text-xs">
                    {language === 'mr' ? 'मूळ फलक उपलब्ध नाही (केवळ दर नोंदवले आहेत)' : 'No rate poster image uploaded with this report.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Structured Quality-Wise Rates Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 px-1">
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-emerald-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {language === 'mr' ? 'गुणवत्ता / आकारानुसार दर पत्रक' : 'Quality-Wise Rate Breakdown'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {report.originalUnit ? `Unit: ${report.originalUnit}` : 'Unit: 100 KG'}
              </span>
            </div>

            {qualityList && qualityList.length > 0 ? (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="grid grid-cols-12 bg-slate-800/80 px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <div className="col-span-7">
                    {language === 'mr' ? 'प्रत / क्वालिटी (Quality / Grade)' : 'Quality / Grade'}
                  </div>
                  <div className="col-span-5 text-right">
                    {language === 'mr' ? 'दर (Rate)' : 'Rate'}
                  </div>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs">
                  {qualityList.map((item, idx) => (
                    <div key={item.id || idx} className="grid grid-cols-12 px-3 py-2.5 items-center hover:bg-slate-900/50">
                      <div className="col-span-7 min-w-0 pr-2">
                        <div className="font-bold text-white leading-tight">
                          {item.quality}
                        </div>
                        {item.sizeDescription && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {item.sizeDescription}
                          </div>
                        )}
                      </div>
                      <div className="col-span-5 text-right">
                        <div className="font-mono font-black text-sm text-emerald-400">
                          {item.rate}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">
                          /{item.unit || report.originalUnit || '100 KG'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-slate-200">
                    {language === 'mr' ? 'सामान्य व्यापारी दर' : 'General Trader Spot Rate'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {report.gradeQuality || 'Single Lot Rate'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-sm text-emerald-400 block">
                    ₹{report.modalPrice ? report.modalPrice.toLocaleString('en-IN') : `${report.minPrice} – ${report.maxPrice}`}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    /{report.originalUnit || '100 KG'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Trader Note if present */}
          {report.note && (
            <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/60 text-xs text-slate-300">
              <span className="font-bold text-slate-400 block text-[10px] uppercase tracking-wider mb-1">
                {language === 'mr' ? 'व्यापारी टीप (Trader Remarks)' : 'Trader Remarks'}
              </span>
              <p className="italic leading-relaxed font-medium">"{report.note}"</p>
            </div>
          )}

          {/* Trader Attribution & Profile Action */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center text-sm font-black border border-slate-700">
                {(report.traderName || 'T').charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-black text-white block">
                  {report.traderName}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {report.businessName ? `${report.businessName} • ` : ''}
                  {report.role || 'Trader'}
                </span>
              </div>
            </div>

            {onViewTraderProfile && (
              <button
                type="button"
                id="poster-modal-view-profile-btn"
                onClick={() => {
                  onClose();
                  onViewTraderProfile(report.traderId || report.traderName);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <span>{t.viewProfile}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
