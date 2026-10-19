import React from 'react';
import {
  Sparkles,
  TrendingUp,
  BarChart2,
  Bell,
  LineChart,
  Bookmark,
  Building2,
  Clock,
  ShieldCheck,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';
import { UserProfileBanner } from './UserProfileBanner';

interface UpdatesSectionProps {
  userProfile?: UserProfile | null;
  onOpenEditProfile?: () => void;
}

export const UpdatesSection: React.FC<UpdatesSectionProps> = ({ userProfile, onOpenEditProfile }) => {
  const userState = userProfile?.state || 'Punjab';
  const userApmc = userProfile?.mainApmc || 'Ludhiana APMC';
  const userRole = userProfile?.userType || 'Trader';

  const upcomingFeatures = [
    {
      title: `${userState} APMC Price Movement Alerts`,
      desc: `Real-time notifications tailored for ${userApmc} and verified ${userState} mandis when auction quotes update.`,
      icon: Bell,
      tag: `${userState} Priority`
    },
    {
      title: `${userRole} Procurement & Lot Analytics`,
      desc: `Specialized arrival window assessments and lot volume analytics for ${userRole}s in ${userState}.`,
      icon: Building2,
      tag: `${userRole} Mode`
    },
    {
      title: 'Historical price trends',
      desc: `Multi-week and multi-month historical price series powered by archived AGMARKNET bulletins for ${userApmc}.`,
      icon: LineChart,
      tag: 'Coming soon'
    },
    {
      title: 'Date-wise market comparison',
      desc: `Side-by-side date comparative analysis across reporting auction days for ${userApmc} and state benchmarks.`,
      icon: BarChart2,
      tag: 'Coming soon'
    },
    {
      title: 'Market trend analysis',
      desc: 'Empirical price volatility metrics grounded strictly in verified trade volumes.',
      icon: TrendingUp,
      tag: 'Coming soon'
    },
    {
      title: 'Saved market watchlist',
      desc: `Pin your preferred ${userState} mandis and commodities for rapid one-tap morning access.`,
      icon: Bookmark,
      tag: 'Live in Watchlist'
    }
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto animate-fade-in pb-4">
      {/* PROFILE LOCATION BANNER */}
      <UserProfileBanner
        userProfile={userProfile}
        onOpenEditProfile={onOpenEditProfile}
      />

      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {userState} Market Intelligence Feed
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Updates & Notifications for {userApmc}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Market alerts and intelligence tailored dynamically for {userRole}s in {userState}.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Grounded strictly in official AGMARKNET verified records.</span>
        </div>
      </div>

      {/* Upcoming Capabilities List */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
          <span>Personalized Alerts & Capabilities</span>
          <span className="text-[10px] text-emerald-400 font-bold">{userState} Feed</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {upcomingFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3.5 transition-all hover:bg-slate-900"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white truncate">
                      {item.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800 shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

