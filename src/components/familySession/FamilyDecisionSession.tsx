import React, { useState } from 'react';
import { Users, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Sparkles, Volume2, PhoneCall, Scale, HelpCircle } from 'lucide-react';
import { LearnerProfile, ParentProfile, VocationalTrade } from '../../types/career';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { PARENT_CONCERNS_MATRIX } from '../../data/parentConcerns';
import { I18N } from '../../i18n/translations';

interface FamilyDecisionSessionProps {
  language: 'en' | 'hi';
  learner: LearnerProfile;
  parent: ParentProfile;
  onUpdateLearnerTrade: (tradeId: string) => void;
  onUpdateParentAspiration: (aspired: string) => void;
  onOpenCounsellorModal: () => void;
  onSpeak: (text: string) => void;
}

export const FamilyDecisionSession: React.FC<FamilyDecisionSessionProps> = ({
  language,
  learner,
  parent,
  onUpdateLearnerTrade,
  onUpdateParentAspiration,
  onOpenCounsellorModal,
  onSpeak
}) => {
  const t = I18N[language];

  // Active selected trade for the learner
  const selectedTrade = NSQF_VOCATIONAL_TRADES.find(t => t.id === (learner.selectedTradeId || 'solar-technician')) || NSQF_VOCATIONAL_TRADES[0];
  const activeConcern = PARENT_CONCERNS_MATRIX.find(c => c.concernKey === parent.primaryConcern) || PARENT_CONCERNS_MATRIX[0];

  const [agreementStep, setAgreementStep] = useState<'compare' | 'discussion' | 'checklist'>('compare');

  // Conventional path comparison data (Traditional General B.A. Degree / Coaching Trap)
  const conventionalComparison = {
    title: parent.aspiredCareerForChild || 'General B.A. / B.Com Degree + Govt Exam Coaching',
    titleHi: parent.aspiredCareerForChild || 'साधारण बी.ए./बी.कॉम कॉलेज डिग्री + सरकारी परीक्षा तैयारी',
    duration: '3 to 5+ Years (Without job certainty)',
    durationHi: '3 से 5+ वर्ष (नौकरी की कोई निश्चितता नहीं)',
    cost: '₹1,50,000 - ₹3,00,000 (College fees + Room Rent + Coaching)',
    costHi: '₹1.5 लाख से ₹3 लाख (कॉलेज फीस + कमरा किराया + कोचिंग)',
    placementRate: '24% - 32% (High youth underemployment)',
    placementRateHi: '24% से 32% (अधिकांश युवा वर्षों तक बेरोजगार रहते हैं)',
    salaryStart: 'Zero during 3-5 yrs of college & coaching',
    salaryStartHi: 'पढ़ाई और कोचिंग के दौरान 3-5 साल तक शून्य आमदनी',
    degreeProgression: 'General Graduate Degree (Requires further PG/B.Ed for employment)',
    degreeProgressionHi: 'सामान्य स्नातक डिग्री (नौकरी के लिए आगे एम.ए. या बीएड की जरूरत)'
  };

  const handleSpeechMediation = () => {
    const text = language === 'hi'
      ? `पारिवारिक तुलना सत्र: रोहन का रुझान ${selectedTrade.titleHi} में है, जहाँ 6 महीने के प्रशिक्षण और सरकारी अप्रेंटिसशिप के बाद ${selectedTrade.salary.entryLevel} से कमाई शुरू होती है। पिता रमेश जी की मुख्य चिंता वेतन और सुरक्षा को लेकर है। साक्ष्यों के अनुसार 3 वर्ष के अनुभव के बाद वेतन ${selectedTrade.salary.midLevel3Yr} हो जाता है और पॉलीटेक्निक में लैटरल एंट्री से आगे बी.टेक डिग्री का रास्ता पूरी तरह खुला रहता है।`
      : `Family Mediation Summary: ${learner.name} prefers ${selectedTrade.title}, which offers employment within ${selectedTrade.durationMonths} months and starting salary of ${selectedTrade.salary.entryLevel}. The primary parent concern is ${activeConcern.concernKey}. Verified data shows mid-level salary reaches ${selectedTrade.salary.midLevel3Yr} with guaranteed lateral entry to engineering diplomas.`;
    onSpeak(text);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Session Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'साझा पारिवारिक निर्णय सत्र' : 'Joint Family Decision Session'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'hi'
                ? 'समझें → तुलना करें → संवाद करें → सत्यापित करें → निर्णय लें'
                : 'Understand → Compare → Discuss → Verify → Decide'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {language === 'hi'
                ? 'यह प्रणाली किसी पर फैसला नहीं थोपती। यह विद्यार्थी की रुचि और अभिभावक की चिंताओं को एक ही मेज पर रखकर निष्पक्ष साक्ष्यों से तुलना करती है।'
                : 'HunarSetu does not force a decision. It maps learner aspirations directly against parental doubts using verified government data.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={handleSpeechMediation}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition"
              title="Listen mediation summary"
            >
              <Volume2 className="w-4 h-4 text-slate-950" />
              <span>{language === 'hi' ? 'मध्यस्थता सुनें' : 'Listen Mediation'}</span>
            </button>
            <button
              onClick={onOpenCounsellorModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'मानव काउंसलर बुलाएं' : 'Escalate to Counsellor'}</span>
            </button>
          </div>
        </div>

        {/* Participants Pill Strip */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold text-slate-300">
              {language === 'hi' ? 'सत्र प्रतिभागी:' : 'Active Participants:'}
            </span>
            <span className="bg-slate-800 text-amber-300 font-bold px-2.5 py-1 rounded-md border border-slate-700">
              {learner.name} ({language === 'hi' ? 'विद्यार्थी' : 'Learner'})
            </span>
            <span className="text-slate-500 font-bold">+</span>
            <span className="bg-slate-800 text-sky-300 font-bold px-2.5 py-1 rounded-md border border-slate-700">
              {parent.guardianName} ({parent.guardianRelation})
            </span>
          </div>

          <div className="text-slate-400 font-medium">
            {language === 'hi' ? 'जिला:' : 'District:'} <strong className="text-white">{learner.district}</strong>
          </div>
        </div>
      </div>

      {/* Disagreement Detection Card */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span>{language === 'hi' ? 'पहचाना गया दृष्टिकोण अंतर (Perception Divergence Identified)' : 'Identified Family Preference Divergence'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              {language === 'hi' ? 'विद्यार्थी की प्राथमिकता' : 'Learner Aspiration'}
            </span>
            <h4 className="font-extrabold text-slate-900 text-base">
              {language === 'hi' ? selectedTrade.titleHi : selectedTrade.title}
            </h4>
            <p className="text-slate-600 text-xs">
              {language === 'hi'
                ? `रुचि: ${learner.preferredWorkStyle} | लक्ष्य: 6 महीने में कौशल और आत्मनिर्भरता`
                : `Motivation: Hands-on technical passion with fast placement at age 18-19.`}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sky-800 block">
              {language === 'hi' ? 'अभिभावक की प्राथमिक चिंता' : 'Parent Aspiration & Doubt'}
            </span>
            <h4 className="font-extrabold text-slate-900 text-base">
              {parent.aspiredCareerForChild}
            </h4>
            <p className="text-slate-600 text-xs">
              {language === 'hi'
                ? `चिंता: क्या इस ट्रेड में सामाजिक इज्जत और सुरक्षित वेतन मिलेगा? क्या डिग्री बेहतर नहीं?`
                : `Concern: Fear of low social prestige, uncertain wages, or closing doors to higher degrees.`}
            </p>
          </div>
        </div>

        <p className="text-xs text-amber-950 font-medium italic pt-1">
          {language === 'hi'
            ? '💡 हुनरसेतु मध्यस्थ सुझाव: "आइए साक्ष्यों के आधार पर दोनों रास्तों की समय-सीमा, लागत, कमाई और भविष्य की डिग्री संभावनाओं की सीधी तुलना करें।"'
            : '💡 HunarSetu Mediation: "Let us examine facts side-by-side: duration, costs, verifiable placement, and higher degree progression."'}
        </p>
      </div>

      {/* Side-by-Side Reality Comparison Matrix */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base">
            {language === 'hi' ? 'तथ्य बनाम पारंपरिक धारणा (Side-by-Side Matrix)' : 'Fact-Based Comparison Matrix'}
          </h3>
          <span className="text-xs text-amber-400 font-semibold">
            {language === 'hi' ? 'NCVET व DGT साक्ष्य आधारित' : 'Verified Evidence Metrics'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-4 w-1/3">{language === 'hi' ? 'तुलना बिंदु' : 'Decision Factor'}</th>
                <th className="p-4 w-1/3 bg-amber-50/60 text-amber-900 border-x border-amber-200">
                  {language === 'hi' ? selectedTrade.titleHi : selectedTrade.title} (NSQF {selectedTrade.nsqfLevel})
                </th>
                <th className="p-4 w-1/3 text-slate-600">
                  {language === 'hi' ? conventionalComparison.titleHi : conventionalComparison.title}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-4 font-bold text-slate-800">
                  {language === 'hi' ? 'कमाई शुरू होने का समय' : 'Time to First Earning'}
                </td>
                <td className="p-4 bg-amber-50/40 font-semibold text-emerald-700 border-x border-amber-200">
                  {selectedTrade.durationMonths} {language === 'hi' ? 'महीने बाद (तुरंत अप्रेंटिसशिप/जॉब)' : 'Months (Direct NAPS Apprenticeship)'}
                </td>
                <td className="p-4 text-slate-600 font-medium">
                  {language === 'hi' ? conventionalComparison.durationHi : conventionalComparison.duration}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-800">
                  {language === 'hi' ? 'शुरुआती वेतन / स्टाइपेंड' : 'Starting Monthly Earning'}
                </td>
                <td className="p-4 bg-amber-50/40 font-bold text-emerald-800 border-x border-amber-200">
                  {selectedTrade.salary.entryLevel}
                </td>
                <td className="p-4 text-slate-600">
                  {language === 'hi' ? conventionalComparison.salaryStartHi : conventionalComparison.salaryStart}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-800">
                  {language === 'hi' ? '3 वर्ष बाद आमदनी' : '3-Year Experienced Earning'}
                </td>
                <td className="p-4 bg-amber-50/40 font-bold text-slate-900 border-x border-amber-200">
                  {selectedTrade.salary.midLevel3Yr}
                </td>
                <td className="p-4 text-slate-600">
                  {language === 'hi' ? 'अनिश्चित (सरकारी परीक्षा परिणाम पर निर्भर)' : 'Uncertain (Often preparing for competitive exams)'}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-800">
                  {language === 'hi' ? 'प्रशिक्षण एवं पढ़ाई की कुल लागत' : 'Total Financial Investment'}
                </td>
                <td className="p-4 bg-amber-50/40 font-semibold text-slate-800 border-x border-amber-200">
                  {language === 'hi'
                    ? 'लगभग ₹2,400 (सरकारी ITI) / PMKVY में पूर्णतः निःशुल्क'
                    : 'Approx ₹2,400 (Govt ITI) / 100% Free under PMKVY'}
                </td>
                <td className="p-4 text-slate-600">
                  {language === 'hi' ? conventionalComparison.costHi : conventionalComparison.cost}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-800">
                  {language === 'hi' ? 'सत्यापित प्लेसमेंट दर' : 'Verified Placement Rate'}
                </td>
                <td className="p-4 bg-amber-50/40 font-bold text-emerald-700 border-x border-amber-200">
                  {selectedTrade.placementRate}% verified (NCVET Tracer)
                </td>
                <td className="p-4 text-slate-600">
                  {language === 'hi' ? conventionalComparison.placementRateHi : conventionalComparison.placementRate}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-800">
                  {language === 'hi' ? 'उच्च शिक्षा एवं डिग्री का रास्ता' : 'Higher Degree Progression'}
                </td>
                <td className="p-4 bg-amber-50/40 font-semibold text-slate-900 border-x border-amber-200">
                  {language === 'hi'
                    ? 'पॉलीटेक्निक इंजीनियरिंग डिप्लोमा (2nd Year Lateral Entry) → B.Voc / B.Tech संभव'
                    : 'Lateral Entry into 2nd-Year Polytechnic Engineering Diploma -> B.Voc / B.Tech'}
                </td>
                <td className="p-4 text-slate-600">
                  {language === 'hi' ? conventionalComparison.degreeProgressionHi : conventionalComparison.degreeProgression}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-800">
                  {language === 'hi' ? 'स्थानीय जिले में मांग' : 'Local District Demand'}
                </td>
                <td className="p-4 bg-amber-50/40 font-semibold text-emerald-800 border-x border-amber-200">
                  {selectedTrade.localDemandClusters.includes(learner.district)
                    ? (language === 'hi' ? `✓ ${learner.district} में अत्यधिक मांग उपलब्ध` : `✓ Very High Active Demand in ${learner.district}`)
                    : (language === 'hi' ? 'स्थानीय MSME क्लस्टर एवं राज्य स्तर पर मांग' : 'Available across Regional MSME Hubs')}
                </td>
                <td className="p-4 text-slate-600">
                  {language === 'hi' ? 'सीमित स्थानीय नौकरियां' : 'Limited Local White-Collar Openings'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dinner Table Discussion Checklist (Actionable Agreement for Family) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900">
            {language === 'hi' ? 'परिवार के लिए 5 मुख्य चर्चा बिंदु (Family Agreement Checklist)' : '5 Structured Discussion Questions for Family'}
          </h3>
        </div>
        <p className="text-xs text-slate-600">
          {language === 'hi'
            ? 'रात के भोजन पर या शांत माहौल में बैठकर इन 5 प्रश्नों पर विद्यार्थी और अभिभावक मिलकर विचार करें:'
            : 'Discuss these five practical questions together at home before taking the final decision:'}
        </p>

        <div className="space-y-3 text-xs sm:text-sm">
          {[
            {
              q: language === 'hi'
                ? '1. क्या हम 4 साल तक प्रतियोगी परीक्षा के अनिश्चित परिणामों का वित्तीय खर्च उठा सकते हैं, या 1 वर्ष में आत्मनिर्भर बनना बेहतर है?'
                : '1. Can our family sustain 4–5 years of college & coaching expenses without guaranteed income, or is financial independence within 12 months safer?'
            },
            {
              q: language === 'hi'
                ? '2. क्या अभिभावक को संतुष्टि है कि पॉलीटेक्निक लैटरल एंट्री के जरिए बी.टेक और डिग्री के दरवाजे पूरी तरह खुले रहेंगे?'
                : '2. Are parents reassured that Lateral Entry to Polytechnic diplomas guarantees higher education & B.Tech options remain 100% open?'
            },
            {
              q: language === 'hi'
                ? `3. क्या ${learner.district} में स्थित सरकारी आईटीआई/ट्रेनिंग सेंटर जाकर हम दोनों प्रत्यक्ष वर्कशॉप और लैब का निरीक्षण कर सकते हैं?`
                : `3. Can learner and parent visit the nearest Govt ITI or training center in ${learner.district} together to inspect the actual workshops?`
            },
            {
              q: language === 'hi'
                ? '4. क्या छात्र यह वादा करता है कि पहले साल अप्रेंटिसशिप के बाद वह सुपरवाइजर या डिप्लोमा का अगला स्तर अनिवार्य रूप से पूरा करेगा?'
                : '4. Does the learner commit to pursuing senior supervisor certifications and the lateral diploma after the 1st year apprenticeship?'
            },
            {
              q: language === 'hi'
                ? '5. यदि मन में अभी भी कोई संकोच है, तो क्या हमें सरकारी प्रमाणित काउंसलर से 15 मिनट की मुफ्त फोन कॉल बुक करनी चाहिए?'
                : '5. If any hesitation remains, should we schedule a 15-minute phone consultation with a certified skilling counsellor?'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-medium text-slate-800 flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>{item.q}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {language === 'hi'
              ? 'क्या परिवार में सहमति बन गई है?'
              : 'Has your family reached mutual agreement?'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert(language === 'hi' ? 'बधाई! परिवार का साझा निर्णय सुरक्षित कर लिया गया है।' : 'Congratulations! Mutual family decision recorded.')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'हाँ, सहमति बन गई' : 'Yes, Mutual Agreement Reached'}</span>
            </button>

            <button
              onClick={onOpenCounsellorModal}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>{language === 'hi' ? 'नहीं, काउंसलर से बात करें' : 'Still Hesitant? Escalate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
