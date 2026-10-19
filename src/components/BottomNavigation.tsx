import React from 'react';
import { Home, Store, Calculator, Menu, Plus } from 'lucide-react';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation } from '../locales';

export type MainTabType = 'home' | 'markets' | 'calculator' | 'more' | 'compare' | 'updates' | 'add_rate';

interface BottomNavigationProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
  onAddRate?: () => void;
  currentLanguage?: SupportedLanguage;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  onAddRate,
  currentLanguage = 'mr'
}) => {
  const t = getTranslation((currentLanguage as SupportedLanguage) || 'mr');

  const addRateLabel = `+ ${t.addRate}`;

  const handleCenterAction = () => {
    if (onAddRate) {
      onAddRate();
    } else {
      onChangeTab('add_rate');
    }
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      id="main-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-xl pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="w-full max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1 relative">
        {/* 1. HOME TAB */}
        <button
          type="button"
          id="nav-tab-home"
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center justify-center h-full w-full py-1 gap-0.5 transition-all duration-150 cursor-pointer select-none ${
            activeTab === 'home' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-150 ${
              activeTab === 'home'
                ? 'bg-emerald-100 text-emerald-800 shadow-xs'
                : 'bg-transparent text-slate-500'
            }`}
          >
            <Home className={`w-5 h-5 transition-transform duration-150 ${activeTab === 'home' ? 'scale-105 stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span
            className={`text-[10px] tracking-tight leading-none truncate max-w-full px-0.5 ${
              activeTab === 'home' ? 'font-black text-emerald-900' : 'font-semibold text-slate-500'
            }`}
          >
            {t.navHome}
          </span>
        </button>

        {/* 2. MARKET TAB */}
        <button
          type="button"
          id="nav-tab-markets"
          onClick={() => onChangeTab('markets')}
          className={`flex flex-col items-center justify-center h-full w-full py-1 gap-0.5 transition-all duration-150 cursor-pointer select-none ${
            activeTab === 'markets' || activeTab === 'compare' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-150 ${
              activeTab === 'markets' || activeTab === 'compare'
                ? 'bg-emerald-100 text-emerald-800 shadow-xs'
                : 'bg-transparent text-slate-500'
            }`}
          >
            <Store className={`w-5 h-5 transition-transform duration-150 ${activeTab === 'markets' || activeTab === 'compare' ? 'scale-105 stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span
            className={`text-[10px] tracking-tight leading-none truncate max-w-full px-0.5 ${
              activeTab === 'markets' || activeTab === 'compare' ? 'font-black text-emerald-900' : 'font-semibold text-slate-500'
            }`}
          >
            {t.navMarkets}
          </span>
        </button>

        {/* 3. CENTER ACTION: + ADD RATE / + दर पोस्ट करा */}
        <div className="flex flex-col items-center justify-center relative -mt-4 z-20">
          <button
            type="button"
            id="nav-tab-add-rate"
            onClick={handleCenterAction}
            className="group flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 transition-transform focus:outline-none"
            aria-label={addRateLabel}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-700/35 ring-4 ring-white transition-all group-hover:scale-105">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="text-[9.5px] font-black text-emerald-900 mt-0.5 whitespace-nowrap tracking-tight leading-none text-center block">
              {addRateLabel}
            </span>
          </button>
        </div>

        {/* 4. CALCULATOR TAB */}
        <button
          type="button"
          id="nav-tab-calculator"
          onClick={() => onChangeTab('calculator')}
          className={`flex flex-col items-center justify-center h-full w-full py-1 gap-0.5 transition-all duration-150 cursor-pointer select-none ${
            activeTab === 'calculator' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-150 ${
              activeTab === 'calculator'
                ? 'bg-emerald-100 text-emerald-800 shadow-xs'
                : 'bg-transparent text-slate-500'
            }`}
          >
            <Calculator className={`w-5 h-5 transition-transform duration-150 ${activeTab === 'calculator' ? 'scale-105 stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span
            className={`text-[10px] tracking-tight leading-none truncate max-w-full px-0.5 ${
              activeTab === 'calculator' ? 'font-black text-emerald-900' : 'font-semibold text-slate-500'
            }`}
          >
            {t.navCalculator}
          </span>
        </button>

        {/* 5. MORE TAB */}
        <button
          type="button"
          id="nav-tab-more"
          onClick={() => onChangeTab('more')}
          className={`flex flex-col items-center justify-center h-full w-full py-1 gap-0.5 transition-all duration-150 cursor-pointer select-none ${
            activeTab === 'more' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-150 ${
              activeTab === 'more'
                ? 'bg-emerald-100 text-emerald-800 shadow-xs'
                : 'bg-transparent text-slate-500'
            }`}
          >
            <Menu className={`w-5 h-5 transition-transform duration-150 ${activeTab === 'more' ? 'scale-105 stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span
            className={`text-[10px] tracking-tight leading-none truncate max-w-full px-0.5 ${
              activeTab === 'more' ? 'font-black text-emerald-900' : 'font-semibold text-slate-500'
            }`}
          >
            {t.navMore}
          </span>
        </button>
      </div>
    </nav>
  );
};

