import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Volume2, ArrowRight, BookOpen, AlertTriangle, Users, HeartHandshake, ShieldCheck } from 'lucide-react';
import { ParentProfile, ParentConcernItem } from '../../types/career';
import { PARENT_CONCERNS_MATRIX } from '../../data/parentConcerns';
import { I18N } from '../../i18n/translations';

interface ParentObjectionViewProps {
  language: 'en' | 'hi';
  parent: ParentProfile;
  onUpdateParent: (updated: ParentProfile) => void;
  onSpeak: (text: string) => void;
  onNavigateToFamilySession: () => void;
}

export const ParentObjectionView: React.FC<ParentObjectionViewProps> = ({
  language,
  parent,
  onUpdateParent,
  onSpeak,
  onNavigateToFamilySession
}) => {
  const t = I18N[language];
  const [selectedConcernKey, setSelectedConcernKey] = useState<ParentConcernItem['concernKey']>(parent.primaryConcern);

  const activeConcern = PARENT_CONCERNS_MATRIX.find(c => c.concernKey === selectedConcernKey) || PARENT_CONCERNS_MATRIX[0];

  const handleSelectConcern = (key: ParentConcernItem['concernKey']) => {
    setSelectedConcernKey(key);
    onUpdateParent({ ...parent, primaryConcern: key });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <HeartHandshake className="w-4 h-4 text-amber-400" />
          <span>{language === 'hi' ? 'अभिभावक विशेष परामर्श मंच' : 'Dedicated Parent Decision Perspective'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {language === 'hi' ? 'अभिभावकों की शंकाएं एवं सत्यापित समाधान' : 'Addressing Parental Concerns with Verified Proof'}
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
          {language === 'hi'
            ? 'हम समझते हैं कि अपने बच्चे के भविष्य के लिए माता-पिता की चिंता स्वाभाविक है। यहाँ प्रत्येक प्रश्न का उत्तर कोरी कल्पना नहीं, बल्कि सरकारी साक्ष्यों और वास्तविक आंकड़ों पर आधारित है।'
            : 'Every parent desires economic security, respect, and safety for their child. We replace social hearsay with verified evidence from national skilling surveys.'}
        </p>

        {/* Quick Guardian Relation Switch */}
        <div className="pt-4 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-semibold">{language === 'hi' ? 'आप कौन हैं:' : 'I am the:'}</span>
          {(['Father', 'Mother', 'Guardian', 'Elder Sibling'] as const).map(rel => (
            <button
              key={rel}
              onClick={() => onUpdateParent({ ...parent, guardianRelation: rel })}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition ${
                parent.guardianRelation === rel
                  ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {rel === 'Father' && (language === 'hi' ? 'पिताजी (Father)' : 'Father')}
              {rel === 'Mother' && (language === 'hi' ? 'माताजी (Mother)' : 'Mother')}
              {rel === 'Guardian' && (language === 'hi' ? 'अभिभावक (Guardian)' : 'Guardian')}
              {rel === 'Elder Sibling' && (language === 'hi' ? 'बड़ा भाई / बहन' : 'Elder Sibling')}
            </button>
          ))}
        </div>
      </div>

      {/* Select Concern Interactive Pills */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {language === 'hi' ? 'आपकी सबसे बड़ी चिंता क्या है? (एक प्रश्न चुनें)' : 'Select Your Primary Hesitation / Doubt'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {PARENT_CONCERNS_MATRIX.map(c => {
            const isSelected = selectedConcernKey === c.concernKey;
            return (
              <div
                key={c.id}
                onClick={() => handleSelectConcern(c.concernKey)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-1.5">
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.concernKey === 'income' && (language === 'hi' ? 'कमाई व वेतन' : 'Income')}
                    {c.concernKey === 'job_security' && (language === 'hi' ? 'नौकरी की गारंटी' : 'Job Security')}
                    {c.concernKey === 'social_status' && (language === 'hi' ? 'सामाजिक प्रतिष्ठा' : 'Social Status')}
                    {c.concernKey === 'further_study' && (language === 'hi' ? 'उच्च शिक्षा / बी.टेक' : 'Higher Study')}
                    {c.concernKey === 'safety' && (language === 'hi' ? 'सुरक्षा एवं स्वास्थ्य' : 'Safety')}
                    {c.concernKey === 'relocation' && (language === 'hi' ? 'जिले में नौकरी' : 'Location')}
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {language === 'hi' ? c.questionHi : c.question}
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <span className={`text-xs font-bold ${isSelected ? 'text-amber-800' : 'text-slate-400'}`}>
                    {isSelected ? 'सक्रिय ✓' : 'देखें →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Evidence & Reassurance Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        {/* Card Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              {language === 'hi' ? 'सत्यापित साक्ष्य एवं विश्लेषण' : 'Official Evidence & Reassurance'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold">
              {language === 'hi' ? activeConcern.questionHi : activeConcern.question}
            </h3>
          </div>

          <button
            onClick={() => {
              const textToSpeak = language === 'hi'
                ? `${activeConcern.shortSummaryHi}। ${activeConcern.reassuranceHi}`
                : `${activeConcern.shortSummary}. ${activeConcern.reassurance}`;
              onSpeak(textToSpeak);
            }}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm self-start sm:self-center"
            title="Read aloud for parents"
          >
            <Volume2 className="w-4 h-4 text-slate-950" />
            <span>{language === 'hi' ? 'आवाज़ में सुनें' : 'Listen Answer'}</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Summary Callout */}
          <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-xl">
            <h4 className="text-xs uppercase font-extrabold text-amber-900 tracking-wider mb-1">
              {language === 'hi' ? 'मुख्य निष्कर्ष (Summary)' : 'Direct Answer'}
            </h4>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {language === 'hi' ? activeConcern.shortSummaryHi : activeConcern.shortSummary}
            </p>
          </div>

          {/* Evidence Points */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold text-slate-700 tracking-wider">
              {language === 'hi' ? 'सत्यापित साक्ष्य एवं वास्तविक आंकड़े' : 'Verified Evidence Points'}
            </h4>
            <div className="space-y-2.5">
              {(language === 'hi' ? activeConcern.evidencePointsHi : activeConcern.evidencePoints).map((pt, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Government Safety Nets */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'सरकारी सुरक्षा तंत्र एवं योजनाएं' : 'Government Safety Nets & Support'}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-emerald-950 font-medium">
              {(language === 'hi' ? activeConcern.governmentSafetyNetsHi : activeConcern.governmentSafetyNets).map((net, i) => (
                <li key={i}>{net}</li>
              ))}
            </ul>
          </div>

          {/* Source Attribution Note */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            <span>
              <strong>{language === 'hi' ? 'साक्ष्य स्रोत:' : 'Source Attribution:'}</strong> {activeConcern.sourceAttribution}
            </span>
            <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
            </span>
          </div>

          {/* Call to Action: Bring into Family Session */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'इस विषय पर अपने बच्चे के साथ मिलकर विस्तृत तुलना करना चाहते हैं?'
                : 'Want to compare this evidence directly with your child’s preferences?'}
            </p>
            <button
              onClick={onNavigateToFamilySession}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition"
            >
              <Users className="w-4 h-4" />
              <span>{language === 'hi' ? 'पारिवारिक सत्र में चर्चा करें' : 'Open Family Decision Session'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
