import React from 'react';
import { MarketData } from '../types';
import {
  FileText,
  Calculator,
  MapPin,
  Calendar,
  Radio,
  ShieldAlert,
  AlertCircle,
  Tag,
  Loader2,
  Share2
} from 'lucide-react';

interface CurrentPriceCardProps {
  data: MarketData;
  isLoading?: boolean;
  onGenerateReport: () => void;
  onGoToCalculator: () => void;
  onOpenSourceModal?: () => void;
}

export const CurrentPriceCard: React.FC<CurrentPriceCardProps> = ({
  data,
  isLoading = false,
  onGenerateReport,
  onGoToCalculator,
  onOpenSourceModal
}) => {
  const isLive = data.isLive && data.dataTypeCategory === 'LIVE VERIFIED DATA';
  const isFallback = data.dataTypeCategory === 'FALLBACK DATA' || data.dataTypeCategory === 'DEMO DATA';
  const isUnavailable = !isLive && !isFallback;

  const modalPrice = data.modalPrice || data.currentPrice;
  const minPrice = data.minPrice || data.currentPrice;
  const maxPrice = data.maxPrice || data.currentPrice;

  const varietyDisplay = data.mandi.variety && data.mandi.variety !== 'Other'
    ? data.mandi.variety
    : (data.mandi.variety || 'Standard / Local');

  const gradeDisplay = data.mandi.grade || 'FAQ (Fair Average Quality)';

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 animate-pulse">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              QUERYING AGMARKNET DATABASE...
            </span>
          </div>
          <span className="text-xs text-slate-500">Clearing previous quote</span>
        </div>
        <div className="space-y-2 py-6 text-center">
          <div className="text-sm font-semibold text-slate-200">
            Fetching latest government bulletin for {data.mandi.name}...
          </div>
          <div className="text-xs text-slate-400">
            Applying strict market, district, commodity and arrival date verification.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* 1. TOP HEADER: Status badge + Arrival date */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        {/* Status Badge */}
        {isLive ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>LIVE</span>
          </div>
        ) : isFallback ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>FALLBACK</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>UNAVAILABLE</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Arrival: <strong className="text-slate-200">{data.arrivalDate || 'Today'}</strong></span>
        </div>
      </div>

      {/* 2. COMMODITY & MANDI INFO */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              {data.commodity.category} Commodity
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {data.commodity.name}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Variety / Grade</span>
            <span className="text-xs font-semibold text-slate-200">
              {varietyDisplay}
            </span>
          </div>
        </div>

        {/* Market details */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 pt-1">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-white">{data.mandi.name}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{data.mandi.district}, {data.mandi.state}</span>
          {data.mandi.benchmark && (
            <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Hub
            </span>
          )}
        </div>
      </div>

      {/* 3. PRICE SECTION */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-3">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Today's Auction Rates</span>
          <span className="text-xs font-semibold text-slate-300">Unit: ₹ per quintal (100 kg)</span>
        </div>

        {isLive ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
            {/* Minimum Price */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center sm:text-left">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Minimum Price</div>
              <div className="text-base sm:text-lg font-bold text-slate-200 font-mono mt-0.5">
                ₹{minPrice.toLocaleString('en-IN')}
                <span className="text-[10px] text-slate-400 font-normal"> /qtl</span>
              </div>
            </div>

            {/* Modal Price (Prominent Primary Rate) */}
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border-2 border-emerald-500/60 shadow-lg shadow-emerald-950/60 text-center sm:text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Modal Price (Primary) *
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-500/20 text-emerald-300">
                  LIVE QUOTE
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono tracking-tight mt-0.5">
                ₹{modalPrice.toLocaleString('en-IN')}
                <span className="text-xs font-semibold text-emerald-400/90 ml-1">/quintal</span>
              </div>
            </div>

            {/* Maximum Price */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center sm:text-left">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Maximum Price</div>
              <div className="text-base sm:text-lg font-bold text-slate-200 font-mono mt-0.5">
                ₹{maxPrice.toLocaleString('en-IN')}
                <span className="text-[10px] text-slate-400 font-normal"> /qtl</span>
              </div>
            </div>
          </div>
        ) : isFallback ? (
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Modal Baseline Rate
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300">
                FALLBACK
              </span>
            </div>
            <div className="text-2xl font-extrabold text-amber-300 font-mono">
              ₹{modalPrice.toLocaleString('en-IN')} <span className="text-xs font-normal text-amber-400">/quintal</span>
            </div>
            <p className="text-[11px] text-amber-400/80">
              Notice: These values are reference baseline rates, not a verified current quote for today.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center space-y-1">
            <div className="text-sm font-bold text-rose-300">
              No verified government record found for this selection/date.
            </div>
            <p className="text-xs text-rose-400/80">
              Official live auction quote is not currently reported in AGMARKNET today for this market.
            </p>
          </div>
        )}
      </div>

      {/* 4. TWO PRIMARY ACTION BUTTONS (As strictly required in Section 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {/* Action 1: Generate Mandi Price Report */}
        <button
          type="button"
          id="btn-generate-mandi-report"
          onClick={onGenerateReport}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>Generate Mandi Price Report</span>
        </button>

        {/* Action 2: Calculate Trading Margin */}
        <button
          type="button"
          id="btn-calculate-margin"
          onClick={onGoToCalculator}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-100 font-bold text-xs sm:text-sm border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Calculate Trading Margin</span>
        </button>
      </div>
    </div>
  );
};
