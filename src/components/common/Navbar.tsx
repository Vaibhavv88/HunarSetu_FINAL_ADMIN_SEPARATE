import React from 'react';
import { Compass, VolumeX, PhoneCall, BarChart3, Users, Bell, UserCheck, ShieldAlert, LogOut, ArrowLeftRight } from 'lucide-react';
import { I18N } from '../../i18n/translations';
import { stopSpeaking } from '../../services/speechService';
import { UserRole } from '../../types/auth';

interface NavbarProps {
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isSpeaking: boolean;
  onStopSpeech: () => void;
  currentRole: UserRole;
  onSwitchRole: () => void;
  onLogout: () => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  currentTab,
  onSelectTab,
  isSpeaking,
  onStopSpeech,
  currentRole,
  onSwitchRole,
  onLogout,
  unreadNotificationsCount
}) => {
  const t = I18N[language];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top National Skilling Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-sky-700 px-4 py-1 text-xs text-white flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>{language === 'hi' ? 'सुरक्षित करियर प्लेटफ़ॉर्म' : 'Secure Career Platform'}</span>
        </div>
        <div className="flex items-center gap-3">
          {isSpeaking && (
            <button
              onClick={() => {
                stopSpeaking();
                onStopSpeech();
              }}
              className="flex items-center gap-1 bg-red-600/90 hover:bg-red-700 px-2 py-0.5 rounded text-[11px] font-semibold transition"
            >
              <VolumeX className="w-3 h-3" />
              <span>{t.stopVoice}</span>
            </button>
          )}
          <span className="hidden md:inline text-slate-200">
            {t.verifiedDataNote}
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  {language === 'hi' ? 'हुनरसेतु' : 'HunarSetu'}
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  NSQF
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Role Status Badge & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Role Indicator */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-slate-400 font-medium">{language === 'hi' ? 'भूमिका:' : 'Role:'}</span>
              <span className="font-extrabold text-amber-300 capitalize">
                {currentRole === 'student' && (language === 'hi' ? 'विद्यार्थी' : 'Student')}
                {currentRole === 'family' && (language === 'hi' ? 'अभिभावक/परिवार' : 'Family')}
                {currentRole === 'counsellor' && (language === 'hi' ? 'प्रमाणित काउंसलर' : 'Counsellor')}
                {currentRole === 'admin' && (language === 'hi' ? 'सुपर एडमिन' : 'Super Admin')}
              </span>
            </div>

            {/* Notification Bell (Visible to Counsellor & Admin) */}
            {(currentRole === 'counsellor' || currentRole === 'admin') && (
              <button
                onClick={() => onSelectTab(currentRole === 'counsellor' ? 'counsellor-portal' : 'admin-portal')}
                className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Switch Role Button */}
            <button
              onClick={onSwitchRole}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-2 rounded-xl border border-slate-700 transition"
              title="Change user role (Student / Family / Counsellor / Admin)"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{language === 'hi' ? 'भूमिका बदलें' : 'Switch Role'}</span>
            </button>

            {/* Logout for Counsellor & Admin */}
            {(currentRole === 'counsellor' || currentRole === 'admin') && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-semibold px-2.5 py-2 rounded-xl border border-rose-800 transition"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition"
              title="Toggle English / हिन्दी"
            >
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-1 pb-2 pt-1 border-t border-slate-800 text-xs font-medium">
          {[
            { id: 'home', label: t.navHome },
            { id: 'learner', label: t.navLearner },
            { id: 'parent', label: t.navParent },
            { id: 'family-session', label: t.navFamilySession, highlight: true },
            { id: 'roadmap', label: t.navRoadmap },
            { id: 'compare', label: t.navCompare },
            { id: 'districts', label: t.navDistricts },
            ...(currentRole === 'counsellor'
              ? [{ id: 'counsellor-portal', label: language === 'hi' ? 'काउंसलर वर्कस्पेस' : 'Counsellor Desk', highlight: true }]
              : []),
            ...(currentRole === 'admin'
              ? [{ id: 'admin-portal', label: language === 'hi' ? 'काउंसलर व सिस्टम प्रबंधन' : 'Admin Management', highlight: true }]
              : []),
            { id: 'counsellor', label: t.navCounsellor },
          ].map(tab => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : tab.highlight
                    ? 'text-amber-300 hover:bg-slate-800/80 bg-amber-500/10 border border-amber-500/30 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.id === 'family-session' && <Users className="w-3.5 h-3.5 text-amber-400" />}
                {tab.id === 'counsellor-portal' && <UserCheck className="w-3.5 h-3.5 text-sky-400" />}
                {tab.id === 'admin-portal' && <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />}
                {tab.id === 'admin' && <BarChart3 className="w-3.5 h-3.5" />}
                {tab.id === 'counsellor' && <PhoneCall className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
