import React, { useState } from 'react';
import { MapPin, Building2, Briefcase, Phone, Award, Users, CheckCircle2, Factory } from 'lucide-react';
import { DistrictCluster } from '../../types/career';
import { DISTRICT_CLUSTERS_DATA } from '../../data/districtData';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';
import { I18N } from '../../i18n/translations';

interface DistrictOpportunityViewProps {
  language: 'en' | 'hi';
}

export const DistrictOpportunityView: React.FC<DistrictOpportunityViewProps> = ({ language }) => {
  const t = I18N[language];
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('Kanpur Nagar');

  const currentCluster = DISTRICT_CLUSTERS_DATA.find(d => d.district === selectedDistrictName) || DISTRICT_CLUSTERS_DATA[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>{language === 'hi' ? 'स्थानीय जिला रोजगार मानचित्र' : 'District Opportunity & Cluster Explorer'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'hi' ? 'अपने जिले में सरकारी आईटीआई व कंपनियां देखें' : 'Local Training Centres & Industries'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {language === 'hi'
              ? 'दूर-दराज के शहरों में जाने की अनिवार्यता नहीं। आपके अपने जिले के औद्योगिक क्लस्टर और अप्रेंटिसशिप के अवसर।'
              : 'Parents need not worry about faraway relocation. Discover training institutes and MSME employers right within your home district.'}
          </p>
        </div>

        {/* District Selector */}
        <div className="shrink-0 bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
          <label className="block text-[11px] font-bold text-sky-400 uppercase tracking-wider">
            {language === 'hi' ? 'जिला चुनें:' : 'Select District:'}
          </label>
          <select
            value={selectedDistrictName}
            onChange={e => setSelectedDistrictName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 text-white text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:border-sky-400"
          >
            {DISTRICT_CLUSTERS_DATA.map(d => (
              <option key={d.district} value={d.district}>
                {language === 'hi' ? `${d.districtHi} (${d.state})` : `${d.district} (${d.state})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* District Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'hi' ? 'सरकारी आईटीआई' : 'Govt ITIs'}</span>
          <span className="text-2xl font-black text-slate-900">{currentCluster.governmentITIs}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'hi' ? 'प्राइवेट संस्थान' : 'Private ITIs'}</span>
          <span className="text-2xl font-black text-slate-900">{currentCluster.privateITIs}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'hi' ? 'सक्रिय अप्रेंटिसशिप' : 'Active Apprenticeships'}</span>
          <span className="text-2xl font-black text-emerald-600">{currentCluster.activeApprenticeships}+</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'hi' ? 'प्रमुख औद्योगिक क्षेत्र' : 'Key Industry Zones'}</span>
          <span className="text-2xl font-black text-sky-600">{currentCluster.keyIndustries.length} Hubs</span>
        </div>
      </div>

      {/* Key Local Industries & Demanded Trades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Factory className="w-4 h-4 text-sky-600" />
            <span>{language === 'hi' ? `${currentCluster.districtHi} के मुख्य औद्योगिक क्लस्टर` : `Major Industries in ${currentCluster.district}`}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {currentCluster.keyIndustries.map((ind, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{ind}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Notable Employers Hiring Locally */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span>{language === 'hi' ? 'स्थानीय स्तर पर भर्ती करने वाली प्रमुख कंपनियां' : 'Notable Local Employers'}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {currentCluster.notableEmployers.map((emp, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-amber-600 font-bold">•</span>
                <span className="font-semibold text-slate-900">{emp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Training Centers & Institutes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Building2 className="w-5 h-5 text-emerald-600" />
          <span>{language === 'hi' ? 'मान्यता प्राप्त सरकारी प्रशिक्षण केंद्र एवं संपर्क सूत्र' : 'Recognized Institutes & Training Centers'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCluster.trainingCenters.map((tc, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {tc.type}
                </span>
                <span className="text-slate-400 font-semibold text-[10px]">Verified Institute</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{tc.name}</h4>
              <p className="text-slate-600">
                <strong>{language === 'hi' ? 'उपलब्ध ट्रेड्स:' : 'Trades:'}</strong> {tc.trades.join(', ')}
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-slate-500 font-medium">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{tc.contact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
