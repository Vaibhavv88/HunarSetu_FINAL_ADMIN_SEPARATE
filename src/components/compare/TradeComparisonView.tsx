import React, { useState } from 'react';
import { Scale, CheckCircle2, ShieldCheck, Zap, Sun, Car, Cpu, Wrench, Scissors, Sparkles } from 'lucide-react';
import { VocationalTrade } from '../../types/career';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { I18N } from '../../i18n/translations';

interface TradeComparisonViewProps {
  language: 'en' | 'hi';
}

export const TradeComparisonView: React.FC<TradeComparisonViewProps> = ({ language }) => {
  const t = I18N[language];
  const [tradeAId, setTradeAId] = useState<string>('solar-technician');
  const [tradeBId, setTradeBId] = useState<string>('electrician');

  const tradeA = NSQF_VOCATIONAL_TRADES.find(t => t.id === tradeAId) || NSQF_VOCATIONAL_TRADES[0];
  const tradeB = NSQF_VOCATIONAL_TRADES.find(t => t.id === tradeBId) || NSQF_VOCATIONAL_TRADES[1];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>{language === 'hi' ? 'निष्पक्ष ट्रेड तुलना' : 'Head-to-Head Trade Comparison'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {language === 'hi' ? 'दो वोकेशनल ट्रेड्स की सीधी तुलना करें' : 'Compare Two Vocational Pathways'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
          {language === 'hi'
            ? 'अवधि, वेतनमान, सुरक्षा स्तर, प्लेसमेंट दर और आगे की डिग्री की संभावनाओं का निष्पक्ष आकलन करें।'
            : 'Evaluate training durations, salary trajectories, safety ratings, placement rates, and higher studies.'}
        </p>

        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'ट्रेड 1 चुनें:' : 'Select Trade 1:'}
            </label>
            <select
              value={tradeAId}
              onChange={e => setTradeAId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 text-white text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:border-amber-400"
            >
              {NSQF_VOCATIONAL_TRADES.map(tr => (
                <option key={tr.id} value={tr.id}>
                  {language === 'hi' ? tr.titleHi : tr.title}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <label className="block text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">
              {language === 'hi' ? 'ट्रेड 2 चुनें:' : 'Select Trade 2:'}
            </label>
            <select
              value={tradeBId}
              onChange={e => setTradeBId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 text-white text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:border-sky-400"
            >
              {NSQF_VOCATIONAL_TRADES.map(tr => (
                <option key={tr.id} value={tr.id}>
                  {language === 'hi' ? tr.titleHi : tr.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Cards Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trade A Card */}
        <div className="bg-white rounded-2xl border-2 border-amber-300 p-6 space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
              Trade 1 (NSQF Level {tradeA.nsqfLevel})
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {language === 'hi' ? tradeA.titleHi : tradeA.title}
            </h3>
            <p className="text-xs text-slate-500">{tradeA.sector}</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'कोर्स अवधि' : 'Duration'}</span>
              <p className="font-bold text-slate-800">{tradeA.durationMonths} {language === 'hi' ? 'महीने' : 'Months'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'प्रवेश पात्रता' : 'Eligibility'}</span>
              <p className="font-semibold text-slate-800">{language === 'hi' ? tradeA.eligibilityHi : tradeA.eligibility}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'वेतन वृद्धि क्रम' : 'Salary Trajectory'}</span>
              <div className="font-semibold text-slate-800 space-y-0.5">
                <div>{language === 'hi' ? 'शुरुआती:' : 'Entry:'} <strong className="text-emerald-700">{tradeA.salary.entryLevel}</strong></div>
                <div>{language === 'hi' ? '3 वर्ष:' : '3-Year:'} <strong>{tradeA.salary.midLevel3Yr}</strong></div>
                <div>{language === 'hi' ? '5 वर्ष:' : '5-Year:'} <strong>{tradeA.salary.senior5Yr}</strong></div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'सत्यापित प्लेसमेंट' : 'Placement Rate'}</span>
              <p className="font-bold text-emerald-700">{tradeA.placementRate}% verified</p>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'उच्च शिक्षा / लैटरल एंट्री' : 'Lateral Degree Entry'}</span>
              <p className="font-medium text-slate-800">{language === 'hi' ? tradeA.degreeProgressionHi : tradeA.degreeProgression}</p>
            </div>
          </div>
        </div>

        {/* Trade B Card */}
        <div className="bg-white rounded-2xl border-2 border-sky-300 p-6 space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
              Trade 2 (NSQF Level {tradeB.nsqfLevel})
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {language === 'hi' ? tradeB.titleHi : tradeB.title}
            </h3>
            <p className="text-xs text-slate-500">{tradeB.sector}</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'कोर्स अवधि' : 'Duration'}</span>
              <p className="font-bold text-slate-800">{tradeB.durationMonths} {language === 'hi' ? 'महीने' : 'Months'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'प्रवेश पात्रता' : 'Eligibility'}</span>
              <p className="font-semibold text-slate-800">{language === 'hi' ? tradeB.eligibilityHi : tradeB.eligibility}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'वेतन वृद्धि क्रम' : 'Salary Trajectory'}</span>
              <div className="font-semibold text-slate-800 space-y-0.5">
                <div>{language === 'hi' ? 'शुरुआती:' : 'Entry:'} <strong className="text-emerald-700">{tradeB.salary.entryLevel}</strong></div>
                <div>{language === 'hi' ? '3 वर्ष:' : '3-Year:'} <strong>{tradeB.salary.midLevel3Yr}</strong></div>
                <div>{language === 'hi' ? '5 वर्ष:' : '5-Year:'} <strong>{tradeB.salary.senior5Yr}</strong></div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'सत्यापित प्लेसमेंट' : 'Placement Rate'}</span>
              <p className="font-bold text-emerald-700">{tradeB.placementRate}% verified</p>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">{language === 'hi' ? 'उच्च शिक्षा / लैटरल एंट्री' : 'Lateral Degree Entry'}</span>
              <p className="font-medium text-slate-800">{language === 'hi' ? tradeB.degreeProgressionHi : tradeB.degreeProgression}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
