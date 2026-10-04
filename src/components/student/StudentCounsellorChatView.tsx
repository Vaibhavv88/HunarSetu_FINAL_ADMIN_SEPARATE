import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Send,
  PhoneCall,
  Clock,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Plus,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Video,
  FileText,
  Bell,
  X,
  Check
} from 'lucide-react';
import { StudentProfile } from '../../types/student';
import {
  CounsellingCase,
  CounsellingMessage,
  CounsellingRequest,
  CounsellingSessionRecord
} from '../../types/counsellor';
import { counsellingService } from '../../services/counsellingService';
import { DEMO_COUNSELLOR_PRIYA } from '../../data/counsellorStore';
import { CounsellingCallRoomModal } from '../counsellor/CounsellingCallRoomModal';

interface StudentCounsellorChatViewProps {
  language: 'en' | 'hi';
  student: StudentProfile;
  onOpenNewRequestModal: () => void;
  onSpeak?: (text: string) => void;
}

export const StudentCounsellorChatView: React.FC<StudentCounsellorChatViewProps> = ({
  language,
  student,
  onOpenNewRequestModal,
  onSpeak
}) => {
  // Navigation tabs for My Counselling
  const [subTab, setSubTab] = useState<'active' | 'calls' | 'messages' | 'past'>('active');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeCaseId, setActiveCaseId] = useState<string>('');

  // Data states
  const [conversations, setConversations] = useState<{
    caseItem: CounsellingCase;
    messages: CounsellingMessage[];
    requests: CounsellingRequest[];
    calls: any[];
  }[]>([]);
  const [allCalls, setAllCalls] = useState<CounsellingSessionRecord[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Chat message input
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Call modal states
  const [activeCallRoom, setActiveCallRoom] = useState<CounsellingSessionRecord | null>(null);
  const [isScheduleCallModalOpen, setIsScheduleCallModalOpen] = useState<boolean>(false);
  const [callRequestDate, setCallRequestDate] = useState<string>('Tomorrow');
  const [callRequestSlot, setCallRequestSlot] = useState<string>('04:00 PM');
  const [callRequestReason, setCallRequestReason] = useState<string>(
    'Need career guidance and comparison of ITI vs Diploma'
  );
  const [isSubmittingCall, setIsSubmittingCall] = useState<boolean>(false);

  // Notification Toast banner
  const [latestToast, setLatestToast] = useState<{
    title: string;
    message: string;
    caseId?: string;
  } | null>(null);

  // Fetch full user data from counselling database
  const fetchData = async () => {
    try {
      const searchKey = student.name || 'Student';
      const [convData, callsData, notifsData, unreadData] = await Promise.all([
        counsellingService.fetchUserConversations(searchKey).catch(() => []),
        counsellingService.fetchUserCalls(searchKey).catch(() => []),
        counsellingService.fetchNotifications(searchKey, 'STUDENT').catch(() => []),
        counsellingService.fetchUnreadSummary(searchKey, 'STUDENT').catch(() => ({ messages: 0, notifications: 0 }))
      ]);

      if (convData && convData.length > 0) {
        setConversations(convData);
        if (!activeCaseId) {
          const storedCaseId = localStorage.getItem('hunarsetu_active_case_id');
          if (storedCaseId && convData.some(d => d.caseItem.id === storedCaseId)) {
            setActiveCaseId(storedCaseId);
          } else {
            setActiveCaseId(convData[0].caseItem.id);
          }
        }
      }

      setAllCalls(callsData || []);
      setNotifications(notifsData || []);
      setUnreadCount(unreadData.messages);

      // Check if unread notification exists and trigger banner
      const unreadNotif = (notifsData || []).find((n: any) => !n.read && n.recipientRole === 'STUDENT');
      if (unreadNotif && !latestToast) {
        setLatestToast({
          title: unreadNotif.title,
          message: unreadNotif.message,
          caseId: unreadNotif.caseId
        });
      }
    } catch (err) {
      console.warn('Failed to load student counselling data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 3 seconds so counsellor replies and call updates arrive live
    const timer = setInterval(fetchData, 3000);
    return () => clearInterval(timer);
  }, [student.name]);

  const activeThread = conversations.find(c => c.caseItem.id === activeCaseId) || conversations[0];
  const activeCase = activeThread?.caseItem;
  const activeMessages = activeThread?.messages || [];
  const activeCalls = allCalls.length > 0
    ? allCalls.filter(c => !activeCase || c.caseId === activeCase.id || c.studentName === (student.name || 'Student'))
    : activeThread?.calls || [];
  const activeRequests = activeThread?.requests || [];

  // When opening conversation, mark messages as read
  const handleOpenConversation = async (caseId: string) => {
    setActiveCaseId(caseId);
    setIsChatOpen(true);
    try {
      await counsellingService.markCaseRead(caseId, 'STUDENT');
      setUnreadCount(0);
      if (latestToast) setLatestToast(null);
    } catch {}
  };

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isChatOpen, activeMessages.length]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeCase) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      await counsellingService.sendMessage(activeCase.id, {
        senderUserId: `STU-${student.name || 'Student'}`,
        senderRole: 'STUDENT',
        senderName: student.name || 'Student',
        message: textToSend
      });
      await fetchData();
    } catch (err) {
      console.warn('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateCallRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCall(true);
    try {
      await counsellingService.requestCall({
        caseId: activeCase?.id || 'CASE-1042',
        counsellorId: DEMO_COUNSELLOR_PRIYA.id,
        counsellorName: DEMO_COUNSELLOR_PRIYA.name,
        studentName: student.name || 'Student',
        phone: student.district ? `+91 98765 43210` : undefined,
        sessionType: 'STUDENT_1ON1',
        tradeTitle: activeCase?.activeTradeTitle || 'Vocational Trade Guidance',
        scheduledDate: callRequestDate,
        scheduledSlot: callRequestSlot,
        callReason: callRequestReason
      });
      setIsScheduleCallModalOpen(false);
      await fetchData();
      setSubTab('calls');
    } catch (err) {
      console.warn('Failed to submit call request:', err);
    } finally {
      setIsSubmittingCall(false);
    }
  };

  const quickPrompts = [
    {
      hi: 'आईटीआई और डिप्लोमा में मेरे लिए क्या बेहतर विकल्प है?',
      en: 'Which is better for me between ITI and Diploma?'
    },
    {
      hi: 'कोर्स के बाद B.Tech में लेटरल एंट्री का क्या नियम है?',
      en: 'What is the AICTE lateral entry rule into B.Tech after this course?'
    },
    {
      hi: 'मेरे जिले में इस ट्रेड में शुरुआती वेतन कितना मिलता है?',
      en: 'What is the realistic starting salary in my district?'
    },
    {
      hi: 'मेरे पिता जी को कैसे समझाऊं? क्या आप उनसे फोन पर बात कर सकती हैं?',
      en: 'How should I explain this to my parents? Can we schedule a joint call?'
    }
  ];

  // Upcoming calls filter
  const upcomingCalls = (allCalls || []).filter(c =>
    c.status === 'scheduled' || c.status === 'requested' || c.status === 'in_progress'
  );

  const pastCalls = (allCalls || []).filter(c =>
    c.status === 'completed' || c.status === 'cancelled'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* Top Banner: Certified Counsellor Identity */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              {DEMO_COUNSELLOR_PRIYA.name.charAt(0)}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online & Available" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">{DEMO_COUNSELLOR_PRIYA.name}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {language === 'hi' ? 'सत्यापित सरकारी काउंसलर' : 'Certified Govt Counsellor'}
              </span>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-mono px-2 py-0.5 rounded">
                {DEMO_COUNSELLOR_PRIYA.badgeId}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium max-w-xl">
              {language === 'hi'
                ? 'NCVET/NSDC प्रमाणित वोकेशनल करियर गाइड • 7+ वर्ष अनुभव • छात्र एवं परिवार दोनों के साथ सीधा 2-तरफा संवाद'
                : 'NCVET/NSDC Certified Vocational Career Guide • 7+ Yrs Exp • Direct 2-Way communication with student & family.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            onClick={() => setIsScheduleCallModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{language === 'hi' ? 'कॉल शेड्यूल करें' : 'Request Call'}</span>
          </button>

          <button
            onClick={onOpenNewRequestModal}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया केस शुरू करें' : 'New Case'}</span>
          </button>

          <button
            onClick={fetchData}
            title={language === 'hi' ? 'ताज़ा करें' : 'Refresh Data'}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Notification Banner (When Counsellor replies) */}
      {latestToast && (
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black">{latestToast.title}</p>
              <p className="text-[11px] text-white/90 line-clamp-1">"{latestToast.message}"</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenConversation(latestToast.caseId || activeCase?.id || 'CASE-1042')}
              className="bg-white text-slate-900 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs hover:bg-slate-100 transition"
            >
              {language === 'hi' ? 'संदेश देखें' : 'View Message'}
            </button>
            <button
              onClick={() => setLatestToast(null)}
              className="p-1 hover:bg-white/20 rounded-lg text-white/80 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* IF DEDICATED CHAT VIEW IS OPEN */}
      {isChatOpen ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[700px]">
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition flex items-center gap-1 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'hi' ? 'मेरी काउंसलिंग' : 'My Counselling'}</span>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-white">{DEMO_COUNSELLOR_PRIYA.name}</h2>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {language === 'hi' ? 'उपलब्ध (Active)' : 'Available Now'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {language === 'hi' ? 'प्रमाणित सरकारी करियर काउंसलर' : 'Certified Career Counsellor'} • {activeCase?.activeTradeTitle || 'Vocational Guidance'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScheduleCallModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'कॉल का अनुरोध' : 'Request a Call'}</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
                <MessageSquare className="w-12 h-12 stroke-1 text-slate-300" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">
                    {language === 'hi' ? 'काउंसलर संवाद शुरू करें' : 'Start your conversation'}
                  </p>
                  <p className="text-xs max-w-sm text-slate-500">
                    {language === 'hi'
                      ? 'नीचे दिए गए त्वरित प्रश्नों में से चुनें या सीधे अपना सवाल लिखकर डॉ. प्रिया शर्मा से मार्गदर्शन पाएं।'
                      : 'Pick from quick prompts below or type your question to receive verified guidance from Dr. Priya Sharma.'}
                  </p>
                </div>
              </div>
            ) : (
              activeMessages.map(msg => {
                const isCounsellor = msg.senderRole === 'counsellor';
                const isParent = msg.senderRole === 'parent';
                const isMe = msg.senderRole === 'student';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 font-bold">
                      {isCounsellor && (
                        <span className="text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded font-black flex items-center gap-1">
                          ✓ {language === 'hi' ? 'काउंसलर' : 'Counsellor'}
                        </span>
                      )}
                      {isParent && (
                        <span className="text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-black">
                          👨‍👦 {language === 'hi' ? 'अभिभावक' : 'Parent'}
                        </span>
                      )}
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-amber-600 text-white font-medium rounded-tr-xs'
                          : isCounsellor
                          ? 'bg-white text-slate-900 border border-sky-200 font-medium rounded-tl-xs ring-1 ring-sky-100'
                          : 'bg-amber-50 text-amber-950 border border-amber-200 font-semibold rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">
              {language === 'hi' ? 'सुझाव:' : 'Quick:'}
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(language === 'hi' ? p.hi : p.en)}
                className="shrink-0 bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-700 px-3 py-1.5 rounded-xl font-semibold transition"
              >
                {language === 'hi' ? p.hi : p.en}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'अपना संदेश या सवाल लिखें...'
                  : 'Type your message or query...'
              }
              className="flex-1 bg-slate-100 text-xs font-medium px-4 py-3 rounded-2xl border border-transparent focus:border-sky-500 focus:bg-white focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white px-5 py-3 rounded-2xl transition font-bold shadow-xs flex items-center gap-1.5 shrink-0 text-xs"
            >
              <span>{language === 'hi' ? 'भेजें' : 'Send'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* MY COUNSELLING MAIN DASHBOARD */
        <div className="space-y-6">
          {/* Sub Navigation Bar: [Active] [Upcoming Calls] [Messages] [Past Sessions] */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs font-extrabold">
              <button
                onClick={() => setSubTab('active')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  subTab === 'active'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सक्रिय केस (Active)' : 'Active Cases'}</span>
              </button>

              <button
                onClick={() => setSubTab('calls')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  subTab === 'calls'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'आगामी कॉल (Calls)' : 'Upcoming Calls'}</span>
                {upcomingCalls.length > 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {upcomingCalls.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSubTab('messages')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  subTab === 'messages'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'संदेश (Messages)' : 'Messages'}</span>
                {unreadCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {unreadCount} unread
                  </span>
                )}
              </button>

              <button
                onClick={() => setSubTab('past')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  subTab === 'past'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'पिछली चर्चाएं (Past)' : 'Past Sessions'}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: ACTIVE CASES & UPCOMING CALL HIGHLIGHT */}
          {subTab === 'active' && (
            <div className="space-y-6">
              {/* Highlight Card: Upcoming Call if scheduled */}
              {upcomingCalls.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                        {language === 'hi' ? 'आगामी फोन कॉल' : 'UPCOMING CALL'}
                      </span>
                      <h3 className="text-lg font-black text-white">
                        {DEMO_COUNSELLOR_PRIYA.name} <span className="text-emerald-300">✓</span>
                      </h3>
                      <p className="text-xs text-emerald-100 font-semibold">
                        📅 {upcomingCalls[0].scheduledDate || '10 October 2026'} • ⏰ {upcomingCalls[0].scheduledSlot || '4:00 PM'} • ⏱️ {upcomingCalls[0].durationMinutes || 30} mins
                      </p>
                      <p className="text-[11px] text-emerald-200">
                        {language === 'hi'
                          ? 'स्थिति: स्वीकृत व निर्धारित • डॉ. प्रिया शर्मा आपसे सीधे फोन/रूम पर बात करेंगी।'
                          : `Status: Scheduled • Dr. Priya Sharma will guide you directly.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveCallRoom(upcomingCalls[0])}
                      className="bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-2 transform hover:scale-105"
                    >
                      <Video className="w-4 h-4 text-emerald-700" />
                      <span>{language === 'hi' ? 'कॉल रूम में जुड़ें' : 'Join Call Room'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Active Cases Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'hi' ? 'आपके सक्रिय करियर केस' : 'Active Counsellor Cases'}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {conversations.length} {conversations.length === 1 ? 'case' : 'cases'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conversations.map(conv => {
                    const c = conv.caseItem;
                    const lastMsg = conv.messages[conv.messages.length - 1];
                    const pendingReq = conv.requests.find(r => r.status === 'pending');
                    const rejectedReq = conv.requests.find(r => r.status === 'declined' || r.status === 'rejected');

                    return (
                      <div
                        key={c.id}
                        className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-sky-300 transition space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Counsellor Header Info */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 font-black text-lg flex items-center justify-center">
                                {DEMO_COUNSELLOR_PRIYA.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-black text-sm text-slate-900">{DEMO_COUNSELLOR_PRIYA.name}</h4>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                </div>
                                <p className="text-[11px] text-slate-500 font-semibold">
                                  {language === 'hi' ? 'प्रमाणित करियर काउंसलर' : 'Certified Career Counsellor'}
                                </p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            {rejectedReq ? (
                              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                {language === 'hi' ? 'अस्वीकृत' : 'Rejected'}
                              </span>
                            ) : pendingReq ? (
                              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                {language === 'hi' ? 'समीक्षा में (Pending)' : 'Pending'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {language === 'hi' ? 'सक्रिय (Active)' : 'Active'}
                              </span>
                            )}
                          </div>

                          {/* Concern / Trade Topic */}
                          <div className="bg-slate-50 rounded-2xl p-3 space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400 font-bold">{language === 'hi' ? 'विषय:' : 'Concern:'}</span>
                              <span className="font-extrabold text-slate-800">{c.primaryConcern || 'Career Guidance'}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400 font-bold">{language === 'hi' ? 'ट्रेड:' : 'Trade:'}</span>
                              <span className="font-bold text-sky-800">{c.activeTradeTitle || 'Vocational Trade'}</span>
                            </div>
                          </div>

                          {/* Last message preview */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                              {language === 'hi' ? 'अंतिम संदेश:' : 'LAST MESSAGE:'}
                            </span>
                            <p className="text-xs text-slate-700 font-medium line-clamp-2 bg-sky-50/50 p-2.5 rounded-xl border border-sky-100">
                              {lastMsg ? (
                                <>
                                  <span className="font-bold text-sky-900">
                                    {lastMsg.senderRole === 'counsellor' ? 'Counsellor: ' : 'You: '}
                                  </span>
                                  "{lastMsg.text}"
                                </>
                              ) : (
                                `Let's compare both pathways based on your goals and education.`
                              )}
                            </p>
                          </div>

                          {/* If rejection reason exists */}
                          {rejectedReq?.rejectionReason && (
                            <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 font-medium">
                              ⚠️ {language === 'hi' ? 'कारण:' : 'Reason:'} {rejectedReq.rejectionReason}
                            </div>
                          )}
                        </div>

                        {/* Action: Open Conversation */}
                        <button
                          onClick={() => handleOpenConversation(c.id)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-xs group"
                        >
                          <span>{language === 'hi' ? 'बातचीत खोलें (Open Conversation)' : 'Open Conversation'}</span>
                          <ChevronRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPCOMING CALLS */}
          {subTab === 'calls' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'hi' ? 'आगामी फोन / वीडियो काउंसलिंग सत्र' : 'Upcoming Counselling Calls'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'hi' ? 'सत्यापित सरकारी काउंसलर के साथ सीधा सत्र' : 'Direct sessions with verified certified counsellor'}
                  </p>
                </div>
                <button
                  onClick={() => setIsScheduleCallModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'hi' ? 'नया कॉल बुक करें' : 'Request Call'}</span>
                </button>
              </div>

              {upcomingCalls.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                  <PhoneCall className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">
                    {language === 'hi' ? 'कोई आगामी कॉल तय नहीं है' : 'No upcoming calls scheduled'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'hi'
                      ? 'यदि आप या आपके परिवार को ट्रेड, वेतन या सुरक्षा पर कोई शंका है, तो सीधे कॉल का अनुरोध करें।'
                      : 'Request a 30-minute one-on-one session with Dr. Priya Sharma to clarify your career doubts.'}
                  </p>
                  <button
                    onClick={() => setIsScheduleCallModalOpen(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-5 py-2.5 rounded-xl transition"
                  >
                    {language === 'hi' ? 'काउंसलिंग कॉल तय करें' : 'Schedule a Call'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingCalls.map(call => (
                    <div
                      key={call.id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                              <PhoneCall className="w-5 h-5 text-emerald-700" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <h4 className="font-black text-sm text-slate-900">{DEMO_COUNSELLOR_PRIYA.name}</h4>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              </div>
                              <p className="text-[10px] text-slate-400 font-semibold">
                                {call.sessionType === 'joint_family' ? 'Family Joint Session' : 'Student 1-on-1 Guidance'}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {call.status}
                          </span>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">{language === 'hi' ? 'दिनांक:' : 'Date:'}</span>
                            <span className="font-extrabold text-slate-800">{call.scheduledDate || 'Tomorrow'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">{language === 'hi' ? 'समय:' : 'Time:'}</span>
                            <span className="font-extrabold text-slate-800">{call.scheduledSlot || '04:00 PM'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">{language === 'hi' ? 'अवधि:' : 'Duration:'}</span>
                            <span className="font-bold text-slate-700">{call.durationMinutes || 30} mins</span>
                          </div>
                        </div>

                        {call.callReason && (
                          <p className="text-[11px] text-slate-600 font-medium">
                            <span className="font-bold text-slate-800">{language === 'hi' ? 'मुद्दा:' : 'Topic:'}</span> {call.callReason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setActiveCallRoom(call)}
                          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'कॉल रूम में जुड़ें' : 'Join Call Room'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenConversation(call.caseId || activeCase?.id || 'CASE-1042')}
                          className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                          title="Chat with Counsellor"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MESSAGES DIRECTORY */}
          {subTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'hi' ? 'काउंसलर संवाद धागे' : 'Conversation Threads'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'hi' ? 'सभी संदेश सीधे NCVET प्रमाणित डेटाबेस से जुड़े हैं' : 'All messages are synced with certified database'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                {conversations.map(conv => {
                  const c = conv.caseItem;
                  const lastMsg = conv.messages[conv.messages.length - 1];

                  return (
                    <div
                      key={c.id}
                      onClick={() => handleOpenConversation(c.id)}
                      className="p-4 sm:p-5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 font-black text-lg flex items-center justify-center shrink-0">
                          {DEMO_COUNSELLOR_PRIYA.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm text-slate-900">{DEMO_COUNSELLOR_PRIYA.name}</h4>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-bold">
                              ✓ Verified
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                            {lastMsg ? lastMsg.text : 'Click to view conversation and reply'}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {lastMsg ? lastMsg.timestamp : 'Recent'} • {c.activeTradeTitle || 'Vocational Trade'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {conv.messages.some(m => m.senderRole === 'counsellor' && m.status !== 'read') && (
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        )}
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: PAST SESSIONS & FOLLOW-UPS */}
          {subTab === 'past' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {language === 'hi' ? 'पिछली काउंसलिंग चर्चाएं व रिपोर्ट' : 'Past Counselling Sessions & Notes'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'काउंसलर डॉ. प्रिया शर्मा द्वारा दिए गए आधिकारिक सुझाव व अगले कदम'
                    : 'Verified session takeaways and recommendations by Dr. Priya Sharma'}
                </p>
              </div>

              {pastCalls.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">
                    {language === 'hi' ? 'अभी कोई समाप्त सत्र उपलब्ध नहीं है' : 'No completed sessions yet'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'hi'
                      ? 'जैसे ही आपकी पहली काउंसलिंग कॉल पूरी होगी, काउंसलर के नोट्स और प्रगति सीढ़ी यहाँ दिखाई देगी।'
                      : 'Once your first scheduled call concludes, detailed counsellor notes and progression steps will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastCalls.map(call => (
                    <div
                      key={call.id}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                              ✓ SESSION COMPLETED
                            </span>
                            <span className="text-xs text-slate-400 font-mono">{call.id}</span>
                          </div>
                          <h4 className="font-black text-sm text-slate-900 mt-1">
                            {call.tradeTitle || 'Vocational Trade Consultation'}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {DEMO_COUNSELLOR_PRIYA.name} • {call.scheduledDate} • {call.actualDurationSeconds ? Math.round(call.actualDurationSeconds / 60) : 30} mins
                          </p>
                        </div>
                      </div>

                      {call.counsellorNotesSummary && (
                        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-1">
                          <span className="text-[10px] font-black uppercase text-sky-800 block">
                            {language === 'hi' ? 'काउंसलर का आधिकारिक सारांश:' : 'COUNSELLOR SESSION SUMMARY:'}
                          </span>
                          <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            {call.counsellorNotesSummary}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span>{language === 'hi' ? 'परिवार के साथ साझा किया गया' : 'Shared with family'}</span>
                        <button
                          onClick={() => handleOpenConversation(call.caseId || activeCase?.id || 'CASE-1042')}
                          className="text-sky-700 font-bold hover:underline"
                        >
                          {language === 'hi' ? 'चैट में फॉलो-अप पूछें →' : 'Ask follow-up in chat →'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SCHEDULE CALL MODAL */}
      {isScheduleCallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {language === 'hi' ? 'काउंसलिंग कॉल का अनुरोध करें' : 'Request Counselling Call'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">{DEMO_COUNSELLOR_PRIYA.name} ✓ Verified</p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleCallModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCallRequest} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-600 block">{language === 'hi' ? 'पसंदीदा तारीख:' : 'Preferred Date:'}</label>
                <select
                  value={callRequestDate}
                  onChange={e => setCallRequestDate(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2.5 font-bold border border-transparent focus:border-emerald-500 focus:bg-white"
                >
                  <option value="Today">Today (आज)</option>
                  <option value="Tomorrow">Tomorrow (कल)</option>
                  <option value="10 October 2026">10 October 2026</option>
                  <option value="11 October 2026">11 October 2026</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">{language === 'hi' ? 'समय स्लॉट:' : 'Time Slot:'}</label>
                <select
                  value={callRequestSlot}
                  onChange={e => setCallRequestSlot(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2.5 font-bold border border-transparent focus:border-emerald-500 focus:bg-white"
                >
                  <option value="11:00 AM">11:00 AM - 11:30 AM</option>
                  <option value="02:30 PM">02:30 PM - 03:00 PM</option>
                  <option value="04:00 PM">04:00 PM - 04:30 PM</option>
                  <option value="06:00 PM">06:00 PM - 06:30 PM</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 block">{language === 'hi' ? 'कॉल का मुख्य कारण / प्रश्न:' : 'Call Concern / Query:'}</label>
                <textarea
                  value={callRequestReason}
                  onChange={e => setCallRequestReason(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-100 rounded-xl p-3 font-medium border border-transparent focus:border-emerald-500 focus:bg-white"
                  placeholder={language === 'hi' ? 'जैसे: आईटीआई और डिप्लोमा में तुलना...' : 'e.g., Comparing ITI vs Diploma for career...'}
                />
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-[11px] leading-relaxed">
                ℹ️ {language === 'hi'
                  ? 'काउंसलर आपके अनुरोध को स्वीकार कर समय निश्चित करेंगी। आपको तुरंत एसएमएस और ऐप पर सूचना मिलेगी।'
                  : 'Counsellor will confirm the slot and you will receive a direct notification on the panel.'}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleCallModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCall}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black py-2.5 rounded-xl transition shadow-xs"
                >
                  {isSubmittingCall ? 'Submitting...' : (language === 'hi' ? 'अनुरोध भेजें' : 'Confirm Request')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE CALL ROOM MODAL */}
      {activeCallRoom && (
        <CounsellingCallRoomModal
          isOpen={!!activeCallRoom}
          onClose={() => setActiveCallRoom(null)}
          call={activeCallRoom}
          currentUserRole="student"
          currentUserName={student.name || 'Student'}
          language={language}
          onCallCompleted={() => {
            fetchData();
            setActiveCallRoom(null);
          }}
        />
      )}
    </div>
  );
};
