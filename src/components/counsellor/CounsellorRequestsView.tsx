import React, { useState } from 'react';
import { Search, Filter, PhoneCall, MessageSquare, Users, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Clock, User, Eye, Lock } from 'lucide-react';
import { CounsellingRequest, CounsellingRequestStatus } from '../../types/counsellor';
import { NSQF_VOCATIONAL_TRADES } from '../../data/nsqfTrades';

interface CounsellorRequestsViewProps {
  language: 'en' | 'hi';
  requests: CounsellingRequest[];
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onOpenCase: (caseId: string) => void;
}

export const CounsellorRequestsView: React.FC<CounsellorRequestsViewProps> = ({
  language,
  requests,
  onAcceptRequest,
  onDeclineRequest,
  onOpenCase
}) => {
  const [filterType, setFilterType] = useState<'all' | 'message' | 'call' | 'family_session'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<CounsellingRequest | null>(null);

  const filteredRequests = requests.filter(req => {
    const matchesType = filterType === 'all' || req.requestType === filterType;
    const matchesSearch =
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.parentName && req.parentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      req.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.concernCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'hi' ? 'परामर्श अनुरोध कतार (Incoming Requests)' : 'Counselling Requests Queue'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'hi'
                ? 'छात्रों और अभिभावकों द्वारा सीधे भेजे गए संदेश, कॉल और पारिवारिक सत्र अनुरोध।'
                : 'Direct assistance requests submitted by learners and parents.'}
            </p>
          </div>

          <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 self-start sm:self-center">
            {filteredRequests.length} {language === 'hi' ? 'अनुरोध उपलब्ध' : 'Requests in Queue'}
          </span>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'hi' ? 'सभी अनुरोध' : 'All Requests'}
            </button>
            <button
              onClick={() => setFilterType('message')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                filterType === 'message'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              💬 {language === 'hi' ? 'संदेश' : 'Messages'}
            </button>
            <button
              onClick={() => setFilterType('call')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                filterType === 'call'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              📞 {language === 'hi' ? 'कॉल अनुरोध' : 'Calls'}
            </button>
            <button
              onClick={() => setFilterType('family_session')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                filterType === 'family_session'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              👨‍👩‍👦 {language === 'hi' ? 'पारिवारिक सत्र' : 'Family Sessions'}
            </button>
          </div>

          <div className="relative w-full sm:w-64 sm:ml-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'नाम या जिले से खोजें...' : 'Search name or district...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold">
              {language === 'hi' ? 'इस श्रेणी में कोई अनुरोध नहीं है।' : 'No requests matching this filter.'}
            </p>
          </div>
        ) : (
          filteredRequests.map(req => {
            const isAccepted = req.status === 'accepted' || req.status === 'scheduled';
            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 font-bold ${
                        req.requestType === 'family_session'
                          ? 'bg-amber-600'
                          : req.requestType === 'call'
                          ? 'bg-emerald-600'
                          : 'bg-sky-600'
                      }`}
                    >
                      {req.requestType === 'family_session' ? (
                        <Users className="w-5 h-5" />
                      ) : req.requestType === 'call' ? (
                        <PhoneCall className="w-5 h-5" />
                      ) : (
                        <MessageSquare className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {req.requesterType.toUpperCase()}
                        </span>
                        <h3 className="text-sm font-black text-slate-900">
                          {req.requesterName}
                        </h3>
                        {req.priority === 'High' && (
                          <span className="text-[9px] font-black uppercase bg-rose-100 text-rose-800 px-2 py-0.2 rounded-full">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {req.studentName} {req.parentName ? `(Parent: ${req.parentName})` : ''} • {req.district}, {req.state} • {req.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                      {req.concernCategory}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-800 font-medium leading-relaxed">
                  "{req.messageText}"
                </div>

                {/* Meta details & Trade Reference */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    {req.careerReferenceTradeTitle && (
                      <span className="font-bold text-slate-700">
                        🎯 {req.careerReferenceTradeTitle}
                      </span>
                    )}
                    {req.preferredTimeSlot && (
                      <span className="flex items-center gap-1 text-slate-600 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {req.preferredDate} • {req.preferredTimeSlot}
                      </span>
                    )}
                    {req.consentShareAISummary && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {language === 'hi' ? 'एआई सारांश साझा' : 'AI Summary Authorized'}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'विवरण देखें' : 'View Data'}</span>
                    </button>

                    {isAccepted ? (
                      <button
                        onClick={() => req.caseId && onOpenCase(req.caseId)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1"
                      >
                        <span>{language === 'hi' ? 'केस खोलें' : 'Open Case'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onAcceptRequest(req.id)}
                          className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-2xs"
                        >
                          {language === 'hi' ? 'स्वीकार करें' : 'Accept Request'}
                        </button>
                        <button
                          onClick={() => onDeclineRequest(req.id)}
                          className="text-slate-500 hover:text-rose-600 text-xs font-bold px-2 py-2 transition"
                        >
                          {language === 'hi' ? 'अस्वीकार' : 'Decline'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAIL MODAL (Showing Authorized User Information Only) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full inline-block">
                  {language === 'hi' ? 'अधिकृत साझा जानकारी' : 'USER-AUTHORIZED DISCLOSURE'}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedRequest.studentName} {selectedRequest.parentName ? `& ${selectedRequest.parentName}` : ''}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Privacy Protection Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-950 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">
                  {language === 'hi' ? 'गोपनीयता सुरक्षा लागू (Privacy Protected)' : 'Authorized Data Only'}
                </strong>
                <p className="text-[11px] text-emerald-900/80">
                  {language === 'hi'
                    ? 'यहाँ केवल वही जानकारी प्रदर्शित है जिसे छात्र या अभिभावक ने परामर्श हेतु साझा करने की अनुमति दी है।'
                    : 'Only user-authorized fields are disclosed. Private AI chats remain confidential.'}
                </p>
              </div>
            </div>

            {/* Shared Fields Breakdown */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    {language === 'hi' ? 'छात्र द्वारा साझा (Shared by Student)' : 'Shared by Student'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">✓ Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Student Name:</span>
                    <strong className="text-slate-900">{selectedRequest.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">District & State:</span>
                    <strong className="text-slate-900">{selectedRequest.district}, {selectedRequest.state}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">Target Vocational Trade:</span>
                    <strong className="text-slate-900">{selectedRequest.careerReferenceTradeTitle || 'General Technical Skilling'}</strong>
                  </div>
                </div>
              </div>

              {selectedRequest.parentName && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      {language === 'hi' ? 'अभिभावक द्वारा साझा (Shared by Parent)' : 'Shared by Parent'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">✓ Verified</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Parent Name:</span>
                      <strong className="text-slate-900">{selectedRequest.parentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Primary Doubt:</span>
                      <strong className="text-slate-900">{selectedRequest.concernCategory}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Conversation Summary if Authorized */}
              {selectedRequest.consentShareAISummary && selectedRequest.aiConversationSummary && (
                <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-200 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-sky-800 block">
                    {language === 'hi' ? 'स्वीकृत एआई वार्ता सारांश (Consented AI Summary)' : 'Consented AI Chat Summary'}
                  </span>
                  <p className="text-xs text-sky-950 font-medium leading-relaxed">
                    {selectedRequest.aiConversationSummary}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>

              <button
                onClick={() => {
                  onAcceptRequest(selectedRequest.id);
                  setSelectedRequest(null);
                }}
                className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition"
              >
                {language === 'hi' ? 'अनुरोध स्वीकार करें' : 'Accept Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
