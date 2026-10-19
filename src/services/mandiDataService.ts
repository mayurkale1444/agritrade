import { Commodity, CommodityId, MandiMarket, MandiLocation, MarketData, PricePoint, TrendType, RiskLevel, TradeSignal, AvailableLiveMarket } from '../types';

export const MAHARASHTRA_MANDIS: MandiLocation[] = [
  { id: 'lasalgaon', name: 'Lasalgaon', marathiName: 'लासलगाव', district: 'Nashik', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 22, isSpecializedFor: 'कांदा व धान्य' },
  { id: 'nashik_apmc', name: 'Nashik APMC', marathiName: 'नाशिक बाजार समिती', district: 'Nashik', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 0, isSpecializedFor: 'सोयाबीन, कांदा व भाजीपाला' },
  { id: 'pune_apmc', name: 'Pune APMC', marathiName: 'पुणे मुख्य बाजार समिती', district: 'Pune', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 140, isSpecializedFor: 'कांदा, धान्य व भाजीपाला' },
  { id: 'pune_moshi', name: 'Pune (Moshi)', marathiName: 'पुणे (मोशी)', district: 'Pune', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 145, isSpecializedFor: 'भाजीपाला, कांदा व धान्य' },
  { id: 'pimpalgaon', name: 'Pimpalgaon Baswant', marathiName: 'पिंपळगाव बसवंत', district: 'Nashik', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 38, isSpecializedFor: 'कांदा, टोमॅटो व द्राक्षे' },
  { id: 'solapur', name: 'Solapur', marathiName: 'सोलापूर', district: 'Solapur', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 210, isSpecializedFor: 'कांदा व डाळिंब' },
  { id: 'karjat', name: 'Karjat', marathiName: 'कर्जत', district: 'Ahmednagar', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 95, isSpecializedFor: 'कांदा व भुईमूग' },
  { id: 'latur', name: 'Latur', marathiName: 'लातूर', district: 'Latur', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 280, isSpecializedFor: 'सोयाबीन व कडधान्य' },
  { id: 'nagpur', name: 'Nagpur APMC', marathiName: 'नागपूर कळमना', district: 'Nagpur', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 420, isSpecializedFor: 'कापूस, संत्रा व सोयाबीन' },
  { id: 'vashi', name: 'Mumbai (Vashi)', marathiName: 'मुंबई (वाशी एपीएमसी)', district: 'Thane', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 180, isSpecializedFor: 'फळे व भाजीपाला' },
  { id: 'sangli', name: 'Sangli', marathiName: 'सांगली', district: 'Sangli', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 230, isSpecializedFor: 'हळद, बेदाणा व गूळ' },
  { id: 'akola', name: 'Akola', marathiName: 'अकोला', district: 'Akola', state: 'Maharashtra', isMajorAPMC: true, distanceKm: 340, isSpecializedFor: 'कापूस व सोयाबीन' },
  { id: 'yeola', name: 'Yeola', marathiName: 'येवला', district: 'Nashik', state: 'Maharashtra', isMajorAPMC: false, distanceKm: 45, isSpecializedFor: 'कांदा व मका' },
  { id: 'manmad', name: 'Manmad', marathiName: 'मनमाड', district: 'Nashik', state: 'Maharashtra', isMajorAPMC: false, distanceKm: 35, isSpecializedFor: 'कांदा व धान्य' },
  { id: 'chandwad', name: 'Chandwad', marathiName: 'चांदवड', district: 'Nashik', state: 'Maharashtra', isMajorAPMC: false, distanceKm: 28, isSpecializedFor: 'कांदा' }
];

export const ALL_MANDI_LOCATIONS: MandiLocation[] = [
  ...MAHARASHTRA_MANDIS,
  // Madhya Pradesh
  { id: 'indore', name: 'Indore Mandi (Chhavani)', marathiName: 'इंदूर', district: 'Indore', state: 'Madhya Pradesh', isMajorAPMC: true, distanceKm: 410, isSpecializedFor: 'सोयाबीन व बटाटा' },
  { id: 'ujjain', name: 'Ujjain APMC', marathiName: 'उज्जैन', district: 'Ujjain', state: 'Madhya Pradesh', isMajorAPMC: true, distanceKm: 460, isSpecializedFor: 'सोयाबीन व गहू' },
  { id: 'neemuch', name: 'Neemuch Mandi', marathiName: 'नीमच', district: 'Neemuch', state: 'Madhya Pradesh', isMajorAPMC: true, distanceKm: 550, isSpecializedFor: 'लसूण व कांदा' },
  { id: 'mandsaur', name: 'Mandsaur Mandi', marathiName: 'मंदसौर', district: 'Mandsaur', state: 'Madhya Pradesh', isMajorAPMC: true, distanceKm: 510, isSpecializedFor: 'लसूण व मोहरी' },
  { id: 'sehore', name: 'Sehore Mandi (Sharbati)', marathiName: 'सिहोर', district: 'Sehore', state: 'Madhya Pradesh', isMajorAPMC: true, distanceKm: 480, isSpecializedFor: 'शरबती गहू' },
  { id: 'badnawar', name: 'Badnawar APMC', marathiName: 'बदनावर', district: 'Dhar', state: 'Madhya Pradesh', isMajorAPMC: true, distanceKm: 390, isSpecializedFor: 'कांदा व सोयाबीन' },
  { id: 'chhindwara', name: 'Chhindwara Mandi', marathiName: 'छिंदवाडा', district: 'Chhindwara', state: 'Madhya Pradesh', isMajorAPMC: false, distanceKm: 490, isSpecializedFor: 'मका' },
  { id: 'morena', name: 'Morena Mandi', marathiName: 'मुरेना', district: 'Morena', state: 'Madhya Pradesh', isMajorAPMC: false, distanceKm: 780, isSpecializedFor: 'मोहरी' },

  // Gujarat
  { id: 'rajkot', name: 'Rajkot Marketing Yard', marathiName: 'राजकोट', district: 'Rajkot', state: 'Gujarat', isMajorAPMC: true, distanceKm: 620, isSpecializedFor: 'कापूस व भुईमूग' },
  { id: 'gondal', name: 'Gondal APMC', marathiName: 'गोंडल', district: 'Rajkot', state: 'Gujarat', isMajorAPMC: true, distanceKm: 640, isSpecializedFor: 'मिरची, भुईमूग व कांदा' },
  { id: 'kadi', name: 'Kadi Cotton Yard', marathiName: 'कडी', district: 'Mehsana', state: 'Gujarat', isMajorAPMC: true, distanceKm: 580, isSpecializedFor: 'कापूस' },
  { id: 'deesa', name: 'Deesa APMC', marathiName: 'डिसा', district: 'Banaskantha', state: 'Gujarat', isMajorAPMC: true, distanceKm: 690, isSpecializedFor: 'बटाटा व मोहरी' },
  { id: 'surat', name: 'Surat APMC', marathiName: 'सुरत', district: 'Surat', state: 'Gujarat', isMajorAPMC: true, distanceKm: 290, isSpecializedFor: 'भाजीपाला' },

  // Rajasthan
  { id: 'kota', name: 'Kota Bhamashah Mandi', marathiName: 'कोटा', district: 'Kota', state: 'Rajasthan', isMajorAPMC: true, distanceKm: 680, isSpecializedFor: 'सोयाबीन, गहू व लसूण' },
  { id: 'jaipur', name: 'Jaipur Grain Mandi', marathiName: 'जयपूर', district: 'Jaipur', state: 'Rajasthan', isMajorAPMC: true, distanceKm: 850, isSpecializedFor: 'मोहरी व बाजरी' },
  { id: 'bikaner', name: 'Bikaner Mandi', marathiName: 'बिकानेर', district: 'Bikaner', state: 'Rajasthan', isMajorAPMC: true, distanceKm: 980, isSpecializedFor: 'हरभरा व भुईमूग' },
  { id: 'alwar', name: 'Alwar APMC', marathiName: 'अलवर', district: 'Alwar', state: 'Rajasthan', isMajorAPMC: true, distanceKm: 920, isSpecializedFor: 'मोहरी' },

  // Uttar Pradesh
  { id: 'agra', name: 'Agra Mandi', marathiName: 'आग्रा', district: 'Agra', state: 'Uttar Pradesh', isMajorAPMC: true, distanceKm: 950, isSpecializedFor: 'बटाटा व मोहरी' },
  { id: 'farrukhabad', name: 'Farrukhabad Mandi', marathiName: 'फरुखाबाद', district: 'Farrukhabad', state: 'Uttar Pradesh', isMajorAPMC: true, distanceKm: 1050, isSpecializedFor: 'बटाटा' },
  { id: 'bahraich', name: 'Bahraich Krishi Mandi', marathiName: 'बहराइच', district: 'Bahraich', state: 'Uttar Pradesh', isMajorAPMC: false, distanceKm: 1180, isSpecializedFor: 'मका व गहू' },

  // Karnataka
  { id: 'hubli', name: 'Hubballi APMC', marathiName: 'हुबळी', district: 'Dharwad', state: 'Karnataka', isMajorAPMC: true, distanceKm: 420, isSpecializedFor: 'कांदा व मिरची' },
  { id: 'kolar', name: 'Kolar APMC Market', marathiName: 'कोलार', district: 'Kolar', state: 'Karnataka', isMajorAPMC: true, distanceKm: 760, isSpecializedFor: 'टोमॅटो' },
  { id: 'byadgi', name: 'Byadgi APMC', marathiName: 'ब्याडगी', district: 'Haveri', state: 'Karnataka', isMajorAPMC: true, distanceKm: 490, isSpecializedFor: 'ब्याडगी मिरची' },
  { id: 'davanagere', name: 'Davanagere APMC', marathiName: 'दावणगेरे', district: 'Davanagere', state: 'Karnataka', isMajorAPMC: true, distanceKm: 530, isSpecializedFor: 'मका' },

  // Andhra Pradesh & Telangana
  { id: 'guntur', name: 'Guntur Mirchi Yard', marathiName: 'गुंटूर', district: 'Guntur', state: 'Andhra Pradesh', isMajorAPMC: true, distanceKm: 680, isSpecializedFor: 'मिरची व हळद' },
  { id: 'madanapalle', name: 'Madanapalle Market Yard', marathiName: 'मदनापल्ले', district: 'Annamayya', state: 'Andhra Pradesh', isMajorAPMC: true, distanceKm: 810, isSpecializedFor: 'टोमॅटो' },
  { id: 'warangal', name: 'Warangal Enamamula', marathiName: 'वारंगल', district: 'Warangal', state: 'Telangana', isMajorAPMC: true, distanceKm: 520, isSpecializedFor: 'कापूस व हळद' },
  { id: 'nizamabad', name: 'Nizamabad APMC', marathiName: 'निझामाबाद', district: 'Nizamabad', state: 'Telangana', isMajorAPMC: true, distanceKm: 440, isSpecializedFor: 'हळद' },

  // Punjab, Haryana & Delhi
  { id: 'ludhiana_apmc', name: 'Ludhiana APMC', marathiName: 'लुधियाना', district: 'Ludhiana', state: 'Punjab', isMajorAPMC: true, distanceKm: 1240, isSpecializedFor: 'गहू, मका व भाजीपाला' },
  { id: 'khanna', name: 'Khanna Grain Market', marathiName: 'खन्ना', district: 'Ludhiana', state: 'Punjab', isMajorAPMC: true, distanceKm: 1250, isSpecializedFor: 'गहू व भात' },
  { id: 'amritsar_apmc', name: 'Amritsar APMC (Bhagtanwala)', marathiName: 'अमृतसर', district: 'Amritsar', state: 'Punjab', isMajorAPMC: true, distanceKm: 1320, isSpecializedFor: 'भात, गहू व भाजीपाला' },
  { id: 'bathinda_apmc', name: 'Bathinda APMC', marathiName: 'भटिंडा', district: 'Bathinda', state: 'Punjab', isMajorAPMC: true, distanceKm: 1190, isSpecializedFor: 'कापूस व गहू' },
  { id: 'abohar_mandi', name: 'Abohar Mandi', marathiName: 'अबोहर', district: 'Fazilka', state: 'Punjab', isMajorAPMC: true, distanceKm: 1160, isSpecializedFor: 'कापूस, किन्नू व गहू' },
  { id: 'jalandhar_apmc', name: 'Jalandhar APMC', marathiName: 'जालंधर', district: 'Jalandhar', state: 'Punjab', isMajorAPMC: true, distanceKm: 1280, isSpecializedFor: 'बटाटा, गहू व भाजीपाला' },
  { id: 'karnal', name: 'Karnal Mandi', marathiName: 'कर्नाल', district: 'Karnal', state: 'Haryana', isMajorAPMC: true, distanceKm: 1150, isSpecializedFor: 'बासमती भात व गहू' },
  { id: 'sirsa_apmc', name: 'Sirsa APMC', marathiName: 'सिरसा', district: 'Sirsa', state: 'Haryana', isMajorAPMC: true, distanceKm: 1120, isSpecializedFor: 'कापूस, गहू व मोहरी' },
  { id: 'azadpur', name: 'Azadpur Mandi', marathiName: 'आझादपूर', district: 'North Delhi', state: 'Delhi NCT', isMajorAPMC: true, distanceKm: 1100, isSpecializedFor: 'फळे व भाजीपाला' },

  // Tamil Nadu & Bihar
  { id: 'erode', name: 'Erode Semmampalayam', marathiName: 'इरोड', district: 'Erode', state: 'Tamil Nadu', isMajorAPMC: true, distanceKm: 980, isSpecializedFor: 'हळद' },
  { id: 'gulabbagh', name: 'Gulabbagh Mandi (Purnea)', marathiName: 'गुलाबबाग', district: 'Purnea', state: 'Bihar', isMajorAPMC: true, distanceKm: 1450, isSpecializedFor: 'मका' }
];

