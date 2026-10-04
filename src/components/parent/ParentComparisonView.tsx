import React, { useState } from 'react';
import { Scale, CheckCircle2, XCircle, AlertCircle, ArrowRight, ShieldCheck, DollarSign, Clock, BookOpen, Volume2, Briefcase, GraduationCap, Building2 } from 'lucide-react';

interface ParentComparisonViewProps {
  language: 'en' | 'hi';
  onSpeak?: (text: string) => void;
  onOpenFamilySession?: () => void;
}

export const ParentComparisonView: React.FC<ParentComparisonViewProps> = ({
  language,
  onSpeak,
  onOpenFamilySession
}) => {
  const [selectedTopic, setSelectedTopic] = useState<'all' | 'financial' | 'jobs' | 'future'>('all');

  const comparisonCriteria = [
    {
      id: 'cost',
      category: 'financial',
      title: 'परिवार का कुल खर्च (Total Cost to Family)',
      titleEn: 'Total Cost to Family',
      generalDegree: '₹60,000 - ₹1,80,000 (कॉलेज फीस, किताबें, परीक्षा फॉर्म, कोचिंग व 3 साल का खर्च)',
      generalDegreeEn: '₹60,000 - ₹1,80,000 (3-year college tuition, exam fees, study materials & private coaching)',
      vocational: '₹2,400 - ₹15,000 (सरकारी ITI में नाममात्र फीस, PMKVY में 100% मुफ्त)',
      vocationalEn: '₹2,400 - ₹15,000 (Nominal fee in Govt ITIs, 100% free under PMKVY with DBT support)',
      verdict: 'vocational-wins',
      explanation: 'वोकेशनल कोर्स में परिवार पर कोई कर्ज या भारी फीस का बोझ नहीं पड़ता।',
      explanationEn: 'Vocational training prevents family indebtedness and provides near-free skilling.'
    },
    {
      id: 'earning-start',
      category: 'financial',
      title: 'कमाई कब शुरू होती है? (When Earnings Begin)',
      titleEn: 'When Earnings Begin',
      generalDegree: '3 से 5 साल बाद (डिग्री पूरी होने और प्रतियोगी परीक्षा की तैयारी के बाद)',
      generalDegreeEn: 'After 3 to 5 years (Only after graduating and preparing for competitive exams)',
      vocational: '6 से 12 महीने में (NAPS अप्रेंटिसशिप में पहले साल से ₹8,000 - ₹12,000/माह स्टाइपेंड)',
      vocationalEn: 'Within 6 to 12 months (Paid NAPS apprenticeship with ₹8,000 - ₹12,000/mo stipend)',
      verdict: 'vocational-wins',
      explanation: 'छात्र 18-19 वर्ष की उम्र में ही कमाना शुरू कर देता है और परिवार को सहारा देता है।',
      explanationEn: 'Student achieves financial self-reliance at 18-19 years old, helping the family.'
    },
    {
      id: 'job-readiness',
      category: 'jobs',
      title: 'नौकरी मिलने की संभावना (Job Readiness & Demand)',
      titleEn: 'Job Readiness & Placement Rate',
      generalDegree: '35% - 45% (सामान्य ग्रेजुएट्स के पास कोई प्रैक्टिकल हुनर नहीं होता, री-ट्रेनिंग जरूरी)',
      generalDegreeEn: '35% - 45% (General graduates lack practical industry skills, requiring re-training)',
      vocational: '75% - 88% (उद्योगों में प्रमाणित तकनीशियनों व ऑपरेटरों की लगातार भारी मांग)',
      vocationalEn: '75% - 88% (Constant high industry demand for certified operators and technicians)',
      verdict: 'vocational-wins',
      explanation: 'कंपनियां हाथ से काम जानने वाले युवाओं को तुरंत नौकरी पर रखती हैं।',
      explanationEn: 'Enterprises prefer directly employable candidates with hands-on workshop experience.'
    },
    {
      id: 'growth-ladder',
      category: 'future',
      title: 'आगे तरक्की व उच्च शिक्षा (Higher Education Mobility)',
      titleEn: 'Higher Education Mobility',
      generalDegree: 'एम.ए./एम.कॉम (जिसके बाद भी नौकरी की कोई तकनीकी गारंटी नहीं होती)',
      generalDegreeEn: 'MA / M.Com (Continuing academic theory without guaranteed technical jobs)',
      vocational: 'पॉलीटेक्निक द्वितीय वर्ष (लेटरल एंट्री) → बी.टेक इंजीनियरिंग डिग्री',
      vocationalEn: 'Lateral Entry to 2nd Year Polytechnic Diploma → Direct B.Tech Engineering Degree',
      verdict: 'tie',
      explanation: 'NEP 2020 के तहत आईटीआई वाला छात्र भी आगे चलकर इंजीनियर या बी.टेक बन सकता है।',
      explanationEn: 'NEP 2020 National Credit Framework bridges vocational learners directly into degree engineering.'
    },
    {
      id: 'govt-jobs',
      category: 'jobs',
      title: 'सरकारी नौकरियों के अवसर (Government Job Eligibility)',
      titleEn: 'Government Job Eligibility',
      generalDegree: 'केवल सामान्य एसएससी/क्लर्क (जहाँ 1 पद पर 5,000+ उम्मीदवार होते हैं)',
      generalDegreeEn: 'General SSC/Clerical exams only (Where 5,000+ candidates contest each post)',
      vocational: 'रेलवे (ALP/Technician), सेना, बिजली विभाग (DISCOMs) में आरक्षित तकनीकी पद',
      vocationalEn: 'Railways RRB ALP, Defense technical corps, and State Power Board technician quotas',
      verdict: 'vocational-wins',
      explanation: 'रेलवे व रक्षा में लाखों पद केवल आईटीआई/तकनीकी प्रमाण पत्र वालों के लिए सुरक्षित होते हैं।',
      explanationEn: 'Exclusive technical eligibility quotas where general degree holders cannot even apply.'
    },
    {
      id: 'self-employment',
      category: 'financial',
      title: 'खुद का काम / दुकान / ठेकेदारी (Self-Employment & Agency)',
      titleEn: 'Self-Employment Potential',
      generalDegree: 'मुश्किल (बिना तकनीकी ज्ञान या पूंजी के व्यवसाय शुरू करना कठिन)',
      generalDegreeEn: 'Difficult (No technical craft or license to offer commercial services)',
      vocational: 'आसान (सरकारी फॉर्म-L लाइसेंस, सोलर एजेंसी, पीएम मुद्रा लोन ₹10 लाख तक)',
      vocationalEn: 'High (Govt electrical contractor license, solar dealership, Mudra loans up to ₹10 Lakh)',
      verdict: 'vocational-wins',
      explanation: 'हुनरमंद व्यक्ति कभी बेरोजगार नहीं रहता, वह अपनी स्वतंत्र सर्विस शुरू कर सकता है।',
      explanationEn: 'A skilled tradesperson always holds tangible value and can operate independently.'
    }
  ];

  const filteredCriteria = selectedTopic === 'all'
    ? comparisonCriteria
    : comparisonCriteria.filter(c => c.category === selectedTopic);

  const handleSpeakOverview = () => {
    if (onSpeak) {
      const summaryText = language === 'hi'
        ? 'सामान्य डिग्री बनाम वोकेशनल कौशल शिक्षा: सामान्य कॉलेज डिग्री में 3 साल और 1 लाख रुपये से अधिक खर्च होते हैं और नौकरी की गारंटी नहीं होती। वहीं वोकेशनल शिक्षा में 6 से 12 महीने में सवेतन अप्रेंटिसशिप शुरू हो जाती है और रेलवे व उद्योगों में सीधी भर्ती मिलती है। एनईपी 2020 के तहत छात्र आगे चलकर बी.टेक डिग्री भी ले सकता है।'
        : 'General College Degree vs Vocational Skilling: While general degree takes 3 years with high expenses and low job readiness, vocational skilling provides paid apprenticeships within 6-12 months with exclusive government job quotas and seamless lateral progression to B.Tech engineering.';
      onSpeak(summaryText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block">
              {language === 'hi' ? 'अभिभावकों के लिए निष्पक्ष तुलना' : 'FAIR COMPARISON FOR PARENTS'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'hi'
                ? 'सामान्य कॉलेज डिग्री (BA/B.Com) बनाम वोकेशनल कौशल (NSQF)'
                : 'Traditional Degree (BA/B.Com) vs NSQF Vocational Trade'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
              {language === 'hi'
                ? 'यह तुलना किसी रास्ते को नीचा दिखाने के लिए नहीं है, बल्कि समय, पैसे की लागत और रोजगार की वास्तविक संभावनाओं को साफ-साफ समझने के लिए है।'
                : 'A transparent assessment designed to help families compare investments in time, money, employability, and debt risk.'}
            </p>
          </div>

          <button
            onClick={handleSpeakOverview}
            className="self-start sm:self-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl border border-slate-300 transition flex items-center gap-2 shrink-0"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>{language === 'hi' ? 'तुलना सुनें' : 'Listen Comparison'}</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`px-3.5 py-1.5 rounded-xl border transition ${
              selectedTopic === 'all'
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'hi' ? 'सभी पहलू (All 6 Points)' : 'All 6 Points'}
          </button>
          <button
            onClick={() => setSelectedTopic('financial')}
            className={`px-3.5 py-1.5 rounded-xl border transition ${
              selectedTopic === 'financial'
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'hi' ? '💰 खर्च व कमाई' : '💰 Financial & Income'}
          </button>
          <button
            onClick={() => setSelectedTopic('jobs')}
            className={`px-3.5 py-1.5 rounded-xl border transition ${
              selectedTopic === 'jobs'
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'hi' ? '💼 नौकरी व सरकारी पद' : '💼 Jobs & Govt Exams'}
          </button>
          <button
            onClick={() => setSelectedTopic('future')}
            className={`px-3.5 py-1.5 rounded-xl border transition ${
              selectedTopic === 'future'
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'hi' ? '🎓 उच्च शिक्षा व पदोन्नति' : '🎓 Degree & Growth'}
          </button>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="space-y-4">
        {filteredCriteria.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                  {index + 1}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {language === 'hi' ? item.title : item.titleEn}
                </h3>
              </div>

              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 self-start sm:self-center">
                {language === 'hi' ? item.explanation : item.explanationEn}
              </span>
            </div>

            {/* Side by side columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: General Degree */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span>{language === 'hi' ? 'पारंपरिक कॉलेज डिग्री (BA/B.Com)' : 'Traditional Degree (BA/B.Com)'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    3 Years
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {language === 'hi' ? item.generalDegree : item.generalDegreeEn}
                </p>
              </div>

              {/* Option B: Vocational Skilling */}
              <div className="bg-amber-50/70 rounded-2xl p-4 border-2 border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    <span>{language === 'hi' ? 'वोकेशनल कौशल ट्रेड (NSQF ITI)' : 'Vocational Skilling (NSQF ITI)'}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                    {language === 'hi' ? 'सत्यापित लाभ ✓' : 'Proven Fit ✓'}
                  </span>
                </div>
                <p className="text-xs text-slate-900 font-bold leading-relaxed">
                  {language === 'hi' ? item.vocational : item.vocationalEn}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Decision Summary Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{language === 'hi' ? 'अभिभावक निष्कर्ष एवं अगला कदम' : 'Parent Takeaway & Next Step'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
          {language === 'hi'
            ? 'डिग्री और हुनर में से किसी एक को छोड़ने की जरूरत नहीं है!'
            : 'You do not have to choose between a degree and practical skills!'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          {language === 'hi'
            ? 'सबसे समझदारी भरा भारतीय मॉडल है: पहले 1 साल में तकनीकी कौशल सीखकर अपनी कमाई शुरू करें (NAPS अप्रेंटिसशिप), और फिर कंपनी के सहयोग से शाम की बैच में बी.वॉक (B.Voc) या लेटरल बी.टेक डिग्री हासिल करें। इससे न कर्ज होता है, न बेरोजगारी।'
            : 'The modern model is: Acquire a tangible vocational certification first, secure paid employment, and then leverage lateral entry for a subsidized Polytechnic Diploma or B.Tech degree. Zero debt, 100% employability.'}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenFamilySession}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md transition"
          >
            <span>{language === 'hi' ? 'बच्चे के साथ पारिवारिक चर्चा करें' : 'Open Family Discussion'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
