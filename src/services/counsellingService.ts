import {
  CounsellingRequest,
  CounsellingCase,
  CounsellingMessage,
  CounsellorProfile,
  CounsellorNote,
  CounsellingFollowUp,
  CounsellingSessionRecord
} from '../types/counsellor';

export interface CreateRequestPayload {
  requesterUserId?: string;
  requesterType: 'STUDENT' | 'PARENT' | 'FAMILY' | 'student' | 'parent' | 'family';
  requesterName: string;
  studentName: string;
  parentName?: string;
  phone: string;
  district?: string;
  state?: string;
  preferredLanguage?: string;
  counsellorId?: string;
  counsellorName?: string;
  requestType: 'MESSAGE' | 'CALL' | 'FAMILY_SESSION' | 'message' | 'call' | 'family_session';
  concernCategory: string;
  subject?: string;
  message?: string;
  messageText?: string;
  careerReferenceTradeId?: string;
  careerReferenceTradeTitle?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  priority?: 'High' | 'Medium' | 'Low';
  consentShareAISummary?: boolean;
  aiConversationSummary?: string;
  caseId?: string;
}

export function normalizeRequest(raw: any): CounsellingRequest {
  const reqTypeRaw = String(raw.requestType || 'message').toLowerCase();
  const reqType = (reqTypeRaw === 'call' ? 'call' : reqTypeRaw === 'family_session' ? 'family_session' : 'message') as any;

  const roleRaw = String(raw.requesterType || 'student').toLowerCase();
  const role = (roleRaw === 'parent' ? 'parent' : roleRaw === 'family' ? 'family' : 'student') as any;

  const statusRaw = String(raw.status || 'new').toLowerCase();
  let status: any = 'new';
  if (statusRaw === 'accepted') status = 'accepted';
  else if (statusRaw === 'pending') status = 'pending';
  else if (statusRaw === 'scheduled') status = 'scheduled';
  else if (statusRaw === 'rejected') status = 'rejected';
  else if (statusRaw === 'declined') status = 'declined';
  else if (statusRaw === 'completed') status = 'completed';
  else status = 'new';

  return {
    id: raw.id,
    caseId: raw.caseId,
    requesterType: role,
    requesterName: raw.requesterName || raw.studentName,
    studentName: raw.studentName,
    parentName: raw.parentName,
    phone: raw.phone,
    email: raw.email,
    district: raw.district || 'Kanpur Nagar',
    state: raw.state || 'Uttar Pradesh',
    preferredLanguage: raw.preferredLanguage === 'hi' || raw.preferredLanguage === 'Hindi' ? 'Hindi' : 'English',
    requestType: reqType,
    concernCategory: raw.concernCategory || 'Job Security',
    messageText: raw.messageText || raw.message || raw.coreDispute || '',
    careerReferenceTradeId: raw.careerReferenceTradeId,
    careerReferenceTradeTitle: raw.careerReferenceTradeTitle || raw.chosenTrade,
    preferredDate: raw.preferredDate,
    preferredTimeSlot: raw.preferredTimeSlot,
    createdAt: raw.createdAt ? (raw.createdAt.includes('T') ? new Date(raw.createdAt).toLocaleDateString() : raw.createdAt) : 'Just now',
    status,
    priority: raw.priority || 'High',
    consentShareAISummary: !!raw.consentShareAISummary,
    aiConversationSummary: raw.aiConversationSummary,
    assignedCounsellorId: raw.counsellorId || raw.assignedCounsellorId || 'COUNS-101',
    rejectionReason: raw.rejectionReason || raw.reason
  };
}

