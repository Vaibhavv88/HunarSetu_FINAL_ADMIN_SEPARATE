import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, User, MessageSquare, CheckCircle2, Bookmark, Scale, TrendingUp, Users, PhoneCall, MapPin, MoreHorizontal, ArrowLeftRight, LogOut, Award } from 'lucide-react';
import { StudentProfile, DEFAULT_EMPTY_STUDENT } from '../../types/student';
import { StudentOnboarding } from './StudentOnboarding';
import { StudentDashboard } from './StudentDashboard';
import { StudentAssessment } from './StudentAssessment';
import { StudentCareerExplorer } from './StudentCareerExplorer';
import { StudentCareerPlan } from './StudentCareerPlan';
import { StudentFamilyDiscussion } from './StudentFamilyDiscussion';
import { StudentSavedCareers } from './StudentSavedCareers';
import { StudentAICounsellor } from './StudentAICounsellor';
import { StudentProfileView } from './StudentProfileView';

// Reusing visual components for roadmap, compare, districts, counsellor
import { CareerRoadmapView } from '../roadmap/CareerRoadmapView';
import { TradeComparisonView } from '../compare/TradeComparisonView';
import { DistrictOpportunityView } from '../districts/DistrictOpportunityView';
import { CounsellorModal } from '../counsellor/CounsellorModal';
import { StudentCounsellorChatView } from './StudentCounsellorChatView';
import { counsellingService } from '../../services/counsellingService';

