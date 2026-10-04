import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  MessageSquare,
  PhoneCall,
  Users,
  Calendar,
  BarChart3,
  UserCheck,
  ShieldCheck,
  Bell,
  ArrowLeftRight,
  LogOut,
  Menu,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { NotificationItem } from '../../types/auth';
import {
  CounsellorProfile,
  CounsellingRequest,
  CounsellingCase,
  CounsellingMessage,
  CounsellorNote,
  CounsellorRecommendation,
  CounsellingFollowUp
} from '../../types/counsellor';
import {
  DEMO_COUNSELLOR_PRIYA,
  INITIAL_COUNSELLING_REQUESTS,
  INITIAL_COUNSELLING_CASES,
  INITIAL_MESSAGES
} from '../../data/counsellorStore';
import { counsellingService } from '../../services/counsellingService';

import { CounsellorOnboarding } from './CounsellorOnboarding';
import { CounsellorDashboardOverview } from './CounsellorDashboardOverview';
import { CounsellorRequestsView } from './CounsellorRequestsView';
import { CounsellorCasesView } from './CounsellorCasesView';
import { CounsellorChatView } from './CounsellorChatView';
import { CounsellorCallSessionView } from './CounsellorCallSessionView';
import { CounsellorFamilyMediationView } from './CounsellorFamilyMediationView';
import { CounsellorFollowUpsView } from './CounsellorFollowUpsView';
import { CounsellorReportsView } from './CounsellorReportsView';
import { CounsellorProfileSettingsView } from './CounsellorProfileSettingsView';

interface CounsellorPortalProps {
  language: 'en' | 'hi';
  onNavigateHome: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onToggleLanguage?: () => void;
  onSwitchRole?: () => void;
}

