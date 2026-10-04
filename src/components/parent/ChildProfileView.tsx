import React, { useState } from 'react';
import { User, CheckCircle2, ShieldCheck, HeartHandshake, Bookmark, ArrowRight, Lock, KeyRound, Sparkles } from 'lucide-react';
import { ParentDetailedProfile } from '../../types/parent';
import { StudentProfile } from '../../types/student';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';

interface ChildProfileViewProps {
  language: 'en' | 'hi';
  parent: ParentDetailedProfile;
  studentData?: StudentProfile | null;
  onConnectChildCode: (code: string) => boolean;
  onNavigateExplore: (tradeId: string) => void;
  onOpenFamilyRoom: () => void;
}

export const ChildProfileView: React.FC<ChildProfileViewProps> = ({
  language,
  parent,
  studentData,
  onConnectChildCode,
  onNavigateExplore,
  onOpenFamilyRoom
}) => {
  const [inputCode, setInputCode] = useState<string>('');
  const [connectMessage, setConnectMessage] = useState<string>('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onConnectChildCode(inputCode.trim());
    if (success) {
      setConnectMessage(
        language === 'hi'
          ? 'बच्चे की प्रोफ़ाइल सफलतापूर्वक लिंक हो गई है! ✓'
          : "Successfully linked to your child's shared profile! ✓"
      );
    } else {
      setConnectMessage(
        language === 'hi'
          ? 'कोड सत्यापित नहीं हुआ। कृपया सही पारिवारिक कोड दर्ज करें।'
          : 'Invalid family code. Please check and try again.'
      );
    }
  };

  const chosenTrade = NSQF_VOCATIONAL_TRADES.find(
    t => t.id === (studentData?.lastExploredTradeId || 'solar-technician')
  ) || NSQF_VOCATIONAL_TRADES[0];

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-6 animate-in fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'मेरे बच्चे की प्रोफ़ाइल (My Child)' : "My Child's Profile"}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'यहाँ केवल वही जानकारी दिखाई देती है जो आपके बच्चे ने परिवार के साथ साझा करने की अनुमति दी है।'
              : 'Displays only the information your child has authorized for family sharing.'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? 'गोपनीयता सुरक्षित' : 'Privacy Protected'}</span>
        </div>
      </div>

      {/* Connection Box if Not Connected */}
      {!parent.childConnected ? (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-8 space-y-5 shadow-sm text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
                {language === 'hi' ? 'लिंक स्थिति: कनेक्टेड नहीं' : 'STATUS: NOT YET CONNECTED'}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {language === 'hi' ? 'अपने बच्चे की प्रोफ़ाइल से जुड़ें' : "Connect with Your Child's Profile"}
              </h2>
              <p className="text-xs text-slate-500 max-w-md">
                {language === 'hi'
                  ? 'अपने बच्चे से पारिवारिक कनेक्शन कोड (Family Code) मांगें या नीचे दिए गए डेमो कोड से तुरंत लिंक करें।'
                  : 'Enter the family invitation code generated on your child’s student portal.'}
              </p>
            </div>

            <form onSubmit={handleConnect} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="HS-FAMILY-..."
                className="text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 uppercase bg-slate-50"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow-sm w-full sm:w-auto"
              >
                {language === 'hi' ? 'लिंक करें' : 'Link Profile'}
              </button>
            </form>
          </div>

          {connectMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold text-center">
              {connectMessage}
            </div>
          )}
        </div>
      ) : (
        /* Connected Status Banner */
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {language === 'hi' ? `${parent.childName} की प्रोफ़ाइल सफलतापूर्वक लिंक है` : `Connected to ${parent.childName}'s Profile`}
              </h3>
              <p className="text-xs text-slate-600">
                {language === 'hi' ? 'परिवार साझाकरण अनुमति सक्रिय है।' : 'Family permission active. Updates sync automatically.'}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase text-emerald-800 bg-white border border-emerald-200 px-3 py-1 rounded-full">
            Active Sync
          </span>
        </div>
      )}

      {/* Shared Student Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
              {parent.childName ? parent.childName[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">{parent.childName || 'Child'}</h3>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  {parent.childEducation}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {parent.district}, {parent.state}
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-400 font-semibold italic">
            {language === 'hi' ? 'बच्चे द्वारा साझा किया गया विवरण' : 'Shared by your child'}
          </span>
        </div>

        {/* Child's Current Chosen Career Interest */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {language === 'hi' ? 'बच्चे का पसंदीदा करियर' : 'CURRENT CAREER CHOICE'}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              NSQF Level {chosenTrade.nsqfLevel}
            </span>
          </div>

          <h4 className="text-xl font-black text-slate-900">
            {language === 'hi' ? chosenTrade.titleHi : chosenTrade.title}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {language === 'hi' ? chosenTrade.shortDescriptionHi : chosenTrade.shortDescription}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'ट्रेनिंग अवधि:' : 'Duration:'}</span>
              <strong className="text-slate-800">{chosenTrade.durationMonths} {language === 'hi' ? 'माह' : 'Months'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'शुरुआती वेतन:' : 'Entry Wage:'}</span>
              <strong className="text-emerald-700">{chosenTrade.salary.entryLevel}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? '3 वर्ष बाद:' : '3-Year Growth:'}</span>
              <strong className="text-slate-800">{chosenTrade.salary.midLevel3Yr}</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateExplore(chosenTrade.id)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              {language === 'hi' ? 'करियर विस्तार समझें' : 'Understand This Career'}
            </button>
            <button
              onClick={onOpenFamilyRoom}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              {language === 'hi' ? 'पारिवारिक चर्चा शुरू करें' : 'Discuss in Family Room'}
            </button>
          </div>
        </div>

        {/* Child's Shared Interests */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            {language === 'hi' ? 'बच्चे द्वारा चुनी गई रुचियां (Interests)' : 'Selected Interests'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {(studentData?.interests && studentData.interests.length > 0
              ? studentData.interests
              : ['Technology', 'Machines', 'Green Energy', 'Hands-on Circuits']
            ).map((int, i) => (
              <span
                key={i}
                className="bg-white border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1 rounded-xl shadow-2xs"
              >
                • {int}
              </span>
            ))}
          </div>
        </div>

        {/* Child's Career Plan Milestones (Read-only for parent, no secret edits) */}
        {studentData?.careerPlanTasks && studentData.careerPlanTasks.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'बच्चे का करियर एक्शन प्लान (Shared Plan)' : 'Child’s Career Action Plan'}
            </h4>
            <div className="space-y-1.5 text-xs text-slate-800 font-medium">
              {studentData.careerPlanTasks.map(task => (
                <div key={task.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                  <span className={task.completed ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                    {task.completed ? '✓' : '☐'}
                  </span>
                  <span className={task.completed ? 'line-through text-slate-400' : ''}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
