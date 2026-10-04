import React, { useState } from 'react';
import { TrendingUp, Award, Building2, Briefcase, GraduationCap, ChevronRight, CheckCircle, Volume2 } from 'lucide-react';
import { VocationalTrade } from '../../types/career';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { CAREER_ROADMAP_STAGES } from '../../data/roadmapData';
import { I18N } from '../../i18n/translations';

interface CareerRoadmapViewProps {
  language: 'en' | 'hi';
  onSpeak: (text: string) => void;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({ language, onSpeak }) => {
  const t = I18N[language];
  const [selectedTradeId, setSelectedTradeId] = useState<string>('solar-technician');

  const currentTrade = NSQF_VOCATIONAL_TRADES.find(t => t.id === selectedTradeId) || NSQF_VOCATIONAL_TRADES[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'दीर्घकालिक करियर विकास' : 'Long-Term NSQF Career Ladder'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'hi' ? 'मेरा बच्चा इस कोर्स के बाद क्या बन सकता है?' : 'What Can My Child Become After This?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {language === 'hi'
              ? 'यह कोई सीमित नौकरी नहीं है। 10वीं/12वीं से लेकर सरकारी सुपरवाइजर, पॉलीटेक्निक लेटरल डिग्री और स्वतंत्र कांट्रैक्टर तक का स्पष्ट नक्शा।'
              : 'Vocational education is not a dead end. See the exact progression from foundational certification to lateral diplomas, supervisory posts, and entrepreneurship.'}
          </p>
        </div>

        {/* Trade Selector */}
        <div className="shrink-0 bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'ट्रेड का रोडमैप चुनें:' : 'Select Trade Roadmap:'}
          </label>
          <select
            value={selectedTradeId}
            onChange={e => setSelectedTradeId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 text-white text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:border-amber-400"
          >
            {NSQF_VOCATIONAL_TRADES.map(tr => (
              <option key={tr.id} value={tr.id}>
                {language === 'hi' ? tr.titleHi : tr.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Visual Progression Ladder */}
      <div className="space-y-6">
        {CAREER_ROADMAP_STAGES.map((stage, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 transition p-6 shadow-sm relative overflow-hidden"
          >
            {/* Step Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base shadow-sm">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {language === 'hi' ? stage.stageHi : stage.stage}
                  </h3>
                  <span className="text-xs font-semibold text-amber-700">
                    {stage.qualification}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg self-start sm:self-center">
                {stage.stipend}
              </div>
            </div>

            {/* Stage Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                  {language === 'hi' ? 'प्रशिक्षण संस्थान / उद्योग' : 'Institution / Industry Workplace'}
                </span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{stage.institution}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                  {language === 'hi' ? 'सीखे जाने वाले मुख्य कौशल एवं भूमिका' : 'Core Capabilities & Deliverables'}
                </span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{stage.outcomes}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lateral Entry AICTE Gazette Proof Box */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
          <GraduationCap className="w-5 h-5 text-sky-700" />
          <span>
            {language === 'hi'
              ? 'आधिकारिक AICTE लेटरल एंट्री नियम (Lateral Entry to B.Tech/Diploma)'
              : 'Official AICTE Lateral Entry Framework'}
          </span>
        </div>
        <p className="text-xs text-sky-950 leading-relaxed font-medium">
          {language === 'hi'
            ? 'भारत सरकार के अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE) के दिशा-निर्देशों के अनुसार, 2 वर्षीय आईटीआई/NSQF उत्तीर्ण युवाओं को राज्य के सभी पॉलीटेक्निक कॉलेजों में 2nd वर्ष (सीधे तीसरे सेमेस्टर) में प्रवेश मिलता है। इसके पश्चात बी.टेक में भी द्वितीय वर्ष में डायरेक्ट प्रवेश का प्रावधान है। वोकेशनल चुनने से पढ़ाई रुकती नहीं, बल्कि अधिक मजबूत होती है।'
            : 'Per official AICTE Approval Process guidelines, ITI / NSQF certificate holders receive direct admission into the 2nd Year (3rd semester) of 3-Year Polytechnic Engineering Diplomas under the Lateral Entry supernumerary quota, completely debt-free.'}
        </p>
      </div>
    </div>
  );
};
