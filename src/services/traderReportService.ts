import { TraderReport, UserProfile, TraderVerificationStatus } from '../types';

const TRADER_REPORTS_KEY = 'agritrade_trader_reports_v3';
const USER_PROFILE_KEY = 'agritrade_user_profile_v2';

// Seed with authentic local market reports adhering strictly to TRADER REPORTED — LOCAL MARKET
export const INITIAL_TRADER_REPORTS: TraderReport[] = [
  {
    id: 'tr-rep-202',
    traderId: 'trader-rk-patil-nashik',
    traderName: 'Rajesh Solanke',
    businessName: 'Shree Swami Samarth Traders',
    role: 'Trader',
    district: 'Nashik',
    state: 'Maharashtra',
    mainAPMC: 'Lasalgaon APMC',
    marketName: 'Lasalgaon APMC',
    commodity: 'Onion',
    commodityId: 'onion',
    variety: 'Unhali / Garva',
    gradeQuality: 'Quality-Wise Bulletin',
    minPrice: 800,
    maxPrice: 4800,
    modalPrice: 3800,
    reportDate: '25/09/2026',
    submittedAt: '2026-09-25T08:30:00Z',
    note: 'Good quality red onion lot arrivals steady. Heavy demand for super bold lots from South India buyers.',
    hasPoster: true,
    posterUrl: '/images/trader-rate-poster-lasalgaon.svg',
    photoUrl: '/images/trader-rate-poster-lasalgaon.svg',
    photoFileName: 'lasalgaon-onion-rate-poster.jpg',
    originalUnit: '100 KG',
    extractionStatus: 'EXTRACTED',
    qualityRates: [
      {
        id: 'qr-1',
        quality: 'Super Extra Bold (सुपर मोठा माल)',
        rate: '₹4,400 – ₹4,800',
        minRate: 4400,
        maxRate: 4800,
        unit: '100 KG',
        sizeDescription: '60mm+ export quality'
      },
      {
        id: 'qr-2',
        quality: 'Medium / Golta (मध्यम गोल्टा)',
        rate: '₹3,600 – ₹4,200',
        minRate: 3600,
        maxRate: 4200,
        unit: '100 KG',
        sizeDescription: '45–55mm prime lot'
      },
      {
        id: 'qr-3',
        quality: 'Standard / Golti (बारीक गोल्टी माल)',
        rate: '₹2,700 – ₹3,400',
        minRate: 2700,
        maxRate: 3400,
        unit: '100 KG',
        sizeDescription: '30–40mm standard'
      },
      {
        id: 'qr-4',
        quality: 'Average / Chhat (छाट / सरासरी माल)',
        rate: '₹1,600 – ₹2,400',
        minRate: 1600,
        maxRate: 2400,
        unit: '100 KG',
        sizeDescription: 'Mixed / defect lot'
      },
      {
        id: 'qr-5',
        quality: 'Chingli / Light (चिंगळी / हलका)',
        rate: '₹800 – ₹1,400',
        minRate: 800,
        maxRate: 1400,
        unit: '100 KG',
        sizeDescription: 'Under 20mm wet/small'
      }
    ],
    verificationStatus: 'UNVERIFIED',
    sourceType: 'TRADER_REPORTED',
    // Backwards compatibility
    apmc: 'Lasalgaon APMC',
    commodityName: 'Onion (कांदा)',
    date: '25/09/2026',
    notes: 'Good quality red onion lot arrivals steady. Heavy demand for super bold lots from South India buyers.',
    qualityGrade: 'Quality-Wise Bulletin',
    submittedBy: {
      name: 'Rajesh Solanke',
      mobileMasked: '+91 98*** ***45',
      userType: 'Trader'
    },
    moderationStatus: 'APPROVED'
  },
  {
    id: 'tr-rep-201',
    traderId: 'trader-rahul-solapur',
    traderName: 'Rahul Patil',
    businessName: 'Patil Onion Traders',
    role: 'Trader',
    district: 'Solapur',
    state: 'Maharashtra',
    mainAPMC: 'Solapur APMC',
    marketName: 'Solapur Local Market',
    commodity: 'Onion',
    commodityId: 'onion',
    variety: 'Red',
    gradeQuality: 'Quality-Wise Rate Sheet',
    minPrice: 1200,
    maxPrice: 4600,
    modalPrice: 3600,
    reportDate: '20/09/2026',
    submittedAt: '2026-09-20T08:45:00Z',
    note: 'Good quality red onion lot arrivals steady. Graded lots receiving premium rates in morning trade.',
    hasPoster: true,
    posterUrl: '/images/trader-rate-poster-solapur.svg',
    photoUrl: '/images/trader-rate-poster-solapur.svg',
    photoFileName: 'solapur-rate-bulletin.jpg',
    originalUnit: '100 KG',
    extractionStatus: 'EXTRACTED',
    qualityRates: [
      {
        id: 'qr-sol-1',
        quality: 'Premium Extra Bold (सुपर मोठा माल)',
        rate: '₹4,200 – ₹4,600',
        minRate: 4200,
        maxRate: 4600,
        unit: '100 KG',
        sizeDescription: 'Dense red skin'
      },
      {
        id: 'qr-sol-2',
        quality: 'Medium Golta (मध्यम गोल्टा)',
        rate: '₹3,400 – ₹3,900',
        minRate: 3400,
        maxRate: 3900,
        unit: '100 KG',
        sizeDescription: 'Clean dry lot'
      },
      {
        id: 'qr-sol-3',
        quality: 'Standard Golti (गोल्टी)',
        rate: '₹2,500 – ₹3,100',
        minRate: 2500,
        maxRate: 3100,
        unit: '100 KG',
        sizeDescription: 'Regular size'
      },
      {
        id: 'qr-sol-4',
        quality: 'Average / Chingli (छाट / चिंगळी)',
        rate: '₹1,200 – ₹2,100',
        minRate: 1200,
        maxRate: 2100,
        unit: '100 KG',
        sizeDescription: 'Small / mixed'
      }
    ],
    verificationStatus: 'UNVERIFIED',
    sourceType: 'TRADER_REPORTED',
    apmc: 'Solapur APMC',
    commodityName: 'Onion (कांदा)',
    date: '20/09/2026',
    notes: 'Good quality red onion lot arrivals steady. Graded lots receiving premium rates in morning trade.',
    qualityGrade: 'Quality-Wise Rate Sheet',
    submittedBy: {
      name: 'Rahul Patil',
      mobileMasked: '+91 98*** ***76',
      userType: 'Trader'
    },
    moderationStatus: 'APPROVED'
  },
  {
    id: 'tr-rep-203',
    traderId: 'trader-suresh-latur',
    traderName: 'Suresh Deshmukh',
    businessName: 'Marathwada Grain Traders',
    role: 'Commission Agent',
    district: 'Latur',
    state: 'Maharashtra',
    mainAPMC: 'Latur APMC',
    marketName: 'Latur Yard',
    commodity: 'Soybean',
    commodityId: 'soybean',
    variety: 'Yellow Grade 1',
    gradeQuality: 'Clean / Dry Lot',
    minPrice: 4600,
    maxPrice: 4950,
    modalPrice: 4820,
    reportDate: '25/09/2026',
    submittedAt: '2026-09-25T09:15:00Z',
    note: 'Moisture content within 10%. Processing mills active buyers.',
    hasPoster: false,
    originalUnit: '100 KG',
    extractionStatus: 'MANUAL',
    qualityRates: [
      {
        id: 'qr-lat-1',
        quality: 'Yellow Grade 1 (Crushing Quality)',
        rate: '₹4,800 – ₹4,950',
        minRate: 4800,
        maxRate: 4950,
        unit: '100 KG',
        sizeDescription: 'Under 10% moisture'
      },
      {
        id: 'qr-lat-2',
        quality: 'Standard Lot (FAQ)',
        rate: '₹4,600 – ₹4,780',
        minRate: 4600,
        maxRate: 4780,
        unit: '100 KG',
        sizeDescription: 'General arrival'
      }
    ],
    verificationStatus: 'UNVERIFIED',
    sourceType: 'TRADER_REPORTED',
    apmc: 'Latur APMC',
    commodityName: 'Soybean (सोयाबीन)',
    date: '25/09/2026',
    notes: 'Moisture content within 10%. Processing mills active buyers.',
    qualityGrade: 'Clean / Dry Lot',
    submittedBy: {
      name: 'Suresh Deshmukh',
      mobileMasked: '+91 94*** ***89',
      userType: 'Commission Agent'
    },
    moderationStatus: 'APPROVED'
  },
  {
    id: 'tr-rep-204',
    traderId: 'trader-nitin-nashik',
    traderName: 'Nitin Shinde',
    businessName: 'Shinde Agro Mandi Traders',
    role: 'Trader',
    district: 'Nashik',
    state: 'Maharashtra',
    mainAPMC: 'Nashik APMC',
    marketName: 'Nashik APMC',
    commodity: 'Soybean',
    commodityId: 'soybean',
    variety: 'Yellow',
    gradeQuality: 'Standard / Dry Lot',
    minPrice: 5100,
    maxPrice: 5300,
    modalPrice: 5200,
    reportDate: '25/09/2026',
    submittedAt: '2026-09-25T10:00:00Z',
    note: 'Crushing quality yellow soybean trading actively at Nashik APMC.',
    hasPoster: false,
    originalUnit: '100 KG',
    extractionStatus: 'MANUAL',
    qualityRates: [
      {
        id: 'qr-nsh-1',
        quality: 'Premium Bold Soybean',
        rate: '₹5,200 – ₹5,300',
        minRate: 5200,
        maxRate: 5300,
        unit: '100 KG',
        sizeDescription: 'Direct plant supply'
      },
      {
        id: 'qr-nsh-2',
        quality: 'Standard Market Grade',
        rate: '₹5,100 – ₹5,180',
        minRate: 5100,
        maxRate: 5180,
        unit: '100 KG',
        sizeDescription: 'Dry arrival'
      }
    ],
    verificationStatus: 'UNVERIFIED',
    sourceType: 'TRADER_REPORTED',
    apmc: 'Nashik APMC',
    commodityName: 'Soybean (सोयाबीन)',
    date: '25/09/2026',
    notes: 'Crushing quality yellow soybean trading actively at Nashik APMC.',
    qualityGrade: 'Standard / Dry Lot',
    submittedBy: {
      name: 'Nitin Shinde',
      mobileMasked: '+91 97*** ***45',
      userType: 'Trader'
    },
    moderationStatus: 'APPROVED'
  },
  {
    id: 'tr-rep-punjab-101',
    traderId: 'trader-gurpreet-ludhiana',
    traderName: 'Gurpreet Singh',
    businessName: 'Ludhiana Grain Trading Co.',
    role: 'Wholesaler',
    district: 'Ludhiana',
    state: 'Punjab',
    mainAPMC: 'Ludhiana APMC',
    marketName: 'Ludhiana Grain Yard',
    commodity: 'Wheat',
    commodityId: 'wheat',
    variety: 'Kalyan / Dara',
    gradeQuality: 'Milling Grade 1',
    minPrice: 2350,
    maxPrice: 2480,
    modalPrice: 2440,
    reportDate: '25/09/2026',
    submittedAt: '2026-09-25T08:15:00Z',
    note: 'Clean dry Sharbati & Kalyan wheat arrivals active in Ludhiana APMC. Flour mills aggressive buyers.',
    hasPoster: false,
    originalUnit: '100 KG',
    extractionStatus: 'MANUAL',
    qualityRates: [
      {
        id: 'qr-ldh-1',
        quality: 'Grade A Clean Milling Grain (अग्रणी मिलिंग गहू)',
        rate: '₹2,440 – ₹2,480',
        minRate: 2440,
        maxRate: 2480,
        unit: '100 KG',
        sizeDescription: 'Under 10% moisture, bold golden grain'
      },
      {
        id: 'qr-ldh-2',
        quality: 'Standard Grain Market Lot (सामान्य लिलाव माल)',
        rate: '₹2,350 – ₹2,420',
        minRate: 2350,
        maxRate: 2420,
        unit: '100 KG',
        sizeDescription: 'Fair average quality'
      }
    ],
    verificationStatus: 'UNVERIFIED',
    sourceType: 'TRADER_REPORTED',
    apmc: 'Ludhiana APMC',
    commodityName: 'Wheat (गहू / गेहूँ)',
    date: '25/09/2026',
    notes: 'Clean dry Sharbati & Kalyan wheat arrivals active in Ludhiana APMC. Flour mills aggressive buyers.',
    qualityGrade: 'Milling Grade 1',
    submittedBy: {
      name: 'Gurpreet Singh',
      mobileMasked: '+91 98*** ***10',
      userType: 'Wholesaler'
    },
    moderationStatus: 'APPROVED'
  },
  {
    id: 'tr-rep-punjab-102',
    traderId: 'trader-harpreet-khanna',
    traderName: 'Harpreet Dhillon',
    businessName: 'Dhillon Agro Commission Agents',
    role: 'Commission Agent',
    district: 'Ludhiana',
    state: 'Punjab',
    mainAPMC: 'Khanna Grain Market',
    marketName: 'Khanna Grain Market',
    commodity: 'Wheat',
    commodityId: 'wheat',
    variety: 'Sharbati / Kalyan',
    gradeQuality: 'Milling Quality',
    minPrice: 2380,
    maxPrice: 2510,
    modalPrice: 2460,
    reportDate: '25/09/2026',
    submittedAt: '2026-09-25T08:50:00Z',
    note: 'Khanna market auction brisk for premium lots. Steady off-take by bulk logistics buyers.',
    hasPoster: false,
    originalUnit: '100 KG',
    extractionStatus: 'MANUAL',
    qualityRates: [
      {
        id: 'qr-khn-1',
        quality: 'Bold Sharbati Milling',
        rate: '₹2,470 – ₹2,510',
        minRate: 2470,
        maxRate: 2510,
        unit: '100 KG',
        sizeDescription: 'Premium export & mill grade'
      },
      {
        id: 'qr-khn-2',
        quality: 'Dara Commercial Grade',
        rate: '₹2,380 – ₹2,450',
        minRate: 2380,
        maxRate: 2450,
        unit: '100 KG',
        sizeDescription: 'FAQ Standard'
      }
    ],
    verificationStatus: 'UNVERIFIED',
    sourceType: 'TRADER_REPORTED',
    apmc: 'Khanna Grain Market',
    commodityName: 'Wheat (गहू / गेहूँ)',
    date: '25/09/2026',
    notes: 'Khanna market auction brisk for premium lots. Steady off-take by bulk logistics buyers.',
    qualityGrade: 'Milling Quality',
    submittedBy: {
      name: 'Harpreet Dhillon',
      mobileMasked: '+91 98*** ***88',
      userType: 'Commission Agent'
    },
    moderationStatus: 'APPROVED'
  },
  {
    id: 'tr-rep-mp-101',
    traderId: 'trader-ramesh-indore',
    traderName: 'Rameshwar Patidar',
    businessName: 'Malwa Agro Trading Corporation',
    role: 'Trader',
    district: 'Indore',
    state: 'Madhya Pradesh',
    mainAPMC: 'Indore Mandi (Chhavani)',
    marketName: 'Indore Chhavani Yard',
    commodity: 'Soybean',
    commodityId: 'soybean',
    variety: 'Yellow Crushing',
    gradeQuality: 'Crushing Grade 1',
    minPrice: 4700,
    maxPrice: 5080,
    modalPrice: 4940,
    reportDate: '25/09/2026',
    submittedAt: '2026-09-25T09:30:00Z',
    note: 'Crushing grade yellow soybean trading strongly in Indore. Solvent extractors active.',
    hasPoster: false,
    originalUnit: '100 KG',
    extractionStatus: 'MANUAL',
    qualityRates: [
      {
        id: 'qr-ind-1',
        quality: 'Grade A Yellow Bold (सुपर माल)',
        rate: '₹4,950 – ₹5,080',
        minRate: 4950,
        maxRate: 5080,
        unit: '100 KG',
        sizeDescription: 'Low moisture crushing quality'
      },
      {
        id: 'qr-ind-2',
        quality: 'General Crushing Grade (FAQ)',
        rate: '₹4,700 – ₹4,900',
        minRate: 4700,
        maxRate: 4900,
        unit: '100 KG',
        sizeDescription: 'Standard arrival'
      }
    ],
    verificationStatus: 'UNVERIFIED',
    sourceType: 'TRADER_REPORTED',
    apmc: 'Indore Mandi (Chhavani)',
    commodityName: 'Soybean (सोयाबीन)',
    date: '25/09/2026',
    notes: 'Crushing grade yellow soybean trading strongly in Indore. Solvent extractors active.',
    qualityGrade: 'Crushing Grade 1',
    submittedBy: {
      name: 'Rameshwar Patidar',
      mobileMasked: '+91 99*** ***55',
      userType: 'Trader'
    },
    moderationStatus: 'APPROVED'
  },
  {
    id: 'tr-rep-gujarat-101',
    traderId: 'trader-vikram-rajkot',
    traderName: 'Vikram Mehta',
    businessName: 'Saurashtra Cotton Ginning & Trade',
    role: 'Trader',
    district: 'Rajkot',
    state: 'Gujarat',
    mainAPMC: 'Rajkot Marketing Yard',
    marketName: 'Rajkot Marketing Yard',
    commodity: 'Cotton (Kapas)',
    commodityId: 'cotton',
    variety: 'Shankar 6',
    gradeQuality: 'Medium-Long Staple',
    minPrice: 6850,
    maxPrice: 7650,
    modalPrice: 7480,
    reportDate: '25/09/2026',
    submittedAt: '2026-09-25T09:45:00Z',
    note: 'Shankar 6 cotton arrivals steady. Spinning mills showing strong inquiry for clean dry lots.',
    hasPoster: false,
    originalUnit: '100 KG',
    extractionStatus: 'MANUAL',
    qualityRates: [
      {
        id: 'qr-rjk-1',
        quality: 'Super Clean Shankar 6 (29mm+ Staple)',
        rate: '₹7,450 – ₹7,650',
        minRate: 7450,
        maxRate: 7650,
        unit: '100 KG',
        sizeDescription: 'Spinning mill quality'
      },
      {
        id: 'qr-rjk-2',
        quality: 'Standard Raw Kapas (28mm)',
        rate: '₹6,850 – ₹7,350',
        minRate: 6850,
        maxRate: 7350,
        unit: '100 KG',
        sizeDescription: 'FAQ'
      }
    ],
    verificationStatus: 'UNVERIFIED',
    sourceType: 'TRADER_REPORTED',
    apmc: 'Rajkot Marketing Yard',
    commodityName: 'Cotton (कापूस / कपास)',
    date: '25/09/2026',
    notes: 'Shankar 6 cotton arrivals steady. Spinning mills showing strong inquiry for clean dry lots.',
    qualityGrade: 'Medium-Long Staple',
    submittedBy: {
      name: 'Vikram Mehta',
      mobileMasked: '+91 98*** ***33',
      userType: 'Trader'
    },
    moderationStatus: 'APPROVED'
  }
];

