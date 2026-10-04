import React, { useState } from 'react';
import { Users, HeartHandshake, ShieldCheck, Scale, CheckCircle2, ArrowRight, Printer, AlertTriangle, FileText, Send } from 'lucide-react';
import { CounsellingCase } from '../../types/counsellor';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';

interface CounsellorFamilyMediationViewProps {
  language: 'en' | 'hi';
  cases: CounsellingCase[];
  selectedCaseId?: string;
  onSelectCase: (caseId: string) => void;
  onSaveMediationSummary: (caseId: string, summary: {
    studentPerspective: string;
    parentPerspective: string;
    evidenceDiscussed: string;
    agreedNextStep: string;
  }) => void;
  onStartCall: (caseId: string) => void;
}

export const CounsellorFamilyMediationView: React.FC<CounsellorFamilyMediationViewProps> = ({
  language,
  cases,
  selectedCaseId,
  onSelectCase,
  onSaveMediationSummary,
  onStartCall
}) => {
  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const [studentPersp, setStudentPersp] = useState<string>(activeCase?.studentGoalSummary || '');
  const [parentPersp, setParentPersp] = useState<string>(activeCase?.parentConcernSummary || '');
  const [evidenceText, setEvidenceText] = useState<string>(
    'Reviewed MSDE NAPS stipend scheme (₹10,500/mo DBT) and AICTE lateral entry guidelines to 2nd year Polytechnic.'
  );
  const [agreedNextStep, setAgreedNextStep] = useState<string>(activeCase?.recommendedNextStep || '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;
    onSaveMediationSummary(activeCase.id, {
      studentPerspective: studentPersp,
      parentPerspective: parentPersp,
      evidenceDiscussed: evidenceText,
      agreedNextStep
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!activeCase) {
    return <div className="p-8 text-center text-slate-500">No active cases available for mediation.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            <span>{language === 'hi' ? 'संयुक्त परिवार करियर मध्यस्थता' : 'JOINT FAMILY MEDIATION DESK'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'hi' ? 'पारिवारिक सहमति एवं निर्णय समर्थन' : 'Family Career Decision Facilitator'}
          </h1>
          <p className="text-xs text-amber-100/90 max-w-xl font-medium">
            {language === 'hi'
              ? 'यहाँ किसी पक्ष को गलत या सही नहीं ठहराया जाता। दोनों के विचारों को सरकारी साक्ष्यों के साथ रखकर एक सर्वसम्मत रास्ता खोजा जाता है।'
              : 'Neutral mediation aligning learner aspirations with parental security concerns through verified evidence.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartCall(activeCase.id)}
            className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? '3-वे लाइव कॉल' : '3-Way Live Call'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 flex items-center gap-2 overflow-x-auto text-xs font-bold">
        <span className="text-slate-400 pl-2 shrink-0">{language === 'hi' ? 'केस चुनें:' : 'Select Family:'}</span>
        {cases.map(c => (
          <button
            key={c.id}
            onClick={() => {
              onSelectCase(c.id);
              setStudentPersp(c.studentGoalSummary);
              setParentPersp(c.parentConcernSummary || '');
              setAgreedNextStep(c.recommendedNextStep);
            }}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition ${
              c.id === activeCase.id
                ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {c.studentName} & {c.parentName || 'Parent'} ({c.id})
          </button>
        ))}
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-200 text-xs text-center font-bold animate-in fade-in">
          {language === 'hi' ? 'पारिवारिक सहमति प्रपत्र सफलतापूर्वक सहेजा गया! ✓' : 'Family Mediation Agreement updated successfully! ✓'}
        </div>
      )}

      {/* Structured 4-Quadrant Mediation Worksheet */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quadrant 1: Student Perspective */}
          <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {language === 'hi' ? 'छात्र का दृष्टिकोण (Student Perspective)' : "Student's Goal & Aspirations"}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                {activeCase.studentName}
              </span>
            </div>

            <textarea
              rows={3}
              value={studentPersp}
              onChange={e => setStudentPersp(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-sky-500 bg-slate-50"
            />
            <p className="text-[11px] text-slate-500">
              💡 {language === 'hi' ? 'छात्र क्या करना चाहता है और इसमें उसकी क्या रुचि है।' : 'Core trade preference and motivation.'}
            </p>
          </div>

          {/* Quadrant 2: Parent Perspective */}
          <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {language === 'hi' ? 'अभिभावक की चिंता (Parent Perspective)' : "Parent's Concerns & Doubts"}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                {activeCase.parentName || 'Parent'}
              </span>
            </div>

            <textarea
              rows={3}
              value={parentPersp}
              onChange={e => setParentPersp(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-slate-50"
            />
            <p className="text-[11px] text-slate-500">
              💡 {language === 'hi' ? 'नौकरी की गारंटी, वेतनमान, सामाजिक प्रतिष्ठा या सुरक्षा को लेकर चिंताएं।' : 'Income stability, status, safety concerns.'}
            </p>
          </div>

          {/* Quadrant 3: Verified Evidence Discussed */}
          <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {language === 'hi' ? 'प्रस्तुत साक्ष्य (Verified Career Evidence)' : 'Evidence & Real Facts Presented'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                NCVET / MSDE
              </span>
            </div>

            <textarea
              rows={3}
              value={evidenceText}
              onChange={e => setEvidenceText(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50"
            />
            <p className="text-[11px] text-slate-500">
              💡 {language === 'hi' ? 'सरकारी गजट, NAPS स्टाइपेंड प्रमाण, लेटरल एंट्री B.Tech नियम।' : 'Official salary ranges, Lateral entry AICTE rule.'}
            </p>
          </div>

          {/* Quadrant 4: Agreed Next Step */}
          <div className="bg-white rounded-3xl border-2 border-purple-200 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                  4
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {language === 'hi' ? 'सहमति एवं अगला कदम (Mutual Consensus)' : 'Agreed Next Action'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                Family Action
              </span>
            </div>

            <textarea
              rows={3}
              value={agreedNextStep}
              onChange={e => setAgreedNextStep(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-500 bg-slate-50"
            />
            <p className="text-[11px] text-slate-500">
              💡 {language === 'hi' ? 'उदा. सरकारी आईटीआई की लैब विजिट या 1 सप्ताह बाद फॉलो-अप कॉल।' : 'e.g. ITI lab visit or 7-day review call.'}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md transition"
          >
            {language === 'hi' ? 'पारिवारिक समझौता प्रपत्र सहेजें' : 'Save Mediation Agreement'}
          </button>
        </div>
      </form>
    </div>
  );
};
