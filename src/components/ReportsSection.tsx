import React, { useState } from 'react';
import { MarketData } from '../types';
import {
  generateMandiPdf,
  downloadMandiPdf,
  generateWhatsAppText,
  getWhatsAppUrl,
  PdfReportOptions
} from '../services/pdfReportGenerator';
import {
  FileText,
  Download,
  Share2,
  Eye,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Calendar,
  MapPin,
  Tag,
  Info,
  HelpCircle,
  Check
} from 'lucide-react';

interface ReportsSectionProps {
  marketData: MarketData;
  onNavigateToMarkets?: () => void;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  marketData,
  onNavigateToMarkets
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const isLive = marketData.isLive && marketData.dataTypeCategory === 'LIVE VERIFIED DATA';
  const isDemo = marketData.dataTypeCategory === 'DEMO DATA';

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
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header with Breadcrumb/Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Reports Desk
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Prospect & FPO Dispatch</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
              <FileText className="w-5 h-5 text-emerald-400" />
              Daily Mandi Price Report Builder
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 self-start sm:self-auto">
            <span>Report Type:</span>
            <strong className="text-white">Single Mandi Daily Report</strong>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Generate an official, professional A4 PDF price report from today’s verified AGMARKNET mandi arrivals. Share with commission agents, FPO procurement teams, and commodity trade prospects via WhatsApp.
        </p>
      </div>

