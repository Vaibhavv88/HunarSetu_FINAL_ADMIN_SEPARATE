import fs from 'fs';
import path from 'path';

export interface DbCounsellorProfile {
  id: string; // e.g. "COUNS-101"
  name: string;
  email: string;
  phone: string;
  qualification: string;
  certification: string;
  badgeId: string;
  experienceYears: number;
  specialization: string[];
  languages: string[];
  state: string;
  district: string;
  bio: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Verification Required';
  verificationDate: string;
  isActive: boolean;
  availability: {
    days: string[];
    hours: string;
    slotDurationMinutes: number;
  };
}

export type RequesterRole = 'STUDENT' | 'PARENT' | 'FAMILY';
export type RequestType = 'MESSAGE' | 'CALL' | 'FAMILY_SESSION';
export type RequestStatus = 'NEW' | 'ACCEPTED' | 'SCHEDULED' | 'REJECTED' | 'RESOLVED';

export interface DbCounsellingRequest {
  id: string; // e.g. "REQ-1001"
  caseId: string; // e.g. "CASE-1042"
  requesterUserId: string; // student or parent ID/phone
  requesterType: RequesterRole;
  requesterName: string;
  studentName: string;
  parentName?: string;
  phone: string;
  district: string;
  state: string;
  preferredLanguage: string;
  counsellorId: string; // e.g. "COUNS-101"
  counsellorName: string;
  requestType: RequestType;
  concernCategory: string;
  subject?: string;
  message: string;
  careerReferenceTradeId?: string;
  careerReferenceTradeTitle?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  status: RequestStatus;
  priority: 'High' | 'Medium' | 'Low';
  consentShareAISummary: boolean;
  aiConversationSummary?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbCounsellingMessage {
  id: string; // e.g. "MSG-2001"
  caseId: string; // e.g. "CASE-1042"
  conversationId: string;
  senderUserId: string;
  senderRole: 'STUDENT' | 'PARENT' | 'COUNSELLOR';
  senderName: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
}

export interface DbCounsellingCase {
  id: string; // e.g. "CASE-1042"
  counsellorId: string;
  counsellorName: string;
  studentName: string;
  studentEducation?: string;
  parentName?: string;
  guardianRelation?: string;
  district: string;
  state: string;
  stage: 'New' | 'Initial Discussion' | 'Career Exploration' | 'Family Discussion' | 'Career Planning' | 'Follow-up' | 'Resolved' | 'Escalated';
  primaryConcern: string;
  activeTradeTitle: string;
  studentGoalSummary: string;
  parentConcernSummary?: string;
  recommendedNextStep: string;
  isFamilyConnected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbCounsellorNote {
  id: string;
  caseId: string;
  counsellorId: string;
  noteText: string;
  visibility: 'private' | 'shared_with_family';
  createdAt: string;
}

export interface DbCounsellingFollowUp {
  id: string;
  caseId: string;
  counsellorId: string;
  studentName: string;
  parentName?: string;
  dueDate: string;
  reason: string;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
  createdAt: string;
}

export type CallStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'READY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'MISSED';

export interface DbCounsellingCall {
  id: string;
  caseId: string;
  counsellorId: string;
  counsellorName?: string;
  studentName: string;
  parentName?: string;
  phone?: string;
  sessionType: 'STUDENT_1ON1' | 'PARENT_1ON1' | 'JOINT_FAMILY';
  tradeTitle: string;
  scheduledDate?: string;
  scheduledSlot?: string;
  scheduledTime: string;
  durationMinutes: number;
  status: CallStatus;
  callReason?: string;
  callRoomId?: string;
  meetingJoinUrl?: string;
  startedAt?: string;
  endedAt?: string;
  actualDurationSeconds?: number;
  counsellorNotesSummary?: string;
  sharedWithFamily?: boolean;
  rescheduleReason?: string;
  cancelReason?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DbCounsellingNotification {
  id: string;
  recipientUserId: string;
  recipientRole: 'STUDENT' | 'PARENT' | 'COUNSELLOR';
  caseId?: string;
  callId?: string;
  type: 'MESSAGE' | 'REQUEST_ACCEPTED' | 'REQUEST_REJECTED' | 'CALL_ACCEPTED' | 'CALL_SCHEDULED' | 'CALL_REMINDER' | 'CALL_STARTING' | 'CALL_RESCHEDULED' | 'CALL_CANCELLED' | 'FOLLOW_UP';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface CounsellingDatabaseSchema {
  counsellor_profiles: DbCounsellorProfile[];
  counselling_requests: DbCounsellingRequest[];
  counselling_cases: DbCounsellingCase[];
  counselling_messages: DbCounsellingMessage[];
  counsellor_notes: DbCounsellorNote[];
  counselling_followups: DbCounsellingFollowUp[];
  counselling_calls: DbCounsellingCall[];
  counselling_notifications: DbCounsellingNotification[];
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'counselling_db.json');

// Initial seed data
const INITIAL_SEED_DATA: CounsellingDatabaseSchema = {
  counsellor_profiles: [
    {
      id: 'COUNS-101',
      name: 'Dr. Priya Sharma',
      email: 'counsellor@hunarsetu.gov.in',
      phone: '+91 94150 12345',
      qualification: 'Ph.D. in Vocational Pedagogy, M.A. Psychology',
      certification: 'NCVET / NSDC Master Career Guide Certification',
      badgeId: 'NSDC-CERT-4891',
      experienceYears: 7,
      specialization: [
        'Vocational Education (NSQF 4-7)',
        'Career Planning & Mobility',
        'Parent-Student Conflict Mediation',
        'Lateral B.Tech & Polytechnic Pathways'
      ],
      languages: ['Hindi', 'English'],
      state: 'Uttar Pradesh',
      district: 'Kanpur Nagar',
      bio: 'Certified Career Counsellor with 7+ years guiding students and families across Uttar Pradesh into high-demand technical vocations, apprenticeships, and NEP degree pathways.',
      verificationStatus: 'Verified',
      verificationDate: '15 Jan 2026',
      isActive: true,
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hours: '10:00 AM – 06:00 PM',
        slotDurationMinutes: 30
      }
    },
    {
      id: 'COUNS-102',
      name: 'Er. Rajesh Kumar Maurya',
      email: 'rajesh.maurya@hunarsetu.gov.in',
      phone: '+91 98390 67890',
      qualification: 'B.Tech Mechanical, DGT Certified Trainer',
      certification: 'DGT Master Skilling Guide',
      badgeId: 'DGT-MED-7712',
      experienceYears: 6,
      specialization: ['Drone Assembly & Remote Piloting', 'Automotive CNC', 'Railway Technical Cadre'],
      languages: ['Hindi', 'English'],
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      bio: 'Technical engineering mentor guiding youth from Purvanchal into precision machining and emerging drone careers.',
      verificationStatus: 'Verified',
      verificationDate: '02 Mar 2026',
      isActive: true,
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '11:00 AM – 05:00 PM',
        slotDurationMinutes: 30
      }
    }
  ],
  counselling_requests: [],
  counselling_cases: [],
  counselling_messages: [],
  counsellor_notes: [],
  counselling_followups: [],
  counselling_calls: [],
  counselling_notifications: []
};

// Database Manager
class CounsellingDatabase {
  private data: CounsellingDatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): CounsellingDatabaseSchema {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        parsed.counselling_notifications = parsed.counselling_notifications || [];
        parsed.counselling_calls = parsed.counselling_calls || [];
        return parsed;
      }
    } catch (err) {
      console.warn('[CounsellingDb] Failed to read db file, creating initial seed:', err);
    }

