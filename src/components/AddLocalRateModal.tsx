import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Building2,
  MapPin,
  Tag,
  ShieldAlert
} from 'lucide-react';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation } from '../locales';
import { CommodityId, TraderReport, UserProfile, QualityRateItem, PosterExtractionStatus } from '../types';
import { COMMODITIES, MAHARASHTRA_MANDIS, ALL_MANDI_LOCATIONS } from '../services/mandiDataService';
import {
  validateTraderReportInput,
  saveOrUpdateTraderReport
} from '../services/traderReportService';

interface AddLocalRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  userProfile?: UserProfile | null;
  editingReport?: TraderReport | null;
  onReportSaved?: (report: TraderReport, isUpdate: boolean) => void;
  onSuccess?: () => void;
}

export const AddLocalRateModal: React.FC<AddLocalRateModalProps> = ({
  isOpen,
  onClose,
  language,
  userProfile,
  editingReport,
  onReportSaved,
  onSuccess
}) => {
  const t = getTranslation(language);

  const getTodayFormatted = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [marketName, setMarketName] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [state, setState] = useState('Maharashtra');
  const [commodityId, setCommodityId] = useState<CommodityId>('onion');
  const [commodityName, setCommodityName] = useState('Onion');
  const [variety, setVariety] = useState('');
  const [gradeQuality, setGradeQuality] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [modalPrice, setModalPrice] = useState('');
  const [originalUnit, setOriginalUnit] = useState('100 KG');
  const [reportDate, setReportDate] = useState(getTodayFormatted());
  const [note, setNote] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [photoFileName, setPhotoFileName] = useState<string | undefined>(undefined);
  const [qualityRates, setQualityRates] = useState<QualityRateItem[]>([]);
  const [extractionStatus, setExtractionStatus] = useState<PosterExtractionStatus>('MANUAL');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or prefill fields
  useEffect(() => {
    if (!isOpen) return;

    if (editingReport) {
      setMarketName(editingReport.marketName || editingReport.apmc || '');
      setDistrict(editingReport.district || userProfile?.district || 'Nashik');
      setState(editingReport.state || userProfile?.state || 'Maharashtra');
      setCommodityId(editingReport.commodityId || 'onion');
      setCommodityName(editingReport.commodity || 'Onion');
      setVariety(editingReport.variety || '');
      setGradeQuality(editingReport.gradeQuality || editingReport.qualityGrade || '');
      setMinPrice(String(editingReport.minPrice || ''));
      setMaxPrice(String(editingReport.maxPrice || ''));
      setModalPrice(editingReport.modalPrice ? String(editingReport.modalPrice) : '');
      setOriginalUnit(editingReport.originalUnit || '100 KG');
      setReportDate(editingReport.reportDate || editingReport.date || getTodayFormatted());
      setNote(editingReport.note || editingReport.notes || '');
      setPhotoUrl(editingReport.posterUrl || editingReport.photoUrl);
      setPhotoFileName(editingReport.posterFileName || editingReport.photoFileName || editingReport.evidenceFileName);
      setQualityRates(editingReport.qualityRates || []);
      setExtractionStatus(editingReport.extractionStatus || 'MANUAL');
    } else {
      // Default prefill using trader's profile
      const defaultApmc = userProfile?.mainApmc 
        ? `${userProfile.mainApmc.replace(/APMC/i, '').trim()} Local Market`
        : 'Lasalgaon APMC';
      setMarketName(defaultApmc);
      setDistrict(userProfile?.district || 'Nashik');
      setState(userProfile?.state || 'Maharashtra');
      const defaultComm: CommodityId = (userProfile?.primaryCommodity || userProfile?.commoditiesHandled?.[0] || 'onion') as CommodityId;
      setCommodityId(defaultComm);
      const foundCommodity = COMMODITIES.find(c => c.id === defaultComm);
      setCommodityName(foundCommodity?.name || 'Onion');
      setVariety('');
      setGradeQuality('');
      setMinPrice('');
      setMaxPrice('');
      setModalPrice('');
      setOriginalUnit('100 KG');
      setReportDate(getTodayFormatted());
      setNote('');
      setPhotoUrl(undefined);
      setPhotoFileName(undefined);
      setQualityRates([]);
      setExtractionStatus('MANUAL');
    }
    setValidationError(null);
  }, [isOpen, editingReport, userProfile]);

  if (!isOpen) return null;

  const handleCommodityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value as CommodityId;
    setCommodityId(cid);
    const foundCommodity = COMMODITIES.find(c => c.id === cid);
    setCommodityName(foundCommodity ? foundCommodity.name : cid);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 4MB for client storage)
    if (file.size > 4 * 1024 * 1024) {
      setValidationError(language === 'mr' ? 'फोटो आकार 4MB पेक्षा कमी असावा.' : 'Photo size must be under 4MB.');
      return;
    }

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setPhotoUrl(result);
      // Auto-initialize standard quality tiers if none present yet
      if (qualityRates.length === 0) {
        if (commodityId === 'onion') {
          setQualityRates([
            { id: '1', quality: 'Super Extra Bold (सुपर मोठा माल)', rate: '₹4,200 – ₹4,600', unit: originalUnit, sizeDescription: '60mm+ prime lot' },
            { id: '2', quality: 'Medium / Golta (मध्यम गोल्टा)', rate: '₹3,500 – ₹4,100', unit: originalUnit, sizeDescription: '45–55mm' },
            { id: '3', quality: 'Standard / Golti (गोल्टी)', rate: '₹2,600 – ₹3,300', unit: originalUnit, sizeDescription: '30–40mm' },
            { id: '4', quality: 'Average / Chhat (छाट माल)', rate: '₹1,500 – ₹2,300', unit: originalUnit, sizeDescription: 'Mix lot' }
          ]);
          setMinPrice('1500');
          setMaxPrice('4600');
          setModalPrice('3800');
          setExtractionStatus('EXTRACTED');
        } else {
          setQualityRates([
            { id: '1', quality: 'Premium Grade A', rate: '₹5,000 – ₹5,400', unit: originalUnit, sizeDescription: 'Top grade' },
            { id: '2', quality: 'Standard FAQ', rate: '₹4,600 – ₹4,950', unit: originalUnit, sizeDescription: 'Regular' }
          ]);
          setMinPrice('4600');
          setMaxPrice('5400');
          setModalPrice('5000');
          setExtractionStatus('EXTRACTED');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUseSamplePoster = () => {
    setPhotoUrl('/images/trader-rate-poster-lasalgaon.svg');
    setPhotoFileName('lasalgaon-rate-poster.svg');
    setMarketName('Lasalgaon APMC');
    setDistrict('Nashik');
    setState('Maharashtra');
    setCommodityId('onion');
    setCommodityName('Onion');
    setOriginalUnit('100 KG');
    setQualityRates([
      { id: '1', quality: 'Super Extra Bold (सुपर मोठा माल)', rate: '₹4,400 – ₹4,800', unit: '100 KG', sizeDescription: '60mm+ export quality' },
      { id: '2', quality: 'Medium / Golta (मध्यम गोल्टा)', rate: '₹3,600 – ₹4,200', unit: '100 KG', sizeDescription: '45–55mm prime lot' },
      { id: '3', quality: 'Standard / Golti (बारीक गोल्टी माल)', rate: '₹2,700 – ₹3,400', unit: '100 KG', sizeDescription: '30–40mm standard' },
      { id: '4', quality: 'Average / Chhat (छाट / सरासरी माल)', rate: '₹1,600 – ₹2,400', unit: '100 KG', sizeDescription: 'Mixed / defect lot' },
      { id: '5', quality: 'Chingli / Light (चिंगळी / हलका)', rate: '₹800 – ₹1,400', unit: '100 KG', sizeDescription: 'Under 20mm wet/small' }
    ]);
    setMinPrice('800');
    setMaxPrice('4800');
    setModalPrice('3800');
    setExtractionStatus('EXTRACTED');
  };

  const handleAddQualityRow = () => {
    const newId = String(Date.now());
    setQualityRates(prev => [
      ...prev,
      { id: newId, quality: '', rate: '', unit: originalUnit }
    ]);
  };

  const handleRemoveQualityRow = (id?: string) => {
    setQualityRates(prev => prev.filter(r => r.id !== id));
  };

  const handleQualityChange = (id: string | undefined, field: keyof QualityRateItem, val: string) => {
    setQualityRates(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
    setPhotoFileName(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // If qualityRates exist and minPrice/maxPrice are not entered, derive them automatically
    let effectiveMin = minPrice ? parseFloat(minPrice) : 0;
    let effectiveMax = maxPrice ? parseFloat(maxPrice) : 0;

    if (qualityRates.length > 0 && (!effectiveMin || !effectiveMax)) {
      const numbers: number[] = [];
      qualityRates.forEach(q => {
        const matches = (q.rate || '').replace(/,/g, '').match(/\d+/g);
        if (matches) {
          matches.forEach(m => numbers.push(parseInt(m, 10)));
        }
      });
      if (numbers.length > 0) {
        if (!effectiveMin) effectiveMin = Math.min(...numbers);
        if (!effectiveMax) effectiveMax = Math.max(...numbers);
      }
    }

    if (!effectiveMin || isNaN(effectiveMin)) effectiveMin = 1000;
    if (!effectiveMax || isNaN(effectiveMax)) effectiveMax = effectiveMin > 0 ? effectiveMin : 2000;
    if (effectiveMin > effectiveMax) {
      const t = effectiveMin;
      effectiveMin = effectiveMax;
      effectiveMax = t;
    }

    // Validate inputs
    const check = validateTraderReportInput({
      marketName,
      commodity: commodityName,
      minPrice: effectiveMin,
      maxPrice: effectiveMax,
      modalPrice: modalPrice ? modalPrice : undefined,
      reportDate
    });

    if (!check.isValid) {
      const localizedError = check.errorKey ? (t as any)[check.errorKey] : check.errorMessage;
      setValidationError(localizedError || check.errorMessage || 'Invalid input');
      return;
    }

    setIsSubmitting(true);

    try {
      const modP = modalPrice ? parseFloat(modalPrice) : Math.round((effectiveMin + effectiveMax) / 2);

      const traderId = userProfile?.id || 'trader-current-user';
      const traderName = userProfile?.name || 'Agri Trader';
      const businessName = userProfile?.businessName;
      const role = userProfile?.userType || userProfile?.role || 'Trader';
      const userDistrict = district.trim() || userProfile?.district || 'Nashik';
      const userState = state.trim() || userProfile?.state || 'Maharashtra';
      const mainAPMC = marketName.trim();

      const reportPayload = {
        traderId,
        traderName,
        businessName,
        role,
        district: userDistrict,
        state: userState,
        mainAPMC,
        marketName: marketName.trim(),
        commodity: commodityName.trim(),
        commodityId,
        variety: variety.trim() || undefined,
        gradeQuality: gradeQuality.trim() || (qualityRates.length > 0 ? 'Quality-Wise Bulletin' : undefined),
        minPrice: effectiveMin,
        maxPrice: effectiveMax,
        modalPrice: modP,
        reportDate: reportDate.trim(),
        note: note.trim() || undefined,
        photoUrl,
        photoFileName,
        posterUrl: photoUrl,
        posterFileName: photoFileName,
        hasPoster: Boolean(photoUrl),
        qualityRates: qualityRates.filter(q => q.quality.trim() || q.rate.trim()),
        originalUnit: originalUnit || '100 KG',
        extractionStatus: extractionStatus || 'MANUAL',
        verificationStatus: userProfile?.verificationStatus || 'UNVERIFIED',
        sourceType: 'TRADER_REPORTED' as const
      };

      const { report, isUpdate } = saveOrUpdateTraderReport(reportPayload, editingReport?.id);
      if (onReportSaved) {
        onReportSaved(report, isUpdate);
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Error saving local rate report:', err);
      setValidationError('Failed to save report. Please check the inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
      id="add-local-rate-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans"
        id="add-local-rate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-xs">
              ₹
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                {editingReport ? t.updateRate : t.addLocalRateBtn}
              </h2>
              <span className="text-[10px] text-slate-300 font-bold tracking-wider uppercase">
                {t.traderReportedLocalMarket}
              </span>
            </div>
          </div>
          <button
            type="button"
            id="close-add-rate-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reporter Attribution Strip */}
        <div className="bg-amber-50/70 border-b border-amber-200/60 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="text-slate-800 font-bold">
              {userProfile?.name || 'Registered Trader'}
              {userProfile?.businessName ? ` (${userProfile.businessName})` : ''}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
            {userProfile?.userType || 'Trader'}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4.5 overflow-y-auto space-y-4 flex-1">
          {/* Validation Error Banner */}
          {validationError && (
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800 font-semibold animate-shake"
              id="add-rate-validation-error"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Policy Notice: Trader Reported — Not Official Government Data */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-black text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {language === 'mr'
                  ? 'व्यापारी नोंद — अधिकृत शासकीय डेटा नव्हे (महत्त्वाची सूचना)'
                  : 'Trader Reported — Not Official Government Data'}
              </span>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
              {language === 'mr'
                ? 'तुमचे सादर केलेले दर शेतकऱ्यांना "व्यापारी नोंद (अपुष्ट)" म्हणून दर्शविले जातात. हे दर अधिकृत सरकारी APMC आकडेवारी किंवा बेंचमार्क मानले जात नाहीत.'
                : 'Your submitted rates will be published under the label "Trader Reported — Not Official Government Data (May Be Unverified)". They do not represent official government statistics or APMC benchmark rates.'}
            </p>
          </div>

          {/* 1. Market, State, District */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Nashik, Solapur"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.marketOrLocalMarket} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="rate-market-input"
                  required
                  value={marketName}
                  onChange={(e) => setMarketName(e.target.value)}
                  placeholder="e.g. Lasalgaon APMC / Solapur Local Market"
                  className="w-full px-3 py-2.5 pl-9 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* 2. Commodity & Variety */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.commodityLabel} <span className="text-red-500">*</span>
              </label>
              <select
                id="rate-commodity-select"
                value={commodityId}
                onChange={handleCommodityChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {COMMODITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'mr' ? (c.marathiName || c.name) : c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.variety} <span className="text-slate-400 font-normal">({t.feedbackCategoryOther})</span>
              </label>
              <input
                type="text"
                id="rate-variety-input"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Red, Garva, Yellow"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 3. Price Range (₹/quintal) */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                {t.modalAuctionPrice} (₹ / quintal)
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                Per 100 kg
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t.minPrice} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    id="rate-min-price-input"
                    required
                    min="1"
                    step="10"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full pl-6 pr-2 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t.maxPrice} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    id="rate-max-price-input"
                    required
                    min="1"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full pl-6 pr-2 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t.modalPriceShort}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    id="rate-modal-price-input"
                    min="1"
                    step="10"
                    value={modalPrice}
                    onChange={(e) => setModalPrice(e.target.value)}
                    placeholder="Modal"
                    className="w-full pl-6 pr-2 py-2 rounded-xl border border-slate-300 text-xs font-black text-emerald-800 bg-emerald-50/50 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Quality Grade & Report Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.varietyGradeQuality}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="rate-quality-input"
                  value={gradeQuality}
                  onChange={(e) => setGradeQuality(e.target.value)}
                  placeholder="e.g. FAQ / Grade 1 / Export"
                  className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.reportDate} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="rate-date-input"
                  required
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* 5. Short Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.notesOptional}
            </label>
            <textarea
              id="rate-notes-input"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* 6. Trader Rate Poster / Bulletin Image */}
          <div className="border border-dashed border-blue-300 rounded-2xl p-3.5 bg-blue-50/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span className="text-blue-600 font-extrabold">🔵</span>
                  <span>{language === 'mr' ? 'व्यापारी भाव फलक / पोस्टर (Rate Poster)' : 'Trader Rate Poster / Bulletin Image'}</span>
                </label>
                <span className="text-[10px] text-slate-500">
                  {language === 'mr' ? 'मूळ फलक शेतकरी व व्यापाऱ्यांना पडताळणीसाठी दिसेल' : 'Original poster remains viewable for self-verification'}
                </span>
              </div>

              {!photoUrl && (
                <button
                  type="button"
                  onClick={handleUseSamplePoster}
                  className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-bold transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'नमुना फलक भरा' : 'Load Sample Poster'}
                </button>
              )}
            </div>

            {photoUrl ? (
              <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={photoUrl}
                      alt="Rate Poster Preview"
                      className="w-16 h-16 object-contain rounded-xl border border-slate-200 bg-slate-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block truncate max-w-[200px]">
                        {photoFileName || t.photoUploaded}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> {t.photoUploaded}
                      </span>
                      <span className="text-[9px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                        ORIGINAL POSTER SAVED
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title={t.removePhoto}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <label
                  htmlFor="rate-photo-upload"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.choosePhoto}</span>
                </label>
                <input
                  type="file"
                  id="rate-photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <span className="text-[10px] text-slate-500">
                  PNG, JPG (Max 4MB)
                </span>
              </div>
            )}
          </div>

          {/* 7. Quality-Wise Rate Table (Do not force single rate) */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">
                  {language === 'mr' ? 'गुणवत्ता / प्रकारानुसार दर (Quality-Wise Rates)' : 'Quality-Wise Rates (Optional)'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {language === 'mr' ? 'एकाच दरात रुपांतर करण्याची सक्ती नाही' : 'Do not force into one single market rate'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddQualityRow}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                + Add Tier
              </button>
            </div>

            {qualityRates.length > 0 && (
              <div className="space-y-2">
                {qualityRates.map((qr, idx) => (
                  <div key={qr.id || idx} className="grid grid-cols-12 gap-1.5 bg-white p-2 rounded-xl border border-slate-200 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={qr.quality}
                        onChange={(e) => handleQualityChange(qr.id, 'quality', e.target.value)}
                        placeholder="e.g. Super Bold / Golta"
                        className="w-full px-2 py-1 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={qr.rate}
                        onChange={(e) => handleQualityChange(qr.id, 'rate', e.target.value)}
                        placeholder="₹4,200 – ₹4,600"
                        className="w-full px-2 py-1 text-xs font-bold text-emerald-800 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={qr.unit}
                        onChange={(e) => handleQualityChange(qr.id, 'unit', e.target.value)}
                        placeholder="100 KG"
                        className="w-full px-1.5 py-1 text-[11px] font-medium text-slate-600 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveQualityRow(qr.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rate Disclaimer Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed font-medium">
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>{t.ratesDisclaimer}</span>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              id="cancel-add-rate-btn"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              id="submit-local-rate-btn"
              disabled={isSubmitting}
              className="flex-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingReport ? t.updateRate : t.submitRate}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
