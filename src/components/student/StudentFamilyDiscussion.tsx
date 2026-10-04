import React, { useState } from 'react';
import { Users, Share2, CheckCircle2, ShieldCheck, TrendingUp, PhoneCall, Copy, Sparkles, ArrowRight } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { PARENT_CONCERNS_MATRIX } from '../../data/parentConcerns';

interface StudentFamilyDiscussionProps {
  language: 'en' | 'hi';
  student: StudentProfile;
  tradeId?: string;
  onOpenCounsellorModal: () => void;
  onNavigateRoadmap: (tradeId: string) => void;
}

export const StudentFamilyDiscussion: React.FC<StudentFamilyDiscussionProps> = ({
  language,
  student,
  tradeId,
  onOpenCounsellorModal,
  onNavigateRoadmap
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeConcernKey, setActiveConcernKey] = useState<string>('income');

  const selectedTrade = NSQF_VOCATIONAL_TRADES.find(
    t => t.id === (tradeId || student.lastExploredTradeId || 'solar-technician')
  ) || NSQF_VOCATIONAL_TRADES[0];

  const parentConcern = PARENT_CONCERNS_MATRIX.find(c => c.concernKey === activeConcernKey) || PARENT_CONCERNS_MATRIX[0];

  const summaryText = language === 'hi'
    ? `पारिवारिक करियर सारांश (हुनरसेतु):
विद्यार्थी: ${student.name}
पसंदीदा ट्रेड: ${selectedTrade.titleHi} (NSQF Level ${selectedTrade.nsqfLevel})
ट्रेनिंग अवधि: ${selectedTrade.durationMonths} महीने
शुरुआती वेतन: ${selectedTrade.salary.entryLevel}
3 वर्ष बाद वेतन: ${selectedTrade.salary.midLevel3Yr}
उच्च शिक्षा: AICTE नियमानुसार पॉलीटेक्निक डिप्लोमा के 2nd ईयर में डायरेक्ट लेटरल एंट्री (B.Voc/B.Tech संभव)
डेटा स्रोत: NCVET & DGT आधिकारिक रिपोर्ट`
    : `Family Career Summary (HunarSetu):
Student: ${student.name}
Chosen Career: ${selectedTrade.title} (NSQF Level ${selectedTrade.nsqfLevel})
Duration: ${selectedTrade.durationMonths} Months
Starting Salary: ${selectedTrade.salary.entryLevel}
3-Year Experienced Salary: ${selectedTrade.salary.midLevel3Yr}
Higher Education: Guaranteed direct Lateral Entry into 2nd year Polytechnic Engineering Diploma (B.Voc/B.Tech open)
Source: NCVET & DGT Official Tracer Study`;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'परिवार के साथ संवाद' : 'Discuss with Family'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'परिवार को अपने करियर विकल्प के बारे में कैसे समझाएं?' : 'How to Discuss This Career with Your Family'}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'hi'
            ? 'माता-पिता की चिंताओं को बिना किसी बहस के आधिकारिक सरकारी साक्ष्यों और तथ्यों से शांत करें।'
            : 'Reassure your parents without conflict by sharing verified earnings, safety standards, and degree progression.'}
        </p>
      </div>

      {/* Target Trade vs Family Concern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: My Career Interest */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 space-y-3 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
            {language === 'hi' ? 'आपकी रुचि' : 'YOUR CAREER INTEREST'}
          </span>
          <h2 className="text-xl font-black text-slate-900">
            {language === 'hi' ? selectedTrade.titleHi : selectedTrade.title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {language === 'hi' ? selectedTrade.taglineHi : selectedTrade.tagline}
          </p>

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'hi' ? 'ट्रेनिंग अवधि:' : 'Training Duration:'}</span>
              <strong className="text-slate-900">{selectedTrade.durationMonths} {language === 'hi' ? 'महीने' : 'Months'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'hi' ? 'शुरुआती वेतन:' : 'Entry Salary:'}</span>
              <strong className="text-emerald-700">{selectedTrade.salary.entryLevel}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'hi' ? '3 वर्ष बाद:' : '3-Year Growth:'}</span>
              <strong className="text-slate-900">{selectedTrade.salary.midLevel3Yr}</strong>
            </div>
          </div>
        </div>

        {/* Right: Typical Family Concern Selector */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 space-y-3 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full inline-block">
            {language === 'hi' ? 'माता-पिता की संभावित चिंता' : 'FAMILY CONCERN TOPIC'}
          </span>
          <h3 className="text-sm font-bold text-slate-900">
            {language === 'hi' ? 'आपके परिवार की सबसे बड़ी चिंता क्या है?' : 'Select what your family worries about:'}
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {[
              { id: 'income', label: 'Earning / Salary', labelHi: 'वेतन व कमाई' },
              { id: 'job_security', label: 'Job Security', labelHi: 'नौकरी की गारंटी' },
              { id: 'social_status', label: 'Social Prestige', labelHi: 'सामाजिक प्रतिष्ठा' },
              { id: 'further_study', label: 'Degree / B.Tech', labelHi: 'उच्च शिक्षा व डिग्री' }
            ].map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveConcernKey(c.id)}
                className={`p-2 rounded-xl border transition ${
                  activeConcernKey === c.id
                    ? 'bg-sky-500 text-white border-sky-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {language === 'hi' ? c.labelHi : c.label}
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
            <strong>{language === 'hi' ? 'साक्ष्य आधारित उत्तर:' : 'Evidence Point:'} </strong>
            {language === 'hi' ? parentConcern.shortSummaryHi : parentConcern.shortSummary}
          </div>
        </div>
      </div>

      {/* Dinner Table Discussion Topics */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-base font-black text-slate-900">
          {language === 'hi' ? 'परिवार के साथ चर्चा के 4 मुख्य बिंदु (Questions to Discuss)' : '4 Structured Discussion Questions for Family'}
        </h3>
        <p className="text-xs text-slate-500">
          {language === 'hi'
            ? 'घर पर शांत माहौल में माता-पिता के साथ इन बिंदुओं पर बात करें:'
            : 'Discuss these objective points calmly with parents at home:'}
        </p>

        <div className="space-y-2.5 text-xs text-slate-800 font-medium">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>
              {language === 'hi'
                ? `1. "पिताजी, ${selectedTrade.titleHi} में 6-12 महीने की ट्रेनिंग और सवेतन अप्रेंटिसशिप के बाद ${selectedTrade.salary.entryLevel} से कमाई शुरू हो जाएगी, जिससे पढ़ाई का खर्च नहीं बढ़ेगा।" `
                : `1. "Parent, this ${selectedTrade.title} course starts with a paid apprenticeship and initial wage of ${selectedTrade.salary.entryLevel} within ${selectedTrade.durationMonths} months, avoiding college debt."`}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>
              {language === 'hi'
                ? '2. "AICTE नियमानुसार इसके बाद पॉलीटेक्निक के 2nd ईयर में डायरेक्ट लैटरल एंट्री से बी.टेक की डिग्री लेने का रास्ता खुला रहता है।"'
                : '2. "Under AICTE regulations, direct Lateral Entry into the 2nd year of Polytechnic engineering diplomas keeps B.Tech degree doors wide open."'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>
              {language === 'hi'
                ? `3. "क्या हम दोनों मिलकर ${student.district} के नजदीकी सरकारी आईटीआई जाकर वहां की आधुनिक वर्कशॉप प्रत्यक्ष देख सकते हैं?"`
                : `3. "Can we both visit the nearest Government ITI or PMKVY center in ${student.district} together to see the lab facilities firsthand?"`}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>
              {language === 'hi'
                ? '4. "अगर आपके मन में कोई भी संशय है, तो क्या हम हुनरसेतु के सरकारी प्रमाणित काउंसलर से फोन पर मुफ्त परामर्श ले सकते हैं?"'
                : '4. "If any doubt remains, can we schedule a 15-minute phone conference with a certified government vocational counsellor?"'}
            </span>
          </div>
        </div>
      </div>

      {/* Shareable Family Career Summary Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full inline-block">
              {language === 'hi' ? 'शेयर करने योग्य सारांश' : 'FAMILY CAREER SUMMARY'}
            </span>
            <h3 className="text-lg font-bold">
              {language === 'hi' ? 'माता-पिता के साथ व्हाट्सएप पर शेयर करें' : 'Share Career Summary with Parents'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'आधिकारिक डेटा, वेतनमान और डिग्री लैटरल एंट्री का संक्षिप्त विवरण तुरंत कॉपी करें।'
                : 'Copy an objective summary of earnings, eligibility, and degree pathways.'}
            </p>
          </div>

          <button
            onClick={handleCopySummary}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition shrink-0"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
            <span>{copied ? (language === 'hi' ? 'कॉपी हो गया! ✓' : 'Copied! ✓') : (language === 'hi' ? 'कॉपी करें (Share Summary)' : 'Copy to Share')}</span>
          </button>
        </div>

        <pre className="bg-slate-950/70 p-4 rounded-2xl text-[11px] font-mono text-slate-300 whitespace-pre-wrap border border-slate-800">
          {summaryText}
        </pre>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            {language === 'hi' ? 'परिवार अभी भी असहमत है?' : 'Family still hesitant?'}
          </span>
          <button
            onClick={onOpenCounsellorModal}
            className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? 'काउंसलर से मुफ्त कॉल बुक करें' : 'Request Counsellor Mediation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
