// Centralized Administrator Service with Role-Based Security Headers

const getAdminHeaders = () => {
  let auth: any = null;
  try { auth = JSON.parse(localStorage.getItem('hunarsetu_auth') || 'null'); } catch { auth = null; }
  return {
    'Content-Type': 'application/json',
    'x-user-role': auth?.role === 'admin' ? 'ADMIN' : '',
    'Authorization': auth?.token ? `Bearer ${auth.token}` : ''
  };
};

export const adminService = {
  // 1. Dashboard Overview
  async fetchDashboard(): Promise<any> {
    const res = await fetch('/api/admin/dashboard', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin dashboard');
    return res.json();
  },

  // 2. Users Management
  async fetchUsers(filters?: { role?: string; status?: string; search?: string; state?: string; district?: string; page?: number; limit?: number }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const res = await fetch(`/api/admin/users?${params.toString()}`, {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async fetchUserById(id: string): Promise<any> {
    const res = await fetch(`/api/admin/users/${id}`, {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async updateUserStatus(id: string, status: string, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/users/${id}/status`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return res.json();
  },

  async updateUserProfile(id: string, updates: any, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify({ updates, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to update user profile');
    return res.json();
  },

  // 3. Counsellors & Verification
  async fetchCounsellors(): Promise<any[]> {
    const res = await fetch('/api/admin/counsellors', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch counsellors');
    return res.json();
  },

  async verifyCounsellor(id: string, status: string, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/counsellors/${id}/verify`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to verify counsellor');
    return res.json();
  },

  async createCounsellor(counsellorData: any, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/counsellors', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ counsellorData, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to create counsellor');
    return res.json();
  },

  // 4. Counselling Requests & Cases
  async fetchCounsellingRequests(filters?: { requesterType?: string; status?: string; counsellorId?: string }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.requesterType) params.append('requesterType', filters.requesterType);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.counsellorId) params.append('counsellorId', filters.counsellorId);

    const res = await fetch(`/api/admin/counselling/requests?${params.toString()}`, {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch counselling requests');
    return res.json();
  },

  async assignCounsellor(requestId: string, counsellorId: string, counsellorName: string, reason?: string, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/counselling/assign', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ requestId, counsellorId, counsellorName, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to assign counsellor');
    return res.json();
  },

  async updateRequestPriority(requestId: string, priority: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/counselling/requests/${requestId}/priority`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ priority, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to update request priority');
    return res.json();
  },

  async cancelRequest(requestId: string, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/counselling/requests/${requestId}/cancel`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to cancel request');
    return res.json();
  },

  async fetchConversationsMetadata(): Promise<any[]> {
    const res = await fetch('/api/admin/counselling/conversations', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch conversation metadata');
    return res.json();
  },

  async requestPrivilegedConversationAccess(caseId: string, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/counselling/conversations/${caseId}/privileged-access`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ reason, adminEmail })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Privileged access failed');
    }
    return res.json();
  },

  // 5. Sessions & Calls
  async fetchSessions(): Promise<any[]> {
    const res = await fetch('/api/admin/sessions', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },

  async rescheduleSession(sessionId: string, newDate: string, newSlot: string, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/sessions/${sessionId}/reschedule`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ newDate, newSlot, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to reschedule session');
    return res.json();
  },

  async cancelSession(sessionId: string, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/sessions/${sessionId}/cancel`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to cancel session');
    return res.json();
  },

  // 6. Careers
  async fetchCareers(filters?: { sector?: string; status?: string; search?: string }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.sector) params.append('sector', filters.sector);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`/api/admin/careers?${params.toString()}`, {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch careers');
    return res.json();
  },

  async saveCareer(careerData: any, reason: string, adminEmail?: string): Promise<any> {
    const url = careerData.id && !careerData.id.startsWith('new-') ? `/api/admin/careers/${careerData.id}` : '/api/admin/careers';
    const method = careerData.id && !careerData.id.startsWith('new-') ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: getAdminHeaders(),
      body: JSON.stringify({ careerData, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to save career');
    return res.json();
  },

  async updateCareerStatus(id: string, status: string, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/careers/${id}/status`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to update career status');
    return res.json();
  },

  // 7. Skills
  async fetchSkills(): Promise<any[]> {
    const res = await fetch('/api/admin/skills', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  async saveSkill(skillData: any, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/skills', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ skillData, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to save skill');
    return res.json();
  },

  // 8. Training Providers & Opportunities
  async fetchTrainingProviders(district?: string): Promise<any[]> {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`/api/admin/training-providers${params}`, {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch training providers');
    return res.json();
  },

  async saveTrainingProvider(providerData: any, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/training-providers', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ providerData, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to save training provider');
    return res.json();
  },

  async fetchOpportunities(district?: string): Promise<any[]> {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`/api/admin/opportunities${params}`, {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    return res.json();
  },

  async saveOpportunity(opportunityData: any, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/opportunities', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ opportunityData, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to save opportunity');
    return res.json();
  },

  // 9. Knowledge Base & RAG
  async fetchKnowledgeSources(category?: string, verificationStatus?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (verificationStatus) params.append('verificationStatus', verificationStatus);

    const res = await fetch(`/api/admin/knowledge?${params.toString()}`, {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch knowledge sources');
    return res.json();
  },

  async saveKnowledgeSource(knowledgeData: any, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/knowledge', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ knowledgeData, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to save knowledge source');
    return res.json();
  },

  async updateKnowledgeStatus(id: string, status: string, published: boolean, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/knowledge/${id}/status`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status, published, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to update knowledge status');
    return res.json();
  },

  // 10. AI Status & Safety Settings
  async fetchAiStatus(): Promise<any> {
    const res = await fetch('/api/admin/ai/status', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch AI status');
    return res.json();
  },

  async updateAiSettings(settingsUpdates: any, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/ai/settings', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify({ settingsUpdates, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to update AI settings');
    return res.json();
  },

  // 11. Issues & Complaints
  async fetchIssues(status?: string, category?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);

    const res = await fetch(`/api/admin/issues?${params.toString()}`, {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch issues');
    return res.json();
  },

  async updateIssue(id: string, updates: any, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch(`/api/admin/issues/${id}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify({ updates, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to update issue');
    return res.json();
  },

  async addIssueNote(id: string, noteText: string, adminEmail?: string): Promise<boolean> {
    const res = await fetch(`/api/admin/issues/${id}/notes`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ noteText, adminEmail })
    });
    return res.ok;
  },

  // 12. Notifications & Broadcasts
  async fetchNotifications(): Promise<any> {
    const res = await fetch('/api/admin/notifications', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async broadcastNotification(payload: { title: string; message: string; audience: string; targetUserId?: string }, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/notifications/broadcast', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ ...payload, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to broadcast notification');
    return res.json();
  },

  async createAnnouncement(announcementData: any, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ announcementData, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to create announcement');
    return res.json();
  },

  // 13. Audit Logs
  async fetchAuditLogs(): Promise<any[]> {
    const res = await fetch('/api/admin/audit-logs', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  // 14. Settings
  async fetchSettings(): Promise<any> {
    const res = await fetch('/api/admin/settings', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(updates: any, reason: string, adminEmail?: string): Promise<any> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify({ updates, reason, adminEmail })
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  }
};
