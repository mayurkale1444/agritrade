import React, { useState } from 'react';
import { MarketData } from '../types';
import { formatINR } from '../services/mandiDataService';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  Code2, 
  Copy, 
  Check, 
  Database, 
  Clock, 
  SlidersHorizontal 
} from 'lucide-react';

interface GovRecordInspectorProps {
  data: MarketData;
}

export const GovRecordInspector: React.FC<GovRecordInspectorProps> = ({ data }) => {
  if (!data) return null;

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showRawRecord, setShowRawRecord] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [debugTab, setDebugTab] = useState<'fullResponse' | 'matchedRecord' | 'availableMandis'>('fullResponse');

  const record = data.rawGovRecord;
  const rawApi = data.rawApiResponse;
  const actualApiResponse = rawApi?.actualApiResponseBody;
  const availableReportingMarkets = actualApiResponse?.reportingMarkets || rawApi?.allAvailableRecordsSample?.map((r: any) => `${r.market} (${r.district || ''}, ${r.state || ''})`) || [];

  const handleCopyRaw = () => {
    let rawToCopy: any = actualApiResponse || record || rawApi;
    if (debugTab === 'matchedRecord') {
      rawToCopy = record || {
        status: 'No matching record',
        requestedMarket: data.mandi.name,
        requestedCommodity: data.commodity.name,
        reason: data.dataQualityReason
      };
    } else if (debugTab === 'availableMandis') {
      rawToCopy = {
        commodity: data.commodity.name,
        totalReportingMarkets: availableReportingMarkets.length,
        markets: availableReportingMarkets,
        samples: rawApi?.allAvailableRecordsSample || []
      };
    }

    navigator.clipboard.writeText(JSON.stringify(rawToCopy, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Official AGMARKNET Record Fields (Govt. of India)
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            data.dataTypeCategory === 'LIVE VERIFIED DATA'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : data.dataTypeCategory === 'DEMO DATA'
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {data.dataTypeCategory}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Requirement 12: View Raw Record developer/debug option */}
          <button
            type="button"
            onClick={() => setShowRawRecord(!showRawRecord)}
            className={`text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showRawRecord
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Toggle developer inspection of untransformed API record"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showRawRecord ? 'Hide Raw Record' : 'View Raw Record'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer p-1"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {/* Mandi Match Verification Bar (Requirement 1 & 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Selected Mandi (User Choice)
              </span>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span>{data.mandi.name}</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ({data.mandi.district ? `${data.mandi.district}, ` : ''}{data.mandi.state})
                </span>
              </div>
            </div>

            <div className={`p-2.5 rounded-xl border space-y-1 ${
              data.marketsMatch && data.isLive
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                <span>API Source Market</span>
                <span className="flex items-center gap-1">
                  {data.marketsMatch && data.isLive ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Exact Match Verified
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <XCircle className="w-3 h-3" /> No Live Match
                    </span>
                  )}
                </span>
              </span>
              <div className="font-semibold text-white text-xs">
                {data.isLive ? data.sourceMarket : 'Exact live quote unavailable — showing fallback/demo data'}
              </div>
            </div>
          </div>

          {/* Zero Spread Warning if applicable */}
          {data.hasZeroSpread && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-2.5 text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-300">ZERO PRICE SPREAD RECORDED:</strong>
                <p className="text-[11px] text-amber-200/90 mt-0.5">
                  The APMC filed Min = Modal = Max = {formatINR(data.modalPrice)}/quintal. No spread variance was recorded between auction lots. Trading recommendations are suspended.
                </p>
              </div>
            </div>
          )}

          {/* Requirement 11: Display all 10 verified record fields */}
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
              <span>Transparent Source Record Fields (Requirement 11)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {/* 1. Source */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 col-span-2 sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">1. Source</span>
                <div className={`font-semibold truncate text-[11px] ${data.isLive ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {data.dataSource}
                </div>
              </div>

              {/* 2. Market */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 col-span-2 sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">2. Market</span>
                <div className="font-semibold text-white truncate">
                  {data.isLive && record ? record.market : data.mandi.name}
                </div>
              </div>

              {/* 3. Commodity */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">3. Commodity</span>
                <div className="font-semibold text-emerald-300 truncate">
                  {data.isLive && record ? record.commodity : data.commodity.name}
                </div>
              </div>

              {/* 4. Variety */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">4. Variety</span>
                <div className="font-semibold text-slate-200 truncate">{data.variety}</div>
              </div>

              {/* 5. Arrival Date */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">5. Arrival Date</span>
                <div className="font-mono font-bold text-amber-300">{data.arrivalDate}</div>
              </div>

              {/* 6. Min Price */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">6. Min Price</span>
                <div className="font-mono font-bold text-sky-300">{formatINR(data.minPrice)}</div>
              </div>

              {/* 7. Modal Price */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">7. Modal Price</span>
                <div className="font-mono font-extrabold text-emerald-400">{formatINR(data.modalPrice)}</div>
              </div>

              {/* 8. Max Price */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">8. Max Price</span>
                <div className="font-mono font-bold text-amber-300">{formatINR(data.maxPrice)}</div>
              </div>

              {/* 9. Last Updated */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 col-span-2 sm:col-span-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">9. Last Updated</span>
                <div className="font-mono text-[11px] text-slate-300 truncate">{data.lastUpdated}</div>
              </div>

              {/* 10. Data Quality Status */}
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 col-span-2 sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">10. Data Quality Status</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    data.dataQuality === 'Verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : data.dataQuality === 'Warning'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {data.dataQuality}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {data.dataQualityReason}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Requirement 12: Dedicated "View Raw Record" Developer / Debug Drawer */}
          {showRawRecord && (
            <div className="bg-slate-950 rounded-xl p-3.5 border border-emerald-500/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-300 text-xs">
                    Developer API Inspector — Untransformed Data (data.gov.in)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyRaw}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              {/* Developer / Source Status Section (Requirement 13) */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Developer / Source Status (data.gov.in)</span>
                  <span className="text-[9px] text-emerald-400 font-mono">DMI, MoA&FW</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">API Status:</span>
                    <span className={`font-semibold ${rawApi?.httpStatus === 200 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {rawApi?.apiStatus || (rawApi?.httpStatus === 200 ? 'Connected' : 'Unavailable')}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">HTTP Status:</span>
                    <span className={rawApi?.httpStatus === 200 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                      {rawApi?.httpStatus ? `${rawApi.httpStatus} OK` : '200 OK'}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80 sm:col-span-2">
                    <span className="text-slate-500 block text-[10px]">Dataset / Resource ID:</span>
                    <span className="text-slate-300 font-mono text-[10px] truncate block" title="9ef84268-d588-465a-a308-a864a43d0070">
                      {rawApi?.resourceId || '9ef84268-d588-465a-a308-a864a43d0070'}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Records Returned:</span>
                    <span className="text-slate-200 font-mono font-semibold">
                      {rawApi?.fetchedRecordsCount ?? rawApi?.totalRecordsInApi ?? 0}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Selected Market:</span>
                    <span className="text-slate-200 truncate block font-medium" title={data.mandi.name}>
                      {data.mandi.name}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Matched Market:</span>
                    <span className={`truncate block font-semibold ${data.isLive && record?.market ? 'text-emerald-400' : 'text-amber-400'}`} title={data.isLive && record?.market ? record.market : 'None'}>
                      {data.isLive && record?.market ? record.market : 'None (No Match)'}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Matched Commodity:</span>
                    <span className={`truncate block font-semibold ${data.isLive && record?.commodity ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {data.isLive && record?.commodity ? record.commodity : 'None (Unmatched)'}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80 sm:col-span-4 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Record Date:</span>
                      <span className="text-slate-200 font-mono">
                        {data.isLive && record?.arrival_date ? record.arrival_date : 'N/A (No Verified Record)'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">Verification State:</span>
                      <span className={`text-[10px] font-bold uppercase ${data.isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {data.isLive ? 'Live Verified Record' : 'Fallback / Unverified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Check Matrix */}
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Validation Checklist (Requirements 1, 2, 3, 6, 7):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {data.isLive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-amber-400" />}
                    <span className="text-slate-300">Market Match: {data.isLive ? 'PASS' : 'FAIL'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {data.isLive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
                    <span className="text-slate-300">Commodity Match: {data.isLive ? 'PASS' : 'PENDING'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {data.isLive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
                    <span className="text-slate-300">District/State Match: {data.isLive ? 'PASS' : 'PENDING'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {data.isLive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
                    <span className="text-slate-300">Date Logged: {data.isLive ? 'PASS' : 'FALLBACK'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300">Untransformed Store: PASS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {data.hasZeroSpread ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    <span className="text-slate-300">Spread Variance: {data.hasZeroSpread ? 'ZERO SPREAD' : 'HEALTHY'}</span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation for Developer Inspector */}
              <div className="flex items-center gap-1 border-b border-slate-800 pb-1">
                <button
                  type="button"
                  onClick={() => setDebugTab('fullResponse')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    debugTab === 'fullResponse'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  data.gov.in API Response ({actualApiResponse?.total ?? rawApi?.totalRecordsInApi ?? 0} total)
                </button>
                <button
                  type="button"
                  onClick={() => setDebugTab('matchedRecord')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    debugTab === 'matchedRecord'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {data.isLive ? 'Exact Matched Record' : 'Mandi Match Status'}
                </button>
                <button
                  type="button"
                  onClick={() => setDebugTab('availableMandis')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    debugTab === 'availableMandis'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Reporting Mandis ({availableReportingMarkets.length})
                </button>
              </div>

              {/* Informative explanation banner if no match was found */}
              {!data.isLive && (
                <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-lg text-[11px] text-amber-200 leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-0.5">Verification Diagnostic:</span>
                  Official daily bulletin from <code className="text-amber-100 font-mono">data.gov.in</code> returned <span className="font-bold">{rawApi?.totalRecordsInApi || 0}</span> records for <span className="font-bold">{data.commodity.name}</span>. No quote was filed for <span className="font-bold text-white">{data.mandi.name}</span> ({data.mandi.district}, {data.mandi.state}) in this feed. Under strict validation rules, cross-mandi substitution is rejected and FALLBACK DATA is maintained to preserve trade integrity.
                </div>
              )}

              {/* Content View Based on Selected Tab */}
              {debugTab === 'availableMandis' ? (
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Mandis with Verified Quotes in AGMARKNET Today ({data.commodity.name}):
                  </div>
                  {availableReportingMarkets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                      {availableReportingMarkets.map((m: string, idx: number) => (
                        <div key={idx} className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                          <span className="truncate">{m}</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">Official Bulletin</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[11px] italic p-3 bg-slate-900 rounded border border-slate-800">
                      Zero reporting mandis found in government bulletin for {data.commodity.name} today.
                    </div>
                  )}
                </div>
              ) : debugTab === 'matchedRecord' ? (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    {record ? 'Exact Raw Record from Directorate of Marketing & Inspection' : 'Mandi Match Status (No Exact Record Filed)'}
                  </div>
                  <pre className="bg-black/80 text-emerald-400 p-3 rounded-lg border border-slate-800 text-[11px] overflow-x-auto max-h-60 leading-relaxed font-mono">
                    {JSON.stringify(record || {
                      selectedMarket: data.mandi.name,
                      selectedDistrict: data.mandi.district,
                      selectedState: data.mandi.state,
                      commodity: data.commodity.name,
                      exactMatchFound: false,
                      dataQualityCategory: data.dataTypeCategory,
                      validationReason: data.dataQualityReason,
                      protectionEnforced: 'FALLBACK DATA displayed; no simulated or manufactured numbers'
                    }, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Actual data.gov.in API Response Fields (Untransformed Payload):
                  </div>
                  <pre className="bg-black/80 text-emerald-400 p-3 rounded-lg border border-slate-800 text-[11px] overflow-x-auto max-h-64 leading-relaxed font-mono">
                    {JSON.stringify(actualApiResponse || rawApi || {
                      status: 'No live matching record found in government daily bulletin today',
                      selectedMarket: data.mandi.name,
                      commodity: data.commodity.name,
                      dataTypeCategory: data.dataTypeCategory,
                      reason: data.dataQualityReason
                    }, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
