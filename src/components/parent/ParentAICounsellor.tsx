import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Mic, MicOff, Volume2, Sparkles, ShieldCheck, HeartHandshake, RefreshCw, UserCheck, Bot } from 'lucide-react';
import { askHunarSetuAI, AIChatMessage } from '../../services/aiService';
import { ParentDetailedProfile } from '../../types/parent';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';

interface ParentAICounsellorProps {
  language: 'en' | 'hi';
  parent: ParentDetailedProfile;
  childTradeId?: string;
  onSpeak?: (text: string) => void;
  onOpenHumanCounsellorModal?: () => void;
}

export const ParentAICounsellor: React.FC<ParentAICounsellorProps> = ({
  language,
  parent,
  childTradeId,
  onSpeak,
  onOpenHumanCounsellorModal
}) => {
  const activeTrade = NSQF_VOCATIONAL_TRADES.find(t => t.id === (childTradeId || 'solar-technician')) || NSQF_VOCATIONAL_TRADES[0];

  const initialGreeting: AIChatMessage = {
    id: 'msg-init',
    sender: 'assistant',
    roleType: 'mediator',
    text: language === 'hi'
      ? `नमस्ते ${parent.parentName || 'अभिभावक'} जी! 🙏 मैं हुनरसेतु का एआई परिवार परामर्शदाता हूँ। आपके मन में अपने बच्चे के भविष्य, कमाई, नौकरी या सुरक्षा को लेकर जो भी शंका हो, मुझसे बेझिझक पूछें।`
      : `Namaste ${parent.parentName || 'Parent'} ji! 🙏 I am your HunarSetu Family Career Advisor. Feel free to ask any questions regarding your child's earning potential, job stability, or higher study pathways.`,
    timestamp: 'Just now',
    citations: {
      source: 'National Council for Vocational Education and Training (NCVET)',
      region: parent.district || 'India',
      confidence: 'Verified Government Dataset'
    }
  };

  const [messages, setMessages] = useState<AIChatMessage[]>([initialGreeting]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      qHi: 'क्या वोकेशनल कोर्स के बाद रेलवे या सरकारी नौकरी मिल सकती है?',
      qEn: 'Can my child get a Railway or Government Job after vocational training?'
    },
    {
      qHi: 'शुरुआती वेतन कितना होगा और 3 साल बाद कितनी कमाई होगी?',
      qEn: 'What will be the starting salary and income after 3 years?'
    },
    {
      qHi: 'क्या समाज और रिश्तेदारों में इस काम की इज्जत है?',
      qEn: 'What is the social prestige and respect of this career?'
    },
    {
      qHi: 'अगर आगे चलकर बी.टेक या डिग्री करनी हो तो क्या रास्ता है?',
      qEn: 'How can my child pursue a B.Tech or Degree later through lateral entry?'
    },
    {
      qHi: 'ट्रेनिंग में कितना खर्च आता है और क्या छात्रवृत्ति मिलती है?',
      qEn: 'What is the training cost and are government scholarships available?'
    },
    {
      qHi: `हमारे जिले (${parent.district}) में कौन-कौन से उद्योग और ITI हैं?`,
      qEn: `What industries and ITIs exist in our district (${parent.district})?`
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      roleType: 'parent',
      text,
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askHunarSetuAI(text, {
        language,
        userRole: 'parent',
        selectedTradeId: activeTrade.id,
        district: parent.district,
        parentConcern: parent.mainConcern
      });

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        roleType: 'mediator',
        text: response.text,
        timestamp: 'Just now',
        citations: response.citations
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        roleType: 'mediator',
        text: language === 'hi'
          ? 'माफ़ कीजिए, उत्तर प्राप्त करने में तकनीकी समस्या आई। कृपया पुनः प्रयास करें या सरकारी काउंसलर से बात करें।'
          : 'Unable to reach the advisory server. Please retry or connect with our human counsellor.',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(language === 'hi' ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' : 'Voice recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/25">
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            <span>{language === 'hi' ? 'अभिभावक एआई परामर्श' : 'PARENT AI ADVISOR'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'hi' ? 'आपके मन की हर बात का सरल समाधान' : 'Empathetic AI Guidance for Parents'}
          </h1>
          <p className="text-xs text-amber-100/90 max-w-xl font-medium">
            {language === 'hi'
              ? 'आसान हिन्दी में पूछिए—कमाई, सुरक्षा, डिग्री या सरकारी नौकरी। उत्तर आधिकारिक एनएसक्यूएफ साक्ष्यों पर आधारित होंगे।'
              : 'Ask freely in simple Hindi or English about salaries, degrees, or government job eligibility.'}
          </p>
        </div>

        <button
          onClick={onOpenHumanCounsellorModal}
          className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-2xl border border-white/20 transition shrink-0 shadow-sm"
        >
          {language === 'hi' ? '📞 सरकारी काउंसलर से बात करें' : '📞 Request Human Call'}
        </button>
      </div>

      {/* Quick Questions Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
          {language === 'hi' ? 'अभिभावकों के आम सवाल (क्लिक करें):' : 'Common Parent Questions (Tap to Ask):'}
        </span>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((qq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(language === 'hi' ? qq.qHi : qq.qEn)}
              disabled={isLoading}
              className="text-xs font-bold bg-white text-slate-800 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 px-3.5 py-2 rounded-2xl transition shadow-2xs text-left"
            >
              💬 {language === 'hi' ? qq.qHi : qq.qEn}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 text-xs shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-xs shadow-xs'
                      : 'bg-slate-50 text-slate-900 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Citations if assistant message */}
                  {!isUser && msg.citations && (
                    <div className="pt-2 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{msg.citations.source}</span>
                      </div>

                      {onSpeak && (
                        <button
                          onClick={() => onSpeak(msg.text)}
                          className="self-start sm:self-center text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 text-xs shadow-xs mt-1">
                    <UserCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs font-bold p-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>{language === 'hi' ? 'सलाहकार विचार कर रहा है...' : 'Advisor is analyzing verified records...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-3 rounded-2xl border transition ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title={language === 'hi' ? 'बोलकर पूछें' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={
              language === 'hi'
                ? 'अपना प्रश्न यहाँ लिखें (उदा. क्या सरकारी नौकरी मिल सकती है?)...'
                : 'Type your question here (e.g. Is this career safe and respected?)...'
            }
            className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 transition"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black p-3 rounded-2xl transition shadow-xs flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
