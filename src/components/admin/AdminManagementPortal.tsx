import React, { useState } from 'react';
import { ShieldAlert, UserPlus, Users, BarChart3, CheckCircle2, Phone, Mail, MapPin, Award, Trash2, Power, Sparkles, Filter } from 'lucide-react';
import { CounsellorUser } from '../../types/auth';
import { INITIAL_COUNSELLORS } from '../../data/counsellorsData';

interface AdminManagementPortalProps {
  language: 'en' | 'hi';
  onNavigateHome: () => void;
}

export const AdminManagementPortal: React.FC<AdminManagementPortalProps> = ({
  language,
  onNavigateHome
}) => {
  const [counsellors, setCounsellors] = useState<CounsellorUser[]>(INITIAL_COUNSELLORS);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Counsellor Form State
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newRegion, setNewRegion] = useState<string>('Kanpur Nagar & Central UP');
  const [newSpec, setNewSpec] = useState<string>('Green Energy & Industrial Trades');

  const handleCreateCounsellor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newCounsellor: CounsellorUser = {
      id: `COUNS-${Math.floor(100 + Math.random() * 900)}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+91 98000 11223',
      badgeId: `NSDC-CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      assignedRegion: newRegion,
      specialization: newSpec,
      activeTicketsCount: 0,
      resolvedTicketsCount: 0,
      status: 'Active',
      joinedDate: 'Just Now'
    };

    setCounsellors(prev => [newCounsellor, ...prev]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const toggleCounsellorStatus = (id: string) => {
    setCounsellors(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
      )
    );
  };

  const removeCounsellor = (id: string) => {
    setCounsellors(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Super Admin Top Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>{language === 'hi' ? 'सर्वोच्च राष्ट्रीय नियंत्रण कक्ष' : 'Super Administrator Desk'}</span>
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
              Root Governance
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'hi' ? 'योजना प्रशासक पोर्टल • काउंसलर एवं सिस्टम प्रबंधन' : 'System Administration & Counsellor Management'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {language === 'hi'
              ? 'यहाँ से आप नए प्रमाणित काउंसलर्स को जोड़ सकते हैं, पूरे सिस्टम का ऑडिट कर सकते हैं और राष्ट्रीय एनालिटिक्स की निगरानी कर सकते हैं।'
              : 'Govern all certified counsellors, authorize regional desks, oversee family disputes, and monitor nationwide hesitation analytics.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'hi' ? '+ नया काउंसलर बनाएं' : '+ Create New Counsellor'}</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-3 rounded-2xl border border-slate-700 transition"
          >
            {language === 'hi' ? 'मुख्य मंच देखें →' : 'Public View →'}
          </button>
        </div>
      </div>

      {/* Admin Overall Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'hi' ? 'सक्रिय काउंसलर्स' : 'Authorized Counsellors'}</span>
          <span className="text-3xl font-black text-purple-700">{counsellors.filter(c => c.status === 'Active').length} Active</span>
          <span className="text-[10px] text-slate-500 font-medium block">Across 6 States</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'hi' ? 'कुल परामर्शित परिवार' : 'Families Counselled'}</span>
          <span className="text-3xl font-black text-slate-900">12,480</span>
          <span className="text-[10px] text-emerald-600 font-bold block">+18% this month</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'hi' ? 'मुख्य पारिवारिक चिंता' : 'Primary Hesitation'}</span>
          <span className="text-2xl font-black text-rose-600">41% Income</span>
          <span className="text-[10px] text-slate-500 font-medium block">Salary Cap doubt</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'hi' ? 'सहमति समाधान दर' : 'Mediation Success'}</span>
          <span className="text-3xl font-black text-emerald-600">93.6%</span>
          <span className="text-[10px] text-slate-500 font-medium block">Without court/dropout</span>
        </div>
      </div>

      {/* Counselor Governance Table (Admin Manages Counselors) */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              {language === 'hi' ? 'प्रमाणित काउंसलर प्रबंधन सूची (Counsellor Roster)' : 'Certified Counsellors Directory'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'एडमिन नए काउंसलर्स जोड़ सकता है, स्टेटस सक्रिय/निष्क्रिय कर सकता है और कार्यभार देख सकता है।'
                : 'Admin controls counsellor access, regional desk assignments, and dispute resolution performance.'}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition self-start sm:self-center"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '+ नया काउंसलर जोड़ें' : '+ Add Counsellor'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3.5">Counsellor</th>
                <th className="p-3.5">Assigned Region</th>
                <th className="p-3.5">Specialization</th>
                <th className="p-3.5">Active Tickets</th>
                <th className="p-3.5">Resolved</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {counsellors.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5">
                    <strong className="text-slate-900 block text-xs">{c.name}</strong>
                    <span className="text-[11px] text-slate-500">{c.email}</span>
                    <span className="text-[10px] text-purple-700 font-mono block">{c.badgeId}</span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-800">{c.assignedRegion}</td>
                  <td className="p-3.5 text-slate-600 max-w-xs">{c.specialization}</td>
                  <td className="p-3.5">
                    <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      {c.activeTicketsCount} active
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-700">{c.resolvedTicketsCount}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => toggleCounsellorStatus(c.id)}
                      className={`p-1.5 rounded-lg border text-xs transition ${
                        c.status === 'Active'
                          ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                          : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title={c.status === 'Active' ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeCounsellor(c.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                      title="Remove Counsellor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create New Counselor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {language === 'hi' ? 'नया प्रमाणित काउंसलर जोड़ें' : 'Create New Certified Counsellor'}
                  </h3>
                  <p className="text-xs text-purple-200">
                    {language === 'hi' ? 'क्षेत्रीय परामर्श डेस्क और अधिकार क्षेत्र सौंपें' : 'Assign Regional Desk & Credentials'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCounsellor} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'काउंसलर का पूरा नाम:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="e.g. Dr. Anil Kumar Verma"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'आधिकारिक ईमेल:' : 'Official Email:'}
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="anil.verma@hunarsetu.gov.in"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'फोन नंबर:' : 'Phone Number:'}
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="+91 94150 99887"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'निर्धारित क्षेत्र / जिला:' : 'Assigned Jurisdiction:'}
                </label>
                <select
                  value={newRegion}
                  onChange={e => setNewRegion(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:outline-none bg-white"
                >
                  <option value="Kanpur Nagar & Central UP">Kanpur Nagar & Central UP (कानपुर व मध्य उप्र)</option>
                  <option value="Varanasi & Purvanchal">Varanasi & Purvanchal (वाराणसी व पूर्वांचल)</option>
                  <option value="Pune & Western Maharashtra">Pune & Western Maharashtra (पुणे व पश्चिम महा.)</option>
                  <option value="Jaipur & Rajasthan Hub">Jaipur & Rajasthan Hub (जयपुर व राजस्थान)</option>
                  <option value="Surat & South Gujarat">Surat & South Gujarat (सूरत व दक्षिण गुजरात)</option>
                  <option value="Patna & North Bihar">Patna & North Bihar (पटना व उत्तर बिहार)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'कौशल विशेषज्ञता (Specialization):' : 'Trade Specialization:'}
                </label>
                <input
                  type="text"
                  value={newSpec}
                  onChange={e => setNewSpec(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="e.g. Drone Piloting, Green Energy, Engineering CNC"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'hi' ? 'काउंसलर बनाएं' : 'Save Counsellor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