      {/* 2. Active Report Parameters Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Active Report Parameters</span>
          </div>

          {onNavigateToMarkets && (
            <button
              type="button"
              onClick={onNavigateToMarkets}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Change Selection in Markets →
            </button>
          )}
        </div>

        {/* Selected Data Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Commodity</span>
            <span className="font-bold text-white text-sm">{marketData.commodity.name}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Target APMC Mandi</span>
            <span className="font-bold text-white text-sm truncate block" title={marketData.mandi.name}>
              {marketData.mandi.name}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">District & State</span>
            <span className="font-medium text-slate-200 block truncate">
              {marketData.mandi.district}, {marketData.mandi.state}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Arrival Bulletin Date</span>
            <span className="font-mono font-bold text-slate-200 block">
              {marketData.arrivalDate || 'Today'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Official Variety & Grade</span>
            <span className="font-medium text-emerald-300 block">
              {variety} ({grade})
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Modal Price (Benchmark)</span>
            <span className="font-mono font-bold text-emerald-400 text-sm block">
              ₹{modalPrice.toLocaleString('en-IN')} / quintal
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Government Feed Status</span>
              {isLive ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <Radio className="w-3 h-3 animate-pulse" />
                  LIVE VERIFIED
                </span>
              ) : isDemo ? (
                <span className="inline-flex items-center gap-1 font-bold text-purple-400">
                  <ShieldCheck className="w-3 h-3" />
                  DEMO DATA
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                  <ShieldAlert className="w-3 h-3" />
                  FALLBACK DATA
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-right">
              Single Mandi Report
            </div>
          </div>
        </div>

        {/* 3. Action Buttons Row: Preview, Generate/Download PDF */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="btn-preview-report"
            onClick={() => setShowPreview(!showPreview)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span>{showPreview ? 'Hide Report Preview' : 'Preview Report'}</span>
          </button>

          <button
            type="button"
            id="btn-download-pdf"
            onClick={handleDownload}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Generate & Download PDF</span>
          </button>

          {downloadSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-fade-in">
              <Check className="w-4 h-4" />
              PDF downloaded successfully!
            </span>
          )}
        </div>
      </div>

      {/* 4. PDF Preview Card (if toggled) */}
      {showPreview && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Live A4 Document Preview
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download A4 File
            </button>
          </div>

          {/* Styled Document Box mimicking A4 Sheet */}
          <div className="bg-white text-slate-900 rounded-xl p-5 sm:p-7 shadow-inner space-y-4 max-w-2xl mx-auto border border-slate-300 text-xs font-sans">
            {/* Sheet Header */}
            <div className="border-b-2 border-emerald-600 pb-3 flex justify-between items-start">
              <div>
                <h1 className="text-base font-bold text-slate-900">AgriTrade</h1>
                <p className="text-[10px] text-slate-600">Know Before You Sell. • Agricultural Mandi Intelligence</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 block">DAILY MANDI PRICE REPORT</span>
                <span className="text-[9px] text-slate-500">Official Government Feed</span>
              </div>
            </div>

            {/* Verified vs Fallback Status on Document */}
            {isLive ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded p-2 text-[10px] text-emerald-800 font-semibold">
                STATUS: LIVE VERIFIED DATA — OFFICIAL AGMARKNET RECORD ({marketData.arrivalDate})
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-300 rounded p-2 text-[10px] text-amber-800 font-semibold">
                STATUS: FALLBACK DATA — No verified government record found for this selection/date.
              </div>
            )}

            {/* Location & Commodity Overview */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Market & Location</span>
                <strong className="text-sm text-slate-900 block">{marketData.mandi.name}</strong>
                <span className="text-[10px] text-slate-600">{marketData.mandi.district}, {marketData.mandi.state}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Commodity & Grade</span>
                <strong className="text-sm text-slate-900 block">{marketData.commodity.name}</strong>
                <span className="text-[10px] text-slate-600">Variety: {variety} • Grade: {grade}</span>
              </div>
            </div>

            {/* Rates Table */}
            <div>
              <div className="text-[10px] font-bold text-slate-700 uppercase mb-1">
                Daily Auction Rates (₹ / Quintal)
              </div>
              <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[10px] text-slate-700 font-bold">
                    <th className="p-2 border-r border-slate-300">Rate Metric</th>
                    <th className="p-2 border-r border-slate-300">₹ / Quintal</th>
                    <th className="p-2 border-r border-slate-300">₹ / Metric Ton</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-300">Minimum Price</td>
                    <td className="p-2 border-r border-slate-300 font-mono font-semibold">₹{minPrice.toLocaleString('en-IN')}</td>
                    <td className="p-2 border-r border-slate-300 font-mono">₹{(minPrice * 10).toLocaleString('en-IN')}</td>
                    <td className="p-2 text-slate-500 text-[10px]">{isLive ? 'Official Minimum' : 'Baseline'}</td>
                  </tr>
                  <tr className="bg-emerald-50/70 border-b border-emerald-200 font-bold">
                    <td className="p-2 border-r border-slate-300 text-emerald-900">Modal Price (Benchmark) *</td>
                    <td className="p-2 border-r border-slate-300 font-mono text-emerald-800 text-xs">₹{modalPrice.toLocaleString('en-IN')}</td>
                    <td className="p-2 border-r border-slate-300 font-mono text-emerald-800">₹{(modalPrice * 10).toLocaleString('en-IN')}</td>
                    <td className="p-2 text-emerald-700 text-[10px]">{isLive ? 'Official Modal' : 'Baseline'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300">Maximum Price</td>
                    <td className="p-2 border-r border-slate-300 font-mono font-semibold">₹{maxPrice.toLocaleString('en-IN')}</td>
                    <td className="p-2 border-r border-slate-300 font-mono">₹{(maxPrice * 10).toLocaleString('en-IN')}</td>
                    <td className="p-2 text-slate-500 text-[10px]">{isLive ? 'Official Maximum' : 'Baseline'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Source & Disclaimer */}
            <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-500 space-y-1">
              <div>
                <strong>Official Source:</strong> Directorate of Marketing & Inspection (DMI), Ministry of Agriculture, Govt. of India via data.gov.in.
              </div>
              <div>
                <em>Trading note: {isLive ? 'Current government quote verified. Historical trend unavailable.' : 'No verified government record found for this selection/date.'}</em>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. WhatsApp Workflow & Sharing Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              WhatsApp Prospect Sharing Workflow
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            Step-by-Step
          </span>
        </div>

        {/* 6-Step Workflow Guidance Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="font-bold text-slate-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>How to share PDF report with WhatsApp prospects:</span>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
            <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <span>Click <strong>Generate & Download PDF</strong> above to save the A4 report.</span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <span>Click <strong>Open WhatsApp</strong> below to launch WhatsApp with the prepared text.</span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <span>Select the intended trader, FPO buyer, or procurement prospect.</span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
              <span>Click the attachment clip icon (<span className="text-slate-200">📎 Document</span>) in WhatsApp.</span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">5</span>
              <span>Select the downloaded A4 PDF file from your Downloads folder.</span>
            </li>
            <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">6</span>
              <span>Send the message and document together for a verified trading quote!</span>
            </li>
          </ol>

          <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">
            * Note: In accordance with browser and WhatsApp platform security standards, web links cannot automatically attach local computer/phone files without user selection.
          </p>
        </div>

        {/* Prepared WhatsApp Message Preview Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Prepared WhatsApp Message:</span>
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Message Text</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
            {whatsappMessage}
          </pre>
        </div>

        {/* WhatsApp Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            id="link-open-whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Open WhatsApp with Message</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
          </a>

          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4 text-slate-400" />
            <span>{isCopied ? 'Copied!' : 'Copy Text Only'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
