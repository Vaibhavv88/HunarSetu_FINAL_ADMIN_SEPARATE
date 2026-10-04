import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Users, Clock, ShieldCheck, CheckCircle2, AlertTriangle, Plus, FileText, Calendar, ArrowLeft } from 'lucide-react';
import { CounsellingCase, CounsellorNote } from '../../types/counsellor';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';

interface CounsellorCallSessionViewProps {
  language: 'en' | 'hi';
  caseItem: CounsellingCase;
  onEndCall: () => void;
  onSaveNote: (noteText: string, visibility: 'private' | 'shared_with_family') => void;
}

export const CounsellorCallSessionView: React.FC<CounsellorCallSessionViewProps> = ({
  language,
  caseItem,
  onEndCall,
  onSaveNote
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(145); // started 2:25 ago
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [quickNote, setQuickNote] = useState<string>('');
  const [noteVisibility, setNoteVisibility] = useState<'private' | 'shared_with_family'>('private');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const trade = NSQF_VOCATIONAL_TRADES.find(t => t.id === 'solar-technician') || NSQF_VOCATIONAL_TRADES[0];

  const handleSaveLiveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    onSaveNote(quickNote.trim(), noteVisibility);
    setQuickNote('');
    setSaveSuccessMsg(language === 'hi' ? 'नोट सहेज लिया गया ✓' : 'Note saved successfully ✓');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Top Banner with Active Call Status */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onEndCall}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm sm:text-base font-black text-white">
                {language === 'hi' ? 'लाइव परामर्श कॉल (Live Session)' : 'Live Career Counselling Session'}
              </h1>
              <span className="font-mono text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                {formatTime(secondsElapsed)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {caseItem.studentName} {caseItem.parentName ? `+ ${caseItem.parentName}` : ''} • {caseItem.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isMuted ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              !isVideoOn ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            {!isVideoOn ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            <span>{isVideoOn ? 'Video On' : 'Video Off'}</span>
          </button>

          <button
            onClick={onEndCall}
            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <PhoneOff className="w-4 h-4" />
            <span>{language === 'hi' ? 'सत्र समाप्त करें' : 'End Call'}</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Screen: Left (User Info) | Middle (Video Sim) | Right (Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT PANEL: User Information & Verified Evidence (col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
              {language === 'hi' ? 'केस प्रोफाइल' : 'PARTICIPANT PROFILE'}
            </span>
            <h2 className="text-sm font-black text-slate-900 mt-0.5">
              {caseItem.studentName}
            </h2>
            <p className="text-[11px] text-slate-500">
              {caseItem.studentEducation || 'Class 12th'} • {caseItem.district}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block">{language === 'hi' ? 'छात्र की पसंद:' : 'Student Preference:'}</span>
            <p className="font-bold text-slate-900 leading-snug">
              {caseItem.studentGoalSummary}
            </p>
          </div>

          {caseItem.parentName && (
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1">
              <span className="text-[10px] font-bold text-amber-800 block">
                {language === 'hi' ? 'अभिभावक की मुख्य चिंता:' : 'Parent Concern:'}
              </span>
              <p className="font-bold text-amber-950 leading-snug">
                {caseItem.parentConcernSummary}
              </p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 block">
              {language === 'hi' ? 'सत्यापित साक्ष्य (NSQF Data)' : 'Verified Evidence'}
            </span>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] block">Entry to Mid Salary:</span>
              <strong className="text-slate-900 block">{trade.salary.entryLevel} → {trade.salary.midLevel3Yr}</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] block">Higher Study Pathway:</span>
              <strong className="text-slate-900 block">{trade.degreeProgression}</strong>
            </div>
          </div>
        </div>

        {/* MIDDLE PANEL: Realistic Session Simulator Area (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-950 rounded-3xl p-4 flex flex-col justify-between min-h-[460px] shadow-md border border-slate-800">
          {/* Active Call Tiles */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Tile 1: Student */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-md">
                  Student
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center mx-auto shadow-md">
                  {caseItem.studentName.charAt(0)}
                </div>
                <h4 className="text-white text-xs font-bold mt-2">{caseItem.studentName}</h4>
                <p className="text-[10px] text-slate-400">Audio Connected</p>
              </div>
              <div className="text-[9px] text-slate-500">Live • Kanpur Nagar</div>
            </div>

            {/* Tile 2: Parent (if present) or Trade Screen */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-md">
                  {caseItem.parentName ? 'Parent' : 'Shared Screen'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
                  {caseItem.parentName ? caseItem.parentName.charAt(0) : '📊'}
                </div>
                <h4 className="text-white text-xs font-bold mt-2">
                  {caseItem.parentName || 'Evidence Dashboard'}
                </h4>
                <p className="text-[10px] text-slate-400">Audio Connected</p>
              </div>
              <div className="text-[9px] text-slate-500">Live • Kanpur Nagar</div>
            </div>
          </div>

          {/* Counsellor Self Tile (Small Overlay) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 mt-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sky-500 text-white font-bold flex items-center justify-center text-[10px]">
                You
              </div>
              <span className="font-bold">Dr. Priya Sharma (Verified Counsellor)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">● Transmitting</span>
          </div>
        </div>

        {/* RIGHT PANEL: Live Session Notes & Actions (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
              {language === 'hi' ? 'सत्र टिप्पणियां (Live Notes)' : 'COUNSELLOR LIVE NOTES'}
            </span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5">
              {language === 'hi' ? 'परामर्श अवलोकन एवं सहमति' : 'Session Observations'}
            </h3>
          </div>

          {saveSuccessMsg && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-center font-bold">
              {saveSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveLiveNote} className="space-y-3">
            <textarea
              rows={4}
              value={quickNote}
              onChange={e => setQuickNote(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'सत्र के दौरान हुई बातचीत, सहमति और अगले कदमों को यहाँ दर्ज करें...'
                  : 'Document mutual consensus, parent reassurance, and agreed action items...'
              }
              className="w-full text-xs font-medium p-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-sky-500 bg-slate-50"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="liveVis"
                    checked={noteVisibility === 'private'}
                    onChange={() => setNoteVisibility('private')}
                  />
                  <span>🔒 {language === 'hi' ? 'निजी नोट' : 'Private'}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="liveVis"
                    checked={noteVisibility === 'shared_with_family'}
                    onChange={() => setNoteVisibility('shared_with_family')}
                  />
                  <span>👥 {language === 'hi' ? 'परिवार को दिखाएं' : 'Share with Family'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!quickNote.trim()}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-xl transition shadow-2xs"
              >
                {language === 'hi' ? 'नोट सहेजें' : 'Save Session Note'}
              </button>
            </div>
          </form>

          {/* Quick Action Buttons */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 block">
              {language === 'hi' ? 'त्वरित कार्रवाई (Quick Tools)' : 'QUICK ACTIONS'}
            </span>

            <button
              onClick={() => {
                setQuickNote('Add the agreed action, evidence to review, and next follow-up date.');
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 transition"
            >
              📝 {language === 'hi' ? 'आईटीआई विजिट सहमति दर्ज करें' : 'Record ITI Visit Agreement'}
            </button>

            <button
              onClick={() => {
                setQuickNote('Explained AICTE lateral entry guidelines. Student committed to pursuing Polytechnic Diploma after ITI.');
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 transition"
            >
              🎓 {language === 'hi' ? 'लेटरल एंट्री बी.टेक रोडमैप नोट' : 'Record Lateral B.Tech Pathway'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
