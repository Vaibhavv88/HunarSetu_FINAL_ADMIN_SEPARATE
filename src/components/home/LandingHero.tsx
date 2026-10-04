import React from 'react';
import { Compass, Users, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Sparkles, Building2, Award, BookOpen, Volume2 } from 'lucide-react';
import { I18N } from '../../i18n/translations';
import { speakText } from '../../services/speechService';

interface LandingHeroProps {
  language: 'en' | 'hi';
  onNavigate: (tab: string) => void;
  onSpeak: (text: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  language,
  onNavigate,
  onSpeak
}) => {
  const t = I18N[language];

  const speechIntro = language === 'hi'
    ? 'हुनरसेतु में आपका स्वागत है। यह भारत का पहला एआई-सक्षम परिवार एवं कौशल करियर परामर्श मंच है, जहाँ विद्यार्थी और माता-पिता मिलकर सही करियर का फैसला लेते हैं।'
    : 'Welcome to HunarSetu, India’s AI-enabled vocational career and family decision-support platform, bridging youth aspirations and parental reassurance.';

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? 'सत्यापित करियर मार्गदर्शन' : 'Verified Career Guidance'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {language === 'hi' ? (
              <>
                कौशल निर्णय अब आसान: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400">
                  विद्यार्थी और परिवार का साझा फैसला
                </span>
              </>
            ) : (
              <>
                Family + Learner Career Decision Support <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400">
                  Built on Verified NSQF Evidence
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {t.subTagline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('learner')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 text-sm transition transform hover:-translate-y-0.5"
            >
              <span>{language === 'hi' ? 'विद्यार्थी: अपना हुनर खोजें' : 'Start Learner Discovery'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('parent')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-700 flex items-center gap-2 text-sm transition"
            >
              <span>{language === 'hi' ? 'अभिभावक: अपनी चिंताएं पूछें' : 'Parent Perspective & Anxieties'}</span>
            </button>

            <button
              onClick={() => onSpeak(speechIntro)}
              className="p-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-amber-400 transition"
              title={t.voiceSpeak}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Five Pillar Concept Banner */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-5 backdrop-blur shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
                {language === 'hi' ? 'हुनरसेतु का मूल मंत्र' : 'HunarSetu Decision Cycle'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-semibold">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 text-slate-200">
                  <span className="text-amber-400 block font-bold text-sm">1. Understand</span>
                  {language === 'hi' ? 'समझें' : 'Aspirations'}
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 text-slate-200">
                  <span className="text-sky-400 block font-bold text-sm">2. Compare</span>
                  {language === 'hi' ? 'तुलना करें' : 'Trade Options'}
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 text-slate-200">
                  <span className="text-emerald-400 block font-bold text-sm">3. Discuss</span>
                  {language === 'hi' ? 'संवाद करें' : 'Family Session'}
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 text-slate-200">
                  <span className="text-purple-400 block font-bold text-sm">4. Verify</span>
                  {language === 'hi' ? 'सत्यापित करें' : 'NSQF Evidence'}
                </div>
                <div className="col-span-2 sm:col-span-1 bg-amber-500/20 p-2.5 rounded-lg border border-amber-500/40 text-amber-300">
                  <span className="text-amber-400 block font-bold text-sm">5. Decide</span>
                  {language === 'hi' ? 'निर्णय लें' : 'Joint Path'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Indian Context Problem Statement vs HunarSetu Solution */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {language === 'hi' ? 'भारतीय परिवारों में वोकेशनल करियर की चुनौतियां' : 'The Problem HunarSetu Solves in Indian Households'}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            {language === 'hi'
              ? 'ग्रामीण और अर्ध-शहरी परिवारों में करियर का फैसला केवल छात्र का नहीं, बल्कि माता-पिता का होता है।'
              : 'Enrolment and retention in vocational training is shaped as much by family perception as by the learner’s own interest.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem Card */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <span>{language === 'hi' ? 'मौजूदा व्यवस्था की असफलता (Degree Trap)' : 'The Traditional Degree Trap'}</span>
            </div>
            <ul className="space-y-3 text-sm text-rose-900">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>
                  {language === 'hi'
                    ? 'लाखों युवा साधारण बीए/बीएससी कर रहे हैं और 4-6 वर्षों तक सरकारी परीक्षा की महंगी कोचिंग में समय गंवाते हैं।'
                    : 'Millions pursue general BA/BSc degrees without market demand, spending 4–6 prime youth years in coaching centers.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>
                  {language === 'hi'
                    ? 'माता-पिता को लगता है कि आईटीआई/कौशल का काम "छोटा या कम दर्जे का" है और इसमें कम कमाई है।'
                    : 'Parents perceive vocational trades as a lower-status alternative to academic degrees, fearing poor income.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>
                  {language === 'hi'
                    ? 'करियर गाइडेंस टूल्स केवल छात्रों के लिए बनते हैं, अभिभावकों की शंकाओं का कोई समाधान नहीं होता।'
                    : 'Existing career tools focus only on the student and ignore the parents who hold veto power in the household.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{language === 'hi' ? 'हुनरसेतु का प्रमाणित समाधान (The HunarSetu Solution)' : 'The HunarSetu Family Decision System'}</span>
            </div>
            <ul className="space-y-3 text-sm text-emerald-950">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  {language === 'hi'
                    ? 'सत्यापित साक्ष्य: NCVET व DGT से प्रमाणित वेतनमान, प्लेसमेंट दर और स्थानीय अवसर।'
                    : 'Verified Evidence: NCVET & DGT real earnings bands, placement rates, and district employer clusters.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  {language === 'hi'
                    ? 'साझा पारिवारिक सत्र: जहाँ छात्र और अभिभावक की असहमति को साक्ष्यों से सुलझाया जाता है।'
                    : 'Joint Family Session: Structured mediation identifying disagreements and proving debt-free progression.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  {language === 'hi'
                    ? 'लेटरल एंट्री की गारंटी: 2nd ईयर पॉलीटेक्निक डिप्लोमा से लेकर बी.टेक तक डिग्री के रास्ते हमेशा खुले।'
                    : 'Degree Lateral Entry: Guaranteed AICTE progression to 2nd-year Polytechnic Diplomas, B.Voc and B.Tech.'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            onClick={() => onNavigate('family-session')}
            className="bg-white border border-slate-200 hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-3 group-hover:bg-amber-500 group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {language === 'hi' ? 'पारिवारिक निर्णय सत्र' : 'Family Career Session'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'छात्र और माता-पिता की अलग-अलग पसंद की तुलना करें और साक्ष्यों से आम सहमति बनाएं।'
                : 'Resolve preference divergence between learner and parents through structured comparison.'}
            </p>
          </div>

          <div
            onClick={() => onNavigate('roadmap')}
            className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {language === 'hi' ? 'कौशल करियर रोडमैप' : 'Interactive NSQF Roadmap'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? '10वीं/12वीं से लेकर आईटीआई, अप्रेंटिसशिप, डिप्लोमा लैटरल एंट्री और सरकारी कांट्रैक्टर तक का सफर।'
                : 'Class 10/12 to ITI, paid apprenticeship, lateral diploma, and Class-A certified contractor.'}
            </p>
          </div>

          <div
            onClick={() => onNavigate('districts')}
            className="bg-white border border-slate-200 hover:border-sky-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 mb-3 group-hover:bg-sky-600 group-hover:text-white transition">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {language === 'hi' ? 'स्थानीय अवसर (जिला क्लस्टर)' : 'Local District Explorer'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'कानपुर, वाराणसी, पुणे, सूरत जैसे जिलों में सरकारी आईटीआई और प्रमुख कंपनियों के अवसर।'
                : 'Explore training centers, active apprenticeships, and local manufacturing clusters.'}
            </p>
          </div>

          <div
            onClick={() => onNavigate('counsellor')}
            className="bg-white border border-slate-200 hover:border-purple-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-3 group-hover:bg-purple-600 group-hover:text-white transition">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {language === 'hi' ? 'मानव काउंसलर एस्केलेशन' : 'Certified Human Counsellor'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'यदि एआई परामर्श के बाद भी मतभेद बना रहे, तो प्रमाणित सरकारी काउंसलर से सीधी कॉल बुक करें।'
                : 'Escalate complex family resistance to certified skilling counsellors with tracked priority.'}
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Verification Transparency Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'hi' ? 'डेटा विश्वसनीयता एवं पारदर्शिता' : 'Zero AI Hallucination Policy'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              {language === 'hi'
                ? 'काल्पनिक वादों के बजाय सत्यापित सरकारी साक्ष्य'
                : 'Real Verification, Not Generic AI Chatbot Promises'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'hi'
                ? 'हुनरसेतु नौकरी या वेतन की झूठी गारंटी नहीं देता। प्रत्येक आंकड़ा NCVET, DGT और स्किल इंडिया के आधिकारिक सर्वे पर आधारित है, जिसे प्रोटोटाइप डेटासेट के रूप में पारदर्शी रूप से दर्शाया गया है।'
                : 'HunarSetu never fabricates placement numbers or makes exaggerated income claims. All metrics are cross-referenced with NCVET tracer studies and labeled with strict source attribution.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('admin')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-4 py-3 rounded-xl transition text-center"
            >
              {language === 'hi' ? 'प्रशासन एनालिटिक्स देखें' : 'View Admin Resistance Analytics'}
            </button>

          </div>
        </div>
      </section>
    </div>
  );
};
