import React, { useState, useMemo } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Globe, 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  User,
  Calendar
} from 'lucide-react';
import { 
  UserProfile, 
  TraderUserType, 
  CommodityId
} from '../types';
import { ALL_MANDI_LOCATIONS, COMMODITIES } from '../services/mandiDataService';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation, localizeMandiName, localizeCommodityName } from '../locales';

interface TraderOnboardingProps {
  language: SupportedLanguage;
  mobile: string;
  initialProfile?: UserProfile | null;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onComplete: (profile: UserProfile) => void;
}

export const TraderOnboarding: React.FC<TraderOnboardingProps> = ({
  language,
  mobile,
  initialProfile,
  onLanguageChange,
  onComplete
}) => {
  const t = getTranslation(language);

  // Steps: 
  // 1: Personal Details (Name + Age)
  // 2: Language Selection
  // 3: Role Selection
  // 4: Primary APMC (State -> District -> Mandi)
  // 5: Primary Commodity
  // 6: Confirmation / Review & Complete
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Question 1: Personal Details (Name & Age)
  const [fullName, setFullName] = useState<string>(initialProfile?.name || '');
  const [age, setAge] = useState<string>(initialProfile?.age ? String(initialProfile.age) : '');

  // Question 2: Language (Exactly 5 options)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);
  const languageOptions: { code: SupportedLanguage; label: string; subLabel: string; flag: string }[] = [
    { code: 'mr', label: 'मराठी', subLabel: 'Marathi', flag: '🇮🇳' },
    { code: 'hi', label: 'हिन्दी', subLabel: 'Hindi', flag: '🇮🇳' },
    { code: 'en', label: 'English', subLabel: 'English', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', subLabel: 'Tamil', flag: '🇮🇳' },
    { code: 'kn', label: 'ಕನ್ನಡ', subLabel: 'Kannada', flag: '🇮🇳' }
  ];

  // Question 3: Role
  const roleOptions: { key: TraderUserType; label: string; subLabel: string }[] = useMemo(() => [
    { key: 'Trader', label: t.roleTrader, subLabel: 'Trader' },
    { key: 'Wholesaler', label: t.roleWholesaler, subLabel: 'Wholesaler' },
    { key: 'Commission Agent', label: t.roleCommissionAgent, subLabel: 'Commission Agent' },
    { key: 'Farmer', label: t.roleFarmer, subLabel: 'Farmer' },
    { key: 'Supplier', label: t.roleSupplier, subLabel: 'Supplier' },
    { key: 'Exporter', label: t.userTypeExporter || 'Exporter', subLabel: 'Exporter' },
    { key: 'Other', label: t.roleOther, subLabel: 'Other' }
  ], [t]);
  const [selectedRole, setSelectedRole] = useState<TraderUserType>(
    initialProfile?.role || initialProfile?.userType || 'Trader'
  );

  // Question 4: Primary APMC
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(ALL_MANDI_LOCATIONS.map(m => m.state))).filter(Boolean);
    return ['Maharashtra', ...states.filter(s => s !== 'Maharashtra')];
  }, []);

  const [selectedState, setSelectedState] = useState<string>(
    initialProfile?.state || 'Maharashtra'
  );

  const availableDistricts = useMemo(() => {
    const list = ALL_MANDI_LOCATIONS.filter(m => m.state === selectedState).map(m => m.district);
    const set = Array.from(new Set(list)).filter(Boolean);
    return set.length > 0 ? set : ['Nashik', 'Pune', 'Solapur', 'Akola'];
  }, [selectedState]);

  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    initialProfile?.district || 'Nashik'
  );

  const availableMandisInDistrict = useMemo(() => {
    const list = ALL_MANDI_LOCATIONS.filter(
      m => m.state === selectedState && m.district === selectedDistrict
    );
    if (list.length > 0) return list;
    return ALL_MANDI_LOCATIONS.filter(m => m.state === selectedState);
  }, [selectedState, selectedDistrict]);

  const [selectedPrimaryApmc, setSelectedPrimaryApmc] = useState<string>(
    initialProfile?.mainApmc || 'Nashik APMC'
  );

  // Question 5: Commodities Handled & Primary Commodity
  const supportedCommodities: { id: CommodityId; name: string; marathiName: string; emoji: string }[] = [
    { id: 'onion', name: 'Onion', marathiName: 'कांदा', emoji: '🧅' },
    { id: 'soybean', name: 'Soybean', marathiName: 'सोयाबीन', emoji: '🌾' },
    { id: 'cotton', name: 'Cotton', marathiName: 'कापूस', emoji: '☁️' },
    { id: 'turmeric', name: 'Turmeric', marathiName: 'हळद', emoji: '🫚' },
    { id: 'wheat', name: 'Wheat', marathiName: 'गहू', emoji: '🌾' },
    { id: 'maize', name: 'Maize', marathiName: 'मका', emoji: '🌽' },
    { id: 'tomato', name: 'Tomato', marathiName: 'टोमॅटो', emoji: '🍅' },
    { id: 'potato', name: 'Potato', marathiName: 'बटाटा', emoji: '🥔' },
    { id: 'garlic', name: 'Garlic', marathiName: 'लसूण', emoji: '🧄' },
    { id: 'chilli', name: 'Chilli', marathiName: 'मिरची', emoji: '🌶️' },
    { id: 'gram', name: 'Gram (Chana)', marathiName: 'हरभरा', emoji: '🫘' }
  ];

  const [selectedCommodities, setSelectedCommodities] = useState<CommodityId[]>(() => {
    if (initialProfile?.commoditiesHandled && initialProfile.commoditiesHandled.length > 0) {
      return initialProfile.commoditiesHandled;
    }
    if (initialProfile?.primaryCommodity) {
      return [initialProfile.primaryCommodity];
    }
    return ['onion'];
  });

  const [selectedPrimaryCommodity, setSelectedPrimaryCommodity] = useState<CommodityId>(
    initialProfile?.primaryCommodity || 'onion'
  );

  // Toggle commodity selection
  const handleToggleCommodity = (cmdId: CommodityId) => {
    if (selectedCommodities.includes(cmdId)) {
      if (selectedCommodities.length === 1) {
        return;
      }
      const updated = selectedCommodities.filter(id => id !== cmdId);
      setSelectedCommodities(updated);
      if (selectedPrimaryCommodity === cmdId) {
        setSelectedPrimaryCommodity(updated[0]);
      }
    } else {
      const updated = [...selectedCommodities, cmdId];
      setSelectedCommodities(updated);
    }
  };

  const handleSetPrimaryCommodity = (cmdId: CommodityId, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCommodities.includes(cmdId)) {
      setSelectedCommodities(prev => [...prev, cmdId]);
    }
    setSelectedPrimaryCommodity(cmdId);
  };

  // Navigation handlers
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      onLanguageChange(selectedLanguage);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setCurrentStep(6);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  // Completion
  const handleFinish = () => {
    const finalProfile: UserProfile = {
      id: initialProfile?.id || `trader-${mobile}`,
      name: fullName.trim() || initialProfile?.name || `${selectedRole} (${selectedPrimaryApmc.replace(' APMC', '')})`,
      age: age.trim() ? parseInt(age.trim(), 10) || age.trim() : undefined,
      mobile,
      mobileMasked: `+91 XXXXX ${mobile.slice(-5)}`,
      preferredLanguage: selectedLanguage,
      userType: selectedRole,
      role: selectedRole,
      state: selectedState,
      district: selectedDistrict,
      mainApmc: selectedPrimaryApmc,
      primaryCommodity: selectedPrimaryCommodity,
      commoditiesHandled: selectedCommodities.length > 0 ? selectedCommodities : [selectedPrimaryCommodity],
      operationType: selectedRole === 'Farmer' ? 'Selling' : 'Both',
      preferredApmcs: [selectedPrimaryApmc],
      isOnboarded: true
    };

    onComplete(finalProfile);
  };

  const isMr = language === 'mr' || selectedLanguage === 'mr';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between w-full max-w-md mx-auto shadow-2xl relative font-sans overflow-x-hidden">
      {/* Top Bar with Step Progress (1 to 5) */}
      {currentStep <= 5 ? (
        <div className="p-5 pb-2">
          {/* Header row with back button & step indicator */}
          <div className="flex items-center justify-between pb-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="p-1.5 -ml-1 rounded-xl text-slate-700 hover:bg-slate-200 cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-8" />
            )}

            <div className="text-xs font-bold text-slate-500 font-mono">
              {currentStep} {t.onboardingStepOf || 'of'} 5
            </div>

            <div className="w-8" />
          </div>

          {/* Progress Bar (20%, 40%, 60%, 80%, 100%) */}
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-700 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${currentStep * 20}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="p-5 pb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(5)}
            className="p-1.5 -ml-1 rounded-xl text-slate-700 hover:bg-slate-200 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-emerald-800">AgriTrade Profile</span>
          <div className="w-5" />
        </div>
      )}

      {/* QUESTION SCREENS */}
      <div className="flex-1 px-5 py-3 flex flex-col justify-between">
        {/* ========================================================
            QUESTION 1: PERSONAL DETAILS (NAME + AGE)
        ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {isMr ? 'तुमची वैयक्तिक माहिती' : 'Personal Details'}
              </h1>
              <p className="text-xs text-slate-600">
                {isMr
                  ? 'अचूक बाजार भाव आणि हिशोबासाठी आपले नाव व वय प्रविष्ट करा.'
                  : 'Enter your name and age to personalize your agricultural market intelligence.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 pt-4 text-left">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isMr ? 'पूर्ण नाव' : 'Full Name'}</span>
                </label>
                <input
                  type="text"
                  id="onboarding-full-name-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleNextStep(); }}
                  placeholder={isMr ? 'उदा. रमेश पाटील' : 'e.g. Ramesh Patil'}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isMr ? 'वय (वर्षे)' : 'Age (Years)'}</span>
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="16"
                  max="100"
                  id="onboarding-age-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleNextStep(); }}
                  placeholder={isMr ? 'उदा. 35' : 'e.g. 35'}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-900 leading-snug">
                🔒 {isMr ? 'ही माहिती फक्त आपल्या डिव्हाइसवर सुरक्षित ठेवली जाते आणि कोणत्याही सार्वजनिक पटलावर दाखवली जात नाही.' : 'Stored securely on your device for localized market intelligence and never displayed publicly.'}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            QUESTION 2: PREFERRED LANGUAGE
        ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {t.stepLanguageTitle}
              </h1>
              <p className="text-xs text-slate-600">
                {t.stepLanguageSubtitle}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {languageOptions.map((opt) => {
                const isSelected = selectedLanguage === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(opt.code);
                      onLanguageChange(opt.code);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{opt.flag}</span>
                      <div>
                        <div className="text-sm font-black text-slate-900 leading-tight">
                          {opt.label}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {opt.subLabel}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            QUESTION 3: TRADER ROLE / TYPE
        ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {t.stepRoleTitle}
              </h1>
              <p className="text-xs text-slate-600">
                {t.stepRoleSubtitle}
              </p>
            </div>

            <div className="space-y-2.5 pt-2 max-h-[50vh] overflow-y-auto pr-1">
              {roleOptions.map((opt) => {
                const isSelected = selectedRole === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedRole(opt.key)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 leading-tight">
                          {opt.label}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {opt.subLabel}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            QUESTION 4: PRIMARY APMC (State -> District -> Market)
        ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {t.stepPrimaryApmcTitle}
              </h1>
              <p className="text-xs text-slate-600">
                {t.stepPrimaryApmcSubtitle}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 pt-4">
              {/* State */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {t.state || 'State'}
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      const st = e.target.value;
                      setSelectedState(st);
                      const matchingDist = ALL_MANDI_LOCATIONS.find(m => m.state === st);
                      if (matchingDist) {
                        setSelectedDistrict(matchingDist.district);
                        setSelectedPrimaryApmc(matchingDist.name);
                      }
                    }}
                    className="w-full p-3.5 pr-10 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 appearance-none focus:outline-hidden focus:border-emerald-700 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {availableStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {t.district || 'District'}
                </label>
                <div className="relative">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      const dist = e.target.value;
                      setSelectedDistrict(dist);
                      const matchingMandi = ALL_MANDI_LOCATIONS.find(
                        m => m.state === selectedState && m.district === dist
                      );
                      if (matchingMandi) {
                        setSelectedPrimaryApmc(matchingMandi.name);
                      }
                    }}
                    className="w-full p-3.5 pr-10 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 appearance-none focus:outline-hidden focus:border-emerald-700 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {availableDistricts.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* APMC / Market */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {t.apmcMarket || 'APMC / Market'}
                </label>
                <div className="relative">
                  <select
                    value={selectedPrimaryApmc}
                    onChange={(e) => setSelectedPrimaryApmc(e.target.value)}
                    className="w-full p-3.5 pr-10 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 appearance-none focus:outline-hidden focus:border-emerald-700 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {availableMandisInDistrict.map(mandi => (
                      <option key={mandi.id} value={mandi.name}>
                        {mandi.name} {mandi.isMajorAPMC ? '⭐' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            QUESTION 5: COMMODITIES & PRIMARY COMMODITY
        ======================================================== */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {t.whichCommoditiesTrade}
              </h1>
              <p className="text-xs text-slate-600">
                {t.selectPrimaryCommodityPrompt}
              </p>
            </div>

            {/* Primary commodity indicator banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">⭐</span>
                <div>
                  <span className="font-bold text-emerald-950 block">
                    {t.primaryCommodityLabel}
                  </span>
                  <span className="text-emerald-800 font-medium">
                    {localizeCommodityName(selectedPrimaryCommodity, language)}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 uppercase">
                {t.defaultFilterBadge}
              </span>
            </div>

            <div className="space-y-2 pt-1 max-h-[46vh] overflow-y-auto pr-1">
              {supportedCommodities.map((cmd) => {
                const isSelected = selectedCommodities.includes(cmd.id);
                const isPrimary = selectedPrimaryCommodity === cmd.id;

                return (
                  <div
                    key={cmd.id}
                    onClick={() => handleToggleCommodity(cmd.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? isPrimary
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500/30'
                          : 'border-emerald-300 bg-emerald-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-2xl leading-none">{cmd.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">
                            {localizeCommodityName(cmd.id, language)}
                          </span>
                          {isPrimary && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[9px] uppercase tracking-wide">
                              {t.isPrimary}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => handleSetPrimaryCommodity(cmd.id, e)}
                          className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                            isPrimary
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                          title="Set as primary commodity"
                        >
                          {isPrimary ? t.isPrimary : t.makePrimary}
                        </button>
                      )}

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 6: ONBOARDING COMPLETE & REVIEW
        ======================================================== */}
        {currentStep === 6 && (
          <div className="space-y-4 text-center my-auto">
            {/* Sunburst Checkmark Badge */}
            <div className="relative inline-flex items-center justify-center my-1">
              <div className="w-16 h-16 rounded-full bg-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-700/20">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <div className="absolute -left-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <div className="absolute -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {t.welcomeTitle}
              </h1>
              <p className="text-xs font-bold text-emerald-800">
                {t.appCustomizedTitle}
              </p>
              <p className="text-[11px] text-slate-600 px-3 leading-relaxed">
                {t.preferencesReady}
              </p>
            </div>

            {/* Dynamic Customization Summary Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs text-left space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Profile Details
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[9px] font-extrabold uppercase">
                  READY
                </span>
              </div>

              <div className="grid grid-cols-[110px_1fr] text-xs gap-y-2.5">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Name & Age</span>
                </span>
                <span className="font-bold text-slate-900">
                  {fullName.trim() || 'AgriTrade User'} {age ? `(${age} yrs)` : ''}
                </span>

                <span className="text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Trader Type</span>
                </span>
                <span className="font-bold text-slate-900">
                  {selectedRole}
                </span>

                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Location</span>
                </span>
                <span className="font-bold text-slate-900">
                  {selectedDistrict}, {selectedState}
                </span>

                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Primary APMC</span>
                </span>
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <span>{selectedPrimaryApmc}</span>
                  <span className="text-[10px]">⭐</span>
                </span>

                <span className="text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Primary Item</span>
                </span>
                <span className="font-bold text-slate-900 capitalize flex items-center gap-1">
                  <span>{supportedCommodities.find(c => c.id === selectedPrimaryCommodity)?.emoji}</span>
                  <span>{localizeCommodityName(selectedPrimaryCommodity, language)}</span>
                </span>

                <span className="text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Commodities</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedCommodities.map(cId => {
                    return (
                      <span key={cId} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold">
                        {localizeCommodityName(cId, language)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BUTTON */}
        <div className="pt-3">
          {currentStep <= 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10 cursor-pointer transition-all"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10 cursor-pointer transition-all"
            >
              <span>{t.startUsingApp}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
