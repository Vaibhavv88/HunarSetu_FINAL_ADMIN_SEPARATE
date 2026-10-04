import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Clock, Award, Building2, MapPin, Mail, Phone, CheckCircle2, Save } from 'lucide-react';
import { CounsellorProfile } from '../../types/counsellor';

interface CounsellorProfileSettingsViewProps {
  language: 'en' | 'hi';
  counsellor: CounsellorProfile;
  onUpdateProfile: (updated: CounsellorProfile) => void;
  onToggleLanguage: () => void;
  onLogout: () => void;
}

export const CounsellorProfileSettingsView: React.FC<CounsellorProfileSettingsViewProps> = ({
  language,
  counsellor,
  onUpdateProfile,
  onToggleLanguage,
  onLogout
}) => {
  const [profile, setProfile] = useState<CounsellorProfile>({ ...counsellor });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{profile.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {profile.verificationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {profile.qualification} • {profile.experienceYears} Years Experience
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition"
            >
              {language === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}
            </button>
            <button
              onClick={onLogout}
              className="text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl transition"
            >
              {language === 'hi' ? 'लॉगआउट' : 'Log Out'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs text-center font-bold">
            {language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई! ✓' : 'Profile settings saved successfully! ✓'}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 text-xs font-bold text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Counsellor ID / Badge:</label>
              <input
                type="text"
                disabled
                value={profile.badgeId}
                className="w-full font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-500"
              />
            </div>
            <div>
              <label className="block mb-1">Assigned Jurisdiction:</label>
              <input
                type="text"
                value={`${profile.district}, ${profile.state}`}
                onChange={e => {
                  const parts = e.target.value.split(',');
                  setProfile({
                    ...profile,
                    district: parts[0]?.trim() || profile.district,
                    state: parts[1]?.trim() || profile.state
                  });
                }}
                className="w-full bg-white p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block mb-1">Phone Number:</label>
              <input
                type="text"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-white p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-white p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Professional Bio:</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="w-full font-medium bg-white p-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Availability Block */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Working Availability</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold">Standard 30 min per slot</span>
            </div>
            <p className="text-slate-600 font-medium text-[11px]">
              Available Monday – Saturday: 10:00 AM – 06:00 PM (Max 8 live video/voice sessions per day).
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'hi' ? 'परिवर्तन सहेजें' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
