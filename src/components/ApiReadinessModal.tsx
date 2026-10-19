import React from 'react';
import { X, Database, CheckCircle2, Server, ArrowRight, ShieldCheck } from 'lucide-react';

interface ApiReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiReadinessModal: React.FC<ApiReadinessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                AgriTrade • Architecture & Data Policy
              </h3>
              <p className="text-xs text-slate-400">
                Official Agricultural Market Information Architecture
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-emerald-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Official Government of India Data Service
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-200/90">
              AgriTrade is connected with official <strong>Open Government Data (OGD) Platform India (data.gov.in)</strong> and <strong>AGMARKNET</strong> (Directorate of Marketing and Inspection, Ministry of Agriculture & Farmers Welfare).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Data Pipeline & Integrity Guarantees
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Official AGMARKNET Catalog:</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Catalog ID: <code className="text-emerald-300">9ef84268-d588-465a-a308-a864a43d0070</code> (Current Daily Price for various commodities in Mandis).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Strict Live Data Transparency:</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    The green <strong>LIVE DATA</strong> badge appears exclusively when verified external auction quotes are returned. If a mandi has not yet posted daily rates or during market off-hours, the system automatically falls back to calibrated baseline data clearly labeled as <strong>DEMO / FALLBACK</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Zero Paid Services / Free OGD Access:</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    100% free and legally compliant with the National Data Sharing and Accessibility Policy (NDSAP). Traders can connect their personal free API key from <code className="text-emerald-400">data.gov.in</code> via server environment variables.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[10px] text-slate-400">
            <div className="text-emerald-400 font-semibold">// Live Proxy Route: /api/mandi-prices</div>
            <div>Query: ?commodity=onion&market=Lasalgaon</div>
            <div>Response: &#123; isLive: true, record: &#123; min_price, max_price, modal_price, variety, arrival_date &#125; &#125;</div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Got it, Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
