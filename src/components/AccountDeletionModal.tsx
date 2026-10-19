import React, { useState } from 'react';
import { 
  Trash2, 
  ArrowLeft, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2
} from 'lucide-react';
import { SupportedLanguage } from '../services/i18nService';
import { purgeAllLocalUserData } from '../services/authService';

interface AccountDeletionModalProps {
  language: SupportedLanguage;
  mobileNumber?: string;
  onClose: () => void;
  onDeletionSuccess: () => void;
}

export const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  language,
  mobileNumber,
  onClose,
  onDeletionSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Directly purge local data and profile without phone OTP barrier
  const handleConfirmDelete = () => {
    setIsDeleting(true);
    try {
      purgeAllLocalUserData(mobileNumber);
      setIsDeleted(true);
      setTimeout(() => {
        onDeletionSuccess();
      }, 900);
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          {!isDeleted && !isDeleting ? (
            <button
              type="button"
              onClick={onClose}
              className="p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8" />
          )}

          <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>{language === 'mr' ? 'प्रोफाइल हटवा' : 'Delete Profile'}</span>
          </h2>
          <div className="w-8" />
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {isDeleted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {language === 'mr' ? 'प्रोफाइल यशस्वीरित्या हटवली' : 'Profile Deleted Successfully'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'सर्व जतन केलेला डेटा आणि सेटिंग्ज साफ करण्यात आल्या आहेत.'
                  : 'All saved local preferences and market settings have been cleared.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {language === 'mr' ? 'तुमची सेव्ह केलेली प्रोफाइल हटवायची आहे का?' : 'Delete your saved profile and data?'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'mr'
                    ? 'प्रोफाइल हटवल्याने तुमच्या या डिव्हाइसवरील सर्व जतन केलेल्या बाजार समित्या, पसंतीचा शेतमाल आणि वॉचलिस्ट कायमस्वरूपी साफ केली जाईल.'
                    : 'Deleting your profile will permanently clear all your saved APMC mandi preferences, favorite commodities, and local watchlist on this device.'}
                </p>
              </div>

              {/* Data Deletion Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block">
                  {language === 'mr' ? 'खालील माहिती हटवली जाईल:' : 'The following local data will be cleared:'}
                </span>
                <ul className="space-y-1 list-disc list-inside text-slate-600 text-[11px]">
                  <li>{language === 'mr' ? 'निवडलेली मुख्य बाजार समिती (APMC) आणि भूमिकेची माहिती' : 'Selected primary APMC mandi and role settings'}</li>
                  <li>{language === 'mr' ? 'पसंतीची पिके आणि वॉचलिस्ट' : 'Preferred commodities & market watchlist'}</li>
                  <li>{language === 'mr' ? 'कॅल्क्युलेटर आणि स्थानिक दर इतिहास' : 'Saved calculator presets & local history'}</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  id="confirm-delete-continue-btn"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDeleting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{language === 'mr' ? 'होय, प्रोफाइल हटवा' : 'Yes, Delete Profile & Clear Data'}</span>
                  )}
                </button>

                <button
                  type="button"
                  id="confirm-delete-cancel-btn"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
