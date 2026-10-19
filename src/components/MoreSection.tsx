import React, { useState, useEffect } from 'react';
import { MarketData } from '../types';
import { GovRecordInspector } from './GovRecordInspector';
import { PriceChart } from './PriceChart';
import { AIMarketSummary } from './AIMarketSummary';
import {
  SlidersHorizontal,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  BarChart3,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';

interface MoreSectionProps {
  marketData: MarketData;
  isDemoModeActive: boolean;
  onToggleDemoMode: () => void;
  onOpenApiModal?: () => void;
  onManualRefresh?: () => void;
  isLiveSyncing?: boolean;
  onRefreshAI?: () => void;
  isAnalyzing?: boolean;
  customAISummary?: MarketData['aiSummary'] | null;
}

export const MoreSection: React.FC<MoreSectionProps> = ({
  marketData,
  isDemoModeActive,
  onToggleDemoMode,
  onOpenApiModal,
  onManualRefresh,
  isLiveSyncing = false,
  onRefreshAI,
  isAnalyzing = false,
  customAISummary
}) => {
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'unreachable'>('checking');
  const [showAnalysisTools, setShowAnalysisTools] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setHealthStatus('healthy');
        } else {
          setHealthStatus('unreachable');
        }
      })
      .catch(() => {
        setHealthStatus('unreachable');
      });
  }, []);

  const isLive = marketData.isLive && marketData.dataTypeCategory === 'LIVE VERIFIED DATA';
  const currentSummary = customAISummary || marketData.aiSummary;

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Advanced Mandi Data & System Diagnostics
            </h2>
            <p className="text-xs text-slate-400">
              Government source audit, raw record payload, data quality indicators, and API status
            </p>
          </div>
        </div>
      </div>

      {/* 2. Official Source & System Health Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Government Source Audit & API Health</span>
          </div>

          {onManualRefresh && (
            <button
              type="button"
              onClick={onManualRefresh}
              disabled={isLiveSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLiveSyncing ? 'animate-spin' : ''}`} />
              <span>{isLiveSyncing ? 'Syncing...' : 'Poll OGD Server'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* OGD Source */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Official Source Portal</span>
            <div className="font-bold text-white">data.gov.in / AGMARKNET</div>
            <div className="text-[10px] text-slate-400">Directorate of Marketing & Inspection (DMI)</div>
          </div>

          {/* OGD Catalog UUID */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">OGD Catalog Resource ID</span>
            <div className="font-mono text-emerald-400 font-bold text-[11px] truncate">
              9ef84268-d588-465a-a308-a864a43d0070
            </div>
            <div className="text-[10px] text-slate-400">Daily Mandi Wholesale Arrivals</div>
          </div>

          {/* Server Proxy Health */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Backend Proxy Health</span>
            <div className="flex items-center gap-1.5 font-bold">
              {healthStatus === 'healthy' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Proxy Online (200 OK)</span>
                </>
              ) : healthStatus === 'checking' ? (
                <>
                  <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="text-amber-300">Testing Handshake...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-300">Proxy Offline</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Port 3000 • Ingress Active</div>
          </div>
        </div>

        {/* Data Quality & Spread Audit */}
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Auction Data Quality Checks</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Quality Indicator: <strong className="text-emerald-400">{marketData.dataQuality}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="p-2 rounded bg-slate-900/60 flex items-center justify-between">
              <span>Zero Spread Detection (Min = Modal = Max):</span>
              <strong className={marketData.hasZeroSpread ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                {marketData.hasZeroSpread ? 'Flagged (Single Rate)' : 'Normal (Dynamic Range)'}
              </strong>
            </div>

            <div className="p-2 rounded bg-slate-900/60 flex items-center justify-between">
              <span>Data Category:</span>
              <strong className={isLive ? 'text-emerald-400' : 'text-amber-400'}>
                {marketData.dataTypeCategory}
              </strong>
            </div>
          </div>
        </div>

        {/* Demo Simulation Toggle */}
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Demo Scenario Simulation Mode</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Simulates alternative mandi market conditions and historical scenarios for desk evaluation
            </div>
          </div>

          <button
            type="button"
            id="toggle-demo-simulation-mode"
            onClick={onToggleDemoMode}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isDemoModeActive
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isDemoModeActive ? 'Simulation Active (ON)' : 'Simulation Inactive (OFF)'}
          </button>
        </div>

        {/* Modal Link for Full Architecture & Setup */}
        {onOpenApiModal && (
          <div className="pt-1 flex justify-end">
            <button
              type="button"
              onClick={onOpenApiModal}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Full API & Architecture Modal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Raw Government Record Inspector */}
      <GovRecordInspector data={marketData} />

      {/* 4. Optional Collapsible Analysis Tools (Price Chart & AI Summary) for internal research */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Secondary Research & Market Analysis Tools
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowAnalysisTools(!showAnalysisTools)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
          >
            <span>{showAnalysisTools ? 'Hide Tools' : 'Reveal Tools'}</span>
            {showAnalysisTools ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAnalysisTools && (
          <div className="space-y-4 pt-2 border-t border-slate-800">
            {/* Price Chart */}
            <PriceChart
              history7d={marketData.history7d}
              history15d={marketData.history15d}
              history30d={marketData.history30d}
              commodityName={marketData.commodity.name}
              mandiName={marketData.mandi.name}
            />

            {/* AI Summary */}
            <AIMarketSummary
              summary={currentSummary}
              commodityName={marketData.commodity.name}
              mandiName={marketData.mandi.name}
              isLive={marketData.isLive}
              hasZeroSpread={marketData.hasZeroSpread}
              dataTypeCategory={marketData.dataTypeCategory}
              onRefreshAI={onRefreshAI}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}
      </div>
    </div>
  );
};
