import React from 'react';
import { ArrowRight, Compass, Sparkles, TrendingUp, Bookmark, MessageSquare, CheckCircle2, ChevronRight, Award, ShieldCheck, PhoneCall, UserCheck } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { rankTradesForLearner } from '../../services/matchingEngine';

interface StudentDashboardProps {
  language: 'en' | 'hi';
  student: StudentProfile;
  onNavigate: (tab: string, tradeId?: string) => void;
  onStartAssessment: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  language,
  student,
  onNavigate,
  onStartAssessment
}) => {
  // Compute top 3 matches for the student
  const ranked = rankTradesForLearner({
    name: student.name,
    age: 18,
    gender: 'Not specified',
    state: student.state,
    district: student.district,
    localityType: student.locality || 'Semi-Urban',
    educationLevel: (student.education === 'Class 12'
      ? (student.stream?.includes('Science') ? 'Class 12th (Science)' : 'Class 12th (Arts/Comm)')
      : (student.education === 'Class 10' ? 'Class 10th Passed' : 'Below 10th')) as any,
    interests: student.interests,
    preferredWorkStyle: (student.workPreference.includes('machine')
      ? 'Hands-on Machines'
      : student.workPreference.includes('computer')
      ? 'Digital & Tech'
      : student.workPreference.includes('people')
      ? 'People & Service'
      : 'Practical / hands-on work') as any,
    willingToRelocate: false,
    priority: (student.careerGoal.includes('quick')
      ? 'Immediate Job'
      : student.careerGoal.includes('business')
      ? 'Self Employment / Shop'
      : 'High Earning Potential') as any
  });

  const top3Matches = ranked.slice(0, 3);
  const lastExplored = NSQF_VOCATIONAL_TRADES.find(t => t.id === student.lastExploredTradeId) || top3Matches[0]?.trade;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? `नमस्ते, ${student.name} 👋` : `Hi, ${student.name} 👋`}
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          {language === 'hi' ? 'आइए आपकी करियर यात्रा को आगे बढ़ाते हैं।' : "Let's continue your career journey."}
        </p>
      </div>

      {/* SECTION 1: YOUR NEXT STEP */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-3xl p-6 sm:p-7 shadow-lg shadow-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-lg">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 bg-white/40 px-2.5 py-0.5 rounded-full inline-block">
            {language === 'hi' ? 'आपका अगला कदम' : 'YOUR NEXT STEP'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black leading-snug">
            {!student.assessmentCompleted
              ? (language === 'hi' ? '10 प्रश्नों का करियर आकलन पूरा करें' : 'Complete your career assessment')
              : (language === 'hi' ? 'अपने शीर्ष करियर मिलान देखें' : 'Explore your career matches')}
          </h2>
          <p className="text-xs text-slate-900/80 font-medium">
            {!student.assessmentCompleted
              ? (language === 'hi' ? 'केवल 2 मिनट में अपनी रुचि के अनुसार सटीक परिणाम पाएं।' : 'Takes just 2 minutes to fine-tune your personalized recommendations.')
              : (language === 'hi' ? 'आपकी योग्यता और जिले के अनुसार शीर्ष अवसर तैयार हैं।' : 'Top NSQF opportunities verified for your education and district.')}
          </p>
        </div>

        <button
          onClick={!student.assessmentCompleted ? onStartAssessment : () => onNavigate('matches')}
          className="bg-slate-950 hover:bg-slate-900 text-white font-black px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow transition transform hover:scale-105 shrink-0"
        >
          <span>
            {!student.assessmentCompleted
              ? (language === 'hi' ? 'आकलन शुरू करें' : 'Start Assessment')
              : (language === 'hi' ? 'मिलान देखें' : 'View Matches')}
          </span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* SECTION 2: YOUR CAREER MATCHES (Max 3 Clean Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'आपके शीर्ष 3 करियर मिलान' : 'Your Career Matches'}
          </h3>
          <button
            onClick={() => onNavigate('matches')}
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {top3Matches.map(({ trade, breakdown }) => (
            <div
              key={trade.id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-400 p-5 flex flex-col justify-between transition-all hover:shadow-md space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                    NSQF {trade.nsqfLevel}
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {breakdown.overallScore}%
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {language === 'hi' ? trade.titleHi : trade.title}
                </h4>

                <p className="text-[11px] text-amber-800 font-semibold line-clamp-1">
                  {language === 'hi' ? 'आपकी रुचि से मजबूत मिलान' : 'Strong match for your interests'}
                </p>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  {language === 'hi' ? 'अवधि:' : 'Duration:'} <strong className="text-slate-800">{trade.durationMonths} {language === 'hi' ? 'माह' : 'months'}</strong>
                </div>
              </div>

              <button
                onClick={() => onNavigate('explore', trade.id)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>{language === 'hi' ? 'विस्तार देखें' : 'Explore'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: QUICK ACTIONS */}
      {/* SECTION 3: QUICK ACTIONS */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          {language === 'hi' ? 'त्वरित विकल्प' : 'QUICK ACTIONS'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('counsellor')}
            className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200 hover:border-sky-400 text-left transition hover:shadow-xs group space-y-1"
          >
            <PhoneCall className="w-5 h-5 text-sky-700 mb-1 group-hover:scale-110 transition" />
            <h4 className="font-extrabold text-xs text-sky-950">
              {language === 'hi' ? 'मेरी काउंसलिंग' : 'My Counselling'}
            </h4>
            <p className="text-[10px] text-sky-700 line-clamp-1">Dr. Priya Sharma ✓</p>
          </button>

          <button
            onClick={() => onNavigate('explore')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 text-left transition hover:shadow-xs group space-y-1"
          >
            <Compass className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition" />
            <h4 className="font-extrabold text-xs text-slate-900">
              {language === 'hi' ? 'करियर लाइब्रेरी' : 'Explore Careers'}
            </h4>
            <p className="text-[10px] text-slate-500 line-clamp-1">12+ NSQF trades</p>
          </button>

          <button
            onClick={() => onNavigate('ai')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 text-left transition hover:shadow-xs group space-y-1"
          >
            <MessageSquare className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition" />
            <h4 className="font-extrabold text-xs text-slate-900">
              {language === 'hi' ? 'एआई से पूछें' : 'Ask AI'}
            </h4>
            <p className="text-[10px] text-slate-500 line-clamp-1">Instant counselling</p>
          </button>

          <button
            onClick={() => onNavigate('plan')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 text-left transition hover:shadow-xs group space-y-1"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition" />
            <h4 className="font-extrabold text-xs text-slate-900">
              {language === 'hi' ? 'मेरा करियर प्लान' : 'My Career Plan'}
            </h4>
            <p className="text-[10px] text-slate-500 line-clamp-1">Next action steps</p>
          </button>
        </div>
      </div>

      {/* SECTION 4: CONTINUE WHERE YOU LEFT OFF */}
      {lastExplored && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {language === 'hi' ? 'जहाँ आपने छोड़ा था' : 'CONTINUE WHERE YOU LEFT OFF'}
            </span>
            <h4 className="font-black text-sm text-slate-900">
              {language === 'hi' ? `जारी रखें: ${lastExplored.titleHi}` : `Continue exploring ${lastExplored.title}`}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'रोडमैप, पात्रता और स्थानीय ट्रेनिंग सेंटर देखें।' : 'Check roadmap, eligibility, and local training centers.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore', lastExplored.id)}
            className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition shrink-0"
          >
            {language === 'hi' ? 'आगे पढ़ें →' : 'Resume →'}
          </button>
        </div>
      )}
    </div>
  );
};