// Seed directory of public trader profiles
export const KNOWN_TRADER_PROFILES: Record<string, UserProfile> = {
  'trader-gurpreet-ludhiana': {
    id: 'trader-gurpreet-ludhiana',
    name: 'Gurpreet Singh',
    businessName: 'Ludhiana Grain Trading Co.',
    mobile: '+91 98765 43210',
    mobileMasked: '+91 98*** ***10',
    userType: 'Wholesaler',
    role: 'Wholesaler',
    district: 'Ludhiana',
    state: 'Punjab',
    mainApmc: 'Ludhiana APMC',
    primaryCommodity: 'wheat',
    commoditiesHandled: ['wheat', 'maize', 'potato'],
    operationType: 'Both',
    preferredApmcs: ['Ludhiana APMC', 'Khanna Grain Market'],
    about: 'Wholesale grain and wheat merchant operating in Ludhiana and Khanna APMC markets since 2012.',
    verificationStatus: 'VERIFIED',
    isOnboarded: true
  },
  'trader-harpreet-khanna': {
    id: 'trader-harpreet-khanna',
    name: 'Harpreet Dhillon',
    businessName: 'Dhillon Agro Commission Agents',
    mobile: '+91 98140 12388',
    mobileMasked: '+91 98*** ***88',
    userType: 'Commission Agent',
    role: 'Commission Agent',
    district: 'Ludhiana',
    state: 'Punjab',
    mainApmc: 'Khanna Grain Market',
    primaryCommodity: 'wheat',
    commoditiesHandled: ['wheat', 'paddy', 'maize'],
    operationType: 'Both',
    preferredApmcs: ['Khanna Grain Market', 'Ludhiana APMC'],
    about: 'Licensed commission agent in Khanna Asia’s largest grain market.',
    verificationStatus: 'VERIFIED',
    isOnboarded: true
  },
  'trader-ramesh-indore': {
    id: 'trader-ramesh-indore',
    name: 'Rameshwar Patidar',
    businessName: 'Malwa Agro Trading Corporation',
    mobile: '+91 99260 55455',
    mobileMasked: '+91 99*** ***55',
    userType: 'Trader',
    role: 'Trader',
    district: 'Indore',
    state: 'Madhya Pradesh',
    mainApmc: 'Indore Mandi (Chhavani)',
    primaryCommodity: 'soybean',
    commoditiesHandled: ['soybean', 'wheat', 'gram'],
    operationType: 'Both',
    preferredApmcs: ['Indore Mandi (Chhavani)', 'Ujjain APMC'],
    about: 'Central MP oilseed and grain merchant supplying crushing mills and processing plants.',
    verificationStatus: 'VERIFIED',
    isOnboarded: true
  },
  'trader-vikram-rajkot': {
    id: 'trader-vikram-rajkot',
    name: 'Vikram Mehta',
    businessName: 'Saurashtra Cotton Ginning & Trade',
    mobile: '+91 98250 88733',
    mobileMasked: '+91 98*** ***33',
    userType: 'Trader',
    role: 'Trader',
    district: 'Rajkot',
    state: 'Gujarat',
    mainApmc: 'Rajkot Marketing Yard',
    primaryCommodity: 'cotton',
    commoditiesHandled: ['cotton', 'groundnut'],
    operationType: 'Both',
    preferredApmcs: ['Rajkot Marketing Yard', 'Gondal APMC'],
    about: 'Leading raw cotton and groundnut aggregator across Saurashtra APMC yards.',
    verificationStatus: 'VERIFIED',
    isOnboarded: true
  },
  'trader-nitin-nashik': {
    id: 'trader-nitin-nashik',
    name: 'Nitin Shinde',
    businessName: 'Shinde Agro Mandi Traders',
    mobile: '+91 97234 56745',
    mobileMasked: '+91 97*** ***45',
    userType: 'Trader',
    role: 'Trader',
    district: 'Nashik',
    state: 'Maharashtra',
    mainApmc: 'Nashik APMC',
    commoditiesHandled: ['soybean', 'maize', 'wheat'],
    operationType: 'Both',
    preferredApmcs: ['Nashik APMC', 'Lasalgaon', 'Pimpalgaon Baswant'],
    about: 'Grain and oilseed aggregator operating in Nashik APMC yard.',
    verificationStatus: 'UNVERIFIED',
    isOnboarded: true
  },
  'trader-rahul-solapur': {
    id: 'trader-rahul-solapur',
    name: 'Rahul Patil',
    businessName: 'Patil Onion Traders',
    mobile: '+91 98223 45676',
    mobileMasked: '+91 98*** ***76',
    userType: 'Trader',
    role: 'Trader',
    district: 'Solapur',
    state: 'Maharashtra',
    mainApmc: 'Solapur APMC',
    commoditiesHandled: ['onion', 'wheat', 'gram'],
    operationType: 'Both',
    preferredApmcs: ['Solapur', 'Pune', 'Mumbai'],
    about: 'Dedicated wholesale onion and seasonal agricultural trade operating in Solapur district since 2015.',
    verificationStatus: 'UNVERIFIED',
    isOnboarded: true
  },
  'trader-rk-patil-nashik': {
    id: 'trader-rk-patil-nashik',
    name: 'R. K. Patil',
    businessName: 'Patil Agro Wholesale',
    mobile: '+91 98221 67812',
    mobileMasked: '+91 98*** ***12',
    userType: 'Wholesaler',
    role: 'Wholesaler',
    district: 'Nashik',
    state: 'Maharashtra',
    mainApmc: 'Lasalgaon APMC',
    commoditiesHandled: ['onion', 'soybean', 'maize'],
    operationType: 'Both',
    preferredApmcs: ['Lasalgaon', 'Pimpalgaon Baswant', 'Nashik'],
    about: 'Bulk onion aggregator and supply network across Western Maharashtra and South India markets.',
    verificationStatus: 'UNVERIFIED',
    isOnboarded: true
  },
  'trader-suresh-latur': {
    id: 'trader-suresh-latur',
    name: 'Suresh Deshmukh',
    businessName: 'Marathwada Grain Traders',
    mobile: '+91 94231 98789',
    mobileMasked: '+91 94*** ***89',
    userType: 'Commission Agent',
    role: 'Commission Agent',
    district: 'Latur',
    state: 'Maharashtra',
    mainApmc: 'Latur APMC',
    commoditiesHandled: ['soybean', 'gram', 'turmeric'],
    operationType: 'Selling',
    preferredApmcs: ['Latur', 'Akola', 'Nanded'],
    about: 'Licensed commission agent connecting Marathwada farmers with oil extraction plants.',
    verificationStatus: 'UNVERIFIED',
    isOnboarded: true
  }
};

