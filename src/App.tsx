import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CommodityId, MarketData, MandiLocation, MandiMarket } from './types';
import {
  COMMODITIES,
  MAHARASHTRA_MANDIS,
  ALL_MANDI_LOCATIONS,
  getMarketData,
  fetchLiveMarketData,
  resolveProfileMandi
} from './services/mandiDataService';
import { SupportedLanguage, getSavedLanguage, saveLanguage } from './services/i18nService';
import { getTranslation } from './locales';

// Subcomponents matching the 7+ screen visual reference flow
import { WelcomeScreen } from './components/WelcomeScreen';
import { LanguageScreen } from './components/LanguageScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { StepByStepSelector } from './components/StepByStepSelector';
import { PriceDetailsView } from './components/PriceDetailsView';
import { SaleCalculatorView } from './components/SaleCalculatorView';
import { MoreView } from './components/MoreView';
import { CompareSection } from './components/CompareSection';
import { WatchlistView } from './components/WatchlistView';
import { BottomNavigation, MainTabType } from './components/BottomNavigation';
import { MandiReportModal } from './components/MandiReportModal';
import { ApiReadinessModal } from './components/ApiReadinessModal';
import { MarketAlertsModal } from './components/MarketAlertsModal';
import { MarketDirectoryView } from './components/MarketDirectoryView';
import { DailyMarketReportView } from './components/DailyMarketReportView';
import { TraderOnboarding } from './components/TraderOnboarding';
import { TraderReportsView } from './components/TraderReportsView';
import { AddLocalRateModal } from './components/AddLocalRateModal';
import { TraderProfileView } from './components/TraderProfileView';
import { FeedbackModal } from './components/FeedbackModal';
import { EditProfileView } from './components/EditProfileView';
import { AccountDeletionModal } from './components/AccountDeletionModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { DataSourcesDisclaimerModal } from './components/DataSourcesDisclaimerModal';
import { PublicDeleteAccountPage } from './components/PublicDeleteAccountPage';
import { AgriTradeWebsite } from './components/AgriTradeWebsite';
import { 
  getStoredUserProfile, 
  saveUserProfile, 
  getStoredTraderReports,
  saveTraderReport,
  hasSavedUserProfile,
  resetStoredUserProfile,
  FRESH_USER_PROFILE
} from './services/traderReportService';
import {
  getAuthSession,
  getProfileForMobile,
  saveProfileForMobile,
  purgeAllLocalUserData,
  logout as authLogout
} from './services/authService';
import { UserProfile, TraderSubmittedReport, TraderReport } from './types';

