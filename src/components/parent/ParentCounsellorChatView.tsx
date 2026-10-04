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
  Volume2,
  Users,
  Mic
} from 'lucide-react';
import { ParentDetailedProfile } from '../../types/parent';
import {
  CounsellingCase,
  CounsellingMessage,
  CounsellingRequest,
  CounsellingSessionRecord
} from '../../types/counsellor';
import { counsellingService } from '../../services/counsellingService';
import { DEMO_COUNSELLOR_PRIYA } from '../../data/counsellorStore';
import { CounsellingCallRoomModal } from '../counsellor/CounsellingCallRoomModal';
import { startSpeechRecognition } from '../../services/speechService';

interface ParentCounsellorChatViewProps {
  language: 'en' | 'hi';
  parent: ParentDetailedProfile;
  onOpenNewRequestModal: () => void;
  onSpeak?: (text: string) => void;
}

export const ParentCounsellorChatView: React.FC<ParentCounsellorChatViewProps> = ({
  language,
  parent,
  onOpenNewRequestModal,
  onSpeak
}) => {
  // Navigation tabs for Parent My Counselling
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
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Chat message input
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Call modal states
  const [activeCallRoom, setActiveCallRoom] = useState<CounsellingSessionRecord | null>(null);
  const [isScheduleCallModalOpen, setIsScheduleCallModalOpen] = useState<boolean>(false);
  const [callRequestDate, setCallRequestDate] = useState<string>('Tomorrow');
  const [callRequestSlot, setCallRequestSlot] = useState<string>('04:00 PM');
  const [callRequestReason, setCallRequestReason] = useState<string>(
    parent.mainConcern || 'Worried about long-term job security and degree pathway'
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
      const searchKey = parent.parentName || parent.childName || 'Parent';
      const [convData, callsData, notifsData, unreadData] = await Promise.all([
        counsellingService.fetchUserConversations(searchKey).catch(() => []),
        counsellingService.fetchUserCalls(searchKey).catch(() => []),
        counsellingService.fetchNotifications(searchKey, 'PARENT').catch(() => []),
        counsellingService.fetchUnreadSummary(searchKey, 'PARENT').catch(() => ({ messages: 0, notifications: 0 }))
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
      setUnreadCount(unreadData.messages);

      // Check if unread notification exists for parent and trigger toast
      const unreadNotif = (notifsData || []).find((n: any) => !n.read && n.recipientRole === 'PARENT');
      if (unreadNotif && !latestToast) {
        setLatestToast({
          title: unreadNotif.title,
          message: unreadNotif.message,
          caseId: unreadNotif.caseId
        });
      }
    } catch (err) {
      console.warn('Failed to load parent counselling data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 3 seconds so counsellor messages arrive live
    const timer = setInterval(fetchData, 3000);
    return () => clearInterval(timer);
  }, [parent.parentName, parent.childName]);

  const activeThread = conversations.find(c => c.caseItem.id === activeCaseId) || conversations[0];
  const activeCase = activeThread?.caseItem;
  const activeMessages = activeThread?.messages || [];
  const activeCalls = allCalls.length > 0
    ? allCalls.filter(c => !activeCase || c.caseId === activeCase.id || c.parentName === parent.parentName)
    : activeThread?.calls || [];

  // When opening conversation, mark messages as read
  const handleOpenConversation = async (caseId: string) => {
    setActiveCaseId(caseId);
    setIsChatOpen(true);
    try {
      await counsellingService.markCaseRead(caseId, 'PARENT');
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
        senderUserId: `PAR-${parent.parentName || 'Parent'}`,
        senderRole: 'PARENT',
        senderName: parent.parentName ? `${parent.parentName} (${parent.guardianRelation})` : 'Parent',
        message: textToSend
      });
      await fetchData();
    } catch (err) {
      console.warn('Failed to send message from parent:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleMicToggle = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current = startSpeechRecognition(language, {
        onResult: (transcript) => {
          setInputText(transcript);
          setIsRecording(false);
        },
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false)
      });
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
        studentName: parent.childName || 'Child',
        parentName: parent.parentName || 'Parent',
        phone: '',
        sessionType: 'JOINT_FAMILY',
        tradeTitle: activeCase?.activeTradeTitle || 'Vocational Career Consultation',
        scheduledDate: callRequestDate,
        scheduledSlot: callRequestSlot,
        callReason: callRequestReason
      });
      setIsScheduleCallModalOpen(false);
      await fetchData();
      setSubTab('calls');
    } catch (err) {
      console.warn('Failed to submit parent call request:', err);
    } finally {
      setIsSubmittingCall(false);
    }
  };

  const quickPrompts = [
    {
      hi: 'मैं मुख्य रूप से इस बात को लेकर चिंतित हूँ कि क्या मेरा बच्चा बाद में उच्च शिक्षा (डिग्री) जारी रख सकता है?',
      en: 'I am mainly worried about whether my child can continue higher education later.'
    },
    {
      hi: 'शुरुआती वेतन कितना होगा और क्या नौकरी में सुरक्षा है?',
      en: 'What is the starting salary and is the job secure?'
    },
    {
      hi: 'क्या हम आज या कल फोन पर इस पर विस्तार से चर्चा कर सकते हैं?',
      en: 'Can we discuss this over a call today or tomorrow?'
    }
  ];

  const upcomingCalls = (allCalls || []).filter(c =>
    c.status === 'scheduled' || c.status === 'requested' || c.status === 'in_progress'
  );

  const pastCalls = (allCalls || []).filter(c =>
    c.status === 'completed' || c.status === 'cancelled'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* Top Banner: Verified Certified Counsellor Identity */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              {DEMO_COUNSELLOR_PRIYA.name.charAt(0)}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full" title="Online" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">{DEMO_COUNSELLOR_PRIYA.name}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {language === 'hi' ? 'प्रमाणित सरकारी काउंसलर' : 'Certified Govt Counsellor'}
              </span>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-mono px-2 py-0.5 rounded">
                {DEMO_COUNSELLOR_PRIYA.badgeId}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium max-w-xl">
              {language === 'hi'
                ? 'अभिभावक परामर्श विशेषज्ञ • 7+ वर्ष अनुभव • माता-पिता के वेतन, सामाजिक सम्मान और डिग्री सुरक्षा संबंधी सभी संशयों का आधिकारिक समाधान'
                : 'Parent Consultation Specialist • 7+ Yrs Exp • Direct guidance for families on salary, social respect & degree safety.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            onClick={() => setIsScheduleCallModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{language === 'hi' ? 'फोन कॉल बुक करें' : 'Book a Call'}</span>
          </button>

          <button
            onClick={onOpenNewRequestModal}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया प्रश्न पूछें' : 'Ask Question'}</span>
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

      {/* Toast Notification Banner (When Counsellor replies to Parent) */}
      {latestToast && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-top-2">
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
              className="bg-white text-emerald-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs hover:bg-slate-100 transition"
            >
              {language === 'hi' ? 'जवाब देखें' : 'View Reply'}
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
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition flex items-center gap-1 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'hi' ? 'वापस' : 'Back to Counselling'}</span>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-white">{DEMO_COUNSELLOR_PRIYA.name}</h2>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {language === 'hi' ? 'उपलब्ध (Online)' : 'Available Now'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {language === 'hi' ? 'अभिभावक परामर्श कक्ष' : 'Parent Consultation Room'} • {parent.parentName} ({parent.guardianRelation})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScheduleCallModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'कॉल बुक करें' : 'Request Call'}</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
            {activeMessages.map(msg => {
              const isCounsellor = msg.senderRole === 'counsellor';
              const isMe = msg.senderRole === 'parent';
              const isStudent = msg.senderRole === 'student';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 font-bold">
                    {isCounsellor && (
                      <span className="text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-black flex items-center gap-1">
                        ✓ {language === 'hi' ? 'काउंसलर डॉ. प्रिया शर्मा' : 'Counsellor Dr. Priya'}
                      </span>
                    )}
                    {isStudent && (
                      <span className="text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-black">
                        🎓 {language === 'hi' ? 'विद्यार्थी (बच्चा)' : 'Student'}
                      </span>
                    )}
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {onSpeak && (
                      <button
                        onClick={() => onSpeak(msg.text)}
                        title="Listen to message (आवाज़ में सुनें)"
                        className="text-slate-400 hover:text-slate-700 ml-1 p-0.5 rounded transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-amber-600 text-white font-medium rounded-tr-xs'
                        : isCounsellor
                        ? 'bg-white text-slate-900 border border-emerald-200 font-medium rounded-tl-xs ring-1 ring-emerald-100'
                        : 'bg-sky-50 text-sky-950 border border-sky-200 font-semibold rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts for Parents */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">
              {language === 'hi' ? 'त्वरित प्रश्न:' : 'Quick:'}
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(language === 'hi' ? p.hi : p.en)}
                className="shrink-0 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-3 py-1.5 rounded-xl font-semibold transition"
              >
                {language === 'hi' ? p.hi : p.en}
              </button>
            ))}
          </div>

          {/* Input Form with Speech-to-Text */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-3 rounded-2xl transition flex items-center justify-center shrink-0 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={language === 'hi' ? 'बोलकर लिखें' : 'Speak to Type'}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'काउंसलर डॉ. प्रिया शर्मा से अपना संशय या प्रश्न पूछें...'
                  : 'Type your question or concern to Dr. Priya Sharma...'
              }
              className="flex-1 bg-slate-100 text-xs font-medium px-4 py-3 rounded-2xl border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none transition"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white px-5 py-3 rounded-2xl transition font-bold shadow-xs flex items-center gap-1.5 shrink-0 text-xs"
            >
              <span>{language === 'hi' ? 'भेजें' : 'Send'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* PARENT MY COUNSELLING MAIN DASHBOARD */
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
                <span>{language === 'hi' ? 'सक्रिय परामर्श (Active)' : 'Active Cases'}</span>
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
                <span>{language === 'hi' ? 'आगामी फोन सत्र (Calls)' : 'Upcoming Calls'}</span>
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
                  <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
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
                <span>{language === 'hi' ? 'पिछली चर्चाएं व सुझाव (Past)' : 'Past Sessions'}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: ACTIVE CASES & UPCOMING CALL CARD */}
          {subTab === 'active' && (
            <div className="space-y-6">
              {/* Highlight Upcoming Call */}
              {upcomingCalls.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                        {language === 'hi' ? 'आगामी पारिवारिक फोन सत्र' : 'UPCOMING FAMILY CALL'}
                      </span>
                      <h3 className="text-lg font-black text-white">
                        {DEMO_COUNSELLOR_PRIYA.name} <span className="text-emerald-300">✓</span>
                      </h3>
                      <p className="text-xs text-emerald-100 font-semibold">
                        📅 {upcomingCalls[0].scheduledDate || '10 October 2026'} • ⏰ {upcomingCalls[0].scheduledSlot || '4:00 PM'} • ⏱️ {upcomingCalls[0].durationMinutes || 30} mins
                      </p>
                      <p className="text-[11px] text-emerald-200">
                        {language === 'hi'
                          ? 'काउंसलर डॉ. प्रिया शर्मा आपके बच्चे के करियर, सुरक्षा और उच्च शिक्षा के अवसरों पर सीधे आपसे बात करेंगी।'
                          : `Dr. Priya Sharma will directly clarify concerns regarding child's career and degree progression.`}
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
                    {language === 'hi' ? 'अभिभावक परामर्श केस' : 'Active Parent Counselling Cases'}
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
                        className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-300 transition space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Counsellor Header Info */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-lg flex items-center justify-center">
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

                            {/* Status */}
                            {rejectedReq ? (
                              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                {language === 'hi' ? 'अस्वीकृत' : 'Rejected'}
                              </span>
                            ) : pendingReq ? (
                              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                {language === 'hi' ? 'समीक्षाधीन (Pending)' : 'Pending'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {language === 'hi' ? 'सक्रिय (Active)' : 'Active'}
                              </span>
                            )}
                          </div>

                          {/* Concern Box */}
                          <div className="bg-slate-50 rounded-2xl p-3 space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400 font-bold">{language === 'hi' ? 'आपकी चिंता:' : 'Your Concern:'}</span>
                              <span className="font-extrabold text-slate-800">{c.primaryConcern || 'Job Security & Income'}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400 font-bold">{language === 'hi' ? 'बच्चे का ट्रेड:' : "Child's Trade:"}</span>
                              <span className="font-bold text-emerald-800">{c.activeTradeTitle || 'Vocational Trade'}</span>
                            </div>
                          </div>

                          {/* Latest reply preview */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                              {language === 'hi' ? 'काउंसलर का नवीनतम संदेश:' : 'LATEST REPLY:'}
                            </span>
                            <p className="text-xs text-slate-700 font-medium line-clamp-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                              {lastMsg ? (
                                <>
                                  <span className="font-bold text-emerald-900">
                                    {lastMsg.senderRole === 'counsellor' ? 'Counsellor: ' : 'You: '}
                                  </span>
                                  "{lastMsg.text}"
                                </>
                              ) : (
                                `Let's discuss the career pathway and available progression options.`
                              )}
                            </p>
                          </div>

                          {rejectedReq?.rejectionReason && (
                            <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 font-medium">
                              ⚠️ {language === 'hi' ? 'कारण:' : 'Reason:'} {rejectedReq.rejectionReason}
                            </div>
                          )}
                        </div>

                        {/* Button: Open Conversation */}
                        <button
                          onClick={() => handleOpenConversation(c.id)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-xs group"
                        >
                          <span>{language === 'hi' ? 'बातचीत खोलें (Open Conversation)' : 'Open Conversation'}</span>
                          <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition" />
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
                    {language === 'hi' ? 'फोन काउंसलिंग अपॉइंटमेंट्स' : 'Scheduled Phone Calls'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'hi' ? 'काउंसलर आपके फोन नंबर पर निर्धारित समय पर कॉल करेंगी' : 'Counsellor will call on scheduled time slot'}
                  </p>
                </div>
                <button
                  onClick={() => setIsScheduleCallModalOpen(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'hi' ? 'नया फोन कॉल शेड्यूल करें' : 'Schedule Call'}</span>
                </button>
              </div>

              {upcomingCalls.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                  <PhoneCall className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">
                    {language === 'hi' ? 'कोई आगामी कॉल शेड्यूल नहीं है' : 'No upcoming calls scheduled'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'hi'
                      ? 'यदि आप अपने बच्चे के करियर विकल्प को लेकर निश्चित नहीं हैं, तो 30 मिनट का फोन सत्र बुक करें।'
                      : 'Schedule a 30-minute family phone consultation with Dr. Priya Sharma.'}
                  </p>
                  <button
                    onClick={() => setIsScheduleCallModalOpen(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-5 py-2.5 rounded-xl transition"
                  >
                    {language === 'hi' ? 'फोन कॉल बुक करें' : 'Book a Call'}
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
                                {call.sessionType === 'joint_family' ? 'Family Joint Guidance' : 'Parent Consultation'}
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
                            <span className="font-bold text-slate-800">{language === 'hi' ? 'चिंता:' : 'Concern:'}</span> {call.callReason}
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
                    {language === 'hi' ? 'काउंसलर संदेश धागे' : 'Conversation Threads'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'hi' ? 'सरकारी काउंसलर से सुरक्षित 2-तरफा बातचीत' : 'Secure 2-way verified communication'}
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
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-lg flex items-center justify-center shrink-0">
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
                            {lastMsg ? lastMsg.text : 'Click to read and reply'}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {lastMsg ? lastMsg.timestamp : 'Recent'} • {c.primaryConcern || 'Guidance'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {conv.messages.some(m => m.senderRole === 'counsellor' && m.status !== 'read') && (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
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
                  {language === 'hi' ? 'पिछली चर्चाएं व काउंसलर रिपोर्ट' : 'Past Counselling Sessions & Notes'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'काउंसलर द्वारा प्रमाणित वेतन, सुरक्षा और डिग्री प्रगति संबंधी आधिकारिक सारांश'
                    : 'Verified summary and follow-up guidance by Dr. Priya Sharma'}
                </p>
              </div>

              {pastCalls.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">
                    {language === 'hi' ? 'अभी कोई समाप्त सत्र नहीं है' : 'No completed sessions yet'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'hi'
                      ? 'जैसे ही आपकी काउंसलिंग कॉल पूरी होगी, काउंसलर का लिखित सारांश और मार्गदर्शन यहाँ सुरक्षित रहेगा।'
                      : 'Completed session summaries and follow-ups will be permanently visible here.'}
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
                            {call.tradeTitle || 'Vocational Career Consultation'}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {DEMO_COUNSELLOR_PRIYA.name} • {call.scheduledDate} • {call.actualDurationSeconds ? Math.round(call.actualDurationSeconds / 60) : 30} mins
                          </p>
                        </div>
                      </div>

                      {call.counsellorNotesSummary && (
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
                          <span className="text-[10px] font-black uppercase text-emerald-900 block">
                            {language === 'hi' ? 'काउंसलर का आधिकारिक सारांश:' : 'COUNSELLOR SESSION SUMMARY:'}
                          </span>
                          <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            {call.counsellorNotesSummary}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span>{language === 'hi' ? 'परिवार को भेजा गया' : 'Shared with parent'}</span>
                        <button
                          onClick={() => handleOpenConversation(call.caseId || activeCase?.id || 'CASE-1042')}
                          className="text-emerald-700 font-bold hover:underline"
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

      {/* SCHEDULE CALL MODAL FOR PARENTS */}
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
                    {language === 'hi' ? 'अभिभावक फोन कॉल शेड्यूल करें' : 'Schedule Parent Consultation Call'}
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
                <label className="text-slate-600 block">{language === 'hi' ? 'आपकी मुख्य चिंता या प्रश्न:' : 'Main Doubt / Concern:'}</label>
                <textarea
                  value={callRequestReason}
                  onChange={e => setCallRequestReason(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-100 rounded-xl p-3 font-medium border border-transparent focus:border-emerald-500 focus:bg-white"
                  placeholder={language === 'hi' ? 'जैसे: नौकरी सुरक्षा और आगे डिग्री जारी रखने का रास्ता...' : 'e.g., Degree progression and salary security...'}
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
          currentUserRole="parent"
          currentUserName={parent.parentName || 'Parent'}
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
