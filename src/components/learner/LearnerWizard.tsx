import React, { useState } from 'react';
import { Compass, CheckCircle, ArrowRight, ArrowLeft, Volume2, ShieldCheck, Sparkles, MapPin, Briefcase, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { LearnerProfile, VocationalTrade, MatchScoreBreakdown } from '../../types/career';
import { rankTradesForLearner } from '../../services/matchingEngine';
import { I18N } from '../../i18n/translations';

interface LearnerWizardProps {
  language: 'en' | 'hi';
  learner: LearnerProfile;
  onUpdateLearner: (updated: LearnerProfile) => void;
  onSelectTradeForSession: (tradeId: string) => void;
  onSpeak: (text: string) => void;
  onNavigateToFamilySession: () => void;
}

export const LearnerWizard: React.FC<LearnerWizardProps> = ({
  language,
  learner,
  onUpdateLearner,
  onSelectTradeForSession,
  onSpeak,
  onNavigateToFamilySession
}) => {
  const t = I18N[language];
  const [step, setStep] = useState<number>(learner.selectedTradeId ? 4 : 1);
  const [expandedWhyTradeId, setExpandedWhyTradeId] = useState<string | null>(null);

  // Compute recommendations dynamically
  const rankedTrades = rankTradesForLearner(learner);

  const interestOptions = [
    { id: 'Solar Energy', label: 'Solar & Clean Energy', labelHi: 'सोलर एवं स्वच्छ ऊर्जा' },
    { id: 'Electrical Circuits', label: 'Electrical & Power Wiring', labelHi: 'इलेक्ट्रिकल एवं वायरिंग' },
    { id: 'Automotive & EV', label: 'Cars, Bikes & EV Tech', labelHi: 'ऑटोमोबाइल एवं ईवी' },
    { id: 'Drone & Flying', label: 'Drones & Robotics', labelHi: 'ड्रोन एवं रोबोटिक्स' },
    { id: 'Machines & Metal', label: 'Precision CNC Machining', labelHi: 'सीएनसी व धातु मशीनिंग' },
    { id: 'Healthcare', label: 'Hospital & Patient Care', labelHi: 'स्वास्थ्य सेवा व अस्पताल' },
    { id: 'Welding', label: 'TIG/MIG Welding & Pipeline', labelHi: 'वेल्डिंग एवं फैब्रिकेशन' },
    { id: 'Computers & Network', label: 'Computers & IT Support', labelHi: 'कंप्यूटर एवं नेटवर्किंग' },
    { id: 'Food & Dairy', label: 'Food Processing & Dairy', labelHi: 'खाद्य प्रसंस्करण व डेयरी' },
    { id: 'Beauty & Styling', label: 'Beauty & Hair Styling', labelHi: 'ब्यूटी एवं हेयर स्टाइलिंग' },
    { id: 'Fashion & Garments', label: 'Garment & Fashion Tech', labelHi: 'वस्त्र निर्माण व बुटीक' }
  ];

  const workStyles: LearnerProfile['preferredWorkStyle'][] = [
    'Hands-on Machines',
    'Digital & Tech',
    'Outdoor & Travel',
    'People & Service',
    'Design & Creative'
  ];

  const workStylesHi: Record<string, string> = {
    'Hands-on Machines': 'मशीनों और औजारों पर काम करना',
    'Digital & Tech': 'कंप्यूटर और डिजिटल गैजेट्स',
    'Outdoor & Travel': 'फील्ड वर्क और खुली जगहें',
    'People & Service': 'मरीजों और लोगों की सेवा',
    'Design & Creative': 'डिजाइन और रचनात्मक हुनर'
  };

  const toggleInterest = (interestId: string) => {
    const exists = learner.interests.includes(interestId);
    const updatedInterests = exists
      ? learner.interests.filter(i => i !== interestId)
      : [...learner.interests, interestId];
    onUpdateLearner({ ...learner, interests: updatedInterests });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'कदम-दर-कदम मार्गदर्शन' : 'Guided Learner Discovery'}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {language === 'hi' ? 'विद्यार्थी प्रोफाइल एवं करियर मिलान' : 'Discover Your Vocational Pathway'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'बिना किसी भ्रम के अपनी रुचि, शिक्षा और जिले के अनुसार सबसे उपयुक्त ट्रेड खोजें।'
              : 'Match your strengths, education, and district against verified NSQF outcomes.'}
          </p>
        </div>

        {/* Step Progress Pill */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
          {[1, 2, 3, 4].map(s => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`px-3 py-1.5 rounded-lg transition ${
                step === s
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : step > s
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {s === 1 && (language === 'hi' ? '1. आप' : '1. Profile')}
              {s === 2 && (language === 'hi' ? '2. शिक्षा' : '2. Education')}
              {s === 3 && (language === 'hi' ? '3. रुचि' : '3. Interests')}
              {s === 4 && (language === 'hi' ? '4. परिणाम' : '4. Matches')}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Personal Details & District */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'hi' ? 'कदम 1: आपके बारे में बुनियादी जानकारी' : 'Step 1: About You & Location'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'स्थानीय रोजगार के अवसर आपके जिले पर निर्भर करते हैं।'
                : 'Local industrial demand is heavily anchored to your home district.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'आपका नाम (Learner Name)' : 'Full Name'}
              </label>
              <input
                type="text"
                value={learner.name}
                onChange={e => onUpdateLearner({ ...learner, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Your Name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'आयु (Age)' : 'Age (Years)'}
              </label>
              <input
                type="number"
                value={learner.age}
                onChange={e => onUpdateLearner({ ...learner, age: parseInt(e.target.value) || 18 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                min={14}
                max={35}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'राज्य (State)' : 'State'}
              </label>
              <select
                value={learner.state}
                onChange={e => onUpdateLearner({ ...learner, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
                <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                <option value="Rajasthan">Rajasthan (राजस्थान)</option>
                <option value="Gujarat">Gujarat (गुजरात)</option>
                <option value="Bihar">Bihar (बिहार)</option>
                <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'जिला (District)' : 'District'}
              </label>
              <select
                value={learner.district}
                onChange={e => onUpdateLearner({ ...learner, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="Kanpur Nagar">Kanpur Nagar (कानपुर नगर)</option>
                <option value="Varanasi">Varanasi (वाराणसी)</option>
                <option value="Pune">Pune (पुणे)</option>
                <option value="Jaipur">Jaipur (जयपुर)</option>
                <option value="Surat">Surat (सूरत)</option>
                <option value="Patna">Patna (पटना)</option>
                <option value="Lucknow">Lucknow (लखनऊ)</option>
                <option value="Indore">Indore (इंदौर)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'क्षेत्र का प्रकार (Locality)' : 'Area Type'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Rural', 'Semi-Urban', 'Urban'] as const).map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => onUpdateLearner({ ...learner, localityType: loc })}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      learner.localityType === loc
                        ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {loc === 'Rural' && (language === 'hi' ? 'ग्रामीण (गांव)' : 'Rural')}
                    {loc === 'Semi-Urban' && (language === 'hi' ? 'कस्बा / तहसील' : 'Semi-Urban')}
                    {loc === 'Urban' && (language === 'hi' ? 'शहरी (City)' : 'Urban')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'स्थान परिवर्तन की इच्छा (Relocation)' : 'Willingness to Relocate'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateLearner({ ...learner, willingToRelocate: false })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    !learner.willingToRelocate
                      ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {language === 'hi' ? 'गृह जिले में रहना है' : 'Prefer Home District'}
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLearner({ ...learner, willingToRelocate: true })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    learner.willingToRelocate
                      ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {language === 'hi' ? 'अन्य शहर जाने को तैयार' : 'Ready to Relocate'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow text-xs flex items-center gap-2 transition"
            >
              <span>{language === 'hi' ? 'अगला: शिक्षा व पृष्ठभूमि' : 'Next: Education'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Education & Academic Eligibility */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'hi' ? 'कदम 2: वर्तमान शैक्षणिक योग्यता' : 'Step 2: Educational Background'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'विभिन्न ट्रेडों के लिए NSQF स्तर के अनुसार न्यूनतम योग्यता निर्धारित है।'
                : 'Matches your eligibility against official NCVET trade entry criteria.'}
            </p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'Below 10th', label: 'Below Class 10th (8th / 9th)', labelHi: '10वीं से कम (8वीं या 9वीं पास)' },
              { id: 'Class 10th Passed', label: 'Class 10th Passed (Matriculation)', labelHi: '10वीं कक्षा उत्तीर्ण (हाईस्कूल)' },
              { id: 'Class 12th (Arts/Comm)', label: 'Class 12th Passed (Arts / Commerce)', labelHi: '12वीं उत्तीर्ण (कला अथवा वाणिज्य वर्ग)' },
              { id: 'Class 12th (Science)', label: 'Class 12th Passed (Science / PCM)', labelHi: '12वीं उत्तीर्ण (विज्ञान / भौतिकी-गणित)' },
              { id: 'College Dropout', label: 'Some College / College Dropout', labelHi: 'कॉलेज ड्रॉपआउट / सामान्य बीए अधूरा' }
            ].map(edu => (
              <div
                key={edu.id}
                onClick={() => onUpdateLearner({ ...learner, educationLevel: edu.id as any })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                  learner.educationLevel === edu.id
                    ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className={`w-5 h-5 ${learner.educationLevel === edu.id ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className="font-semibold text-sm text-slate-900">
                    {language === 'hi' ? edu.labelHi : edu.label}
                  </span>
                </div>
                {learner.educationLevel === edu.id && (
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow text-xs flex items-center gap-2 transition"
            >
              <span>{language === 'hi' ? 'अगला: रुचि व प्राथमिकता' : 'Next: Work Style & Interests'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Work Style & Interests */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'hi' ? 'कदम 3: कार्यशैली एवं करियर प्राथमिकता' : 'Step 3: Work Style & Priorities'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'आपको किस प्रकार का काम करना पसंद है?'
                : 'Select the working environment and career goal that excites you most.'}
            </p>
          </div>

          {/* Work Style Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {language === 'hi' ? 'आपकी पसंदीदा कार्यशैली (Preferred Work Style)' : 'Preferred Work Style'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {workStyles.map(ws => (
                <div
                  key={ws}
                  onClick={() => onUpdateLearner({ ...learner, preferredWorkStyle: ws })}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                    learner.preferredWorkStyle === ws
                      ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="font-semibold text-xs sm:text-sm text-slate-900">
                    {language === 'hi' ? workStylesHi[ws] : ws}
                  </span>
                  {learner.preferredWorkStyle === ws && (
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Priority Goal */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {language === 'hi' ? 'सबसे बड़ी प्राथमिकता (Primary Career Goal)' : 'Primary Goal'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Immediate Job', 'High Earning Potential', 'Government Sector', 'Self Employment / Shop'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onUpdateLearner({ ...learner, priority: p })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    learner.priority === p
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p === 'Immediate Job' && (language === 'hi' ? 'तुरंत नौकरी' : 'Immediate Job')}
                  {p === 'High Earning Potential' && (language === 'hi' ? 'उच्च कमाई' : 'High Earning')}
                  {p === 'Government Sector' && (language === 'hi' ? 'सरकारी क्षेत्र' : 'Govt Cadre')}
                  {p === 'Self Employment / Shop' && (language === 'hi' ? 'खुद की दुकान/बिजनेस' : 'Self Employed')}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Interests Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {language === 'hi' ? 'विशिष्ट रुचियां (Select Specific Interests)' : 'Select Sector Interests'}
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(opt => {
                const isSelected = learner.interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-slate-900 text-amber-400 border border-amber-400'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent'
                    }`}
                  >
                    {language === 'hi' ? opt.labelHi : opt.label} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow text-xs flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{language === 'hi' ? 'करियर मिलान परिणाम देखें' : 'View Verified Matches'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Transparent Match Results */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {language === 'hi'
                    ? `${learner.name} के लिए पारदर्शी करियर सिफारिशें`
                    : `Verified Pathway Recommendations for ${learner.name}`}
                </h3>
                <p className="text-xs text-slate-600">
                  {language === 'hi'
                    ? `स्थान: ${learner.district}, ${learner.state} | प्राथमिकता: ${learner.priority}`
                    : `District: ${learner.district} | Education: ${learner.educationLevel}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-emerald-800 hover:underline bg-white px-3 py-1.5 rounded-lg border border-emerald-300"
            >
              {language === 'hi' ? 'प्रोफ़ाइल बदलें' : 'Edit Profile'}
            </button>
          </div>

          {/* Results Cards List */}
          <div className="space-y-4">
            {rankedTrades.slice(0, 5).map(({ trade, breakdown }, idx) => {
              const isSelected = learner.selectedTradeId === trade.id;
              const isExpanded = expandedWhyTradeId === trade.id;

              return (
                <div
                  key={trade.id}
                  className={`bg-white rounded-2xl border-2 transition overflow-hidden shadow-sm ${
                    isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                            Rank #{idx + 1}
                          </span>
                          <span className="bg-sky-100 text-sky-800 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                            NSQF Level {trade.nsqfLevel}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {trade.durationMonths} {language === 'hi' ? 'महीने' : 'Months'}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">
                          {language === 'hi' ? trade.titleHi : trade.title}
                        </h4>
                        <p className="text-xs text-amber-700 font-semibold mt-0.5">
                          {language === 'hi' ? trade.taglineHi : trade.tagline}
                        </p>
                      </div>

                      {/* Compatibility Score */}
                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                        <div>
                          <span className="text-2xl font-extrabold text-emerald-600">
                            {breakdown.overallScore}%
                          </span>
                          <span className="block text-[10px] text-slate-500 font-medium">
                            {language === 'hi' ? 'प्रोफ़ाइल अनुकूलता' : 'Compatibility Est.'}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            const speechMsg = language === 'hi'
                              ? `${trade.titleHi}। शुरुआती वेतन ${trade.salary.entryLevel}। 3 वर्ष बाद ${trade.salary.midLevel3Yr}। प्लेसमेंट दर ${trade.placementRate} प्रतिशत।`
                              : `${trade.title}. Starting salary ${trade.salary.entryLevel}. After 3 years ${trade.salary.midLevel3Yr}. Placement rate ${trade.placementRate} percent.`;
                            onSpeak(speechMsg);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                          title="Listen speech"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'hi' ? trade.shortDescriptionHi : trade.shortDescription}
                    </p>

                    {/* Quick Metrics Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'शुरुआती वेतन' : 'Entry Salary'}</span>
                        <span className="font-bold text-slate-800">{trade.salary.entryLevel}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? '3 वर्ष बाद वेतन' : '3-Year Salary'}</span>
                        <span className="font-bold text-slate-800">{trade.salary.midLevel3Yr}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'सत्यापित प्लेसमेंट' : 'Placement Rate'}</span>
                        <span className="font-bold text-emerald-600">{trade.placementRate}% verified</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'उच्च शिक्षा' : 'Degree Pathway'}</span>
                        <span className="font-bold text-slate-800">{language === 'hi' ? 'पॉलीटेक्निक लैटरल' : 'Lateral Entry'}</span>
                      </div>
                    </div>

                    {/* Expandable "Why am I seeing this?" Transparency Box */}
                    <div>
                      <button
                        onClick={() => setExpandedWhyTradeId(isExpanded ? null : trade.id)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t.whyAmISeeingThis}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs space-y-3">
                          <p className="text-slate-800 font-medium leading-relaxed">
                            {language === 'hi' ? breakdown.explanationHi : breakdown.explanation}
                          </p>

                          {/* Multi-Factor Scoring Transparency Progress Bars */}
                          <div className="space-y-1.5 pt-2 border-t border-amber-200/60 font-semibold text-slate-700">
                            <div className="flex justify-between text-[11px]">
                              <span>{t.interestWeight}</span>
                              <span className="font-bold text-emerald-700">{breakdown.interestFit}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown.interestFit}%` }} />
                            </div>

                            <div className="flex justify-between text-[11px] pt-1">
                              <span>{t.eligibilityWeight}</span>
                              <span className="font-bold text-emerald-700">{breakdown.eligibilityFit}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown.eligibilityFit}%` }} />
                            </div>

                            <div className="flex justify-between text-[11px] pt-1">
                              <span>{t.districtWeight}</span>
                              <span className="font-bold text-sky-700">{breakdown.districtFit}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${breakdown.districtFit}%` }} />
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-500 pt-1">
                            <strong>{language === 'hi' ? 'डेटा स्रोत:' : 'Source:'}</strong> {trade.dataSource}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selection CTAs */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          onSelectTradeForSession(trade.id);
                          onUpdateLearner({ ...learner, selectedTradeId: trade.id });
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          {isSelected
                            ? (language === 'hi' ? 'पसंदीदा ट्रेड चयनित ✓' : 'Selected as My Choice ✓')
                            : (language === 'hi' ? 'इसे मेरा पसंदीदा ट्रेड चुनें' : 'Select as My Preferred Trade')}
                        </span>
                      </button>

                      {isSelected && (
                        <button
                          onClick={onNavigateToFamilySession}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition"
                        >
                          <span>{language === 'hi' ? 'पारिवारिक निर्णय सत्र में ले जाएं' : 'Take to Family Session'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
