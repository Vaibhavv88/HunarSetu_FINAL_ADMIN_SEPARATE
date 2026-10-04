import React, { useState } from 'react';
import { User, GraduationCap, MapPin, Wrench, Target, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { StudentProfile } from '../../types/student';

interface StudentProfileViewProps {
  language: 'en' | 'hi';
  student: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onResetOnboarding: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  language,
  student,
  onUpdateProfile,
  onResetOnboarding
}) => {
  const [name, setName] = useState<string>(student.name);
  const [education, setEducation] = useState<StudentProfile['education']>(student.education);
  const [state, setState] = useState<string>(student.state);
  const [district, setDistrict] = useState<string>(student.district);
  const [locality, setLocality] = useState<StudentProfile['locality']>(student.locality || 'Semi-Urban');
  const [workPreference, setWorkPreference] = useState<string>(student.workPreference);
  const [careerGoal, setCareerGoal] = useState<string>(student.careerGoal);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...student,
      name: name.trim() || 'Student',
      education,
      state,
      district,
      locality,
      workPreference,
      careerGoal
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 py-8 space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'मेरी विद्यार्थी प्रोफ़ाइल' : 'My Student Profile'}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'hi'
            ? 'अपनी जानकारी अद्यतन करें ताकि करियर मिलान और अवसर हमेशा सटीक रहें।'
            : 'Update your profile to keep trade matching and local recommendations accurate.'}
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm text-xs">
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक सुरक्षित कर ली गई है! ✓' : 'Profile successfully updated! ✓'}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'विद्यार्थी का नाम' : 'Student Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'वर्तमान शैक्षणिक स्तर' : 'Education Level'}
            </label>
            <select
              value={education}
              onChange={e => setEducation(e.target.value as any)}
              className="w-full font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none bg-white"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 12">Class 12</option>
              <option value="ITI">ITI Student</option>
              <option value="Diploma">Diploma / Polytechnic</option>
              <option value="College">College Graduate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'राज्य' : 'State'}
            </label>
            <input
              type="text"
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'जिला' : 'District'}
            </label>
            <input
              type="text"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            {language === 'hi' ? 'पसंदीदा कार्यशैली' : 'Preferred Work Style'}
          </label>
          <input
            type="text"
            value={workPreference}
            onChange={e => setWorkPreference(e.target.value)}
            className="w-full font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            {language === 'hi' ? 'प्राथमिक करियर लक्ष्य' : 'Primary Career Goal'}
          </label>
          <input
            type="text"
            value={careerGoal}
            onChange={e => setCareerGoal(e.target.value)}
            className="w-full font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onResetOnboarding}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'ऑनबोर्डिंग पुनः आरंभ करें' : 'Restart Onboarding Flow'}</span>
          </button>

          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>{language === 'hi' ? 'परिवर्तन सुरक्षित करें' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
