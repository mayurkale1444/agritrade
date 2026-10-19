import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Trash2, Database, Info, ExternalLink } from 'lucide-react';
import { SupportedLanguage } from '../services/i18nService';

interface PrivacyPolicyModalProps {
  language: SupportedLanguage;
  onClose: () => void;
  onNavigateToDeleteAccount?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  language,
  onClose,
  onNavigateToDeleteAccount
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-black text-slate-900">
            {language === 'mr' ? 'गोपनीयता धोरण (Privacy Policy)' : 'Privacy Policy'}
          </h2>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          {/* Trust Banner */}
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-900 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="text-xs font-bold">
              {language === 'mr'
                ? 'AgriTrade – १००% जाहिरातमुक्त आणि खाजगी. फोन नंबर किंवा लॉगिनची कोणतीही सक्ती नाही.'
                : 'AgriTrade – 100% Ad-Free & Private. No phone number or login required.'}
            </span>
          </div>

          {/* Section 1: Data Collection & Zero Login Architecture */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>{language === 'mr' ? '१. माहिती संकलन आणि खाजगी वापर' : '1. Information Collection & Zero-Login Architecture'}</span>
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'mr'
                ? 'AgriTrade मध्ये वापरण्यासाठी कोणत्याही मोबाईल नंबर, पासवर्ड किंवा OTP ची आवश्यकता नाही. सर्व शेतकरी आणि व्यापारी थेट ॲप सुरू करू शकतात.'
                : 'AgriTrade does not collect phone numbers, email addresses, passwords, or SMS OTPs for application usage. All users can access live mandi intelligence immediately without account barriers.'}
            </p>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
              <li>{language === 'mr' ? 'कोणताही मोबाईल नंबर किंवा वैयक्तिक ओळख मागितली जात नाही.' : 'No mobile number or personal identity required.'}</li>
              <li>{language === 'mr' ? 'कोणतीही बँक किंवा आर्थिक माहिती मागितली जात नाही.' : 'No bank, payment, or financial details are collected.'}</li>
              <li>{language === 'mr' ? 'पार्श्वभूमीतील किंवा GPS अचूक स्थान ट्रॅक केले जात नाही.' : 'No GPS tracking; users manually choose their APMC market.'}</li>
            </ul>
          </div>

          {/* Section 2: Local On-Device Data */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-700" />
              <span>{language === 'mr' ? '२. स्थानिक डेटा साठा (On-Device Storage)' : '2. On-Device Local Storage'}</span>
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'mr'
                ? 'तुमच्या सोयीसाठी खालील माहिती केवळ तुमच्या फोनवर (Local Storage) सुरक्षित साठवली जाते:'
                : 'For your dashboard customization, the following preferences are stored locally on your device:'}
            </p>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
              <li>{language === 'mr' ? 'निवडलेली भाषा (मराठी, हिन्दी, English, தமிழ், ಕನ್ನಡ)' : 'Selected language preference'}</li>
              <li>{language === 'mr' ? 'बाजार भूमिकेची निवड (शेतकरी / व्यापारी / कमिशन एजंट)' : 'Selected trade role (Farmer, Trader, Commission Agent)'}</li>
              <li>{language === 'mr' ? 'पसंतीची मुख्य कृषी बाजार समिती (APMC) आणि मुख्य शेतमाल' : 'Primary APMC mandi market and commodities handled'}</li>
              <li>{language === 'mr' ? 'वॉचलिस्ट आणि नफा कॅल्क्युलेटरमधील स्थानिक आकडेमोड' : 'Market watchlist bookmarks and sale calculator presets'}</li>
            </ul>
          </div>

          {/* Section 3: Trader-Submitted Market Rates */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>{language === 'mr' ? '३. स्थानिक व्यापारी दर आणि पोस्टर्स' : '3. Local Trader Rates & Posters'}</span>
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'mr'
                ? 'स्थानिक बाजार समितीतील प्रत्यक्ष खरेदी दर व पोस्टर्स शेतकरी बांधवांच्या माहितीसाठी सार्वजनिकरीत्या प्रदर्शित केले जातात. यात कोणताही खाजगी फोन नंबर प्रदर्शित केला जात नाही.'
                : 'Locally submitted mandi rate posters and quality tiers are published transparently for price comparison. Personal contact numbers are strictly omitted for privacy.'}
            </p>
          </div>

          {/* Section 4: Official Data Source */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-700" />
              <span>{language === 'mr' ? '४. अधिकृत शासकीय डेटा स्रोत' : '4. Official Government Data Source'}</span>
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'mr'
                ? 'AgriTrade मधील अधिकृत बाजार भाव भारत सरकारच्या कृषी व शेतकरी कल्याण मंत्रालयाच्या विपणन आणि तपासणी संचालनालय (AGMARKNET, data.gov.in) कडून प्राप्त केले जातात.'
                : 'Official APMC mandi prices and arrival figures are sourced from the Directorate of Marketing & Inspection (AGMARKNET), Ministry of Agriculture & Farmers Welfare, Government of India (data.gov.in).'}
            </p>
          </div>

          {/* Section 5: Profile Deletion */}
          <div className="space-y-2 p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>{language === 'mr' ? '५. प्रोफाइल आणि डेटा हटवणे' : '5. Profile & Data Deletion'}</span>
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              {language === 'mr'
                ? 'तुम्ही कोणत्याही वेळी सेव्ह केलेली प्रोफाइल आणि स्थानिक डेटा पूर्णपणे हटवू शकता: "सेटिंग्ज (More) → प्रोफाइल हटवा (Delete Profile)". हटवल्यानंतर सर्व स्थानिक सेटिंग्ज तात्काळ साफ होतात.'
                : 'You can delete your saved profile and clear all on-device data at any time via "Settings (More) → Delete Profile". This permanently purges all local bookmarks and settings immediately.'}
            </p>
            {onNavigateToDeleteAccount && (
              <button
                type="button"
                onClick={onNavigateToDeleteAccount}
                className="mt-2 text-xs font-bold text-rose-700 hover:text-rose-900 underline underline-offset-2 cursor-pointer flex items-center gap-1"
              >
                <span>{language === 'mr' ? 'प्रोफाइल हटवण्याच्या पर्यायावर जा' : 'Go to Delete Profile screen'}</span>
              </button>
            )}
          </div>

          {/* Section 6: Contact Information */}
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-800">
              {language === 'mr' ? 'डेव्हलपर आणि संपर्क:' : 'Developer & Inquiries:'}
            </p>
            <p>AgriTrade (in.agritrade.app) • Mayur Kale</p>
            <p>Email: <a href="mailto:mayurkale1444@gmail.com" className="text-emerald-700 font-semibold hover:underline">mayurkale1444@gmail.com</a></p>
            <p className="text-[11px] text-slate-400">Last updated: October 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};