export const CounsellorPortal: React.FC<CounsellorPortalProps> = ({
  language,
  onNavigateHome,
  notifications,
  onMarkNotificationRead,
  onToggleLanguage,
  onSwitchRole
}) => {
  // Counsellor Profile
  const [counsellor, setCounsellor] = useState<CounsellorProfile>(() => {
    try {
      const saved = localStorage.getItem('hunarsetu_counsellor_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...DEMO_COUNSELLOR_PRIYA };
  });

  // Requests
  const [requests, setRequests] = useState<CounsellingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('hunarsetu_counsellor_requests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COUNSELLING_REQUESTS;
  });

  // Cases
  const [cases, setCases] = useState<CounsellingCase[]>(() => {
    try {
      const saved = localStorage.getItem('hunarsetu_counsellor_cases');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COUNSELLING_CASES;
  });

  // Messages
  const [messages, setMessages] = useState<{ [caseId: string]: CounsellingMessage[] }>(() => {
    try {
      const saved = localStorage.getItem('hunarsetu_counsellor_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MESSAGES;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-1042');
  const [isCallingLive, setIsCallingLive] = useState<boolean>(false);
  const [callingCaseId, setCallingCaseId] = useState<string>('CASE-1042');
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Load from backend server and fallback to local
  const loadDataFromServer = async () => {
    try {
      setIsSyncing(true);
      const [serverReqs, serverCases] = await Promise.all([
        counsellingService.fetchCounsellorRequests(counsellor.id),
        counsellingService.fetchCases(counsellor.id)
      ]);

      if (serverReqs && serverReqs.length > 0) {
        setRequests(serverReqs);
      }
      if (serverCases && serverCases.length > 0) {
        setCases(serverCases);
        // Also fetch messages for active cases
        const msgsMap: { [caseId: string]: CounsellingMessage[] } = {};
        await Promise.all(
          serverCases.slice(0, 8).map(async c => {
            try {
              const msgs = await counsellingService.fetchCaseMessages(c.id);
              if (msgs && msgs.length > 0) {
                msgsMap[c.id] = msgs;
              }
            } catch {}
          })
        );
        if (Object.keys(msgsMap).length > 0) {
          setMessages(prev => ({ ...prev, ...msgsMap }));
        }
      }
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('[CounsellorPortal] Sync from server warning:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Poll server every 4 seconds to pick up new requests from Student & Parent panels
  useEffect(() => {
    loadDataFromServer();
    const interval = setInterval(loadDataFromServer, 4000);
    return () => clearInterval(interval);
  }, [counsellor.id]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hunarsetu_counsellor_profile', JSON.stringify(counsellor));
    } catch {}
  }, [counsellor]);

  useEffect(() => {
    try {
      localStorage.setItem('hunarsetu_counsellor_requests', JSON.stringify(requests));
    } catch {}
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem('hunarsetu_counsellor_cases', JSON.stringify(cases));
    } catch {}
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem('hunarsetu_counsellor_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Request Handlers
  const handleAcceptRequest = async (requestId: string) => {
    // Optimistic UI update
    setRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'accepted' } : r))
    );

    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) return;

    try {
      await counsellingService.acceptRequest(requestId);
    } catch (err) {
      console.warn('Failed to call acceptRequest on backend:', err);
    }

    if (!targetReq.caseId) {
      const newCaseId = `CASE-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCase: CounsellingCase = {
        id: newCaseId,
        title: `${targetReq.studentName} • ${targetReq.concernCategory}`,
        studentName: targetReq.studentName,
        parentName: targetReq.parentName,
        district: targetReq.district,
        state: targetReq.state,
        stage: 'Initial Discussion',
        primaryConcern: targetReq.concernCategory,
        activeTradeTitle: targetReq.careerReferenceTradeTitle || 'Technical Trade',
        studentGoalSummary: targetReq.messageText,
        parentConcernSummary: targetReq.parentName ? targetReq.messageText : undefined,
        recommendedNextStep: 'Conduct introductory call and review NSQF progression.',
        isFamilyConnected: !!targetReq.parentName,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        notes: [],
        recommendations: [],
        followUps: [],
        sessions: [
          {
            id: `SESS-${Date.now()}`,
            caseId: newCaseId,
            sessionType: targetReq.requestType === 'family_session' ? 'joint_family' : 'student_1on1',
            studentName: targetReq.studentName,
            parentName: targetReq.parentName,
            tradeTitle: targetReq.careerReferenceTradeTitle || 'Vocational Trade',
            scheduledTime: 'Tomorrow • 11:00 AM',
            durationMinutes: 30,
            status: 'scheduled'
          }
        ]
      };
      setCases(prev => [newCase, ...prev]);
      setSelectedCaseId(newCaseId);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'declined' } : r))
    );
    try {
      await counsellingService.rejectRequest(requestId, 'Counsellor schedule capacity');
    } catch {}
  };

  const handleSendMessage = async (caseId: string, text: string) => {
    const tempId = `M-${Date.now()}`;
    const newMsg: CounsellingMessage = {
      id: tempId,
      caseId,
      senderId: counsellor.id,
      senderName: counsellor.name,
      senderRole: 'counsellor',
      text,
      timestamp: 'Just now',
      status: 'delivered'
    };

    setMessages(prev => ({
      ...prev,
      [caseId]: [...(prev[caseId] || []), newMsg]
    }));

    try {
      const savedMsg = await counsellingService.sendMessage(caseId, {
        senderUserId: counsellor.id,
        senderRole: 'COUNSELLOR',
        senderName: counsellor.name,
        message: text
      });
      if (savedMsg) {
        setMessages(prev => ({
          ...prev,
          [caseId]: prev[caseId].map(m => m.id === tempId ? savedMsg : m)
        }));
      }
    } catch (err) {
      console.warn('Backend message save warning:', err);
    }
  };

  const handleAddNote = async (caseId: string, noteText: string, visibility: 'private' | 'shared_with_family') => {
    const newNote: CounsellorNote = {
      id: `NOTE-${Date.now()}`,
      caseId,
      counsellorId: counsellor.id,
      createdAt: 'Just now',
      noteText,
      visibility
    };

    setCases(prev =>
      prev.map(c => (c.id === caseId ? { ...c, notes: [newNote, ...(c.notes || [])] } : c))
    );

    try {
      await counsellingService.addNote(caseId, noteText, visibility, counsellor.id);
    } catch {}
  };

  const handleAddRecommendation = (caseId: string, rec: Omit<CounsellorRecommendation, 'id'>) => {
    const newRec: CounsellorRecommendation = {
      ...rec,
      id: `REC-${Date.now()}`
    };

    setCases(prev =>
      prev.map(c => (c.id === caseId ? { ...c, recommendations: [...(c.recommendations || []), newRec] } : c))
    );
  };

  const handleAddFollowUp = async (caseId: string, followUp: Omit<CounsellingFollowUp, 'id' | 'createdAt' | 'status'>) => {
    const newFollowUp: CounsellingFollowUp = {
      ...followUp,
      id: `FOL-${Date.now()}`,
      status: 'pending',
      createdAt: 'Just now'
    };

    setCases(prev =>
      prev.map(c => (c.id === caseId ? { ...c, followUps: [...(c.followUps || []), newFollowUp] } : c))
    );

    try {
      await counsellingService.addFollowUp(caseId, {
        counsellorId: counsellor.id,
        studentName: followUp.studentName,
        parentName: followUp.parentName,
        dueDate: followUp.dueDate,
        reason: followUp.reason
      });
    } catch {}
  };

  const handleCompleteFollowUp = (caseId: string, followUpId: string) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          followUps: (c.followUps || []).map(f => (f.id === followUpId ? { ...f, status: 'completed' } : f))
        };
      })
    );
  };

  const handleUpdateCaseStage = async (caseId: string, stage: CounsellingCase['stage']) => {
    setCases(prev =>
      prev.map(c => (c.id === caseId ? { ...c, stage } : c))
    );

    try {
      await counsellingService.updateCaseStage(caseId, stage);
    } catch {}
  };

  const handleStartCall = (caseId: string) => {
    setCallingCaseId(caseId);
    setIsCallingLive(true);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // IF ONBOARDING NOT COMPLETED
  if (!counsellor.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <CounsellorOnboarding
          language={language}
          counsellor={counsellor}
          onComplete={updated => {
            setCounsellor(updated);
            setActiveTab('overview');
          }}
        />
      </div>
    );
  }

  // IF IN ACTIVE LIVE CALL
  if (isCallingLive) {
    const callCase = cases.find(c => c.id === callingCaseId) || cases[0];
    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <CounsellorCallSessionView
            language={language}
            caseItem={callCase}
            onEndCall={() => setIsCallingLive(false)}
            onSaveNote={(noteText, visibility) => {
              handleAddNote(callCase.id, noteText, visibility);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-900 flex flex-col antialiased">
      {/* Top Professional Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-sm tracking-tight">
                    {language === 'hi' ? 'हुनरसेतु काउंसलर' : 'HunarSetu Counsellor'}
                  </span>
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-sky-200">
                    {language === 'hi' ? 'प्रमाणित डेस्क' : 'Verified Desk'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold truncate max-w-[170px] sm:max-w-xs">
                  {counsellor.name} ({counsellor.badgeId})
                </p>
              </div>
            </button>
          </div>

          {/* Right Header Tools */}
          <div className="flex items-center gap-2">
            {/* Live Server Sync Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px] font-bold">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-sky-500 animate-ping' : 'bg-emerald-500'}`} />
              <span>{isSyncing ? (language === 'hi' ? 'सिंक हो रहा है...' : 'Syncing...') : (language === 'hi' ? 'लाइव सिंक' : 'Live Sync')}</span>
            </div>

            <button
              onClick={loadDataFromServer}
              disabled={isSyncing}
              title={language === 'hi' ? `सर्वर से रीफ्रेश करें (अंतिम सिंक: ${lastSyncTime})` : `Refresh from Server (Last: ${lastSyncTime})`}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-sky-600' : ''}`} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDrawerOpen(!isNotifDrawerOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notification Drawer Modal */}
              {isNotifDrawerOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 z-50 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-xs text-slate-900">
                      {language === 'hi' ? 'सूचनाएं' : 'Counsellor Alerts'} ({unreadCount})
                    </span>
                    <button
                      onClick={() => setIsNotifDrawerOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onMarkNotificationRead(n.id);
                          if (n.ticketId) {
                            setActiveTab('cases');
                          }
                        }}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                          n.read ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-sky-50/70 border-sky-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold block">{language === 'hi' ? n.titleHi : n.title}</strong>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                          {language === 'hi' ? n.messageHi : n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition"
              >
                {language === 'hi' ? 'English' : 'हिन्दी'}
              </button>
            )}

            {onSwitchRole && (
              <button
                onClick={onSwitchRole}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Switch Role"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Layout: Sidebar + Content */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-full md:w-60 shrink-0 hidden md:block space-y-1">
          <div className="bg-white rounded-3xl border border-slate-200 p-3 space-y-1 shadow-2xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'overview'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'requests'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                <span>{language === 'hi' ? 'अनुरोध कतार' : 'Requests'}</span>
              </div>
              <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.2 rounded-full">
                {requests.filter(r => r.status === 'new').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'cases'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>{language === 'hi' ? 'सक्रिय केस' : 'My Cases'}</span>
              </div>
              <span className="text-[10px] font-bold opacity-75">
                {cases.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'messages'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'hi' ? 'संदेश (Chat)' : 'Messages'}</span>
            </button>

            <button
              onClick={() => setActiveTab('mediation')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'mediation'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-amber-500" />
              <span>{language === 'hi' ? 'पारिवारिक मध्यस्थता' : 'Family Mediation'}</span>
            </button>

            <button
              onClick={() => setActiveTab('followups')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'followups'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{language === 'hi' ? 'फॉलो-अप' : 'Follow-ups'}</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'reports'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{language === 'hi' ? 'रिपोर्ट्स' : 'Reports'}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'profile'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्रोफ़ाइल व समय' : 'Profile & Slots'}</span>
            </button>
          </div>
        </aside>

        {/* Mobile Horizontal Navigation */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 text-xs font-bold no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`shrink-0 px-3 py-1.5 rounded-xl ${
              activeTab === 'overview' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`shrink-0 px-3 py-1.5 rounded-xl ${
              activeTab === 'requests' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Requests ({requests.filter(r => r.status === 'new').length})
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`shrink-0 px-3 py-1.5 rounded-xl ${
              activeTab === 'cases' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Cases
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`shrink-0 px-3 py-1.5 rounded-xl ${
              activeTab === 'messages' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('mediation')}
            className={`shrink-0 px-3 py-1.5 rounded-xl ${
              activeTab === 'mediation' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Mediation
          </button>
          <button
            onClick={() => setActiveTab('followups')}
            className={`shrink-0 px-3 py-1.5 rounded-xl ${
              activeTab === 'followups' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Follow-ups
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`shrink-0 px-3 py-1.5 rounded-xl ${
              activeTab === 'reports' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`shrink-0 px-3 py-1.5 rounded-xl ${
              activeTab === 'profile' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Dynamic Main View Switcher */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <CounsellorDashboardOverview
              language={language}
              counsellor={counsellor}
              requests={requests}
              cases={cases}
              onNavigate={(tab, contextId) => {
                if (contextId) setSelectedCaseId(contextId);
                setActiveTab(tab);
              }}
              onStartCall={handleStartCall}
            />
          )}

          {activeTab === 'requests' && (
            <CounsellorRequestsView
              language={language}
              requests={requests}
              onAcceptRequest={handleAcceptRequest}
              onDeclineRequest={handleDeclineRequest}
              onOpenCase={caseId => {
                setSelectedCaseId(caseId);
                setActiveTab('cases');
              }}
            />
          )}

          {activeTab === 'cases' && (
            <CounsellorCasesView
              language={language}
              cases={cases}
              selectedCaseId={selectedCaseId}
              onSelectCase={setSelectedCaseId}
              onUpdateCaseStage={handleUpdateCaseStage}
              onAddNote={handleAddNote}
              onAddRecommendation={handleAddRecommendation}
              onAddFollowUp={handleAddFollowUp}
              onOpenChat={caseId => {
                setSelectedCaseId(caseId);
                setActiveTab('messages');
              }}
              onStartCall={handleStartCall}
            />
          )}

          {activeTab === 'messages' && (
            <CounsellorChatView
              language={language}
              cases={cases}
              selectedCaseId={selectedCaseId}
              messages={messages}
              onSendMessage={handleSendMessage}
              onSelectCase={setSelectedCaseId}
              onStartCall={handleStartCall}
            />
          )}

          {activeTab === 'mediation' && (
            <CounsellorFamilyMediationView
              language={language}
              cases={cases}
              selectedCaseId={selectedCaseId}
              onSelectCase={setSelectedCaseId}
              onSaveMediationSummary={(caseId, summary) => {
                setCases(prev =>
                  prev.map(c =>
                    c.id === caseId
                      ? {
                          ...c,
                          studentGoalSummary: summary.studentPerspective,
                          parentConcernSummary: summary.parentPerspective,
                          recommendedNextStep: summary.agreedNextStep
                        }
                      : c
                  )
                );
              }}
              onStartCall={handleStartCall}
            />
          )}

          {activeTab === 'followups' && (
            <CounsellorFollowUpsView
              language={language}
              cases={cases}
              onCompleteFollowUp={handleCompleteFollowUp}
              onOpenCase={caseId => {
                setSelectedCaseId(caseId);
                setActiveTab('cases');
              }}
            />
          )}

          {activeTab === 'reports' && (
            <CounsellorReportsView
              language={language}
              cases={cases}
            />
          )}

          {activeTab === 'profile' && (
            <CounsellorProfileSettingsView
              language={language}
              counsellor={counsellor}
              onUpdateProfile={setCounsellor}
              onToggleLanguage={onToggleLanguage || (() => {})}
              onLogout={onNavigateHome}
            />
          )}
        </main>
      </div>
    </div>
  );
};
