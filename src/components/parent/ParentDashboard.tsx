import React from 'react';
import { ArrowRight, HeartHandshake, ShieldCheck, TrendingUp, Users, MessageSquare, Scale, PhoneCall, CheckCircle2, ChevronRight, Award, Building2, HelpCircle } from 'lucide-react';
import { ParentDetailedProfile } from '../../types/parent';
import { VocationalTrade } from '../../types/career';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { PARENT_CONCERNS_MATRIX } from '../../data/parentConcerns';

interface ParentDashboardProps {
  language: 'en' | 'hi';
  parent: ParentDetailedProfile;
  childTrade?: VocationalTrade;
  onNavigate: (tab: string, tradeId?: string) => void;
  onConnectChild: () => void;
  onSpeak?: (text: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  language,
  parent,
  childTrade,
  onNavigate,
  onConnectChild,
  onSpeak
}) => {
  // Use child's trade if connected, or default to Solar Technician
  const activeTrade = childTrade || NSQF_VOCATIONAL_TRADES[0];

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? `नमस्ते, ${parent.parentName} जी 👋` : `Hi, ${parent.parentName} 👋`}
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            {language === 'hi'
              ? `आइए ${parent.childName || 'अपने बच्चे'} की करियर यात्रा और संभावनाओं को समझते हैं।`
              : `Let's understand ${parent.childName ? `${parent.childName}'s` : "your child's"} career journey together.`}
          </p>
        </div>

        {/* Child Link Status Badge */}
        <div className="shrink-0">
          {parent.childConnected ? (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? `${parent.childName} से जुड़ा हुआ ✓` : `Linked with ${parent.childName} ✓`}</span>
            </span>
          ) : (
            <button
              onClick={onConnectChild}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-300 transition flex items-center gap-1.5"
            >
              <span>{language === 'hi' ? '+ बच्चे की प्रोफ़ाइल लिंक करें' : '+ Link Child Profile'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1 — YOUR CHILD'S INTEREST */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 rounded-3xl p-6 sm:p-7 shadow-lg shadow-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1 max-w-lg">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 bg-white/40 px-2.5 py-0.5 rounded-full inline-block">
            {language === 'hi' ? 'बच्चे की वर्तमान पसंद' : "YOUR CHILD'S CURRENT INTEREST"}
          </span>
          <h2 className="text-xl sm:text-2xl font-black leading-snug">
            {language === 'hi' ? activeTrade.titleHi : activeTrade.title}
          </h2>
          <p className="text-xs text-slate-900/80 font-medium">
            {language === 'hi'
              ? `${parent.childName || 'आपका बच्चा'} इस तकनीकी ट्रेड में रुचि ले रहा है। 6 माह ट्रेनिंग और सवेतन अप्रेंटिसशिप के बाद ${activeTrade.salary.entryLevel} से शुरुआत।`
              : `Your child is exploring this trade. Offers immediate NAPS paid apprenticeship with entry wages of ${activeTrade.salary.entryLevel}.`}
          </p>
        </div>

        <button
          onClick={() => onNavigate('career-detail', activeTrade.id)}
          className="bg-slate-950 hover:bg-slate-900 text-white font-black px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow transition transform hover:scale-105 shrink-0"
        >
          <span>{language === 'hi' ? 'करियर विवरण देखें' : 'View Career'}</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* SECTION 2 — YOUR CONCERNS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {language === 'hi' ? 'अभिभावक की प्राथमिकताएं' : 'YOUR RECORDED CONCERNS'}
            </span>
            <h3 className="text-base font-black text-slate-900">
              {language === 'hi' ? 'आपके द्वारा चुनी गई मुख्य चिंताएं' : 'Key Questions You Want Answered'}
            </h3>
          </div>

          <button
            onClick={() => onNavigate('concerns')}
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            <span>{language === 'hi' ? 'विस्तार से देखें' : 'Explore Concerns'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {parent.topPriorities.map((pr, idx) => (
            <span
              key={idx}
              className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200"
            >
              ✓ {pr}
            </span>
          ))}
        </div>

        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 leading-relaxed font-medium">
          <strong>{language === 'hi' ? 'आपकी मुख्य चिंता:' : 'Your Primary Concern:'} </strong>
          {parent.mainConcern}
        </div>
      </div>

      {/* SECTION 3 — UNDERSTAND THE CAREER (4 Simple Cards for Parents) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          {language === 'hi' ? 'इस ट्रेड को सरल भाषा में समझें' : 'UNDERSTAND THE CAREER (AT A GLANCE)'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{language === 'hi' ? '1. यह काम क्या है?' : 'What is this career?'}</span>
            <p className="font-bold text-slate-800 leading-snug">
              {language === 'hi' ? 'सोलर रूफटॉप पैनल, इन्वर्टर और बैटरी सिस्टम को इंस्टॉल, टेस्ट और मेंटेन करना।' : 'Installing, connecting, and maintaining rooftop solar panels and inverters.'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{language === 'hi' ? '2. नौकरी कहाँ मिलेगी?' : 'Where can they work?'}</span>
            <p className="font-bold text-slate-800 leading-snug">
              {language === 'hi' ? `${parent.district} के स्थानीय सोलर वेंडर्स, डिस्कॉम व सरकारी सोलर रूफटॉप प्रोजेक्ट्स में।` : `Solar installation companies, EPC firms, and authorized agencies in ${parent.district}.`}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{language === 'hi' ? '3. आगे तरक्की कैसे होगी?' : 'How does the career grow?'}</span>
            <p className="font-bold text-slate-800 leading-snug">
              {language === 'hi' ? 'साइट सुपरवाइजर (3 वर्ष) → पॉलीटेक्निक लैटरल डिप्लोमा → क्लास-A लाइसेंसी कांट्रैक्टर।' : 'Technician → Senior Site Supervisor (3 Yrs) → Polytechnic Diploma → Contractor.'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{language === 'hi' ? '4. ट्रेनिंग में क्या लगेगा?' : 'What training is needed?'}</span>
            <p className="font-bold text-slate-800 leading-snug">
              {language === 'hi' ? '6 महीने (सरकारी आईटीआई में मात्र ₹2,400 फीस, PMKVY में पूर्णतः मुफ्त)।' : '6 Months Certificate (Govt ITI fee ~₹2,400, or 100% Free under PMKVY).'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4 — FAMILY DISCUSSION (Signature Feature) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1 max-w-lg">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full inline-block">
            {language === 'hi' ? 'साझा पारिवारिक निर्णय' : 'GUIDED FAMILY DISCUSSION'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'hi' ? 'अपने बच्चे के साथ शांत माहौल में चर्चा करें' : 'Have a Guided Conversation with Your Child'}
          </h2>
          <p className="text-xs text-slate-300">
            {language === 'hi'
              ? 'बिना किसी बहस के बच्चे की पसंद और आपकी चिंताओं को एक ही मेज पर रखकर तुलना करें।'
              : 'Compare the options side-by-side without conflict using verified facts.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('family-room')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow transition shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>{language === 'hi' ? 'पारिवारिक सत्र शुरू करें' : 'Start Family Discussion'}</span>
        </button>
      </div>

      {/* SECTION 5 — QUICK ACTIONS (4 Clear Buttons) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          {language === 'hi' ? 'त्वरित विकल्प' : 'QUICK ACTIONS'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('ai')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 text-left transition hover:shadow-xs group space-y-1"
          >
            <MessageSquare className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition" />
            <h4 className="font-extrabold text-xs text-slate-900">
              {language === 'hi' ? 'एआई से पूछें' : 'Ask AI'}
            </h4>
            <p className="text-[10px] text-slate-500 line-clamp-1">Parent counselling</p>
          </button>

          <button
            onClick={() => onNavigate('compare')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 text-left transition hover:shadow-xs group space-y-1"
          >
            <Scale className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition" />
            <h4 className="font-extrabold text-xs text-slate-900">
              {language === 'hi' ? 'ट्रेड्स की तुलना' : 'Compare Careers'}
            </h4>
            <p className="text-[10px] text-slate-500 line-clamp-1">Side-by-side</p>
          </button>

          <button
            onClick={() => onNavigate('roadmap')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 text-left transition hover:shadow-xs group space-y-1"
          >
            <TrendingUp className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition" />
            <h4 className="font-extrabold text-xs text-slate-900">
              {language === 'hi' ? 'करियर रोडमैप' : 'Career Roadmap'}
            </h4>
            <p className="text-[10px] text-slate-500 line-clamp-1">Step-by-step growth</p>
          </button>

          <button
            onClick={() => onNavigate('counsellor')}
            className="p-4 bg-purple-50/60 hover:bg-purple-100/60 rounded-2xl border border-purple-200 hover:border-purple-400 text-left transition hover:shadow-xs group space-y-1 relative"
          >
            <div className="flex items-center justify-between">
              <PhoneCall className="w-5 h-5 text-purple-600 mb-1 group-hover:scale-110 transition" />
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 bg-purple-200/70 px-1.5 py-0.5 rounded-md">
                {language === 'hi' ? 'काउंसलिंग हब' : 'Counselling'}
              </span>
            </div>
            <h4 className="font-extrabold text-xs text-slate-900">
              {language === 'hi' ? 'मेरी काउंसलिंग' : 'My Counselling'}
            </h4>
            <p className="text-[10px] text-purple-700 font-semibold line-clamp-1">
              {language === 'hi' ? 'संदेश, कॉल व परामर्श' : 'Chat & scheduled calls'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
