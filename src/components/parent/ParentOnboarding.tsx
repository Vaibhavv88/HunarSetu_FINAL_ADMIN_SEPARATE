import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { ParentDetailedProfile } from '../../types/parent';

interface ParentOnboardingProps {
  language: 'en' | 'hi';
  onComplete: (profile: ParentDetailedProfile) => void;
  onSpeak?: (text: string) => void;
}

export const ParentOnboarding: React.FC<ParentOnboardingProps> = ({
  language,
  onComplete,
  onSpeak
}) => {
  // Screen 0: Welcome, Screen 1-6: Onboarding steps
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [parentName, setParentName] = useState<string>('');
  const [guardianRelation, setGuardianRelation] = useState<ParentDetailedProfile['guardianRelation']>('Father');
  const [childName, setChildName] = useState<string>('');
  const [childAge, setChildAge] = useState<number>(18);
  const [childEducation, setChildEducation] = useState<ParentDetailedProfile['childEducation']>('Class 12');
  const [state, setState] = useState<string>('Uttar Pradesh');
  const [district, setDistrict] = useState<string>('Kanpur Nagar');
  const [locality, setLocality] = useState<ParentDetailedProfile['locality']>('Semi-Urban');
  const [topPriorities, setTopPriorities] = useState<string[]>([]);
  const [mainConcern, setMainConcern] = useState<string>('');
  const [familyGoal, setFamilyGoal] = useState<string>('');

  const priorityOptions = [
    { id: 'Good income', label: 'Good income & earnings', labelHi: 'अच्छी कमाई व वेतन' },
    { id: 'Job security', label: 'Job security & stability', labelHi: 'पक्की नौकरी की गारंटी' },
    { id: 'Career growth', label: 'Long-term career growth', labelHi: 'भविष्य में तरक्की व पदोन्नति' },
    { id: 'Safety', label: 'Workplace safety & health', labelHi: 'सुरक्षित कामकाज का माहौल' },
    { id: 'Work near home', label: 'Job in home district / nearby', labelHi: 'घर या जिले के आसपास नौकरी' },
    { id: 'Further education', label: 'Option to study B.Tech/Degree later', labelHi: 'आगे चलकर डिग्री/बी.टेक की सुविधा' },
    { id: 'Affordable training', label: 'Affordable / free training (No debt)', labelHi: 'सस्ती या निःशुल्क ट्रेनिंग (कोई कर्ज नहीं)' },
    { id: 'Government opportunities', label: 'Government & PSU vacancies', labelHi: 'सरकारी नौकरी व रेलवे के अवसर' },
    { id: 'Self-employment', label: 'Starting independent shop / agency', labelHi: 'खुद की दुकान या कांट्रैक्टिंग' },
    { id: 'Social acceptance', label: 'Social prestige & respect', labelHi: 'समाज और रिश्तेदारों में सम्मान' },
    { id: 'Not sure yet', label: 'Not sure yet (Help me decide)', labelHi: 'अभी पूरी तरह तय नहीं है' }
  ];

  const concernOptions = [
    { id: 'I do not know enough about vocational careers.', label: "I don't know enough about vocational careers.", labelHi: 'मुझे वोकेशनल/कौशल करियर के बारे में ज्यादा जानकारी नहीं है।' },
    { id: 'I am worried about job opportunities.', label: "I'm worried about job opportunities.", labelHi: 'मुझे चिंता है कि कोर्स के बाद नौकरी मिलेगी या नहीं।' },
    { id: 'I am worried about income.', label: "I'm worried about income & salary stability.", labelHi: 'मुझे वेतन और आर्थिक स्थिरता को लेकर चिंता है।' },
    { id: 'I am worried about my child future growth.', label: "I'm worried about my child's future growth & promotions.", labelHi: 'मुझे बच्चे के आगे बढ़ने और प्रमोशन की चिंता है।' },
    { id: 'I am worried about safety.', label: "I'm worried about physical safety & work conditions.", labelHi: 'मुझे शारीरिक सुरक्षा और कारखाने के माहौल की चिंता है।' },
    { id: 'I am not sure whether vocational education is better for my child.', label: "I'm not sure whether vocational is better than general degree.", labelHi: 'मुझे संशय है कि सामान्य बीए/कॉलेज डिग्री से यह बेहतर है या नहीं।' },
    { id: 'My child and I want different careers.', label: 'My child and I want different careers (Disagreement).', labelHi: 'मेरी पसंद और मेरे बच्चे की पसंद अलग-अलग है।' },
    { id: 'Other', label: 'Other concern', labelHi: 'अन्य कोई संशय' }
  ];

  const goalOptions = [
    { id: 'Understand vocational careers', label: 'Understand vocational careers in simple words', labelHi: 'वोकेशनल करियर को आसान भाषा में समझना' },
    { id: 'Compare career options', label: 'Compare vocational careers with regular college degrees', labelHi: 'सामान्य कॉलेज डिग्री और वोकेशनल की निष्पक्ष तुलना' },
    { id: 'Understand earning potential', label: 'Understand real earnings & salary progression', labelHi: 'वास्तविक कमाई और वेतन वृद्धि को समझना' },
    { id: 'Understand career growth', label: 'Understand how my child can reach B.Tech or supervisor', labelHi: 'बच्चा आगे बी.टेक या सुपरवाइजर कैसे बनेगा, यह जानना' },
    { id: 'Discuss with my child', label: 'Have a calm, guided discussion with my child', labelHi: 'अपने बच्चे के साथ बैठकर शांति से चर्चा करना' },
    { id: 'Find training opportunities', label: 'Find verified Government ITIs and training centers nearby', labelHi: 'आसपास के सरकारी आईटीआई और ट्रेनिंग सेंटर खोजना' },
    { id: 'Talk to a counsellor', label: 'Talk to an expert human skilling counsellor', labelHi: 'सरकारी प्रमाणित काउंसलर से फोन पर बात करना' },
    { id: 'I am still exploring', label: "I'm still exploring", labelHi: 'अभी केवल जानकारी ले रहे हैं' }
  ];

  const togglePriority = (id: string) => {
    setTopPriorities(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const profile: ParentDetailedProfile = {
      parentName: parentName.trim() || (language === 'hi' ? 'अभिभावक' : 'Parent'),
      guardianRelation,
      childName: childName.trim() || (language === 'hi' ? 'बच्चा' : 'Child'),
      childAge: childAge || 18,
      childEducation: childEducation || 'Class 12',
      state,
      district,
      locality,
      topPriorities: topPriorities.length > 0 ? topPriorities : ['Good income', 'Job security'],
      mainConcern: mainConcern || 'I am worried about income and job stability.',
      familyGoal: familyGoal || 'Discuss with my child',
      onboardingCompleted: true,
      childConnected: false,
      savedConcerns: ['income', 'job_security', 'further_study']
    };

    onComplete(profile);
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
                ? 'आइए आपके बच्चे की करियर यात्रा और आपकी प्राथमिकताओं को समझते हैं।'
                : "Let's understand your child's career journey and your family's priorities."}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 text-left space-y-2 font-medium">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <HeartHandshake className="w-4 h-4 text-amber-500" />
              <span>{language === 'hi' ? 'अभिभावकों के लिए निष्पक्ष मंच:' : 'Designed for Parents & Guardians:'}</span>
            </div>
            <p>
              {language === 'hi'
                ? 'यह मंच किसी फैसले को थोपता नहीं है। यह कमाई, सुरक्षा, डिग्री और नौकरियों के सत्यापित साक्ष्य दिखाता है ताकि परिवार मिलकर सही निर्णय ले सके।'
                : 'This platform does not force decisions. It provides verified facts on income, safety, and degree progression so families can decide together.'}
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
            {/* Dots */}
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

        {/* STEP 1: PARENT NAME */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'हम आपको किस नाम से संबोधित करें?' : 'What should we call you?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'अपना नाम और बच्चे से संबंध चुनें।' : 'Enter your name and your relation to the student.'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'hi' ? 'अभिभावक का नाम (Your Name)' : 'Parent / Guardian Name'}
                </label>
                <input
                  type="text"
                  autoFocus
                  value={parentName}
                  onChange={e => setParentName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && parentName.trim() && setCurrentStep(2)}
                  placeholder={language === 'hi' ? 'उदा. अभिभावक का नाम...' : 'e.g. Parent Name...'}
                  className="w-full text-base sm:text-lg font-bold px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'hi' ? 'बच्चे से आपका रिश्ता:' : 'Relation to Student:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Father', 'Mother', 'Guardian', 'Elder Sibling'] as const).map(rel => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setGuardianRelation(rel)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        guardianRelation === rel
                          ? 'bg-amber-500 text-slate-950 border-amber-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {rel === 'Father' && (language === 'hi' ? 'पिताजी' : 'Father')}
                      {rel === 'Mother' && (language === 'hi' ? 'माताजी' : 'Mother')}
                      {rel === 'Guardian' && (language === 'hi' ? 'अभिभावक' : 'Guardian')}
                      {rel === 'Elder Sibling' && (language === 'hi' ? 'बड़ा भाई/बहन' : 'Elder Sibling')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {parentName.trim() && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2 animate-in fade-in">
                <span>👋</span>
                <span>
                  {language === 'hi'
                    ? `आपसे मिलकर खुशी हुई, ${parentName.trim()} जी 👋`
                    : `Nice to meet you, ${parentName.trim()} 👋`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHILD INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'आप अपने बच्चे के बारे में क्या बताना चाहेंगे?' : 'What would you like to tell us about your child?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'बच्चे का नाम, आयु और वर्तमान कक्षा दर्ज करें।' : "Enter your child's name, age, and current education."}
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'बच्चे का नाम (Child’s Name)' : "Child's Name"}
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={e => setChildName(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. बच्चे का नाम...' : 'e.g. Child Name...'}
                  className="w-full font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'बच्चे की आयु (Age)' : "Child's Age (Years)"}
                  </label>
                  <input
                    type="number"
                    min={14}
                    max={30}
                    value={childAge}
                    onChange={e => setChildAge(parseInt(e.target.value) || 18)}
                    className="w-full font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'वर्तमान पढ़ाई (Education)' : 'Current Education'}
                  </label>
                  <select
                    value={childEducation}
                    onChange={e => setChildEducation(e.target.value as any)}
                    className="w-full font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none bg-white"
                  >
                    <option value="Class 10">Class 10 (10वीं कक्षा)</option>
                    <option value="Class 12">Class 12 (12वीं कक्षा)</option>
                    <option value="ITI">ITI Student</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                    <option value="College">College Degree / BA/BSc</option>
                    <option value="Other">Other / 8th-9th</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'आपका परिवार कहाँ रहता है?' : 'Where does your family live?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'आपके गृह जिले में उपलब्ध सरकारी ट्रेनिंग और रोजगार क्लस्टर देखें।' : 'Helps pinpoint local training centers and industries in your home district.'}
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

        {/* STEP 4: WHAT MATTERS MOST TO YOU? */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'बच्चे के करियर में आपके लिए सबसे महत्वपूर्ण क्या है?' : 'What is most important when thinking about your child’s career?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'एक या एक से अधिक प्राथमिकताएं चुनें (कार्ड्स पर टैप करें):' : 'Select one or more factors that matter most to your family:'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
              {priorityOptions.map(opt => {
                const isSelected = topPriorities.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => togglePriority(opt.id)}
                    className={`p-3 rounded-2xl border-2 text-left font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 text-slate-950 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{language === 'hi' ? opt.labelHi : opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: MAIN CONCERN */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'इस समय आपकी सबसे बड़ी चिंता क्या है?' : 'What is your biggest concern right now?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'अपना प्राथमिक संशय चुनें जिसका आप सत्यापन देखना चाहते हैं:' : 'Select your primary doubt or question:'}
              </p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {concernOptions.map(opt => {
                const isSelected = mainConcern === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMainConcern(opt.id)}
                    className={`w-full p-3 rounded-2xl border-2 text-left text-xs font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 text-slate-950 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{language === 'hi' ? opt.labelHi : opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: FAMILY GOAL */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'आप इस मंच से क्या सहायता चाहते हैं?' : 'What would you like help with?'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'अपनी मुख्य पारिवारिक आवश्यकता चुनें:' : 'Select how HunarSetu can best assist your family:'}
              </p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {goalOptions.map(opt => {
                const isSelected = familyGoal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFamilyGoal(opt.id)}
                    className={`w-full p-3 rounded-2xl border-2 text-left text-xs font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 text-slate-950 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{language === 'hi' ? opt.labelHi : opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>

            {familyGoal && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 text-center animate-in fade-in">
                {language === 'hi'
                  ? 'बहुत अच्छा! आप अपने बच्चे की करियर यात्रा तलाशने के लिए तैयार हैं।'
                  : "You're ready to explore your child's career journey."}
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
              disabled={currentStep === 1 && !parentName.trim()}
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
              <span>{language === 'hi' ? 'अभिभावक डैशबोर्ड खोलें (Continue)' : 'Continue to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
