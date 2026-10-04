import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Mic, MicOff, Volume2, Sparkles, ShieldCheck, User } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { AIChatMessage, askHunarSetuAI } from '../../services/aiService';
import { startSpeechRecognition, stopSpeaking } from '../../services/speechService';

interface StudentAICounsellorProps {
  language: 'en' | 'hi';
  student: StudentProfile;
  onSpeak: (text: string) => void;
  onOpenCounsellorModal?: () => void;
  onNavigateCounsellor?: () => void;
}

export const StudentAICounsellor: React.FC<StudentAICounsellorProps> = ({
  language,
  student,
  onSpeak,
  onOpenCounsellorModal,
  onNavigateCounsellor
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: language === 'hi'
        ? `नमस्ते ${student.name}! मैं आपका व्यक्तिगत हुनरसेतु एआई काउंसलर हूँ। आप मुझसे अपने करियर, वेतन, कोर्स अवधि, या परिवार को समझाने के तरीकों के बारे में कोई भी प्रश्न पूछ सकते हैं।`
        : `Hi ${student.name}! I am your personal HunarSetu AI Career Counsellor. Ask me anything about career matches, salaries, course duration, or how to explain your choices to family.`,
      timestamp: 'Just now',
      citations: {
        source: 'NCVET & Ministry of Skill Development (MSDE)',
        region: student.district || 'India',
        confidence: 'Verified Government Dataset'
      }
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestedQuestions = language === 'hi'
    ? [
        'मेरे लिए कौन सा करियर सबसे अनुकूल है?',
        'क्या मैं 10वीं के बाद सोलर तकनीशियन बन सकता हूँ?',
        'आईटीआई के बाद उच्च शिक्षा (बी.टेक) का रास्ता क्या है?',
        'माता-पिता को इस ट्रेड के बारे में कैसे समझाऊं?',
        'क्या इस करियर में शारीरिक सुरक्षा के मानक मौजूद हैं?'
      ]
    : [
        'Which career matches my profile best?',
        'Can I study B.Tech or Diploma after ITI?',
        'What is the starting salary in my district?',
        'How can I discuss this career with my parents?',
        'Is this work physically safe and respected?'
      ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: AIChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askHunarSetuAI(textToSend, {
        language,
        userRole: 'learner',
        selectedTradeId: student.lastExploredTradeId || 'solar-technician',
        district: student.district
      });

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: 'Just now',
        citations: response.citations
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: language === 'hi'
            ? 'सत्यापित डेटाबेस से उत्तर प्राप्त करने में समस्या हुई। कृपया दोबारा प्रयास करें।'
            : 'Could not connect to verified service. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
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
          setInput(transcript);
          setIsRecording(false);
          handleSend(transcript);
        },
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false)
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-6 animate-in fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'एआई करियर काउंसलर' : 'AI Career Counsellor'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? `व्यक्तिगत मार्गदर्शन: ${student.name} • शिक्षा: ${student.education || 'Class 10'} • जिला: ${student.district}`
              : `Personalized Guidance for ${student.name} • Education: ${student.education || 'Class 10'} • Location: ${student.district}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0 self-start sm:self-center">
          {onNavigateCounsellor && (
            <button
              onClick={onNavigateCounsellor}
              className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xs transition flex items-center gap-2"
            >
              <span>💬 {language === 'hi' ? 'मेरी काउंसलिंग (Messages)' : 'My Counselling'}</span>
            </button>
          )}

          {onOpenCounsellorModal && (
            <button
              onClick={onOpenCounsellorModal}
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xs transition flex items-center gap-2"
            >
              <span>📞 {language === 'hi' ? 'प्रमाणित काउंसलर से बात करें' : 'Talk to Certified Counsellor'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          {language === 'hi' ? 'सुझाए गए प्रश्न (टैप करें):' : 'Suggested Questions (Tap to ask):'}
        </span>
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 text-xs">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap bg-white hover:bg-slate-100 text-slate-800 font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {messages.map(m => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-3xl leading-relaxed font-medium ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-bold rounded-br-none shadow-xs'
                      : 'bg-slate-50 text-slate-900 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs sm:text-sm">{m.text}</p>

                  {!isUser && m.citations && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1 font-bold text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{m.citations.source}</span>
                      </span>
                      <button
                        onClick={() => onSpeak(m.text)}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="Listen answer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>{language === 'hi' ? 'सत्यापित साक्ष्य खोज रहे हैं...' : 'Consulting verified career database...'}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={handleMicToggle}
            className={`p-3 rounded-2xl border transition ${
              isRecording
                ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Voice input"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={language === 'hi' ? 'कोई भी प्रश्न पूछें (वेतन, योग्यता, बी.टेक लेटरल एंट्री)...' : 'Ask any question about careers, salary, eligibility, degrees...'}
            className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-400 rounded-2xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
