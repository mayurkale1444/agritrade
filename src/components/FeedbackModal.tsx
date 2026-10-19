import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  X, 
  Building2
} from 'lucide-react';
import { UserProfile } from '../types';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation } from '../locales';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile | null;
  language?: SupportedLanguage;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  language = 'mr'
}) => {
  const t = getTranslation((language as SupportedLanguage) || 'mr');
  const [category, setCategory] = useState<'rate_issue' | 'mandi_request' | 'feature_request' | 'general'>('rate_issue');
  const [apmcName, setApmcName] = useState(userProfile?.mainApmc || '');
  const [message, setMessage] = useState('');
  const [contactName, setContactName] = useState(userProfile?.name || '');
  const [contactMobile, setContactMobile] = useState(userProfile?.mobile || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const existing = JSON.parse(localStorage.getItem('agritrade_feedback_log_v1') || '[]');
      const newFeedback = {
        id: `fb-${Date.now()}`,
        category,
        apmcName,
        message: message.trim(),
        contactName: contactName.trim(),
        contactMobile: contactMobile.trim(),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('agritrade_feedback_log_v1', JSON.stringify([newFeedback, ...existing]));
    } catch (e) {
      console.warn('Could not save feedback:', e);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }, 400);
  };

  const categories = [
    { id: 'rate_issue', label: t.feedbackCategory_rate_issue },
    { id: 'mandi_request', label: t.feedbackCategory_mandi_request },
    { id: 'feature_request', label: t.feedbackCategory_feature_request },
    { id: 'general', label: t.feedbackCategory_general }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {t.feedbackTitle}
              </h3>
              <p className="text-[10px] text-slate-500">
                {t.helpUsImprove}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            aria-label={t.cancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1 font-sans">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-slate-900">
                {t.feedbackSubmitted}
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                {t.feedbackThankYou}
              </p>
            </div>
          ) : (
            <>
              {/* Category */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-slate-700 uppercase">
                  {t.categoryLabel} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-2 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        category === cat.id
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* APMC Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-slate-700 uppercase">
                  {t.associatedMandi}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={apmcName}
                    onChange={(e) => setApmcName(e.target.value)}
                    placeholder={t.associatedMandiPlaceholder}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Feedback Message */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-slate-700 uppercase">
                  {t.feedbackMessageLabel || t.feedbackTitle} *
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder={t.feedbackPlaceholder}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-600 uppercase">
                    {t.contactNameLabel}
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-600 uppercase">
                    {t.contactMobileLabel}
                  </label>
                  <input
                    type="tel"
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{t.submitFeedbackBtn}</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
