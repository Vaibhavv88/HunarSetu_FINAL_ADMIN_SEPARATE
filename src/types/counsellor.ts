export type CounsellorVerificationStatus = 'Verified' | 'Pending Verification' | 'Verification Required';

export interface CounsellorAvailabilitySlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "10:00 AM"
  endTime: string;   // e.g. "06:00 PM"
  slotDurationMinutes: number; // 30
}

export interface CounsellorProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  qualification: string;
  certification: string;
  badgeId: string;
  experienceYears: number;
  specialization: string[];
  languages: string[];
  areasOfExpertise: string[];
  state: string;
  district: string;
  phone: string;
  email: string;
  bio: string;
  bioHi: string;
  verificationStatus: CounsellorVerificationStatus;
  verificationDate: string;
  isDemoCounsellor: boolean;
  onboardingCompleted: boolean;
  availability: CounsellorAvailabilitySlot[];
  maxDailySessions: number;
}

export type CounsellingRequestType = 'message' | 'call' | 'family_session';
export type CounsellingRequestStatus = 'new' | 'pending' | 'accepted' | 'scheduled' | 'in_progress' | 'completed' | 'declined' | 'rejected' | 'escalated';
export type ConcernCategory =
  | 'Career Choice'
  | 'Job Security'
  | 'Salary & Earnings'
  | 'Career Growth'
  | 'Higher Education (B.Tech/Degree)'
  | 'Training & ITIs'
  | 'Safety & Working Conditions'
  | 'Social Perception'
  | 'Child-Parent Disagreement'
  | 'Location & Relocation'
  | 'Other';

export interface CounsellingRequest {
  id: string;
  caseId?: string;
  requesterType: 'student' | 'parent' | 'family';
  requesterName: string;
  studentName: string;
  parentName?: string;
  phone: string;
  email?: string;
  district: string;
  state: string;
  preferredLanguage: 'Hindi' | 'English';
  requestType: CounsellingRequestType;
  concernCategory: ConcernCategory;
  messageText: string;
  careerReferenceTradeId?: string;
  careerReferenceTradeTitle?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  createdAt: string;
  status: CounsellingRequestStatus;
  priority: 'High' | 'Medium' | 'Low';
  consentShareAISummary: boolean;
  aiConversationSummary?: string;
  assignedCounsellorId?: string;
  rejectionReason?: string;
}

export interface CounsellingMessage {
  id: string;
  caseId: string;
  senderId: string;
  senderName: string;
  senderRole: 'counsellor' | 'student' | 'parent';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  sharedDataReference?: string;
}

export interface CounsellorNote {
  id: string;
  caseId: string;
  counsellorId: string;
  createdAt: string;
  noteText: string;
  visibility: 'private' | 'shared_with_family';
  followUpDate?: string;
  tags?: string[];
}

export interface CounsellorRecommendation {
  id: string;
  tradeId: string;
  tradeTitle: string;
  whyDiscussed: string;
  skillsToDevelop: string[];
  trainingPathway: string;
  thingsToVerify: string;
}

export interface CounsellingFollowUp {
  id: string;
  caseId: string;
  studentName: string;
  parentName?: string;
  dueDate: string;
  reason: string;
  message: string;
  status: 'pending' | 'completed' | 'missed';
  createdAt: string;
}

export type CallLifecycleStatus =
  | 'requested'
  | 'accepted'
  | 'scheduled'
  | 'ready'
  | 'in_progress'
  | 'live'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'rejected'
  | 'missed';

export interface CounsellingSessionRecord {
  id: string;
  caseId: string;
  counsellorId?: string;
  counsellorName?: string;
  sessionType: 'student_1on1' | 'parent_1on1' | 'joint_family';
  studentName: string;
  parentName?: string;
  tradeTitle: string;
  scheduledDate?: string;
  scheduledSlot?: string;
  scheduledTime: string;
  durationMinutes: number;
  status: CallLifecycleStatus;
  meetLink?: string;
  callRoomId?: string;
  callReason?: string;
  actualDurationSeconds?: number;
  counsellorNotesSummary?: string;
  sharedWithFamily?: boolean;
  rescheduleReason?: string;
  cancelReason?: string;
}

export interface CounsellingNotification {
  id: string;
  recipientUserId: string;
  recipientRole: 'student' | 'parent' | 'counsellor';
  caseId?: string;
  callId?: string;
  type: 'MESSAGE' | 'CALL_ACCEPTED' | 'CALL_SCHEDULED' | 'CALL_REMINDER' | 'CALL_STARTING' | 'CALL_RESCHEDULED' | 'CALL_CANCELLED' | 'FOLLOW_UP';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface CounsellingCase {
  id: string; // e.g. "CASE-1042"
  title: string;
  studentName: string;
  studentAge?: number;
  studentEducation?: string;
  parentName?: string;
  guardianRelation?: string;
  district: string;
  state: string;
  stage: 'New' | 'Initial Discussion' | 'Career Exploration' | 'Family Discussion' | 'Career Planning' | 'Follow-up' | 'Resolved' | 'Escalated';
  primaryConcern: ConcernCategory;
  activeTradeTitle: string;
  studentGoalSummary: string;
  parentConcernSummary?: string;
  recommendedNextStep: string;
  isFamilyConnected: boolean;
  notes: CounsellorNote[];
  recommendations: CounsellorRecommendation[];
  followUps: CounsellingFollowUp[];
  sessions: CounsellingSessionRecord[];
  createdAt: string;
  updatedAt: string;
  escalationReason?: string;
}
