import React from 'react';
import { AISummary, DataTypeCategory } from '../types';
import { formatINR } from '../services/mandiDataService';
import { Sparkles, RefreshCw, Layers, Target, Compass, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AIMarketSummaryProps {
  summary: AISummary;
  commodityName: string;
  mandiName: string;
  isLive?: boolean;
  hasZeroSpread?: boolean;
  dataTypeCategory?: DataTypeCategory;
  onRefreshAI: () => void;
  isAnalyzing: boolean;
}

export const AIMarketSummary: React.FC<AIMarketSummaryProps> = ({
  summary,
  commodityName,
  mandiName,
  isLive = false,
  hasZeroSpread = false,
  dataTypeCategory = 'FALLBACK DATA',
  onRefreshAI,
  isAnalyzing
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Market Intelligence Summary
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                isLive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {isLive ? `${summary.confidenceScore}% Verified Confidence` : 'Calibrated Baseline Confidence'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in verified APMC bulletin records and arrival data
            </p>
          </div>
        </div>

        {/* Refresh Analysis button */}
        <button
          type="button"
          onClick={onRefreshAI}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh market condition analysis"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isAnalyzing ? 'Analyzing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Zero spread warning if applicable */}
      {hasZeroSpread && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-2.5 text-xs text-amber-200 flex items-start gap-2 relative z-10">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Caution: Single-Rate Auction Lot.</span>{' '}
            <span>Min = Modal = Max in official filing. Price depth analysis is constrained to the reported flat rate.</span>
          </div>
        </div>
      )}

      {/* Fallback data warning if applicable */}
      {!isLive && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-200/90 flex items-start gap-2 relative z-10">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Integrity Constraint:</span>{' '}
            <span>No live quote filed for {mandiName} today. Analysis relies solely on calibrated historical reference rates without fabricating arrival shocks.</span>
          </div>
        </div>
      )}

      {/* Main AI Headline & Narrative */}
      <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-700/60 space-y-2 relative z-10">
        <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 leading-snug">
          <span className={`w-2 h-2 rounded-full shrink-0 ${isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          {summary.headline}
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {summary.analysis}
        </p>
      </div>

      {/* Key Market Drivers */}
      <div className="space-y-2 relative z-10">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Core Drivers Influencing Rates</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {summary.keyDrivers.map((driver, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{driver}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trader Support & Resistance Levels Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 relative z-10">
        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Target className="w-3 h-3 text-emerald-400" /> Support Floor
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono mt-0.5">
            {formatINR(summary.supportPrice)}
          </div>
          <div className="text-[10px] text-slate-500">Buying interest cushion</div>
        </div>

        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Target className="w-3 h-3 text-rose-400" /> Resistance Ceiling
          </div>
          <div className="text-sm sm:text-base font-bold text-rose-400 font-mono mt-0.5">
            {formatINR(summary.resistancePrice)}
          </div>
          <div className="text-[10px] text-slate-500">Selling pressure expected</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-400" /> Mandi Arrival Trend
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5 truncate">
            {summary.arrivalsSummary}
          </div>
          <div className="text-[10px] text-slate-500">Supply gate volume</div>
        </div>
      </div>

      {/* Market Status & Guidance (Requirements 5 & 6) */}
      <div className="rounded-xl p-3 text-xs flex items-start gap-2.5 relative z-10 border bg-slate-900/80 border-slate-700/60 text-slate-200">
        <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider shrink-0 mt-0.5 bg-slate-700 text-slate-200">
          Market Status
        </span>
        <p className="leading-snug text-slate-300">
          {summary.traderAdvice || 'Current government quote verified. Historical trend unavailable.'}
        </p>
      </div>
    </div>
  );
};
