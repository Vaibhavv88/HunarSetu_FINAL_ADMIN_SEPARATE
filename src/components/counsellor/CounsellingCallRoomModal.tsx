import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Users,
  MessageSquare,
  Sparkles,
  FileText,
  AlertCircle
} from 'lucide-react';
import { CounsellingSessionRecord } from '../../types/counsellor';
import { counsellingService } from '../../services/counsellingService';

interface CounsellingCallRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: CounsellingSessionRecord;
  currentUserRole: 'student' | 'parent' | 'counsellor';
  currentUserName: string;
  language: 'en' | 'hi';
  onCallCompleted?: (updatedCall: CounsellingSessionRecord) => void;
}

export const CounsellingCallRoomModal: React.FC<CounsellingCallRoomModalProps> = ({
  isOpen,
  onClose,
  call,
  currentUserRole,
  currentUserName,
  language,
  onCallCompleted
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isEnding, setIsEnding] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completedCallData, setCompletedCallData] = useState<CounsellingSessionRecord | null>(null);

  // Counsellor in-call notes
  const [sessionNotes, setSessionNotes] = useState<string>(
    'Learner explored vocational qualification progression. Explained NEP 2020 AICTE Lateral entry into 2nd year Polytechnic diploma and NAPS stipend.'
  );
  const [shareWithFamily, setShareWithFamily] = useState<boolean>(true);

  // Active call duration timer
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    // Start call on server
    counsellingService.startCall(call.id).catch(() => {});

    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted, call.id]);

  if (!isOpen) return null;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    setIsEnding(true);
    try {
      const updated = await counsellingService.endCall(
        call.id,
        secondsElapsed,
        sessionNotes,
        shareWithFamily
      );
      setCompletedCallData(updated);
      setIsCompleted(true);
      if (onCallCompleted) onCallCompleted(updated);
    } catch (err) {
      console.warn('Failed to end call on server:', err);
      setIsCompleted(true);
    } finally {
      setIsEnding(false);
    }
  };

  const isFamilySession = call.sessionType === 'joint_family';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Call Room Top Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600/30 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isCompleted ? 'CALL COMPLETED' : 'PROTOTYPE COUNSELLING CALL'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {call.callRoomId || `ROOM-${call.id}`}
                </span>
              </div>
              <h2 className="text-sm font-black text-white mt-0.5">
                {call.tradeTitle || 'Vocational Career Consultation'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer */}
            <div className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{formatTimer(secondsElapsed)}</span>
            </div>
          </div>
        </div>

        {/* Content Body: Active Call Screen vs Completed Screen */}
        {isCompleted ? (
          <div className="p-8 text-center space-y-6 max-w-lg mx-auto my-auto animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">
                {language === 'hi' ? 'काउंसलिंग सत्र पूरा हुआ!' : 'Counselling Session Completed'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {language === 'hi'
                  ? `डॉ. प्रिया शर्मा के साथ आपका सत्र सफलतापूर्वक संपन्न हुआ। अवधि: ${formatTimer(secondsElapsed)}`
                  : `Your session with Dr. Priya Sharma has concluded. Duration: ${formatTimer(secondsElapsed)}`}
              </p>
            </div>

            {/* Session Summary Card */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-left text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'hi' ? 'काउंसलर:' : 'Counsellor:'}</span>
                <span className="font-bold text-white">{call.counsellorName || 'Dr. Priya Sharma'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'hi' ? 'अवधि:' : 'Duration:'}</span>
                <span className="font-mono text-emerald-400 font-bold">{formatTimer(secondsElapsed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'hi' ? 'सत्र प्रकार:' : 'Session Type:'}</span>
                <span className="font-bold text-sky-300">
                  {call.sessionType === 'joint_family' ? '👨‍👩‍👦 Joint Family Call' : '👤 1-on-1 Guidance'}
                </span>
              </div>
              {sessionNotes && (
                <div className="pt-2 border-t border-slate-700 text-[11px] leading-relaxed">
                  <strong className="text-slate-200 block mb-0.5">
                    {language === 'hi' ? 'सत्र मुख्य बिंदु (Key Discussion):' : 'Key Discussion Points:'}
                  </strong>
                  <p className="text-slate-300">{sessionNotes}</p>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-3 rounded-2xl text-xs transition shadow-lg"
            >
              {language === 'hi' ? 'समाप्त करें एवं इतिहास देखें' : 'Done & View Counselling History'}
            </button>
          </div>
        ) : (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Video Simulation Grid */}
            <div className={`grid gap-4 ${isFamilySession ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {/* Tile 1: Certified Counsellor */}
              <div className="relative bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-700 aspect-video sm:aspect-auto sm:h-64 flex flex-col items-center justify-center p-4 text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-lg mb-2">
                  P
                </div>
                <h4 className="text-xs font-black text-white flex items-center gap-1">
                  <span>{call.counsellorName || 'Dr. Priya Sharma'}</span>
                  <span className="text-sky-400">✓</span>
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  Certified Career Counsellor • Speaking
                </p>

                {/* Animated Voice Wave Indicator */}
                <div className="flex items-center gap-1 mt-3">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                </div>

                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/10">
                  Host • Dr. Priya
                </span>
              </div>

              {/* Tile 2: Student Participant */}
              <div className="relative bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-700 aspect-video sm:aspect-auto sm:h-64 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl font-black shadow-lg mb-2">
                  {call.studentName.charAt(0)}
                </div>
                <h4 className="text-xs font-black text-white">
                  {call.studentName}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  Learner • Connected
                </p>

                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/10">
                  {currentUserRole === 'student' ? 'You (Learner)' : `${call.studentName} (Student)`}
                </span>

                <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Audio Active
                </span>
              </div>

              {/* Tile 3: Parent Participant (If Family Call) */}
              {isFamilySession && (
                <div className="relative bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-700 aspect-video sm:aspect-auto sm:h-64 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl font-black shadow-lg mb-2">
                    {call.parentName ? call.parentName.charAt(0) : 'P'}
                  </div>
                  <h4 className="text-xs font-black text-white">
                    {call.parentName || 'Parent / Guardian'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Family Guardian • Connected
                  </p>

                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/10">
                    {currentUserRole === 'parent' ? 'You (Parent)' : `${call.parentName || 'Parent'}`}
                  </span>

                  <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Audio Active
                  </span>
                </div>
              )}
            </div>

            {/* In-Call Discussion Topic & Counsellor Notes Drawer */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-bold flex items-center gap-1.5 text-sky-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'सत्र का उद्देश्य:' : 'Consultation Purpose:'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{call.callReason || 'Career Decision Support'}</span>
              </div>

              {currentUserRole === 'counsellor' ? (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-[11px] font-bold text-slate-400">
                    Counsellor In-Call Observations & Recommendations:
                  </label>
                  <textarea
                    rows={2}
                    value={sessionNotes}
                    onChange={e => setSessionNotes(e.target.value)}
                    placeholder="Enter observation, agreements and action steps for this family..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareWithFamily}
                      onChange={e => setShareWithFamily(e.target.checked)}
                      className="rounded accent-sky-500"
                    />
                    <span>Share these notes with learner & parent after call</span>
                  </label>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
                  {language === 'hi'
                    ? '💡 काउंसलर आपके सवालों के उत्तर दे रही हैं। कॉल समाप्त होने के बाद चर्चा के मुख्य बिंदु आपके My Counselling पेज में सुरक्षित रहेंगे।'
                    : '💡 Discussion points and next steps will be saved to your My Counselling page when the call ends.'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Call Room Bottom Controls Bar */}
        {!isCompleted && (
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                className={`p-3 rounded-2xl transition font-bold ${
                  isMicOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
                className={`p-3 rounded-2xl transition font-bold ${
                  isVideoOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
                className={`p-3 rounded-2xl transition font-bold ${
                  isSpeakerOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              disabled={isEnding}
              className="bg-rose-600 hover:bg-rose-500 text-white font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition shadow-lg shrink-0 disabled:opacity-50"
            >
              <PhoneOff className="w-4 h-4" />
              <span>{isEnding ? 'Ending...' : (language === 'hi' ? 'कॉल समाप्त करें' : 'End Call')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
