import React, { useState } from 'react';
import { DataTypeCategory, DataQualityIndicator } from '../types';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, RefreshCw, Server, ExternalLink, ShieldCheck, AlertTriangle, Info } from 'lucide-react';

interface DataDisclaimerBannerProps {
  isLive?: boolean;
  dataSource: string;
  dataTypeCategory?: DataTypeCategory;
  dataQuality?: DataQualityIndicator;
  statusMessage?: string;
  arrivalDate: string;
  selectedMarketName?: string;
  sourceMarketName?: string;
  hasZeroSpread?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenDataInfo?: () => void;
  onToggleDemoMode?: () => void;
}

export const DataDisclaimerBanner: React.FC<DataDisclaimerBannerProps> = ({
  isLive = false,
  dataSource,
  dataTypeCategory = 'FALLBACK DATA',
  dataQuality = 'Unavailable',
  statusMessage,
  arrivalDate,
  selectedMarketName,
  sourceMarketName,
  hasZeroSpread = false,
  onRefresh,
  isRefreshing = false,
  onOpenDataInfo,
  onToggleDemoMode
}) => {
  const [expanded, setExpanded] = useState(false);

  // 1. LIVE VERIFIED DATA
  if (dataTypeCategory === 'LIVE VERIFIED DATA' && isLive) {
    return (
      <div className="bg-gradient-to-r from-emerald-950/50 via-emerald-900/25 to-slate-900/70 border border-emerald-500/50 rounded-xl p-3 text-xs text-emerald-200/90 shadow-md space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-emerald-300 tracking-wide text-xs">
                  LIVE VERIFIED DATA
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  Bulletin Date: {arrivalDate}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 rounded border border-emerald-600/40">
                  Exact Mandi Match: {sourceMarketName || selectedMarketName}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                Source: <span className="font-semibold text-emerald-300">{dataSource}</span>. {statusMessage || 'Quotes verified from official daily mandi arrivals.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 hover:text-white px-2 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors disabled:opacity-50 cursor-pointer"
                title="Poll latest mandi auction updates"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 transition-colors cursor-pointer"
            >
              <span>{expanded ? 'Hide Source' : 'Source Info'}</span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {hasZeroSpread && (
          <div className="bg-amber-950/50 border border-amber-500/40 rounded-lg p-2 text-[11px] text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Warning:</strong> APMC reported zero price spread (Min = Modal = Max). Bid spread depth unrecorded.
            </span>
          </div>
        )}

        {expanded && (
          <div className="pt-2.5 border-t border-emerald-500/20 text-slate-300 text-[11px] space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
              <span className="text-emerald-400 font-medium">
                Government of India OGD Catalog UUID: 9ef84268-d588-465a-a308-a864a43d0070
              </span>
              <a
                href="https://data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-mono text-[10px]"
              >
                data.gov.in AGMARKNET Catalog <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-300">
              Auction quotes are published by the Directorate of Marketing & Inspection (DMI), Ministry of Agriculture and Farmers Welfare. Verified records reflect floor (min), ceiling (max), and modal auction bids logged by APMC secretaries.
            </p>
          </div>
        )}
      </div>
    );
  }

  // 2. DEMO DATA (Simulation Mode)
  if (dataTypeCategory === 'DEMO DATA') {
    return (
      <div className="bg-gradient-to-r from-purple-950/50 via-purple-900/20 to-slate-900/70 border border-purple-500/40 rounded-xl p-3 text-xs text-purple-200/90 shadow-md space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-purple-300 tracking-wide text-xs">
                  DEMO DATA (SIMULATION SCENARIO)
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                  Scenario Engine
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80 mt-0.5 leading-relaxed">
                Source: <span className="font-semibold text-purple-300">{dataSource}</span>. Synthetic modeling data active for trader scenario stress-testing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleDemoMode && (
              <button
                type="button"
                onClick={onToggleDemoMode}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors cursor-pointer"
              >
                Switch to Live Feed
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. FALLBACK DATA (Calibrated baseline when live mandi quote is unavailable)
  // Requirement 3: If an exact market match is unavailable, clearly display:
  // "Exact live quote unavailable — showing fallback/demo data" and NEVER label it LIVE DATA.
  return (
    <div className="bg-gradient-to-r from-amber-950/50 via-amber-900/20 to-slate-900/60 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200/90 shadow-sm space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-amber-300 tracking-wide text-xs">
                FALLBACK DATA
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                Calibrated Mandi Baseline
              </span>
            </div>
            <div className="text-amber-300 font-bold text-xs">
              {statusMessage || 'No verified government record found for this selection/date.'}
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              Selected: <strong className="text-white">{selectedMarketName || 'Selected Market'}</strong>. No verified government record found for this selection/date. Baseline values displayed for reference. Trading recommendations are suspended.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 hover:text-white px-2 py-1 rounded bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-colors disabled:opacity-50 cursor-pointer"
              title="Check live AGMARKNET portal now"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Checking...' : 'Check Live'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 transition-colors cursor-pointer"
          >
            <span>{expanded ? 'Hide Info' : 'Source Info'}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pt-2.5 border-t border-amber-500/20 text-slate-300 text-[11px] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <Server className="w-3.5 h-3.5" />
            <span>AGMARKNET / data.gov.in Live Integration Active</span>
          </div>
          <p className="text-slate-300">
            The application queries the official Open Government Data API (<code className="text-emerald-400">data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070</code>). In accordance with strict data integrity rules, quotes from other mandis are NEVER substituted or inferred.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenDataInfo}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-white underline cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> View Official Source Documentation & Key Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