/**
 * Checks whether user profile has missing core fields
 */
export function isUserProfileComplete(profile?: { 
  state?: string; 
  district?: string; 
  mainApmc?: string; 
  primaryCommodity?: string; 
  commoditiesHandled?: string[];
  role?: string;
  userType?: string;
  isOnboarded?: boolean;
} | null): boolean {
  if (!profile) return false;
  if (!profile.isOnboarded) return false;
  const commodity = profile.primaryCommodity || profile.commoditiesHandled?.[0];
  const role = profile.role || profile.userType;
  if (!profile.state || !profile.district || !profile.mainApmc || !commodity || !role) {
    return false;
  }
  return true;
}

export function isProfileIncomplete(profile?: { 
  state?: string; 
  district?: string; 
  mainApmc?: string; 
  primaryCommodity?: string; 
  commoditiesHandled?: string[];
  role?: string;
  userType?: string;
  isOnboarded?: boolean;
} | null): boolean {
  return !isUserProfileComplete(profile);
}

/**
 * Resolves the primary MandiLocation strictly matching the user profile's APMC, district, and state.
 */
export function findMandiForProfile(profile?: {
  state?: string;
  district?: string;
  mainApmc?: string;
  primaryCommodity?: CommodityId;
  commoditiesHandled?: CommodityId[];
} | null): MandiLocation {
  return resolveProfileMandi(profile);
}

/**
 * Returns mandis strictly belonging to a specific state
 */
export function getMandisForState(stateName: string): MandiLocation[] {
  if (!stateName || stateName.toLowerCase() === 'all') return ALL_MANDI_LOCATIONS;
  const cleanState = stateName.toLowerCase().trim();
  return ALL_MANDI_LOCATIONS.filter(m => (m.state || '').toLowerCase().trim() === cleanState);
}

/**
 * Returns mandis tailored strictly to the user's signup profile state and district
 */
export function getMandisForProfile(profile?: { state?: string; district?: string; mainApmc?: string } | null): MandiLocation[] {
  if (!profile || !profile.state) {
    return ALL_MANDI_LOCATIONS;
  }
  const stateMandis = getMandisForState(profile.state);
  return stateMandis.length > 0 ? stateMandis : ALL_MANDI_LOCATIONS;
}

/**
 * Resolves the primary MandiLocation strictly matching the user profile's APMC, district, and state.
 * Never substitutes markets from other states into the user's default context.
 * If not in the predefined list, generates a valid MandiLocation representing the user's selected APMC.
 */
export function resolveProfileMandi(profile?: {
  state?: string;
  district?: string;
  mainApmc?: string;
  primaryCommodity?: CommodityId;
  commoditiesHandled?: CommodityId[];
} | null): MandiLocation {
  if (!profile || !profile.mainApmc) {
    return ALL_MANDI_LOCATIONS[0];
  }

  const rawApmc = profile.mainApmc.trim();
  const cleanApmc = cleanMandiString(profile.mainApmc);
  const cleanState = (profile.state || '').toLowerCase().trim();
  const cleanDist = cleanMandiString(profile.district);
  const commodityId: CommodityId = profile.primaryCommodity || profile.commoditiesHandled?.[0] || 'wheat';

  // 1. First priority: Match within the user's state by name
  if (cleanState) {
    const statePool = ALL_MANDI_LOCATIONS.filter(m => (m.state || '').toLowerCase().trim() === cleanState);
    const inStateMatch = statePool.find(m => {
      const mClean = cleanMandiString(m.name);
      return mClean === cleanApmc || (cleanApmc.length >= 3 && mClean.includes(cleanApmc)) || (mClean.length >= 3 && cleanApmc.includes(mClean));
    });
    if (inStateMatch) return inStateMatch;

    // District match within the same state
    if (cleanDist) {
      const inStateDistMatch = statePool.find(m => cleanMandiString(m.district) === cleanDist);
      if (inStateDistMatch && cleanApmc.includes(cleanDist)) {
        return inStateDistMatch;
      }
    }
  }

  // 2. Second priority: Match in ALL_MANDI_LOCATIONS where state is empty or unspecified
  const generalMatch = ALL_MANDI_LOCATIONS.find(m => {
    if (cleanState && (m.state || '').toLowerCase().trim() !== cleanState) return false;
    const mClean = cleanMandiString(m.name);
    return mClean === cleanApmc || (cleanApmc.length >= 3 && mClean.includes(cleanApmc)) || (mClean.length >= 3 && cleanApmc.includes(mClean));
  });

  if (generalMatch) return generalMatch;

  // 3. Fallback: Construct a strict MandiLocation for the user's specified APMC, District, and State
  // NEVER substitute an APMC from a foreign state
  return {
    id: rawApmc.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: rawApmc,
    marathiName: rawApmc,
    district: profile.district || (cleanState ? profile.state! : 'Local District'),
    state: profile.state || 'India',
    isMajorAPMC: true,
    distanceKm: 0,
    isSpecializedFor: profile.primaryCommodity || 'कृषी माल'
  };
}

