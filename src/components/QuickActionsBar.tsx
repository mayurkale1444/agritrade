import React from 'react';
import { FileText, ArrowUpDown, Calculator, Info } from 'lucide-react';

interface QuickActionsBarProps {
  onGeneratePdf: () => void;
  onCompareMarkets: () => void;
  onOpenCalculator: () => void;
  onViewDetails: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onGeneratePdf,
  onCompareMarkets,
  onOpenCalculator,
  onViewDetails
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 sm:p-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
        <span>Quick Desk Actions</span>
        <span className="text-[10px] text-slate-500 font-normal">Direct Actions for Traders & Prospects</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* 1. Generate PDF */}
        <button
          type="button"
          id="quick-action-generate-pdf"
          onClick={onGeneratePdf}
          className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all text-left cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Generate PDF</div>
            <div className="text-[10px] text-emerald-400/80 truncate">Daily price report</div>
          </div>
        </button>

        {/* 2. Compare Markets */}
        <button
          type="button"
          id="quick-action-compare-markets"
          onClick={onCompareMarkets}
          className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 transition-all text-left cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-md bg-blue-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Compare Markets</div>
            <div className="text-[10px] text-slate-400 truncate">Cross-mandi quotes</div>
          </div>
        </button>

        {/* 3. Open Calculator */}
        <button
          type="button"
          id="quick-action-open-calculator"
          onClick={onOpenCalculator}
          className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 transition-all text-left cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-md bg-amber-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Open Calculator</div>
            <div className="text-[10px] text-slate-400 truncate">Trade profit & cess</div>
          </div>
        </button>

        {/* 4. View Details */}
        <button
          type="button"
          id="quick-action-view-details"
          onClick={onViewDetails}
          className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 transition-all text-left cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-md bg-purple-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Info className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">View Details</div>
            <div className="text-[10px] text-slate-400 truncate">Audit & diagnostics</div>
          </div>
        </button>
      </div>
    </div>
  );
};
