import React from 'react';
import { GraduationCap, Users, UserCheck, ShieldAlert, ArrowRight, Lock, Sparkles, CheckCircle2, Award, Building2 } from 'lucide-react';
import { UserRole } from '../../types/auth';

interface RolePortalLandingProps {
  language: 'en' | 'hi';
  onSelectRole: (role: UserRole) => void;
  onOpenLogin: (role: 'student' | 'parent' | 'counsellor' | 'admin') => void;
  onToggleLanguage: () => void;
}

export const RolePortalLanding: React.FC<RolePortalLandingProps> = ({
  language,
  onSelectRole,
  onOpenLogin,
  onToggleLanguage
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 text-white flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Language Toggle & Badge */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                {language === 'hi' ? 'हुनरसेतु (HunarSetu)' : 'HunarSetu'}
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                Secure Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'hi' ? 'परिवार एवं कौशल करियर निर्णय प्रणाली' : 'AI-Enabled Family & Vocational Career Decision System'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleLanguage}
          className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          {language === 'hi' ? 'English' : 'हिन्दी'}
        </button>
      </div>

      {/* Main Role Question Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 my-8">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{language === 'hi' ? 'प्रवेश द्वार • अपनी भूमिका चुनें' : 'Portal Gateway • Select Your Role'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          {language === 'hi' ? 'आप मंच पर किस रूप में जुड़ रहे हैं?' : 'Who Are You? Choose Your Role'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'hi'
            ? 'हुनरसेतु विद्यार्थी, अभिभावक, प्रमाणित काउंसलर और योजना प्रशासक सभी को एक साझा डिजिटल मंच पर जोड़ता है।'
            : 'HunarSetu provides personalized, role-specific intelligence for students, parents, counsellors, and administrators.'}
        </p>
      </div>

      {/* 4 Interactive Role Cards Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Student / Learner */}
        <div className="bg-slate-850 border-2 border-slate-700 hover:border-amber-400 rounded-3xl p-6 flex flex-col justify-between transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-amber-500/10 group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                {language === 'hi' ? 'लॉगिन आवश्यक' : 'Login Required'}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {language === 'hi' ? 'विद्यार्थी (Student)' : 'Student / Learner'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'अपनी रुचि, योग्यता व जिले के अनुसार 12+ उच्च मांग वाले NSQF ट्रेड्स खोजें, पारदर्शी मैच स्कोर और करियर रोडमैप देखें।'
                : 'Discover 12+ high-demand NSQF trades, explainable match scores, district job clusters, and lateral B.Tech ladders.'}
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? '4-चरणीय करियर विजार्ड' : 'Step-by-Step Discovery'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'पारदर्शी मैच स्कोर (0-100%)' : 'Explainable Match Scoring'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'पॉलीटेक्निक व डिग्री रोडमैप' : 'Degree Progression Ladder'}</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onOpenLogin('student')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <span>{language === 'hi' ? 'विद्यार्थी पोर्टल खोलें' : 'Enter as Student'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Parent / Family */}
        <div className="bg-slate-850 border-2 border-slate-700 hover:border-emerald-400 rounded-3xl p-6 flex flex-col justify-between transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-emerald-500/10 group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                {language === 'hi' ? 'लॉगिन आवश्यक' : 'Login Required'}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {language === 'hi' ? 'परिवार / अभिभावक' : 'Parent / Family'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'वेतनमान, नौकरी की गारंटी, सामाजिक प्रतिष्ठा, सुरक्षा और बच्चे की उच्च शिक्षा पर सत्यापित साक्ष्य देखें और पारिवारिक सत्र में भाग लें।'
                : 'Review verified evidence on income stability, job security, social prestige, and participate in the joint family decision session.'}
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'अभिभावक चिंता निवारण' : 'Parent Objection Rebuttal'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'तथ्य बनाम पारंपरिक धारणा' : 'Side-by-Side Fact Matrix'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'आवाज़ में सुनने की सुविधा' : 'Voice Audio Readout'}</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onOpenLogin('parent')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <span>{language === 'hi' ? 'अभिभावक सत्र खोलें' : 'Enter as Family / Parent'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 3: Certified Counsellor (Requires Login) */}
        <div className="bg-slate-850 border-2 border-slate-700 hover:border-sky-400 rounded-3xl p-6 flex flex-col justify-between transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-sky-500/10 group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                  {language === 'hi' ? 'सुरक्षित पोर्टल' : 'Authorized Staff'}
                </span>
                <Lock className="w-3 h-3 text-sky-400" />
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {language === 'hi' ? 'काउंसलर (Counsellor)' : 'Certified Counsellor'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'छात्र एवं परिवार के करियर विवादों, एस्केलेशन अलर्ट्स और टेली-परामर्श कतार को प्रबंधित करें। नोटिफिकेशन देखकर केस सुलझाएं।'
                : 'Manage student & family dispute tickets, receive live dispute alerts, conduct conference calls, and record resolution notes.'}
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'hi' ? 'लाइव नोटिफिकेशन अलर्ट्स' : 'Real-time Dispute Alerts'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'hi' ? 'पारिवारिक केस प्रबंधन' : 'Family Case Resolution'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'hi' ? 'कॉन्फ्रेंस कॉल व नोट्स' : 'Call Queue & Resolution Logs'}</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onOpenLogin('counsellor')}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'काउंसलर लॉगिन' : 'Counsellor Login'}</span>
            </button>
          </div>
        </div>

        {/* Card 4: Super Admin / Ministry (Requires Login) */}
        <div className="bg-slate-850 border-2 border-slate-700 hover:border-purple-400 rounded-3xl p-6 flex flex-col justify-between transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-purple-500/10 group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                  {language === 'hi' ? 'सर्वोच्च नियंत्रण' : 'Super Admin'}
                </span>
                <Lock className="w-3 h-3 text-purple-400" />
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {language === 'hi' ? 'एडमिन (Admin)' : 'System Administrator'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'काउंसलर्स बनाएं और प्रबंधित करें, पूरे सिस्टम को नियंत्रित करें, और राष्ट्रीय स्तर पर पारिवारिक प्रतिरोध के रुझान देखें।'
                : 'Create & govern certified counsellors, oversee all family sessions, and monitor nationwide hesitation analytics.'}
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'hi' ? 'नए काउंसलर बनाएं (+ Add)' : 'Create & Manage Counsellors'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'hi' ? 'समग्र सिस्टम नियंत्रण' : 'Full Platform Governance'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'hi' ? 'प्रतिरोध एनालिटिक्स (41% Income)' : 'National Hesitation Analytics'}</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onOpenLogin('admin')}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'एडमिन लॉगिन' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footnote */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
        <p>
          {language === 'hi'
            ? 'सुरक्षित पोर्टल • विद्यार्थी और परिवार अपने खाते से सुरक्षित रूप से प्रवेश कर सकते हैं।'
            : 'Secure Portal • Students and families sign in to access their saved profiles.'}
        </p>
      </div>
    </div>
  );
};