export function normalizeMessage(raw: any): CounsellingMessage {
  const roleRaw = String(raw.senderRole || 'counsellor').toLowerCase();
  const role = (roleRaw === 'student' ? 'student' : roleRaw === 'parent' ? 'parent' : 'counsellor') as any;

  let timeFormatted = 'Just now';
  if (raw.createdAt && raw.createdAt.includes('T')) {
    try {
      timeFormatted = new Date(raw.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {}
  } else if (raw.timestamp) {
    timeFormatted = raw.timestamp;
  }

  return {
    id: raw.id,
    caseId: raw.caseId,
    senderId: raw.senderUserId || raw.senderId || 'USER',
    senderName: raw.senderName || (role === 'counsellor' ? 'Dr. Priya Sharma' : 'User'),
    senderRole: role,
    text: raw.text || raw.message || '',
    timestamp: timeFormatted,
    status: String(raw.status || 'delivered').toLowerCase() as any
  };
}

export function normalizeCase(raw: any): CounsellingCase {
  return {
    id: raw.id,
    title: raw.title || `${raw.studentName} • ${raw.primaryConcern || 'Vocational Guidance'}`,
    studentName: raw.studentName,
    studentAge: raw.studentAge || 18,
    studentEducation: raw.studentEducation || 'Class 12th',
    parentName: raw.parentName,
    guardianRelation: raw.guardianRelation || (raw.parentName ? 'Parent' : undefined),
    district: raw.district || 'Local District',
    state: raw.state || 'Uttar Pradesh',
    stage: raw.stage || 'Initial Discussion',
    primaryConcern: raw.primaryConcern || 'Job Security',
    activeTradeTitle: raw.activeTradeTitle || 'Vocational Trade',
    studentGoalSummary: raw.studentGoalSummary || raw.message || '',
    parentConcernSummary: raw.parentConcernSummary,
    recommendedNextStep: raw.recommendedNextStep || 'Review trade outcomes and progression pathways with counsellor.',
    isFamilyConnected: !!raw.isFamilyConnected,
    notes: (raw.notes || []).map((n: any) => ({
      id: n.id,
      caseId: n.caseId || raw.id,
      counsellorId: n.counsellorId || 'COUNS-101',
      createdAt: n.createdAt ? (n.createdAt.includes('T') ? new Date(n.createdAt).toLocaleDateString() : n.createdAt) : 'Just now',
      noteText: n.noteText || n.text || '',
      visibility: n.visibility || 'private'
    })),
    recommendations: (raw.recommendations || []).map((r: any) => ({
      id: r.id,
      tradeId: r.tradeId || 'solar-technician',
      tradeTitle: r.tradeTitle || 'Vocational Trade',
      whyDiscussed: r.whyDiscussed || '',
      skillsToDevelop: r.skillsToDevelop || [],
      trainingPathway: r.trainingPathway || '',
      thingsToVerify: r.thingsToVerify || ''
    })),
    followUps: (raw.followUps || []).map((f: any) => ({
      id: f.id,
      caseId: f.caseId || raw.id,
      studentName: f.studentName || raw.studentName,
      parentName: f.parentName || raw.parentName,
      dueDate: f.dueDate || '',
      reason: f.reason || '',
      message: f.message || `Follow up on ${raw.activeTradeTitle || 'Career'}`,
      status: String(f.status || 'pending').toLowerCase() as any,
      createdAt: f.createdAt ? (f.createdAt.includes('T') ? new Date(f.createdAt).toLocaleDateString() : f.createdAt) : 'Just now'
    })),
    sessions: (raw.sessions || raw.calls || []).map((s: any) => ({
      id: s.id,
      caseId: s.caseId || raw.id,
      sessionType: String(s.sessionType || 'student_1on1').toLowerCase() as any,
      studentName: s.studentName || raw.studentName,
      parentName: s.parentName || raw.parentName,
      tradeTitle: s.tradeTitle || raw.activeTradeTitle || 'Vocational Trade',
      scheduledTime: s.scheduledTime || 'Tomorrow • 11:30 AM',
      durationMinutes: s.durationMinutes || 30,
      status: String(s.status || 'scheduled').toLowerCase() as any
    })),
    createdAt: raw.createdAt ? (raw.createdAt.includes('T') ? new Date(raw.createdAt).toLocaleDateString() : raw.createdAt) : new Date().toISOString(),
    updatedAt: raw.updatedAt ? (raw.updatedAt.includes('T') ? new Date(raw.updatedAt).toLocaleDateString() : raw.updatedAt) : new Date().toISOString()
  };
}

export const counsellingService = {
  // 1. Submit Request from Student or Parent
  async submitRequest(payload: CreateRequestPayload): Promise<{ success: boolean; request: CounsellingRequest; caseItem: CounsellingCase }> {
    const body = {
      requesterUserId: payload.requesterUserId || (payload.requesterType?.toUpperCase() === 'PARENT' ? `PAR-${payload.studentName}` : `STU-${payload.studentName}`),
      requesterType: String(payload.requesterType || 'STUDENT').toUpperCase(),
      requesterName: payload.requesterName,
      studentName: payload.studentName,
      parentName: payload.parentName,
      phone: payload.phone,
      district: payload.district || 'Kanpur Nagar',
      state: payload.state || 'Uttar Pradesh',
      preferredLanguage: payload.preferredLanguage || 'Hindi',
      counsellorId: payload.counsellorId || 'COUNS-101',
      counsellorName: payload.counsellorName || 'Dr. Priya Sharma',
      requestType: String(payload.requestType || 'MESSAGE').toUpperCase(),
      concernCategory: payload.concernCategory || 'Job Security',
      subject: payload.subject || `${payload.studentName} - Guidance Request`,
      message: payload.message || payload.messageText || 'Guidance requested',
      careerReferenceTradeId: payload.careerReferenceTradeId,
      careerReferenceTradeTitle: payload.careerReferenceTradeTitle,
      preferredDate: payload.preferredDate,
      preferredTimeSlot: payload.preferredTimeSlot,
      priority: payload.priority || 'High',
      consentShareAISummary: !!payload.consentShareAISummary,
      aiConversationSummary: payload.aiConversationSummary,
      caseId: payload.caseId
    };

    const res = await fetch('/api/counselling/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Submission failed' }));
      throw new Error(err.error || 'Failed to submit counselling request');
    }

    const data = await res.json();
    return {
      success: true,
      request: normalizeRequest(data.request),
      caseItem: normalizeCase(data.caseItem)
    };
  },

  // 2. Fetch requests for Counsellor Desk
  async fetchCounsellorRequests(counsellorId?: string, filters?: { requesterType?: string; requestType?: string; status?: string }): Promise<CounsellingRequest[]> {
    const params = new URLSearchParams();
    if (counsellorId) params.append('counsellorId', counsellorId);
    if (filters?.requesterType && filters.requesterType !== 'all') params.append('requesterType', filters.requesterType.toUpperCase());
    if (filters?.requestType && filters.requestType !== 'all') params.append('requestType', filters.requestType.toUpperCase());
    if (filters?.status) params.append('status', filters.status.toUpperCase());

    const res = await fetch(`/api/counselling/requests?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch requests');
    const data = await res.json();
    return (data || []).map((r: any) => normalizeRequest(r));
  },

  // 3. Fetch requests for specific user (Student or Parent)
  async fetchUserRequests(userIdOrName: string): Promise<CounsellingRequest[]> {
    const res = await fetch(`/api/counselling/requests/user/${encodeURIComponent(userIdOrName)}`);
    if (!res.ok) throw new Error('Failed to fetch user requests');
    const data = await res.json();
    return (data || []).map((r: any) => normalizeRequest(r));
  },

  // 4. Accept a request
  async acceptRequest(requestId: string): Promise<CounsellingRequest> {
    const res = await fetch(`/api/counselling/requests/${requestId}/accept`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to accept request');
    const data = await res.json();
    return normalizeRequest(data.request);
  },

  // 5. Reject a request
  async rejectRequest(requestId: string, reason?: string): Promise<CounsellingRequest> {
    const res = await fetch(`/api/counselling/requests/${requestId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to reject request');
    const data = await res.json();
    return normalizeRequest(data.request);
  },

  // 6. Fetch conversation threads for a user (Student or Parent to read counsellor replies)
  async fetchUserConversations(userIdOrName: string): Promise<{
    caseItem: CounsellingCase;
    messages: CounsellingMessage[];
    requests: CounsellingRequest[];
    calls: any[];
  }[]> {
    const res = await fetch(`/api/counselling/user/${encodeURIComponent(userIdOrName)}/conversations`);
    if (!res.ok) throw new Error('Failed to fetch user conversations');
    const data = await res.json();
    return (data || []).map((item: any) => ({
      caseItem: normalizeCase(item.caseItem),
      messages: (item.messages || []).map((m: any) => normalizeMessage(m)),
      requests: (item.requests || []).map((r: any) => normalizeRequest(r)),
      calls: item.calls || []
    }));
  },

  // 7. Fetch messages for a case thread
  async fetchCaseMessages(caseId: string): Promise<CounsellingMessage[]> {
    const res = await fetch(`/api/counselling/cases/${caseId}/messages`);
    if (!res.ok) throw new Error('Failed to fetch case messages');
    const data = await res.json();
    return (data || []).map((m: any) => normalizeMessage(m));
  },

  // 8. Send message in a conversation thread
  async sendMessage(caseId: string, messageData: {
    senderUserId?: string;
    senderRole: 'STUDENT' | 'PARENT' | 'COUNSELLOR' | 'student' | 'parent' | 'counsellor';
    senderName: string;
    message: string;
  }): Promise<CounsellingMessage> {
    const res = await fetch(`/api/counselling/cases/${caseId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderUserId: messageData.senderUserId || 'USER',
        senderRole: String(messageData.senderRole).toUpperCase(),
        senderName: messageData.senderName,
        message: messageData.message
      })
    });
    if (!res.ok) throw new Error('Failed to send message');
    const data = await res.json();
    return normalizeMessage(data.message);
  },

  // 9. Fetch all cases
  async fetchCases(counsellorId?: string): Promise<CounsellingCase[]> {
    const params = counsellorId ? `?counsellorId=${counsellorId}` : '';
    const res = await fetch(`/api/counselling/cases${params}`);
    if (!res.ok) throw new Error('Failed to fetch cases');
    const data = await res.json();
    return (data || []).map((c: any) => normalizeCase(c));
  },

  // 10. Update case stage
  async updateCaseStage(caseId: string, stage: string, nextStep?: string): Promise<CounsellingCase> {
    const res = await fetch(`/api/counselling/cases/${caseId}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, recommendedNextStep: nextStep })
    });
    if (!res.ok) throw new Error('Failed to update stage');
    const data = await res.json();
    return normalizeCase(data);
  },

  // 11. Add note
  async addNote(caseId: string, noteText: string, visibility: 'private' | 'shared_with_family', counsellorId?: string): Promise<CounsellorNote> {
    const res = await fetch(`/api/counselling/cases/${caseId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteText, visibility, counsellorId })
    });
    if (!res.ok) throw new Error('Failed to add note');
    return res.json();
  },

  // 12. Add follow-up
  async addFollowUp(caseId: string, followUp: {
    counsellorId?: string;
    studentName: string;
    parentName?: string;
    dueDate: string;
    reason: string;
  }): Promise<CounsellingFollowUp> {
    const res = await fetch('/api/counselling/followups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, ...followUp })
    });
    if (!res.ok) throw new Error('Failed to add follow-up');
    return res.json();
  },

  // 13. Fetch counsellors
  async fetchCounsellors(): Promise<CounsellorProfile[]> {
    const res = await fetch('/api/counsellors');
    if (!res.ok) throw new Error('Failed to fetch counsellors');
    return res.json();
  },

  // 14. Request a call
  async requestCall(payload: {
    caseId?: string;
    counsellorId?: string;
    counsellorName?: string;
    studentName: string;
    parentName?: string;
    phone?: string;
    sessionType?: 'STUDENT_1ON1' | 'PARENT_1ON1' | 'JOINT_FAMILY';
    tradeTitle?: string;
    scheduledDate?: string;
    scheduledSlot?: string;
    callReason?: string;
  }): Promise<CounsellingSessionRecord> {
    const res = await fetch('/api/counselling/calls/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to request call');
    const data = await res.json();
    return normalizeCall(data.call);
  },

  // 15. Fetch user calls
  async fetchUserCalls(userIdOrName: string): Promise<CounsellingSessionRecord[]> {
    const res = await fetch(`/api/counselling/calls?userId=${encodeURIComponent(userIdOrName)}`);
    if (!res.ok) throw new Error('Failed to fetch user calls');
    const data = await res.json();
    return (data || []).map((c: any) => normalizeCall(c));
  },

  // 16. Accept call (Counsellor)
  async acceptCall(callId: string, date?: string, slot?: string): Promise<CounsellingSessionRecord> {
    const res = await fetch(`/api/counselling/calls/${callId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledDate: date, scheduledSlot: slot })
    });
    if (!res.ok) throw new Error('Failed to accept call');
    const data = await res.json();
    return normalizeCall(data.call);
  },

  // 17. Reschedule call
  async rescheduleCall(callId: string, newDate: string, newSlot: string, reason?: string, requestedBy?: string): Promise<CounsellingSessionRecord> {
    const res = await fetch(`/api/counselling/calls/${callId}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDate, newSlot, reason, requestedBy })
    });
    if (!res.ok) throw new Error('Failed to reschedule call');
    const data = await res.json();
    return normalizeCall(data.call);
  },

  // 18. Cancel call
  async cancelCall(callId: string, reason?: string, cancelledBy?: string): Promise<CounsellingSessionRecord> {
    const res = await fetch(`/api/counselling/calls/${callId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, cancelledBy })
    });
    if (!res.ok) throw new Error('Failed to cancel call');
    const data = await res.json();
    return normalizeCall(data.call);
  },

  // 19. Start call session
  async startCall(callId: string): Promise<CounsellingSessionRecord> {
    const res = await fetch(`/api/counselling/calls/${callId}/start`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to start call');
    const data = await res.json();
    return normalizeCall(data.call);
  },

  // 20. End call session
  async endCall(callId: string, durationSeconds?: number, notesSummary?: string, shareWithFamily?: boolean): Promise<CounsellingSessionRecord> {
    const res = await fetch(`/api/counselling/calls/${callId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ durationSeconds, notesSummary, shareWithFamily })
    });
    if (!res.ok) throw new Error('Failed to end call');
    const data = await res.json();
    return normalizeCall(data.call);
  },

  // 21. Fetch Notifications
  async fetchNotifications(userId: string, role?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (role) params.append('role', role);
    const res = await fetch(`/api/counselling/notifications?${params.toString()}`);
    if (!res.ok) return [];
    return res.json();
  },

  // 22. Mark notification read
  async markNotificationRead(id: string): Promise<boolean> {
    const res = await fetch(`/api/counselling/notifications/${id}/read`, { method: 'POST' });
    return res.ok;
  },

  // 23. Mark all notifications read
  async markAllNotificationsRead(userId: string): Promise<boolean> {
    const res = await fetch('/api/counselling/notifications/mark-all-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.ok;
  },

  // 24. Mark case messages as read
  async markCaseRead(caseId: string, role: string): Promise<boolean> {
    const res = await fetch(`/api/counselling/cases/${caseId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readerRole: role })
    });
    return res.ok;
  },

  // 25. Fetch unread counts
  async fetchUnreadSummary(userId: string, role: string): Promise<{ messages: number; notifications: number }> {
    const res = await fetch(`/api/counselling/unread?userId=${encodeURIComponent(userId)}&role=${encodeURIComponent(role)}`);
    if (!res.ok) return { messages: 0, notifications: 0 };
    return res.json();
  }
};

