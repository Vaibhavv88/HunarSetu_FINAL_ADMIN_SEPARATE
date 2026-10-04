import React, { useState } from 'react';
import { Search, Filter, Bookmark, BookmarkCheck, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, TrendingUp, Building2, Award, Zap, Volume2, Sparkles, Scale, Users } from 'lucide-react';
import { VocationalTrade } from '../../types/career';
import { StudentProfile } from '../../types/student';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { calculateTradeMatch } from '../../services/matchingEngine';

interface StudentCareerExplorerProps {
  language: 'en' | 'hi';
  student: StudentProfile;
  onToggleSaveCareer: (tradeId: string) => void;
  onOpenRoadmap: (tradeId: string) => void;
  onOpenCompare: (tradeId: string) => void;
  onOpenFamilyDiscussion: (tradeId: string) => void;
  initialSelectedTradeId?: string;
  onSpeak?: (text: string) => void;
}

export const StudentCareerExplorer: React.FC<StudentCareerExplorerProps> = ({
  language,
  student,
  onToggleSaveCareer,
  onOpenRoadmap,
  onOpenCompare,
  onOpenFamilyDiscussion,
  initialSelectedTradeId,
  onSpeak
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTrade, setSelectedTrade] = useState<VocationalTrade | null>(
    initialSelectedTradeId
      ? NSQF_VOCATIONAL_TRADES.find(t => t.id === initialSelectedTradeId) || null
      : null
  );

  const categories = [
    'All',
    'Green Energy / Renewables',
    'Power & Electrical',
    'Automotive & Future Mobility',
    'Aerospace & Aviation',
    'Capital Goods & Precision Manufacturing',
    'Healthcare & Life Sciences',
    'Fabrication & Infrastructure',
    'Information Technology & Electronics',
    'Food Processing & Agribusiness',
    'Beauty & Wellness',
    'Apparel, Made-Ups & Home Furnishing'
  ];

  const filteredTrades = NSQF_VOCATIONAL_TRADES.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.keySkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || t.sector === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate dynamic match for the student
  const getMatchScore = (trade: VocationalTrade) => {
    return calculateTradeMatch(
      {
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
      },
      trade
    );
  };

  // CAREER DETAIL VIEW
  if (selectedTrade) {
    const match = getMatchScore(selectedTrade);
    const isSaved = student.savedCareerIds.includes(selectedTrade.id);

    return (
      <div className="max-w-4xl mx-auto p-4 py-8 space-y-6 animate-in fade-in">
        {/* Back Button & Save Action */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedTrade(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'सभी करियर पर वापस' : 'Back to All Careers'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSaveCareer(selectedTrade.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                isSaved
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4 text-slate-400" />}
              <span>{isSaved ? (language === 'hi' ? 'सेव किया हुआ ✓' : 'Saved ✓') : (language === 'hi' ? 'सेव करें' : 'Save Career')}</span>
            </button>

            <button
              onClick={() => onOpenFamilyDiscussion(selectedTrade.id)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'परिवार से चर्चा करें' : 'Discuss with Family'}</span>
            </button>
          </div>
        </div>

        {/* Title Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                  NSQF Level {selectedTrade.nsqfLevel}
                </span>
                <span className="bg-sky-100 text-sky-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  {selectedTrade.durationMonths} {language === 'hi' ? 'महीने प्रशिक्षण' : 'Months Training'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {language === 'hi' ? selectedTrade.titleHi : selectedTrade.title}
              </h1>
              <p className="text-xs font-bold text-amber-700 mt-1">
                {language === 'hi' ? selectedTrade.taglineHi : selectedTrade.tagline}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-center shrink-0">
              <span className="text-3xl font-black text-emerald-700 block">
                {match.overallScore}%
              </span>
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                {language === 'hi' ? 'प्रोफ़ाइल अनुकूलता' : 'Compatibility Match'}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pt-2 border-t border-slate-100">
            {language === 'hi' ? selectedTrade.shortDescriptionHi : selectedTrade.shortDescription}
          </p>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => onOpenRoadmap(selectedTrade.id)}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'करियर रोडमैप देखें' : 'View Career Roadmap'}</span>
            </button>
            <button
              onClick={() => onOpenCompare(selectedTrade.id)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Scale className="w-3.5 h-3.5 text-slate-600" />
              <span>{language === 'hi' ? 'अन्य से तुलना करें' : 'Compare Career'}</span>
            </button>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Who can apply? */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'कौन आवेदन कर सकता है? (Who can apply?)' : 'Who Can Apply?'}
            </h3>
            <p className="text-sm font-extrabold text-slate-900">
              {language === 'hi' ? selectedTrade.eligibilityHi : selectedTrade.eligibility}
            </p>
          </div>

          {/* Training Duration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'प्रशिक्षण अवधि (Training Duration)' : 'Training Duration'}
            </h3>
            <p className="text-sm font-extrabold text-slate-900">
              {selectedTrade.durationMonths} {language === 'hi' ? 'महीने (थ्योरी + व्यावहारिक OJT)' : 'Months (Hands-on Theory + OJT)'}
            </p>
          </div>

          {/* Expected Earnings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs md:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'अपेक्षित कमाई (Expected Earnings Progression)' : 'Expected Earnings Progression'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'hi' ? 'शुरुआती वेतन' : 'Starting (Entry)'}</span>
                <span className="font-extrabold text-emerald-700 text-sm">{selectedTrade.salary.entryLevel}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'hi' ? '3 वर्ष बाद' : 'After 3 Years'}</span>
                <span className="font-extrabold text-slate-800 text-sm">{selectedTrade.salary.midLevel3Yr}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'hi' ? '5 वर्ष बाद' : 'After 5 Years'}</span>
                <span className="font-extrabold text-slate-800 text-sm">{selectedTrade.salary.senior5Yr}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold uppercase block">{language === 'hi' ? 'खुद की दुकान / एजेंसी' : 'Self-Employed'}</span>
                <span className="font-extrabold text-amber-900 text-sm">{selectedTrade.salary.selfEmployedPotential}</span>
              </div>
            </div>
          </div>

          {/* Job Roles */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'संभावित कार्य पद (Job Roles)' : 'Typical Job Roles'}
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
              {(language === 'hi' ? selectedTrade.jobRolesHi : selectedTrade.jobRoles).map((role, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{role}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Further Education & Lateral Entry */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'आगे की पढ़ाई (Further Education)' : 'Further Education & Degree'}
            </h3>
            <p className="text-xs font-bold text-slate-800 leading-relaxed">
              {language === 'hi' ? selectedTrade.degreeProgressionHi : selectedTrade.degreeProgression}
            </p>
          </div>

          {/* Skills Required & Skill Gap Guidance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs md:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'हुनर विश्लेषण (Skill Gap Guidance)' : 'Skills You Will Learn & Develop'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-extrabold text-emerald-900 block">{language === 'hi' ? 'आपके पास पहले से है (Your Baseline)' : 'You Already Have:'}</span>
                <p className="text-emerald-800 font-medium">Basic numeracy, curiosity in {student.workPreference.toLowerCase()}, motivation to learn practical skills.</p>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
                <span className="font-extrabold text-sky-900 block">{language === 'hi' ? 'कोर्स में क्या सीखेंगे (Skills to Master):' : 'You Will Master in Training:'}</span>
                <p className="text-sky-800 font-medium">{selectedTrade.keySkills.join(', ')}.</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              * Guidance estimate based on your provided profile information.
            </p>
          </div>

          {/* Safety & Working Conditions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs md:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'सुरक्षा एवं कामकाजी माहौल (Safety & Work Conditions)' : 'Safety & Workplace Standards'}
            </h3>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              {language === 'hi' ? selectedTrade.safetyNoteHi : selectedTrade.safetyNote}
            </p>
          </div>
        </div>

        {/* Source & Transparency Footnote */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>{language === 'hi' ? 'डेटा स्रोत:' : 'Data Source:'}</strong> {selectedTrade.dataSource}
          </span>
          <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold">
          </span>
        </div>
      </div>
    );
  }

  // CAREER LIBRARY / EXPLORER LIST VIEW
  return (
    <div className="max-w-5xl mx-auto p-4 py-8 space-y-6">
      {/* Search & Filter Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === 'hi' ? 'वोकेशनल करियर लाइब्रेरी' : 'Explore Vocational Careers'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'सत्यापित NSQF ट्रेड्स, ट्रेनिंग अवधि और अपेक्षित कमाई का विवरण।'
              : 'Browse verified vocational pathways with eligibility, duration, and placement outcomes.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'ट्रेड खोजें (उदा. सोलर, इलेक्ट्रीशियन, ड्रोन, वेल्डर)...' : 'Search careers (e.g. Solar, Electrician, Drone, Welder)...'}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 text-xs sm:text-sm font-semibold focus:border-amber-500 focus:outline-none bg-white transition"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-bold transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-amber-400 shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat === 'All' ? (language === 'hi' ? 'सभी ट्रेड्स' : 'All Categories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrades.map(trade => {
          const match = getMatchScore(trade);
          const isSaved = student.savedCareerIds.includes(trade.id);

          return (
            <div
              key={trade.id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-400 p-5 flex flex-col justify-between transition-all hover:shadow-md group space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                    NSQF {trade.nsqfLevel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {match.overallScore}% Match
                    </span>
                    <button
                      onClick={() => onToggleSaveCareer(trade.id)}
                      className="p-1 text-slate-400 hover:text-amber-600 transition"
                      title="Save trade"
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-amber-700 transition">
                  {language === 'hi' ? trade.titleHi : trade.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {language === 'hi' ? trade.shortDescriptionHi : trade.shortDescription}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{language === 'hi' ? 'अवधि:' : 'Duration:'}</span>
                    <strong className="text-slate-900">{trade.durationMonths} {language === 'hi' ? 'महीने' : 'Months'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{language === 'hi' ? 'शुरुआती वेतन:' : 'Entry Salary:'}</span>
                    <strong className="text-emerald-700">{trade.salary.entryLevel}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedTrade(trade)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>{language === 'hi' ? 'करियर विस्तार देखें' : 'Explore Career'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrades.length === 0 && (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
          <p className="text-sm font-bold">
            {language === 'hi' ? 'कोई करियर नहीं मिला।' : 'No careers found matching your search.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs font-bold text-amber-700 hover:underline"
          >
            {language === 'hi' ? 'फिल्टर हटाएं' : 'Clear search filters'}
          </button>
        </div>
      )}
    </div>
  );
};
