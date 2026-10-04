import React, { useState, useEffect } from 'react';
import { HeartHandshake, Compass, Users, Sparkles, Scale, BookOpen, MessageSquare, TrendingUp, PhoneCall, Award, LogOut, ArrowLeftRight, HelpCircle, CheckCircle2, Volume2, ShieldCheck, MapPin, UserCheck } from 'lucide-react';
import { ParentDetailedProfile, DEFAULT_EMPTY_PARENT } from '../../types/parent';
import { StudentProfile, DEFAULT_EMPTY_STUDENT } from '../../types/student';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { ParentOnboarding } from './ParentOnboarding';
import { ParentDashboard } from './ParentDashboard';
import { ParentEvidenceExplorer } from './ParentEvidenceExplorer';
import { ParentComparisonView } from './ParentComparisonView';
import { ParentFamilyDiscussionHelper } from './ParentFamilyDiscussionHelper';
import { ChildProfileView } from './ChildProfileView';
import { ParentAICounsellor } from './ParentAICounsellor';
import { DistrictOpportunityView } from '../districts/DistrictOpportunityView';
import { CareerRoadmapView } from '../roadmap/CareerRoadmapView';
import { CounsellorModal } from '../counsellor/CounsellorModal';
import { ParentCounsellorChatView } from './ParentCounsellorChatView';
import { counsellingService } from '../../services/counsellingService';

