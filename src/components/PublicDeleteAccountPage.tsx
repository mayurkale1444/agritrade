import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  ChevronDown, 
  ArrowLeft,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { sendOtp, deleteAccount, validateIndianMobile, cleanIndianMobile } from '../services/authService';

export const PublicDeleteAccountPage: React.FC = () => {
  const [lang, setLang] = useState<'mr' | 'en'>('mr');
  const [step, setStep] = useState<'MOBILE' | 'OTP' | 'PROCESSING' | 'SUCCESS' | 'FAILURE'>('MOBILE');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown Timer
  useEffect(() => {
    if (step !== 'OTP' || resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const clean = cleanIndianMobile(mobileNumber);
    if (!validateIndianMobile(clean)) {
      setErrorMessage(lang === 'mr' ? 'कृपया १० अंकी वैध भारतीय मोबाईल नंबर टाका.' : 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtp(clean);
      if (res.success) {
        setStep('OTP');
        setResendCooldown(res.resendCooldownSeconds || 30);
        setDevOtpHint(res.devOtpHint || null);
        setOtpDigits(['', '', '', '', '', '']);
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 150);
      } else {
        setErrorMessage(res.message || (lang === 'mr' ? 'ओटीपी पाठवता आला नाही.' : 'Failed to send OTP.'));
      }
    } catch {
      setErrorMessage(lang === 'mr' ? 'सर्व्हरशी संपर्क होऊ शकला नाही.' : 'Unable to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const clean = cleanIndianMobile(mobileNumber);
      const res = await sendOtp(clean);
      if (res.success) {
        setResendCooldown(res.resendCooldownSeconds || 30);
        setDevOtpHint(res.devOtpHint || null);
        setOtpDigits(['', '', '', '', '', '']);
        otpInputsRef.current[0]?.focus();
      } else {
        setErrorMessage(res.message || 'Failed to resend code');
      }
    } catch {
      setErrorMessage(lang === 'mr' ? 'ओटीपी पुन्हा पाठवता आला नाही.' : 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Digit Input
  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage(null);
    const cleaned = val.replace(/\D/g, '');

    if (cleaned.length > 1) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = cleaned[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(cleaned.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    if (cleaned && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Confirm and Execute Deletion
  const handleConfirmDeletion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage(lang === 'mr' ? 'कृपया संपूर्ण ६ अंकी ओटीपी टाका.' : 'Please enter full 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStep('PROCESSING');

    try {
      const clean = cleanIndianMobile(mobileNumber);
      const res = await deleteAccount(clean, fullOtp);
      if (res.success) {
        setStep('SUCCESS');
      } else {
        setErrorMessage(res.message);
        setStep('FAILURE');
      }
    } catch {
      setStep('FAILURE');
    } finally {
      setIsLoading(false);
    }
  };

  const clean = cleanIndianMobile(mobileNumber);
  const maskedMobile = clean.length === 10
    ? `+91 ${clean.slice(0, 2)}******${clean.slice(8)}`
    : `+91 ${clean}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 text-slate-900 no-underline">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight block">AgriTrade</span>
              <span className="text-[10px] text-emerald-800 font-semibold block">
                {lang === 'mr' ? 'खाते व डेटा व्यवस्थापन' : 'Account & Data Management'}
              </span>
            </div>
          </a>

          {/* Language Switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
            <button
              type="button"
              onClick={() => setLang('mr')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                lang === 'mr' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मराठी
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                lang === 'en' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Compliance Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>{lang === 'mr' ? 'खाते व डेटा कायमस्वरूपी हटवा' : 'Permanent Account & Data Deletion'}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'mr' ? 'AgriTrade खाते हटवण्याची विनंती' : 'Request AgriTrade Account Deletion'}
          </h1>

          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'mr'
              ? 'गुगल प्ले स्टोअर नियमांनुसार (Google Play Account Deletion Policy), जर तुम्ही AgriTrade अ‍ॅप अनइन्स्टॉल केले असेल तरीही तुम्ही या अधिकृत वेबपेजवरून तुमचा नोंदणीकृत मोबाईल नंबर वापरून तुमचे खाते आणि संबंधित सर्व वैयक्तिक डेटा तात्काळ कायमस्वरूपी हटवू शकता.'
              : 'In accordance with Google Play’s Account Deletion Policy, users who have uninstalled the AgriTrade app can request the permanent deletion of their account and all associated personal data via this official web resource.'}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block">
              {lang === 'mr' ? 'हटवला जाणारा डेटा:' : 'Data Deleted Upon Verification:'}
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li>{lang === 'mr' ? 'मोबाईल नंबर आणि प्रमाणीकरण टोकन्स' : 'Mobile number identity & authentication session tokens'}</li>
              <li>{lang === 'mr' ? 'बाजार समिती प्राधान्ये, भूमिका व शेतमाल' : 'Saved APMC mandi preferences, user role & commodities'}</li>
              <li>{lang === 'mr' ? 'वॉचलिस्ट आणि जतन केलेला शेतमाल डेटा' : 'Watchlists and bookmarked market prices'}</li>
              <li>{lang === 'mr' ? 'वापरकर्त्याने नोंदवलेले स्थानिक दर आणि अभिप्राय' : 'User-submitted local mandi rates and feedback records'}</li>
            </ul>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          
          {/* STEP 1: ENTER MOBILE */}
          {step === 'MOBILE' && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label htmlFor="pub-mobile-input" className="block text-xs font-bold text-slate-700">
                  {lang === 'mr' ? 'नोंदणीकृत १० अंकी मोबाईल नंबर' : 'Registered 10-Digit Mobile Number'}
                </label>
                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-300 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-500/20 overflow-hidden transition-all">
                  <div className="px-3 py-3 bg-slate-100 text-slate-800 font-bold text-sm flex items-center gap-1.5 border-r border-slate-200 shrink-0">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    id="pub-mobile-input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => {
                      setErrorMessage(null);
                      setMobileNumber(e.target.value.replace(/\D/g, ''));
                    }}
                    placeholder={lang === 'mr' ? 'मोबाईल नंबर टाका' : 'Enter mobile number'}
                    className="w-full px-3 py-3 bg-transparent text-base font-bold text-slate-900 tracking-wider placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                id="pub-send-otp-btn"
                disabled={isLoading || mobileNumber.length !== 10}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  mobileNumber.length === 10 && !isLoading
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{lang === 'mr' ? 'ओटीपी पाठवा आणि पुढे जा' : 'Send Verification OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500 font-medium">
                {lang === 'mr'
                  ? 'खाते मालकाची खात्री करण्यासाठी तुमच्या मोबाईलवर ६ अंकी ओटीपी पाठवला जाईल.'
                  : 'A 6-digit OTP will be sent to confirm account ownership.'}
              </p>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 'OTP' && (
            <div className="space-y-4 text-center">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  {lang === 'mr' ? 'सुरक्षा पडताळणी' : 'Security Verification'}
                </h3>
                <p className="text-xs text-slate-600">
                  {lang === 'mr'
                    ? `${maskedMobile} वर पाठवलेला ६ अंकी ओटीपी टाका:`
                    : `Enter the 6-digit OTP sent to ${maskedMobile}:`}
                </p>
              </div>

              {devOtpHint && (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono">
                  Test OTP Hint: <strong>{devOtpHint}</strong>
                </div>
              )}

              <div className="flex justify-center gap-2 py-2">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpInputsRef.current[i] = el; }}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-11 h-13 text-center text-lg font-black rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 text-slate-900 focus:outline-hidden transition-all"
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="text-xs text-slate-500 pt-1">
                {resendCooldown > 0 ? (
                  <span>
                    {lang === 'mr' ? 'पुन्हा ओटीपी: ' : 'Resend OTP in: '}
                    <strong className="text-slate-800 font-mono">
                      00:{resendCooldown < 10 ? `0${resendCooldown}` : resendCooldown}
                    </strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    {lang === 'mr' ? 'ओटीपी पुन्हा पाठवा' : 'Resend OTP'}
                  </button>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  id="pub-verify-delete-btn"
                  onClick={handleConfirmDeletion}
                  disabled={isLoading || otpDigits.join('').length !== 6}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    otpDigits.join('').length === 6 && !isLoading
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{lang === 'mr' ? 'खाते कायमस्वरूपी हटवा' : 'Permanently Delete Account'}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('MOBILE')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {lang === 'mr' ? 'मागे जा' : 'Back'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING */}
          {step === 'PROCESSING' && (
            <div className="py-8 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-rose-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'mr' ? 'खाते हटवण्याची प्रक्रिया सुरू आहे...' : 'Deleting account and data...'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'mr' ? 'कृपया प्रतीक्षा करा.' : 'Please wait.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'SUCCESS' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">
                  {lang === 'mr' ? 'खाते हटवण्याची विनंती पूर्ण झाली' : 'Account Deletion Completed'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {lang === 'mr'
                    ? 'तुमचे AgriTrade खाते आणि हटवण्यास पात्र संबंधित डेटा हटवण्याची प्रक्रिया पूर्ण झाली आहे. तुमचा डेटा सर्व्हरवरून कायमचा नष्ट करण्यात आला आहे.'
                    : 'Your AgriTrade account and all eligible associated personal data have been permanently deleted from our servers.'}
                </p>
              </div>

              <div className="pt-3">
                <a
                  href="/"
                  className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors no-underline cursor-pointer"
                >
                  {lang === 'mr' ? 'मुख्य पृष्ठावर जा' : 'Return to Home'}
                </a>
              </div>
            </div>
          )}

          {/* STEP 5: FAILURE */}
          {step === 'FAILURE' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'mr' ? 'खाते हटवता आले नाही' : 'Account Deletion Failed'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed px-2">
                  {lang === 'mr'
                    ? 'तांत्रिक अडचणीमुळे खाते हटवण्याची प्रक्रिया पूर्ण झाली नाही. कृपया पुन्हा प्रयत्न करा.'
                    : 'Due to a technical error, the account deletion could not be completed. Please try again.'}
                </p>
                {errorMessage && (
                  <p className="text-xs text-rose-700 font-mono">
                    {errorMessage}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('OTP')}
                  className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {lang === 'mr' ? 'पुन्हा प्रयत्न करा' : 'Try Again'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Transparency note */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>
            AgriTrade • Official Mandi Price Analytics • agritrade.in
          </p>
          <p>
            Data source: AGMARKNET (Directorate of Marketing & Inspection, Ministry of Agriculture & Farmers Welfare, Government of India)
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 AgriTrade. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/" className="text-slate-600 hover:text-emerald-700 font-medium">Home</a>
            <span className="text-slate-300">•</span>
            <a href="mailto:support@agritrade.in" className="text-slate-600 hover:text-emerald-700 font-medium">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
