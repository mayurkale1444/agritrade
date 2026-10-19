import React, { useState } from 'react';
import { MarketData } from '../types';
import {
  downloadMandiPdf,
  generateWhatsAppText,
  getWhatsAppUrl,
  PdfReportOptions
} from '../services/pdfReportGenerator';
import {
  FileText,
  Download,
  Share2,
  Check,
  Copy,
  X,
  Radio,
  ShieldAlert,
  Calendar,
  MapPin,
  Tag,
  AlertCircle
} from 'lucide-react';

interface MandiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketData: MarketData;
  onOpenDailyReport?: () => void;
}

export const MandiReportModal: React.FC<MandiReportModalProps> = ({
  isOpen,
  onClose,
  marketData,
  onOpenDailyReport
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const isLive = marketData.isLive && marketData.dataTypeCategory === 'LIVE VERIFIED DATA';
  const isFallback = marketData.dataTypeCategory === 'FALLBACK DATA' || marketData.dataTypeCategory === 'DEMO DATA';

  const modalPrice = marketData.modalPrice || marketData.currentPrice;
  const minPrice = marketData.minPrice || marketData.currentPrice;
  const maxPrice = marketData.maxPrice || marketData.currentPrice;

  const variety = marketData.mandi.variety && marketData.mandi.variety !== 'Other'
    ? marketData.mandi.variety
    : (marketData.mandi.variety || 'Standard / Local');

  const grade = marketData.mandi.grade || 'FAQ (Fair Average Quality)';

  const reportOptions: PdfReportOptions = {
    commodityName: marketData.commodity.name,
    commodityId: marketData.commodity.id,
    state: marketData.mandi.state,
    district: marketData.mandi.district,
    marketName: marketData.mandi.name,
    variety: variety,
    grade: grade,
    arrivalDate: marketData.arrivalDate || 'Today',
    minPrice: minPrice,
    modalPrice: modalPrice,
    maxPrice: maxPrice,
    isLive: isLive,
    dataTypeCategory: marketData.dataTypeCategory,
    statusMessage: marketData.statusMessage,
    dataSource: marketData.dataSource,
    unit: marketData.commodity.unit
  };

  const whatsappMessage = generateWhatsAppText(reportOptions);
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  const handleDownload = () => {
    downloadMandiPdf(reportOptions);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                MANDI PRICE REPORT
              </h2>
              <p className="text-[11px] text-slate-400">
                Single-mandi daily wholesale auction summary
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Preview */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>LIVE</span>
              </span>
            ) : isFallback ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>FALLBACK</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                <span>UNAVAILABLE</span>
              </span>
            )}

            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {marketData.arrivalDate || 'Today'}
            </span>
          </div>

          {/* Clean Information Box */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Commodity</span>
                <strong className="text-sm text-white">{marketData.commodity.name}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Arrival Date</span>
                <strong className="text-sm text-white">{marketData.arrivalDate || 'Today'}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/70">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Market</span>
              <strong className="text-sm text-white block">
                {marketData.mandi.name}
              </strong>
              <span className="text-xs text-slate-400">
                {marketData.mandi.district}, {marketData.mandi.state}
              </span>
            </div>

            {/* Price Summary */}
            <div className="pt-3 border-t border-slate-800/70">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Price Summary</span>
                <span className="text-[10px] text-slate-400">Unit: ₹ per quintal</span>
              </div>

              {isLive ? (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Minimum</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">
                      ₹{minPrice.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/50">
                    <div className="text-[10px] font-bold text-emerald-400">Modal *</div>
                    <div className="text-sm sm:text-base font-extrabold text-emerald-300 mt-0.5">
                      ₹{modalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Maximum</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">
                      ₹{maxPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ) : isFallback ? (
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                  <div className="font-bold">Modal Baseline: ₹{modalPrice.toLocaleString('en-IN')} / quintal</div>
                  <div className="text-[11px] text-amber-400/80">
                    Notice: These values are not a verified current quote for today.
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300">
                  No verified government record found for this selection/date.
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Primary Action: Download PDF */}
            <button
              type="button"
              id="btn-modal-download-pdf"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>Report Downloaded Successfully</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Download Mandi Price Report (PDF)</span>
                </>
              )}
            </button>

            {/* WhatsApp Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-modal-share-whatsapp"
                onClick={handleOpenWhatsApp}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share to WhatsApp</span>
              </button>

              <button
                type="button"
                id="btn-modal-copy-text"
                onClick={handleCopyWhatsApp}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer border border-slate-700"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* WhatsApp Note */}
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Note: Download the PDF report first, then attach the downloaded file when sending via WhatsApp.
            </p>

            {/* Link to Full Multi-Market Daily Report */}
            {onOpenDailyReport && (
              <button
                type="button"
                id="btn-modal-open-full-daily-report"
                onClick={onOpenDailyReport}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 text-xs font-bold border border-emerald-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>पूर्ण दैनिक बाजार अहवाल मॉड्यूल उघडा (Multi-Market Report) →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
