import React from 'react';
import { PhoneCall, MessageSquare, Users, Clock, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, Calendar, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { CounsellorProfile, CounsellingRequest, CounsellingCase, CounsellingFollowUp } from '../../types/counsellor';

interface CounsellorDashboardOverviewProps {
  language: 'en' | 'hi';
  counsellor: CounsellorProfile;
  requests: CounsellingRequest[];
  cases: CounsellingCase[];
  onNavigate: (tab: string, contextId?: string) => void;
  onStartCall: (sessionCaseId: string) => void;
}

export const CounsellorDashboardOverview: React.FC<CounsellorDashboardOverviewProps> = ({
  language,
  counsellor,
  requests,
  cases,
  onNavigate,
  onStartCall
}) => {
  const newRequests = requests.filter(r => r.status === 'new');
  const activeCases = cases.filter(c => c.stage !== 'Resolved');
  const todayCalls = cases.flatMap(c => c.sessions).filter(s => s.status === 'scheduled');
  const pendingFollowUps = cases.flatMap(c => c.followUps).filter(f => f.status === 'pending');

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Welcome Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'hi' ? 'प्रमाणित मानव परामर्शदाता' : 'Demo Verified Counsellor'}</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-extrabold">
              {counsellor.badgeId}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'hi'
              ? `सुप्रभात, ${counsellor.name.replace('Dr. ', '')} जी 👋`
              : `Good morning, ${counsellor.name.split(' ')[1] || counsellor.name} 👋`}
          </h1>

          <p className="text-xs text-slate-300 max-w-xl font-medium">
            {language === 'hi'
              ? `अधिकार क्षेत्र: ${counsellor.district}, ${counsellor.state} • छात्र, अभिभावक और संयुक्त परिवार सत्रों में निष्पक्ष मार्गदर्शन प्रदान करें।`
              : `Jurisdiction: ${counsellor.district}, ${counsellor.state} • Supporting families with evidence, realistic pathways, and empathetic mediation.`}
          </p>
        </div>

        {/* Quick Family Mediation Highlight Button */}
        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => onNavigate('mediation')}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            <Users className="w-4 h-4 text-slate-950" />
            <span>{language === 'hi' ? 'पारिवारिक मध्यस्थता कक्ष' : 'Family Mediation Room'}</span>
          </button>
        </div>
      </div>

      {/* 5 Simple Dashboard Cards (No Overload) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: New Requests */}
        <div
          onClick={() => onNavigate('requests')}
          className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 hover:border-sky-400 cursor-pointer transition shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'hi' ? 'नए अनुरोध' : 'New Requests'}
            </span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition">
              {newRequests.length}
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{newRequests.length}</p>
          <span className="text-[10px] font-bold text-rose-600 block">
            {language === 'hi' ? 'तत्काल ध्यान अपेक्षित' : 'Awaiting review'}
          </span>
        </div>

        {/* Card 2: Active Cases */}
        <div
          onClick={() => onNavigate('cases')}
          className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 hover:border-sky-400 cursor-pointer transition shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'hi' ? 'सक्रिय केस' : 'Active Cases'}
            </span>
            <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition">
              {activeCases.length}
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{activeCases.length}</p>
          <span className="text-[10px] font-bold text-sky-600 block">
            {language === 'hi' ? 'मार्गदर्शन प्रगति पर' : 'In guidance'}
          </span>
        </div>

        {/* Card 3: Today's Calls */}
        <div
          onClick={() => onNavigate('calls')}
          className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 hover:border-emerald-400 cursor-pointer transition shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'hi' ? 'आज की कॉल' : "Today's Calls"}
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition">
              {todayCalls.length}
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{todayCalls.length}</p>
          <span className="text-[10px] font-bold text-emerald-700 block">
            {language === 'hi' ? 'निर्धारित सत्र' : 'Scheduled sessions'}
          </span>
        </div>

        {/* Card 4: Messages */}
        <div
          onClick={() => onNavigate('messages')}
          className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 hover:border-amber-400 cursor-pointer transition shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'hi' ? 'संदेश' : 'Conversations'}
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">3</p>
          <span className="text-[10px] font-bold text-amber-700 block">
            {language === 'hi' ? 'छात्र व परिवार चैट' : 'Family chat threads'}
          </span>
        </div>

        {/* Card 5: Follow-ups */}
        <div
          onClick={() => onNavigate('followups')}
          className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 hover:border-purple-400 cursor-pointer transition shadow-2xs group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'hi' ? 'फॉलो-अप' : 'Pending Follow-ups'}
            </span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs group-hover:scale-110 transition">
              {pendingFollowUps.length}
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{pendingFollowUps.length}</p>
          <span className="text-[10px] font-bold text-purple-700 block">
            {language === 'hi' ? 'समीक्षा शेष' : 'Upcoming review'}
          </span>
        </div>
      </div>

      {/* Main 2-Column Section: Today's Calls & Urgent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Today's Scheduled Calls */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-black text-slate-900">
                {language === 'hi' ? 'आज के निर्धारित कॉल सत्र' : "Today's Scheduled Counselling Calls"}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('calls')}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              {language === 'hi' ? 'सभी देखें →' : 'View all →'}
            </button>
          </div>

          <div className="space-y-3">
            {todayCalls.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-medium">
                {language === 'hi' ? 'आज के लिए कोई आगामी कॉल निर्धारित नहीं है।' : 'No upcoming calls scheduled for today.'}
              </p>
            ) : (
              todayCalls.map(sess => (
                <div
                  key={sess.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        {sess.scheduledTime}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {sess.studentName} {sess.parentName ? `+ ${sess.parentName}` : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {sess.sessionType === 'joint_family' ? (
                        <span className="text-amber-800 font-bold">👨‍👩‍👦 {language === 'hi' ? 'संयुक्त पारिवारिक सत्र' : 'Family Session'}</span>
                      ) : (
                        <span>👤 {language === 'hi' ? 'व्यक्तिगत सत्र' : '1-on-1 Session'}</span>
                      )} • {sess.tradeTitle}
                    </p>
                  </div>

                  <button
                    onClick={() => onStartCall(sess.caseId)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'कॉल शुरू करें' : 'Join Call'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: New Incoming Counselling Requests */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-black text-slate-900">
                {language === 'hi' ? 'नए परामर्श अनुरोध (Pending Review)' : 'New Incoming Requests'}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('requests')}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              {language === 'hi' ? 'अनुरोध सूची →' : 'Requests Queue →'}
            </button>
          </div>

          <div className="space-y-3">
            {newRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-medium">
                {language === 'hi' ? 'कोई नया अनुरोध लंबित नहीं है।' : 'No new requests in queue.'}
              </p>
            ) : (
              newRequests.slice(0, 3).map(req => (
                <div
                  key={req.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          {req.requesterType.toUpperCase()}
                        </span>
                        <h3 className="text-xs font-extrabold text-slate-900">
                          {req.requesterName}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {req.district}, {req.state} • {req.createdAt}
                      </p>
                    </div>

                    <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                      {req.concernCategory}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-2 italic bg-white p-2.5 rounded-xl border border-slate-200/60">
                    "{req.messageText}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {req.requestType === 'family_session' ? '👨‍👩‍👦 Joint Call' : req.requestType === 'call' ? '📞 1-on-1 Call' : '💬 Message'}
                    </span>
                    <button
                      onClick={() => onNavigate('requests', req.id)}
                      className="text-xs font-black text-sky-600 hover:text-sky-800 flex items-center gap-1"
                    >
                      <span>{language === 'hi' ? 'समीक्षा करें' : 'Review & Accept'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Professional Guidance Philosophy Box */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium text-slate-600">
        <div className="space-y-1">
          <strong className="text-slate-900 font-extrabold block">
            {language === 'hi' ? '📌 राष्ट्रीय कौशल परामर्श सिद्धांत:' : '📌 Core Skilling Mediation Principle:'}
          </strong>
          <p>
            {language === 'hi'
              ? 'काउंसलर छात्र या परिवार के लिए फैसला नहीं थोपता। काउंसलर का काम सरकारी आंकड़ों, वेतनमान और लेटरल एंट्री के साक्ष्य दिखाकर परिवार को सहमति बनाने में मदद करना है।'
              : 'The certified counsellor never dictates a choice. Your role is to provide verified salary data, career growth ladders, and mediate healthy family decisions.'}
          </p>
        </div>
        <div className="shrink-0 text-[10px] font-mono font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          NCVET / MSDE Standard
        </div>
      </div>
    </div>
  );
};