export const FRESH_USER_PROFILE: UserProfile = {
  id: 'trader-fresh-user',
  name: '',
  mobile: '',
  userType: 'Trader',
  role: 'Trader',
  district: 'Nashik',
  state: 'Maharashtra',
  mainApmc: 'Nashik APMC',
  commoditiesHandled: ['wheat'],
  primaryCommodity: 'wheat',
  operationType: 'Both',
  preferredApmcs: ['Nashik APMC'],
  verificationStatus: 'UNVERIFIED',
  isOnboarded: false
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'trader-current-user',
  name: 'Rajesh Solanke',
  mobile: '+91 98220 12345',
  mobileMasked: '+91 98*** ***45',
  userType: 'Trader',
  role: 'Trader',
  district: 'Nashik',
  state: 'Maharashtra',
  mainApmc: 'Lasalgaon APMC',
  commoditiesHandled: ['onion', 'soybean', 'maize'],
  operationType: 'Both',
  preferredApmcs: ['Lasalgaon', 'Pimpalgaon Baswant', 'Pune (Moshi)', 'Solapur'],
  businessName: 'Solanke Agro Traders',
  about: 'Wholesale onion & grain trading across Nashik and Mumbai terminals since 2012.',
  verificationStatus: 'UNVERIFIED',
  isOnboarded: true
};

