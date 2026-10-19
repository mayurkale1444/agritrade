import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Truck, 
  Check, 
  Package, 
  Layers, 
  Calculator, 
  History, 
  Trash2, 
  Clock, 
  FolderOpen
} from 'lucide-react';
import { CommodityId, UserProfile } from '../types';
import { COMMODITIES } from '../services/mandiDataService';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation, localizeCommodityName } from '../locales';

export interface CalculatorHistoryItem {
  id: string;
  timestamp: number;
  dateFormatted: string;
  commodityId: CommodityId;
  commodityName: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  transportCost: number;
  labourCost: number;
  packingCost: number;
  apmcCess: number;
  totalInvestment: number;
  grossRevenue: number;
  netProfit: number;
  profitMargin: number;
  breakevenRate: number;
  isProfitable: boolean;
}

const CALC_HISTORY_STORAGE_KEY = 'agritrade_calc_history_v1';

interface SaleCalculatorViewProps {
  initialPrice?: number;
  initialCommodityId?: CommodityId;
  language: SupportedLanguage;
  userProfile?: UserProfile | null;
  onNavigateToEditProfile?: () => void;
  onBack?: () => void;
  mandiName?: string;
}

export const SaleCalculatorView: React.FC<SaleCalculatorViewProps> = ({
  initialPrice,
  initialCommodityId,
  language,
  userProfile,
  onNavigateToEditProfile,
  onBack,
  mandiName
}) => {
  const t = getTranslation(language);

  // Tab beside calculator: 'calculator' vs 'history'
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');

  const defaultCmdId: CommodityId = userProfile?.primaryCommodity || initialCommodityId || 'onion';
  const [selectedCommodityId, setSelectedCommodityId] = useState<CommodityId>(defaultCmdId);

  // Default price resolution
  const resolvedBasePrice = useMemo(() => {
    if (initialPrice && initialPrice > 0) return initialPrice;
    const targetC = COMMODITIES.find(c => c.id === defaultCmdId);
    return targetC?.benchmarkPrice || (defaultCmdId === 'wheat' ? 2425 : 4100);
  }, [initialPrice, defaultCmdId]);

  // Robust string state allowing backspace, decimals, and fluid typing on mobile
  const [buyingPrice, setBuyingPrice] = useState<string>(String(resolvedBasePrice));
  const [sellingPrice, setSellingPrice] = useState<string>(String(Math.round(resolvedBasePrice * 1.1)));
  const [quantity, setQuantity] = useState<string>('50'); // In quintals

  // Expenses Breakdown
  const [transportCost, setTransportCost] = useState<string>('1500');
  const [labourCost, setLabourCost] = useState<string>('800'); // Hamali / Loading-Unloading
  const [packingCost, setPackingCost] = useState<string>('500'); // Packing
  const [apmcCess, setApmcCess] = useState<string>('400'); // Commission / Mandi Cess / Other

  // Calculator History state
  const [history, setHistory] = useState<CalculatorHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(CALC_HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [justCalculated, setJustCalculated] = useState(false);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Persistent reference for smooth focus on calculate click
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Update when initial inputs change
  useEffect(() => {
    if (initialCommodityId) {
      setSelectedCommodityId(initialCommodityId);
    }
  }, [initialCommodityId]);

  useEffect(() => {
    if (initialPrice && initialPrice > 0) {
      setBuyingPrice(String(initialPrice));
      setSellingPrice(String(Math.round(initialPrice * 1.1)));
    }
  }, [initialPrice]);

  // Save history to localStorage
  const saveHistoryToStorage = (updatedHistory: CalculatorHistoryItem[]) => {
    try {
      localStorage.setItem(CALC_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (e) {
      console.warn('Could not persist calculator history:', e);
    }
  };

  // Safe numerical parsers
  const numBuyPrice = parseFloat(buyingPrice) || 0;
  const numSellPrice = parseFloat(sellingPrice) || 0;
  const numQuantity = parseFloat(quantity) || 0;
  const numTransport = parseFloat(transportCost) || 0;
  const numLabour = parseFloat(labourCost) || 0;
  const numPacking = parseFloat(packingCost) || 0;
  const numApmcCess = parseFloat(apmcCess) || 0;

  // Real-time calculated figures
  const rawPurchaseCost = numBuyPrice * numQuantity;
  const totalExpenses = numTransport + numLabour + numPacking + numApmcCess;
  const totalInvestment = rawPurchaseCost + totalExpenses;
  const grossRevenue = numSellPrice * numQuantity;
  const netProfit = grossRevenue - totalInvestment;
  const profitMargin = totalInvestment > 0 ? Math.round((netProfit / totalInvestment) * 1000) / 10 : 0;
  const breakevenRate = numQuantity > 0 ? Math.round(totalInvestment / numQuantity) : 0;
  const isProfitable = netProfit >= 0;

  const currentCommodityObj = COMMODITIES.find(c => c.id === selectedCommodityId) || COMMODITIES[0];
  const commodityLabel = localizeCommodityName(
    selectedCommodityId,
    language,
    currentCommodityObj.name,
    currentCommodityObj.marathiName
  );

  // When user changes commodity from dropdown
  const handleCommodityChange = (newCmdId: CommodityId) => {
    setSelectedCommodityId(newCmdId);
    const target = COMMODITIES.find(c => c.id === newCmdId);
    const benchmark = target?.benchmarkPrice || (newCmdId === 'wheat' ? 2425 : 3500);
    setBuyingPrice(String(benchmark));
    setSellingPrice(String(Math.round(benchmark * 1.1)));
  };

  // Reset form to defaults
  const handleReset = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const target = COMMODITIES.find(c => c.id === defaultCmdId);
    const base = target?.benchmarkPrice || 3500;
    setSelectedCommodityId(defaultCmdId);
    setBuyingPrice(String(base));
    setSellingPrice(String(Math.round(base * 1.1)));
    setQuantity('50');
    setTransportCost('1500');
    setLabourCost('800');
    setPackingCost('500');
    setApmcCess('400');
    setJustCalculated(false);
    setSavedNotification(null);
  };

  // Calculate & Save to History
  const handleCalculate = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setJustCalculated(true);
    setTimeout(() => setJustCalculated(false), 2500);

    // Save to calculation history
    if (numQuantity > 0 && numBuyPrice > 0) {
      const now = new Date();
      const historyItem: CalculatorHistoryItem = {
        id: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        dateFormatted: now.toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }),
        commodityId: selectedCommodityId,
        commodityName: commodityLabel,
        buyingPrice: numBuyPrice,
        sellingPrice: numSellPrice,
        quantity: numQuantity,
        transportCost: numTransport,
        labourCost: numLabour,
        packingCost: numPacking,
        apmcCess: numApmcCess,
        totalInvestment,
        grossRevenue,
        netProfit,
        profitMargin,
        breakevenRate,
        isProfitable
      };

      const newHistory = [historyItem, ...history.filter(h => h.id !== historyItem.id)].slice(0, 50);
      saveHistoryToStorage(newHistory);
      setSavedNotification(t.calculatedAndSaved || 'Calculation saved to History');
      setTimeout(() => setSavedNotification(null), 3000);
    }

    // Scroll results into view smoothly
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Reopen calculation from history item
  const handleReopenHistoryItem = (item: CalculatorHistoryItem) => {
    setSelectedCommodityId(item.commodityId);
    setBuyingPrice(String(item.buyingPrice));
    setSellingPrice(String(item.sellingPrice));
    setQuantity(String(item.quantity));
    setTransportCost(String(item.transportCost));
    setLabourCost(String(item.labourCost));
    setPackingCost(String(item.packingCost));
    setApmcCess(String(item.apmcCess));
    setActiveTab('calculator');
    setSavedNotification(`Loaded "${item.commodityName}" calculation`);
    setTimeout(() => setSavedNotification(null), 3000);

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Delete a history record
  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = history.filter(h => h.id !== id);
    saveHistoryToStorage(filtered);
  };

  // Clear all history
  const handleClearAllHistory = () => {
    saveHistoryToStorage([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 w-full max-w-4xl mx-auto shadow-2xl font-sans flex flex-col overflow-x-hidden" id="calculator-view">
      {/* 1. TOP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                type="button"
                id="calc-back-btn"
                onClick={onBack}
                className="p-1.5 -ml-1 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {t.calculatorTitle || 'Profit Calculator'}
              </h1>
              {mandiName && (
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {mandiName} • {commodityLabel}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title={t.resetBtn}
              aria-label={t.resetBtn}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. SECTION TABS BESIDE CALCULATOR: Calculator tab & Calculation History tab */}
        <div className="flex items-center gap-1.5 mt-3 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            id="calc-tab-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.profitCalculatorShortcut || 'Calculator'}</span>
          </button>

          <button
            type="button"
            id="calc-tab-history"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.calcHistory}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
              {history.length}
            </span>
          </button>
        </div>
      </header>

      {/* 3. MAIN CONTENT: Side-by-side on lg screens, tab-switched on mobile */}
      <div className="p-4 space-y-4 flex-1">
        {/* Saved feedback notification */}
        {savedNotification && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>{savedNotification}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">{t.storedOnDevice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT / CALCULATOR SECTION */}
          <div className={`space-y-4 lg:col-span-7 ${activeTab === 'calculator' ? 'block' : 'hidden lg:block'}`}>
            {/* Input Form Fields */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
              {/* Commodity Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {t.commodityLabel}
                </label>
                <select
                  value={selectedCommodityId}
                  onChange={(e) => handleCommodityChange(e.target.value as CommodityId)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {COMMODITIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {localizeCommodityName(c.id, language, c.name, c.marathiName)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Buying Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t.buyingPrice}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={buyingPrice}
                      onChange={(e) => setBuyingPrice(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleCalculate(e); }}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                    />
                  </div>
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t.sellingPrice}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleCalculate(e); }}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {t.quantity} ({t.quintalUnit})
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCalculate(e); }}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              {/* Expenses Breakdown */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {t.expenses}
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Transport */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      {t.transportCost}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={transportCost}
                        onChange={(e) => setTransportCost(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCalculate(e); }}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-6 pr-2 text-xs font-bold text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Labour */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      {t.labourCost}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={labourCost}
                        onChange={(e) => setLabourCost(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCalculate(e); }}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-6 pr-2 text-xs font-bold text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Packing */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      {t.packingCost}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={packingCost}
                        onChange={(e) => setPackingCost(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCalculate(e); }}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-6 pr-2 text-xs font-bold text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* APMC Cess */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      {t.apmcCess}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={apmcCess}
                        onChange={(e) => setApmcCess(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCalculate(e); }}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-6 pr-2 text-xs font-bold text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary Card */}
            <div ref={resultsRef} id="calculator-results-card" className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
              <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {t.totalPurchaseAmount}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    ₹{rawPurchaseCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {t.transportCost}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    ₹{numTransport.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {t.totalExpensesLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    ₹{totalExpenses.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                    {t.totalInvestment}
                  </span>
                  <span className="text-sm font-black text-slate-900 font-mono">
                    ₹{totalInvestment.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{t.grossRevenue}</span>
                <span className="font-bold text-slate-800 font-mono">
                  ₹{grossRevenue.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Net Profit Badge */}
              <div className={`rounded-2xl p-3.5 text-center flex items-center justify-between ${
                isProfitable
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border border-rose-300 text-rose-950'
              }`}>
                <div className="text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block text-slate-500">
                    {t.netProfit}
                  </span>
                  <div className="text-xl font-black font-mono mt-0.5">
                    {isProfitable ? `+₹${netProfit.toLocaleString('en-IN')}` : `-₹${Math.abs(netProfit).toLocaleString('en-IN')}`}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    isProfitable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isProfitable ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{profitMargin > 0 ? `+${profitMargin}%` : `${profitMargin}%`}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {t.profitMargin}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>{t.breakevenPrice}:</span>
                <strong className="text-slate-800 font-mono">₹{breakevenRate.toLocaleString('en-IN')}/{t.quintalUnit}</strong>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              id="calc-calculate-btn"
              onClick={handleCalculate}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{t.calculateBtn}</span>
              {justCalculated && (
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold text-white transition-opacity">
                  ✓ {t.calculatedAndSaved}
                </span>
              )}
            </button>
          </div>

          {/* RIGHT / CALCULATION HISTORY SECTION (Beside calculator, not below) */}
          <div className={`space-y-3 lg:col-span-5 ${activeTab === 'history' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3" id="calc-history-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      {t.calcHistory}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      {t.calcHistorySubtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {history.length} {t.records}
                  </span>
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllHistory}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-800 hover:underline px-1 cursor-pointer"
                      title={t.clearAllTitle}
                    >
                      {t.clearAll}
                    </button>
                  )}
                </div>
              </div>

              {history.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <Clock className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">
                    {t.noHistoryYet}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {t.noHistoryYetSubtitle}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-0.5">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/40 transition-colors flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-slate-900 truncate">
                              {item.commodityName}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700">
                              {item.quantity} {t.quintalUnit}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {item.dateFormatted}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-black font-mono ${
                            item.isProfitable
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            {item.isProfitable ? `+₹${item.netProfit.toLocaleString('en-IN')}` : `-₹${Math.abs(item.netProfit).toLocaleString('en-IN')}`}
                          </span>
                          <span className="text-[9.5px] text-slate-500 block mt-0.5">
                            {item.profitMargin > 0 ? `+${item.profitMargin}%` : `${item.profitMargin}%`} margin
                          </span>
                        </div>
                      </div>

                      {/* Rates summary */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200/70">
                        <span>
                          {t.buyingPrice}: <strong className="text-slate-800 font-mono">₹{item.buyingPrice}</strong>
                        </span>
                        <span>→</span>
                        <span>
                          {t.sellingPrice}: <strong className="text-slate-800 font-mono">₹{item.sellingPrice}</strong>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                          Exp: <strong className="text-slate-800 font-mono">₹{item.transportCost + item.labourCost + item.packingCost + item.apmcCess}</strong>
                        </span>
                      </div>

                      {/* Actions: Reopen / Load and Delete */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleReopenHistoryItem(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer shadow-2xs"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>{t.reopenCalculation}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title={t.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
