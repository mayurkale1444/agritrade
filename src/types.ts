export type CommodityId = string;

export type TrendType = 'Bullish' | 'Stable' | 'Bearish' | 'Unavailable';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Unassessed';

export type TradeSignal = 'Buy' | 'Hold' | 'Watch' | 'Insufficient Data';

export type DataTypeCategory = 
  | 'LIVE VERIFIED DATA' 
  | 'FALLBACK DATA' 
  | 'DEMO DATA' 
  | 'NO VERIFIED DATA TODAY' 
  | 'DATA UNAVAILABLE';

export type DataQualityIndicator = 'Verified' | 'Warning' | 'Unavailable';

export interface Commodity {
  id: CommodityId;
  name: string;
  hindiName: string;
  marathiName?: string;
  aliases?: string[];
  category: 'Vegetable' | 'Oilseed' | 'Fiber' | 'Spice' | 'Foodgrain' | 'Fruit' | 'Pulse' | 'Other';
  unit: string; // e.g. '₹/quintal'
  standardLotSizeQtl: number;
  description: string;
  isPopular?: boolean;
  benchmarkPrice?: number;
}

export interface MandiMarket {
  id: string;
  name: string;
  district: string;
  state: string;
  commodityId: CommodityId;
  benchmark: boolean;
  arrivalAvgQtl: number;
  variety?: string;
  grade?: string;
  marathiName?: string;
  hindiName?: string;
  distanceKm?: number;
  isMajorAPMC?: boolean;
  specializedFor?: string;
}

export interface MandiLocation {
  id: string;
  name: string;
  marathiName: string;
  district: string;
  state: string;
  distanceKm?: number;
  isMajorAPMC?: boolean;
  isSpecializedFor?: string;
  variety?: string;
  grade?: string;
}

export interface AvailableLiveMarket {
  market: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  grade?: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  arrival_date: string;
}

export interface PricePoint {
  date: string;
  price: number;
  arrivalQtl: number;
}

export interface AISummary {
  headline: string;
  analysis: string;
  keyDrivers: string[];
  supportPrice: number;
  resistancePrice: number;
  arrivalsSummary: string;
  traderAdvice: string;
  confidenceScore: number;
}

export interface RawGovRecord {
  commodity: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  grade?: string;
}

export interface RawApiResponseDebug {
  endpoint: string;
  httpStatus: number;
  totalRecordsInApi: number;
  fetchedRecordsCount: number;
  rawRecord: RawGovRecord | null;
  queryFilters: {
    commodity?: string;
    market?: string;
    district?: string;
    state?: string;
    variety?: string;
    date?: string;
  };
  validationChecks: {
    commodityMatch: boolean;
    marketMatch: boolean;
    districtMatch: boolean;
    stateMatch: boolean;
    varietyMatch: boolean;
    dateMatch: boolean;
  };
  allAvailableRecordsSample?: any[];
  timestamp: string;
}

export interface MarketData {
  commodity: Commodity;
  commodityId?: CommodityId;
  mandi: MandiMarket; // Selected market
  sourceMarket: string; // The exact source market returned from the bulletin or fallback indicator
  sourceDistrict: string;
  sourceState: string;
  marketsMatch: boolean; // TRUE only if selected market and source market match
  dataTypeCategory: DataTypeCategory; // 'LIVE VERIFIED DATA' | 'FALLBACK DATA' | 'DEMO DATA'
  dataQuality: DataQualityIndicator; // 'Verified' | 'Warning' | 'Unavailable'
  dataQualityReason: string;
  hasZeroSpread: boolean; // TRUE if minPrice === maxPrice === modalPrice
  currentPrice: number; // ₹/quintal (matches modalPrice)
  previousPrice?: number | null; // ₹/quintal (null if unverified from government historical record)
  priceChange?: number | null; // null if unverified
  percentageChange?: number | null; // null if unverified
  hasVerifiedHistoricalData?: boolean; // TRUE ONLY if multi-day verified government records exist
  trend: TrendType;
  riskLevel: RiskLevel;
  riskExplanation: string;
  tradeSignal: TradeSignal;
  signalRationale: string;
  aiSummary: AISummary;
  history7d: PricePoint[];
  history15d: PricePoint[];
  history30d: PricePoint[];
  arrivalsTodayQtl: number;
  arrivalsChangePct: number;
  lastUpdated: string;
  // Real data service fields
  dataSource: string;
  isLive: boolean; // TRUE ONLY when live data was received AND matches selected market
  variety: string;
  grade?: string;
  arrivalDate: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  fetchStatus: 'live' | 'fallback' | 'loading' | 'error';
  statusMessage?: string;
  rawGovRecord?: RawGovRecord | null;
  rawApiResponse?: RawApiResponseDebug | null;
  availableLiveMarkets?: AvailableLiveMarket[];
}