export function getStoredTraderReports(): TraderReport[] {
  if (typeof window === 'undefined') return INITIAL_TRADER_REPORTS;
  try {
    const raw = localStorage.getItem(TRADER_REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(TRADER_REPORTS_KEY, JSON.stringify(INITIAL_TRADER_REPORTS));
      return INITIAL_TRADER_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_TRADER_REPORTS;
  } catch (err) {
    console.warn('Could not read trader reports from storage:', err);
    return INITIAL_TRADER_REPORTS;
  }
}

export function findDuplicateTraderReport(
  reports: TraderReport[],
  candidate: {
    traderId: string;
    marketName: string;
    commodity: string;
    variety?: string;
    reportDate: string;
  }
): TraderReport | undefined {
  const norm = (s?: string) => (s || '').trim().toLowerCase();
  return reports.find(r => 
    r.traderId === candidate.traderId &&
    norm(r.marketName) === norm(candidate.marketName) &&
    norm(r.commodity) === norm(candidate.commodity) &&
    norm(r.variety) === norm(candidate.variety) &&
    norm(r.reportDate) === norm(candidate.reportDate)
  );
}

export interface ValidateReportResult {
  isValid: boolean;
  errorKey?: string;
  errorMessage?: string;
}

export function validateTraderReportInput(input: {
  marketName?: string;
  commodity?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  modalPrice?: number | string;
  reportDate?: string;
}): ValidateReportResult {
  if (!input.marketName || !input.marketName.trim()) {
    return {
      isValid: false,
      errorKey: 'validationMarketRequired',
      errorMessage: 'Market / Local Market name is required.'
    };
  }

  if (!input.commodity || !input.commodity.trim()) {
    return {
      isValid: false,
      errorKey: 'validationCommodityRequired',
      errorMessage: 'Commodity is required.'
    };
  }

  const min = typeof input.minPrice === 'string' ? parseFloat(input.minPrice) : Number(input.minPrice);
  const max = typeof input.maxPrice === 'string' ? parseFloat(input.maxPrice) : Number(input.maxPrice);

  if (isNaN(min) || min <= 0) {
    return {
      isValid: false,
      errorKey: 'validationMinPriceRequired',
      errorMessage: 'Valid minimum price greater than 0 is required.'
    };
  }

  if (isNaN(max) || max <= 0) {
    return {
      isValid: false,
      errorKey: 'validationMaxPriceRequired',
      errorMessage: 'Valid maximum price greater than 0 is required.'
    };
  }

  if (min < 0 || max < 0) {
    return {
      isValid: false,
      errorKey: 'validationNegativePrice',
      errorMessage: 'Prices cannot be negative.'
    };
  }

  if (min > max) {
    return {
      isValid: false,
      errorKey: 'validationMinGreaterThanMax',
      errorMessage: 'Minimum price cannot be greater than maximum price.'
    };
  }

  if (input.modalPrice !== undefined && input.modalPrice !== null && input.modalPrice !== '') {
    const modal = typeof input.modalPrice === 'string' ? parseFloat(input.modalPrice) : Number(input.modalPrice);
    if (!isNaN(modal) && modal > 0) {
      if (modal < min || modal > max) {
        return {
          isValid: false,
          errorKey: 'validationModalOutOfRange',
          errorMessage: 'Typical price must be between minimum and maximum price.'
        };
      }
    }
  }

  return { isValid: true };
}

export function saveOrUpdateTraderReport(
  reportData: Omit<TraderReport, 'id' | 'submittedAt'>,
  existingId?: string
): { report: TraderReport; isUpdate: boolean } {
  const reports = getStoredTraderReports();
  const duplicate = existingId 
    ? reports.find(r => r.id === existingId)
    : findDuplicateTraderReport(reports, {
        traderId: reportData.traderId,
        marketName: reportData.marketName,
        commodity: reportData.commodity,
        variety: reportData.variety,
        reportDate: reportData.reportDate
      });

  if (duplicate) {
    const updatedReport: TraderReport = {
      ...duplicate,
      ...reportData,
      id: duplicate.id,
      submittedAt: new Date().toISOString(),
      // Ensure source type can never be altered
      sourceType: 'TRADER_REPORTED'
    };

    const newReportsList = reports.map(r => r.id === duplicate.id ? updatedReport : r);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TRADER_REPORTS_KEY, JSON.stringify(newReportsList));
      } catch (e) {
        console.warn('Failed to update trader report in storage:', e);
      }
    }
    return { report: updatedReport, isUpdate: true };
  }

  const newReport: TraderReport = {
    ...reportData,
    id: `tr-rep-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    // Strict enforcement: Trader reports are always TRADER_REPORTED and never verified gov data
    sourceType: 'TRADER_REPORTED',
    verificationStatus: reportData.verificationStatus || 'UNVERIFIED',
    // Backwards compatibility mappings
    apmc: reportData.marketName,
    date: reportData.reportDate,
    commodityName: reportData.commodity,
    notes: reportData.note,
    qualityGrade: reportData.gradeQuality,
    submittedBy: {
      name: reportData.traderName,
      userType: reportData.role
    },
    moderationStatus: 'APPROVED'
  };

  const updatedList = [newReport, ...reports];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TRADER_REPORTS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to save trader report to storage:', e);
    }
  }

  return { report: newReport, isUpdate: false };
}

// Backwards compatibility alias for saveTraderReport
export function saveTraderReport(
  report: Omit<TraderReport, 'id' | 'submittedAt'> | any
): TraderReport {
  // Normalize incoming object whether old schema or new schema
  const traderName = report.traderName || report.submittedBy?.name || 'Agri Trader';
  const role = report.role || report.submittedBy?.userType || 'Trader';
  const marketName = report.marketName || report.apmc || 'Local Mandi';
  const commodity = report.commodity || report.commodityName || 'Onion';
  const reportDate = report.reportDate || report.date || '20/09/2026';
  const note = report.note || report.notes;
  const gradeQuality = report.gradeQuality || report.qualityGrade;

  const normalized: Omit<TraderReport, 'id' | 'submittedAt'> = {
    traderId: report.traderId || 'trader-current-user',
    traderName,
    businessName: report.businessName,
    role,
    district: report.district || 'Nashik',
    state: report.state || 'Maharashtra',
    mainAPMC: report.mainAPMC || report.apmc || 'Lasalgaon APMC',
    marketName,
    commodity,
    commodityId: report.commodityId,
    variety: report.variety,
    gradeQuality,
    minPrice: report.minPrice,
    maxPrice: report.maxPrice,
    modalPrice: report.modalPrice,
    reportDate,
    note,
    photoUrl: report.photoUrl || report.posterUrl,
    photoFileName: report.photoFileName || report.posterFileName || report.evidenceFileName,
    posterUrl: report.posterUrl || report.photoUrl,
    posterFileName: report.posterFileName || report.photoFileName || report.evidenceFileName,
    hasPoster: report.hasPoster ?? Boolean(report.posterUrl || report.photoUrl),
    qualityRates: report.qualityRates || [],
    originalUnit: report.originalUnit || '100 KG',
    extractionStatus: report.extractionStatus || (report.qualityRates?.length ? 'EXTRACTED' : 'MANUAL'),
    verificationStatus: report.verificationStatus || 'UNVERIFIED',
    sourceType: 'TRADER_REPORTED',
    // Compatibility fields
    apmc: marketName,
    date: reportDate,
    commodityName: commodity,
    notes: note,
    qualityGrade: gradeQuality,
    submittedBy: {
      name: traderName,
      userType: role
    },
    moderationStatus: 'APPROVED'
  };

  const result = saveOrUpdateTraderReport(normalized);
  return result.report;
}

export function moderateTraderReport(reportId: string, status: 'APPROVED' | 'REJECTED'): TraderReport[] {
  const reports = getStoredTraderReports();
  const updated = reports.map(r => {
    if (r.id === reportId) {
      return {
        ...r,
        moderationStatus: status,
        moderatedAt: new Date().toISOString()
      };
    }
    return r;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TRADER_REPORTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update report moderation:', e);
    }
  }
  return updated;
}

export function getTraderReportsByTraderId(traderId: string): TraderReport[] {
  const reports = getStoredTraderReports();
  return reports
    .filter(r => r.traderId === traderId || r.submittedBy?.name === traderId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getTraderProfileById(traderId: string, currentUserProfile?: UserProfile | null): UserProfile | null {
  // If viewing current user's profile
  if (currentUserProfile && (currentUserProfile.id === traderId || currentUserProfile.name.toLowerCase() === traderId.toLowerCase())) {
    return sanitizePublicProfile(currentUserProfile);
  }

  // Check known trader profiles
  if (KNOWN_TRADER_PROFILES[traderId]) {
    return sanitizePublicProfile(KNOWN_TRADER_PROFILES[traderId]);
  }

  // Find by trader name in known profiles or reports
  const byName = Object.values(KNOWN_TRADER_PROFILES).find(p => p.name.toLowerCase() === traderId.toLowerCase());
  if (byName) {
    return sanitizePublicProfile(byName);
  }

  // Derive from reports if exists
  const reports = getStoredTraderReports();
  const foundReport = reports.find(r => r.traderId === traderId || r.traderName.toLowerCase() === traderId.toLowerCase());
  if (foundReport) {
    return sanitizePublicProfile({
      id: foundReport.traderId,
      name: foundReport.traderName,
      businessName: foundReport.businessName,
      mobile: '', // Strictly omitted for privacy
      mobileMasked: undefined,
      userType: foundReport.role,
      role: foundReport.role,
      district: foundReport.district,
      state: foundReport.state,
      mainApmc: foundReport.mainAPMC,
      commoditiesHandled: foundReport.commodityId ? [foundReport.commodityId] : ['onion'],
      operationType: 'Both',
      preferredApmcs: [foundReport.mainAPMC],
      verificationStatus: foundReport.verificationStatus || 'UNVERIFIED',
      isOnboarded: true
    });
  }

  return null;
}

// Ensure no sensitive private details (mobile, email, address) are ever exposed publicly
export function sanitizePublicProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    mobile: '', // Hidden
    mobileMasked: undefined
  };
}

export function getStoredUserProfile(): UserProfile {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return FRESH_USER_PROFILE;
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(USER_PROFILE_KEY) : null;
    if (!raw) {
      return FRESH_USER_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...FRESH_USER_PROFILE,
      ...parsed,
      id: parsed.id || 'trader-current-user'
    };
  } catch {
    return FRESH_USER_PROFILE;
  }
}

export function resetStoredUserProfile(): void {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(USER_PROFILE_KEY);
  }
}

export function hasSavedUserProfile(): boolean {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return false;
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(USER_PROFILE_KEY) : null;
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed && parsed.isOnboarded === true);
  } catch {
    return false;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return;
  try {
    const toSave: UserProfile = {
      ...profile,
      id: profile.id || 'trader-current-user'
    };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(toSave));
    }
  } catch (err) {
    console.warn('Could not save user profile:', err);
  }
}

/**
 * Strict filtering utility for Trader-Reported data.
 * Adheres to Requirement 4:
 * Trader-reported rate MUST match Commodity + APMC/Market.
 * E.g. Soybean at Nashik APMC must not appear when Onion + Nashik APMC or Soybean + Pune is selected.
 */
export function isMatchingTraderReport(
  report: TraderReport,
  targetCommodityId: string,
  targetMarketName: string,
  targetDistrict?: string
): boolean {
  if (!report) return false;

  // 1. Commodity match (strict)
  const repCommodityId = (report.commodityId || '').toLowerCase().trim();
  const repCommodityName = (report.commodity || report.commodityName || '').toLowerCase().trim();
  const tgtCommodity = (targetCommodityId || '').toLowerCase().trim();

  const isTgtSoy = tgtCommodity.includes('soy');
  const isRepSoy = repCommodityId.includes('soy') || repCommodityName.includes('soy') || repCommodityName.includes('सोयाबीन');

  if (isTgtSoy !== isRepSoy) {
    return false;
  }

  const isTgtOnion = tgtCommodity === 'onion';
  const isRepOnion = repCommodityId === 'onion' || repCommodityName.includes('onion') || repCommodityName.includes('कांदा');

  if (isTgtOnion !== isRepOnion) {
    return false;
  }

  if (!isTgtSoy && !isTgtOnion) {
    const isDirectMatch = repCommodityId === tgtCommodity || repCommodityName.includes(tgtCommodity);
    if (!isDirectMatch) return false;
  }

  // 2. Market / APMC match (strict)
  const cleanStr = (s?: string) => (s || '').toLowerCase().replace(/mandi|apmc|market|yard|grain|krishi|sub-market/gi, '').replace(/[^a-z0-9]/g, '').trim();

  const repMarket = cleanStr(report.marketName || report.apmc || '');
  const repDist = cleanStr(report.district || '');
  const tgtMarket = cleanStr(targetMarketName);
  const tgtDist = cleanStr(targetDistrict);

  if (!tgtMarket) return false;

  const isMarketExact = repMarket === tgtMarket || (tgtMarket.length >= 4 && repMarket.includes(tgtMarket)) || (repMarket.length >= 4 && tgtMarket.includes(repMarket));
  
  if (isMarketExact) {
    return true;
  }

  // If district matches and market names share root
  if (tgtDist && repDist && tgtDist === repDist) {
    if (repMarket.includes(tgtMarket) || tgtMarket.includes(repMarket)) {
      return true;
    }
  }

  return false;
}