interface ParentPortalProps {
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  onSwitchRole: () => void;
  onSpeak: (text: string) => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  language,
  onToggleLanguage,
  onSwitchRole,
  onSpeak
}) => {
  const auth = (() => {
    try { return JSON.parse(localStorage.getItem('hunarsetu_auth') || 'null'); } catch { return null; }
  })();
  const profileKey = `hunarsetu_parent_profile_${auth?.userId || auth?.email || 'current'}`;

  // Load only this authenticated parent's own profile. Legacy shared/demo data is ignored.
  const [parent, setParent] = useState<ParentDetailedProfile>(() => {
    try {
      const saved = localStorage.getItem(profileKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...DEFAULT_EMPTY_PARENT, parentName: auth?.name || '' };
  });

  // A parent does not inherit another account's profile. Child details are entered/connected explicitly.
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTradeForDetail, setSelectedTradeForDetail] = useState<string | undefined>(undefined);
  const [isCounsellorModalOpen, setIsCounsellorModalOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Poll for unread messages from counsellor for parent
  useEffect(() => {
    const checkUnread = async () => {
      try {
        const searchKey = parent.parentName || parent.childName || 'Parent';
        const data = await counsellingService.fetchUnreadSummary(searchKey, 'PARENT');
        setUnreadCount(data.messages);
      } catch {}
    };
    checkUnread();
    const interval = setInterval(checkUnread, 4000);
    return () => clearInterval(interval);
  }, [parent.parentName, parent.childName]);

  // Sync parent with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(profileKey, JSON.stringify(parent));
    } catch {}
  }, [parent]);

  const handleOnboardingComplete = (newProfile: ParentDetailedProfile) => {
    setParent(newProfile);
    setActiveTab('dashboard');
  };

  const handleConnectChildCode = (code: string): boolean => {
    if (code.trim().toUpperCase().startsWith('HS-') || code.trim().length > 3) {
      setParent(prev => ({
        ...prev,
        childConnected: true,
        familyConnectionCode: code.trim(),
        childName: prev.childName || (studentData?.name) || ''
      }));
      return true;
    }
    return false;
  };

  const handleResetOnboarding = () => {
    setParent({ ...DEFAULT_EMPTY_PARENT });
    setActiveTab('dashboard');
  };

  // IF NOT ONBOARDED: RENDER ONBOARDING FLOW
  if (!parent.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        {/* Simple Top Bar */}
        <header className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm">
                {language === 'hi' ? 'हुनरसेतु • अभिभावक मंच' : 'HunarSetu • Parent Panel'}
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-400 font-semibold">
                {language === 'hi' ? 'परिवार निर्णय-सहायता प्रणाली' : 'Family Decision Support'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
            >
              {language === 'hi' ? 'English' : 'हिन्दी'}
            </button>
            <button
              onClick={onSwitchRole}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1.5"
            >
              {language === 'hi' ? 'भूमिका बदलें' : 'Switch Role'}
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <ParentOnboarding
            language={language}
            onComplete={handleOnboardingComplete}
            onSpeak={onSpeak}
          />
        </main>

        <footer className="p-4 text-center text-[11px] text-slate-400 font-medium">
          national innovation program • AI-Enabled Vocational Decision Support for Indian Families
        </footer>
      </div>
    );
  }

  // Active child's trade
  const activeTrade = NSQF_VOCATIONAL_TRADES.find(
    t => t.id === (studentData?.lastExploredTradeId || selectedTradeForDetail || 'solar-technician')
  ) || NSQF_VOCATIONAL_TRADES[0];

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar for Parent Panel */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo & Parent Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-sm tracking-tight">
                    {language === 'hi' ? 'हुनरसेतु' : 'HunarSetu'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                    {language === 'hi' ? 'अभिभावक मंच' : 'Parent Panel'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold truncate max-w-[170px] sm:max-w-xs">
                  {parent.parentName
                    ? (language === 'hi' ? `${parent.parentName} (${parent.guardianRelation})` : `${parent.parentName} (${parent.guardianRelation})`)
                    : (language === 'hi' ? 'परिवार परामर्श' : 'Family Guidance')}
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeTab === 'evidence'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'अहम सवाल व साक्ष्य' : '8 Big Questions'}
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeTab === 'compare'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'डिग्री बनाम कौशल' : 'Degree vs Skill'}
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeTab === 'discussion'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'पारिवारिक चर्चा' : 'Family Discussion'}
            </button>

            <button
              onClick={() => setActiveTab('child')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeTab === 'child'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'बच्चे की पसंद' : 'Child Profile'}
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeTab === 'ai'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? 'एआई सलाहकार' : 'AI Advisor'}
            </button>

            <button
              onClick={() => setActiveTab('counsellor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === 'counsellor'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{language === 'hi' ? 'मेरी काउंसलिंग' : 'My Counselling'}</span>
              {unreadCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCounsellorModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'hi' ? 'सरकारी काउंसलर' : 'Call Counsellor'}</span>
            </button>

            <button
              onClick={onToggleLanguage}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition"
            >
              {language === 'hi' ? 'English' : 'हिन्दी'}
            </button>

            <button
              onClick={onSwitchRole}
              title={language === 'hi' ? 'भूमिका बदलें' : 'Switch Role'}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Tabs */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-100 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`shrink-0 px-3 py-1 rounded-lg font-bold ${
              activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
            }`}
          >
            {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`shrink-0 px-3 py-1 rounded-lg font-bold ${
              activeTab === 'evidence' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
            }`}
          >
            {language === 'hi' ? 'अहम सवाल' : '8 Questions'}
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`shrink-0 px-3 py-1 rounded-lg font-bold ${
              activeTab === 'compare' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
            }`}
          >
            {language === 'hi' ? 'डिग्री vs हुनर' : 'Compare'}
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`shrink-0 px-3 py-1 rounded-lg font-bold ${
              activeTab === 'discussion' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
            }`}
          >
            {language === 'hi' ? 'चर्चा सहायक' : 'Discussion'}
          </button>
          <button
            onClick={() => setActiveTab('child')}
            className={`shrink-0 px-3 py-1 rounded-lg font-bold ${
              activeTab === 'child' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
            }`}
          >
            {language === 'hi' ? 'बच्चे की पसंद' : 'Child Profile'}
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`shrink-0 px-3 py-1 rounded-lg font-bold ${
              activeTab === 'ai' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
            }`}
          >
            {language === 'hi' ? 'एआई' : 'AI'}
          </button>
          <button
            onClick={() => setActiveTab('districts')}
            className={`shrink-0 px-3 py-1 rounded-lg font-bold ${
              activeTab === 'districts' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
            }`}
          >
            {language === 'hi' ? 'जिले की ITI' : 'Local ITIs'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <ParentDashboard
            language={language}
            parent={parent}
            childTrade={activeTrade}
            onNavigate={(tab, tradeId) => {
              if (tradeId) setSelectedTradeForDetail(tradeId);
              if (tab === 'career-detail') setActiveTab('roadmap');
              else if (tab === 'concerns') setActiveTab('evidence');
              else if (tab === 'family-room') setActiveTab('discussion');
              else if (tab === 'compare') setActiveTab('compare');
              else if (tab === 'roadmap') setActiveTab('roadmap');
              else if (tab === 'ai') setActiveTab('ai');
              else if (tab === 'counsellor') setIsCounsellorModalOpen(true);
              else setActiveTab(tab);
            }}
            onConnectChild={() => setActiveTab('child')}
            onSpeak={onSpeak}
          />
        )}

        {activeTab === 'evidence' && (
          <ParentEvidenceExplorer
            language={language}
            districtName={parent.district}
            onSpeak={onSpeak}
            onOpenCounsellorModal={() => setIsCounsellorModalOpen(true)}
          />
        )}

        {activeTab === 'compare' && (
          <ParentComparisonView
            language={language}
            onSpeak={onSpeak}
            onOpenFamilySession={() => setActiveTab('discussion')}
          />
        )}

        {activeTab === 'discussion' && (
          <ParentFamilyDiscussionHelper
            language={language}
            parent={parent}
            childTradeId={activeTrade.id}
            onSpeak={onSpeak}
            onOpenJointSession={() => setActiveTab('discussion')}
            onOpenCounsellorModal={() => setIsCounsellorModalOpen(true)}
          />
        )}

        {activeTab === 'child' && (
          <ChildProfileView
            language={language}
            parent={parent}
            studentData={studentData}
            onConnectChildCode={handleConnectChildCode}
            onNavigateExplore={(tradeId) => {
              setSelectedTradeForDetail(tradeId);
              setActiveTab('evidence');
            }}
            onOpenFamilyRoom={() => setActiveTab('discussion')}
          />
        )}

        {activeTab === 'counsellor' && (
          <ParentCounsellorChatView
            language={language}
            parent={parent}
            onOpenNewRequestModal={() => setIsCounsellorModalOpen(true)}
            onSpeak={onSpeak}
          />
        )}

        {activeTab === 'ai' && (
          <ParentAICounsellor
            language={language}
            parent={parent}
            childTradeId={activeTrade.id}
            onSpeak={onSpeak}
            onOpenHumanCounsellorModal={() => setIsCounsellorModalOpen(true)}
          />
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="max-w-4xl mx-auto px-4 pt-6 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200"
              >
                ← {language === 'hi' ? 'डैशबोर्ड पर वापस' : 'Back to Dashboard'}
              </button>
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                {language === 'hi' ? 'प्रगति सीढ़ी: तकनीशियन से बी.टेक' : 'Career Progression Ladder'}
              </span>
            </div>
            <CareerRoadmapView
              language={language}
              onSpeak={onSpeak}
            />
          </div>
        )}

        {activeTab === 'districts' && (
          <div className="space-y-6">
            <div className="max-w-4xl mx-auto px-4 pt-6 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200"
              >
                ← {language === 'hi' ? 'डैशबोर्ड पर वापस' : 'Back to Dashboard'}
              </button>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {language === 'hi' ? 'जिले के अनुसार सरकारी आईटीआई' : 'District ITI Network'}
              </span>
            </div>
            <DistrictOpportunityView
              language={language}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation for Parent */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around text-[10px] font-bold shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 transition ${
            activeTab === 'dashboard' ? 'text-amber-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{language === 'hi' ? 'होम' : 'Home'}</span>
        </button>

        <button
          onClick={() => setActiveTab('family-room')}
          className={`flex flex-col items-center gap-0.5 p-1 transition ${
            activeTab === 'family-room' ? 'text-amber-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'hi' ? 'चर्चा' : 'Family'}</span>
        </button>

        <button
          onClick={() => setActiveTab('child')}
          className={`flex flex-col items-center gap-0.5 p-1 transition ${
            activeTab === 'child' ? 'text-amber-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{language === 'hi' ? 'पसंद' : 'Child'}</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center gap-0.5 p-1 transition ${
            activeTab === 'ai' ? 'text-amber-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'hi' ? 'सलाहकार' : 'AI'}</span>
        </button>

        <button
          onClick={() => setActiveTab('counsellor')}
          className={`flex flex-col items-center gap-0.5 p-1 transition relative ${
            activeTab === 'counsellor' ? 'text-amber-600 font-extrabold' : 'text-slate-500'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>{language === 'hi' ? 'काउंसलिंग' : 'Counselling'}</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 right-2 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Human Counsellor Modal */}
      <CounsellorModal
        isOpen={isCounsellorModalOpen}
        onClose={() => setIsCounsellorModalOpen(false)}
        language={language}
        learner={{
          name: parent.childName || 'Child',
          age: parent.childAge || 18,
          gender: 'Male',
          state: parent.state,
          district: parent.district,
          localityType: parent.locality || 'Semi-Urban',
          educationLevel: parent.childEducation === 'Class 10' ? 'Class 10th Passed' : 'Class 12th (Science)',
          interests: ['Technical Trades'],
          preferredWorkStyle: 'Hands-on Machines',
          willingToRelocate: false,
          priority: 'High Earning Potential',
          selectedTradeId: activeTrade.id
        }}
        parent={{
          guardianRelation: parent.guardianRelation,
          guardianName: parent.parentName || 'Parent',
          primaryConcern: 'income',
          concernSeverity: 'Critical / Unconvinced',
          aspiredCareerForChild: 'Understanding Vocational Options',
          willingToSupportTrainingCost: true,
          maxTrainingMonthsAcceptable: 12,
          specificDoubt: parent.mainConcern
        }}
        selectedTradeName={language === 'hi' ? activeTrade.titleHi : activeTrade.title}
        onOpenChat={() => setActiveTab('counsellor')}
      />
    </div>
  );
};