export function normalizeCall(raw: any): CounsellingSessionRecord {
  const statusRaw = String(raw.status || 'scheduled').toLowerCase();
  let status: any = statusRaw;
  if (statusRaw === 'in_progress') status = 'in_progress';
  else if (statusRaw === 'scheduled') status = 'scheduled';
  else if (statusRaw === 'completed') status = 'completed';
  else if (statusRaw === 'cancelled') status = 'cancelled';
  else if (statusRaw === 'rescheduled') status = 'rescheduled';
  else if (statusRaw === 'requested') status = 'requested';
  else if (statusRaw === 'rejected') status = 'rejected';
  else if (statusRaw === 'ready') status = 'ready';

  return {
    id: raw.id,
    caseId: raw.caseId || 'CASE-1042',
    counsellorId: raw.counsellorId || 'COUNS-101',
    counsellorName: raw.counsellorName || 'Dr. Priya Sharma',
    sessionType: String(raw.sessionType || 'student_1on1').toLowerCase() as any,
    studentName: raw.studentName,
    parentName: raw.parentName,
    tradeTitle: raw.tradeTitle || 'Vocational Trade',
    scheduledDate: raw.scheduledDate,
    scheduledSlot: raw.scheduledSlot,
    scheduledTime: raw.scheduledTime || `${raw.scheduledDate || 'Tomorrow'} • ${raw.scheduledSlot || '11:30 AM'}`,
    durationMinutes: raw.durationMinutes || 30,
    status,
    callRoomId: raw.callRoomId || `ROOM-${raw.id}`,
    callReason: raw.callReason,
    actualDurationSeconds: raw.actualDurationSeconds,
    counsellorNotesSummary: raw.counsellorNotesSummary,
    sharedWithFamily: raw.sharedWithFamily,
    rescheduleReason: raw.rescheduleReason,
    cancelReason: raw.cancelReason
  };
}
