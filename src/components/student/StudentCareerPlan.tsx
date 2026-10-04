import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Award, CheckCircle2, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';

interface StudentCareerPlanProps {
  language: 'en' | 'hi';
  student: StudentProfile;
  onUpdatePlanTasks: (tasks: StudentProfile['careerPlanTasks']) => void;
  onNavigateExplore: () => void;
}

export const StudentCareerPlan: React.FC<StudentCareerPlanProps> = ({
  language,
  student,
  onUpdatePlanTasks,
  onNavigateExplore
}) => {
  const [newTaskInput, setNewTaskInput] = useState<string>('');

  const targetTrade = NSQF_VOCATIONAL_TRADES.find(
    t => t.id === (student.lastExploredTradeId || 'solar-technician')
  ) || NSQF_VOCATIONAL_TRADES[0];

  const completedCount = student.careerPlanTasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / (student.careerPlanTasks.length || 1)) * 100);

  const toggleTask = (id: string) => {
    const updated = student.careerPlanTasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    onUpdatePlanTasks(updated);
  };

  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      text: newTaskInput.trim(),
      completed: false
    };
    onUpdatePlanTasks([...student.careerPlanTasks, newTask]);
    setNewTaskInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-8 animate-in fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'मेरा करियर प्लान (My Career Plan)' : 'My Career Action Plan'}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'hi'
            ? 'अपने चुने हुए लक्ष्य तक पहुँचने के लिए एक स्पष्ट, चरणबद्ध कार्ययोजना बनाएं।'
            : 'Track your step-by-step milestones to enroll, train, and start your vocational career.'}
        </p>
      </div>

      {/* Target Career Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full inline-block">
            {language === 'hi' ? 'लक्षित करियर' : 'TARGET VOCATIONAL CAREER'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'hi' ? targetTrade.titleHi : targetTrade.title}
          </h2>
          <p className="text-xs text-slate-400">
            {targetTrade.sector} • NSQF Level {targetTrade.nsqfLevel}
          </p>
        </div>

        <button
          onClick={onNavigateExplore}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shrink-0"
        >
          {language === 'hi' ? 'टारगेट करियर बदलें' : 'Change Target Career'}
        </button>
      </div>

      {/* Checklist & Progress */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-800 uppercase tracking-wider">
              {language === 'hi' ? 'प्लान प्रगति (Plan Progress)' : 'Progress Milestones'}
            </span>
            <span className="text-emerald-700">{progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Task Items */}
        <div className="space-y-2.5">
          {student.careerPlanTasks.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                task.completed
                  ? 'border-emerald-200 bg-emerald-50/50 text-slate-500 line-through'
                  : 'border-slate-200 hover:border-slate-300 text-slate-900 bg-white font-bold'
              }`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-300 shrink-0" />
              )}
              <span className="text-xs sm:text-sm leading-tight">{task.text}</span>
            </div>
          ))}
        </div>

        {/* Add Custom Step */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newTaskInput}
            onChange={e => setNewTaskInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            placeholder={language === 'hi' ? 'नया कदम जोड़ें (उदा. आईटीआई फॉर्म भरना)...' : 'Add custom task (e.g. collect documents)...'}
            className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-slate-50"
          />
          <button
            onClick={handleAddTask}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'जोड़ें' : 'Add Task'}</span>
          </button>
        </div>
      </div>

      {/* Skill Gap Analysis Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div>
          <h3 className="text-base font-black text-slate-900">
            {language === 'hi' ? 'हुनर विश्लेषण (Skill Gap Guidance)' : 'Skill Gap & Readiness Analysis'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'आपकी वर्तमान योग्यता के आधार पर विश्लेषण किया गया है कि आपके पास क्या हुनर है और कोर्स में क्या सीखना होगा।'
              : 'Estimating what skills you already possess versus key competencies you will develop.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
              {language === 'hi' ? 'आपके पास पहले से है (You Already Have)' : 'You Already Have'}
            </span>
            <ul className="space-y-1 text-emerald-950 font-semibold list-disc list-inside">
              <li>Basic numeracy and logical reasoning from {student.education || 'Class 10'}</li>
              <li>Interest in {student.workPreference.toLowerCase()}</li>
              <li>Willingness to train in {student.district}</li>
            </ul>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-900 block">
              {language === 'hi' ? 'कोर्स में विकसित करेंगे (You Will Develop)' : 'You May Want to Develop'}
            </span>
            <ul className="space-y-1 text-sky-950 font-semibold list-disc list-inside">
              {targetTrade.keySkills.slice(0, 4).map((sk, idx) => (
                <li key={idx}>{sk}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          * This is an indicative guidance estimate based on your profile and standard NSQF trade curriculum.
        </p>
      </div>
    </div>
  );
};