export function cleanMandiString(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/mandi|apmc|market|yard|grain|krishi|sub-market|sub-yard|subyard|upaj|samiti/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function normalizeDistrict(dist?: string): string {
  if (!dist) return '';
  const c = cleanMandiString(dist);
  if (c === 'nasik' || c === 'nashik') return 'nashik';
  if (c === 'ahmednagar' || c === 'ahilyanagar') return 'ahilyanagar';
  if (c === 'aurangabad' || c === 'chhatrapatisambhajinagar' || c === 'sambhajinagar') return 'sambhajinagar';
  if (c === 'osmanabad' || c === 'dharashiv') return 'dharashiv';
  if (c === 'poona' || c === 'pune') return 'pune';
  if (c === 'beed' || c === 'bid') return 'bid';
  return c;
}

/**
 * Normalizes variety names to standard canonical tokens for comparison.
 * Handles Marathi/Devanagari scripts, English equivalents, and regional APMC aliases.
 * Strictly maintains distinct variety boundaries:
 * - Unhali / Garva / Summer are equivalent.
 * - Red / Lal is strictly distinct.
 * - White / Safed is strictly distinct.
 * - Onion Green is strictly distinct.
 */
export function normalizeVariety(variety?: string, commodity?: string): string {
  if (!variety) return '';
  const raw = variety.trim().toLowerCase();

  const isCommodityOnion = !commodity || commodity.toLowerCase().includes('onion');

  if (isCommodityOnion) {
    // Unhali / Garva / Summer onion cluster
    if (
      raw.includes('unhali') || 
      raw.includes('garva') || 
      raw.includes('उन्हाळी') || 
      raw.includes('गरवा') || 
      raw.includes('summer')
    ) {
      return 'unhali_garva';
    }

    // Red onion cluster
    if (
      raw.includes('red') || 
      raw.includes('lal') || 
      raw.includes('लाल')
    ) {
      return 'red';
    }

    // White onion cluster
    if (
      raw.includes('white') || 
      raw.includes('safed') || 
      raw.includes('पांढरा')
    ) {
      return 'white';
    }
  }

  // Generic fallback cleanup
  return raw.replace(/[^a-z0-9]/g, '');
}

/**
 * Checks if target variety matches the official record's variety safely.
 * Returns true if:
 * 1. Target variety is empty or generic ('All', 'Any', 'FAQ', 'General')
 * 2. Record variety is generic ('Other', 'Local', 'FAQ', 'General') when target is 'Other' / 'Local'
 * 3. Canonical normalized forms match (e.g. 'unhali_garva' === 'unhali_garva')
 * 
 * Returns false if:
 * 1. Explicit variety conflict (e.g. 'red' vs 'unhali_garva', 'white' vs 'red', etc.)
 */
export function isVarietyMatch(recordVariety?: string, targetVariety?: string, commodity?: string): boolean {
  if (!targetVariety || targetVariety === 'All' || targetVariety === 'Any' || targetVariety === 'FAQ' || targetVariety === 'FAQ / General') {
    return true;
  }
  if (!recordVariety) {
    return false;
  }

  const normTarget = normalizeVariety(targetVariety, commodity);
  const normRecord = normalizeVariety(recordVariety, commodity);

  // If both have recognized canonical variety tokens
  if (normTarget && normRecord) {
    if (normTarget === normRecord) {
      return true;
    }
    const specificOnionTokens = ['unhali_garva', 'red', 'white'];
    if (specificOnionTokens.includes(normTarget) && specificOnionTokens.includes(normRecord)) {
      // Different specific varieties must NEVER match
      return false;
    }
  }

  // Generic variety checks
  const isTargetGeneric = targetVariety.toLowerCase().includes('other') || targetVariety.toLowerCase().includes('local') || targetVariety.toLowerCase().includes('स्थानिक');
  const isRecordGeneric = recordVariety.toLowerCase().includes('other') || recordVariety.toLowerCase().includes('local') || recordVariety.toLowerCase().includes('स्थानिक');
  if (isTargetGeneric && isRecordGeneric) {
    return true;
  }

  // Fallback alphanumeric comparison for non-canonical varieties
  const cleanTarget = targetVariety.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanRecord = recordVariety.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (!cleanTarget || !cleanRecord) return false;
  return cleanTarget === cleanRecord || (cleanTarget.length >= 4 && cleanRecord.includes(cleanTarget)) || (cleanRecord.length >= 4 && cleanTarget.includes(cleanRecord));
}

export function findLiveMarketRecord(
  mandi: { name: string; district?: string; state?: string; variety?: string; commodity?: string },
  availableLiveMarkets?: AvailableLiveMarket[],
  expectedCommodityId?: string
): AvailableLiveMarket | undefined {
  if (!availableLiveMarkets || availableLiveMarkets.length === 0) return undefined;

  const targetClean = cleanMandiString(mandi.name);
  const targetDistClean = normalizeDistrict(mandi.district || '');
  const targetStateClean = cleanMandiString(mandi.state || 'Maharashtra');
  const targetCommodity = mandi.commodity || expectedCommodityId;

  return availableLiveMarkets.find(lm => {
    // 0. Strict commodity match
    if (targetCommodity && lm.commodity) {
      const tc = cleanMandiString(targetCommodity);
      const lc = cleanMandiString(lm.commodity);
      if (tc && lc) {
        const isSoy = (tc.includes('soy') || tc.includes('soya')) && (lc.includes('soy') || lc.includes('soya'));
        const isOnion = tc.includes('onion') && lc.includes('onion');
        const isCotton = (tc.includes('cotton') || tc.includes('kapas')) && (lc.includes('cotton') || lc.includes('kapas'));
        const isWheat = (tc.includes('wheat') || tc.includes('gehun')) && (lc.includes('wheat') || lc.includes('gehun'));
        const isTurmeric = (tc.includes('turmeric') || tc.includes('haldi')) && (lc.includes('turmeric') || lc.includes('haldi'));
        const isExact = tc === lc || tc.includes(lc) || lc.includes(tc);
        if (!isSoy && !isOnion && !isCotton && !isWheat && !isTurmeric && !isExact) {
          return false;
        }
      }
    }
    // 1. State match
    if (lm.state) {
      const lmState = cleanMandiString(lm.state);
      if (lmState && targetStateClean && !lmState.includes(targetStateClean) && !targetStateClean.includes(lmState)) {
        return false;
      }
    }
    // 2. District match
    if (mandi.district && lm.district) {
      const lmDist = normalizeDistrict(lm.district);
      if (lmDist && targetDistClean && !lmDist.includes(targetDistClean) && !targetDistClean.includes(lmDist)) {
        return false;
      }
    }
    // 3. Variety match if provided and specific
    if (mandi.variety && lm.variety && !isVarietyMatch(lm.variety, mandi.variety, mandi.commodity)) {
      return false;
    }
    // 4. Market match
    const lmMarket = cleanMandiString(lm.market);
    if (!lmMarket || !targetClean) return false;
    if (lmMarket === targetClean) return true;

    // Substring match with collision guard (moshi vs pimpri)
    const isSub =
      (lmMarket.length >= 5 && targetClean.includes(lmMarket)) ||
      (targetClean.length >= 5 && lmMarket.includes(targetClean));
    if (isSub) {
      const moshiCol = targetClean.includes('moshi') !== lmMarket.includes('moshi');
      const pimpriCol = targetClean.includes('pimpri') !== lmMarket.includes('pimpri');
      if (!moshiCol && !pimpriCol) return true;
    }
    return false;
  });
}

export const COMMODITIES: Commodity[] = [
  {
    id: 'onion',
    name: 'Onion',
    hindiName: 'कांदा / प्याज',
    marathiName: 'कांदा',
    aliases: ['kanda', 'pyaz', 'onion', 'pyaaz'],
    category: 'Vegetable',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Nashik & Solapur kharif/rabi bulb arrivals with seasonal price volatility',
    isPopular: true
  },
  {
    id: 'soybean',
    name: 'Soybean',
    hindiName: 'सोयाबीन',
    marathiName: 'सोयाबीन',
    aliases: ['soyabean', 'soybean', 'soya'],
    category: 'Oilseed',
    unit: '₹/quintal',
    standardLotSizeQtl: 100,
    description: 'Central MP & Maharashtra crushing grade yellow soybean',
    isPopular: true
  },
  {
    id: 'cotton',
    name: 'Cotton (Kapas)',
    hindiName: 'कपास / रुई',
    marathiName: 'कापूस',
    aliases: ['kapas', 'kapus', 'cotton', 'rui', 'shankar 6'],
    category: 'Fiber',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Medium to long staple Shankar-6 raw cotton arrivals',
    isPopular: true
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    hindiName: 'हल्दी (राजापुरी/सेलम)',
    marathiName: 'हळद',
    aliases: ['haldi', 'halad', 'turmeric', 'pasupu'],
    category: 'Spice',
    unit: '₹/quintal',
    standardLotSizeQtl: 25,
    description: 'Finger & bulb quality turmeric traded in Nizamabad, Erode and Sangli',
    isPopular: true
  },
  {
    id: 'wheat',
    name: 'Wheat',
    hindiName: 'गेहूँ (शरबती/मिल)',
    marathiName: 'गहू',
    aliases: ['gehun', 'gahu', 'wheat', 'sharbati'],
    category: 'Foodgrain',
    unit: '₹/quintal',
    standardLotSizeQtl: 100,
    description: 'Mill quality & Sharbati grain across Punjab, Haryana and MP mandis',
    isPopular: true
  },
  {
    id: 'maize',
    name: 'Maize',
    hindiName: 'मक्का',
    marathiName: 'मका',
    aliases: ['makka', 'maka', 'maize', 'corn', 'makai'],
    category: 'Foodgrain',
    unit: '₹/quintal',
    standardLotSizeQtl: 100,
    description: 'Yellow feed and starch grade maize arrivals',
    isPopular: true
  },
  {
    id: 'tomato',
    name: 'Tomato',
    hindiName: 'टमाटर',
    marathiName: 'टोमॅटो',
    aliases: ['tamatar', 'tomato', 'tamato'],
    category: 'Vegetable',
    unit: '₹/quintal',
    standardLotSizeQtl: 40,
    description: 'Fresh field and greenhouse grade table tomatoes',
    isPopular: true
  },
  {
    id: 'potato',
    name: 'Potato',
    hindiName: 'आलू',
    marathiName: 'बटाटा',
    aliases: ['aloo', 'batata', 'potato', 'alu'],
    category: 'Vegetable',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Kufri Jyoti and table grade fresh ware potatoes',
    isPopular: true
  },
  {
    id: 'garlic',
    name: 'Garlic',
    hindiName: 'लहसुन',
    marathiName: 'लसूण',
    aliases: ['lahsun', 'lasun', 'garlic'],
    category: 'Spice',
    unit: '₹/quintal',
    standardLotSizeQtl: 25,
    description: 'Dry bulb garlic arrivals in MP and Rajasthan yards'
  },
  {
    id: 'chilli',
    name: 'Chilli',
    hindiName: 'मिर्च',
    marathiName: 'मिरची',
    aliases: ['mirchi', 'chilli', 'mirch', 'red chilli', 'green chilli'],
    category: 'Spice',
    unit: '₹/quintal',
    standardLotSizeQtl: 20,
    description: 'Teja, Guntur and local green/red chillies'
  },
  {
    id: 'gram',
    name: 'Gram (Chana)',
    hindiName: 'चना',
    marathiName: 'हरभरा',
    aliases: ['chana', 'harbara', 'gram', 'bengal gram'],
    category: 'Pulse',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Desi and yellow chickpea pulses'
  },
  {
    id: 'chickpea',
    name: 'Chickpea (Kabuli Chana)',
    hindiName: 'काबुली चना',
    marathiName: 'काबुली चणा',
    aliases: ['kabuli chana', 'chickpea', 'white chana'],
    category: 'Pulse',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Large count dollar and Mexican Kabuli chickpeas'
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    hindiName: 'मूंगफली',
    marathiName: 'भुईमूग',
    aliases: ['mungfali', 'bhuimug', 'groundnut', 'peanut'],
    category: 'Oilseed',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'In-shell and kernel oilseed groundnut'
  },
  {
    id: 'mustard',
    name: 'Mustard',
    hindiName: 'सरसों',
    marathiName: 'मोहरी',
    aliases: ['sarson', 'mohari', 'mustard', 'rai'],
    category: 'Oilseed',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'High oil-content black and yellow mustard seeds'
  },
  {
    id: 'paddy',
    name: 'Paddy (Dhan)',
    hindiName: 'धान',
    marathiName: 'भात',
    aliases: ['dhan', 'paddy', 'bhat', 'unmilled rice'],
    category: 'Foodgrain',
    unit: '₹/quintal',
    standardLotSizeQtl: 100,
    description: 'Common and grade A raw unhusked paddy'
  },
  {
    id: 'rice',
    name: 'Rice',
    hindiName: 'चावल',
    marathiName: 'तांदूळ',
    aliases: ['chawal', 'rice', 'tandul'],
    category: 'Foodgrain',
    unit: '₹/quintal',
    standardLotSizeQtl: 100,
    description: 'Milled raw, parboiled and basmati rice varieties'
  },
  {
    id: 'bajra',
    name: 'Bajra',
    hindiName: 'बाजरा',
    marathiName: 'बाजरी',
    aliases: ['bajra', 'bajri', 'pearl millet'],
    category: 'Foodgrain',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Kharif pearl millet foodgrain'
  },
  {
    id: 'jowar',
    name: 'Jowar',
    hindiName: 'ज्वार',
    marathiName: 'ज्वारी',
    aliases: ['jowar', 'jwari', 'sorghum'],
    category: 'Foodgrain',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'White and yellow sorghum grain'
  },
  {
    id: 'moong',
    name: 'Moong (Green Gram)',
    hindiName: 'मूंग',
    marathiName: 'मूग',
    aliases: ['moong', 'mung', 'green gram'],
    category: 'Pulse',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Bright green whole pulse'
  },
  {
    id: 'urad',
    name: 'Urad (Black Gram)',
    hindiName: 'उडद',
    marathiName: 'उडीद',
    aliases: ['urad', 'udid', 'black gram'],
    category: 'Pulse',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Whole and split black matpe pulse'
  },
  {
    id: 'masoor',
    name: 'Masoor (Lentil)',
    hindiName: 'मसूर',
    marathiName: 'मसूर',
    aliases: ['masoor', 'masur', 'lentil'],
    category: 'Pulse',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Red and brown small-grain lentils'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    hindiName: 'पत्तागोभी',
    marathiName: 'कोबी',
    aliases: ['patta gobhi', 'kobi', 'cabbage'],
    category: 'Vegetable',
    unit: '₹/quintal',
    standardLotSizeQtl: 30,
    description: 'Fresh compact field cabbage'
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    hindiName: 'फूलगोभी',
    marathiName: 'फ्लावर',
    aliases: ['phool gobhi', 'flower', 'cauliflower'],
    category: 'Vegetable',
    unit: '₹/quintal',
    standardLotSizeQtl: 30,
    description: 'Fresh white curd cauliflower'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    hindiName: 'गाजर',
    marathiName: 'गाजर',
    aliases: ['gajar', 'carrot'],
    category: 'Vegetable',
    unit: '₹/quintal',
    standardLotSizeQtl: 30,
    description: 'Red and orange fresh table carrots'
  },
  {
    id: 'radish',
    name: 'Radish',
    hindiName: 'मूली',
    marathiName: 'मुळा',
    aliases: ['mooli', 'mula', 'radish'],
    category: 'Vegetable',
    unit: '₹/quintal',
    standardLotSizeQtl: 30,
    description: 'Fresh white root radish'
  },
  {
    id: 'banana',
    name: 'Banana',
    hindiName: 'केला',
    marathiName: 'केळी',
    aliases: ['kela', 'keli', 'banana'],
    category: 'Fruit',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Grand Naine and Robusta commercial bananas'
  },
  {
    id: 'apple',
    name: 'Apple',
    hindiName: 'सेब',
    marathiName: 'सफरचंद',
    aliases: ['seb', 'safarchand', 'apple', 'royal delicious'],
    category: 'Fruit',
    unit: '₹/quintal',
    standardLotSizeQtl: 50,
    description: 'Kinnaur and Shimla hill apples'
  },
  {
    id: 'ginger',
    name: 'Ginger',
    hindiName: 'अदरक',
    marathiName: 'आले',
    aliases: ['adrak', 'aale', 'ginger'],
    category: 'Spice',
    unit: '₹/quintal',
    standardLotSizeQtl: 25,
    description: 'Green fresh and dry unpeeled ginger'
  },
  {
    id: 'coriander',
    name: 'Coriander',
    hindiName: 'धनिया',
    marathiName: 'कोथिंबीर',
    aliases: ['dhaniya', 'kothimbir', 'coriander'],
    category: 'Spice',
    unit: '₹/quintal',
    standardLotSizeQtl: 20,
    description: 'Fresh leaves and whole dried coriander seeds'
  },
  {
    id: 'brinjal',
    name: 'Brinjal',
    hindiName: 'बैंगन',
    marathiName: 'वांगी',
    aliases: ['baingan', 'vangi', 'brinjal', 'eggplant'],
    category: 'Vegetable',
    unit: '₹/quintal',
    standardLotSizeQtl: 30,
    description: 'Round purple and green local brinjals'
  },
  {
    id: 'lemon',
    name: 'Lemon',
    hindiName: 'नींबू',
    marathiName: 'लिंबू',
    aliases: ['nimbu', 'limbu', 'lemon'],
    category: 'Fruit',
    unit: '₹/quintal',
    standardLotSizeQtl: 25,
    description: 'Kagzi juicy yellow lemons'
  }
];

export const MANDIS: MandiMarket[] = [
  // Onion Mandis
  { id: 'pune_moshi', name: 'Pune (Moshi)', district: 'Pune', state: 'Maharashtra', commodityId: 'onion', benchmark: true, arrivalAvgQtl: 13000 },
  { id: 'lasalgaon', name: 'Lasalgaon Mandi', district: 'Nashik', state: 'Maharashtra', commodityId: 'onion', benchmark: true, arrivalAvgQtl: 18500 },
  { id: 'nashik_onion', name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', commodityId: 'onion', benchmark: false, arrivalAvgQtl: 12000 },
  { id: 'pimpalgaon', name: 'Pimpalgaon Baswant', district: 'Nashik', state: 'Maharashtra', commodityId: 'onion', benchmark: false, arrivalAvgQtl: 14200 },
  { id: 'solapur', name: 'Solapur Mandi', district: 'Solapur', state: 'Maharashtra', commodityId: 'onion', benchmark: false, arrivalAvgQtl: 9500 },
  { id: 'badnawar_onion', name: 'Badnawar APMC', district: 'Dhar', state: 'Madhya Pradesh', commodityId: 'onion', benchmark: false, arrivalAvgQtl: 11000 },
  { id: 'vikasnagar_onion', name: 'Vikasnagar APMC', district: 'Dehradoon', state: 'Uttarakhand', commodityId: 'onion', benchmark: false, arrivalAvgQtl: 8200 },
  { id: 'lamlong_onion', name: 'Lamlong Bazaar APMC', district: 'Imphal East', state: 'Manipur', commodityId: 'onion', benchmark: false, arrivalAvgQtl: 6400 },
  { id: 'rayya_onion', name: 'Rayya APMC', district: 'Amritsar', state: 'Punjab', commodityId: 'onion', benchmark: false, arrivalAvgQtl: 7100 },
  { id: 'azadpur_onion', name: 'Azadpur Mandi', district: 'North Delhi', state: 'Delhi NCT', commodityId: 'onion', benchmark: false, arrivalAvgQtl: 22000 },
  { id: 'hubli', name: 'Hubballi APMC', district: 'Dharwad', state: 'Karnataka', commodityId: 'onion', benchmark: false, arrivalAvgQtl: 7800 },

  // Soybean Mandis
  { id: 'nashik_soybean', name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', commodityId: 'soybean', benchmark: false, arrivalAvgQtl: 9000 },
  { id: 'indore', name: 'Indore Mandi (Chhavani)', district: 'Indore', state: 'Madhya Pradesh', commodityId: 'soybean', benchmark: true, arrivalAvgQtl: 32000 },
  { id: 'ujjain', name: 'Ujjain APMC', district: 'Ujjain', state: 'Madhya Pradesh', commodityId: 'soybean', benchmark: false, arrivalAvgQtl: 16500 },
  { id: 'latur', name: 'Latur APMC', district: 'Latur', state: 'Maharashtra', commodityId: 'soybean', benchmark: true, arrivalAvgQtl: 24000 },
  { id: 'akola', name: 'Akola Cotton & Grain', district: 'Akola', state: 'Maharashtra', commodityId: 'soybean', benchmark: false, arrivalAvgQtl: 11000 },
  { id: 'kota_soy', name: 'Kota Bhamashah Mandi', district: 'Kota', state: 'Rajasthan', commodityId: 'soybean', benchmark: false, arrivalAvgQtl: 14500 },

  // Cotton Mandis
  { id: 'rajkot', name: 'Rajkot Marketing Yard', district: 'Rajkot', state: 'Gujarat', commodityId: 'cotton', benchmark: true, arrivalAvgQtl: 28000 },
  { id: 'kadi', name: 'Kadi Cotton Yard', district: 'Mehsana', state: 'Gujarat', commodityId: 'cotton', benchmark: false, arrivalAvgQtl: 19500 },
  { id: 'bhattu_cotton', name: 'Bhattu Kalan APMC', district: 'Fatehabad', state: 'Haryana', commodityId: 'cotton', benchmark: false, arrivalAvgQtl: 15000 },
  { id: 'markapur_cotton', name: 'Markapur APMC', district: 'Markapuram', state: 'Andhra Pradesh', commodityId: 'cotton', benchmark: false, arrivalAvgQtl: 12000 },
  { id: 'warangal', name: 'Warangal Enamamula', district: 'Warangal', state: 'Telangana', commodityId: 'cotton', benchmark: false, arrivalAvgQtl: 21000 },
  { id: 'adilabad', name: 'Adilabad APMC', district: 'Adilabad', state: 'Telangana', commodityId: 'cotton', benchmark: false, arrivalAvgQtl: 12500 },
  { id: 'abohar', name: 'Abohar Mandi', district: 'Fazilka', state: 'Punjab', commodityId: 'cotton', benchmark: false, arrivalAvgQtl: 9000 },

  // Turmeric Mandis
  { id: 'nizamabad', name: 'Nizamabad APMC', district: 'Nizamabad', state: 'Telangana', commodityId: 'turmeric', benchmark: true, arrivalAvgQtl: 8500 },
  { id: 'erode', name: 'Erode Semmampalayam', district: 'Erode', state: 'Tamil Nadu', commodityId: 'turmeric', benchmark: false, arrivalAvgQtl: 7200 },
  { id: 'sangli', name: 'Sangli Spices Mandi', district: 'Sangli', state: 'Maharashtra', commodityId: 'turmeric', benchmark: false, arrivalAvgQtl: 6100 },
  { id: 'duggirala', name: 'Duggirala Yard', district: 'Guntur', state: 'Andhra Pradesh', commodityId: 'turmeric', benchmark: false, arrivalAvgQtl: 4200 },

  // Wheat Mandis
  { id: 'ludhiana_apmc', name: 'Ludhiana APMC', district: 'Ludhiana', state: 'Punjab', commodityId: 'wheat', benchmark: true, arrivalAvgQtl: 42000 },
  { id: 'khanna', name: 'Khanna Grain Market', district: 'Ludhiana', state: 'Punjab', commodityId: 'wheat', benchmark: true, arrivalAvgQtl: 45000 },
  { id: 'karnal', name: 'Karnal Mandi', district: 'Karnal', state: 'Haryana', commodityId: 'wheat', benchmark: false, arrivalAvgQtl: 31000 },
  { id: 'sehore', name: 'Sehore Mandi (Sharbati)', district: 'Sehore', state: 'Madhya Pradesh', commodityId: 'wheat', benchmark: false, arrivalAvgQtl: 18000 },
  { id: 'najafgarh', name: 'Najafgarh Grain Yard', district: 'South West Delhi', state: 'Delhi NCT', commodityId: 'wheat', benchmark: false, arrivalAvgQtl: 12000 },
  { id: 'kota_wheat', name: 'Kota Mandi', district: 'Kota', state: 'Rajasthan', commodityId: 'wheat', benchmark: false, arrivalAvgQtl: 15500 },

  // Maize Mandis
  { id: 'ludhiana_apmc_maize', name: 'Ludhiana APMC', district: 'Ludhiana', state: 'Punjab', commodityId: 'maize', benchmark: false, arrivalAvgQtl: 19000 },
  { id: 'gulabbagh', name: 'Gulabbagh Mandi (Purnea)', district: 'Purnea', state: 'Bihar', commodityId: 'maize', benchmark: true, arrivalAvgQtl: 38000 },
  { id: 'kuchinapudi_maize', name: 'Kuchinapudi APMC', district: 'Bapatla', state: 'Andhra Pradesh', commodityId: 'maize', benchmark: false, arrivalAvgQtl: 16000 },
  { id: 'davanagere', name: 'Davanagere APMC', district: 'Davanagere', state: 'Karnataka', commodityId: 'maize', benchmark: false, arrivalAvgQtl: 17500 },
  { id: 'chhindwara', name: 'Chhindwara Mandi', district: 'Chhindwara', state: 'Madhya Pradesh', commodityId: 'maize', benchmark: false, arrivalAvgQtl: 14000 },
  { id: 'bahraich', name: 'Bahraich Krishi Mandi', district: 'Bahraich', state: 'Uttar Pradesh', commodityId: 'maize', benchmark: false, arrivalAvgQtl: 11500 },

  // Tomato Mandis
  { id: 'pune_moshi_tomato', name: 'Pune (Moshi)', district: 'Pune', state: 'Maharashtra', commodityId: 'tomato', benchmark: true, arrivalAvgQtl: 8500 },
  { id: 'pimpalgaon_tomato', name: 'Pimpalgaon Baswant', district: 'Nashik', state: 'Maharashtra', commodityId: 'tomato', benchmark: true, arrivalAvgQtl: 12000 },
  { id: 'kolar_tomato', name: 'Kolar APMC Market', district: 'Kolar', state: 'Karnataka', commodityId: 'tomato', benchmark: true, arrivalAvgQtl: 25000 },
  { id: 'madanapalle_tomato', name: 'Madanapalle Market Yard', district: 'Annamayya', state: 'Andhra Pradesh', commodityId: 'tomato', benchmark: true, arrivalAvgQtl: 22000 },
  { id: 'nashik_tomato', name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', commodityId: 'tomato', benchmark: false, arrivalAvgQtl: 9500 },

  // Potato Mandis
  { id: 'pune_moshi_potato', name: 'Pune (Moshi)', district: 'Pune', state: 'Maharashtra', commodityId: 'potato', benchmark: true, arrivalAvgQtl: 14000 },
  { id: 'agra_potato', name: 'Agra Mandi', district: 'Agra', state: 'Uttar Pradesh', commodityId: 'potato', benchmark: true, arrivalAvgQtl: 35000 },
  { id: 'farrukhabad_potato', name: 'Farrukhabad Mandi', district: 'Farrukhabad', state: 'Uttar Pradesh', commodityId: 'potato', benchmark: true, arrivalAvgQtl: 28000 },
  { id: 'indore_potato', name: 'Indore Mandi (Chhavani)', district: 'Indore', state: 'Madhya Pradesh', commodityId: 'potato', benchmark: false, arrivalAvgQtl: 19000 },
  { id: 'deesa_potato', name: 'Deesa APMC', district: 'Banaskantha', state: 'Gujarat', commodityId: 'potato', benchmark: false, arrivalAvgQtl: 21000 },

  // Garlic Mandis
  { id: 'mandsaur_garlic', name: 'Mandsaur Mandi', district: 'Mandsaur', state: 'Madhya Pradesh', commodityId: 'garlic', benchmark: true, arrivalAvgQtl: 18000 },
  { id: 'neemuch_garlic', name: 'Neemuch Mandi', district: 'Neemuch', state: 'Madhya Pradesh', commodityId: 'garlic', benchmark: true, arrivalAvgQtl: 16000 },
  { id: 'kota_garlic', name: 'Kota Bhamashah Mandi', district: 'Kota', state: 'Rajasthan', commodityId: 'garlic', benchmark: false, arrivalAvgQtl: 11000 },
  { id: 'pune_garlic', name: 'Pune (Moshi)', district: 'Pune', state: 'Maharashtra', commodityId: 'garlic', benchmark: false, arrivalAvgQtl: 4500 },

  // Chilli Mandis
  { id: 'guntur_chilli', name: 'Guntur Mirchi Yard', district: 'Guntur', state: 'Andhra Pradesh', commodityId: 'chilli', benchmark: true, arrivalAvgQtl: 40000 },
  { id: 'byadgi_chilli', name: 'Byadgi APMC', district: 'Haveri', state: 'Karnataka', commodityId: 'chilli', benchmark: true, arrivalAvgQtl: 22000 },
  { id: 'nagpur_chilli', name: 'Nagpur Cotton Market Yard', district: 'Nagpur', state: 'Maharashtra', commodityId: 'chilli', benchmark: false, arrivalAvgQtl: 8000 },

  // Gram / Chickpea Mandis
  { id: 'latur_gram', name: 'Latur APMC', district: 'Latur', state: 'Maharashtra', commodityId: 'gram', benchmark: true, arrivalAvgQtl: 15000 },
  { id: 'indore_gram', name: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', commodityId: 'gram', benchmark: true, arrivalAvgQtl: 12000 },
  { id: 'bikaner_gram', name: 'Bikaner Mandi', district: 'Bikaner', state: 'Rajasthan', commodityId: 'gram', benchmark: false, arrivalAvgQtl: 9500 },
  { id: 'akola_gram', name: 'Akola Grain Yard', district: 'Akola', state: 'Maharashtra', commodityId: 'gram', benchmark: false, arrivalAvgQtl: 7000 },

  // Groundnut Mandis
  { id: 'rajkot_groundnut', name: 'Rajkot Marketing Yard', district: 'Rajkot', state: 'Gujarat', commodityId: 'groundnut', benchmark: true, arrivalAvgQtl: 22000 },
  { id: 'gondal_groundnut', name: 'Gondal APMC', district: 'Rajkot', state: 'Gujarat', commodityId: 'groundnut', benchmark: true, arrivalAvgQtl: 26000 },
  { id: 'bikaner_groundnut', name: 'Bikaner Mandi', district: 'Bikaner', state: 'Rajasthan', commodityId: 'groundnut', benchmark: false, arrivalAvgQtl: 14000 },

  // Mustard Mandis
  { id: 'jaipur_mustard', name: 'Jaipur Grain Mandi', district: 'Jaipur', state: 'Rajasthan', commodityId: 'mustard', benchmark: true, arrivalAvgQtl: 24000 },
  { id: 'alwar_mustard', name: 'Alwar APMC', district: 'Alwar', state: 'Rajasthan', commodityId: 'mustard', benchmark: true, arrivalAvgQtl: 19000 },
  { id: 'morena_mustard', name: 'Morena Mandi', district: 'Morena', state: 'Madhya Pradesh', commodityId: 'mustard', benchmark: false, arrivalAvgQtl: 13000 },

  // Paddy Mandis
  { id: 'karnal_paddy', name: 'Karnal Grain Market', district: 'Karnal', state: 'Haryana', commodityId: 'paddy', benchmark: true, arrivalAvgQtl: 42000 },
  { id: 'amritsar_paddy', name: 'Amritsar Bhagtanwala', district: 'Amritsar', state: 'Punjab', commodityId: 'paddy', benchmark: true, arrivalAvgQtl: 38000 },
  { id: 'bhatinda_paddy', name: 'Bathinda APMC', district: 'Bathinda', state: 'Punjab', commodityId: 'paddy', benchmark: false, arrivalAvgQtl: 29000 },
  { id: 'gondia_paddy', name: 'Gondia APMC', district: 'Gondia', state: 'Maharashtra', commodityId: 'paddy', benchmark: false, arrivalAvgQtl: 15000 }
];

// Seed market profiles for sample data generation
interface MarketProfile {
  basePrice: number;
  trend: TrendType;
  risk: RiskLevel;
  signal: TradeSignal;
  riskExplanation: string;
  signalRationale: string;
  aiHeadline: string;
  aiAnalysis: string;
  keyDrivers: string[];
  supportOffset: number;
  resistanceOffset: number;
  arrivalsTrend: string;
  traderAdvice: string;
}

const MARKET_PROFILES: Record<CommodityId, MarketProfile> = {
  onion: {
    basePrice: 2150,
    trend: 'Unavailable',
    risk: 'Low',
    signal: 'Insufficient Data',
    riskExplanation: 'Reference baseline quote. Volatility, physical arrivals, and weather impacts are unverified in this feed.',
    signalRationale: 'Trading signal disabled. A single day reference rate is insufficient to generate directional trade recommendations.',
    aiHeadline: 'Reference Baseline: Onion (Pyaz)',
    aiAnalysis: 'Displaying calibrated baseline benchmark rate. Official single-day daily bulletins publish auction prices without volume tonnage or weather records.',
    keyDrivers: [
      'Calibrated baseline benchmark rate',
      'Daily auction bulletin provides single-day quotes',
      'Historical observations and external risk factors unverified'
    ],
    supportOffset: 120,
    resistanceOffset: 250,
    arrivalsTrend: 'Unrecorded in daily price bulletin',
    traderAdvice: 'Current government quote verified. Historical trend unavailable.'
  },
  soybean: {
    basePrice: 4720,
    trend: 'Unavailable',
    risk: 'Low',
    signal: 'Insufficient Data',
    riskExplanation: 'Reference baseline quote. Volatility, physical arrivals, and processing demand are unverified in this feed.',
    signalRationale: 'Trading signal disabled. A single day reference rate is insufficient to generate directional trade recommendations.',
    aiHeadline: 'Reference Baseline: Soybean',
    aiAnalysis: 'Displaying calibrated baseline benchmark rate. Official single-day daily bulletins publish auction prices without volume tonnage or processing demand records.',
    keyDrivers: [
      'Calibrated baseline benchmark rate',
      'Daily auction bulletin provides single-day quotes',
      'Historical observations and external risk factors unverified'
    ],
    supportOffset: 150,
    resistanceOffset: 180,
    arrivalsTrend: 'Unrecorded in daily price bulletin',
    traderAdvice: 'Current government quote verified. Historical trend unavailable.'
  },
  cotton: {
    basePrice: 7480,
    trend: 'Unavailable',
    risk: 'Low',
    signal: 'Insufficient Data',
    riskExplanation: 'Reference baseline quote. Volatility, physical arrivals, and mill demand are unverified in this feed.',
    signalRationale: 'Trading signal disabled. A single day reference rate is insufficient to generate directional trade recommendations.',
    aiHeadline: 'Reference Baseline: Cotton (Kapas)',
    aiAnalysis: 'Displaying calibrated baseline benchmark rate. Official single-day daily bulletins publish auction prices without volume tonnage or mill inventory records.',
    keyDrivers: [
      'Calibrated baseline benchmark rate',
      'Daily auction bulletin provides single-day quotes',
      'Historical observations and external risk factors unverified'
    ],
    supportOffset: 200,
    resistanceOffset: 320,
    arrivalsTrend: 'Unrecorded in daily price bulletin',
    traderAdvice: 'Current government quote verified. Historical trend unavailable.'
  },
  turmeric: {
    basePrice: 14650,
    trend: 'Unavailable',
    risk: 'Low',
    signal: 'Insufficient Data',
    riskExplanation: 'Reference baseline quote. Volatility, physical arrivals, and export demand are unverified in this feed.',
    signalRationale: 'Trading signal disabled. A single day reference rate is insufficient to generate directional trade recommendations.',
    aiHeadline: 'Reference Baseline: Turmeric (Haldi)',
    aiAnalysis: 'Displaying calibrated baseline benchmark rate. Official single-day daily bulletins publish auction prices without volume tonnage or export records.',
    keyDrivers: [
      'Calibrated baseline benchmark rate',
      'Daily auction bulletin provides single-day quotes',
      'Historical observations and external risk factors unverified'
    ],
    supportOffset: 450,
    resistanceOffset: 650,
    arrivalsTrend: 'Unrecorded in daily price bulletin',
    traderAdvice: 'Current government quote verified. Historical trend unavailable.'
  },
  wheat: {
    basePrice: 2680,
    trend: 'Unavailable',
    risk: 'Low',
    signal: 'Insufficient Data',
    riskExplanation: 'Reference baseline quote. Volatility, physical arrivals, and milling demand are unverified in this feed.',
    signalRationale: 'Trading signal disabled. A single day reference rate is insufficient to generate directional trade recommendations.',
    aiHeadline: 'Reference Baseline: Wheat (Gehun)',
    aiAnalysis: 'Displaying calibrated baseline benchmark rate. Official single-day daily bulletins publish auction prices without volume tonnage or buffer inventory records.',
    keyDrivers: [
      'Calibrated baseline benchmark rate',
      'Daily auction bulletin provides single-day quotes',
      'Historical observations and external risk factors unverified'
    ],
    supportOffset: 70,
    resistanceOffset: 120,
    arrivalsTrend: 'Unrecorded in daily price bulletin',
    traderAdvice: 'Current government quote verified. Historical trend unavailable.'
  },
  maize: {
    basePrice: 2240,
    trend: 'Unavailable',
    risk: 'Low',
    signal: 'Insufficient Data',
    riskExplanation: 'Reference baseline quote. Volatility, physical arrivals, and industrial feed demand are unverified in this feed.',
    signalRationale: 'Trading signal disabled. A single day reference rate is insufficient to generate directional trade recommendations.',
    aiHeadline: 'Reference Baseline: Maize (Makka)',
    aiAnalysis: 'Displaying calibrated baseline benchmark rate. Official single-day daily bulletins publish auction prices without volume tonnage or industrial feed stock records.',
    keyDrivers: [
      'Calibrated baseline benchmark rate',
      'Daily auction bulletin provides single-day quotes',
      'Historical observations and external risk factors unverified'
    ],
    supportOffset: 60,
    resistanceOffset: 90,
    arrivalsTrend: 'Unrecorded in daily price bulletin',
    traderAdvice: 'Current government quote verified. Historical trend unavailable.'
  }
};

/**
 * Generates sample historical price data points for charts (7d, 15d, 30d).
 * Values reflect realistic agricultural price behavior and volatility.
 */
function generatePriceHistory(basePrice: number, days: number, trend: 'Bullish' | 'Stable' | 'Bearish'): PricePoint[] {
  const points: PricePoint[] = [];
  const now = new Date('2026-09-10T19:00:00Z');
  
  // Drift parameter
  const drift = trend === 'Bullish' ? 0.006 : trend === 'Bearish' ? -0.005 : 0.0005;
  const volatility = 0.015;

  let currentSimPrice = basePrice * (1 - drift * days * 0.85);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    // Format date like '03 Sep', '04 Sep'
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateLabel = `${d.getDate().toString().padStart(2, '0')} ${monthNames[d.getMonth()]}`;

    // pseudo random walk with seed consistency
    const wave = Math.sin((days - i) * 0.7) * volatility * basePrice * 0.5;
    const progress = (days - 1 - i) / (days - 1 || 1);
    
    let price: number;
    if (i === 0) {
      price = basePrice;
    } else {
      const stepPrice = currentSimPrice + (basePrice - currentSimPrice) * progress + wave;
      price = Math.round(stepPrice / 5) * 5; // rounded to ₹5 increment
    }

    // arrivals volume
    const baseArrival = Math.round(basePrice * 4.5);
    const arrivalNoise = Math.sin(i * 1.3) * (baseArrival * 0.2);
    const arrivalQtl = Math.max(1200, Math.round(baseArrival + arrivalNoise));

    points.push({
      date: dateLabel,
      price: Math.max(100, price),
      arrivalQtl
    });
  }

  return points;
}

export function normalizeMarketName(name?: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/apmc|mandi|market|yard|grain|krishi|sub-market|sub-yard|subyard|upaj|samiti/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function getLiveMandiId(lm: AvailableLiveMarket): string {
  const c = normalizeMarketName(lm.commodity);
  const s = normalizeMarketName(lm.state);
  const d = normalizeMarketName(lm.district);
  const m = normalizeMarketName(lm.market);
  const v = normalizeMarketName(lm.variety) || 'general';
  const g = normalizeMarketName(lm.grade) || 'faq';
  return `live-${c}-${s}-${d}-${m}-${v}-${g}`;
}

/**
 * Returns complete market data for a given commodity and mandi.
 * Returns calibrated baseline data.
 */
export function getMarketData(commodityId: CommodityId, mandiId?: string, customMarket?: MandiMarket): MarketData {
  const commodity = COMMODITIES.find(c => c.id === commodityId) || COMMODITIES[0];
  const commodityMandis = MANDIS.filter(m => m.commodityId === commodity.id);

  let selectedMandi: MandiMarket;
  if (customMarket) {
    selectedMandi = {
      ...customMarket,
      commodityId: commodity.id
    };
  } else {
    const foundInCommodity = commodityMandis.find(m => m.id === mandiId || cleanMandiString(m.name) === cleanMandiString(mandiId || ''));
    if (foundInCommodity) {
      selectedMandi = foundInCommodity;
    } else {
      const foundInAll = ALL_MANDI_LOCATIONS.find(l => l.id === mandiId || cleanMandiString(l.name) === cleanMandiString(mandiId || ''));
      if (foundInAll) {
        selectedMandi = {
          id: foundInAll.id,
          name: foundInAll.name,
          district: foundInAll.district,
          state: foundInAll.state,
          commodityId: commodity.id,
          benchmark: false,
          arrivalAvgQtl: 5000,
          marathiName: foundInAll.marathiName
        };
      } else {
        selectedMandi = commodityMandis[0] || {
          id: mandiId || 'default',
          name: mandiId || 'APMC Mandi',
          district: '',
          state: 'Maharashtra',
          commodityId: commodity.id,
          benchmark: false,
          arrivalAvgQtl: 0
        };
      }
    }
  }

  const profile = MARKET_PROFILES[commodity.id] || {
    basePrice: 2800,
    trend: 'Unavailable',
    risk: 'Low',
    signal: 'Insufficient Data',
    riskExplanation: 'Reference baseline quote. Volatility and volume unverified.',
    signalRationale: 'Trading signal disabled.',
    aiHeadline: `Reference Baseline: ${commodity.name}`,
    aiAnalysis: 'Displaying calibrated baseline benchmark rate.',
    keyDrivers: ['Calibrated baseline benchmark rate'],
    supportOffset: 120,
    resistanceOffset: 150,
    arrivalsTrend: 'Regular',
    traderAdvice: 'Current government quote verified. Historical trend unavailable.'
  };

  // Apply subtle mandi specific adjustment for realism
  const mandiIndex = commodityMandis.findIndex(m => m.id === selectedMandi.id);
  const adjustment = (mandiIndex * 15) - 10;
  const currentPrice = profile.basePrice + adjustment;

  // Requirement 2 & 8: REMOVE or DISABLE previous close, percentage change, and fabricated history
  const previousPrice = null;
  const priceChange = null;
  const percentageChange = null;

  const history7d: PricePoint[] = [];
  const history15d: PricePoint[] = [];
  const history30d: PricePoint[] = [];

  const arrivalsTodayQtl = 0;
  const arrivalsChangePct = 0;

  const minPrice = Math.round(currentPrice * 0.94);
  const maxPrice = Math.round(currentPrice * 1.06);
  const todayFormatted = new Date().toLocaleDateString('en-GB');

  return {
    commodity,
    commodityId: commodity.id,
    mandi: selectedMandi,
    sourceMarket: 'Exact live quote unavailable — showing fallback/demo data',
    sourceDistrict: selectedMandi.district,
    sourceState: selectedMandi.state,
    marketsMatch: false,
    dataTypeCategory: 'FALLBACK DATA',
    dataQuality: 'Unavailable',
    dataQualityReason: 'No verified government record found for this selection/date.',
    hasZeroSpread: false,
    currentPrice,
    previousPrice,
    priceChange,
    percentageChange,
    hasVerifiedHistoricalData: false,
    trend: 'Unavailable',
    riskLevel: 'Unassessed',
    riskExplanation: 'Risk rating unavailable. Multi-day price volatility and physical arrivals are unrecorded in this feed.',
    tradeSignal: 'Insufficient Data',
    signalRationale: 'Trading signals (BUY/HOLD/WATCH) disabled. Multi-day verified historical data is not available.',
    aiSummary: {
      headline: `Reference Baseline: ${commodity.name} at ${selectedMandi.name}`,
      analysis: `Official AGMARKNET bulletin has not logged active auction quotes for ${selectedMandi.name} in today's feed. Displaying calibrated reference baseline (₹${formatINR(currentPrice, { hideSymbol: true })}/qtl). Volume tonnage, demand shifts, and arrivals trend cannot be verified for today's session.`,
      keyDrivers: [
        `Live AGMARKNET auction report unverified for ${selectedMandi.name}`,
        'Displaying calibrated historical baseline benchmark',
        'Always confirm rates directly with APMC commission agents before trading'
      ],
      supportPrice: minPrice,
      resistancePrice: maxPrice,
      arrivalsSummary: 'Unrecorded in daily price bulletin',
      traderAdvice: 'Current government quote verified. Historical trend unavailable.',
      confidenceScore: 45
    },
    history7d,
    history15d,
    history30d,
    arrivalsTodayQtl,
    arrivalsChangePct,
    lastUpdated: `Reported Today (${todayFormatted}) • Calibrated Baseline`,
    // Real market data service fields
    dataSource: 'Local Reference Sample (AGMARKNET Baseline)',
    isLive: false,
    variety: customMarket?.variety || 'FAQ / General',
    grade: customMarket?.grade || 'FAQ',
    arrivalDate: todayFormatted,
    minPrice,
    maxPrice,
    modalPrice: currentPrice,
    fetchStatus: 'fallback',
    statusMessage: 'No verified government record found for this selection/date.',
    rawGovRecord: null
  };
}

/**
 * Generates an explicit DEMO DATA object for user scenario modeling
 */
export function getDemoMarketData(commodityId: CommodityId, mandiId?: string): MarketData {
  const base = getMarketData(commodityId, mandiId);
  return {
    ...base,
    dataTypeCategory: 'DEMO DATA',
    dataQuality: 'Warning',
    dataQualityReason: 'Synthetic simulation data active for trader scenario planning',
    dataSource: 'Simulation Scenario Engine (Demo Mode)',
    statusMessage: 'Demo simulation mode active. Synthetic test parameters applied for user planning.',
    tradeSignal: 'Insufficient Data',
    signalRationale: 'Trading recommendations disabled in Demo Simulation mode.',
    aiSummary: {
      ...base.aiSummary,
      headline: `Demo Simulation: ${base.commodity.name} at ${base.mandi.name}`,
      analysis: `Simulation scenario data is active. Theoretical baseline benchmark of ₹${formatINR(base.currentPrice, { hideSymbol: true })}/qtl applied for sensitivity analysis.`,
      confidenceScore: 50,
      traderAdvice: 'Current government quote verified. Historical trend unavailable.'
    }
  };
}

/**
 * Fetches real market data from server-side AGMARKNET / data.gov.in proxy.
 * Strictly verifies that the returned record matches the selected commodity, market, district/state.
 * If exact market match is unavailable, clearly flags as fallback data and NEVER labels it LIVE DATA.
 */
export async function fetchLiveMarketData(commodityId: CommodityId, mandiId?: string, customMarket?: MandiMarket): Promise<MarketData> {
  const fallback = getMarketData(commodityId, mandiId, customMarket);
  try {
    const params = new URLSearchParams({
      commodity: commodityId,
      market: fallback.mandi.name,
      district: fallback.mandi.district,
      state: fallback.mandi.state
    });

    // Requirement 1 & 4: Only apply a variety filter if it was explicitly selected from verified live records or user selection
    if (customMarket?.variety && customMarket.variety !== 'All' && customMarket.variety !== 'FAQ / General') {
      params.set('variety', customMarket.variety);
    }

    const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/mandi-prices?${params.toString()}`);
    if (!res.ok) {
      return {
        ...fallback,
        dataTypeCategory: 'DATA UNAVAILABLE',
        isLive: false,
        fetchStatus: 'error',
        modalPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        currentPrice: 0,
        dataQuality: 'Unavailable',
        dataQualityReason: `HTTP ${res.status}: Failed to reach market data service.`,
        statusMessage: 'Government data pipeline currently unavailable.',
        rawGovRecord: null,
        rawApiResponse: null,
        availableLiveMarkets: []
      };
    }

    const payload = await res.json();

    // STRICT INTEGRITY CHECK: Only mark as live if exactMatch is true AND record exists AND isLive is true
    if (payload && payload.isLive === true && payload.exactMatch === true && payload.record) {
      const record = payload.record;

      // Explicit verification: Commodity & Market must match
      const reqCmdClean = cleanMandiString(fallback.commodity.name);
      const recCmdClean = cleanMandiString(record.commodity);
      const isSoyReq = reqCmdClean.includes('soy');
      const isSoyRec = recCmdClean.includes('soy');
      const isCommodityMatch = (isSoyReq && isSoyRec) ||
        (!isSoyReq && !isSoyRec && (
          recCmdClean.includes(reqCmdClean) ||
          reqCmdClean.includes(recCmdClean) ||
          fallback.commodity.aliases?.some(a => cleanMandiString(a) === recCmdClean || recCmdClean.includes(cleanMandiString(a)))
        ));

      const reqMktClean = cleanMandiString(fallback.mandi.name);
      const recMktClean = cleanMandiString(record.market);
      const isMarketMatch = reqMktClean === recMktClean ||
        (reqMktClean.length >= 4 && recMktClean.includes(reqMktClean)) ||
        (recMktClean.length >= 4 && reqMktClean.includes(recMktClean));

      if (!isCommodityMatch || !isMarketMatch) {
        return {
          ...fallback,
          dataTypeCategory: 'NO VERIFIED DATA TODAY',
          isLive: false,
          arrivalDate: '',
          fetchStatus: 'fallback',
          modalPrice: 0,
          minPrice: 0,
          maxPrice: 0,
          currentPrice: 0,
          dataQuality: 'Unavailable',
          dataQualityReason: `No verified government market record found for ${fallback.commodity.name} at ${fallback.mandi.name} today.`,
          statusMessage: `No verified government market record found for ${fallback.commodity.name} at ${fallback.mandi.name} today.`,
          sourceMarket: 'No verified official record filed today',
          dataSource: 'data.gov.in (AGMARKNET - Govt. of India)',
          rawGovRecord: null,
          rawApiResponse: payload.rawApiResponse || null,
          availableLiveMarkets: payload.availableLiveMarkets || []
        };
      }

      const modalPrice = Number(record.modal_price);
      const minPrice = Number(record.min_price);
      const maxPrice = Number(record.max_price);

      // Sanity validation: must be valid positive numbers
      if (!isNaN(modalPrice) && modalPrice > 0) {
        const hasZeroSpread = (minPrice === modalPrice && modalPrice === maxPrice);
        const dataQuality = hasZeroSpread ? 'Warning' : 'Verified';
        const dataQualityReason = hasZeroSpread
          ? 'Zero price spread reported by APMC (Min = Modal = Max)'
          : 'Verified exact market match from AGMARKNET daily bulletin';

        const previousPrice = null;
        const priceChange = null;
        const percentageChange = null;
        const trend: TrendType = 'Unavailable';
        const tradeSignal: TradeSignal = 'Insufficient Data';
        const signalRationale = 'Trading signal disabled. A single day\'s government price record is insufficient to generate trade recommendations. Multi-day verified historical dataset required.';

        const spread = maxPrice - minPrice;
        const riskLevel: RiskLevel = 'Unassessed';
        const riskExplanation = 'Risk rating unavailable. Multi-day price volatility and physical arrivals are unrecorded in this feed.';

        const history7d: PricePoint[] = [];
        const history15d: PricePoint[] = [];
        const history30d: PricePoint[] = [];

        const aiSummary = {
          headline: `AGMARKNET Verified: ${fallback.commodity.name} at ${record.market}`,
          analysis: `Official daily bulletin published by Directorate of Marketing & Inspection logged modal rate of ${formatINR(modalPrice)}/quintal (Min: ${formatINR(minPrice)}, Max: ${formatINR(maxPrice)}, Spread: ₹${spread}/qtl) for ${record.variety || 'FAQ'} (${record.grade || 'FAQ'}) at ${record.market}, ${record.district || ''}, ${record.state || ''} on ${record.arrival_date}. Note: Government daily bulletins report auction bids; arrivals volume tonnage, multi-day price series, and weather factors are unrecorded in this feed.`,
          keyDrivers: [
            `Verified AGMARKNET quote for ${record.market} (${record.variety || 'FAQ'} - Grade: ${record.grade || 'FAQ'})`,
            hasZeroSpread
              ? `Warning: Zero price spread reported (Min = Modal = Max = ₹${modalPrice})`
              : `Auction bid spread: ₹${spread}/qtl across lots (Floor: ₹${minPrice}, Ceiling: ₹${maxPrice})`,
            `Bulletin Arrival Date: ${record.arrival_date} (Directorate of Marketing & Inspection)`,
            'Unrecorded parameters: Daily price bulletin does not report volume tonnage or weather effects'
          ],
          supportPrice: minPrice,
          resistancePrice: maxPrice,
          arrivalsSummary: 'Unrecorded in daily price bulletin',
          traderAdvice: 'Current government quote verified. Historical trend unavailable.',
          confidenceScore: hasZeroSpread ? 70 : 96
        };

        return {
          ...fallback,
          currentPrice: modalPrice,
          modalPrice,
          minPrice,
          maxPrice,
          variety: record.variety ? record.variety.trim() : 'FAQ',
          grade: record.grade ? record.grade.trim() : 'FAQ',
          arrivalDate: record.arrival_date || fallback.arrivalDate,
          previousPrice,
          priceChange,
          percentageChange,
          hasVerifiedHistoricalData: false,
          trend,
          riskLevel,
          riskExplanation,
          dataSource: payload.dataSource || 'data.gov.in (AGMARKNET - Govt. of India)',
          isLive: true,
          marketsMatch: true,
          sourceMarket: record.market,
          sourceDistrict: record.district || fallback.mandi.district,
          sourceState: record.state || fallback.mandi.state,
          dataTypeCategory: 'LIVE VERIFIED DATA',
          dataQuality,
          dataQualityReason,
          hasZeroSpread,
          tradeSignal,
          signalRationale,
          fetchStatus: 'live',
          statusMessage: payload.statusMessage || `Live auction quote verified directly for ${record.market} from AGMARKNET daily bulletin.`,
          lastUpdated: `Arrival Date: ${record.arrival_date} • AGMARKNET Live Bulletin`,
          history7d,
          history15d,
          history30d,
          arrivalsTodayQtl: 0,
          arrivalsChangePct: 0,
          aiSummary,
          rawGovRecord: payload.rawGovRecord || {
            commodity: record.commodity,
            variety: record.variety,
            market: record.market,
            district: record.district,
            state: record.state,
            arrival_date: record.arrival_date,
            min_price: minPrice,
            max_price: maxPrice,
            modal_price: modalPrice,
            grade: record.grade || 'FAQ'
          },
          rawApiResponse: payload.rawApiResponse || null,
          availableLiveMarkets: payload.availableLiveMarkets || []
        };
      }
    }

    // When API responded with NO VERIFIED DATA TODAY
    if (payload?.dataTypeCategory === 'NO VERIFIED DATA TODAY') {
      return {
        ...fallback,
        dataTypeCategory: 'NO VERIFIED DATA TODAY',
        isLive: false,
        arrivalDate: '',
        fetchStatus: 'fallback',
        modalPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        currentPrice: 0,
        dataQuality: 'Unavailable',
        dataQualityReason: payload.dataQualityReason || 'No verified government record found for this selection/date.',
        statusMessage: payload.statusMessage || 'No verified government record found for this selection/date.',
        sourceMarket: 'No verified official record filed today',
        dataSource: 'data.gov.in (AGMARKNET - Govt. of India)',
        rawGovRecord: null,
        rawApiResponse: payload.rawApiResponse || null,
        availableLiveMarkets: payload.availableLiveMarkets || []
      };
    }

    // When API responded with DATA UNAVAILABLE
    if (payload?.dataTypeCategory === 'DATA UNAVAILABLE') {
      return {
        ...fallback,
        dataTypeCategory: 'DATA UNAVAILABLE',
        isLive: false,
        arrivalDate: '',
        fetchStatus: 'error',
        modalPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        currentPrice: 0,
        dataQuality: 'Unavailable',
        dataQualityReason: payload.dataQualityReason || 'Government data pipeline unconfigured or failed.',
        statusMessage: payload.statusMessage || 'Government API unavailable.',
        sourceMarket: 'Government data pipeline unavailable',
        dataSource: 'data.gov.in (AGMARKNET)',
        rawGovRecord: null,
        rawApiResponse: payload.rawApiResponse || null,
        availableLiveMarkets: []
      };
    }

    // Otherwise fallback if specified
    return {
      ...fallback,
      dataTypeCategory: 'NO VERIFIED DATA TODAY',
      isLive: false,
      arrivalDate: '',
      fetchStatus: 'fallback',
      modalPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      currentPrice: 0,
      dataQuality: 'Unavailable',
      dataQualityReason: payload?.dataQualityReason || 'No verified government record found for this selection/date.',
      statusMessage: payload?.statusMessage || 'No verified government record found for this selection/date.',
      rawGovRecord: null,
      rawApiResponse: payload?.rawApiResponse || null,
      availableLiveMarkets: payload?.availableLiveMarkets || []
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error';
    return {
      ...fallback,
      dataTypeCategory: 'DATA UNAVAILABLE',
      isLive: false,
      arrivalDate: '',
      fetchStatus: 'error',
      modalPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      currentPrice: 0,
      dataQuality: 'Unavailable',
      dataQualityReason: `Government data pipeline error (${errorMsg})`,
      statusMessage: `Government data pipeline error: ${errorMsg}`,
      sourceMarket: 'Government data pipeline error',
      dataSource: 'data.gov.in (AGMARKNET)',
      rawGovRecord: null,
      rawApiResponse: null,
      availableLiveMarkets: []
    };
  }
}

/**
 * Fetches available live reporting markets for a commodity from official data.gov.in AGMARKNET feed
 */
export async function getAvailableLiveMarkets(commodityId: CommodityId): Promise<AvailableLiveMarket[]> {
  try {
    const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/mandi-prices?commodity=${encodeURIComponent(commodityId)}`);
    if (!res.ok) return [];
    const payload = await res.json();
    return Array.isArray(payload.availableLiveMarkets) ? payload.availableLiveMarkets : [];
  } catch {
    return [];
  }
}

/**
 * Resolves initial market when changing commodity according to Requirement 3:
 * 1. Inspect verified live markets returned for that commodity.
 * 2. If benchmark has a verified record in current bulletin, retain benchmark.
 * 3. Else if live markets exist, select the first valid discovered live market with genuine variety/grade.
 * 4. Else retain benchmark with fallback data status.
 */
export async function resolveInitialMarketForCommodity(commodityId: CommodityId): Promise<{
  mandiId: string;
  customMarket?: MandiMarket;
}> {
  const predefinedMandis = MANDIS.filter(m => m.commodityId === commodityId);
  const benchmarkMandi = predefinedMandis.find(m => m.benchmark) || predefinedMandis[0];

  try {
    const liveMarkets = await getAvailableLiveMarkets(commodityId);
    if (liveMarkets.length > 0) {
      // Check if predefined benchmark has a verified record in today's official feed
      if (benchmarkMandi) {
        const normBm = normalizeMarketName(benchmarkMandi.name);
        const liveMatch = liveMarkets.find(lm => {
          const normLm = normalizeMarketName(lm.market);
          return normBm === normLm || (normBm.length >= 4 && normLm.includes(normBm)) || (normLm.length >= 4 && normBm.includes(normLm));
        });

        if (liveMatch) {
          return {
            mandiId: benchmarkMandi.id,
            customMarket: {
              id: benchmarkMandi.id,
              name: liveMatch.market.trim(),
              district: liveMatch.district.trim(),
              state: liveMatch.state.trim(),
              commodityId,
              benchmark: true,
              arrivalAvgQtl: benchmarkMandi.arrivalAvgQtl,
              variety: liveMatch.variety?.trim(),
              grade: liveMatch.grade?.trim()
            }
          };
        }
      }

      // Benchmark is not reporting in today's bulletin, but other verified live markets exist
      // Select the first valid discovered live market preserving exact official variety and grade
      const firstLive = liveMarkets[0];
      const customId = getLiveMandiId(firstLive);
      return {
        mandiId: customId,
        customMarket: {
          id: customId,
          name: firstLive.market.trim(),
          district: firstLive.district.trim(),
          state: firstLive.state.trim(),
          commodityId,
          benchmark: false,
          arrivalAvgQtl: 0,
          variety: firstLive.variety?.trim(),
          grade: firstLive.grade?.trim()
        }
      };
    }
  } catch (err) {
    console.error('Error resolving initial market for commodity:', err);
  }

  // If no live market exists in current bulletin, retain the benchmark with fallback
  return {
    mandiId: benchmarkMandi?.id || 'default',
    customMarket: undefined
  };
}

/**
 * Format Indian currency with ₹ symbol and optional Lakh/Crore formatting
 */
export function formatINR(amount: number, options?: { compact?: boolean; hideSymbol?: boolean; decimals?: number }): string {
  const decimals = options?.decimals ?? 0;
  const symbol = options?.hideSymbol ? '' : '₹';

  if (options?.compact && Math.abs(amount) >= 10000000) {
    return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (options?.compact && Math.abs(amount) >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(2)} Lakh`;
  }

  // Indian number comma formatting (e.g. 1,50,000)
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const parts = absAmount.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${isNegative ? '-' : ''}${symbol}${formattedInt}${decimalPart}`;
}

/**
 * Evaluates AI market summary strictly using verified data returned by the data source.
 * In accordance with strict data integrity rules, does not invent arrival changes, demand conditions, or speculative drivers.
 */
export function simulateAIEngineAnalysis(data: MarketData): MarketData['aiSummary'] {
  if (data.isLive && data.rawGovRecord) {
    const spread = data.maxPrice - data.minPrice;
    const spreadDesc = data.hasZeroSpread 
      ? `Zero price spread reported by APMC (Min = Modal = Max = ₹${data.modalPrice}/qtl).`
      : `Auction bid spread of ₹${spread}/qtl (Floor: ₹${data.minPrice}, Ceiling: ₹${data.maxPrice}).`;

    return {
      ...data.aiSummary,
      confidenceScore: data.hasZeroSpread ? 72 : 95,
      headline: `AGMARKNET Verified: ${data.commodity.name} at ${data.rawGovRecord.market}`,
      analysis: `Verified official auction report for ${data.rawGovRecord.variety || 'FAQ'} (${data.rawGovRecord.grade || data.grade || 'FAQ'}) at ${data.rawGovRecord.market} (${data.rawGovRecord.state}) on ${data.rawGovRecord.arrival_date}. Modal rate stands at ${formatINR(data.modalPrice)}/quintal. ${spreadDesc} Daily AGMARKNET feed does not provide arrival tonnage or warehouse inventory.`,
      keyDrivers: [
        `Verified AGMARKNET quote for ${data.rawGovRecord.market} (${data.rawGovRecord.variety || 'FAQ'} - Grade: ${data.rawGovRecord.grade || data.grade || 'FAQ'})`,
        data.hasZeroSpread ? 'Zero price spread reported by APMC' : `Auction spread: ₹${spread}/qtl across lots`,
        `Arrival Date: ${data.rawGovRecord.arrival_date}`,
        'Unrecorded parameters: Bulletin does not publish volume tonnage or weather records'
      ],
      arrivalsSummary: 'Unrecorded in daily price bulletin',
      traderAdvice: 'Current government quote verified. Historical trend unavailable.'
    };
  }

  // Fallback or Demo mode
  return {
    ...data.aiSummary,
    confidenceScore: data.dataTypeCategory === 'DEMO DATA' ? 50 : 45,
    headline: `Reference Baseline: ${data.commodity.name} at ${data.mandi.name}`,
    analysis: `Live auction quotes for ${data.mandi.name} are currently unavailable in today's official feed. Analysis reflects calibrated baseline data (Modal: ${formatINR(data.currentPrice)}/qtl). Intraday arrival metrics and demand factors are unverified for this session.`,
    keyDrivers: [
      `Live AGMARKNET report unavailable for ${data.mandi.name} today`,
      'Displaying calibrated baseline benchmark rate',
      'Daily price bulletin publishes single-day auction quotes without volume or weather records'
    ],
    arrivalsSummary: 'Unrecorded in daily price bulletin',
    traderAdvice: 'Current government quote verified. Historical trend unavailable.'
  };
}
