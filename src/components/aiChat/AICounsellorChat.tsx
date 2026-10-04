import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Mic, MicOff, Volume2, Sparkles, X, ShieldCheck, ChevronDown } from 'lucide-react';
import { AIChatMessage, askHunarSetuAI } from '../../services/aiService';
import { startSpeechRecognition, stopSpeaking } from '../../services/speechService';
import { I18N } from '../../i18n/translations';

interface AICounsellorChatProps {
  language: 'en' | 'hi';
  selectedTradeId?: string;
  district?: string;
  onSpeak: (text: string) => void;
}

export const AICounsellorChat: React.FC<AICounsellorChatProps> = ({
  language,
  selectedTradeId,
  district,
  onSpeak
}) => {
  const t = I18N[language];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: language === 'hi'
        ? 'नमस्ते! मैं हुनरसेतु एआई काउंसलर हूँ। विद्यार्थी और माता-पिता दोनों बिना किसी संकोच के मुझसे वेतन, सुरक्षा, उच्च शिक्षा (बी.टेक लैटरल एंट्री), या नौकरी के बारे में कोई भी प्रश्न पूछ सकते हैं।'
        : 'Namaste! I am your HunarSetu AI Career Counsellor. Both learners and parents can ask me any question regarding salary, safety, higher education (B.Tech lateral entry), or placement certainty.',
      timestamp: 'Just now',
      citations: {
        source: 'NCVET & Ministry of Skill Development (MSDE)',
        region: district || 'India',
        confidence: 'Verified Government Dataset'
      }
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

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
        userRole: 'joint_family',
        selectedTradeId,
        district
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
            ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। कृपया दोबारा प्रयास करें।'
            : 'Sorry, could not process request. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
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

  const quickPrompts = language === 'hi'
    ? [
        '3 साल बाद कितना वेतन मिल सकता है?',
        'क्या वोकेशनल के बाद बी.टेक या डिग्री संभव है?',
        'क्या यह काम शारीरिक रूप से सुरक्षित है?',
        'क्या समाज में इस काम की इज्जत होगी?'
      ]
    : [
        'What is the salary after 3 years?',
        'Can my child pursue B.Tech after ITI?',
        'Is this trade safe for women & youth?',
        'Will society respect this profession?'
      ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 font-extrabold px-4 py-3.5 rounded-full shadow-2xl transition transform hover:scale-105 border border-amber-400/40"
          >
            <MessageSquare className="w-5 h-5 text-slate-950" />
            <span className="text-xs sm:text-sm">
              {language === 'hi' ? 'एआई काउंसलर से पूछें' : 'Ask AI Counsellor'}
            </span>
          </button>
        )}
      </div>

      {/* Slide-out / Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[550px] bg-white rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  {language === 'hi' ? 'हुनरसेतु एआई काउंसलर' : 'HunarSetu AI Counsellor'}
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'hi' ? 'सत्यापित साक्ष्य आधारित' : 'Evidence-Grounded RAG'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex overflow-x-auto no-scrollbar gap-1.5 text-[11px]">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full font-medium transition"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map(m => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed font-medium ${
                      isUser
                        ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none'
                        : 'bg-slate-100 text-slate-900 border border-slate-200/80 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Source Attribution Note on factual answer */}
                    {!isUser && m.citations && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex items-center justify-between">
                        <span className="flex items-center gap-1 font-semibold text-emerald-800">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{m.citations.source}</span>
                        </span>
                        <button
                          onClick={() => onSpeak(m.text)}
                          className="text-slate-500 hover:text-amber-700"
                          title="Listen this answer"
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
                <span>{language === 'hi' ? 'सत्यापित साक्ष्य खोज रहे हैं...' : 'Retrieving verified skilling data...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={handleMicToggle}
              className={`p-2.5 rounded-xl border transition ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Voice Input (Hindi/English)"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={language === 'hi' ? 'वेतन, सुरक्षा, डिग्री या ट्रेड के बारे में पूछें...' : 'Ask about salary, degree, safety, or trade...'}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-400 rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
