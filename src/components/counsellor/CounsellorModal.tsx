import React, { useState } from 'react';
import { X, PhoneCall, MessageSquare, CheckCircle2, ShieldCheck, Clock, Users, Calendar, ArrowRight, UserCheck } from 'lucide-react';
import { LearnerProfile, ParentProfile } from '../../types/career';
import { CounsellingRequest, CounsellingRequestType, ConcernCategory } from '../../types/counsellor';
import { DEMO_COUNSELLOR_PRIYA } from '../../data/counsellorStore';
import { counsellingService } from '../../services/counsellingService';

interface CounsellorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
  learner: LearnerProfile;
  parent: ParentProfile;
  selectedTradeName: string;
  onOpenChat?: (caseId: string) => void;
}

export const CounsellorModal: React.FC<CounsellorModalProps> = ({
  isOpen,
  onClose,
  language,
  learner,
  parent,
  selectedTradeName,
  onOpenChat
}) => {
  const [requestMode, setRequestMode] = useState<CounsellingRequestType>('message');
  const [phone, setPhone] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ConcernCategory>('Job Security');
  const [messageText, setMessageText] = useState<string>(
    `I am exploring ${selectedTradeName}. Need verified human guidance regarding job security and realistic starting wages.`
  );
  const [preferredDate, setPreferredDate] = useState<string>('Tomorrow');
  const [preferredSlot, setPreferredSlot] = useState<string>('11:30 AM');
  const [consentAISummary, setConsentAISummary] = useState<boolean>(true);
  const [submittedRequest, setSubmittedRequest] = useState<CounsellingRequest | null>(null);
  const [createdCaseId, setCreatedCaseId] = useState<string>('CASE-1042');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const concernCategories: ConcernCategory[] = [
    'Job Security',
    'Salary & Earnings',
    'Career Growth',
    'Higher Education (B.Tech/Degree)',
    'Training & ITIs',
    'Safety & Working Conditions',
    'Child-Parent Disagreement',
    'Location & Relocation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isParentSubmission = !!parent.guardianName && parent.guardianName !== 'Parent / Guardian';
    const requesterRole = requestMode === 'family_session' ? 'FAMILY' : isParentSubmission ? 'PARENT' : 'STUDENT';
    const requesterName = isParentSubmission ? `${parent.guardianName} (${parent.guardianRelation || 'Parent'})` : learner.name || 'Student';

    try {
      const result = await counsellingService.submitRequest({
        requesterUserId: learner.name ? `USER-${learner.name.replace(/\s+/g, '').toUpperCase()}` : 'USER-DEF',
        requesterType: requesterRole,
        requesterName,
        studentName: learner.name || 'Student',
        parentName: isParentSubmission ? parent.guardianName : undefined,
        phone: phone.trim() || '',
        district: learner.district || 'Kanpur Nagar',
        state: learner.state || 'Uttar Pradesh',
        preferredLanguage: language === 'hi' ? 'Hindi' : 'English',
        requestType: requestMode === 'family_session' ? 'FAMILY_SESSION' : requestMode === 'call' ? 'CALL' : 'MESSAGE',
        concernCategory: selectedCategory,
        subject: `${selectedCategory} guidance for ${selectedTradeName}`,
        message: messageText.trim(),
        careerReferenceTradeTitle: selectedTradeName,
        preferredDate: requestMode !== 'message' ? preferredDate : undefined,
        preferredTimeSlot: requestMode !== 'message' ? preferredSlot : undefined,
        priority: 'High',
        consentShareAISummary: consentAISummary,
        aiConversationSummary: consentAISummary
          ? `User explored ${selectedTradeName}. Primary hesitation regarding ${selectedCategory}.`
          : undefined
      });

      if (result.caseItem?.id) {
        setCreatedCaseId(result.caseItem.id);
        try {
          localStorage.setItem('hunarsetu_active_case_id', result.caseItem.id);
        } catch {}
      }

      setSubmittedRequest(result.request);
    } catch (err: any) {
      console.warn('API submission failed, falling back to local store:', err);
      // Fallback
      const fallbackRequest: CounsellingRequest = {
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        caseId: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
        requesterType: requesterRole.toLowerCase() as any,
        requesterName,
        studentName: learner.name || 'Student',
        parentName: isParentSubmission ? parent.guardianName : undefined,
        phone,
        district: learner.district || 'Kanpur Nagar',
        state: learner.state || 'Uttar Pradesh',
        preferredLanguage: language === 'hi' ? 'Hindi' : 'English',
        requestType: requestMode,
        concernCategory: selectedCategory,
        messageText: messageText.trim(),
        careerReferenceTradeTitle: selectedTradeName,
        preferredDate: requestMode !== 'message' ? preferredDate : undefined,
        preferredTimeSlot: requestMode !== 'message' ? preferredSlot : undefined,
        createdAt: 'Just now',
        status: 'new',
        priority: 'High',
        consentShareAISummary: consentAISummary
      };

      try {
        const existing = localStorage.getItem('hunarsetu_counsellor_requests');
        const parsed = existing ? JSON.parse(existing) : [];
        localStorage.setItem('hunarsetu_counsellor_requests', JSON.stringify([fallbackRequest, ...parsed]));
      } catch {}

      setSubmittedRequest(fallbackRequest);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/20 px-2 py-0.5 rounded">
                  {language === 'hi' ? 'सत्यापित मानव परामर्श' : 'CERTIFIED HUMAN GUIDANCE'}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                {language === 'hi' ? 'प्रमाणित सरकारी काउंसलर से जुड़ें' : 'Talk to a Certified Counsellor'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {submittedRequest ? (
          <div className="p-6 sm:p-8 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                {language === 'hi' ? 'अनुरोध सफलतापूर्वक दर्ज हुआ!' : 'Request Submitted Successfully!'}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                {language === 'hi'
                  ? `आपका अनुरोध काउंसलर डॉ. प्रिया शर्मा के डेस्क पर भेज दिया गया है। वे जल्द ही ${phone} पर संपर्क करेंगी।`
                  : `Your request has been routed to Certified Counsellor Dr. Priya Sharma. She will respond or call at ${phone}.`}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Request ID:</span>
                <span className="font-mono font-bold text-slate-900">{submittedRequest.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mode:</span>
                <span className="font-bold text-sky-700">
                  {submittedRequest.requestType === 'family_session'
                    ? '👨‍👩‍👦 Joint Family Session'
                    : submittedRequest.requestType === 'call'
                    ? '📞 1-on-1 Call'
                    : '💬 Message'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-700 font-bold">✓ Pending Review on Counsellor Desk</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {onOpenChat && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChat(createdCaseId);
                  }}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{language === 'hi' ? 'काउंसलर से संवाद व चैट देखें' : 'Open Counsellor Chat & Track'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl text-xs transition"
              >
                {language === 'hi' ? 'समाप्त करें (Close)' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Verified Counsellor Spotlight Card */}
            <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-900 font-bold">{DEMO_COUNSELLOR_PRIYA.name}</strong>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {DEMO_COUNSELLOR_PRIYA.specialization[0]} • 7 Yrs Exp • Hindi / English
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Available</span>
            </div>

            {/* Mode Selector (Message vs Call vs Family) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'hi' ? 'आप कैसे बात करना चाहते हैं?' : 'How would you like to connect?'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestMode('message')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    requestMode === 'message'
                      ? 'bg-sky-600 text-white border-sky-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{language === 'hi' ? 'संदेश' : 'Message'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestMode('call')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    requestMode === 'call'
                      ? 'bg-sky-600 text-white border-sky-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{language === 'hi' ? 'कॉल' : '1-on-1 Call'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestMode('family_session')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    requestMode === 'family_session'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{language === 'hi' ? 'परिवार सत्र' : 'Family Session'}</span>
                </button>
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'hi' ? 'मुख्य चिंता / विषय (Category):' : 'Primary Concern Topic:'}
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as ConcernCategory)}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 bg-white"
              >
                {concernCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {requestMode === 'message'
                    ? (language === 'hi' ? 'अपना प्रश्न लिखें:' : 'Your Doubt / Question:')
                    : (language === 'hi' ? 'कॉल का मुख्य कारण:' : 'Reason for Call:')}
                </label>
                <span className="text-[10px] text-slate-400">
                  {language === 'hi' ? 'काउंसलर से साझा होगा' : 'Shared with Counsellor'}
                </span>
              </div>
              <textarea
                rows={2}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 bg-slate-50"
              />
            </div>

            {/* If Call / Family Session: Slot Choice */}
            {requestMode !== 'message' && (
              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                <div>
                  <label className="block mb-1">Preferred Day:</label>
                  <select
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="This Saturday">This Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Preferred Time:</label>
                  <select
                    value={preferredSlot}
                    onChange={e => setPreferredSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'संपर्क फोन नंबर (Phone for Callback):' : 'Phone for Callback:'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 bg-white"
              />
            </div>

            {/* Privacy Checkbox */}
            <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={consentAISummary}
                onChange={e => setConsentAISummary(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
              />
              <span>
                {language === 'hi'
                  ? 'मैं इस ट्रेड के बारे में मेरी पिछली एआई बातचीत का संक्षिप्त सारांश काउंसलर के साथ साझा करने की अनुमति देता हूँ।'
                  : 'I authorize sharing an AI summary of my career interests with the certified counsellor.'}
              </span>
            </label>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={loading || !messageText.trim()}
                className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <span>
                  {loading
                    ? (language === 'hi' ? 'भेज रहे हैं...' : 'Submitting...')
                    : requestMode === 'message'
                    ? (language === 'hi' ? 'संदेश भेजें' : 'Send Message')
                    : (language === 'hi' ? 'कॉल बुक करें' : 'Request Call')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