    // Write initial seed
    this.saveToDisk(INITIAL_SEED_DATA);
    return JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
  }

  private saveToDisk(dataToSave: CounsellingDatabaseSchema) {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[CounsellingDb] Failed to save database to disk:', err);
    }
  }

  public commit() {
    this.saveToDisk(this.data);
  }

  // --- COUNSELLORS ---
  public getCounsellors(): DbCounsellorProfile[] {
    return this.data.counsellor_profiles.filter(c => c.isActive && c.verificationStatus === 'Verified');
  }

  public getAllCounsellors(): DbCounsellorProfile[] {
    return this.data.counsellor_profiles || [];
  }

  public getCounsellorById(id: string): DbCounsellorProfile | undefined {
    return this.data.counsellor_profiles.find(c => c.id === id);
  }

  public updateCounsellorProfile(id: string, updates: Partial<DbCounsellorProfile>): DbCounsellorProfile | null {
    const idx = this.data.counsellor_profiles.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.counsellor_profiles[idx] = { ...this.data.counsellor_profiles[idx], ...updates };
    this.commit();
    return this.data.counsellor_profiles[idx];
  }

  public verifyCounsellor(id: string, status: 'Verified' | 'Pending Verification' | 'Verification Required', reason?: string): DbCounsellorProfile | null {
    const counsellor = this.getCounsellorById(id);
    if (!counsellor) return null;
    counsellor.verificationStatus = status;
    counsellor.isActive = status === 'Verified';
    if (status === 'Verified') {
      counsellor.verificationDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    this.commit();
    return counsellor;
  }

  public assignCounsellor(requestId: string, counsellorId: string, counsellorName: string): { request: DbCounsellingRequest | null; caseItem: DbCounsellingCase | null } {
    const req = this.data.counselling_requests.find(r => r.id === requestId);
    if (req) {
      req.counsellorId = counsellorId;
      req.counsellorName = counsellorName;
      req.updatedAt = new Date().toISOString();
    }
    let caseItem: DbCounsellingCase | null = null;
    if (req && req.caseId) {
      const c = this.data.counselling_cases.find(item => item.id === req.caseId);
      if (c) {
        c.counsellorId = counsellorId;
        c.counsellorName = counsellorName;
        c.updatedAt = new Date().toISOString();
        caseItem = c;
      }
    }
    this.commit();
    return { request: req || null, caseItem };
  }

  // --- REQUESTS ---
  public getRequests(filters?: {
    counsellorId?: string;
    requesterType?: RequesterRole;
    requestType?: RequestType;
    status?: RequestStatus;
  }): (DbCounsellingRequest & { messageText: string })[] {
    return this.data.counselling_requests.filter(r => {
      if (filters?.counsellorId && r.counsellorId !== filters.counsellorId) return false;
      if (filters?.requesterType && r.requesterType.toUpperCase() !== String(filters.requesterType).toUpperCase()) return false;
      if (filters?.requestType && r.requestType.toUpperCase() !== String(filters.requestType).toUpperCase()) return false;
      if (filters?.status && r.status.toUpperCase() !== String(filters.status).toUpperCase()) return false;
      return true;
    }).map(r => ({
      ...r,
      messageText: r.message || (r as any).messageText || ''
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getRequestsByUser(userIdOrName: string): (DbCounsellingRequest & { messageText: string })[] {
    const search = (userIdOrName || '').toLowerCase().trim();
    if (!search || search === 'all' || search === '*') {
      return this.getRequests();
    }
    return this.data.counselling_requests.filter(r =>
      r.requesterUserId.toLowerCase().includes(search) ||
      r.studentName.toLowerCase().includes(search) ||
      (r.parentName && r.parentName.toLowerCase().includes(search)) ||
      r.phone.includes(search)
    ).map(r => ({
      ...r,
      messageText: r.message || (r as any).messageText || ''
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createRequest(params: any): {
    request: DbCounsellingRequest;
    caseItem: any;
  } {
    const reqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const caseId = params.caseId || `CASE-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const normalizedReqType = (params.requestType || 'MESSAGE').toUpperCase() as RequestType;
    const normalizedRequesterType = (params.requesterType || 'STUDENT').toUpperCase() as RequesterRole;
    const messageContent = params.message || params.messageText || params.coreDispute || 'Counselling guidance requested';

    const newRequest: DbCounsellingRequest = {
      ...params,
      id: reqId,
      caseId,
      requestType: normalizedReqType,
      requesterType: normalizedRequesterType,
      message: messageContent,
      status: 'NEW',
      createdAt: now,
      updatedAt: now
    };

    // Find or create associated case
    let caseItem = this.data.counselling_cases.find(c => c.id === caseId);
    if (!caseItem) {
      caseItem = {
        id: caseId,
        counsellorId: params.counsellorId || 'COUNS-101',
        counsellorName: params.counsellorName || 'Dr. Priya Sharma',
        studentName: params.studentName,
        studentEducation: params.studentEducation || 'Class 12th',
        parentName: params.parentName,
        guardianRelation: params.parentName ? (params.guardianRelation || 'Parent') : undefined,
        district: params.district || 'Kanpur Nagar',
        state: params.state || 'Uttar Pradesh',
        stage: 'Initial Discussion',
        primaryConcern: params.concernCategory || 'Career Choice',
        activeTradeTitle: params.careerReferenceTradeTitle || 'Vocational Trade',
        studentGoalSummary: messageContent,
        parentConcernSummary: normalizedRequesterType === 'PARENT' ? messageContent : undefined,
        recommendedNextStep: 'Review trade details and options with certified counsellor.',
        isFamilyConnected: normalizedRequesterType === 'FAMILY' || !!params.parentName,
        createdAt: now,
        updatedAt: now
      };
      this.data.counselling_cases.unshift(caseItem);
    }

    // If it's a message request, also insert into messages table!
    if (normalizedReqType === 'MESSAGE' || normalizedReqType === 'FAMILY_SESSION') {
      const newMsg: DbCounsellingMessage = {
        id: `MSG-${Date.now()}`,
        caseId,
        conversationId: caseId,
        senderUserId: params.requesterUserId || params.phone || 'USER',
        senderRole: normalizedRequesterType === 'PARENT' ? 'PARENT' : 'STUDENT',
        senderName: params.requesterName || params.studentName,
        message: messageContent,
        status: 'DELIVERED',
        createdAt: now
      };
      this.data.counselling_messages.push(newMsg);
    }

    // If it's a call request, schedule a call record
    if (normalizedReqType === 'CALL' || normalizedReqType === 'FAMILY_SESSION') {
      const newCall: DbCounsellingCall = {
        id: `CALL-${Date.now()}`,
        caseId,
        counsellorId: params.counsellorId || 'COUNS-101',
        studentName: params.studentName,
        parentName: params.parentName,
        sessionType: normalizedReqType === 'FAMILY_SESSION' ? 'JOINT_FAMILY' : normalizedRequesterType === 'PARENT' ? 'PARENT_1ON1' : 'STUDENT_1ON1',
        tradeTitle: params.careerReferenceTradeTitle || 'Vocational Trade',
        scheduledTime: `${params.preferredDate || 'Tomorrow'} • ${params.preferredTimeSlot || '11:30 AM'}`,
        durationMinutes: 30,
        status: 'SCHEDULED',
        createdAt: now
      };
      this.data.counselling_calls.push(newCall);
    }

    this.data.counselling_requests.unshift(newRequest);
    this.commit();

    return { request: newRequest, caseItem: this.getCaseById(caseId) || caseItem };
  }

  public updateRequestStatus(id: string, status: RequestStatus, rejectionReason?: string): DbCounsellingRequest | null {
    const req = this.data.counselling_requests.find(r => r.id === id);
    if (!req) return null;

    req.status = status;
    req.updatedAt = new Date().toISOString();
    if (rejectionReason) req.rejectionReason = rejectionReason;

    // Also update associated call if scheduled/rejected
    const call = this.data.counselling_calls.find(c => c.caseId === req.caseId);
    if (call) {
      if (status === 'ACCEPTED' || status === 'SCHEDULED') call.status = 'SCHEDULED';
      if (status === 'REJECTED') call.status = 'CANCELLED';
      if (status === 'RESOLVED') call.status = 'COMPLETED';
    }

    // Send notifications to Student and Parent on status change
    const counsellorName = req.counsellorName || 'Dr. Priya Sharma';
    if (status === 'ACCEPTED') {
      if (req.studentName) {
        this.insertNotification({
          recipientUserId: req.studentName,
          recipientRole: 'STUDENT',
          caseId: req.caseId,
          type: 'REQUEST_ACCEPTED',
          title: `Counselling request accepted by ${counsellorName}`,
          message: `Your counselling case is now active. Open conversation to start discussing your career pathway.`
        });
      }
      if (req.parentName) {
        this.insertNotification({
          recipientUserId: req.parentName,
          recipientRole: 'PARENT',
          caseId: req.caseId,
          type: 'REQUEST_ACCEPTED',
          title: `Counselling request accepted by ${counsellorName}`,
          message: `Your counselling case is now active. Open conversation to discuss career security and options.`
        });
      }
    } else if (status === 'REJECTED') {
      const reasonMsg = rejectionReason || 'Counsellor is currently unavailable. You may choose another certified counsellor.';
      if (req.studentName) {
        this.insertNotification({
          recipientUserId: req.studentName,
          recipientRole: 'STUDENT',
          caseId: req.caseId,
          type: 'REQUEST_REJECTED',
          title: `Counselling request update from ${counsellorName}`,
          message: reasonMsg
        });
      }
      if (req.parentName) {
        this.insertNotification({
          recipientUserId: req.parentName,
          recipientRole: 'PARENT',
          caseId: req.caseId,
          type: 'REQUEST_REJECTED',
          title: `Counselling request update from ${counsellorName}`,
          message: reasonMsg
        });
      }
    }

    this.commit();
    return req;
  }

  // --- CASES ---
  public getCases(counsellorId?: string): any[] {
    const rawCases = counsellorId
      ? this.data.counselling_cases.filter(c => c.counsellorId === counsellorId)
      : this.data.counselling_cases;

    return rawCases.map(c => this.enrichCase(c));
  }

  public getCaseById(id: string): any | undefined {
    const c = this.data.counselling_cases.find(item => item.id === id);
    if (!c) return undefined;
    return this.enrichCase(c);
  }

  private enrichCase(c: DbCounsellingCase): any {
    const notes = this.getNotes(c.id);
    const followUps = this.data.counselling_followups.filter(f => f.caseId === c.id);
    const calls = this.data.counselling_calls.filter(call => call.caseId === c.id);

    return {
      ...c,
      title: `${c.studentName} • ${c.primaryConcern || 'Career Guidance'}`,
      notes: notes.map(n => ({
        id: n.id,
        caseId: n.caseId,
        counsellorId: n.counsellorId,
        createdAt: n.createdAt,
        noteText: n.noteText,
        visibility: n.visibility
      })),
      recommendations: [],
      followUps: followUps.map(f => ({
        id: f.id,
        caseId: f.caseId,
        studentName: f.studentName,
        parentName: f.parentName,
        dueDate: f.dueDate,
        reason: f.reason,
        message: `Follow up on ${c.activeTradeTitle}`,
        status: f.status.toLowerCase(),
        createdAt: f.createdAt
      })),
      sessions: calls.map(s => ({
        id: s.id,
        caseId: s.caseId,
        sessionType: s.sessionType.toLowerCase(),
        studentName: s.studentName,
        parentName: s.parentName,
        tradeTitle: s.tradeTitle,
        scheduledTime: s.scheduledTime,
        durationMinutes: s.durationMinutes,
        status: s.status.toLowerCase()
      }))
    };
  }

  public updateCase(id: string, updates: Partial<DbCounsellingCase>): any | null {
    const c = this.data.counselling_cases.find(item => item.id === id);
    if (!c) return null;
    Object.assign(c, updates);
    c.updatedAt = new Date().toISOString();
    this.commit();
    return this.enrichCase(c);
  }

  // --- MESSAGES ---
  public getMessagesByCase(caseId: string): any[] {
    return this.data.counselling_messages
      .filter(m => m.caseId === caseId)
      .map(m => ({
        id: m.id,
        caseId: m.caseId,
        senderId: m.senderUserId,
        senderUserId: m.senderUserId,
        senderName: m.senderName,
        senderRole: m.senderRole.toLowerCase(),
        text: m.message,
        message: m.message,
        status: m.status.toLowerCase(),
        timestamp: m.createdAt,
        createdAt: m.createdAt
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public getConversationsByUser(userIdOrName: string): {
    caseItem: any;
    messages: any[];
    requests: any[];
    calls: any[];
  }[] {
    const userReqs = this.getRequestsByUser(userIdOrName);
    let caseIds = Array.from(new Set(userReqs.map(r => r.caseId)));

    // Fallback: match by studentName or parentName
    if (caseIds.length === 0 && userIdOrName) {
      const query = userIdOrName.toLowerCase().trim();
      const matched = this.data.counselling_cases.filter(c =>
        c.studentName.toLowerCase().includes(query) ||
        (c.parentName && c.parentName.toLowerCase().includes(query))
      );
      caseIds = matched.map(c => c.id);
    }

    // Default seed fallback if still none
    if (caseIds.length === 0 && this.data.counselling_cases.length > 0) {
      caseIds = [this.data.counselling_cases[0].id];
    }

    return caseIds.map(cid => {
      const caseItem = this.getCaseById(cid) || {
        id: cid,
        counsellorId: 'COUNS-101',
        counsellorName: 'Dr. Priya Sharma',
        studentName: userIdOrName || 'Learner',
        district: 'Kanpur Nagar',
        state: 'Uttar Pradesh',
        stage: 'Initial Discussion',
        primaryConcern: 'Career Choice',
        activeTradeTitle: 'Vocational Trade',
        studentGoalSummary: 'Career guidance',
        recommendedNextStep: 'Awaiting counsellor response',
        isFamilyConnected: false,
        notes: [],
        recommendations: [],
        followUps: [],
        sessions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const msgs = this.getMessagesByCase(cid);
      const reqs = this.data.counselling_requests.filter(r => r.caseId === cid).map(r => ({
        ...r,
        messageText: r.message
      }));
      const calls = this.data.counselling_calls.filter(c => c.caseId === cid);

      return { caseItem, messages: msgs, requests: reqs, calls };
    });
  }

  public insertMessage(params: Omit<DbCounsellingMessage, 'id' | 'createdAt' | 'status'>): DbCounsellingMessage {
    const newMsg: DbCounsellingMessage = {
      ...params,
      id: `MSG-${Date.now()}`,
      status: 'DELIVERED',
      createdAt: new Date().toISOString()
    };

    this.data.counselling_messages.push(newMsg);

    // Update case timestamp
    const c = this.data.counselling_cases.find(item => item.id === params.caseId);
    if (c) c.updatedAt = new Date().toISOString();

    // Create automatic notification for other party
    if (params.senderRole === 'COUNSELLOR') {
      const studentRecipient = c?.studentName || 'Student';
      this.insertNotification({
        recipientUserId: studentRecipient,
        recipientRole: 'STUDENT',
        caseId: params.caseId,
        type: 'MESSAGE',
        title: `${params.senderName} (Certified Counsellor) replied`,
        message: params.message.length > 80 ? `${params.message.slice(0, 80)}...` : params.message
      });

      if (c?.parentName) {
        this.insertNotification({
          recipientUserId: c.parentName,
          recipientRole: 'PARENT',
          caseId: params.caseId,
          type: 'MESSAGE',
          title: `${params.senderName} (Certified Counsellor) replied`,
          message: params.message.length > 80 ? `${params.message.slice(0, 80)}...` : params.message
        });
      }
    } else {
      this.insertNotification({
        recipientUserId: c?.counsellorId || 'COUNS-101',
        recipientRole: 'COUNSELLOR',
        caseId: params.caseId,
        type: 'MESSAGE',
        title: `New message from ${params.senderName}`,
        message: params.message.length > 80 ? `${params.message.slice(0, 80)}...` : params.message
      });
    }

    this.commit();
    return newMsg;
  }

  // --- CALLS ---
  public getCalls(counsellorId?: string, userIdOrName?: string): DbCounsellingCall[] {
    let calls = this.data.counselling_calls || [];
    if (counsellorId) {
      calls = calls.filter(c => c.counsellorId === counsellorId);
    }
    if (userIdOrName) {
      const query = userIdOrName.toLowerCase().trim();
      calls = calls.filter(c =>
        c.studentName.toLowerCase().includes(query) ||
        (c.parentName && c.parentName.toLowerCase().includes(query)) ||
        (c.phone && c.phone.includes(query))
      );
    }
    return calls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getCallById(id: string): DbCounsellingCall | undefined {
    return (this.data.counselling_calls || []).find(c => c.id === id);
  }

  public createCall(params: {
    caseId?: string;
    counsellorId: string;
    counsellorName?: string;
    studentName: string;
    parentName?: string;
    phone?: string;
    sessionType?: 'STUDENT_1ON1' | 'PARENT_1ON1' | 'JOINT_FAMILY';
    tradeTitle?: string;
    scheduledDate?: string;
    scheduledSlot?: string;
    scheduledTime?: string;
    callReason?: string;
  }): DbCounsellingCall {
    const callId = `CALL-${Math.floor(1000 + Math.random() * 9000)}`;
    const caseId = params.caseId || `CASE-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const formattedTime = params.scheduledTime ||
      (params.scheduledDate && params.scheduledSlot ? `${params.scheduledDate} • ${params.scheduledSlot}` : 'Tomorrow • 11:30 AM');

    const newCall: DbCounsellingCall = {
      id: callId,
      caseId,
      counsellorId: params.counsellorId || 'COUNS-101',
      counsellorName: params.counsellorName || 'Dr. Priya Sharma',
      studentName: params.studentName,
      parentName: params.parentName,
      phone: params.phone,
      sessionType: params.sessionType || (params.parentName ? 'JOINT_FAMILY' : 'STUDENT_1ON1'),
      tradeTitle: params.tradeTitle || 'Vocational Trade',
      scheduledDate: params.scheduledDate,
      scheduledSlot: params.scheduledSlot,
      scheduledTime: formattedTime,
      durationMinutes: 30,
      status: 'REQUESTED',
      callReason: params.callReason || 'Career and education planning consultation',
      callRoomId: `ROOM-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: now,
      updatedAt: now
    };

    if (!this.data.counselling_calls) this.data.counselling_calls = [];
    this.data.counselling_calls.unshift(newCall);

    // Notify counsellor
    this.insertNotification({
      recipientUserId: newCall.counsellorId,
      recipientRole: 'COUNSELLOR',
      caseId,
      callId,
      type: 'CALL_SCHEDULED',
      title: `New Call Request from ${params.studentName}`,
      message: `Requested ${formattedTime} for ${newCall.tradeTitle}.`
    });

    this.commit();
    return newCall;
  }

  public acceptCall(id: string, scheduledDate?: string, scheduledSlot?: string): DbCounsellingCall | null {
    const call = this.getCallById(id);
    if (!call) return null;

    call.status = 'SCHEDULED';
    if (scheduledDate && scheduledSlot) {
      call.scheduledDate = scheduledDate;
      call.scheduledSlot = scheduledSlot;
      call.scheduledTime = `${scheduledDate} • ${scheduledSlot}`;
    }
    call.updatedAt = new Date().toISOString();

    // Notify student & parent
    this.insertNotification({
      recipientUserId: call.studentName,
      recipientRole: 'STUDENT',
      caseId: call.caseId,
      callId: call.id,
      type: 'CALL_ACCEPTED',
      title: `✓ Call Scheduled with ${call.counsellorName || 'Dr. Priya Sharma'}`,
      message: `Your counselling call is confirmed for ${call.scheduledTime}.`
    });

    if (call.parentName) {
      this.insertNotification({
        recipientUserId: call.parentName,
        recipientRole: 'PARENT',
        caseId: call.caseId,
        callId: call.id,
        type: 'CALL_ACCEPTED',
        title: `✓ Call Scheduled with ${call.counsellorName || 'Dr. Priya Sharma'}`,
        message: `Your family counselling session is confirmed for ${call.scheduledTime}.`
      });
    }

    this.commit();
    return call;
  }

  public rescheduleCall(id: string, newDate: string, newSlot: string, reason?: string, requestedBy?: string): DbCounsellingCall | null {
    const call = this.getCallById(id);
    if (!call) return null;

    const oldTime = call.scheduledTime;
    call.scheduledDate = newDate;
    call.scheduledSlot = newSlot;
    call.scheduledTime = `${newDate} • ${newSlot}`;
    call.status = 'RESCHEDULED';
    call.rescheduleReason = reason;
    call.updatedAt = new Date().toISOString();

    // Notify parties
    const isCounsellor = requestedBy === 'COUNSELLOR';
    if (isCounsellor) {
      this.insertNotification({
        recipientUserId: call.studentName,
        recipientRole: 'STUDENT',
        caseId: call.caseId,
        callId: call.id,
        type: 'CALL_RESCHEDULED',
        title: `Call Rescheduled: ${newDate} at ${newSlot}`,
        message: `Dr. Priya Sharma has rescheduled your session from ${oldTime} to ${call.scheduledTime}.`
      });
      if (call.parentName) {
        this.insertNotification({
          recipientUserId: call.parentName,
          recipientRole: 'PARENT',
          caseId: call.caseId,
          callId: call.id,
          type: 'CALL_RESCHEDULED',
          title: `Call Rescheduled: ${newDate} at ${newSlot}`,
          message: `Dr. Priya Sharma has rescheduled your family session from ${oldTime} to ${call.scheduledTime}.`
        });
      }
    } else {
      this.insertNotification({
        recipientUserId: call.counsellorId,
        recipientRole: 'COUNSELLOR',
        caseId: call.caseId,
        callId: call.id,
        type: 'CALL_RESCHEDULED',
        title: `${call.studentName} requested to reschedule call`,
        message: `Proposed new time: ${call.scheduledTime}. Reason: ${reason || 'Schedule change'}`
      });
    }

    this.commit();
    return call;
  }

  public cancelCall(id: string, reason?: string, cancelledBy?: string): DbCounsellingCall | null {
    const call = this.getCallById(id);
    if (!call) return null;

    call.status = 'CANCELLED';
    call.cancelReason = reason || 'Cancelled by user';
    call.updatedAt = new Date().toISOString();

    if (cancelledBy !== 'COUNSELLOR') {
      this.insertNotification({
        recipientUserId: call.counsellorId,
        recipientRole: 'COUNSELLOR',
        caseId: call.caseId,
        callId: call.id,
        type: 'CALL_CANCELLED',
        title: `Call with ${call.studentName} cancelled`,
        message: `Reason: ${reason || 'User cancelled session'}`
      });
    } else {
      this.insertNotification({
        recipientUserId: call.studentName,
        recipientRole: 'STUDENT',
        caseId: call.caseId,
        callId: call.id,
        type: 'CALL_CANCELLED',
        title: `Counselling session cancelled`,
        message: `Reason: ${reason || 'Counsellor unavailable'}`
      });
    }

    this.commit();
    return call;
  }

  public startCall(id: string): DbCounsellingCall | null {
    const call = this.getCallById(id);
    if (!call) return null;

    call.status = 'IN_PROGRESS';
    call.startedAt = new Date().toISOString();
    call.updatedAt = new Date().toISOString();

    // Trigger starting notification
    this.insertNotification({
      recipientUserId: call.studentName,
      recipientRole: 'STUDENT',
      caseId: call.caseId,
      callId: call.id,
      type: 'CALL_STARTING',
      title: `📞 Counselling Session Starting Now`,
      message: `Your session with ${call.counsellorName || 'Dr. Priya Sharma'} is live. Click Join Call.`
    });

    this.commit();
    return call;
  }

  public endCall(id: string, durationSeconds?: number, notesSummary?: string, shareWithFamily: boolean = false): DbCounsellingCall | null {
    const call = this.getCallById(id);
    if (!call) return null;

    call.status = 'COMPLETED';
    call.endedAt = new Date().toISOString();
    if (durationSeconds) call.actualDurationSeconds = durationSeconds;
    if (notesSummary) {
      call.counsellorNotesSummary = notesSummary;
      call.sharedWithFamily = shareWithFamily;

      // Add to official notes table
      this.insertNote({
        caseId: call.caseId,
        counsellorId: call.counsellorId,
        noteText: notesSummary,
        visibility: shareWithFamily ? 'shared_with_family' : 'private'
      });
    }
    call.updatedAt = new Date().toISOString();

    // Notify student/parent that session completed
    this.insertNotification({
      recipientUserId: call.studentName,
      recipientRole: 'STUDENT',
      caseId: call.caseId,
      callId: call.id,
      type: 'FOLLOW_UP',
      title: `Counselling Session Completed`,
      message: `Session completed (${Math.round((durationSeconds || 1800) / 60)} mins). Check your follow-up and next steps.`
    });

    this.commit();
    return call;
  }

  public updateCallStatus(id: string, status: DbCounsellingCall['status']): DbCounsellingCall | null {
    const call = this.getCallById(id);
    if (!call) return null;
    call.status = status;
    call.updatedAt = new Date().toISOString();
    this.commit();
    return call;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(recipientUserId?: string, role?: string): DbCounsellingNotification[] {
    let notifs = this.data.counselling_notifications || [];
    if (recipientUserId && recipientUserId !== 'all') {
      const query = recipientUserId.toLowerCase().trim();
      notifs = notifs.filter(n =>
        n.recipientUserId.toLowerCase().includes(query) ||
        (role && n.recipientRole.toUpperCase() === role.toUpperCase())
      );
    }
    return notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public insertNotification(params: Omit<DbCounsellingNotification, 'id' | 'createdAt' | 'read'>): DbCounsellingNotification {
    const newNotif: DbCounsellingNotification = {
      ...params,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    if (!this.data.counselling_notifications) this.data.counselling_notifications = [];
    this.data.counselling_notifications.unshift(newNotif);
    this.commit();
    return newNotif;
  }

  public markNotificationRead(id: string): boolean {
    const notif = (this.data.counselling_notifications || []).find(n => n.id === id);
    if (!notif) return false;
    notif.read = true;
    this.commit();
    return true;
  }

  public markAllNotificationsRead(recipientUserId?: string): boolean {
    if (!this.data.counselling_notifications) return false;
    this.data.counselling_notifications.forEach(n => {
      if (!recipientUserId || n.recipientUserId.toLowerCase().includes(recipientUserId.toLowerCase().trim())) {
        n.read = true;
      }
    });
    this.commit();
    return true;
  }

  public markCaseMessagesAsRead(caseId: string, readerRole: string): number {
    let count = 0;
    const msgs = (this.data.counselling_messages || []).filter(m => m.caseId === caseId);
    msgs.forEach(m => {
      if (m.senderRole.toUpperCase() !== readerRole.toUpperCase()) {
        m.status = 'READ';
        count++;
      }
    });
    if (count > 0) this.commit();
    return count;
  }

  public getUnreadCount(userIdOrName: string, role: string): { messages: number; notifications: number } {
    const notifs = this.getNotifications(userIdOrName, role).filter(n => !n.read).length;
    // Count unread messages in user's cases
    const userCases = this.getConversationsByUser(userIdOrName);
    let unreadMsgs = 0;
    userCases.forEach(c => {
      c.messages.forEach((m: any) => {
        if (m.senderRole?.toUpperCase() !== role.toUpperCase() && m.status !== 'read') {
          unreadMsgs++;
        }
      });
    });
    return { messages: unreadMsgs, notifications: notifs };
  }

  // --- NOTES ---
  public getNotes(caseId: string): DbCounsellorNote[] {
    return this.data.counsellor_notes.filter(n => n.caseId === caseId);
  }

  public insertNote(params: Omit<DbCounsellorNote, 'id' | 'createdAt'>): DbCounsellorNote {
    const note: DbCounsellorNote = {
      ...params,
      id: `NOTE-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.counsellor_notes.unshift(note);
    this.commit();
    return note;
  }

  // --- FOLLOW UPS ---
  public getFollowUps(counsellorId?: string): DbCounsellingFollowUp[] {
    if (counsellorId) {
      return this.data.counselling_followups.filter(f => f.counsellorId === counsellorId);
    }
    return this.data.counselling_followups;
  }

  public insertFollowUp(params: Omit<DbCounsellingFollowUp, 'id' | 'createdAt' | 'status'>): DbCounsellingFollowUp {
    const followUp: DbCounsellingFollowUp = {
      ...params,
      id: `FOL-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    this.data.counselling_followups.unshift(followUp);
    this.commit();
    return followUp;
  }

  public updateFollowUpStatus(id: string, status: 'PENDING' | 'COMPLETED' | 'MISSED'): DbCounsellingFollowUp | null {
    const fol = this.data.counselling_followups.find(f => f.id === id);
    if (!fol) return null;
    fol.status = status;
    this.commit();
    return fol;
  }
}

export const counsellingDb = new CounsellingDatabase();
