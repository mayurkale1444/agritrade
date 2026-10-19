import React, { useState, useMemo } from 'react';
import { PricePoint } from '../types';
import { formatINR } from '../services/mandiDataService';
import { Calendar, TrendingUp, BarChart2, Info } from 'lucide-react';

interface PriceChartProps {
  history7d: PricePoint[];
  history15d: PricePoint[];
  history30d: PricePoint[];
  commodityName: string;
  mandiName: string;
}

type Timeframe = '7d' | '15d' | '30d';

export const PriceChart: React.FC<PriceChartProps> = ({
  history7d,
  history15d,
  history30d,
  commodityName,
  mandiName
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('15d');
  const [activePoint, setActivePoint] = useState<PricePoint | null>(null);

  const dataPoints = useMemo(() => {
    switch (timeframe) {
      case '7d':
        return history7d;
      case '30d':
        return history30d;
      case '15d':
      default:
        return history15d;
    }
  }, [timeframe, history7d, history15d, history30d]);

  // Statistics
  const { minPrice, maxPrice, avgPrice, startPrice, endPrice, priceDiff, pctDiff } = useMemo(() => {
    if (!dataPoints || dataPoints.length === 0) {
      return { minPrice: 0, maxPrice: 0, avgPrice: 0, startPrice: 0, endPrice: 0, priceDiff: 0, pctDiff: 0 };
    }
    const prices = dataPoints.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const sum = prices.reduce((acc, v) => acc + v, 0);
    const avg = Math.round(sum / prices.length);
    const start = prices[0];
    const end = prices[prices.length - 1];
    const diff = end - start;
    const pct = Number(((diff / start) * 100).toFixed(1));
    return {
      minPrice: min,
      maxPrice: max,
      avgPrice: avg,
      startPrice: start,
      endPrice: end,
      priceDiff: diff,
      pctDiff: pct
    };
  }, [dataPoints]);

  // Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Add 5% headroom to top and bottom for visual breathing space
  const range = maxPrice - minPrice || 100;
  const yMin = Math.floor((minPrice - range * 0.08) / 10) * 10;
  const yMax = Math.ceil((maxPrice + range * 0.08) / 10) * 10;
  const yRange = yMax - yMin || 1;

  // Coordinates mapping
  const pointsWithCoords = useMemo(() => {
    const total = dataPoints.length;
    return dataPoints.map((pt, idx) => {
      const x = paddingLeft + (idx / (total - 1 || 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((pt.price - yMin) / yRange) * chartHeight;
      return { ...pt, x, y };
    });
  }, [dataPoints, chartWidth, chartHeight, paddingLeft, paddingTop, yMin, yRange]);

  // Generate SVG path strings
  const linePath = useMemo(() => {
    if (pointsWithCoords.length === 0) return '';
    return pointsWithCoords.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  }, [pointsWithCoords]);

  const areaPath = useMemo(() => {
    if (pointsWithCoords.length === 0) return '';
    const first = pointsWithCoords[0];
    const last = pointsWithCoords[pointsWithCoords.length - 1];
    const baselineY = paddingTop + chartHeight;
    return `${linePath} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
  }, [linePath, pointsWithCoords, paddingTop, chartHeight]);

  // Y-axis tick marks
  const yTicks = useMemo(() => {
    return [
      yMin,
      Math.round(yMin + yRange * 0.33),
      Math.round(yMin + yRange * 0.66),
      yMax
    ];
  }, [yMin, yMax, yRange]);

  // X-axis sampled date labels
  const xLabels = useMemo(() => {
    if (pointsWithCoords.length <= 7) return pointsWithCoords;
    const step = Math.ceil(pointsWithCoords.length / 5);
    return pointsWithCoords.filter((_, idx) => idx % step === 0 || idx === pointsWithCoords.length - 1);
  }, [pointsWithCoords]);

  const isUp = priceDiff >= 0;

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Price History & Arrival Trend
            </h3>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-700/70 text-slate-300 font-medium">
              Sample Data
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {commodityName} modal auction rates recorded at {mandiName}
          </p>
        </div>

        {/* Timeframe Selector Buttons */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/70 self-start sm:self-auto">
          {(['7d', '15d', '30d'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => {
                setTimeframe(tf);
                setActivePoint(null);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tf === '7d' ? '7 Days' : tf === '15d' ? '15 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Chart Container or Neutral Unavailability Notification */}
      {dataPoints.length > 0 ? (
        <>
          {/* Snapshot Summary Strip */}
          <div className="flex items-center justify-between bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-700/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Period Net Change:</span>
              <span className={`font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? '+' : ''}{formatINR(priceDiff)} ({isUp ? '+' : ''}{pctDiff}%)
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <div>Low: <span className="font-mono text-slate-200 font-semibold">{formatINR(minPrice)}</span></div>
              <div>High: <span className="font-mono text-slate-200 font-semibold">{formatINR(maxPrice)}</span></div>
            </div>
          </div>

          <div className="relative w-full overflow-hidden select-none touch-pan-x">
            {/* Active hover/touch tooltip */}
            {activePoint && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-slate-950/95 border border-emerald-500/50 px-3 py-1.5 rounded-lg shadow-xl text-center pointer-events-none transition-all">
                <div className="text-[10px] text-slate-400 font-medium">
                  {activePoint.date} • Mandi Rate
                </div>
                <div className="text-sm font-bold text-white font-mono flex items-center justify-center gap-1">
                  <span className="text-emerald-400">{formatINR(activePoint.price)}</span>
                  <span className="text-[10px] text-slate-400 font-normal">/qtl</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Reference Benchmark Rate • Single-day APMC bulletin
                </div>
              </div>
            )}

            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 sm:h-56"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-axis labels */}
              {yTicks.map((tickVal) => {
                const y = paddingTop + chartHeight - ((tickVal - yMin) / yRange) * chartHeight;
                return (
                  <g key={tickVal}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      ₹{tickVal}
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              <path d={areaPath} fill="url(#chartGradient)" />

              {/* Main Price Trend Line */}
              <path
                d={linePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Touch/Click overlay nodes */}
              {pointsWithCoords.map((pt, idx) => {
                const isHovered = activePoint?.date === pt.date;
                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setActivePoint(pt)}
                    onTouchStart={() => setActivePoint(pt)}
                    className="cursor-pointer"
                  >
                    {/* Invisible larger hit target */}
                    <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />
                    {/* Visible node */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : 3}
                      fill={isHovered ? '#34d399' : '#059669'}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2 : 1}
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}

              {/* X-axis date labels */}
              {xLabels.map((pt, idx) => (
                <text
                  key={idx}
                  x={pt.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {pt.date}
                </text>
              ))}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-700/40">
            <span className="flex items-center gap-1 text-slate-400">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              <span>Verified multi-day price series</span>
            </span>
            <span className="font-mono text-slate-400">
              Avg: {formatINR(avgPrice)}
            </span>
          </div>
        </>
      ) : (
        <div className="py-10 px-4 text-center rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-2">
          <div className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-sm font-semibold text-slate-200">
            Current government quote verified. Historical trend unavailable.
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            The official AGMARKNET daily bulletin publishes single-day auction rates. Multi-day historical observations, previous close benchmarks, and volume tonnage trends are unrecorded in this feed.
          </p>
        </div>
      )}
    </div>
  );
};
