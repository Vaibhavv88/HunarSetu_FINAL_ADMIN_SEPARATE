import React, { useState } from 'react';
import { UserCheck, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Clock, Award, Building2, MapPin } from 'lucide-react';
import { CounsellorProfile, CounsellorAvailabilitySlot } from '../../types/counsellor';

interface CounsellorOnboardingProps {
  language: 'en' | 'hi';
  counsellor: CounsellorProfile;
  onComplete: (updated: CounsellorProfile) => void;
}

export const CounsellorOnboarding: React.FC<CounsellorOnboardingProps> = ({
  language,
  counsellor,
  onComplete
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<CounsellorProfile>({
    ...counsellor
  });

  const categories = [
    'School Students',
    'College Students',
    'Vocational Careers (NSQF)',
    'ITI / Polytechnic Diploma',
    'Parent Counselling & Mediation',
    'Career Change / Upskilling',
    'Family Career Discussion',
    'Skill Development & NAPS'
  ];

  const handleToggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(cat)
        ? prev.specialization.filter(c => c !== cat)
        : [...prev.specialization, cat]
    }));
  };

  const handleFinish = () => {
    const finalized: CounsellorProfile = {
      ...formData,
      onboardingCompleted: true,
      verificationStatus: 'Verified',
      isDemoCounsellor: true
    };
    onComplete(finalized);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 py-8 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              {step}/4
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">
                {language === 'hi' ? 'प्रमाणित काउंसलर प्रोफाइल सत्यापन' : 'Certified Counsellor Onboarding'}
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold">
                {language === 'hi' ? 'मानव व्यावसायिक परामर्शदाता सत्यापन' : 'Verified Human Guidance Protocol'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
            {step === 1 && (language === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Details')}
            {step === 2 && (language === 'hi' ? 'योग्यता एवं विशेषता' : 'Specialization')}
            {step === 3 && (language === 'hi' ? 'उपलब्धता एवं समय' : 'Availability')}
            {step === 4 && (language === 'hi' ? 'सत्यापन स्थिति' : 'Verification')}
          </span>
        </div>

        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-extrabold text-slate-900">
              {language === 'hi' ? 'चरण 1: व्यक्तिगत एवं संपर्क जानकारी' : 'Step 1: Personal & Contact Information'}
            </h3>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">{language === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">{language === 'hi' ? 'ईमेल (Official Email)' : 'Official Email'}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">{language === 'hi' ? 'फोन नंबर (Phone)' : 'Phone Number'}</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">{language === 'hi' ? 'राज्य (State)' : 'State'}</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">{language === 'hi' ? 'अधिकार क्षेत्र / जिला (District Hub)' : 'District Hub'}</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
              >
                <span>{language === 'hi' ? 'आगे बढ़ें' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROFESSIONAL & SPECIALIZATION */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-extrabold text-slate-900">
              {language === 'hi' ? 'चरण 2: व्यावसायिक योग्यता एवं विशेषज्ञता' : 'Step 2: Professional Qualification & Focus'}
            </h3>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">{language === 'hi' ? 'उच्चतम योग्यता (Highest Qualification)' : 'Highest Qualification'}</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. M.A. in Psychology / Diploma in Guidance"
                  className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">{language === 'hi' ? 'काउंसलिंग प्रमाणन (Certification Badge)' : 'Counselling Certification'}</label>
                  <input
                    type="text"
                    value={formData.certification}
                    onChange={e => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">{language === 'hi' ? 'अनुभव के वर्ष (Years of Experience)' : 'Years of Experience'}</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">{language === 'hi' ? 'परामर्श की पसंदीदा श्रेणियां (Select Categories)' : 'Preferred Counselling Categories'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                        formData.specialization.includes(cat)
                          ? 'bg-sky-50 border-sky-400 text-sky-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat}</span>
                      {formData.specialization.includes(cat) && (
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-slate-600 hover:text-slate-900 text-xs font-bold px-4 py-2"
              >
                ← {language === 'hi' ? 'पीछे' : 'Back'}
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
              >
                <span>{language === 'hi' ? 'आगे बढ़ें' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AVAILABILITY & SESSION SETTINGS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-extrabold text-slate-900">
              {language === 'hi' ? 'चरण 3: कार्य दिवस एवं समय निर्धारण' : 'Step 3: Availability & Session Limits'}
            </h3>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span className="font-extrabold">{language === 'hi' ? 'मानक कार्य समय:' : 'Standard Work Hours:'}</span>
                </div>
                <p className="text-slate-600 text-xs font-medium">
                  {language === 'hi'
                    ? 'सोमवार से शनिवार: 10:00 AM – 06:00 PM (30 मिनट प्रति कॉल सत्र)'
                    : 'Monday to Saturday: 10:00 AM – 06:00 PM (30 min per session)'}
                </p>
              </div>

              <div>
                <label className="block mb-1">{language === 'hi' ? 'अधिकतम दैनिक सत्र (Max Sessions/Day)' : 'Maximum Daily Sessions'}</label>
                <input
                  type="number"
                  value={formData.maxDailySessions}
                  onChange={e => setFormData({ ...formData, maxDailySessions: Number(e.target.value) })}
                  className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block mb-1">{language === 'hi' ? 'काउंसलर संक्षिप्त परिचय (Bio)' : 'Professional Bio'}</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-slate-600 hover:text-slate-900 text-xs font-bold px-4 py-2"
              >
                ← {language === 'hi' ? 'पीछे' : 'Back'}
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
              >
                <span>{language === 'hi' ? 'आगे बढ़ें' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: VERIFICATION STATUS */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-9 h-9 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                {language === 'hi' ? '✓ प्रमाणित सरकारी काउंसलर' : '✓ Demo Verified Counsellor'}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                {language === 'hi' ? 'सत्यापन स्वीकृत (Credentials Verified)' : 'Counsellor Profile Ready'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {language === 'hi'
                  ? 'आपके क्रेडेंशियल्स सत्यापित हो चुके हैं। आप छात्र, अभिभावक और संयुक्त पारिवारिक परामर्श सत्र संभालने के लिए अधिकृत हैं।'
                  : 'Your credentials have been verified. You are authorized to accept messages, calls, and family mediation cases.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'नाम:' : 'Name:'}</span>
                <span className="font-bold text-slate-900">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'काउंसलर आईडी:' : 'Counsellor ID:'}</span>
                <span className="font-mono font-bold text-slate-900">{formData.badgeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'अधिकार क्षेत्र:' : 'Jurisdiction:'}</span>
                <span className="font-bold text-slate-900">{formData.district}, {formData.state}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleFinish}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <span>{language === 'hi' ? 'काउंसलर डैशबोर्ड खोलें' : 'Open Counsellor Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
