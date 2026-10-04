import React, { useState } from 'react';
import { Briefcase, Users, CheckCircle2, AlertTriangle, ArrowRight, MessageSquare, PhoneCall, Plus, Calendar, Clock, ShieldCheck, Edit3, Send } from 'lucide-react';
import { CounsellingCase, CounsellorNote, CounsellorRecommendation, CounsellingFollowUp } from '../../types/counsellor';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';

interface CounsellorCasesViewProps {
  language: 'en' | 'hi';
  cases: CounsellingCase[];
  selectedCaseId?: string;
  onSelectCase: (caseId: string) => void;
  onUpdateCaseStage: (caseId: string, stage: CounsellingCase['stage']) => void;
  onAddNote: (caseId: string, noteText: string, visibility: 'private' | 'shared_with_family') => void;
  onAddRecommendation: (caseId: string, rec: Omit<CounsellorRecommendation, 'id'>) => void;
  onAddFollowUp: (caseId: string, followUp: Omit<CounsellingFollowUp, 'id' | 'createdAt' | 'status'>) => void;
  onOpenChat: (caseId: string) => void;
  onStartCall: (caseId: string) => void;
}

export const CounsellorCasesView: React.FC<CounsellorCasesViewProps> = ({
  language,
  cases,
  selectedCaseId,
  onSelectCase,
  onUpdateCaseStage,
  onAddNote,
  onAddRecommendation,
  onAddFollowUp,
  onOpenChat,
  onStartCall
}) => {
  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const [activeTab, setActiveTab] = useState<'summary' | 'notes' | 'recommendations' | 'followups'>('summary');

  // New Note State
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [noteVisibility, setNoteVisibility] = useState<'private' | 'shared_with_family'>('private');

  // New Recommendation State
  const [isAddingRec, setIsAddingRec] = useState<boolean>(false);
  const [recTradeId, setRecTradeId] = useState<string>('solar-technician');
  const [recWhy, setRecWhy] = useState<string>('');
  const [recPathway, setRecPathway] = useState<string>('');
  const [recVerify, setRecVerify] = useState<string>('');

  // New Follow-up State
  const [isAddingFollowUp, setIsAddingFollowUp] = useState<boolean>(false);
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [followUpReason, setFollowUpReason] = useState<string>('');

  const stages: CounsellingCase['stage'][] = [
    'New',
    'Initial Discussion',
    'Career Exploration',
    'Family Discussion',
    'Career Planning',
    'Follow-up',
    'Resolved',
    'Escalated'
  ];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeCase) return;
    onAddNote(activeCase.id, newNoteText.trim(), noteVisibility);
    setNewNoteText('');
  };

  const handleCreateRec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;
    const trade = NSQF_VOCATIONAL_TRADES.find(t => t.id === recTradeId) || NSQF_VOCATIONAL_TRADES[0];
    onAddRecommendation(activeCase.id, {
      tradeId: trade.id,
      tradeTitle: trade.title,
      whyDiscussed: recWhy || 'Matches candidate practical aptitude and regional demand.',
      skillsToDevelop: trade.keySkills.slice(0, 3),
      trainingPathway: recPathway || 'ITI Certificate + NAPS Paid Apprenticeship',
      thingsToVerify: recVerify || 'Check local government ITI vacancy and scholarship.'
    });
    setIsAddingRec(false);
    setRecWhy('');
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !followUpReason.trim()) return;
    onAddFollowUp(activeCase.id, {
      caseId: activeCase.id,
      studentName: activeCase.studentName,
      parentName: activeCase.parentName,
      dueDate: followUpDate,
      reason: followUpReason,
      message: `Follow up regarding ${activeCase.activeTradeTitle} decision and campus visit.`
    });
    setIsAddingFollowUp(false);
    setFollowUpReason('');
  };

  if (!activeCase) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active cases found.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Selector / Case Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
            {language === 'hi' ? 'सक्रिय केस प्रबंधन' : 'ACTIVE CASE DIRECTORY'}
          </span>
          <h1 className="text-lg font-black text-slate-900">
            {language === 'hi' ? 'छात्र एवं परिवार परामर्श केस' : 'Student & Family Case Profiles'}
          </h1>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {cases.map(c => {
            const isSelected = c.id === activeCase.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{c.studentName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                  c.stage === 'Resolved' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
                }`}>
                  {c.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CASE MASTER CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Header with Case ID, Stage Dropdown, and Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-lg">
                {activeCase.id}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {activeCase.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {activeCase.studentName} ({activeCase.studentEducation}) • {activeCase.parentName ? `Parent: ${activeCase.parentName} (${activeCase.guardianRelation})` : 'Individual'} • {activeCase.district}, {activeCase.state}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stage Selector */}
            <select
              value={activeCase.stage}
              onChange={e => onUpdateCaseStage(activeCase.id, e.target.value as any)}
              className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
            >
              {stages.map(st => (
                <option key={st} value={st}>
                  Stage: {st}
                </option>
              ))}
            </select>

            <button
              onClick={() => onOpenChat(activeCase.id)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'चैट' : 'Chat'}</span>
            </button>

            <button
              onClick={() => onStartCall(activeCase.id)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सत्र कॉल' : 'Live Call'}</span>
            </button>
          </div>
        </div>

        {/* COUNSELLOR CASE SUMMARY (Top 4 Quick-Read Fields) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block">
              {language === 'hi' ? '1. छात्र का लक्ष्य (Student Goal)' : 'Student Goal'}
            </span>
            <p className="text-xs font-bold text-slate-900 leading-snug">
              {activeCase.studentGoalSummary}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block">
              {language === 'hi' ? '2. अभिभावक की चिंता (Parent Concern)' : 'Parent Concern'}
            </span>
            <p className="text-xs font-bold text-slate-900 leading-snug">
              {activeCase.parentConcernSummary || 'None recorded yet.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block">
              {language === 'hi' ? '3. विचाराधीन ट्रेड (Target Trade)' : 'Target Trade'}
            </span>
            <p className="text-xs font-bold text-amber-950 leading-snug">
              🎯 {activeCase.activeTradeTitle}
            </p>
          </div>

          <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 space-y-1">
            <span className="text-[10px] font-black uppercase text-sky-800 block">
              {language === 'hi' ? '4. अनुशंसित अगला कदम (Next Step)' : 'Agreed Next Step'}
            </span>
            <p className="text-xs font-bold text-sky-950 leading-snug">
              {activeCase.recommendedNextStep}
            </p>
          </div>
        </div>

        {/* Case Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'summary' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'hi' ? 'केस सारांश व सत्र' : 'Sessions & Overview'}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'notes' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'hi' ? 'परामर्शदाता नोट्स' : 'Counsellor Notes'} ({activeCase.notes.length})
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'recommendations' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'hi' ? 'ट्रेड सिफारिशें' : 'Recommendations'} ({activeCase.recommendations.length})
          </button>
          <button
            onClick={() => setActiveTab('followups')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'followups' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'hi' ? 'फॉलो-अप ट्रैकर' : 'Follow-ups'} ({activeCase.followUps.length})
          </button>
        </div>

        {/* TAB 1: SESSIONS & OVERVIEW */}
        {activeTab === 'summary' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <h3 className="font-extrabold text-slate-900">
              {language === 'hi' ? 'इस केस के परामर्श सत्र (Counselling Sessions)' : 'Scheduled & Past Sessions'}
            </h3>

            {activeCase.sessions.length === 0 ? (
              <p className="text-slate-500 py-4 text-center">
                {language === 'hi' ? 'कोई सत्र निर्धारित नहीं है।' : 'No sessions scheduled yet.'}
              </p>
            ) : (
              <div className="space-y-2">
                {activeCase.sessions.map(s => (
                  <div
                    key={s.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{s.scheduledTime}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded">
                          {s.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {s.sessionType === 'joint_family' ? '👨‍👩‍👦 Joint Family Session' : '👤 1-on-1'} • {s.durationMinutes} mins
                      </p>
                    </div>

                    <button
                      onClick={() => onStartCall(activeCase.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'सत्र में जुड़ें' : 'Join Call'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Add Note Form */}
            <form onSubmit={handleCreateNote} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700">
                {language === 'hi' ? 'नया परामर्श नोट जोड़ें (Add Professional Note)' : 'Add Professional Session Note'}
              </label>
              <textarea
                rows={2}
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
                placeholder={language === 'hi' ? 'छात्र की रुचि, परिवार की सहमति या अगले कदम के बारे में लिखें...' : 'Record observations, agreements, or hesitation points...'}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 bg-white"
              />

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                    <input
                      type="radio"
                      name="noteVis"
                      checked={noteVisibility === 'private'}
                      onChange={() => setNoteVisibility('private')}
                    />
                    <span>🔒 {language === 'hi' ? 'निजी (Only Counsellor)' : 'Private Note'}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                    <input
                      type="radio"
                      name="noteVis"
                      checked={noteVisibility === 'shared_with_family'}
                      onChange={() => setNoteVisibility('shared_with_family')}
                    />
                    <span>👥 {language === 'hi' ? 'परिवार के साथ साझा' : 'Share with Family'}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  {language === 'hi' ? 'नोट सहेजें' : 'Save Note'}
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              {activeCase.notes.map(n => (
                <div
                  key={n.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">{n.createdAt}</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      n.visibility === 'private'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {n.visibility === 'private' ? '🔒 Private' : '👥 Shared with Family'}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {n.noteText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-400">
                {language === 'hi' ? 'अनुशंसित ट्रेड्स एवं मार्ग' : 'Counsellor Structured Recommendations'}
              </h3>
              <button
                onClick={() => setIsAddingRec(!isAddingRec)}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सिफारिश जोड़ें' : 'Add Recommendation'}</span>
              </button>
            </div>

            {isAddingRec && (
              <form onSubmit={handleCreateRec} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Select Vocational Trade:</label>
                  <select
                    value={recTradeId}
                    onChange={e => setRecTradeId(e.target.value)}
                    className="w-full font-bold p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {NSQF_VOCATIONAL_TRADES.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Why this was discussed:</label>
                  <input
                    type="text"
                    value={recWhy}
                    onChange={e => setRecWhy(e.target.value)}
                    placeholder="Candidate strengths and local industrial clusters..."
                    className="w-full font-medium p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingRec(false)}
                    className="px-3 py-1.5 text-slate-500 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-1.5 rounded-xl"
                  >
                    Save Recommendation
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="space-y-3">
              {activeCase.recommendations.map(r => (
                <div
                  key={r.id}
                  className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs"
                >
                  <h4 className="text-sm font-black text-slate-900">
                    🎯 {r.tradeTitle}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Why Discussed:</span>
                      <p className="font-medium">{r.whyDiscussed}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Training Pathway:</span>
                      <p className="font-medium">{r.trainingPathway}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Things to Verify:</span>
                      <p className="font-medium">{r.thingsToVerify}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FOLLOW-UPS */}
        {activeTab === 'followups' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-400">
                {language === 'hi' ? 'केस फॉलो-अप रिमाइंडर' : 'Scheduled Follow-ups'}
              </h3>
              <button
                onClick={() => setIsAddingFollowUp(!isAddingFollowUp)}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'फॉलो-अप जोड़ें' : 'Add Follow-up'}</span>
              </button>
            </div>

            {isAddingFollowUp && (
              <form onSubmit={handleCreateFollowUp} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Due Date:</label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={e => setFollowUpDate(e.target.value)}
                      className="w-full font-bold p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Reason:</label>
                    <input
                      type="text"
                      value={followUpReason}
                      onChange={e => setFollowUpReason(e.target.value)}
                      placeholder="e.g. Check if parent approved ITI admission..."
                      className="w-full font-medium p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingFollowUp(false)}
                    className="px-3 py-1.5 text-slate-500 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-1.5 rounded-xl"
                  >
                    Set Follow-up
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {activeCase.followUps.map(f => (
                <div
                  key={f.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">📅 {f.dueDate}</span>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.2 rounded">
                        {f.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] font-medium">{f.reason}</p>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400">
                    {f.studentName}
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
