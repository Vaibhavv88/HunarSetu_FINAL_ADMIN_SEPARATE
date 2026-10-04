import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, AlertTriangle, ArrowRight, Plus, Users, Search } from 'lucide-react';
import { CounsellingCase, CounsellingFollowUp } from '../../types/counsellor';

interface CounsellorFollowUpsViewProps {
  language: 'en' | 'hi';
  cases: CounsellingCase[];
  onCompleteFollowUp: (caseId: string, followUpId: string) => void;
  onOpenCase: (caseId: string) => void;
}

export const CounsellorFollowUpsView: React.FC<CounsellorFollowUpsViewProps> = ({
  language,
  cases,
  onCompleteFollowUp,
  onOpenCase
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const allFollowUps = cases.flatMap(c =>
    c.followUps.map(f => ({ ...f, caseId: c.id, caseTitle: c.title, district: c.district }))
  );

  const filtered = allFollowUps.filter(f => {
    if (filter === 'all') return true;
    return f.status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'hi' ? 'फॉलो-अप एवं समीक्षा ट्रैकर' : 'Follow-up & Review Tracker'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'hi'
                ? 'छात्र और परिवार के साथ तय की गई तारीखों पर प्रगति की जांच करें।'
                : 'Track scheduled checkpoints to ensure family decisions translate into admissions.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'pending' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {language === 'hi' ? 'लंबित (Pending)' : 'Pending'}
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'completed' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {language === 'hi' ? 'पूर्ण (Completed)' : 'Completed'}
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'all' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {language === 'hi' ? 'सभी' : 'All'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold">
              {language === 'hi' ? 'कोई फॉलो-अप आइटम नहीं है।' : 'No follow-up items found.'}
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-lg">
                      {item.caseId}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">
                      {item.studentName} {item.parentName ? `& ${item.parentName}` : ''}
                    </h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full ${
                      item.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {item.caseTitle} • {item.district}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Due: {item.dueDate}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-800 font-medium">
                {item.reason}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-medium">
                  {item.message}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenCase(item.caseId)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 px-3 py-1.5 rounded-xl border border-sky-200 hover:bg-sky-50 transition"
                  >
                    {language === 'hi' ? 'केस देखें' : 'View Case'}
                  </button>

                  {item.status === 'pending' && (
                    <button
                      onClick={() => onCompleteFollowUp(item.caseId, item.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'पूर्ण चिह्नित करें' : 'Mark Completed'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
