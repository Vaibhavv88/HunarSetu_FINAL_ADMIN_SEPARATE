/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { RolePortalLanding } from './components/auth/RolePortalLanding';
import { AuthModal } from './components/auth/AuthModal';
import { LandingHero } from './components/home/LandingHero';
import { LearnerWizard } from './components/learner/LearnerWizard';
import { ParentObjectionView } from './components/parent/ParentObjectionView';
import { FamilyDecisionSession } from './components/familySession/FamilyDecisionSession';
import { CareerRoadmapView } from './components/roadmap/CareerRoadmapView';
import { TradeComparisonView } from './components/compare/TradeComparisonView';
import { DistrictOpportunityView } from './components/districts/DistrictOpportunityView';
import { CounsellorPortal } from './components/counsellor/CounsellorPortal';
import { AdminManagementPortal } from './components/admin/AdminManagementPortal';
import { CounsellorModal } from './components/counsellor/CounsellorModal';
import { AICounsellorChat } from './components/aiChat/AICounsellorChat';

import { LearnerProfile, ParentProfile } from './types/career';
import { UserRole, NotificationItem } from './types/auth';
import { NSQF_VOCATIONAL_TRADES } from './data/nsqfTrades';
import { INITIAL_NOTIFICATIONS } from './data/counsellorsData';
import { speakText, stopSpeaking } from './services/speechService';
import { I18N } from './i18n/translations';
import { StudentPortal } from './components/student/StudentPortal';
import { ParentPortal } from './components/parent/ParentPortal';
import { ShieldCheck, Compass, HeartHandshake, Award } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'hi'>('hi');
  const [currentRole, setCurrentRole] = useState<UserRole>('selector');

  // Never trust a role stored only in localStorage. Restore a portal only after
  // the server confirms the bearer token and its role. This keeps Admin strictly
  // isolated from Student/Family portals even if browser storage is edited.
  useEffect(() => {
    let cancelled = false;
    const restoreSession = async () => {
      try {
        const saved = JSON.parse(localStorage.getItem('hunarsetu_auth') || 'null');
        if (!saved?.token) return;
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${saved.token}` }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?.authenticated) {
          localStorage.removeItem('hunarsetu_auth');
          return;
        }
        const validRole = ['admin', 'counsellor', 'student', 'family'].includes(data.role) ? data.role as UserRole : 'selector';
        if (!cancelled) setCurrentRole(validRole);
      } catch {
        localStorage.removeItem('hunarsetu_auth');
      }
    };
    void restoreSession();
    return () => { cancelled = true; };
  }, []);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isCounsellorModalOpen, setIsCounsellorModalOpen] = useState<boolean>(false);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authTargetRole, setAuthTargetRole] = useState<'student' | 'parent' | 'counsellor' | 'admin'>('student');

  // Live Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // No pre-filled family data: every student/parent starts from their own authenticated account.
  const [learner, setLearner] = useState<LearnerProfile>({
    name: '', age: 0, gender: '', state: '', district: '', localityType: 'Urban',
    educationLevel: 'College Dropout', interests: [], preferredWorkStyle: 'Digital & Tech',
    willingToRelocate: false, priority: 'Immediate Job'
  });

  const [parent, setParent] = useState<ParentProfile>({
    guardianRelation: 'Father', guardianName: '', primaryConcern: 'income', concernSeverity: 'Mild',
    aspiredCareerForChild: '', willingToSupportTrainingCost: false, maxTrainingMonthsAcceptable: 0, specificDoubt: ''
  });

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  const handleSelectRole = (role: UserRole) => {
    if (role === 'student') return handleOpenLogin('student');
    if (role === 'family') return handleOpenLogin('parent');
    if (role === 'counsellor') return handleOpenLogin('counsellor');
    if (role === 'admin') return handleOpenLogin('admin');
  };

  const handleOpenLogin = (role: 'student' | 'parent' | 'counsellor' | 'admin') => {
    setAuthTargetRole(role);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (role: 'student' | 'family' | 'counsellor' | 'admin', _userEmail: string, name?: string) => {
    setCurrentRole(role);
    if (name) {
      if (role === 'student') setLearner(prev => ({ ...prev, name }));
      if (role === 'family') setParent(prev => ({ ...prev, guardianName: name }));
    }
    if (role === 'counsellor') {
      setCurrentTab('counsellor-portal');
    } else if (role === 'admin') {
      setCurrentTab('admin-portal');
    }
  };

  const handleLogout = () => {
    const saved = localStorage.getItem('hunarsetu_auth');
    try {
      const auth = JSON.parse(saved || 'null');
      if (auth?.token) {
        void fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${auth.token}` } }).catch(() => undefined);
      }
    } catch { /* ignore malformed local session */ }
    localStorage.removeItem('hunarsetu_auth');
    setCurrentRole('selector');
    setCurrentTab('home');
  };

  const handleSpeak = (text: string) => {
    setIsSpeaking(true);
    speakText(text, language, () => {
      setIsSpeaking(false);
    });
  };

  const handleStopSpeech = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const activeTrade = NSQF_VOCATIONAL_TRADES.find(
    t => t.id === (learner.selectedTradeId || 'solar-technician')
  ) || NSQF_VOCATIONAL_TRADES[0];

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // FIRST PAGE: Role Selection Landing
  if (currentRole === 'selector') {
    return (
      <>
        <RolePortalLanding
          language={language}
          onSelectRole={handleSelectRole}
          onOpenLogin={handleOpenLogin}
          onToggleLanguage={handleToggleLanguage}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          targetRole={authTargetRole}
          language={language}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // DEDICATED STUDENT PANEL
  if (currentRole === 'student') {
    return (
      <StudentPortal
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSwitchRole={() => { localStorage.removeItem('hunarsetu_auth'); setCurrentRole('selector'); }}
        onSpeak={handleSpeak}
      />
    );
  }

  // DEDICATED PARENT / FAMILY PANEL
  if (currentRole === 'family') {
    return (
      <ParentPortal
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSwitchRole={() => { localStorage.removeItem('hunarsetu_auth'); setCurrentRole('selector'); }}
        onSpeak={handleSpeak}
      />
    );
  }

  // DEDICATED ADMIN PANEL — completely isolated from Student/Family UI.
  // There is no shared family navbar or tab that can open the Admin portal.
  if (currentRole === 'admin') {
    return (
      <AdminManagementPortal
        language={language}
        onNavigateHome={handleLogout}
      />
    );
  }

  // DEDICATED CERTIFIED COUNSELLOR PANEL
  if (currentRole === 'counsellor') {
    return (
      <CounsellorPortal
        language={language}
        onNavigateHome={() => setCurrentRole('selector')}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onToggleLanguage={handleToggleLanguage}
        onSwitchRole={() => { localStorage.removeItem('hunarsetu_auth'); setCurrentRole('selector'); }}
      />
    );
  }

  // MAIN PORTAL VIEW (Family, Counsellor, Admin)
  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isSpeaking={isSpeaking}
        onStopSpeech={handleStopSpeech}
        currentRole={currentRole}
        onSwitchRole={() => { localStorage.removeItem('hunarsetu_auth'); setCurrentRole('selector'); }}
        onLogout={handleLogout}
        unreadNotificationsCount={unreadNotifsCount}
      />

      {/* Main Content Area based on currentTab */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingHero
            language={language}
            onNavigate={setCurrentTab}
            onSpeak={handleSpeak}
          />
        )}

        {currentTab === 'learner' && (
          <LearnerWizard
            language={language}
            learner={learner}
            onUpdateLearner={setLearner}
            onSelectTradeForSession={(tradeId) => {
              setLearner(prev => ({ ...prev, selectedTradeId: tradeId }));
            }}
            onSpeak={handleSpeak}
            onNavigateToFamilySession={() => setCurrentTab('family-session')}
          />
        )}

        {currentTab === 'parent' && (
          <ParentObjectionView
            language={language}
            parent={parent}
            onUpdateParent={setParent}
            onSpeak={handleSpeak}
            onNavigateToFamilySession={() => setCurrentTab('family-session')}
          />
        )}

        {currentTab === 'family-session' && (
          <FamilyDecisionSession
            language={language}
            learner={learner}
            parent={parent}
            onUpdateLearnerTrade={(tradeId) => {
              setLearner(prev => ({ ...prev, selectedTradeId: tradeId }));
            }}
            onUpdateParentAspiration={(aspired) => {
              setParent(prev => ({ ...prev, aspiredCareerForChild: aspired }));
            }}
            onOpenCounsellorModal={() => setIsCounsellorModalOpen(true)}
            onSpeak={handleSpeak}
          />
        )}

        {currentTab === 'roadmap' && (
          <CareerRoadmapView
            language={language}
            onSpeak={handleSpeak}
          />
        )}

        {currentTab === 'compare' && (
          <TradeComparisonView
            language={language}
          />
        )}

        {currentTab === 'districts' && (
          <DistrictOpportunityView
            language={language}
          />
        )}

        {currentTab === 'counsellor-portal' && (
          <CounsellorPortal
            language={language}
            onNavigateHome={() => setCurrentTab('home')}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
          />
        )}

        {currentTab === 'counsellor' && (
          <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <HeartHandshake className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {language === 'hi' ? 'प्रमाणित मानव कौशल काउंसलर सहायता' : 'Human Skilling Counsellor Mediation'}
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {language === 'hi'
                ? 'यदि एआई साक्ष्यों और पारिवारिक सत्र के बाद भी किसी ट्रेड को लेकर माता-पिता या छात्र में असहमति बनी हुई है, तो सीधे एक प्रमाणित सरकारी काउंसलर से टेलीफोनिक परामर्श प्राप्त करें।'
                : 'Whenever family hesitation cannot be resolved digitally, escalate to a certified skilling counsellor for phone conference mediation.'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsCounsellorModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-6 py-3.5 rounded-xl shadow-lg text-sm inline-flex items-center gap-2 transition"
              >
                <span>{language === 'hi' ? 'काउंसलर से मुफ्त कॉल बुक करें' : 'Schedule Free Counsellor Call'}</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Floating Bilingual AI Counsellor Drawer */}
      <AICounsellorChat
        language={language}
        selectedTradeId={learner.selectedTradeId}
        district={learner.district}
        onSpeak={handleSpeak}
      />

      {/* Human Counsellor Escalation Modal */}
      <CounsellorModal
        isOpen={isCounsellorModalOpen}
        onClose={() => setIsCounsellorModalOpen(false)}
        language={language}
        learner={learner}
        parent={parent}
        selectedTradeName={language === 'hi' ? activeTrade.titleHi : activeTrade.title}
      />

      {/* Auth Modal for Counsellor / Admin */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        targetRole={authTargetRole}
        language={language}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* National Skilling Ecosystem Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>{language === 'hi' ? 'हुनरसेतु (HunarSetu)' : 'HunarSetu National Platform'}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {language === 'hi'
                ? 'परिवार-केंद्रित एआई वोकेशनल करियर निर्णय प्रणाली। भारतीय युवाओं और परिवारों को साक्ष्य-आधारित मार्गदर्शन प्रदान करना।'
                : 'An AI-enabled career counselling and family decision-support platform for vocational education and NSQF pathways.'}
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified with NCVET, DGT & MSDE frameworks</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === 'hi' ? 'भूमिका अनुसार त्वरित लिंक' : 'Role Gateways'}
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li><button onClick={() => setCurrentRole('selector')} className="hover:text-amber-400 transition">{language === 'hi' ? 'भूमिका चयन पृष्ठ' : 'Switch Role Gateway'}</button></li>
              <li><button onClick={() => handleOpenLogin('student')} className="hover:text-amber-400 transition">{language === 'hi' ? 'विद्यार्थी पोर्टल' : 'Student Portal'}</button></li>
              <li><button onClick={() => handleOpenLogin('parent')} className="hover:text-amber-400 transition">{language === 'hi' ? 'पारिवारिक निर्णय सत्र' : 'Family Session'}</button></li>
              <li><button onClick={() => handleOpenLogin('counsellor')} className="hover:text-sky-400 transition">{language === 'hi' ? 'काउंसलर लॉगिन' : 'Counsellor Login'}</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === 'hi' ? 'पारदर्शिता एवं नीति' : 'Transparency'}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {language === 'hi'
                ? 'यह प्रणाली किसी भी नौकरी अथवा वेतन की झूठी गारंटी नहीं देती। सभी आंकड़े प्रोटोटाइप/आधिकारिक सर्वे डेटासेट पर आधारित हैं।'
                : 'Prototype data attribution. HunarSetu provides factual evidence and comparative guidance for informed household decisions.'}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          © HunarSetu (हुनर सेतु) • National Skill Qualification Framework (NSQF)
        </div>
      </footer>
    </div>
  );
}
