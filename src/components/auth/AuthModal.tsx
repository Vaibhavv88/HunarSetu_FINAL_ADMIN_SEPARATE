import React, { useEffect, useState } from 'react';
import { X, Lock, Mail, UserCheck, KeyRound, ShieldCheck, AlertCircle, ArrowRight, UserPlus, Phone, Users } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: 'student' | 'parent' | 'counsellor' | 'admin';
  language: 'en' | 'hi';
  onLoginSuccess: (role: 'student' | 'family' | 'counsellor' | 'admin', userEmail: string, name?: string) => void;
}

const STAFF_CREDENTIALS = {
  admin: { email: 'admin@hunarsetu.gov.in', password: 'HunarSetu@Admin26' },
  counsellor: { email: 'counsellor@hunarsetu.gov.in', password: 'counsellor@123' }
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, targetRole, language, onLoginSuccess }) => {
  const familyRole = targetRole === 'parent' ? 'parent' : 'student';
  const isFamilyAccount = targetRole === 'student' || targetRole === 'parent';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setLoading(false);
    }
  }, [isOpen, targetRole]);

  if (!isOpen) return null;

  const title = targetRole === 'student'
    ? (language === 'hi' ? 'विद्यार्थी खाता' : 'Student Account')
    : targetRole === 'parent'
      ? (language === 'hi' ? 'अभिभावक खाता' : 'Parent Account')
      : targetRole === 'admin'
        ? (language === 'hi' ? 'सिस्टम एडमिन लॉगिन' : 'System Administrator Login')
        : (language === 'hi' ? 'काउंसलर लॉगिन' : 'Counsellor Login');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Read the actual DOM values on submit. This is important because Chrome/Edge
    // password managers can autofill fields without firing React onChange.
    const formData = new FormData(e.currentTarget);
    const submittedName = String(formData.get('name') || name).trim();
    const submittedPhone = String(formData.get('phone') || phone).trim();
    const submittedEmail = String(formData.get('email') || email).trim().toLowerCase();
    const submittedPassword = String(formData.get('password') || password);
    const submittedConfirmPassword = String(formData.get('confirmPassword') || confirmPassword);

    if (!submittedEmail || !submittedPassword) {
      setError(language === 'hi' ? 'ईमेल और पासवर्ड भरें।' : 'Please enter email and password.');
      return;
    }

    if (mode === 'register') {
      if (!submittedName) {
        setError(language === 'hi' ? 'नाम भरें।' : 'Please enter your name.');
        return;
      }
      if (submittedPassword.length < 8) {
        setError(language === 'hi' ? 'पासवर्ड कम से कम 8 अक्षरों का रखें।' : 'Password must be at least 8 characters.');
        return;
      }
      if (submittedPassword !== submittedConfirmPassword) {
        setError(language === 'hi' ? 'दोनों पासवर्ड समान होने चाहिए।' : 'Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = mode === 'register'
        ? { name: submittedName, phone: submittedPhone, email: submittedEmail, password: submittedPassword, confirmPassword: submittedConfirmPassword, role: familyRole }
        : { email: submittedEmail, password: submittedPassword, role: isFamilyAccount ? familyRole : targetRole };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success || !data?.token) {
        const message = data?.error || (response.status === 401
          ? (language === 'hi' ? 'ईमेल या पासवर्ड गलत है।' : 'Incorrect email or password.')
          : (language === 'hi' ? 'अभी लॉगिन नहीं हो सका। कृपया फिर से प्रयास करें।' : 'We could not complete this request. Please try again.'));
        throw new Error(message);
      }

      localStorage.setItem('hunarsetu_auth', JSON.stringify({
        token: data.token,
        role: data.role,
        accountRole: data.accountRole,
        email: data.email || submittedEmail,
        name: data.name || submittedName,
        userId: data.id,
        loginAt: new Date().toISOString()
      }));

      onLoginSuccess(data.role, data.email || submittedEmail, data.name || submittedName);
      onClose();
    } catch (err: any) {
      setError(err?.message || (language === 'hi' ? 'अभी लॉगिन नहीं हो सका। कृपया फिर से प्रयास करें।' : 'We could not complete the request. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const staff = STAFF_CREDENTIALS[targetRole as 'admin' | 'counsellor'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        <div className={`p-6 text-white flex items-center justify-between ${targetRole === 'admin' ? 'bg-gradient-to-r from-purple-900 to-indigo-950' : targetRole === 'counsellor' ? 'bg-gradient-to-r from-slate-900 to-sky-950' : 'bg-gradient-to-r from-slate-900 to-emerald-950'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              {isFamilyAccount ? (targetRole === 'student' ? <UserCheck className="w-5 h-5" /> : <Users className="w-5 h-5" />) : <Lock className="w-5 h-5" />}
            </div>
            <div><h3 className="font-extrabold text-base">{title}</h3><p className="text-xs text-slate-300">{isFamilyAccount ? (language === 'hi' ? 'अपनी जानकारी स्वयं दर्ज करें' : 'Enter your own account details') : (language === 'hi' ? 'अपना credential स्वयं दर्ज करें' : 'Enter your credentials manually')}</p></div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
        </div>

        {isFamilyAccount && (
          <div className="px-6 pt-5 flex gap-2">
            <button type="button" onClick={() => { setMode('login'); setError(''); }} className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold ${mode === 'login' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}><Lock className="w-3.5 h-3.5 inline mr-1" />{language === 'hi' ? 'लॉगिन' : 'Login'}</button>
            <button type="button" onClick={() => { setMode('register'); setError(''); }} className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold ${mode === 'register' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}><UserPlus className="w-3.5 h-3.5 inline mr-1" />{language === 'hi' ? 'नया रजिस्टर' : 'Register'}</button>
          </div>
        )}

        {isFamilyAccount && (
          <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-[11px] text-emerald-800 flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0" /><span>{language === 'hi' ? 'अपना खाता बनाएं। आगे उसी ईमेल और पासवर्ड से लॉगिन करें।' : 'Create your account once and use the same email and password for future sign-ins.'}</span></div>
        )}

        {!isFamilyAccount && staff && (
          <div className="mx-6 mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-600"><strong>Demo access:</strong> {staff.email} / {staff.password}</div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="p-6 space-y-4 text-xs">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

          {mode === 'register' && <>
            <div><label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'पूरा नाम' : 'Full Name'}</label><div className="relative"><UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input required autoComplete="off" name="name" value={name} onChange={e => setName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Your name" /></div></div>
            <div><label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}</label><div className="relative"><Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input autoComplete="off" name="phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="+91..." /></div></div>
          </>}

          <div><label className="block font-bold text-slate-700 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input type="email" autoComplete="off" name="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="you@example.com" /></div></div>
          <div><label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'पासवर्ड' : 'Password'}</label><div className="relative"><KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input type="password" autoComplete="new-password" name="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Minimum 8 characters" /></div></div>
          {mode === 'register' && <div><label className="block font-bold text-slate-700 mb-1">{language === 'hi' ? 'पासवर्ड फिर से भरें' : 'Confirm Password'}</label><input type="password" autoComplete="new-password" name="confirmPassword" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Re-enter password" /></div>}

          <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl text-white font-extrabold flex items-center justify-center gap-2 transition ${loading ? 'bg-slate-400 cursor-wait' : targetRole === 'admin' ? 'bg-indigo-700 hover:bg-indigo-800' : targetRole === 'counsellor' ? 'bg-sky-700 hover:bg-sky-800' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {loading ? 'Please wait...' : mode === 'register' ? (language === 'hi' ? 'खाता बनाएं और जारी रखें' : 'Create Account & Continue') : (language === 'hi' ? 'लॉगिन करें' : 'Login')}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
