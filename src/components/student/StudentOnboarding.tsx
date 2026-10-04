import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, User, GraduationCap, MapPin, Wrench, Briefcase, Target, Volume2 } from 'lucide-react';
import { StudentProfile } from '../../types/student';

interface StudentOnboardingProps {
  language: 'en' | 'hi';
  onComplete: (profile: StudentProfile) => void;
  onSpeak?: (text: string) => void;
}

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({
  language,
  onComplete,
  onSpeak
}) => {
  // Screen 0: Welcome, Screen 1-6: Steps
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [name, setName] = useState<string>('');
  const [education, setEducation] = useState<StudentProfile['education']>('');
  const [stream, setStream] = useState<string>('');
  const [state, setState] = useState<string>('Uttar Pradesh');
  const [district, setDistrict] = useState<string>('Kanpur Nagar');
  const [locality, setLocality] = useState<StudentProfile['locality']>('Semi-Urban');
  const [interests, setInterests] = useState<string[]>([]);
  const [workPreference, setWorkPreference] = useState<string>('');
  const [careerGoal, setCareerGoal] = useState<string>('');

  const interestOptions = [
    { id: 'Technology', label: 'Technology', labelHi: 'टेक्नोलॉजी / डिजिटल', icon: '💻' },
    { id: 'Machines', label: 'Machines', labelHi: 'मशीनें व उपकरण', icon: '⚙️' },
    { id: 'Electronics', label: 'Electronics', labelHi: 'इलेक्ट्रॉनिक्स', icon: '⚡' },
    { id: 'Automobiles', label: 'Automobiles & EV', labelHi: 'गाड़ियाँ व ईवी', icon: '🚗' },
    { id: 'Green Energy', label: 'Green Energy & Solar', labelHi: 'सोलर व ग्रीन एनर्जी', icon: '☀️' },
    { id: 'Healthcare', label: 'Healthcare & Patient Care', labelHi: 'स्वास्थ्य सेवा', icon: '🏥' },
    { id: 'Computers', label: 'IT & Networking', labelHi: 'कंप्यूटर नेटवर्किंग', icon: '🖥️' },
    { id: 'Design', label: 'Design & Garments', labelHi: 'डिजाइन व परिधान', icon: '✂️' },
    { id: 'Agriculture', label: 'Drones & Agriculture', labelHi: 'ड्रोन व आधुनिक कृषि', icon: '🌾' },
    { id: 'Food', label: 'Food & Dairy', labelHi: 'खाद्य व डेयरी', icon: '🥛' },
    { id: 'Beauty & Wellness', label: 'Beauty & Wellness', labelHi: 'ब्यूटी व वेलनेस', icon: '✨' },
    { id: 'Business', label: 'Business & Shop', labelHi: 'दुकान व स्वरोजगार', icon: '🏪' },
    { id: 'Construction', label: 'Construction & Welder', labelHi: 'फैब्रिकेशन व निर्माण', icon: '🏗️' },
    { id: 'Other', label: 'Other Skills', labelHi: 'अन्य हुनर', icon: '🔍' }
  ];

  const workPrefOptions = [
    { id: 'Working with machines', label: 'Working with machines', labelHi: 'मशीनों व औजारों के साथ काम करना' },
    { id: 'Working with computers', label: 'Working with computers', labelHi: 'कंप्यूटर और सॉफ्टवेयर पर काम करना' },
    { id: 'Working with people', label: 'Working with people / patients', labelHi: 'लोगों या मरीजों की सहायता करना' },
    { id: 'Outdoor work', label: 'Outdoor / field work', labelHi: 'खुले मैदान या फील्ड में काम करना' },
    { id: 'Creative work', label: 'Creative & design work', labelHi: 'रचनात्मक व डिजाइनिंग का काम' },
    { id: 'Practical / hands-on work', label: 'Practical / hands-on work', labelHi: 'व्यावहारिक / हाथों से हुनर का काम' },
    { id: 'Running a business', label: 'Running my own shop / business', labelHi: 'अपनी खुद की दुकान या व्यवसाय चलाना' },
    { id: 'Not sure yet', label: 'Not sure yet (Help me decide)', labelHi: 'अभी पक्का नहीं पता' }
  ];

  const goalOptions = [
    { id: 'Get a job quickly', label: 'Get a job quickly (within 6–12 months)', labelHi: 'जल्दी नौकरी पाना (6-12 महीने में)' },
    { id: 'Build a long-term career', label: 'Build a long-term technical career', labelHi: 'लंबे समय का तकनीकी करियर बनाना' },
    { id: 'Start a business', label: 'Start my own repair shop / business', labelHi: 'अपनी खुद की दुकान/वर्कशॉप शुरू करना' },
    { id: 'Continue higher education', label: 'Continue higher education (Diploma / B.Tech)', labelHi: 'आगे उच्च शिक्षा (डिप्लोमा / बी.टेक) जारी रखना' },
    { id: 'Work near home', label: 'Work in my home district / town', labelHi: 'अपने जिले या घर के पास काम करना' },
    { id: 'Work anywhere in India', label: 'Ready to work anywhere in India', labelHi: 'देश के किसी भी शहर में काम करना' },
    { id: 'I am not sure yet', label: "I'm not sure yet", labelHi: 'अभी स्पष्ट नहीं है' }
  ];

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const finalProfile: StudentProfile = {
      name: name.trim() || (language === 'hi' ? 'विद्यार्थी' : 'Student'),
      education: education || 'Class 10',
      stream,
      state,
      district,
      locality,
      interests: interests.length > 0 ? interests : ['Technology', 'Machines'],
      workPreference: workPreference || 'Practical / hands-on work',
      careerGoal: careerGoal || 'Build a long-term career',
      onboardingCompleted: true,
      assessmentCompleted: false,
      savedCareerIds: [],
      careerPlanTasks: [
        { id: 't1', text: 'Complete eligibility check for chosen trade', completed: false },
        { id: 't2', text: 'Visit nearest Government ITI or PMKVY training center', completed: false },
        { id: 't3', text: 'Discuss verified evidence with parents', completed: false },
        { id: 't4', text: 'Review 3-year apprenticeship stipend details', completed: false }
      ]
    };

    onComplete(finalProfile);
  };

  // SCREEN 0: WELCOME
  if (currentStep === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm">
            👋
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi' ? 'स्वागत है 👋' : 'Welcome 👋'}
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'hi'
                ? 'आइए आपके बारे में थोड़ा जानते हैं ताकि आपके लिए सबसे उपयुक्त वोकेशनल करियर और हुनर खोज सकें।'
                : "Let's get to know you and help you explore your vocational career path."}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 text-left space-y-2 font-medium">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'hi' ? 'सिर्फ 6 आसान सवाल:' : 'Just 6 quick steps:'}</span>
            </div>
            <p>
              {language === 'hi'
                ? 'आपका नाम, वर्तमान पढ़ाई, जिला, और आपकी रुचियां — ताकि कोई अंधाधुंध सुझाव न मिले।'
                : 'Your name, education, district, and interests — so you get real, tailored recommendations.'}
            </p>
          </div>

          <button
            onClick={() => setCurrentStep(1)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
          >
            <span>{language === 'hi' ? 'शुरू करें (Get Started)' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Progress Bar & Step Counter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              {language === 'hi' ? `चरण ${currentStep} / 6` : `Step ${currentStep} of 6`}
            </span>
            {/* Visual Dots */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <span
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    s === currentStep
                      ? 'bg-amber-500 scale-125'
                      : s < currentStep
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: NAME */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'हम आपको किस नाम से बुलाएं?' : 'What should we call you?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'अपना नाम या पसंदीदा उपनाम दर्ज करें।' : 'Please enter your first or full name.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'hi' ? 'आपका नाम' : 'Your Name'}
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && setCurrentStep(2)}
                placeholder={language === 'hi' ? 'उदा. अमन, प्रिया, राहुल...' : 'e.g. Aman, Priya, Rahul...'}
                className="w-full text-base sm:text-lg font-bold px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:outline-none transition"
              />
            </div>

            {name.trim() && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2 animate-in fade-in">
                <span>👋</span>
                <span>
                  {language === 'hi'
                    ? `आपसे मिलकर खुशी हुई, ${name.trim()} 👋`
                    : `Nice to meet you, ${name.trim()} 👋`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: EDUCATION */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'आप अभी क्या पढ़ाई कर रहे हैं?' : 'What are you currently studying?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'आपकी वर्तमान कक्षा या सबसे हालिया शैक्षणिक स्तर चुनें।'
                  : 'Select your current grade or highest educational level.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Class 10', label: 'Class 10', labelHi: '10वीं कक्षा (Class 10)' },
                { id: 'Class 12', label: 'Class 12', labelHi: '12वीं कक्षा (Class 12)' },
                { id: 'ITI', label: 'ITI Student', labelHi: 'आईटीआई (ITI)' },
                { id: 'Diploma', label: 'Diploma / Polytechnic', labelHi: 'पॉलीटेक्निक डिप्लोमा' },
                { id: 'College', label: 'College / Degree', labelHi: 'कॉलेज स्नातक' },
                { id: 'Other', label: 'Other / Dropout', labelHi: 'अन्य / 8वीं-9वीं पास' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEducation(opt.id as any)}
                  className={`p-3.5 rounded-2xl border-2 text-xs font-bold text-left transition flex items-center justify-between ${
                    education === opt.id
                      ? 'border-amber-500 bg-amber-50/70 text-slate-950 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <span>{language === 'hi' ? opt.labelHi : opt.label}</span>
                  {education === opt.id && <Check className="w-4 h-4 text-amber-600" />}
                </button>
              ))}
            </div>

            {(education === 'Class 12' || education === 'College') && (
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  {language === 'hi' ? 'विषय / स्ट्रीम (वैकल्पिक)' : 'Stream / Specialization (Optional)'}
                </label>
                <select
                  value={stream}
                  onChange={e => setStream(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none bg-white"
                >
                  <option value="">{language === 'hi' ? 'स्ट्रीम चुनें...' : 'Select stream...'}</option>
                  <option value="Science (PCM)">Science (PCM - Physics, Chemistry, Math)</option>
                  <option value="Science (PCB)">Science (PCB - Biology)</option>
                  <option value="Arts / Humanities">Arts / Humanities (कला वर्ग)</option>
                  <option value="Commerce">Commerce (वाणिज्य वर्ग)</option>
                  <option value="Vocational / Technical">Vocational / Technical</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'आप कहाँ रहते हैं?' : 'Where do you live?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'स्थानीय सरकारी आईटीआई और अप्रेंटिसशिप की मांग आपके जिले पर निर्भर करती है।'
                  : 'Local training centers and industrial opportunities match your district.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'राज्य (State)' : 'State'}
                </label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white focus:outline-none"
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
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'जिला (District)' : 'District'}
                </label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white focus:outline-none"
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
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700">
                {language === 'hi' ? 'परिवेश का प्रकार (Area Type)' : 'Area Type'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Rural', 'Semi-Urban', 'Urban'] as const).map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocality(loc)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      locality === loc
                        ? 'bg-amber-500 text-slate-950 border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {loc === 'Rural' && (language === 'hi' ? 'ग्रामीण (गाँव)' : 'Rural')}
                    {loc === 'Semi-Urban' && (language === 'hi' ? 'कस्बा / तहसील' : 'Semi-Urban')}
                    {loc === 'Urban' && (language === 'hi' ? 'शहरी (City)' : 'Urban')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: INTERESTS */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'आपको किस तरह की चीज़ें पसंद हैं?' : 'What kind of things interest you?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'एक या एक से अधिक रुचियां चुनें (कार्ड्स पर टैप करें)।'
                  : 'Select one or more interests that excite you.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {interestOptions.map(opt => {
                const isSelected = interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 text-slate-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white font-medium'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-xs leading-tight">
                      {language === 'hi' ? opt.labelHi : opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: WORK PREFERENCE */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'आपको कैसा काम करने में मज़ा आएगा?' : 'What kind of work would you enjoy?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'अपनी पसंदीदा कार्यशैली का चयन करें।'
                  : 'Select your preferred working environment.'}
              </p>
            </div>

            <div className="space-y-2">
              {workPrefOptions.map(opt => {
                const isSelected = workPreference === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWorkPreference(opt.id)}
                    className={`w-full p-3 rounded-2xl border-2 text-left text-xs font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 text-slate-950 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{language === 'hi' ? opt.labelHi : opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: CAREER GOAL */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'आप क्या हासिल करना चाहते हैं?' : 'What are you looking for?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'अपनी सबसे बड़ी करियर प्राथमिकता चुनें।'
                  : 'Select your primary career aspiration.'}
              </p>
            </div>

            <div className="space-y-2">
              {goalOptions.map(opt => {
                const isSelected = careerGoal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCareerGoal(opt.id)}
                    className={`w-full p-3 rounded-2xl border-2 text-left text-xs font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 text-slate-950 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{language === 'hi' ? opt.labelHi : opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                );
              })}
            </div>

            {careerGoal && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 text-center animate-in fade-in">
                {language === 'hi'
                  ? 'शानदार! आप अपनी करियर यात्रा तलाशने के लिए तैयार हैं।'
                  : "You're ready to explore your career path."}
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              disabled={currentStep === 1 && !name.trim()}
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow flex items-center gap-1.5 transition"
            >
              <span>{language === 'hi' ? 'आगे बढ़ें' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg flex items-center gap-2 transition transform hover:scale-105"
            >
              <span>{language === 'hi' ? 'मेरा करियर खोजें (Explore My Career)' : 'Explore My Career'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
