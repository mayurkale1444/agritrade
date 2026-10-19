import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  Layers, 
  Calculator, 
  Send, 
  CheckCircle2, 
  FileText, 
  Globe, 
  Smartphone, 
  Instagram, 
  Mail, 
  Lock, 
  Trash2,
  ChevronRight,
  Database
} from 'lucide-react';
import { AgriTradeLogo } from './AgriTradeLogo';
import { MAHARASHTRA_MANDIS, COMMODITIES } from '../services/mandiDataService';

interface AgriTradeWebsiteProps {
  onLaunchApp: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenDeleteAccount: () => void;
  onOpenDisclaimer?: () => void;
}

export const AgriTradeWebsite: React.FC<AgriTradeWebsiteProps> = ({
  onLaunchApp,
  onOpenPrivacyPolicy,
  onOpenDeleteAccount,
  onOpenDisclaimer
}) => {
  const [lang, setLang] = useState<'mr' | 'en'>('mr');

  // Sample live mandi rates for preview
  const previewRates = [
    { commodity: lang === 'mr' ? 'कांदा (Onion)' : 'Onion', mandi: 'Lasalgaon (लासलगाव)', modal: 2450, min: 1800, max: 2900, trend: '+₹150' },
    { commodity: lang === 'mr' ? 'सोयाबीन (Soybean)' : 'Soybean', mandi: 'Latur (लातूर)', modal: 4420, min: 4100, max: 4650, trend: '+₹80' },
    { commodity: lang === 'mr' ? 'टोमॅटो (Tomato)' : 'Tomato', mandi: 'Nashik (नाशिक)', modal: 1650, min: 1200, max: 2100, trend: '-₹50' },
    { commodity: lang === 'mr' ? 'कापूस (Cotton)' : 'Cotton', mandi: 'Akola (अकोला)', modal: 7350, min: 6900, max: 7600, trend: '+₹120' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col">
      
      {/* 1. TOP ANNOUNCEMENT BANNER: INDEPENDENT PLATFORM & DATA SOURCES */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 text-center font-medium border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            {lang === 'mr' ? 'स्वतंत्र कृषी माहिती मंच:' : 'Independent Platform:'}
          </span>
          <span>
            {lang === 'mr' 
              ? 'शासकीय दर AGMARKNET व data.gov.in द्वारे प्राप्त. अ‍ॅप कोणत्याही सरकारी संस्थेशी संलग्न नाही.' 
              : 'Govt records sourced from AGMARKNET & data.gov.in. Not affiliated with any govt entity.'}
          </span>
          {onOpenDisclaimer && (
            <button
              type="button"
              onClick={onOpenDisclaimer}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer ml-1"
            >
              {lang === 'mr' ? 'माहिती स्रोत व अस्वीकरण' : 'Data Sources & Disclaimer'} →
            </button>
          )}
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <AgriTradeLogo size={40} variant="emblem-only" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                Agri<span className="text-emerald-700">Trade</span>
              </span>
              <span className="text-[11px] text-emerald-800 font-bold block">
                {lang === 'mr' ? 'विकण्यापूर्वी माहिती घ्या' : 'Know Before You Sell'}
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
            <a href="#rates" className="hover:text-emerald-700 transition-colors">
              {lang === 'mr' ? 'थेट बाजारभाव' : 'Live Rates'}
            </a>
            <a href="#compare" className="hover:text-emerald-700 transition-colors">
              {lang === 'mr' ? 'बाजार तुलना' : 'Compare Mandis'}
            </a>
            <a href="#calculator" className="hover:text-emerald-700 transition-colors">
              {lang === 'mr' ? 'नफा कॅल्क्युलेटर' : 'Trading Tools'}
            </a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">
              {lang === 'mr' ? 'कसे काम करते' : 'How It Works'}
            </a>
            <a href="#trust" className="hover:text-emerald-700 transition-colors">
              {lang === 'mr' ? 'पारदर्शकता' : 'Data Trust'}
            </a>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
              <button
                type="button"
                onClick={() => setLang('mr')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  lang === 'mr' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Launch App Button */}
            <button
              type="button"
              onClick={onLaunchApp}
              className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'mr' ? 'अ‍ॅप सुरू करा' : 'Open App'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white pt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'mr' ? 'भारतातील कृषी बाजार समित्यांसाठी थेट दर' : 'Real-time APMC Mandi Intelligence'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {lang === 'mr' ? (
                <>
                  शेतमाल बाजारात आणण्यापूर्वी <span className="text-emerald-700">योग्य भाव</span> जाणून घ्या.
                </>
              ) : (
                <>
                  Know the true market price <span className="text-emerald-700">before you sell</span> your produce.
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              {lang === 'mr'
                ? 'AgriTrade – कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकारच्या अॅगमार्कनेट (AGMARKNET) अधिकृत बाजारभाव, स्थानिक आडत व्यापारी दर, बाजार तुलना आणि विक्री नफा कॅल्क्युलेटर एकाच ठिकाणी.'
                : 'AgriTrade delivers official AGMARKNET mandi rates, trader-reported local market prices, inter-market comparisons, and trade profitability calculators designed for farmers and traders.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onLaunchApp}
                className="py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Smartphone className="w-4 h-4" />
                <span>{lang === 'mr' ? 'AgriTrade अ‍ॅप सुरू करा' : 'Launch AgriTrade App'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#download"
                className="py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer no-underline"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'mr' ? 'Google Play वर उपलब्ध' : 'Download on Google Play'}</span>
              </a>
            </div>

            {/* Trust highlights */}
            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'mr' ? '१००% मोफत' : '100% Free'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'mr' ? 'अधिकृत सरकारी डेटा' : 'Govt Certified Rates'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'mr' ? 'मराठी व इंग्रजी' : 'Marathi & English'}</span>
              </div>
            </div>
          </div>

          {/* Right Preview Card Column */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {lang === 'mr' ? 'आजचे थेट बाजारभाव (Live Rates)' : 'Today\'s Mandi Prices'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  AGMARKNET
                </span>
              </div>

              <div className="space-y-2.5">
                {previewRates.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {item.commodity}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {item.mandi}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 block font-mono">
                        ₹{item.modal.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-slate-500">/ क्विंटल</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onLaunchApp}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'mr' ? 'सर्व ३००+ बाजार समित्यांचे भाव पहा' : 'View all 300+ APMC Mandi Rates'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. KEY FEATURES SECTION */}
      <section id="rates" className="py-16 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
              {lang === 'mr' ? 'मुख्य वैशिष्ट्ये' : 'Core Capabilities'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'mr' ? 'शेतकरी आणि व्यापाऱ्यांसाठी डिझाइन केलेले आधुनिक साधने' : 'Built for India\'s Agricultural Mandi Ecosystem'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {lang === 'mr' 
                ? 'नफा वाढवण्यासाठी आणि फसवणूक टाळण्यासाठी आवश्यक असलेली सर्व माहिती.' 
                : 'All the trade analytics you need to maximize profit and eliminate price ambiguity.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'थेट अधिकृत बाजारभाव' : 'Official APMC Prices'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'mr'
                  ? 'अॅगमार्कनेट (AGMARKNET) द्वारे प्रमाणित किमान, कमाल आणि सर्वसाधारण (Modal) दर दररोज अपडेट होतात.'
                  : 'Daily government-verified modal, minimum, and maximum prices direct from agricultural mandis.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div id="compare" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'बाजार समित्यांची तुलना' : 'Compare Mandis'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'mr'
                  ? 'नजीकच्या बाजारपेठांमधील दरांचा फरक, वाहतूक खर्च आणि अंतराची तुलना करून सर्वात फायदेशीर बाजार निवडा.'
                  : 'Compare prices, distance, and transit costs across neighboring mandis to find the highest return.'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'स्थानिक आडत दर' : 'Trader Reported Rates'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'mr'
                  ? 'बाजार समितीतील विश्वासू आडते आणि स्थानिक व्यापाऱ्यांनी प्रत्यक्ष नोंदवलेले ताजे लिलाव दर.'
                  : 'Community-reported ground auction rates submitted by verified commission agents and local traders.'}
              </p>
            </div>

            {/* Feature 4 */}
            <div id="calculator" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'व्यापार नफा कॅल्क्युलेटर' : 'Trading Calculator'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'mr'
                  ? 'हमाली, तोलाई, बारदाना, कमिशन आणि वाहतूक वजा जाता मिळणारा प्रत्यक्ष निव्वळ नफा मोजा.'
                  : 'Compute actual net take-home returns after mandi cess, labor, transport, packaging, and commission.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
              {lang === 'mr' ? 'वापरास अत्यंत सोपे' : 'Simple 3 Steps'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'mr' ? 'AgriTrade कसे काम करते?' : 'How AgriTrade Works'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center mx-auto shadow-xs">
                १
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'शेतमाल व बाजार निवडा' : '1. Choose Crop & Mandi'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'mr'
                  ? 'तुमचा शेतमाल (कांदा, सोयाबीन, कापूस इ.) आणि तुमची जवळची कृषी उत्पन्न बाजार समिती निवडा.'
                  : 'Select your crop (onion, soybean, cotton, tomato) and preferred local APMC market.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center mx-auto shadow-xs">
                २
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'थेट बाजारभाव तपासा' : '2. Inspect Live Rates'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'mr'
                  ? 'आजचे अधिकृत लिलाव दर, गुणवत्ता श्रेणी आणि इतर बाजारांमधील दरांची तुलना पहा.'
                  : 'Review today\'s auction prices, quality grades, and price trends across alternate markets.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center mx-auto shadow-xs">
                ३
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'सर्वोत्तम नफ्यावर माल विका' : '3. Sell with Confidence'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'mr'
                  ? 'खर्चाचा अंदाज घेऊन योग्य बाजारात माल पाठवा आणि चांगला मोबदला मिळवा.'
                  : 'Factor in mandi charges and transport to sell where your net return is highest.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. DATA TRANSPARENCY & TRUST SECTION */}
      <section id="trust" className="py-16 px-4 bg-emerald-950 text-white">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          
          <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {lang === 'mr' ? '१००% पारदर्शक आणि अधिकृत डेटा' : '100% Data Transparency & Trust'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-2xl mx-auto">
              {lang === 'mr'
                ? 'AgriTrade मधील सर्व अधिकृत बाजारभाव थेट कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकारच्या विपणन व तपासणी संचालनालयाच्या (AGMARKNET - DMI) डेटाबेसमधून मिळवले जातात. यामध्ये कोणत्याही मध्यस्थाचा किंवा प्रायोजित दरांचा समावेश नसतो.'
                : 'All official mandi price bulletins in AgriTrade are fetched from the Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare, Government of India. We do not manipulate rates or allow sponsored biases.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-800">
              <span className="text-emerald-300 font-bold text-xs block mb-1">
                {lang === 'mr' ? 'अधिकृत स्रोत' : 'Source'}
              </span>
              <span className="text-xs text-white">AGMARKNET (DMI), Government of India</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-800">
              <span className="text-emerald-300 font-bold text-xs block mb-1">
                {lang === 'mr' ? 'सुरक्षा व गोपनीयता' : 'Privacy'}
              </span>
              <span className="text-xs text-white">{lang === 'mr' ? 'केवळ OTP आधारित सुरक्षित लॉगिन' : 'OTP verification only, no passwords'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-800">
              <span className="text-emerald-300 font-bold text-xs block mb-1">
                {lang === 'mr' ? 'खाते हटवण्याचा अधिकार' : 'Data Control'}
              </span>
              <span className="text-xs text-white">{lang === 'mr' ? 'कधीही पूर्ण खाते डेटा हटवा' : 'Google Play compliant data deletion'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. TRADER PARTICIPATION CTA */}
      <section className="py-14 px-4 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">
              {lang === 'mr' ? 'आडत व्यापारी व खरेदीदार यांच्यासाठी' : 'For Commission Agents & Traders'}
            </span>
            <h3 className="text-xl font-black text-slate-900">
              {lang === 'mr' ? 'तुमच्या बाजार समितीतील दर नोंदवा' : 'Report Daily Rates to Farmers'}
            </h3>
            <p className="text-xs text-slate-600 max-w-lg">
              {lang === 'mr'
                ? 'AgriTrade मधील "स्थानिक दर जोडा" सुविधेचा वापर करून हजारो शेतकऱ्यांपर्यंत तुमच्या बाजारातील ताजी माहिती पोहोचवा.'
                : 'Join AgriTrade\'s verified trader network to report daily arrivals and bids directly to farmers.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onLaunchApp}
            className="py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {lang === 'mr' ? 'व्यापारी म्हणून सामील व्हा' : 'Join as Trader'}
          </button>
        </div>
      </section>

      {/* 8. DOWNLOAD APP CTA */}
      <section id="download" className="py-16 px-4 bg-emerald-700 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {lang === 'mr' ? 'आजच AgriTrade अ‍ॅप वापरा' : 'Start Using AgriTrade Today'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
            {lang === 'mr'
              ? 'मोबाईल नंबर वापरून सेकंदात सुरक्षित लॉगिन करा. कोणत्याही पासवर्डची गरज नाही.'
              : 'Sign in instantly with your mobile number and OTP. No passwords or clutter.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onLaunchApp}
              className="py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-emerald-900 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'mr' ? 'वेब अ‍ॅप सुरू करा' : 'Open Web App'}</span>
            </button>

            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-6 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto no-underline border border-emerald-600/40"
            >
              <Download className="w-4 h-4" />
              <span>Google Play</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. COMPREHENSIVE FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <AgriTradeLogo size={30} variant="emblem-only" />
              </div>
              <span className="text-base font-black tracking-tight">Agri<span className="text-emerald-400">Trade</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {lang === 'mr'
                ? 'विकण्यापूर्वी माहिती घ्या — भारतीय शेतकरी आणि कृषी व्यापाऱ्यांसाठी थेट कृषी बाजारभाव व विश्लेषण.'
                : 'Know Before You Sell — Real-time APMC mandi prices and trade intelligence for Indian agriculture.'}
            </p>
            <div className="text-emerald-400 font-bold font-mono text-[11px]">
              agritrade.in
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <span className="text-white font-bold text-xs uppercase tracking-wider block mb-2">
              {lang === 'mr' ? 'सुविधा' : 'Features'}
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#rates" className="hover:text-emerald-400 transition-colors">थेट बाजारभाव (Live Rates)</a></li>
              <li><a href="#compare" className="hover:text-emerald-400 transition-colors">बाजार तुलना (Compare Mandis)</a></li>
              <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">नफा कॅल्क्युलेटर (Calculator)</a></li>
              <li><button type="button" onClick={onLaunchApp} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">मोबाईल अ‍ॅप (Open App)</button></li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div className="space-y-2">
            <span className="text-white font-bold text-xs uppercase tracking-wider block mb-2">
              {lang === 'mr' ? 'सुरक्षा व नियम' : 'Compliance & Legal'}
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                {onOpenDisclaimer && (
                  <button
                    type="button"
                    onClick={onOpenDisclaimer}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 font-bold text-emerald-400"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{lang === 'mr' ? 'माहिती स्रोत व अस्वीकरण' : 'Data Sources & Disclaimer'}</span>
                  </button>
                )}
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenPrivacyPolicy}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>{lang === 'mr' ? 'गोपनीयता धोरण' : 'Privacy Policy'}</span>
                  </button>
                  <a
                    href="/privacy-policy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-500 hover:text-emerald-400 underline font-mono"
                    title="Open standalone HTML for Google Play Console"
                  >
                    (HTML)
                  </a>
                </div>
              </li>
              <li>
                <a
                  href="/delete-account"
                  className="hover:text-rose-400 transition-colors text-left flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3 text-rose-400" />
                  <span>{lang === 'mr' ? 'खाते हटवा (Account Deletion)' : 'Delete Account (Play Store)'}</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500">
                  {lang === 'mr' ? 'नियम व अटी (Terms)' : 'Terms of Service'}
                </span>
              </li>
              <li>
                <span className="text-slate-500">
                  Google Play Data Safety Ready
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-2">
            <span className="text-white font-bold text-xs uppercase tracking-wider block mb-2">
              {lang === 'mr' ? 'संपर्क व सोशल' : 'Contact & Social'}
            </span>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a href="mailto:support@agritrade.in" className="hover:text-emerald-400 transition-colors">
                  support@agritrade.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <a 
                  href="https://instagram.com/agritrade.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  @agritrade.in (Instagram)
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 AgriTrade (agritrade.in). Independent agricultural intelligence platform.
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <span>Official records sourced from:</span>
            <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
              AGMARKNET (agmarknet.gov.in)
            </a>
            <span>•</span>
            <a href="https://data.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              data.gov.in
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
