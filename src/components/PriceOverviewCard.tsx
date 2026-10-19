import React from 'react';
import { MarketData } from '../types';
import { formatINR } from '../services/mandiDataService';
import { GovRecordInspector } from './GovRecordInspector';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  Tag,
  Calendar,
  Database,
  Building2,
  Info
} from 'lucide-react';

interface PriceOverviewCardProps {
  data: MarketData;
}

export const PriceOverviewCard: React.FC<PriceOverviewCardProps> = ({ data }) => {
  const hasHistoricalChange = Boolean(
    data.hasVerifiedHistoricalData &&
    data.priceChange !== null &&
    data.previousPrice !== null &&
    data.percentageChange !== null
  );
  const isPositive = hasHistoricalChange && (data.priceChange ?? 0) > 0;
  const isNeutral = hasHistoricalChange && (data.priceChange ?? 0) === 0;

  // Trend Styling (Requirement 3: REMOVE or DISABLE Bearish/Bullish/Stable trend unless calculated from verified historical dataset)
  const getTrendBadge = () => {
    if (data.trend === 'Unavailable' || !data.hasVerifiedHistoricalData) {
      return {
        icon: <Minus className="w-4 h-4 text-slate-400" />,
        text: 'Trend: Unavailable',
        badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600'
      };
    }

    switch (data.trend) {
      case 'Bullish':
        return {
          icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
          text: 'Bullish Trend',
          badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        };
      case 'Bearish':
        return {
          icon: <TrendingDown className="w-4 h-4 text-rose-400" />,
          text: 'Bearish Trend',
          badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
        };
      case 'Stable':
      default:
        return {
          icon: <Minus className="w-4 h-4 text-amber-400" />,
          text: 'Stable Trend',
          badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
        };
    }
  };

  // Risk Styling (Requirement 4: Neutral explanation, no invented causal claims)
  const getRiskBadge = () => {
    switch (data.riskLevel) {
      case 'Unassessed':
        return {
          icon: <Info className="w-3.5 h-3.5 text-slate-400" />,
          label: 'Unassessed Risk',
          meterClass: 'bg-slate-700 text-slate-300 border-slate-600 bg-slate-700/30'
        };
      case 'Low':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Low Risk',
          meterClass: 'bg-emerald-500 text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
        };
      case 'Medium':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Medium Risk',
          meterClass: 'bg-amber-500 text-amber-300 border-amber-500/30 bg-amber-500/10'
        };
      case 'High':
      default:
        return {
          icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
          label: 'High Risk',
          meterClass: 'bg-rose-500 text-rose-300 border-rose-500/30 bg-rose-500/10'
        };
    }
  };

  // Trade Signal Styling (Requirement 6: Keep BUY/HOLD/WATCH disabled unless sufficient verified historical evidence exists)
  const getSignalBadge = () => {
    if (!data.hasVerifiedHistoricalData || data.tradeSignal === 'Insufficient Data' || !data.isLive || data.hasZeroSpread) {
      return {
        icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        label: 'TRADE SIGNALS: DISABLED',
        desc: data.signalRationale || 'Trading signals (BUY/HOLD/WATCH) disabled. Multi-day verified historical data is not available.',
        containerClass: 'bg-amber-950/40 border-amber-500/60 text-amber-200'
      };
    }

    switch (data.tradeSignal) {
      case 'Buy':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-300" />,
          label: 'BUY SIGNAL',
          desc: data.signalRationale || 'Favorable risk-reward margin for spot procurement',
          containerClass: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
        };
      case 'Hold':
        return {
          icon: <Clock className="w-4 h-4 text-amber-300" />,
          label: 'HOLD SIGNAL',
          desc: data.signalRationale || 'Retain physical stock; supply consolidation underway',
          containerClass: 'bg-amber-950/30 border-amber-500/50 text-amber-200'
        };
      case 'Watch':
      default:
        return {
          icon: <Eye className="w-4 h-4 text-sky-300" />,
          label: 'WATCH SIGNAL',
          desc: data.signalRationale || 'Observe support thresholds before deploying capital',
          containerClass: 'bg-sky-950/30 border-sky-500/50 text-sky-200'
        };
    }
  };

  // Data Type Category Badge (Requirement 9: Clearly separate LIVE VERIFIED DATA, FALLBACK DATA, DEMO DATA)
  const getDataTypeBadge = () => {
    switch (data.dataTypeCategory) {
      case 'LIVE VERIFIED DATA':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>LIVE VERIFIED DATA</span>
          </div>
        );
      case 'DEMO DATA':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/40 bg-purple-500/15 text-purple-300 text-xs font-semibold">
            <Info className="w-3 h-3 text-purple-400" />
            <span>DEMO DATA (SIMULATION)</span>
          </div>
        );
      case 'FALLBACK DATA':
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>FALLBACK DATA</span>
          </div>
        );
    }
  };

  const trend = getTrendBadge();
  const risk = getRiskBadge();
  const signal = getSignalBadge();

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Bar: Commodity, Mandi Name & Live/Demo Status */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-700/60 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-emerald-400 tracking-wide">
              {data.commodity.name} ({data.commodity.hindiName})
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold text-slate-200">
              {data.mandi.name}
            </span>
            <span className="text-[11px] text-slate-400">
              ({data.mandi.district ? `${data.mandi.district}, ` : ''}{data.mandi.state})
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300 flex-wrap">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Tag className="w-3 h-3 text-emerald-400" />
              Variety: <strong className="text-slate-200">{data.variety}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              Grade: <strong className="text-slate-200">{data.grade || data.rawGovRecord?.grade || 'FAQ'}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3 text-amber-400" />
              Arrival Date: <strong className="text-slate-200 font-mono">{data.arrivalDate}</strong>
            </span>
          </div>
        </div>

        {/* Live vs Demo Badge & Trend */}
        <div className="flex items-center gap-2 flex-wrap">
          {getDataTypeBadge()}

          {/* Trend Indicator */}
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${trend.badgeClass}`}>
            {trend.icon}
            <span>{trend.text}</span>
          </div>
        </div>
      </div>

      {/* Market Match & Integrity Notification Bar (Requirements 1, 2, 3) */}
      {!data.isLive && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-amber-300">
              No verified government record found for this selection/date.
            </div>
            <p className="text-[11px] text-amber-200/90 leading-snug">
              Selected Mandi: <strong className="text-white">{data.mandi.name}</strong> ({data.mandi.district ? `${data.mandi.district}, ` : ''}{data.mandi.state}). No verified government record found for this selection/date. Displaying fallback baseline data.
            </p>
          </div>
        </div>
      )}

      {/* Main Metric Row: Modal Price and Min/Max Auction Spread */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Current Modal Price Block */}
        <div className="sm:col-span-6 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Current Modal Price
            </span>
            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              {data.isLive ? 'Verified AGMARKNET Modal' : 'Calibrated Baseline Rate'}
            </span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              {formatINR(data.currentPrice)}
            </span>
            <span className="text-xs font-medium text-slate-400">
              / quintal (100 kg)
            </span>
          </div>

          {/* Requirement 2 & 5: REMOVE or DISABLE any "previous close", percentage change, historical comparison, or price-change calculation unless it comes from a verified historical government record. If historical data is unavailable, display a neutral message */}
          {hasHistoricalChange && data.priceChange !== null && data.previousPrice !== null && data.percentageChange !== null ? (
            <div className="flex items-center gap-2 pt-0.5">
              <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold font-mono ${
                isPositive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : isNeutral
                  ? 'bg-slate-700 text-slate-300 border border-slate-600'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                ) : isNeutral ? (
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>
                  {isPositive ? '+' : ''}{formatINR(data.priceChange, { decimals: 0 })} ({isPositive ? '+' : ''}{data.percentageChange}%)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                vs verified previous close ({formatINR(data.previousPrice)})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-400">
              <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                {data.isLive
                  ? 'Current government quote verified. Historical trend unavailable.'
                  : 'Historical trend unavailable.'}
              </span>
            </div>
          )}
        </div>

        {/* 3-Tier Price Range: Min Price, Modal Price, Max Price */}
        <div className="sm:col-span-6 bg-slate-900/70 p-3.5 rounded-xl border border-slate-700/50 space-y-2">
          <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span>Daily Mandi Auction Range (₹/qtl)</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
              data.hasZeroSpread
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'text-slate-400 border-slate-800'
            }`}>
              {data.hasZeroSpread ? 'Zero Spread Flagged' : `Spread: ${formatINR(data.maxPrice - data.minPrice)}`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Min Price */}
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Min Price
              </div>
              <div className="text-sm sm:text-base font-bold text-sky-300 font-mono mt-0.5">
                {formatINR(data.minPrice)}
              </div>
              <div className="text-[9px] text-slate-400">Floor bid</div>
            </div>

            {/* Modal Price */}
            <div className={`p-2 rounded-lg border ${
              data.hasZeroSpread
                ? 'bg-amber-950/30 border-amber-500/40'
                : 'bg-emerald-950/30 border-emerald-500/30'
            }`}>
              <div className={`text-[10px] uppercase font-bold ${
                data.hasZeroSpread ? 'text-amber-300' : 'text-emerald-300'
              }`}>
                Modal Price
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono mt-0.5">
                {formatINR(data.modalPrice)}
              </div>
              <div className={`text-[9px] ${
                data.hasZeroSpread ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {data.hasZeroSpread ? 'Flat Quote' : 'Most traded'}
              </div>
            </div>

            {/* Max Price */}
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Max Price
              </div>
              <div className="text-sm sm:text-base font-bold text-amber-300 font-mono mt-0.5">
                {formatINR(data.maxPrice)}
              </div>
              <div className="text-[9px] text-slate-400">Ceiling bid</div>
            </div>
          </div>

          {/* Zero spread banner inside pricing container if active */}
          {data.hasZeroSpread && (
            <div className="text-[10px] text-amber-300/90 bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Min = Modal = Max = {formatINR(data.modalPrice)}/qtl. Record flagged for zero price spread.</span>
            </div>
          )}

          {/* Mandi Arrivals Volume (Requirement 8: Never manufacture arrival quantities) */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800/80">
            <span>Reported Arrivals:</span>
            <span className="font-medium text-slate-300">
              {data.isLive ? (
                <span className="text-slate-300">Not reported in daily price bulletin <span className="text-[10px] text-emerald-400/90">(Auction bids recorded)</span></span>
              ) : (
                <span className="text-slate-400">Unrecorded <span className="text-[10px] text-amber-400/90">(No bulletin filed today)</span></span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Signal & Risk Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Trade Signal Indicator (Requirement 7) */}
        <div className={`border rounded-xl p-3 flex items-start gap-3 ${signal.containerClass}`}>
          <div className="mt-0.5 shrink-0">{signal.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide">
                {signal.label}
              </span>
              <span className="text-[10px] opacity-75 font-mono">
                Market Indicator
              </span>
            </div>
            <p className="text-xs mt-1 leading-snug text-slate-200 font-medium">
              {signal.desc}
            </p>
          </div>
        </div>

        {/* Risk Level Indicator */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{risk.icon}</div>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Risk Level:</span>
                <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold border ${risk.meterClass}`}>
                  {data.riskLevel.toUpperCase()}
                </span>
              </span>
              {/* Visual 3-step meter */}
              <div className="flex items-center gap-1">
                <div className={`w-3.5 h-1.5 rounded-full ${
                  data.riskLevel === 'Low' || data.riskLevel === 'Medium' || data.riskLevel === 'High' ? 'bg-emerald-500' : 'bg-slate-700'
                }`} />
                <div className={`w-3.5 h-1.5 rounded-full ${
                  data.riskLevel === 'Medium' || data.riskLevel === 'High' ? 'bg-amber-500' : 'bg-slate-700'
                }`} />
                <div className={`w-3.5 h-1.5 rounded-full ${
                  data.riskLevel === 'High' ? 'bg-rose-500' : 'bg-slate-700'
                }`} />
              </div>
            </div>
            <p className="text-xs mt-1 text-slate-400 leading-snug">
              {data.riskExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* Official AGMARKNET Record Inspector (Requirement 5) */}
      <GovRecordInspector data={data} />

      {/* Data Source & Timestamp Verification Bar */}
      <div className="pt-2 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            Data Source: <strong className={data.isLive ? 'text-emerald-300' : 'text-amber-300'}>{data.dataSource}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Last Updated: <strong className="text-slate-300 font-mono">{data.lastUpdated}</strong></span>
        </div>
      </div>
    </div>
  );
};

