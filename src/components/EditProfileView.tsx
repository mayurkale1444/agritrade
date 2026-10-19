import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Save, 
  LogOut, 
  Globe, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  Check, 
  Bell, 
  HelpCircle, 
  Info, 
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { UserProfile, TraderUserType, CommodityId } from '../types';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation } from '../locales';
import { ALL_MANDI_LOCATIONS } from '../services/mandiDataService';
import { saveProfileForMobile, logout } from '../services/authService';

interface EditProfileViewProps {
  language: SupportedLanguage;
  userProfile: UserProfile;
  onBack: () => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onProfileUpdated: (updated: UserProfile) => void;
  onLogoutConfirmed: () => void;
}

type EditSectionModal = 'NONE' | 'PERSONAL' | 'LANGUAGE' | 'ROLE' | 'APMC' | 'COMMODITY' | 'SETTINGS_INFO';

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  language,
  userProfile,
  onBack,
  onLanguageChange,
  onProfileUpdated,
  onLogoutConfirmed
}) => {
  const t = getTranslation(language);

  // States
  const [activeModal, setActiveModal] = useState<EditSectionModal>('NONE');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Current values
  const [fullName, setFullName] = useState<string>(userProfile.name || '');
  const [age, setAge] = useState<string>(userProfile.age ? String(userProfile.age) : '');
  const [preferredLang, setPreferredLang] = useState<SupportedLanguage>(
    (userProfile.preferredLanguage as SupportedLanguage) || language
  );
  const [role, setRole] = useState<TraderUserType>(
    userProfile.role || userProfile.userType || 'Trader'
  );
  const [selectedState, setSelectedState] = useState<string>(
    userProfile.state || 'Maharashtra'
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    userProfile.district || 'Nashik'
  );
  const [primaryApmc, setPrimaryApmc] = useState<string>(
    userProfile.mainApmc || 'Nashik APMC'
  );
  const [primaryCmd, setPrimaryCmd] = useState<CommodityId>(
    userProfile.primaryCommodity || 'onion'
  );
  const [handledCmds, setHandledCmds] = useState<CommodityId[]>(
    userProfile.commoditiesHandled && userProfile.commoditiesHandled.length > 0
      ? userProfile.commoditiesHandled
      : [userProfile.primaryCommodity || 'onion']
  );

  // Available locations
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(ALL_MANDI_LOCATIONS.map(m => m.state))).filter(Boolean);
    return ['Maharashtra', ...states.filter(s => s !== 'Maharashtra')];
  }, []);

  const availableDistricts = useMemo(() => {
    const list = ALL_MANDI_LOCATIONS.filter(m => m.state === selectedState).map(m => m.district);
    const set = Array.from(new Set(list)).filter(Boolean);
    return set.length > 0 ? set : ['Nashik', 'Pune', 'Solapur', 'Akola'];
  }, [selectedState]);

  const availableMandisInDistrict = useMemo(() => {
    const list = ALL_MANDI_LOCATIONS.filter(
      m => m.state === selectedState && m.district === selectedDistrict
    );
    if (list.length > 0) return list;
    return ALL_MANDI_LOCATIONS.filter(m => m.state === selectedState);
  }, [selectedState, selectedDistrict]);

  // Masked Mobile Number
  const maskedMobile = userProfile.mobile?.length === 10
    ? `+91 XXXXX ${userProfile.mobile.slice(-5)}`
    : (userProfile.mobileMasked || '+91 XXXXX 43210');

  // Save changes
  const handleSaveProfile = (
    newLang = preferredLang,
    newRole = role,
    newState = selectedState,
    newDist = selectedDistrict,
    newApmc = primaryApmc,
    newCmd = primaryCmd,
    newHandledCmds = handledCmds,
    newName = fullName,
    newAge = age
  ) => {
    const updated: UserProfile = {
      ...userProfile,
      name: newName.trim() || userProfile.name,
      age: newAge.trim() ? parseInt(newAge.trim(), 10) || newAge.trim() : userProfile.age,
      preferredLanguage: newLang,
      role: newRole,
      userType: newRole,
      state: newState,
      district: newDist,
      mainApmc: newApmc,
      primaryCommodity: newCmd,
      commoditiesHandled: newHandledCmds.length > 0 ? newHandledCmds : [newCmd],
      preferredApmcs: [newApmc],
      isOnboarded: true
    };

    saveProfileForMobile(userProfile.mobile, updated);
    if (newLang !== language) {
      onLanguageChange(newLang);
    }
    onProfileUpdated(updated);
    setActiveModal('NONE');
  };

  // Perform Logout
  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    onLogoutConfirmed();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between w-full max-w-md mx-auto shadow-2xl relative font-sans overflow-x-hidden pb-10">
      {/* Top Navigation Bar */}
      <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-black text-slate-900 tracking-tight">
          {language === 'mr' ? 'वापरकर्ता प्रोफाइल' : 'User Profile'}
        </h1>
        <div className="w-5" />
      </header>

      {/* Main Profile Body */}
      <main className="p-4 space-y-5 flex-1">
        {/* User Card with Avatar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 font-black text-xl">
            {fullName ? fullName.trim().charAt(0).toUpperCase() : <User className="w-8 h-8 text-white" />}
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-900">
              {fullName || (language === 'mr' ? 'माझी प्रोफाइल' : 'My Profile')}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {age ? (language === 'mr' ? `वय: ${age} वर्षे • ` : `Age: ${age} • `) : ''}{role} ({primaryApmc.replace(' APMC', '')})
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{maskedMobile}</span>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {language === 'mr' ? 'सत्यापित वापरकर्ता' : 'Verified Member'}
            </span>
          </div>
        </div>

        {/* User Preferences Section */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-2">
            {language === 'mr' ? 'पसंती / प्राधान्ये' : 'Preferences'}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-100">
            {/* 0. Personal Details (Name & Age) */}
            <button
              type="button"
              onClick={() => setActiveModal('PERSONAL')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    {language === 'mr' ? 'वैयक्तिक माहिती (नाव व वय)' : 'Personal Details (Name & Age)'}
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {fullName || (language === 'mr' ? 'अॅग्रीट्रेड वापरकर्ता' : 'AgriTrade User')}
                    {age ? ` • ${age} ${language === 'mr' ? 'वर्षे' : 'yrs'}` : ''}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 1. Language */}
            <button
              type="button"
              onClick={() => setActiveModal('LANGUAGE')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    {language === 'mr' ? 'भाषा' : 'Language'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 capitalize">
                    {preferredLang === 'mr' ? 'Marathi (मराठी)' : preferredLang === 'hi' ? 'Hindi (हिन्दी)' : preferredLang === 'en' ? 'English' : preferredLang === 'ta' ? 'Tamil (தமிழ்)' : 'Kannada (ಕನ್ನಡ)'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 2. Role */}
            <button
              type="button"
              onClick={() => setActiveModal('ROLE')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    {language === 'mr' ? 'भूमिका (Trader Type)' : 'Role / Trader Type'}
                  </div>
                  <div className="text-sm font-bold text-slate-900">{role}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 3. Primary APMC & Location */}
            <button
              type="button"
              onClick={() => setActiveModal('APMC')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    {language === 'mr' ? 'मुख्य बाजार समिती व स्थान' : 'Primary APMC & Location'}
                  </div>
                  <div className="text-sm font-bold text-slate-900">{primaryApmc}</div>
                  <div className="text-[11px] text-slate-500">{selectedDistrict}, {selectedState}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 4. Commodities Handled & Primary Commodity */}
            <button
              type="button"
              onClick={() => setActiveModal('COMMODITY')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">🧅</span>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    {language === 'mr' ? 'शेतमाल व प्रमुख शेतमाल' : 'Commodities & Primary Commodity'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 capitalize flex items-center gap-1.5">
                    <span>{primaryCmd}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">Primary</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {handledCmds.length} {language === 'mr' ? 'शेतमाल निवडले' : 'commodities selected'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Settings Group */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-2">
            {language === 'mr' ? 'सेटिंग्ज' : 'Settings'}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-100">
            <button
              type="button"
              onClick={() => setActiveModal('SETTINGS_INFO')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-bold text-slate-800">
                  {language === 'mr' ? 'सूचना आणि अपडेट्स' : 'Notifications'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('SETTINGS_INFO')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-bold text-slate-800">
                  {language === 'mr' ? 'मदत आणि संपर्क' : 'Help & Support'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('SETTINGS_INFO')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-bold text-slate-800">
                  {language === 'mr' ? 'AgriTrade बद्दल' : 'About AgriTrade'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* LOGOUT BUTTON (Red bordered button at bottom) */}
        <div className="pt-4">
          <button
            type="button"
            id="profile-logout-btn"
            onClick={() => setShowLogoutModal(true)}
            className="w-full py-4 px-5 rounded-2xl bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout || 'LOG OUT'}</span>
          </button>
        </div>
      </main>

      {/* ========================================================
          EDIT MODALS
      ======================================================== */}

      {/* 0. EDIT PERSONAL DETAILS (NAME + AGE) MODAL */}
      {activeModal === 'PERSONAL' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {language === 'mr' ? 'वैयक्तिक माहिती बदला' : 'Edit Personal Details'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal('NONE')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {t.cancel || 'Cancel'}
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'mr' ? 'उदा. रमेश पाटील' : 'e.g. Ramesh Patil'}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'mr' ? 'वय (वर्षे)' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="16"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={language === 'mr' ? 'उदा. 35' : 'e.g. 35'}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                🔒 {language === 'mr' ? 'ही माहिती केवळ आपल्या डिव्हाइसवर स्थानिकरित्या सेव्ह केली जाते.' : 'This information is only saved locally on your device.'}
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal('NONE')}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                {t.cancel || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleSaveProfile(preferredLang, role, selectedState, selectedDistrict, primaryApmc, primaryCmd, handledCmds, fullName, age)}
                className="flex-1 py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 cursor-pointer transition-colors shadow-xs"
              >
                {t.saveChanges || 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. EDIT LANGUAGE MODAL */}
      {activeModal === 'LANGUAGE' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Select Language</h3>
              <button
                type="button"
                onClick={() => setActiveModal('NONE')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-2">
              {[
                { code: 'mr', label: 'मराठी', subLabel: 'Marathi', flag: '🇮🇳' },
                { code: 'hi', label: 'हिन्दी', subLabel: 'Hindi', flag: '🇮🇳' },
                { code: 'en', label: 'English', subLabel: 'English', flag: '🇮🇳' },
                { code: 'ta', label: 'தமிழ்', subLabel: 'Tamil', flag: '🇮🇳' },
                { code: 'kn', label: 'ಕನ್ನಡ', subLabel: 'Kannada', flag: '🇮🇳' }
              ].map(opt => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setPreferredLang(opt.code as SupportedLanguage);
                    handleSaveProfile(opt.code as SupportedLanguage);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    preferredLang === opt.code
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{opt.flag}</span>
                    <span>{opt.label} ({opt.subLabel})</span>
                  </div>
                  {preferredLang === opt.code && <Check className="w-5 h-5 text-emerald-700" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT ROLE MODAL */}
      {activeModal === 'ROLE' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Select Role</h3>
              <button
                type="button"
                onClick={() => setActiveModal('NONE')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-2">
              {[
                { key: 'Trader', label: 'Trader / व्यापारी' },
                { key: 'Wholesaler', label: 'Wholesaler / घाऊक व्यापारी' },
                { key: 'Commission Agent', label: 'Commission Agent / आडत्या' },
                { key: 'Farmer', label: 'Farmer / शेतकरी' },
                { key: 'Supplier', label: 'Supplier / पुरवठादार' },
                { key: 'Exporter', label: 'Exporter / निर्यातदार' },
                { key: 'Other', label: 'Other / इतर' }
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setRole(opt.key as TraderUserType);
                    handleSaveProfile(preferredLang, opt.key as TraderUserType);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    role === opt.key
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <span>{opt.label}</span>
                  {role === opt.key && <Check className="w-5 h-5 text-emerald-700" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. EDIT PRIMARY APMC MODAL */}
      {activeModal === 'APMC' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Primary APMC & Location</h3>
              <button
                type="button"
                onClick={() => setActiveModal('NONE')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">State</label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      const st = e.target.value;
                      setSelectedState(st);
                      const m = ALL_MANDI_LOCATIONS.find(loc => loc.state === st);
                      if (m) {
                        setSelectedDistrict(m.district);
                        setPrimaryApmc(m.name);
                      }
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 appearance-none"
                  >
                    {availableStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">District</label>
                <div className="relative">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      const dist = e.target.value;
                      setSelectedDistrict(dist);
                      const m = ALL_MANDI_LOCATIONS.find(loc => loc.state === selectedState && loc.district === dist);
                      if (m) setPrimaryApmc(m.name);
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 appearance-none"
                  >
                    {availableDistricts.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">APMC / Market</label>
                <div className="relative">
                  <select
                    value={primaryApmc}
                    onChange={(e) => setPrimaryApmc(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 appearance-none"
                  >
                    {availableMandisInDistrict.map(mandi => (
                      <option key={mandi.id} value={mandi.name}>{mandi.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSaveProfile(preferredLang, role, selectedState, selectedDistrict, primaryApmc)}
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm cursor-pointer mt-3"
              >
                Save APMC & Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. EDIT COMMODITIES & PRIMARY COMMODITY MODAL */}
      {activeModal === 'COMMODITY' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Commodities & Primary Filter</h3>
                <p className="text-xs text-slate-500">Select commodities handled. Mark one as Primary.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('NONE')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-950">
                Primary: <strong className="uppercase">{primaryCmd}</strong>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                DEFAULT FILTER
              </span>
            </div>

            <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
              {[
                { id: 'onion', name: 'Onion / कांदा', emoji: '🧅' },
                { id: 'soybean', name: 'Soybean / सोयाबीन', emoji: '🌾' },
                { id: 'cotton', name: 'Cotton / कापूस', emoji: '☁️' },
                { id: 'turmeric', name: 'Turmeric / हळद', emoji: '🫚' },
                { id: 'wheat', name: 'Wheat / गहू', emoji: '🌾' },
                { id: 'maize', name: 'Maize / मका', emoji: '🌽' },
                { id: 'tomato', name: 'Tomato / टोमॅटो', emoji: '🍅' },
                { id: 'potato', name: 'Potato / बटाटा', emoji: '🥔' },
                { id: 'garlic', name: 'Garlic / लसूण', emoji: '🧄' },
                { id: 'chilli', name: 'Chilli / मिरची', emoji: '🌶️' },
                { id: 'gram', name: 'Gram / हरभरा', emoji: '🫘' }
              ].map(cmd => {
                const isSelected = handledCmds.includes(cmd.id as CommodityId);
                const isPrimary = primaryCmd === cmd.id;

                return (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      let updated: CommodityId[];
                      if (isSelected) {
                        if (handledCmds.length === 1) return;
                        updated = handledCmds.filter(id => id !== cmd.id);
                        if (primaryCmd === cmd.id) {
                          setPrimaryCmd(updated[0]);
                        }
                      } else {
                        updated = [...handledCmds, cmd.id as CommodityId];
                      }
                      setHandledCmds(updated);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? isPrimary
                          ? 'border-emerald-600 bg-emerald-50 font-bold'
                          : 'border-emerald-300 bg-emerald-50/40 text-slate-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{cmd.emoji}</span>
                      <span className="text-sm font-semibold">{cmd.name}</span>
                      {isPrimary && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                          ★ PRIMARY
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrimaryCmd(cmd.id as CommodityId);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            isPrimary ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-100'
                          }`}
                        >
                          {isPrimary ? '★ Primary' : 'Make Primary'}
                        </button>
                      )}
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleSaveProfile(preferredLang, role, selectedState, selectedDistrict, primaryApmc, primaryCmd, handledCmds)}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm cursor-pointer mt-2"
            >
              Save Commodities
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS GENERIC INFO MODAL */}
      {activeModal === 'SETTINGS_INFO' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">AgriTrade v1.0.0</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mandi intelligence and daily auction rates platform. Prepared for Google Play Store testing.
            </p>
            <button
              type="button"
              onClick={() => setActiveModal('NONE')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          LOGOUT CONFIRMATION MODAL
      ======================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-5 text-center border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {t.logoutConfirmTitle || 'Are you sure you want to log out?'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.logoutConfirmSubtitle || 'You will return to the login screen. Your saved preferences and reports remain safe.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                id="cancel-logout-btn"
                onClick={() => setShowLogoutModal(false)}
                className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer transition-colors"
              >
                CANCEL
              </button>

              <button
                type="button"
                id="confirm-logout-btn"
                onClick={handleConfirmLogout}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs tracking-wider uppercase cursor-pointer transition-colors shadow-md shadow-rose-900/20"
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
