import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CommodityId, MandiLocation } from '../types';
import { COMMODITIES, MAHARASHTRA_MANDIS } from '../services/mandiDataService';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation, localizeCommodityName, localizeMandiName } from '../locales';

interface StepByStepSelectorProps {
  commodityId: CommodityId;
  selectedMandi: MandiLocation;
  language: SupportedLanguage;
  onBack: () => void;
  onConfirmSelection: (commodityId: CommodityId, variety: string, grade: string, mandi: MandiLocation) => void;
}

export const StepByStepSelector: React.FC<StepByStepSelectorProps> = ({
  commodityId,
  selectedMandi,
  language,
  onBack,
  onConfirmSelection
}) => {
  const isMr = language === 'mr';
  const t = getTranslation(language);

  const commodity = useMemo(() => {
    return COMMODITIES.find(c => c.id === commodityId) || COMMODITIES[0];
  }, [commodityId]);

  const commodityHeading = localizeCommodityName(commodity.id, language, commodity.name, commodity.marathiName);

  // Available varieties based on commodity
  const varietyOptions = useMemo(() => {
    switch (commodityId) {
      case 'onion':
        return [
          { 
            id: 'Red', 
            name: isMr ? 'लाल कांदा' : 'Red Onion', 
            desc: isMr ? 'सर्वात जास्त आवक व मागणी असलेला मुख्य प्रकार.' : 'High arrival volume with strong commercial demand.' 
          },
          { 
            id: 'White', 
            name: isMr ? 'पांढरा कांदा' : 'White Onion', 
            desc: isMr ? 'प्रक्रिया व निर्यातीसाठी उत्तम गुणवत्ता.' : 'Preferred for processing and export markets.' 
          },
          { 
            id: 'Garva', 
            name: isMr ? 'उन्हाळी / गरवा कांदा' : 'Summer / Garva Onion', 
            desc: isMr ? 'उत्कृष्ट साठवणूक क्षमतेचा कांदा.' : 'High shelf life, best for seasonal storage.' 
          },
          { 
            id: 'Other', 
            name: isMr ? 'स्थानिक व इतर वाण' : 'Local & Other Varieties', 
            desc: isMr ? 'सर्वसाधारण स्थानिक लिलाव वाण.' : 'General mixed local auctions.' 
          }
        ];
      case 'soybean':
        return [
          { 
            id: 'Yellow', 
            name: isMr ? 'पिवळा सोयाबीन' : 'Yellow Soybean', 
            desc: isMr ? 'तेल व प्रथिनांसाठी मुख्य प्रमाणित वाण.' : 'Standard commercial variety for oil extraction.' 
          },
          { 
            id: 'Black', 
            name: isMr ? 'काळा सोयाबीन' : 'Black Soybean', 
            desc: isMr ? 'पारंपारिक स्थानिक वाण.' : 'Traditional indigenous crop variety.' 
          },
          { 
            id: 'Other', 
            name: isMr ? 'इतर स्थानिक वाण' : 'Other Local Varieties', 
            desc: isMr ? 'मिश्र स्थानिक वाण.' : 'Mixed farm arrivals.' 
          }
        ];
      case 'cotton':
        return [
          { 
            id: 'Medium Staple', 
            name: isMr ? 'मध्यम लांबी कापूस' : 'Medium Staple Cotton', 
            desc: isMr ? '२४ ते २८ मिमी धागा लांबी.' : '24-28 mm staple fiber length.' 
          },
          { 
            id: 'Long Staple', 
            name: isMr ? 'लांब धागा कापूस' : 'Long Staple Cotton', 
            desc: isMr ? '२८ मिमी पेक्षा अधिक लांबी, उच्च भाव.' : 'Over 28 mm staple fiber, commanding premium prices.' 
          },
          { 
            id: 'Other', 
            name: isMr ? 'स्थानिक कापूस' : 'Local Cotton', 
            desc: isMr ? 'स्थानिक जिनिंग प्रत.' : 'General ginning grade.' 
          }
        ];
      case 'wheat':
        return [
          { 
            id: 'Sharbati', 
            name: isMr ? 'शरबती गहू' : 'Sharbati Wheat', 
            desc: isMr ? 'उत्कृष्ट चव व चपातीसाठी सर्वोत्तम.' : 'Premium golden grain with superior taste.' 
          },
          { 
            id: 'Lokwan', 
            name: isMr ? 'लोकवन गहू' : 'Lokwan Wheat', 
            desc: isMr ? 'महाराष्ट्रात सर्वाधिक मागणी असलेला वाण.' : 'Most widely traded variety across Maharashtra.' 
          },
          { 
            id: 'Kalyan Sona', 
            name: isMr ? 'कल्याण सोना' : 'Kalyan Sona', 
            desc: isMr ? 'मध्यम दाण्याचा प्रमाणित वाण.' : 'Standard medium grain variety.' 
          },
          { 
            id: 'Other', 
            name: isMr ? 'स्थानिक गहू' : 'Local Wheat', 
            desc: isMr ? 'स्थानिक बाजार वाण.' : 'Mixed local grains.' 
          }
        ];
      case 'turmeric':
        return [
          { 
            id: 'Rajapore', 
            name: isMr ? 'राजापुरी हळद' : 'Rajapuri Turmeric', 
            desc: isMr ? 'उच्च कुरकुमिन व जाड गाठी.' : 'High curcumin content with thick fingers.' 
          },
          { 
            id: 'Salem', 
            name: isMr ? 'सेलम हळद' : 'Salem Turmeric', 
            desc: isMr ? 'गडद पिवळा रंग व औषधी दर्जा.' : 'Deep yellow color, medicinal grade.' 
          },
          { 
            id: 'Waigaon', 
            name: isMr ? 'वायगाव हळद' : 'Waigaon Turmeric', 
            desc: isMr ? 'जीआय मानांकन प्राप्त वाण.' : 'GI-tagged authentic traditional variety.' 
          },
          { 
            id: 'Other', 
            name: isMr ? 'इतर हळद' : 'Other Turmeric', 
            desc: isMr ? 'साधारण लिलाव प्रत.' : 'Standard auction grade.' 
          }
        ];
      default:
        return [
          { 
            id: 'Standard', 
            name: isMr ? 'प्रमाणित वाण' : 'Standard Variety', 
            desc: isMr ? 'अधिकृत बाजार समिती वाण.' : 'Officially notified APMC variety.' 
          },
          { 
            id: 'Hybrid', 
            name: isMr ? 'संकरित वाण' : 'Hybrid Variety', 
            desc: isMr ? 'उच्च उत्पादक वाण.' : 'High yield hybrid cultivar.' 
          },
          { 
            id: 'Other', 
            name: isMr ? 'इतर वाण' : 'Other Varieties', 
            desc: isMr ? 'स्थानिक लिलाव प्रकार.' : 'Local unclassified lots.' 
          }
        ];
    }
  }, [commodityId, isMr]);

  // Available grade options
  const gradeOptions = useMemo(() => [
    { 
      id: 'FAQ', 
      name: isMr ? 'उत्कृष्ट प्रत (एफएक्यू)' : 'Grade A / FAQ Quality', 
      desc: isMr ? 'कोरडा, स्वच्छ व एकसारखा दाणा.' : 'Fair Average Quality - clean, dry, uniform produce.' 
    },
    { 
      id: 'Medium', 
      name: isMr ? 'मध्यम प्रत' : 'Grade B / Medium Quality', 
      desc: isMr ? 'साधारण गुणवत्ता किंवा थोडा ओलावा.' : 'Average quality, acceptable moisture or mixed sizing.' 
    },
    { 
      id: 'Low', 
      name: isMr ? 'स्थानिक कमी प्रत' : 'Grade C / Lower Quality', 
      desc: isMr ? 'लहान आकार किंवा डागी माल.' : 'Smaller size, higher moisture or visual defects.' 
    }
  ], [isMr]);

  const [selectedVariety, setSelectedVariety] = useState<string>(varietyOptions[0].id);
  const [selectedGrade, setSelectedGrade] = useState<string>(gradeOptions[0].id);

  // Mandi selection
  const districts = useMemo(() => {
    return Array.from(new Set(MAHARASHTRA_MANDIS.map(m => m.district))).sort();
  }, []);

  const [selectedDistrict, setSelectedDistrict] = useState<string>(selectedMandi.district || districts[0]);
  const [currentMandi, setCurrentMandi] = useState<MandiLocation>(selectedMandi);

  const availableMandisForDistrict = useMemo(() => {
    return MAHARASHTRA_MANDIS.filter(m => m.district === selectedDistrict);
  }, [selectedDistrict]);

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const firstMandi = MAHARASHTRA_MANDIS.find(m => m.district === dist);
    if (firstMandi) {
      setCurrentMandi(firstMandi);
    }
  };

  const handleConfirm = () => {
    const matchedVariety = varietyOptions.find(v => v.id === selectedVariety)?.name || selectedVariety;
    const matchedGrade = gradeOptions.find(g => g.id === selectedGrade)?.name || selectedGrade;
    onConfirmSelection(commodityId, matchedVariety, matchedGrade, currentMandi);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto shadow-2xl">
      {/* Top Header */}
      <div className="pt-5 px-5 pb-3 bg-white border-b border-slate-200/80 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            aria-label={t.back}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              {isMr ? 'तपशीलवार निवड' : 'Step-by-Step Selection'}
            </span>
            <h1 className="text-xl font-black text-slate-900 leading-tight">
              {commodityHeading}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Form */}
      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {/* STEP 1: VARIETY SELECTION */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-black text-slate-900">
              {isMr ? 'वाण निवडा' : 'Select Variety'}
            </h2>
          </div>

          <div className="space-y-2">
            {varietyOptions.map((opt) => {
              const isSelected = selectedVariety === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedVariety(opt.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {opt.name}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: GRADE / QUALITY SELECTION */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-black text-slate-900">
              {isMr ? 'प्रत निवडा' : 'Select Grade'}
            </h2>
          </div>

          <div className="space-y-2">
            {gradeOptions.map((grade) => {
              const isSelected = selectedGrade === grade.id;
              return (
                <div
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {grade.name}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                        {grade.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 3: APMC MANDI SELECTION */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-black text-slate-900">
              {isMr ? 'बाजार समिती निवडा' : 'Select APMC Mandi'}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            {/* State */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {isMr ? 'राज्य' : 'State'}
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-700 flex items-center justify-between">
                <span>{isMr ? 'महाराष्ट्र' : 'Maharashtra'}</span>
                <span className="text-xs text-emerald-800 font-semibold">AGMARKNET Live</span>
              </div>
            </div>

            {/* District Dropdown */}
            <div>
              <label htmlFor="district-select" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {isMr ? 'जिल्हा' : 'District'}
              </label>
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                {districts.map(dist => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Mandi Dropdown */}
            <div>
              <label htmlFor="mandi-select" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {isMr ? 'बाजार समिती' : 'APMC Mandi'}
              </label>
              <select
                id="mandi-select"
                value={currentMandi.name}
                onChange={(e) => {
                  const m = availableMandisForDistrict.find(x => x.name === e.target.value);
                  if (m) setCurrentMandi(m);
                }}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                {availableMandisForDistrict.map(m => (
                  <option key={m.name} value={m.name}>
                    {localizeMandiName(m, language, true)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Continue / View Price CTA */}
      <div className="p-5 bg-white border-t border-slate-200/80 rounded-t-3xl shadow-lg sticky bottom-0 z-20">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{isMr ? 'बाजारभाव पहा' : 'View Market Price'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
