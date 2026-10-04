import React, { useState, useRef, useEffect } from 'react';
import { Send, PhoneCall, Check, CheckCheck, Clock, ShieldCheck, UserCheck, MessageSquare, Bot } from 'lucide-react';
import { CounsellingCase, CounsellingMessage } from '../../types/counsellor';

interface CounsellorChatViewProps {
  language: 'en' | 'hi';
  cases: CounsellingCase[];
  selectedCaseId?: string;
  messages: { [caseId: string]: CounsellingMessage[] };
  onSendMessage: (caseId: string, text: string) => void;
  onSelectCase: (caseId: string) => void;
  onStartCall: (caseId: string) => void;
}

export const CounsellorChatView: React.FC<CounsellorChatViewProps> = ({
  language,
  cases,
  selectedCaseId,
  messages,
  onSendMessage,
  onSelectCase,
  onStartCall
}) => {
  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const activeMessages = (activeCase && messages[activeCase.id]) || [];

  const [inputText, setInputText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    {
      label: 'एनईपी लेटरल एंट्री स्पष्टीकरण',
      labelEn: 'NEP Lateral Entry Explanation',
      text: 'राष्ट्रीय शिक्षा नीति 2020 के तहत आईटीआई उत्तीर्ण छात्रों को पॉलीटेक्निक के द्वितीय वर्ष (लेटरल एंट्री) में सीधा प्रवेश मिलता है। इससे 3 साल का डिप्लोमा 2 साल में पूरा होता है।'
    },
    {
      label: 'NAPS सवेतन अप्रेंटिसशिप',
      labelEn: 'NAPS Paid Apprenticeship',
      text: 'कोर्स पूरा होते ही केंद्र सरकार की NAPS योजना के तहत ₹8,000 - ₹12,000/माह का स्टाइपेंड मिलता है जिसमें 25% सरकार सीधे आपके बैंक खाते में DBT भेजती है।'
    },
    {
      label: 'पारिवारिक कॉल का निमंत्रण',
      labelEn: 'Invite to Family Call',
      text: 'आइए हम एक 20-मिनट का फोन सत्र निर्धारित करें जिसमें आप, आपके पिताजी और मैं साथ मिलकर सरकारी साक्ष्यों और वेतनमान की समीक्षा करेंगे।'
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeCase) return;
    onSendMessage(activeCase.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs h-[720px] flex flex-col md:flex-row animate-in fade-in">
      {/* Sidebar: Case Threads List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/70">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-sm font-black text-slate-900">
            {language === 'hi' ? 'सक्रिय संवाद (Family Threads)' : 'Family Conversations'}
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            {cases.length} {language === 'hi' ? 'केस उपलब्ध' : 'Active Threads'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {cases.map(c => {
            const isSelected = c.id === activeCase?.id;
            const threadMsgs = messages[c.id] || [];
            const lastMsg = threadMsgs[threadMsgs.length - 1];

            return (
              <button
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className={`w-full text-left p-4 transition flex items-start gap-3 ${
                  isSelected ? 'bg-sky-50/80 border-l-4 border-sky-600' : 'hover:bg-slate-100/70'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {c.studentName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 truncate">
                      {c.studentName}
                    </h3>
                    <span className="text-[9px] font-mono text-slate-400">{c.id}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold truncate">
                    {c.parentName ? `Parent: ${c.parentName}` : 'Student Only'}
                  </p>
                  <p className="text-[11px] text-slate-600 truncate font-medium">
                    {lastMsg ? lastMsg.text : c.studentGoalSummary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeCase ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">
                    {activeCase.studentName} {activeCase.parentName ? `& ${activeCase.parentName}` : ''}
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full">
                    {activeCase.primaryConcern}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  🎯 {activeCase.activeTradeTitle} • {activeCase.district}, {activeCase.state}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartCall(activeCase.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सत्र कॉल' : 'Live Call'}</span>
                </button>
              </div>
            </div>

            {/* AI Summary Banner if Consented */}
            <div className="bg-sky-50/60 border-b border-sky-100 px-4 py-2 flex items-center gap-2 text-[11px] text-sky-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>{language === 'hi' ? 'अधिकृत सारांश:' : 'User-Consented Summary:'}</strong> {activeCase.studentGoalSummary}
              </span>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
              {activeMessages.map(msg => {
                const isCounsellor = msg.senderRole === 'counsellor';
                const isParent = msg.senderRole === 'parent';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isCounsellor ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 font-bold">
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs leading-relaxed ${
                        isCounsellor
                          ? 'bg-sky-600 text-white font-medium rounded-tr-xs shadow-xs'
                          : isParent
                          ? 'bg-amber-100 text-amber-950 font-bold border border-amber-200 rounded-tl-xs'
                          : 'bg-white text-slate-900 font-medium border border-slate-200 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-80">
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3 h-3 text-emerald-300" />
                        ) : (
                          <Check className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Suggestions */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-[10px] font-bold text-slate-400 shrink-0">
                {language === 'hi' ? 'त्वरित उत्तर:' : 'Quick Snippets:'}
              </span>
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(qr.text)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg shrink-0 transition"
                >
                  ⚡ {language === 'hi' ? qr.label : qr.labelEn}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={language === 'hi' ? 'छात्र और परिवार को व्यावसायिक मार्गदर्शन लिखें...' : 'Type professional guidance for the family...'}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-black p-3 rounded-2xl transition shadow-xs flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a conversation thread to view.
          </div>
        )}
      </div>
    </div>
  );
};
