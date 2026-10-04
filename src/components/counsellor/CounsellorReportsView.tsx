import React from 'react';
import { BarChart3, Users, CheckCircle2, TrendingUp, ShieldCheck, HeartHandshake, PhoneCall, Award } from 'lucide-react';
import { CounsellingCase } from '../../types/counsellor';

interface CounsellorReportsViewProps {
  language: 'en' | 'hi';
  cases: CounsellingCase[];
}

export const CounsellorReportsView: React.FC<CounsellorReportsViewProps> = ({
  language,
  cases
}) => {
  const totalCases = cases.length;
  const resolvedCases = cases.filter(c => c.stage === 'Resolved').length;
  const openCases = totalCases - resolvedCases;
  const familyCases = cases.filter(c => c.isFamilyConnected).length;

  const concernCounts = [
    { concern: 'Job Security & Guaranteed Placement', count: 18, percentage: 38 },
    { concern: 'Income & 3-Year Salary Cap', count: 14, percentage: 29 },
    { concern: 'Social Perception vs BA/B.Com Degree', count: 9, percentage: 19 },
    { concern: 'Physical Safety & Workplace Conditions', count: 7, percentage: 14 }
  ];

  const tradeBreakdown = [
    { trade: 'Solar PV System Installation', sessions: 22 },
    { trade: 'Drone Assembly & Agricultural Pilot', sessions: 16 },
    { trade: 'Electric Vehicle (EV) Powertrain', sessions: 14 },
    { trade: 'CNC Machining & Precision Tooling', sessions: 11 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-xs">
        <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-sky-200">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'काउंसलर कार्य प्रगति रिपोर्ट' : 'COUNSELLOR PERFORMANCE & IMPACT'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {language === 'hi' ? 'परामर्श सत्र प्रभाव एवं विश्लेषण' : 'Counselling Metrics & Regional Outcomes'}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {language === 'hi'
            ? 'आपके द्वारा हल किए गए पारिवारिक मतभेद, स्वीकृत केस और आम चिंताओं का संक्षिप्त विवरण।'
            : 'Aggregated resolution metrics, family mediation success rates, and frequent objection trends.'}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-400">Total Cases Handled</span>
          <p className="text-3xl font-black text-slate-900">{totalCases + 45}</p>
          <span className="text-[10px] font-bold text-sky-600 block">Across 3 districts</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-400">Family Sessions</span>
          <p className="text-3xl font-black text-amber-600">{familyCases + 28}</p>
          <span className="text-[10px] font-bold text-amber-700 block">Joint mediation calls</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-400">Resolution Rate</span>
          <p className="text-3xl font-black text-emerald-600">88.4%</p>
          <span className="text-[10px] font-bold text-emerald-700 block">Consensus achieved</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-400">Active Follow-ups</span>
          <p className="text-3xl font-black text-purple-600">{openCases + 4}</p>
          <span className="text-[10px] font-bold text-purple-700 block">In progress</span>
        </div>
      </div>

      {/* 2-Column: Common Concerns & Popular Trades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-600" />
            <span>{language === 'hi' ? 'अभिभावकों की सबसे आम चिंताएं' : 'Primary Parental Hesitations'}</span>
          </h2>

          <div className="space-y-3">
            {concernCounts.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.concern}</span>
                  <span className="text-slate-900">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'सबसे ज्यादा चर्चा किए गए ट्रेड्स' : 'Most Discussed Vocational Trades'}</span>
          </h2>

          <div className="space-y-3">
            {tradeBreakdown.map((t, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-900">🎯 {t.trade}</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {t.sessions} {language === 'hi' ? 'सत्र' : 'sessions'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
