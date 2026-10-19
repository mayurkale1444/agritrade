import React from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Database,
  Building2,
  FileText,
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { SupportedLanguage } from '../services/i18nService';

interface DataSourcesDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const DataSourcesDisclaimerModal: React.FC<DataSourcesDisclaimerModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const isMr = language === 'mr';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      id="data-sources-disclaimer-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* 1. Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="disclaimer-modal-title" className="text-base sm:text-lg font-black text-white leading-tight">
                {isMr ? 'माहिती स्रोत व कायदेशीर अस्वीकरण' : 'Data Sources & Legal Disclaimer'}
              </h2>
              <p className="text-[11px] text-emerald-300 font-medium">
                {isMr ? 'गुगल प्ले पारदर्शकता व धोरण पूर्तता' : 'Google Play Transparency & Policy Compliance'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="close-disclaimer-modal-btn"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs leading-relaxed divide-y divide-slate-100">
          {/* SECTION 1: PROMINENT GOVERNMENT ENTITY DISCLAIMER */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isMr ? '१. शासकीय संलग्नता अस्वीकरण (महत्त्वाची सूचना)' : '1. Government Affiliation Disclaimer (Important Notice)'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300/80 text-amber-950 space-y-2">
              <p className="font-bold text-xs sm:text-[13px] leading-snug">
                {isMr
                  ? 'AgriTrade हे एक खाजगी आणि स्वतंत्र कृषी माहिती तंत्रज्ञान अ‍ॅप आहे. याचा भारत सरकार, कृषी व शेतकरी कल्याण मंत्रालय किंवा कोणत्याही शासकीय संस्थेशी कोणताही थेट संबंध, संलग्नता किंवा मान्यता नाही.'
                  : 'AgriTrade is an independent, privately developed agricultural utility platform. AgriTrade is NOT affiliated with, authorized by, endorsed by, or in any way officially connected to any government entity.'}
              </p>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                {isMr
                  ? 'या अ‍ॅपमध्ये दर्शविलेली अधिकृत कृषी बाजारभाव माहिती भारत सरकारच्या मुक्त डेटा धोरणांतर्गत (Open Government Data - data.gov.in व AGMARKNET) सार्वजनिकरीत्या उपलब्ध माहितीवरून प्राप्त केली जाते. अ‍ॅप कोणत्याही सरकारी सेवेचे प्रतिनिधित्व करत नाही.'
                  : 'Neither AgriTrade nor its developers represent or act on behalf of the Ministry of Agriculture & Farmers Welfare, Directorate of Marketing & Inspection (DMI), AGMARKNET, or any State Agricultural Marketing Board / APMC.'}
              </p>
            </div>
          </div>

          {/* SECTION 2: OFFICIAL GOVERNMENT DATA SOURCES & CLICKABLE LINKS */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs uppercase tracking-wider">
              <Database className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {isMr ? '२. अधिकृत सरकारी डेटा स्रोत (Data Sources)' : '2. Official Government Data Sources'}
              </span>
            </div>

            <p className="text-slate-600 text-xs">
              {isMr
                ? 'AgriTrade मधील अधिकृत बाजारभाव नोंदी खालील दोन अधिकृत भारत सरकार डेटा प्लॅटफॉर्मवरून प्राप्त केल्या जातात:'
                : 'Government APMC market-price records and daily arrivals displayed in AgriTrade are sourced directly from the following official platforms:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Source 1: AGMARKNET */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-emerald-400 transition-colors space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      AGMARKNET Portal
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Primary Source
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare, Govt. of India.
                  </p>
                  <p className="text-[10px] text-slate-600 mt-1.5 leading-snug">
                    {isMr
                      ? 'देशातील विविध कृषी उत्पन्न बाजार समित्यांचे (APMC) दैनंदिन लिलाव दर व आवक अहवाल.'
                      : 'National portal publishing daily wholesale arrivals, minimum, maximum, and modal auction prices across mandis.'}
                  </p>
                </div>
                <a
                  href="https://agmarknet.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors shadow-2xs mt-2"
                  id="link-agmarknet-official"
                >
                  <span>Visit agmarknet.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Source 2: data.gov.in */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-emerald-400 transition-colors space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      data.gov.in (OGD India)
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      API Gateway
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Open Government Data Platform India, National Informatics Centre (NIC), Ministry of Electronics & IT.
                  </p>
                  <p className="text-[10px] text-slate-600 mt-1.5 leading-snug">
                    Catalog: <code className="bg-slate-200 px-1 py-0.2 rounded text-[9.5px]">9ef84268-d588-465a-a308-a864a43d0070</code> under NDSAP policy.
                  </p>
                </div>
                <a
                  href="https://data.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-[11px] transition-colors shadow-2xs mt-2"
                  id="link-datagovin-official"
                >
                  <span>Visit data.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* SECTION 3: TRADER-REPORTED RATES (UNVERIFIED DISCLOSURE) */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center gap-2 text-blue-900 font-black text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                {isMr
                  ? '३. व्यापारी नोंदवलेले दर — अधिकृत शासकीय डेटा नव्हे'
                  : '3. Trader Reported — Not Official Government Data'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-slate-700">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-200/80 text-blue-950 font-black text-[10px] tracking-wide uppercase">
                  Trader Reported — Not Official Government Data
                </span>
                <span className="text-[10px] text-blue-700 font-bold">
                  (May Be Unverified)
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                {isMr
                  ? 'अ‍ॅपमधील स्थानिक व्यापारी दर विभाग हा नोंदणीकृत आडते, खरेदीदार आणि स्थानिक व्यापाऱ्यांनी स्वतःच्या फलकावरून (Rate Board) नोंदवलेला असतो. हे दर खाजगी रीतीने जमा केलेले असून ते शासकीय रीतीने पडताळलेले नसतात.'
                  : 'Rates listed in the Trader Network section are contributed directly by local market participants (commission agents / traders). These rates may be unverified and represent specific negotiated spot transactions.'}
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>
                  {isMr
                    ? 'हे दर मालाची गुणवत्ता (Grade), आर्द्रता (Moisture), आकार व लॉटच्या स्थितीनुसार बदलतात.'
                    : 'Rates vary based on physical lot condition, moisture content, quality grades (Super, Medium, FAQ), and spot bargaining.'}
                </li>
                <li>
                  {isMr
                    ? 'हे दर अधिकृत APMC बेंचमार्क किंवा शासकीय आकडेवारी मानले जाऊ नयेत.'
                    : 'They do NOT constitute official APMC auction benchmarks or official government statistical records.'}
                </li>
              </ul>
            </div>
          </div>

          {/* SECTION 4: FALLBACK / DEMO DATA DISCLOSURE */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isMr
                  ? '४. बॅकअप / संदर्भ डेटा धोरण (Fallback Data Disclosure)'
                  : '4. Fallback / Reference Data Transparency'}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {isMr
                ? 'जेव्हा एखाद्या बाजार समितीमध्ये आजचा लिलाव अद्याप पूर्ण झालेला नसतो किंवा सुट्टीमुळे सरकारी डेटा उपलब्ध नसतो, तेव्हा अ‍ॅप स्पष्टपणे "NO VERIFIED DATA TODAY" किंवा "FALLBACK / REFERENCE BASELINE" असा स्पष्ट लेबल दाखवते.'
                : 'When a mandi has not yet concluded its daily auction, is closed for a holiday, or does not report data for the day, AgriTrade explicitly labels the quote as "No Verified Data Today — Reference Baseline" or "Fallback / Demo Data".'}
            </p>
            <p className="text-xs font-semibold text-slate-800">
              {isMr
                ? 'AgriTrade कोणत्याही परिस्थितीत बॅकअप किंवा अंदाज डेटा "थेट अधिकृत डेटा" (Live Official Data) म्हणून सादर करत नाही.'
                : 'AgriTrade never labels fallback, simulated, or demo data as live official data under any circumstance.'}
            </p>
          </div>

          {/* SECTION 5: DISCLAIMER OF WARRANTIES */}
          <div className="pt-4 space-y-2 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 block uppercase text-[10px]">
              {isMr ? '५. सावधगिरीची सूचना (Disclaimer of Warranties)' : '5. Advisory & Disclaimer of Warranties'}
            </span>
            <p>
              {isMr
                ? 'शेतमालाचे दर बाजारातील आवक आणि गुणवत्तेनुसार सतत बदलत असतात. अ‍ॅपमधील माहिती केवळ शेतकरी आणि व्यापाऱ्यांच्या आर्थिक मार्गदर्शनासाठी आहे. प्रत्यक्ष विक्री किंवा खरेदी करण्यापूर्वी स्थानिक APMC बाजार समितीमध्ये जाऊन प्रत्यक्ष पाहणी करावी.'
                : 'Agricultural commodity prices fluctuate rapidly based on supply, demand, grade, and auction conditions. Content is provided solely for informational planning. Users are advised to inspect physical lots at their local APMC before committing to commercial transactions.'}
            </p>
          </div>
        </div>

        {/* 3. Modal Footer */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            AgriTrade • agritrade.in • {isMr ? 'स्वतंत्र कृषी माहिती मंच' : 'Independent Mandi Intelligence'}
          </div>
          <button
            type="button"
            onClick={onClose}
            id="confirm-disclaimer-acknowledged-btn"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            {isMr ? 'मी वाचले व समजले (Close)' : 'I Understand & Acknowledge'}
          </button>
        </div>
      </div>
    </div>
  );
};