export type AppView =
  | 'welcome'
  | 'language_selection'
  | 'onboarding'
  | 'edit_profile'
  | 'home'
  | 'markets'
  | 'wizard'
  | 'details'
  | 'calculator'
  | 'compare'
  | 'watchlist'
  | 'more'
  | 'history'
  | 'guide'
  | 'bulletins'
  | 'report'
  | 'trader_reports'
  | 'trader_profile';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => getSavedLanguage());
  const t = getTranslation(currentLanguage);

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const session = getAuthSession();
    if (session.mobile) {
      const p = getProfileForMobile(session.mobile);
      if (p) return p;
    }
    return getStoredUserProfile();
  });
  const [traderReports, setTraderReports] = useState<TraderReport[]>(() => getStoredTraderReports());
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isAddLocalRateOpen, setIsAddLocalRateOpen] = useState<boolean>(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState<boolean>(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState<boolean>(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.pathname === '/disclaimer' ||
        window.location.pathname.startsWith('/disclaimer') ||
        window.location.pathname.includes('/disclaimer') ||
        window.location.search.includes('view=disclaimer') ||
        window.location.hash === '#disclaimer'
      );
    }
    return false;
  });
  const [editingReport, setEditingReport] = useState<TraderReport | undefined>(undefined);
  const [viewedTraderId, setViewedTraderId] = useState<string | null>(null);

  // Google Play Compliant Public Account Deletion Web Portal check
  const isPublicDeleteAccountRoute = typeof window !== 'undefined' && (
    window.location.pathname === '/delete-account' ||
    window.location.pathname.startsWith('/delete-account') ||
    window.location.pathname.includes('/delete-account') ||
    window.location.search.includes('page=delete-account') ||
    window.location.hash === '#delete-account'
  );

  const isInitialWebsiteRoute = typeof window !== 'undefined' && (
    window.location.pathname === '/website' ||
    window.location.pathname.includes('/website') ||
    window.location.search.includes('view=website') ||
    window.location.hash === '#website'
  );

  const [isShowingWebsite, setIsShowingWebsite] = useState<boolean>(isInitialWebsiteRoute);

  // Initial view: Open Welcome Page on startup
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const viewParam = params.get('view');
        if (viewParam === 'onboarding' || window.location.hash === '#onboarding') {
          return 'onboarding';
        }
        if (viewParam === 'home' || window.location.hash === '#home') {
          return 'home';
        }
        if (viewParam === 'edit_profile' || window.location.hash === '#edit_profile') {
          return 'edit_profile';
        }
      }
      return 'welcome';
    } catch {
      return 'welcome';
    }
  });

  const [activeTab, setActiveTab] = useState<MainTabType>('home');

  // Active commodity and mandi state derived strictly from user profile
  const [selectedCommodityId, setSelectedCommodityId] = useState<CommodityId>(() => {
    return userProfile.primaryCommodity || userProfile.commoditiesHandled?.[0] || 'wheat';
  });
  const [selectedMandi, setSelectedMandi] = useState<MandiLocation>(() => {
    return resolveProfileMandi(userProfile);
  });
  const [selectedVariety, setSelectedVariety] = useState<string>('Unhali / Garva');
  const [selectedGrade, setSelectedGrade] = useState<string>('FAQ / Standard');

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState<boolean>(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  // Market data state
  const [marketData, setMarketData] = useState<MarketData>(() => {
    const initCmd = userProfile.primaryCommodity || userProfile.commoditiesHandled?.[0] || 'wheat';
    const initMandi = resolveProfileMandi(userProfile);
    return getMarketData(initCmd, initMandi.id);
  });
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  const activeCommodityRef = useRef<CommodityId>(userProfile.primaryCommodity || 'wheat');

  // Fetch live market data
  const loadData = useCallback(async (
    commodityId: CommodityId,
    mandi: MandiLocation,
    variety?: string,
    grade?: string
  ) => {
    setIsLoadingData(true);
    console.log('[DATA QUERY]', {
      commodity: commodityId,
      market: mandi.name,
      district: mandi.district,
      state: mandi.state || 'Maharashtra',
      variety: variety || 'FAQ',
      grade: grade || 'FAQ',
      date: 'Today'
    });

    const cmdObj = COMMODITIES.find(c => c.id === commodityId) || COMMODITIES[0];
    setMarketData({
      commodity: cmdObj,
      commodityId,
      mandi: {
        id: mandi.id,
        name: mandi.name,
        marathiName: mandi.marathiName,
        district: mandi.district,
        state: mandi.state || 'Maharashtra',
        commodityId,
        benchmark: false,
        arrivalAvgQtl: 0,
        distanceKm: mandi.distanceKm || 0,
        isMajorAPMC: mandi.isMajorAPMC
      },
      sourceMarket: mandi.name,
      sourceDistrict: mandi.district,
      sourceState: mandi.state || 'Maharashtra',
      marketsMatch: true,
      dataTypeCategory: 'NO VERIFIED DATA TODAY',
      dataQuality: 'Unavailable',
      dataQualityReason: `Loading ${cmdObj.name} — ${mandi.name}…`,
      hasZeroSpread: false,
      currentPrice: 0,
      modalPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      previousPrice: null,
      priceChange: null,
      percentageChange: null,
      hasVerifiedHistoricalData: false,
      trend: 'Unavailable',
      riskLevel: 'Unassessed',
      riskExplanation: 'Loading market verification…',
      tradeSignal: 'Insufficient Data',
      signalRationale: 'Loading…',
      aiSummary: {
        headline: `Loading ${cmdObj.name} — ${mandi.name}`,
        analysis: 'Connecting to AGMARKNET daily bulletin pipeline…',
        keyDrivers: [],
        supportPrice: 0,
        resistancePrice: 0,
        arrivalsSummary: 'Loading…',
        traderAdvice: 'Connecting to market feed…',
        confidenceScore: 0
      },
      history7d: [],
      history15d: [],
      history30d: [],
      arrivalsTodayQtl: 0,
      arrivalsChangePct: 0,
      lastUpdated: 'Connecting to feed…',
      dataSource: 'data.gov.in (AGMARKNET)',
      isLive: false,
      variety: variety || 'FAQ',
      grade: grade || 'FAQ',
      arrivalDate: '',
      fetchStatus: 'loading',
      statusMessage: `Loading ${cmdObj.name} — ${mandi.name}…`
    });

    try {
      const customMandiMarket: MandiMarket = {
        id: mandi.id,
        name: mandi.name,
        marathiName: mandi.marathiName,
        district: mandi.district,
        state: mandi.state || 'Maharashtra',
        commodityId,
        benchmark: true,
        arrivalAvgQtl: 10000,
        distanceKm: mandi.distanceKm || 0,
        isMajorAPMC: true,
        specializedFor: mandi.isSpecializedFor,
        variety: variety || (mandi as any).variety || undefined,
        grade: grade || (mandi as any).grade || undefined
      };

      const result = await fetchLiveMarketData(commodityId, mandi.id, customMandiMarket);
      setMarketData({
        ...result,
        commodity: cmdObj,
        commodityId
      });
    } catch (err) {
      console.warn('Error fetching live data:', err);
      const fallback = getMarketData(commodityId, mandi.id);
      setMarketData({
        ...fallback,
        commodity: cmdObj,
        commodityId,
        dataTypeCategory: 'DATA UNAVAILABLE',
        isLive: false,
        arrivalDate: '',
        modalPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        currentPrice: 0,
        dataQuality: 'Unavailable',
        dataQualityReason: 'Failed to connect to government market data pipeline.',
        statusMessage: 'Government market data pipeline currently unavailable.'
      });
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Initial mount load
  useEffect(() => {
    loadData(selectedCommodityId, selectedMandi, selectedVariety, selectedGrade);
  }, [selectedCommodityId, selectedMandi, selectedVariety, selectedGrade, loadData]);

  // Synchronize active market context dynamically when userProfile updates
  useEffect(() => {
    if (userProfile.isOnboarded && (userProfile.mainApmc || userProfile.state)) {
      const targetMandi = resolveProfileMandi(userProfile);
      const targetCmd = userProfile.primaryCommodity || userProfile.commoditiesHandled?.[0] || selectedCommodityId;
      
      const mandiChanged = targetMandi.id !== selectedMandi.id || targetMandi.name !== selectedMandi.name;
      const cmdChanged = targetCmd !== selectedCommodityId;

      if (mandiChanged || cmdChanged) {
        if (cmdChanged) {
          setSelectedCommodityId(targetCmd);
          activeCommodityRef.current = targetCmd;
        }
        if (mandiChanged) {
          setSelectedMandi(targetMandi);
        }
        loadData(targetCmd, targetMandi);
      }
    }
  }, [userProfile.mainApmc, userProfile.state, userProfile.district, userProfile.primaryCommodity, userProfile.isOnboarded]);

  // Handle "Continue without login": open Home dashboard directly using saved profile
  const handleContinueWithoutLogin = () => {
    if (!hasSavedUserProfile()) {
      setCurrentView('onboarding');
      return;
    }

    const saved = getStoredUserProfile();
    setUserProfile(saved);

    const activeCmd = saved.primaryCommodity || saved.commoditiesHandled?.[0] || 'wheat';
    setSelectedCommodityId(activeCmd);
    activeCommodityRef.current = activeCmd;

    const matchedMandi = resolveProfileMandi(saved);
    setSelectedMandi(matchedMandi);
    loadData(activeCmd, matchedMandi);

    if (saved.preferredLanguage && saved.preferredLanguage !== currentLanguage) {
      setCurrentLanguage(saved.preferredLanguage as SupportedLanguage);
      saveLanguage(saved.preferredLanguage as SupportedLanguage);
    }

    try {
      localStorage.setItem('agritrade_welcome_seen', 'true');
    } catch {
      // Ignore
    }

    setCurrentView('home');
    setActiveTab('home');
  };

  // Handle completion of welcome / "Get Started"
  const handleGetStarted = () => {
    if (hasSavedUserProfile()) {
      handleContinueWithoutLogin();
      return;
    }
    setCurrentView('onboarding');
  };

  // Handle language selection confirmation
  const handleLanguageChosen = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    saveLanguage(lang);
    setIsLanguageModalOpen(false);
    if (currentView === 'language_selection' || currentView === 'welcome') {
      if (hasSavedUserProfile()) {
        handleContinueWithoutLogin();
      } else {
        setCurrentView('onboarding');
      }
    }
  };

  // Commodity selection handler
  const handleSelectCommodity = (id: CommodityId) => {
    console.log('[SEARCH SELECTION]', {
      type: 'commodity',
      commodity: id,
      date: 'Today'
    });
    setSelectedCommodityId(id);
    activeCommodityRef.current = id;
    loadData(id, selectedMandi);
  };

  // Unified single source of truth for market context selection
  const handleSelectMarketContext = (
    commodityId: CommodityId,
    mandi: MandiLocation,
    variety?: string,
    grade?: string,
    navigateTo: 'details' | 'markets' | 'home' = 'details'
  ) => {
    console.log('[SEARCH SELECTION]', {
      commodity: commodityId,
      market: mandi.name,
      district: mandi.district,
      state: mandi.state || 'Maharashtra',
      date: 'Today'
    });
    console.log('[NAVIGATION PAYLOAD]', {
      destination: navigateTo,
      commodity: commodityId,
      market: mandi.name,
      district: mandi.district,
      state: mandi.state || 'Maharashtra',
      date: 'Today'
    });

    setSelectedCommodityId(commodityId);
    activeCommodityRef.current = commodityId;
    setSelectedMandi(mandi);
    if (variety) setSelectedVariety(variety);
    if (grade) setSelectedGrade(grade);

    loadData(commodityId, mandi, variety, grade);

    if (navigateTo === 'details') {
      setCurrentView('details');
      setActiveTab('markets');
    } else if (navigateTo === 'markets') {
      setCurrentView('markets');
      setActiveTab('markets');
    } else if (navigateTo === 'home') {
      setCurrentView('home');
      setActiveTab('home');
    }
  };

  // Wizard confirmation handler
  const handleWizardConfirm = (
    cId: CommodityId,
    variety: string,
    grade: string,
    mandi: MandiLocation
  ) => {
    console.log('[SEARCH SELECTION]', {
      type: 'wizard_confirm',
      commodity: cId,
      variety,
      grade,
      market: mandi.name,
      district: mandi.district,
      state: mandi.state || 'Maharashtra',
      date: 'Today'
    });
    console.log('[NAVIGATION PAYLOAD]', {
      destination: 'details',
      commodity: cId,
      variety,
      grade,
      market: mandi.name,
      district: mandi.district,
      state: mandi.state || 'Maharashtra',
      date: 'Today'
    });

    setSelectedCommodityId(cId);
    activeCommodityRef.current = cId;
    setSelectedVariety(variety);
    setSelectedGrade(grade);
    setSelectedMandi(mandi);
    loadData(cId, mandi, variety, grade);
    setCurrentView('details');
    setActiveTab('markets');
  };

  // Tab switching from bottom nav
  const handleTabChange = (tab: MainTabType) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentView('home');
    } else if (tab === 'markets') {
      setCurrentView('markets');
    } else if (tab === 'calculator') {
      setCurrentView('calculator');
    } else if (tab === 'more') {
      setCurrentView('more');
    } else if (tab === 'add_rate') {
      handleOpenAddLocalRate();
    }
  };

  const handleOpenAddLocalRate = () => {
    setEditingReport(undefined);
    setIsAddLocalRateOpen(true);
  };

  const handleEditReport = (report: TraderReport) => {
    setEditingReport(report);
    setIsAddLocalRateOpen(true);
  };

  const handleViewTraderProfile = (traderId: string) => {
    setViewedTraderId(traderId);
    setCurrentView('trader_profile');
  };

  // Authentication: Logout handler
  const handleLogout = async () => {
    await authLogout();
    setCurrentView('welcome');
  };

  // Profile: Updated handler
  const handleProfileUpdated = (updated: UserProfile) => {
    const toSave: UserProfile = {
      ...updated,
      isOnboarded: true
    };
    setUserProfile(toSave);
    saveUserProfile(toSave);
    if (toSave.mobile) {
      saveProfileForMobile(toSave.mobile, toSave);
    }
    if (toSave.preferredLanguage && toSave.preferredLanguage !== currentLanguage) {
      setCurrentLanguage(toSave.preferredLanguage as SupportedLanguage);
      saveLanguage(toSave.preferredLanguage as SupportedLanguage);
    }
    const activeCmd = toSave.primaryCommodity || toSave.commoditiesHandled?.[0] || selectedCommodityId;
    setSelectedCommodityId(activeCmd);
    activeCommodityRef.current = activeCmd;

    const matched = resolveProfileMandi(toSave);
    setSelectedMandi(matched);
    loadData(activeCmd, matched);
  };

  if (isPublicDeleteAccountRoute) {
    return <PublicDeleteAccountPage />;
  }

  if (isShowingWebsite) {
    return (
      <>
        <AgriTradeWebsite
          onLaunchApp={() => {
            setIsShowingWebsite(false);
          }}
          onOpenPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)}
          onOpenDeleteAccount={() => setIsDeleteAccountOpen(true)}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
        {isDisclaimerModalOpen && (
          <DataSourcesDisclaimerModal
            isOpen={isDisclaimerModalOpen}
            onClose={() => setIsDisclaimerModalOpen(false)}
            language={currentLanguage}
          />
        )}
        {isPrivacyPolicyOpen && (
          <PrivacyPolicyModal
            language={currentLanguage}
            onClose={() => setIsPrivacyPolicyOpen(false)}
            onNavigateToDeleteAccount={() => {
              setIsPrivacyPolicyOpen(false);
              setIsDeleteAccountOpen(true);
            }}
          />
        )}
        {isDeleteAccountOpen && (
          <AccountDeletionModal
            language={currentLanguage}
            mobileNumber={userProfile?.mobile || getAuthSession().mobile || ''}
            onClose={() => setIsDeleteAccountOpen(false)}
            onDeletionSuccess={() => {
              setIsDeleteAccountOpen(false);
              setUserProfile(getStoredUserProfile());
              setIsShowingWebsite(false);
              setCurrentView('welcome');
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white antialiased w-full max-w-full overflow-x-hidden">
      {/* 1. SCREEN 1: WELCOME VIEW */}
      {currentView === 'welcome' && (
        <WelcomeScreen
          language={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onGetStarted={handleGetStarted}
          onContinueWithoutLogin={handleContinueWithoutLogin}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* 1B. TRADER ONBOARDING */}
      {currentView === 'onboarding' && (
        <TraderOnboarding
          language={currentLanguage}
          mobile={userProfile.mobile || getAuthSession().mobile || '9876543210'}
          initialProfile={userProfile}
          onLanguageChange={(lang) => {
            setCurrentLanguage(lang);
            saveLanguage(lang);
          }}
          onComplete={(saved) => {
            const completedProfile: UserProfile = {
              ...saved,
              isOnboarded: true
            };
            setUserProfile(completedProfile);
            saveUserProfile(completedProfile);
            if (completedProfile.mobile) {
              saveProfileForMobile(completedProfile.mobile, completedProfile);
            }
            if (completedProfile.preferredLanguage) {
              setCurrentLanguage(completedProfile.preferredLanguage as SupportedLanguage);
              saveLanguage(completedProfile.preferredLanguage as SupportedLanguage);
            }
            const activeCmd = completedProfile.primaryCommodity || completedProfile.commoditiesHandled?.[0] || 'wheat';
            setSelectedCommodityId(activeCmd);
            activeCommodityRef.current = activeCmd;

            const matchedMandi = resolveProfileMandi(completedProfile);
            setSelectedMandi(matchedMandi);
            loadData(activeCmd, matchedMandi);

            setCurrentView('home');
            setActiveTab('home');
          }}
        />
      )}

      {/* 2. SCREEN 2: LANGUAGE SELECTION */}
      {currentView === 'language_selection' && (
        <LanguageScreen
          currentLanguage={currentLanguage}
          onSelectLanguage={handleLanguageChosen}
          onBack={() => setCurrentView('welcome')}
        />
      )}

      {/* 3. SCREEN 3: HOME DASHBOARD */}
      {currentView === 'home' && (
        <HomeDashboard
          language={currentLanguage}
          selectedCommodityId={selectedCommodityId}
          selectedMandi={selectedMandi}
          currentMarketData={marketData}
          isLoadingData={isLoadingData}
          traderReports={traderReports}
          userProfile={userProfile}
          onSelectCommodity={handleSelectCommodity}
          onSelectMandi={(m) => {
            handleSelectMarketContext(selectedCommodityId, m, undefined, undefined, 'details');
          }}
          onSelectMarketContext={(cId, m, toDetails) => {
            handleSelectMarketContext(cId, m, undefined, undefined, toDetails ? 'details' : 'home');
          }}
          onNavigateToWizard={(cId) => {
            console.log('[NAVIGATION PAYLOAD]', { destination: 'wizard', commodity: cId, date: 'Today' });
            setSelectedCommodityId(cId);
            activeCommodityRef.current = cId;
            setCurrentView('wizard');
          }}
          onNavigateToDetails={() => {
            console.log('[NAVIGATION PAYLOAD]', {
              destination: 'details',
              commodity: selectedCommodityId,
              market: selectedMandi.name,
              district: selectedMandi.district,
              state: selectedMandi.state || 'Maharashtra',
              date: 'Today'
            });
            setCurrentView('details');
            setActiveTab('markets');
          }}
          onNavigateToMarkets={() => {
            console.log('[NAVIGATION PAYLOAD]', { destination: 'markets', commodity: selectedCommodityId });
            setCurrentView('markets');
            setActiveTab('markets');
          }}
          onNavigateToCompare={() => {
            setCurrentView('compare');
          }}
          onNavigateToCalculator={() => {
            setCurrentView('calculator');
            setActiveTab('calculator');
          }}
          onNavigateToWatchlist={() => {
            setCurrentView('watchlist');
          }}
          onNavigateToReport={() => {
            setCurrentView('report');
          }}
          onNavigateToTraderReports={() => {
            setCurrentView('trader_reports');
          }}
          onOpenAddLocalRate={handleOpenAddLocalRate}
          onViewTraderProfile={handleViewTraderProfile}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          onOpenDiagnosticsModal={() => setIsAlertsModalOpen(true)}
          onNavigateToEditProfile={() => setCurrentView('onboarding')}
          onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
      )}

      {/* 4. SCREEN 4: MARKET DIRECTORY VIEW */}
      {currentView === 'markets' && (
        <MarketDirectoryView
          language={currentLanguage}
          selectedCommodityId={selectedCommodityId}
          availableLiveMarkets={marketData.availableLiveMarkets}
          isLoading={isLoadingData}
          userProfile={userProfile}
          onSelectCommodity={(cId) => {
            setSelectedCommodityId(cId);
            loadData(cId, selectedMandi);
          }}
          onSelectMandi={(mandi) => {
            handleSelectMarketContext(selectedCommodityId, mandi, undefined, undefined, 'details');
          }}
          onBackToHome={() => {
            setCurrentView('home');
            setActiveTab('home');
          }}
          onRefreshData={() => {
            loadData(selectedCommodityId, selectedMandi);
          }}
          onOpenCompare={() => setCurrentView('compare')}
          onOpenWatchlist={() => setCurrentView('watchlist')}
          onNavigateToEditProfile={() => setCurrentView('edit_profile')}
        />
      )}

      {/* 5. SCREEN: STEP-BY-STEP COMMODITY SELECTOR WIZARD */}
      {currentView === 'wizard' && (
        <StepByStepSelector
          commodityId={selectedCommodityId}
          selectedMandi={selectedMandi}
          language={currentLanguage}
          onBack={() => {
            setCurrentView('home');
            setActiveTab('home');
          }}
          onConfirmSelection={handleWizardConfirm}
        />
      )}

      {/* 6. SCREEN 5: PRICE DETAILS & LOCAL PRICE VIEW */}
      {currentView === 'details' && (
        <PriceDetailsView
          data={marketData}
          isLoading={isLoadingData}
          language={currentLanguage}
          selectedCommodityId={selectedCommodityId}
          selectedVariety={selectedVariety}
          selectedGrade={selectedGrade}
          traderReports={traderReports}
          userProfile={userProfile}
          onNavigateToEditProfile={() => setCurrentView('edit_profile')}
          onBack={() => {
            if (activeTab === 'markets') {
              setCurrentView('markets');
            } else {
              setCurrentView('home');
              setActiveTab('home');
            }
          }}
          onGoToCalculator={() => {
            setCurrentView('calculator');
            setActiveTab('calculator');
          }}
          onGoToCompare={() => {
            setCurrentView('compare');
          }}
          onGenerateReport={() => setIsReportModalOpen(true)}
          onOpenSourceModal={() => setIsDiagnosticsModalOpen(true)}
          onOpenAddLocalRate={handleOpenAddLocalRate}
          onViewTraderProfile={handleViewTraderProfile}
        />
      )}

      {/* 7. SCREEN 6: PROFIT CALCULATOR VIEW */}
      {currentView === 'calculator' && (
        <SaleCalculatorView
          initialPrice={marketData.modalPrice || marketData.currentPrice}
          initialCommodityId={selectedCommodityId}
          mandiName={selectedMandi.name}
          language={currentLanguage}
          userProfile={userProfile}
          onNavigateToEditProfile={() => setCurrentView('edit_profile')}
          onBack={() => {
            setCurrentView('home');
            setActiveTab('home');
          }}
        />
      )}

      {/* 8. SCREEN 5: CROSS-MANDI COMPARISON VIEW */}
      {currentView === 'compare' && (
        <div className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto shadow-2xl p-4">
          <CompareSection
            commodityId={selectedCommodityId}
            commodityName={marketData.commodity.name}
            selectedMandiId={marketData.mandi.id}
            onSelectMandi={(mandiId, customMarket) => {
              if (customMarket) {
                const found = ALL_MANDI_LOCATIONS.find(m => m.name === customMarket.name) || {
                  id: customMarket.id || `mandi-${customMarket.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                  name: customMarket.name,
                  marathiName: customMarket.marathiName || customMarket.name,
                  district: customMarket.district,
                  state: customMarket.state || 'Maharashtra',
                  isMajorAPMC: true,
                  distanceKm: customMarket.distanceKm || 0
                };
                setSelectedMandi(found);
                loadData(selectedCommodityId, found, customMarket.variety, customMarket.grade);
              }
              setCurrentView('details');
            }}
            availableLiveMarkets={marketData.availableLiveMarkets}
            currentLanguage={currentLanguage}
            userProfile={userProfile}
            onNavigateToEditProfile={() => setCurrentView('edit_profile')}
            onBack={() => setCurrentView('details')}
          />
        </div>
      )}

      {/* 9. WATCHLIST VIEW */}
      {currentView === 'watchlist' && (
        <WatchlistView
          language={currentLanguage}
          userProfile={userProfile}
          onNavigateToEditProfile={() => setCurrentView('edit_profile')}
          onBack={() => {
            setCurrentView('home');
            setActiveTab('home');
          }}
          onSelectMarket={(cId, apmcName) => {
            setSelectedCommodityId(cId);
            const found = ALL_MANDI_LOCATIONS.find(m => m.name.toLowerCase().includes(apmcName.toLowerCase())) || {
              id: `mandi-${apmcName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              name: apmcName,
              marathiName: apmcName,
              district: '',
              state: '',
              isMajorAPMC: false,
              distanceKm: 0
            };
            setSelectedMandi(found);
            loadData(cId, found);
            setCurrentView('details');
          }}
        />
      )}

      {/* 10. SCREEN 8: MORE VIEW & SETTINGS */}
      {currentView === 'more' && (
        <MoreView
          language={currentLanguage}
          userProfile={userProfile}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          onOpenWelcomeScreen={() => setCurrentView('welcome')}
          onOpenDiagnostics={() => setIsDiagnosticsModalOpen(true)}
          onNavigateToCompare={() => setCurrentView('compare')}
          onNavigateToWatchlist={() => setCurrentView('watchlist')}
          onNavigateToHistory={() => setCurrentView('history')}
          onNavigateToGuide={() => setCurrentView('guide')}
          onNavigateToBulletins={() => setCurrentView('bulletins')}
          onNavigateToReport={() => setCurrentView('report')}
          onNavigateToTraderReports={() => setCurrentView('trader_reports')}
          onViewTraderProfile={handleViewTraderProfile}
          onOpenAddLocalRate={handleOpenAddLocalRate}
          onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
          onOpenEditProfile={() => setCurrentView('edit_profile')}
          onOpenPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)}
          onOpenDeleteAccount={() => setIsDeleteAccountOpen(true)}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {/* 10B. SCREEN: EDIT PROFILE / MY ACCOUNT */}
      {currentView === 'edit_profile' && (
        <EditProfileView
          language={currentLanguage}
          userProfile={userProfile}
          onBack={() => setCurrentView('more')}
          onLanguageChange={(lang) => {
            setCurrentLanguage(lang);
            saveLanguage(lang);
          }}
          onProfileUpdated={handleProfileUpdated}
          onLogoutConfirmed={handleLogout}
        />
      )}

      {/* 11. PRICE HISTORY VIEW */}
      {currentView === 'history' && (
        <div className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto shadow-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-base font-black text-slate-900">
              {t.priceHistory}
            </h2>
            <button
              type="button"
              onClick={() => setCurrentView('more')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              ← {t.back}
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="text-sm font-bold text-slate-900">
              {selectedCommodityId === 'onion' ? (currentLanguage === 'mr' ? 'कांदा' : 'Onion') : selectedCommodityId}
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <strong>{currentLanguage === 'mr' ? 'माहिती:' : 'Notice:'}</strong> {currentLanguage === 'mr' ? 'AGMARKNET दैनिक लिलाव बुलेटिनमध्ये केवळ आजचे अधिकृत दर नोंदवले जातात.' : 'AGMARKNET daily bulletin publishes verified daily rates only.'}
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">{t.modalPrice}:</span>
                <span className="font-bold text-slate-900 font-mono">
                  ₹{marketData.modalPrice ? marketData.modalPrice.toLocaleString('en-IN') : '4,100'} / {t.quintalUnit}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. COMMODITY GUIDE VIEW */}
      {currentView === 'guide' && (
        <div className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto shadow-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-base font-black text-slate-900">
              {t.commodityGuide}
            </h2>
            <button
              type="button"
              onClick={() => setCurrentView('more')}
              className="text-xs font-bold text-emerald-800 cursor-pointer"
            >
              ← {t.back}
            </button>
          </div>
          <div className="space-y-3">
            {COMMODITIES.map(c => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {currentLanguage === 'mr' ? (c.marathiName || c.name) : c.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{c.category}</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13. BULLETINS VIEW */}
      {currentView === 'bulletins' && (
        <div className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto shadow-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-base font-black text-slate-900">
              {t.newsUpdates}
            </h2>
            <button
              type="button"
              onClick={() => setCurrentView('more')}
              className="text-xs font-bold text-emerald-800 cursor-pointer"
            >
              ← {t.back}
            </button>
          </div>
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
              <div className="text-xs font-bold text-emerald-800 uppercase">
                {currentLanguage === 'mr' ? 'अधिकृत सूचना' : 'Official Notice'}
              </div>
              <div className="text-sm font-bold text-slate-900">
                {currentLanguage === 'mr' ? 'खरीप हंगाम आधारभूत किंमत (MSP) दर' : 'Kharif Season Minimum Support Price (MSP)'}
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {currentLanguage === 'mr' 
                  ? 'केंद्र शासनाने आधारभूत किमती जाहीर केल्या आहेत. शेतमालाची विक्री करताना अधिकृत भावांची पडताळणी करा.'
                  : 'Central government has released support prices. Verify rates before selling.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 14. DAILY MARKET REPORT MODULE */}
      {currentView === 'report' && (
        <DailyMarketReportView
          initialCommodityId={selectedCommodityId}
          initialMandiId={selectedMandi.id}
          language={currentLanguage}
          userProfile={userProfile}
          onNavigateToEditProfile={() => {
            setCurrentView('edit_profile');
          }}
          onBack={() => {
            setCurrentView('home');
            setActiveTab('home');
          }}
        />
      )}

      {/* 15. TRADER REPORTS VIEW */}
      {currentView === 'trader_reports' && (
        <TraderReportsView
          language={currentLanguage}
          userProfile={userProfile}
          reports={traderReports}
          onBack={() => {
            setCurrentView('home');
            setActiveTab('home');
          }}
          onRefreshReports={() => {
            setTraderReports(getStoredTraderReports());
          }}
          onOpenAddLocalRate={handleOpenAddLocalRate}
          onViewTraderProfile={handleViewTraderProfile}
          onEditReport={handleEditReport}
        />
      )}

      {/* 15B. TRADER PROFILE VIEW */}
      {currentView === 'trader_profile' && (
        <TraderProfileView
          traderId={viewedTraderId || userProfile.id || 'trader-current-user'}
          currentUserId={userProfile.id}
          language={currentLanguage}
          onBack={() => {
            setCurrentView('trader_reports');
          }}
          onOpenAddLocalRate={handleOpenAddLocalRate}
          onEditReport={handleEditReport}
        />
      )}

      {/* 16. BOTTOM NAVIGATION BAR */}
      {currentView !== 'edit_profile' && currentView !== 'welcome' && currentView !== 'onboarding' && currentView !== 'language_selection' && currentView !== 'wizard' && currentView !== 'report' && (
        <BottomNavigation
          activeTab={activeTab}
          onChangeTab={handleTabChange}
          onAddRate={handleOpenAddLocalRate}
          currentLanguage={currentLanguage}
        />
      )}

      {/* MODAL: Add / Edit Local Market Rate */}
      <AddLocalRateModal
        isOpen={isAddLocalRateOpen}
        onClose={() => {
          setIsAddLocalRateOpen(false);
          setEditingReport(undefined);
        }}
        language={currentLanguage}
        userProfile={userProfile}
        editingReport={editingReport}
        onSuccess={() => {
          setTraderReports(getStoredTraderReports());
        }}
      />

      {/* MODAL: Language Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <LanguageScreen
              currentLanguage={currentLanguage}
              onSelectLanguage={handleLanguageChosen}
              onBack={() => setIsLanguageModalOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* MODAL: Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        language={currentLanguage}
        userProfile={userProfile}
      />

      {/* MODAL: Mandi Report PDF Generator */}
      <MandiReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        marketData={marketData}
        onOpenDailyReport={() => {
          setIsReportModalOpen(false);
          setCurrentView('report');
        }}
      />

      {/* MODAL: AGMARKNET API & Data Pipeline Diagnostics */}
      <ApiReadinessModal
        isOpen={isDiagnosticsModalOpen}
        onClose={() => setIsDiagnosticsModalOpen(false)}
      />

      {/* MODAL: Google Play Compliant Account Deletion */}
      {isDeleteAccountOpen && (
        <AccountDeletionModal
          language={currentLanguage}
          mobileNumber={userProfile?.mobile || getAuthSession().mobile || ''}
          onClose={() => setIsDeleteAccountOpen(false)}
          onDeletionSuccess={() => {
            setIsDeleteAccountOpen(false);
            purgeAllLocalUserData();
            resetStoredUserProfile();
            setUserProfile(FRESH_USER_PROFILE);
            setCurrentView('welcome');
          }}
        />
      )}

      {/* MODAL: Privacy Policy */}
      {isPrivacyPolicyOpen && (
        <PrivacyPolicyModal
          language={currentLanguage}
          onClose={() => setIsPrivacyPolicyOpen(false)}
          onNavigateToDeleteAccount={() => {
            setIsPrivacyPolicyOpen(false);
            setIsDeleteAccountOpen(true);
          }}
        />
      )}

      {/* MODAL: Data Sources & Legal Disclaimer */}
      <DataSourcesDisclaimerModal
        isOpen={isDisclaimerModalOpen}
        onClose={() => setIsDisclaimerModalOpen(false)}
        language={currentLanguage}
      />
    </div>
  );
}