export type TraderUserType =
  | 'Trader'
  | 'Wholesaler'
  | 'Farmer'
  | 'Commission Agent'
  | 'Supplier'
  | 'Other'
  | 'Exporter';

export type TradeOperationType = 'Buying' | 'Selling' | 'Both';

export type TraderVerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'PENDING';

export type ExportInterestType = 'YES' | 'NO' | 'MAYBE LATER';

export type AuthState =
  | 'logged_out'
  | 'logged_in'
  | 'first_time_onboarding'
  | 'onboarding_completed';

export interface UserProfile {
  id?: string;
  name: string;
  age?: number | string;
  mobile: string;
  mobileMasked?: string;
  preferredLanguage?: string;
  userType: TraderUserType;
  role?: TraderUserType;
  district: string;
  state?: string;
  mainApmc: string;
  primaryCommodity?: CommodityId;
  commoditiesHandled: CommodityId[];
  operationType: TradeOperationType;
  preferredApmcs: string[];
  businessName?: string;
  about?: string;
  exportInterest?: ExportInterestType;
  exportCommodities?: string[];
  verificationStatus?: TraderVerificationStatus;
  isOnboarded: boolean;
}

export type TraderReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type TraderReportSource =
  | 'Direct market observation'
  | 'APMC/local market bulletin'
  | 'Commission agent information'
  | 'Trader network information'
  | 'Other';

export interface QualityRateItem {
  id?: string;
  quality: string; // e.g. 'Premium / Extra Bold', 'Medium / Golta', 'Standard / Golti'
  rate: string; // e.g. '₹4,400 – ₹4,800'
  minRate?: number;
  maxRate?: number;
  unit: string; // e.g. '100 KG', '50 KG', '₹/quintal'
  sizeDescription?: string;
}

export type PosterExtractionStatus = 'EXTRACTED' | 'MANUAL' | 'UNAVAILABLE' | 'NEEDS_CONFIRMATION';

export interface TraderReport {
  id: string;
  traderId: string;
  traderName: string;
  businessName?: string;
  role: TraderUserType;
  district: string;
  state: string;
  mainAPMC: string;
  marketName: string;
  commodity: string;
  commodityId?: CommodityId;
  variety?: string;
  gradeQuality?: string;
  minPrice: number;
  maxPrice: number;
  modalPrice?: number;
  reportDate: string;
  submittedAt: string;
  note?: string;
  photoUrl?: string;
  photoFileName?: string;
  posterUrl?: string;
  posterFileName?: string;
  hasPoster?: boolean;
  qualityRates?: QualityRateItem[];
  originalUnit?: string; // e.g. '100 KG', '50 KG', 'quintal'
  extractionStatus?: PosterExtractionStatus;
  verificationStatus: TraderVerificationStatus;
  sourceType: 'TRADER_REPORTED';

  // Backwards compatibility properties
  apmc?: string;
  date?: string;
  commodityName?: string;
  notes?: string;
  qualityGrade?: string;
  arrivalsQtl?: number;
  sourceCategory?: TraderReportSource;
  evidenceFileName?: string;
  submittedBy?: {
    name: string;
    mobileMasked?: string;
    userType: TraderUserType;
  };
  moderationStatus?: TraderReportStatus;
  moderatedAt?: string;
}

export type TraderSubmittedReport = TraderReport;

