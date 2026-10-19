import React, { useState, useId, useEffect } from 'react';
import { formatINR } from '../services/mandiDataService';
import {
  Calculator,
  RotateCcw,
  IndianRupee,
  Scale,
  TrendingUp,
  Truck,
  Building,
  ShieldCheck,
  Percent,
  Receipt,
  AlertCircle
} from 'lucide-react';

interface ProfitCalculatorProps {
  currentPrice: number;
  commodityName: string;
  mandiName?: string;
  mandiDistrict?: string;
  mandiState?: string;
  unit?: string;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  currentPrice,
  commodityName,
  mandiName = 'Selected Mandi',
  mandiDistrict = '',
  mandiState = '',
  unit = '₹/quintal'
}) => {
  const quantityId = useId();
  const buyPriceId = useId();
  const sellPriceId = useId();
  const freightId = useId();
  const handlingId = useId();
  const otherId = useId();

  // Unit mode: 'qtl' or 'mt'
  const [quantityUnit, setQuantityUnit] = useState<'qtl' | 'mt'>('qtl');
  const [quantityValue, setQuantityValue] = useState<string>('100');

  // Mandi names and prices
  const [buyingMandi, setBuyingMandi] = useState<string>(mandiName);
  const [sellingMandi, setSellingMandi] = useState<string>('Terminal / Destination Market');
  const [purchasePrice, setPurchasePrice] = useState<string>(String(currentPrice || 2500));
  const [salePrice, setSalePrice] = useState<string>(String(Math.round((currentPrice || 2500) * 1.08)));

  // Expenses
  const [freightTotal, setFreightTotal] = useState<string>('3500'); // e.g. ₹35/qtl * 100
  const [handlingTotal, setHandlingTotal] = useState<string>('2000'); // mandi cess & handling
  const [otherExpenses, setOtherExpenses] = useState<string>('500'); // weighbridge / misc

  // Sync when mandiName or currentPrice changes
  useEffect(() => {
    if (mandiName) setBuyingMandi(mandiName);
    if (currentPrice > 0) {
      setPurchasePrice(String(currentPrice));
      setSalePrice(String(Math.round(currentPrice * 1.08)));
    }
  }, [mandiName, currentPrice]);

  // Derived numerical values
  const numQuantity = parseFloat(quantityValue) || 0;
  const numPurchasePrice = parseFloat(purchasePrice) || 0;
  const numSalePrice = parseFloat(salePrice) || 0;
  const numFreight = parseFloat(freightTotal) || 0;
  const numHandling = parseFloat(handlingTotal) || 0;
  const numOther = parseFloat(otherExpenses) || 0;

  // Derived effective quintals
  const effectiveQuintals = quantityUnit === 'mt' ? numQuantity * 10 : numQuantity;

  // Cost calculation
  const rawPurchaseCost = effectiveQuintals * numPurchasePrice;
  const totalExpenses = numFreight + numHandling + numOther;
  const totalCost = rawPurchaseCost + totalExpenses;

  // Revenue & Profit
  const grossRevenue = effectiveQuintals * numSalePrice;
  const netProfit = grossRevenue - totalCost;
  const marginPercentage = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const breakevenPrice = effectiveQuintals > 0 ? Math.ceil(totalCost / effectiveQuintals) : numPurchasePrice;

  const isProfit = netProfit >= 0;

  const handleReset = () => {
    const basePrice = currentPrice || 2500;
    setPurchasePrice(String(basePrice));
    setSalePrice(String(Math.round(basePrice * 1.08)));
    const baseQtl = quantityUnit === 'mt' ? (parseFloat(quantityValue) || 10) * 10 : (parseFloat(quantityValue) || 100);
    setFreightTotal(String(Math.round(baseQtl * 35)));
    setHandlingTotal(String(Math.round(baseQtl * 20)));
    setOtherExpenses('500');
  };

  const addQuantity = (delta: number) => {
    setQuantityValue(prev => {
      const val = parseFloat(prev) || 0;
      return String(Math.max(1, val + delta));
    });
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Trading Margin Calculator
              </h2>
              <p className="text-xs text-slate-400">
                Pre-populated from <strong className="text-white">{buyingMandi}</strong> ({commodityName})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Rates</span>
          </button>
        </div>
      </div>

      {/* 2. Output Summary Cards (Prominent Top Section) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Calculated Trade Summary
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isProfit
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            {isProfit ? 'PROFITABLE TRADE' : 'NET LOSS'}
          </span>
        </div>

        {/* Big Profit/Loss Metric */}
        <div className={`p-4 rounded-xl text-center border ${
          isProfit
            ? 'bg-emerald-950/40 border-emerald-500/40'
            : 'bg-rose-950/40 border-rose-500/40'
        }`}>
          <div className="text-xs text-slate-400 font-medium">Net Profit / Loss</div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono mt-0.5 ${
            isProfit ? 'text-emerald-300' : 'text-rose-300'
          }`}>
            {isProfit ? '+' : ''}{formatINR(netProfit)}
          </div>
          <div className="flex items-center justify-center gap-3 mt-1.5 text-xs">
            <span className="text-slate-300">
              Margin: <strong className={isProfit ? 'text-emerald-400' : 'text-rose-400'}>
                {marginPercentage.toFixed(2)}%
              </strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">
              Breakeven: <strong className="text-white">₹{breakevenPrice.toLocaleString('en-IN')}/qtl</strong>
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Cost</span>
            <span className="text-sm sm:text-base font-bold text-white font-mono block mt-0.5">
              {formatINR(totalCost)}
            </span>
            <span className="text-[10px] text-slate-400">
              ₹{(effectiveQuintals > 0 ? Math.round(totalCost / effectiveQuintals) : 0).toLocaleString('en-IN')}/qtl landed
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Gross Revenue</span>
            <span className="text-sm sm:text-base font-bold text-white font-mono block mt-0.5">
              {formatINR(grossRevenue)}
            </span>
            <span className="text-[10px] text-slate-400">
              {effectiveQuintals} quintals @ ₹{salePrice}/qtl
            </span>
          </div>
        </div>
      </div>

      {/* 3. Input Controls (Clean, mobile-first design) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Receipt className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trade Inputs</span>
        </h3>

        {/* Mandis and Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Buying Mandi & Purchase Price */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">
                1. Buying Mandi
              </label>
              <input
                type="text"
                value={buyingMandi}
                onChange={(e) => setBuyingMandi(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                placeholder="Origin Mandi"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor={buyPriceId} className="text-[11px] font-semibold text-emerald-400 block">
                Purchase Price (₹/quintal)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                <input
                  id={buyPriceId}
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-white font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Selling Mandi & Sale Price */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">
                2. Selling Mandi / Destination
              </label>
              <input
                type="text"
                value={sellingMandi}
                onChange={(e) => setSellingMandi(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                placeholder="Destination Mandi / Processor"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor={sellPriceId} className="text-[11px] font-semibold text-emerald-400 block">
                Expected Sale Price (₹/quintal)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                <input
                  id={sellPriceId}
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-white font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quantity (in Quintals or Metric Tons) */}
        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={quantityId} className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quantity</span>
            </label>

            {/* Toggle Quintals vs Metric Tons */}
            <div className="flex items-center bg-slate-850 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setQuantityUnit('qtl')}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                  quantityUnit === 'qtl'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Quintals (qtl)
              </button>
              <button
                type="button"
                onClick={() => setQuantityUnit('mt')}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                  quantityUnit === 'mt'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Metric Tons (MT)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id={quantityId}
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={quantityValue}
              onChange={(e) => setQuantityValue(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="text-xs font-bold text-slate-400 shrink-0 w-16 text-right">
              {quantityUnit === 'qtl' ? `${(numQuantity / 10).toFixed(1)} MT` : `${numQuantity * 10} qtl`}
            </span>
          </div>

          {/* Quick Increment Chips */}
          <div className="flex items-center gap-1.5 pt-1">
            {[10, 50, 100, 500].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => addQuantity(inc)}
                className="flex-1 text-[11px] py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer border border-slate-700/60"
              >
                +{inc} {quantityUnit}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses: Freight, Handling/Mandi charges, Other expenses */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transport & Operational Expenses</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Freight / Transport */}
            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
              <label htmlFor={freightId} className="text-[10px] uppercase font-semibold text-slate-400 block">
                Freight / Transport (₹)
              </label>
              <input
                id={freightId}
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={freightTotal}
                onChange={(e) => setFreightTotal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block">
                ≈ ₹{(effectiveQuintals > 0 ? Math.round(numFreight / effectiveQuintals) : 0)}/qtl
              </span>
            </div>

            {/* Handling / Mandi charges */}
            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
              <label htmlFor={handlingId} className="text-[10px] uppercase font-semibold text-slate-400 block">
                Handling / Mandi (₹)
              </label>
              <input
                id={handlingId}
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={handlingTotal}
                onChange={(e) => setHandlingTotal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block">
                Cess, loading & unloading
              </span>
            </div>

            {/* Other expenses */}
            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
              <label htmlFor={otherId} className="text-[10px] uppercase font-semibold text-slate-400 block">
                Other Expenses (₹)
              </label>
              <input
                id={otherId}
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block">
                Weighbridge, insurance, misc
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Notice: Calculated values are estimates based on user-entered inputs. Actual dispatch returns depend on weighment deductions, transit moisture loss, and settlement terms.
          </p>
        </div>
      </div>
    </div>
  );
};
