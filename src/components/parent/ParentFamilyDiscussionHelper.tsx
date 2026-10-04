import React, { useState } from 'react';
import { HeartHandshake, MessageSquare, CheckCircle2, AlertTriangle, Users, Sparkles, Volume2, Printer, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { ParentDetailedProfile } from '../../types/parent';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';

interface ParentFamilyDiscussionHelperProps {
  language: 'en' | 'hi';
  parent: ParentDetailedProfile;
  childTradeId?: string;
  onSpeak?: (text: string) => void;
  onOpenJointSession?: () => void;
  onOpenCounsellorModal?: () => void;
}

export const ParentFamilyDiscussionHelper: React.FC<ParentFamilyDiscussionHelperProps> = ({
  language,
  parent,
  childTradeId,
  onSpeak,
  onOpenJointSession,
  onOpenCounsellorModal
}) => {
  const activeTrade = NSQF_VOCATIONAL_TRADES.find(t => t.id === (childTradeId || 'solar-technician')) || NSQF_VOCATIONAL_TRADES[0];

  const conversationStarters = [
    {
      id: 'q1',
      title: 'बच्चे की रुचि जानने के लिए (To understand child’s true interest)',
      titleEn: 'To Understand Their True Interest',
      prompt: `"${parent.childName || 'बेटा/बेटी'}, मैंने देखा कि तुम ${language === 'hi' ? activeTrade.titleHi : activeTrade.title} के बारे में पढ़ रहे थे। इस काम में तुम्हें सबसे रोमांचक क्या लगा?"`,
      promptEn: `"I noticed you were looking into ${activeTrade.title}. What parts of this work do you find genuinely exciting?"`,
      why: 'यह सवाल बच्चे को अपनी पसंद खुलकर बताने का मौका देता है, न कि बचाव की मुद्रा में आने का।'
    },
    {
      id: 'q2',
      title: 'प्रैक्टिकल बनाम किताबी पढ़ाई पर चर्चा (Hands-on vs Rote Learning)',
      titleEn: 'Hands-on vs Academic Preference',
      prompt: '"क्या तुम्हें दिनभर क्लास में बैठकर किताबें पढ़ने में मजा आता है या खुद अपने हाथों से कोई चीज बनाकर या रिपेयर करके देखना ज्यादा पसंद है?"',
      promptEn: '"Do you prefer sitting in lecture halls memorizing theory, or do you feel happier when building, wiring, or fixing real equipment?"',
      why: 'इससे पता चलता है कि बच्चे का दिमाग थ्योरी के लिए बना है या प्रैक्टिकल हुनर के लिए।'
    },
    {
      id: 'q3',
      title: 'अपनी चिंता को प्यार से साझा करने के लिए (Sharing parent concern gently)',
      titleEn: 'Expressing Parental Care Gently',
      prompt: '"एक माता-पिता के तौर पर मुझे तुम्हारी कमाई, भविष्य की सुरक्षा और समाज में सम्मान की फिक्र है। क्या हम मिलकर देखें कि इस ट्रेड में 3 साल बाद कितनी कमाई और तरक्की होती है?"',
      promptEn: '"As a parent, I only want you to be financially secure, respected, and safe. Can we look at the official 3-year salary progression together?"',
      why: 'बच्चा समझता है कि माता-पिता उसके दुश्मन नहीं, बल्कि उसके सुरक्षित भविष्य के शुभचिंतक हैं।'
    },
    {
      id: 'q4',
      title: 'डिग्री के बैकअप पर सहमति बनाना (Securing the Degree Backup)',
      titleEn: 'Agreeing on Higher Education Backup',
      prompt: '"अगर तुम इस वोकेशनल ट्रेड से शुरुआत करो, तो क्या तुम साथ में लेटरल एंट्री से पॉलीटेक्निक डिप्लोमा या बी.टेक की डिग्री भी पूरी करने को तैयार हो?"',
      promptEn: '"If we support your vocational training now, will you commit to using lateral entry to complete your Polytechnic Diploma or B.Tech degree later?"',
      why: 'दोनों पक्षों की जीत होती है: बच्चे को मनपसंद हुनर मिलता है और माता-पिता को डिग्री का भरोसा।'
    }
  ];

  const dosAndDonts = [
    {
      type: 'do',
      text: 'बच्चे की बात को बिना बीच में काटे कम से कम 5 मिनट तक शांति से सुनें।',
      textEn: 'Listen to your child patiently for at least 5 minutes without interrupting or judging.'
    },
    {
      type: 'dont',
      text: 'शर्मा जी या किसी रिश्तेदार के बेटे/बेटी से तुलना कभी न करें ("देख उसका लड़का बैंक में है")।',
      textEn: 'Never compare them with relatives or neighbors ("Look at their child who cleared a banking exam").'
    },
    {
      type: 'do',
      text: 'तकनीकी काम को "छोटा काम" न कहें। आज के डिजिटल दौर में तकनीशियन इंजीनियर जितना कमाते हैं।',
      textEn: 'Never call technical trades "small work". Certified technicians today earn as much as engineers.'
    },
    {
      type: 'dont',
      text: 'गुस्से या धमकी में बात न करें ("अगर यह किया तो मैं फीस नहीं दूंगा")।',
      textEn: 'Avoid financial ultimatums or threats ("If you do this course, I will not support you").'
    },
    {
      type: 'do',
      text: 'सरकारी डेटा और वेतन सीढ़ी को कंप्यूटर या फोन पर दोनों साथ बैठकर देखें।',
      textEn: 'Sit together in front of the screen and examine the salary growth ladder side-by-side.'
    },
    {
      type: 'do',
      text: 'यदि राय अलग हो, तो किसी तीसरे तटस्थ सरकारी काउंसलर की सलाह लेने पर सहमत हों।',
      textEn: 'When disagreement persists, mutually agree to schedule a free call with a certified counsellor.'
    }
  ];

  const [agreementChecked, setAgreementChecked] = useState<{ [key: string]: boolean }>({
    listen: true,
    naps: true,
    study: true
  });

  const toggleCheck = (key: string) => {
    setAgreementChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrintAgreement = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30 inline-block">
              {language === 'hi' ? 'पारिवारिक संवाद सहायक' : 'FAMILY DIALOGUE FACILITATOR'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {language === 'hi'
                ? `अपने बच्चे ${parent.childName ? `(${parent.childName})` : ''} के साथ बिना बहस किए चर्चा कैसे करें?`
                : `How to Discuss Careers with Your Child Without Conflict`}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
              {language === 'hi'
                ? 'करियर का फैसला जोर-जबरदस्ती से नहीं, बल्कि आपसी समझ और प्यार से लिया जाता है। नीचे दिए गए तरीकों से बातचीत शुरू करें।'
                : 'Constructive career choices require mutual respect. Use these empathetic conversation prompts to bridge the gap.'}
            </p>
          </div>

          <button
            onClick={() => onSpeak && onSpeak(language === 'hi' ? 'परिवार में करियर पर चर्चा करते समय बच्चे की बात को बिना टोके सुनें और किसी दूसरे बच्चे से कभी तुलना न करें। सरकारी साक्ष्यों को साथ बैठकर देखें।' : 'When discussing careers with your child, listen without interrupting and avoid comparisons with relatives. Review verified evidence together.')}
            className="self-start sm:self-center bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-2xl border border-white/20 transition flex items-center gap-2 shrink-0"
          >
            <Volume2 className="w-4 h-4 text-emerald-300" />
            <span>{language === 'hi' ? 'सलाह सुनें' : 'Listen Advice'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 4 CONVERSATION STARTER CARDS */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            {language === 'hi' ? 'चरण 1: बातचीत कैसे शुरू करें?' : 'PHASE 1: HOW TO OPEN THE TALK'}
          </span>
          <h2 className="text-xl font-black text-slate-900">
            {language === 'hi' ? '4 आत्मीय वाक्य जो बातचीत को आसान बना देंगे' : '4 Empathetic Conversation Starters'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conversationStarters.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs hover:border-emerald-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {language === 'hi' ? item.title : item.titleEn}
                </span>
                <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs sm:text-sm font-bold text-slate-900 leading-relaxed italic">
                {language === 'hi' ? item.prompt : item.promptEn}
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                💡 <strong className="text-slate-700">{language === 'hi' ? 'फायदा:' : 'Why it works:'}</strong> {item.why}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: DO's AND DONT's */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            {language === 'hi' ? 'मार्गदर्शन नियम' : 'COMMUNICATION PROTOCOL'}
          </span>
          <h3 className="text-lg font-black text-slate-900">
            {language === 'hi' ? 'क्या करें और क्या न करें (Do’s and Don’ts)' : 'Golden Rules for Parents'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dosAndDonts.map((rule, idx) => {
            const isDo = rule.type === 'do';
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  isDo
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/60 border-rose-200 text-rose-950'
                }`}
              >
                {isDo ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${
                    isDo ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {isDo ? (language === 'hi' ? '✓ जरूर करें' : '✓ DO') : (language === 'hi' ? '✗ कभी न करें' : '✗ AVOID')}
                  </span>
                  <p className="text-xs font-bold leading-snug mt-0.5">
                    {language === 'hi' ? rule.text : rule.textEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: MUTUAL FAMILY COMMITMENT SHEET */}
      <div className="bg-amber-50/60 rounded-3xl border-2 border-amber-300 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full inline-block">
              {language === 'hi' ? 'पारिवारिक समझौता प्रपत्र' : 'JOINT FAMILY AGREEMENT'}
            </span>
            <h3 className="text-lg font-black text-slate-900">
              {language === 'hi' ? 'हमारा साझा पारिवारिक संकल्प (Family Charter)' : 'Mutual Family Understanding'}
            </h3>
          </div>

          <button
            onClick={handlePrintAgreement}
            className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl border border-amber-300 transition flex items-center gap-1.5 self-start sm:self-center shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{language === 'hi' ? 'प्रिंट / सेव करें' : 'Print Agreement'}</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <label
            onClick={() => toggleCheck('listen')}
            className="p-3.5 bg-white rounded-2xl border border-amber-200/80 flex items-start gap-3 cursor-pointer hover:bg-amber-50/40 transition select-none"
          >
            <input
              type="checkbox"
              checked={agreementChecked.listen}
              onChange={() => {}}
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <div>
              <strong className="text-slate-900 font-bold block">
                {language === 'hi' ? '1. बिना दबाव के रुचि का सम्मान' : '1. Respect for Natural Aptitude'}
              </strong>
              <p className="text-slate-600 text-[11px] mt-0.5">
                {language === 'hi'
                  ? `हम ${parent.childName || 'बच्चे'} को उस तकनीकी क्षेत्र में मौका देंगे जिसमें उसका मन लगता है, न कि दूसरों के दबाव में कोई डिग्री थोपेंगे।`
                  : `We agree to honor the student's hands-on strengths rather than forcing an academic degree under social pressure.`}
              </p>
            </div>
          </label>

          <label
            onClick={() => toggleCheck('naps')}
            className="p-3.5 bg-white rounded-2xl border border-amber-200/80 flex items-start gap-3 cursor-pointer hover:bg-amber-50/40 transition select-none"
          >
            <input
              type="checkbox"
              checked={agreementChecked.naps}
              onChange={() => {}}
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <div>
              <strong className="text-slate-900 font-bold block">
                {language === 'hi' ? '2. सवेतन अप्रेंटिसशिप व आर्थिक अनुशासन' : '2. Apprenticeship & Savings Discipline'}
              </strong>
              <p className="text-slate-600 text-[11px] mt-0.5">
                {language === 'hi'
                  ? 'ट्रेनिंग के साथ मिलने वाले स्टाइपेंड का 50% बैंक में सुरक्षित रखा जाएगा ताकि भविष्य की पढ़ाई या टूल-किट के काम आए।'
                  : 'At least 50% of the initial NAPS stipend will be prudently saved towards subsequent educational milestones.'}
              </p>
            </div>
          </label>

          <label
            onClick={() => toggleCheck('study')}
            className="p-3.5 bg-white rounded-2xl border border-amber-200/80 flex items-start gap-3 cursor-pointer hover:bg-amber-50/40 transition select-none"
          >
            <input
              type="checkbox"
              checked={agreementChecked.study}
              onChange={() => {}}
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <div>
              <strong className="text-slate-900 font-bold block">
                {language === 'hi' ? '3. आगे की डिग्री / बी.टेक का लक्ष्य' : '3. Progressive Degree Commitment'}
              </strong>
              <p className="text-slate-600 text-[11px] mt-0.5">
                {language === 'hi'
                  ? 'तकनीशियन काम के 2 वर्ष बाद छात्र लेटरल एंट्री से पॉलीटेक्निक या शाम की बैच में बी.वॉक डिग्री अवश्य पूरी करेगा।'
                  : 'Student commits to utilizing NEP credit transfer to pursue a Polytechnic Diploma or B.Tech degree after 2 years of work.'}
              </p>
            </div>
          </label>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-200">
          <div className="text-[11px] text-amber-900 font-bold">
            ✍️ {parent.parentName || 'अभिभावक'} & {parent.childName || 'विद्यार्थी'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenJointSession}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Users className="w-4 h-4" />
              <span>{language === 'hi' ? 'लाइव पारिवारिक सत्र खोलें' : 'Open Joint Session'}</span>
            </button>
            <button
              onClick={onOpenCounsellorModal}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              {language === 'hi' ? 'काउंसलर मध्यस्थता' : 'Mediation Call'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
