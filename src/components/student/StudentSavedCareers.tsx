import React from 'react';
import { Bookmark, BookmarkCheck, ArrowRight, TrendingUp, Scale, MessageSquare, Trash2, Compass } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';

interface StudentSavedCareersProps {
  language: 'en' | 'hi';
  student: StudentProfile;
  onUnsaveCareer: (tradeId: string) => void;
  onExploreCareer: (tradeId: string) => void;
  onOpenRoadmap: (tradeId: string) => void;
  onOpenCompare: (tradeId: string) => void;
  onOpenAI: (tradeId: string) => void;
  onNavigateExplore: () => void;
}

export const StudentSavedCareers: React.FC<StudentSavedCareersProps> = ({
  language,
  student,
  onUnsaveCareer,
  onExploreCareer,
  onOpenRoadmap,
  onOpenCompare,
  onOpenAI,
  onNavigateExplore
}) => {
  const savedTrades = NSQF_VOCATIONAL_TRADES.filter(t =>
    student.savedCareerIds.includes(t.id)
  );

  if (savedTrades.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-4 py-16 text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto text-2xl">
          <Bookmark className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'hi' ? 'अभी कोई करियर सेव नहीं किया गया है' : "You haven't saved any careers yet."}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'hi'
              ? 'करियर लाइब्रेरी एक्सप्लोर करें और जिन ट्रेड्स में आपकी रुचि हो, उन्हें बाद में तुलना करने के लिए सेव करें।'
              : 'Explore careers and save the ones you want to compare or discuss with family later.'}
          </p>
        </div>

        <button
          onClick={onNavigateExplore}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs shadow-md inline-flex items-center gap-2 transition"
        >
          <Compass className="w-4 h-4 text-slate-950" />
          <span>{language === 'hi' ? 'करियर खोजें (Explore Careers)' : 'Explore Careers'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'मेरे सेव किए गए करियर' : 'My Saved Careers'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? `${savedTrades.length} ट्रेड्स आपकी पसंद सूची में सुरक्षित हैं।`
              : `${savedTrades.length} trades saved for comparison and family review.`}
          </p>
        </div>

        <button
          onClick={onNavigateExplore}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs transition"
        >
          {language === 'hi' ? '+ और करियर जोड़ें' : '+ Add More'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedTrades.map(trade => (
          <div
            key={trade.id}
            className="bg-white rounded-3xl border-2 border-slate-200 p-5 space-y-4 shadow-xs hover:border-amber-400 transition"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                  NSQF Level {trade.nsqfLevel}
                </span>
                <button
                  onClick={() => onUnsaveCareer(trade.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-black text-base text-slate-900">
                {language === 'hi' ? trade.titleHi : trade.title}
              </h3>
              <p className="text-xs text-slate-500">{trade.sector}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'अवधि:' : 'Duration:'}</span>
                <strong className="text-slate-800">{trade.durationMonths} {language === 'hi' ? 'माह' : 'Months'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'शुरुआती वेतन:' : 'Entry Salary:'}</span>
                <strong className="text-emerald-700">{trade.salary.entryLevel}</strong>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
              <button
                onClick={() => onExploreCareer(trade.id)}
                className="bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-center transition"
              >
                {language === 'hi' ? 'विस्तार देखें' : 'Explore'}
              </button>
              <button
                onClick={() => onOpenRoadmap(trade.id)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl text-center transition"
              >
                {language === 'hi' ? 'रोडमैप' : 'Roadmap'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