interface StudentPortalProps {
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  onSwitchRole: () => void;
  onSpeak: (text: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  language,
  onToggleLanguage,
  onSwitchRole,
  onSpeak
}) => {
  const auth = (() => {
    try { return JSON.parse(localStorage.getItem('hunarsetu_auth') || 'null'); } catch { return null; }
  })();
  const profileKey = `hunarsetu_student_profile_${auth?.userId || auth?.email || 'current'}`;

  // Load only this authenticated student's own profile. Legacy shared/demo data is ignored.
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(profileKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...DEFAULT_EMPTY_STUDENT, name: auth?.name || '' };
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTradeForDetail, setSelectedTradeForDetail] = useState<string | undefined>(undefined);
  const [isCounsellorModalOpen, setIsCounsellorModalOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Poll for unread messages from counsellor
  useEffect(() => {
    const checkUnread = async () => {
      try {
        const data = await counsellingService.fetchUnreadSummary(student.name || 'Student', 'STUDENT');
        setUnreadCount(data.messages);
      } catch {}
    };
    checkUnread();
    const interval = setInterval(checkUnread, 4000);
    return () => clearInterval(interval);
  }, [student.name]);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(profileKey, JSON.stringify(student));
    } catch {}
  }, [student]);

  const handleOnboardingComplete = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    setActiveTab('home');
  };

  const handleToggleSaveCareer = (tradeId: string) => {
    setStudent(prev => {
      const exists = prev.savedCareerIds.includes(tradeId);
      return {
        ...prev,
        savedCareerIds: exists
          ? prev.savedCareerIds.filter(id => id !== tradeId)
          : [...prev.savedCareerIds, tradeId]
      };
    });
  };

  const handleResetOnboarding = () => {
    setStudent({ ...DEFAULT_EMPTY_STUDENT });
    setActiveTab('home');
  };

  // IF NOT ONBOARDED: RENDER ONBOARDING FLOW
  if (!student.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        {/* Simple Top Bar */}
        <header className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">
              {language === 'hi' ? 'हुनरसेतु विद्यार्थी ऑनबोर्डिंग' : 'HunarSetu Student Onboarding'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
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
          <StudentOnboarding
            language={language}
            onComplete={handleOnboardingComplete}
            onSpeak={onSpeak}
          />
        </main>

        <footer className="p-4 text-center text-[11px] text-slate-400">
          national innovation program • National Skill Qualification Framework (NSQF)
        </footer>
      </div>
    );
  }

  // ACTIVE STUDENT DASHBOARD & PORTAL
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-20 sm:pb-8">
      {/* Student Clean Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  {language === 'hi' ? 'हुनरसेतु' : 'HunarSetu'}
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded">
                  Student
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {student.name} • {student.district}
              </p>
            </div>
          </div>

          {/* Desktop Clean Navigation (Rule: Limited, clear, 3-sec understanding) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
            {[
              { id: 'home', label: language === 'hi' ? 'होम' : 'Home' },
              { id: 'explore', label: language === 'hi' ? 'करियर खोजें' : 'Explore' },
              { id: 'matches', label: language === 'hi' ? 'मेरे मिलान' : 'My Matches' },
              {
                id: 'counsellor',
                label: language === 'hi' ? 'मेरी काउंसलिंग' : 'My Counselling',
                badge: unreadCount > 0 ? unreadCount : undefined
              },
              { id: 'ai', label: language === 'hi' ? 'एआई काउंसलर' : 'AI Counsellor' },
              { id: 'plan', label: language === 'hi' ? 'मेरा प्लान' : 'My Plan' },
              { id: 'profile', label: language === 'hi' ? 'प्रोफ़ाइल' : 'Profile' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'explore') setSelectedTradeForDetail(undefined);
                }}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Secondary Actions Dropdown (More) */}
            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(prev => !prev)}
                className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1"
              >
                <span>{language === 'hi' ? 'और अधिक...' : 'More...'}</span>
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 text-xs font-bold space-y-1">
                  <button
                    onClick={() => { setActiveTab('counsellor'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 flex items-center justify-between text-sky-800"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-sky-600" />
                      <span>{language === 'hi' ? 'मेरी काउंसलिंग (My Counselling)' : 'My Counselling'}</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { setActiveTab('compare'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Scale className="w-4 h-4 text-slate-500" />
                    <span>{language === 'hi' ? 'ट्रेड्स की तुलना करें' : 'Compare Careers'}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('roadmap'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                    <span>{language === 'hi' ? 'करियर रोडमैप' : 'Career Roadmaps'}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('family-discussion'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>{language === 'hi' ? 'परिवार के साथ चर्चा' : 'Family Discussion'}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('saved'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Bookmark className="w-4 h-4 text-slate-500" />
                    <span>{language === 'hi' ? 'सेव किए गए करियर' : 'Saved Careers'} ({student.savedCareerIds.length})</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('districts'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{language === 'hi' ? 'स्थानीय अवसर (आईटीआई)' : 'Local Opportunities'}</span>
                  </button>
                  <button
                    onClick={() => { setIsCounsellorModalOpen(true); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 text-amber-700"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-600" />
                    <span>{language === 'hi' ? 'काउंसलर से बात करें' : 'Talk to Counsellor'}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls: Language & Switch Role */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition"
            >
              {language === 'hi' ? 'English' : 'हिन्दी'}
            </button>
            <button
              onClick={onSwitchRole}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Switch user role"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <StudentDashboard
            language={language}
            student={student}
            onNavigate={(tab, tradeId) => {
              if (tradeId) setSelectedTradeForDetail(tradeId);
              setActiveTab(tab);
            }}
            onStartAssessment={() => setActiveTab('assessment')}
          />
        )}

        {activeTab === 'assessment' && (
          <StudentAssessment
            language={language}
            onCompleteAssessment={(scores) => {
              setStudent(prev => ({
                ...prev,
                assessmentCompleted: true,
                assessmentScores: scores
              }));
              setActiveTab('home');
            }}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {(activeTab === 'explore' || activeTab === 'matches') && (
          <StudentCareerExplorer
            language={language}
            student={student}
            initialSelectedTradeId={selectedTradeForDetail}
            onToggleSaveCareer={handleToggleSaveCareer}
            onOpenRoadmap={(tradeId) => {
              setSelectedTradeForDetail(tradeId);
              setActiveTab('roadmap');
            }}
            onOpenCompare={(tradeId) => {
              setSelectedTradeForDetail(tradeId);
              setActiveTab('compare');
            }}
            onOpenFamilyDiscussion={(tradeId) => {
              setStudent(prev => ({ ...prev, lastExploredTradeId: tradeId }));
              setActiveTab('family-discussion');
            }}
            onSpeak={onSpeak}
          />
        )}

        {activeTab === 'counsellor' && (
          <StudentCounsellorChatView
            language={language}
            student={student}
            onOpenNewRequestModal={() => setIsCounsellorModalOpen(true)}
            onSpeak={onSpeak}
          />
        )}

        {activeTab === 'ai' && (
          <StudentAICounsellor
            language={language}
            student={student}
            onSpeak={onSpeak}
            onOpenCounsellorModal={() => setIsCounsellorModalOpen(true)}
            onNavigateCounsellor={() => setActiveTab('counsellor')}
          />
        )}

        {activeTab === 'plan' && (
          <StudentCareerPlan
            language={language}
            student={student}
            onUpdatePlanTasks={(tasks) => setStudent(prev => ({ ...prev, careerPlanTasks: tasks }))}
            onNavigateExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'family-discussion' && (
          <StudentFamilyDiscussion
            language={language}
            student={student}
            tradeId={selectedTradeForDetail}
            onOpenCounsellorModal={() => setIsCounsellorModalOpen(true)}
            onNavigateRoadmap={() => setActiveTab('roadmap')}
          />
        )}

        {activeTab === 'saved' && (
          <StudentSavedCareers
            language={language}
            student={student}
            onUnsaveCareer={handleToggleSaveCareer}
            onExploreCareer={(tradeId) => {
              setSelectedTradeForDetail(tradeId);
              setActiveTab('explore');
            }}
            onOpenRoadmap={() => setActiveTab('roadmap')}
            onOpenCompare={() => setActiveTab('compare')}
            onOpenAI={() => setActiveTab('ai')}
            onNavigateExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'profile' && (
          <StudentProfileView
            language={language}
            student={student}
            onUpdateProfile={setStudent}
            onResetOnboarding={handleResetOnboarding}
          />
        )}

        {activeTab === 'roadmap' && (
          <CareerRoadmapView
            language={language}
            onSpeak={onSpeak}
          />
        )}

        {activeTab === 'compare' && (
          <TradeComparisonView
            language={language}
          />
        )}

        {activeTab === 'districts' && (
          <DistrictOpportunityView
            language={language}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (Rule: Home, Explore, Counselling, AI, My Plan, Profile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around text-[10px] font-bold shadow-lg">
        {[
          { id: 'home', label: language === 'hi' ? 'होम' : 'Home', icon: Compass },
          { id: 'explore', label: language === 'hi' ? 'करियर' : 'Explore', icon: Sparkles },
          { id: 'counsellor', label: language === 'hi' ? 'काउंसलिंग' : 'Counselling', icon: PhoneCall, badge: unreadCount },
          { id: 'ai', label: language === 'hi' ? 'एआई' : 'AI', icon: MessageSquare },
          { id: 'plan', label: language === 'hi' ? 'प्लान' : 'Plan', icon: CheckCircle2 },
          { id: 'profile', label: language === 'hi' ? 'प्रोफ़ाइल' : 'Profile', icon: User }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'explore') setSelectedTradeForDetail(undefined);
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition relative ${
                isActive ? 'text-amber-600 font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Human Counsellor Modal */}
      <CounsellorModal
        isOpen={isCounsellorModalOpen}
        onClose={() => setIsCounsellorModalOpen(false)}
        language={language}
        learner={{
          name: student.name,
          age: 18,
          gender: 'Not specified',
          state: student.state,
          district: student.district,
          localityType: student.locality || 'Semi-Urban',
          educationLevel: (student.education === 'Class 12' ? 'Class 12th (Science)' : 'Class 10th Passed') as any,
          interests: student.interests,
          preferredWorkStyle: 'Practical / hands-on work' as any,
          willingToRelocate: false,
          priority: 'High Earning Potential' as any
        }}
        parent={{
          guardianRelation: 'Father',
          guardianName: 'Parent / Guardian',
          primaryConcern: 'income',
          concernSeverity: 'Moderate',
          aspiredCareerForChild: 'General Degree or Govt Job',
          willingToSupportTrainingCost: true,
          maxTrainingMonthsAcceptable: 12,
          specificDoubt: 'Need guidance on career outcomes and degree safety'
        }}
        selectedTradeName="Vocational Trade"
        onOpenChat={() => setActiveTab('counsellor')}
      />
    </div>
  );
};
