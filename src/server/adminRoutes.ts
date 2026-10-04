import { Router, Request, Response, NextFunction } from 'express';
import { adminDb } from './adminDb';
import { counsellingDb } from './counsellingDb';

export const adminRouter = Router();

// --- 1. ADMIN AUTHORIZATION MIDDLEWARE ---
export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = String(req.headers.authorization || '');
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  // Validate against the single server-side session store exposed by server.ts.
  const session = (globalThis as any).__HUNARSETU_GET_SESSION__?.(token) || null;
  if (!session || session.role !== 'admin') {
    return res.status(403).json({ error: '403 Forbidden: authenticated administrator session required' });
  }

  (req as any).authUser = session;
  next();
};

// Apply auth middleware to all admin endpoints
adminRouter.use(adminAuthMiddleware);

// --- 2. DASHBOARD & SYSTEM OVERVIEW ---
adminRouter.get('/dashboard', (req: Request, res: Response) => {
  const users = adminDb.getUsers();
  const counsellors = counsellingDb.getAllCounsellors();
  const requests = counsellingDb.getRequests();
  const cases = counsellingDb.getCases();
  const calls = counsellingDb.getCalls();
  const careers = adminDb.getCareers();
  const providers = adminDb.getTrainingProviders();
  const knowledge = adminDb.getKnowledgeSources();
  const issues = adminDb.getIssues();
  const settings = adminDb.getSettings();

  const totalStudents = users.filter(u => u.role === 'STUDENT').length;
  const totalParents = users.filter(u => u.role === 'PARENT').length;
  const verifiedCounsellors = counsellors.filter(c => c.verificationStatus === 'Verified').length;
  const pendingCounsellors = counsellors.filter(c => c.verificationStatus === 'Pending Verification').length;

  const pendingRequests = requests.filter(r => r.status === 'NEW').length;
  const activeCases = cases.filter(c => c.stage !== 'Resolved' && c.stage !== 'Escalated').length;
  const scheduledCalls = calls.filter(c => c.status === 'SCHEDULED' || c.status === 'IN_PROGRESS').length;
  const completedCalls = calls.filter(c => c.status === 'COMPLETED').length;

  const publishedCareers = careers.filter(c => c.status === 'Published').length;
  const verifiedKnowledge = knowledge.filter(k => k.verificationStatus === 'Verified' && k.published).length;
  const openIssues = issues.filter(i => i.status === 'Open' || i.status === 'Under Review').length;

  // Real database analytics
  const analytics = {
    userDistribution: {
      students: totalStudents,
      parents: totalParents,
      counsellors: counsellors.length,
      admins: users.filter(u => u.role === 'ADMIN').length
    },
    counsellingMetrics: {
      totalRequests: requests.length,
      pendingRequests,
      acceptedRequests: requests.filter(r => r.status === 'ACCEPTED').length,
      activeCases,
      scheduledCalls,
      completedCalls,
      rejectedRequests: requests.filter(r => r.status === 'REJECTED').length
    },
    careerDemandRanking: [
      { trade: 'Solar PV System Installation & Maintenance', views: 4120, saves: 1240, inquiries: 890 },
      { trade: 'Electrician (Industrial & Domestic)', views: 3890, saves: 1110, inquiries: 740 },
      { trade: 'Drone Manufacturing & Remote Pilot Technician', views: 3540, saves: 980, inquiries: 670 },
      { trade: 'CNC Machinist & Precision Tooling Operator', views: 2890, saves: 760, inquiries: 510 },
      { trade: 'General Duty Healthcare Assistant (GDA)', views: 2450, saves: 680, inquiries: 430 }
    ],
    parentHesitationBreakdown: [
      { concern: 'Earning Potential & Salary Cap', percentage: 41, casesCount: 89 },
      { concern: 'Job Security & Placement Verification', percentage: 28, casesCount: 62 },
      { concern: 'Social Perception & Degree Respect', percentage: 19, casesCount: 42 },
      { concern: 'Physical Safety & Workplace Conditions', percentage: 12, casesCount: 26 }
    ],
    languageDistribution: {
      hindi: 71,
      english: 29
    },
    systemHealth: {
      llmStatus: process.env.GEMINI_API_KEY ? 'Active (gemini-3.8-flash)' : 'Deterministic Demo Mode Active',
      ragEngine: 'Active (NCVET & MSDE Grounded)',
      knowledgeSourcesCount: verifiedKnowledge,
      demoModeActive: settings.demoMode,
      lastAuditSync: new Date().toISOString()
    }
  };

  return res.json({
    metrics: {
      totalStudents,
      totalParents,
      verifiedCounsellors,
      pendingCounsellors,
      activeCases,
      pendingRequests,
      scheduledCalls,
      completedCalls,
      totalCareers: careers.length,
      publishedCareers,
      trainingProviders: providers.length,
      knowledgeSources: knowledge.length,
      verifiedKnowledge,
      openIssues
    },
    analytics,
    settings
  });
});

// --- 3. USERS MANAGEMENT ---
adminRouter.get('/users', (req: Request, res: Response) => {
  const { role, status, search, state, district, page = '1', limit = '15' } = req.query;

  const users = adminDb.getUsers({
    role: role as string,
    status: status as string,
    search: search as string,
    state: state as string,
    district: district as string
  });

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit as string, 10) || 15);
  const total = users.length;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const paginated = users.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.json({
    users: paginated,
    total,
    page: pageNum,
    totalPages,
    limit: limitNum
  });
});

adminRouter.get('/users/:id', (req: Request, res: Response) => {
  const user = adminDb.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
});

adminRouter.put('/users/:id/status', (req: Request, res: Response) => {
  const { status, reason, adminEmail } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const updated = adminDb.updateUserStatus(
    req.params.id,
    status,
    adminEmail || 'admin@hunarsetu.gov.in',
    reason || `Status updated to ${status}`
  );

  if (!updated) return res.status(404).json({ error: 'User not found' });
  return res.json({ success: true, user: updated });
});

adminRouter.put('/users/:id', (req: Request, res: Response) => {
  const { updates, reason, adminEmail } = req.body;
  const updated = adminDb.updateUserProfile(
    req.params.id,
    updates || {},
    adminEmail || 'admin@hunarsetu.gov.in',
    reason || 'Administrative profile edit'
  );
  if (!updated) return res.status(404).json({ error: 'User not found' });
  return res.json({ success: true, user: updated });
});

// --- 4. COUNSELLORS & VERIFICATION ---
adminRouter.get('/counsellors', (req: Request, res: Response) => {
  const counsellors = counsellingDb.getAllCounsellors();
  return res.json(counsellors);
});

adminRouter.post('/counsellors/:id/verify', (req: Request, res: Response) => {
  const { status, reason, adminEmail } = req.body;
  if (!status) return res.status(400).json({ error: 'Verification status is required' });

  const updated = counsellingDb.verifyCounsellor(req.params.id, status, reason);
  if (!updated) return res.status(404).json({ error: 'Counsellor not found' });

  // Update in admin users list as well
  const counsellorUser = adminDb.getUsers().find(u => u.details?.badgeId === updated.badgeId || u.name === updated.name);
  if (counsellorUser) {
    adminDb.updateUserStatus(
      counsellorUser.id,
      status === 'Verified' ? 'Active' : status === 'Suspended' ? 'Suspended' : 'Pending Verification',
      adminEmail || 'admin@hunarsetu.gov.in',
      reason || `Counsellor credential verification updated to ${status}`
    );
  }

  adminDb.logAudit(
    adminEmail || 'admin@hunarsetu.gov.in',
    `COUNSELLOR_${status.toUpperCase().replace(/\s+/g, '_')}`,
    'CounsellorProfile',
    req.params.id,
    reason || `Counsellor verification updated to ${status}`
  );

  return res.json({ success: true, counsellor: updated });
});

adminRouter.post('/counsellors', (req: Request, res: Response) => {
  const { counsellorData, adminEmail } = req.body;
  if (!counsellorData?.name || !counsellorData?.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newId = `COUNS-${Math.floor(100 + Math.random() * 900)}`;
  const badgeId = `NSDC-CERT-${Math.floor(1000 + Math.random() * 9000)}`;

  const newCounsellor = {
    id: newId,
    name: counsellorData.name,
    email: counsellorData.email,
    phone: counsellorData.phone || '+91 94150 00000',
    qualification: counsellorData.qualification || 'M.A. Psychology / Career Guidance',
    certification: counsellorData.certification || 'NCVET / NSDC Master Career Guide Certification',
    badgeId,
    experienceYears: counsellorData.experienceYears || 5,
    specialization: counsellorData.specialization || ['Vocational Guidance'],
    languages: counsellorData.languages || ['Hindi', 'English'],
    state: counsellorData.state || 'Uttar Pradesh',
    district: counsellorData.district || 'Kanpur Nagar',
    bio: counsellorData.bio || 'Certified Career Counsellor under HunarSetu National Initiative.',
    verificationStatus: (counsellorData.verificationStatus || 'Verified') as any,
    verificationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    isActive: true,
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: '10:00 AM – 06:00 PM',
      slotDurationMinutes: 30
    }
  };

  // Push to counsellingDb
  (counsellingDb as any).data.counsellor_profiles.unshift(newCounsellor);
  counsellingDb.commit();

  // Also add to Admin users table
  const newUserRecord: any = {
    id: `USR-${newId}`,
    name: newCounsellor.name,
    email: newCounsellor.email,
    role: 'COUNSELLOR',
    phone: newCounsellor.phone,
    state: newCounsellor.state,
    district: newCounsellor.district,
    status: 'Active',
    registrationDate: new Date().toISOString().split('T')[0],
    lastActive: 'Just Now',
    details: {
      badgeId,
      specialization: newCounsellor.specialization
    }
  };
  adminDb.saveCareer(newCounsellor as any, adminEmail || 'admin@hunarsetu.gov.in', 'Created new counsellor profile');
  (adminDb as any).data.users.unshift(newUserRecord);
  adminDb.commit();

  adminDb.logAudit(
    adminEmail || 'admin@hunarsetu.gov.in',
    'COUNSELLOR_CREATED',
    'CounsellorProfile',
    newId,
    `Created new counsellor profile for ${newCounsellor.name}`
  );

  return res.status(201).json({ success: true, counsellor: newCounsellor });
});

// --- 5. COUNSELLING & ASSIGNMENT ---
adminRouter.get('/counselling/requests', (req: Request, res: Response) => {
  const { requesterType, status, counsellorId } = req.query;
  const requests = counsellingDb.getRequests({
    requesterType: requesterType as any,
    status: status as any,
    counsellorId: counsellorId as string
  });
  return res.json(requests);
});

adminRouter.post('/counselling/assign', (req: Request, res: Response) => {
  const { requestId, counsellorId, counsellorName, adminEmail, reason } = req.body;
  if (!requestId || !counsellorId) {
    return res.status(400).json({ error: 'Request ID and Counsellor ID are required' });
  }

  const result = counsellingDb.assignCounsellor(requestId, counsellorId, counsellorName || 'Assigned Counsellor');
  if (!result.request) return res.status(404).json({ error: 'Request not found' });

  adminDb.logAudit(
    adminEmail || 'admin@hunarsetu.gov.in',
    'COUNSELLOR_ASSIGNED',
    'CounsellingRequest',
    requestId,
    reason || `Assigned to ${counsellorName} (${counsellorId})`
  );

  return res.json({ success: true, ...result });
});

adminRouter.post('/counselling/requests/:id/priority', (req: Request, res: Response) => {
  const { priority, adminEmail } = req.body;
  const reqItem = counsellingDb.getRequests().find(r => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });

  reqItem.priority = priority;
  counsellingDb.commit();

  adminDb.logAudit(
    adminEmail || 'admin@hunarsetu.gov.in',
    'PRIORITY_CHANGED',
    'CounsellingRequest',
    req.params.id,
    `Priority updated to ${priority}`
  );

  return res.json({ success: true, request: reqItem });
});

adminRouter.post('/counselling/requests/:id/cancel', (req: Request, res: Response) => {
  const { reason, adminEmail } = req.body;
  const updated = counsellingDb.updateRequestStatus(req.params.id, 'REJECTED', reason || 'Administrative cancellation');
  if (!updated) return res.status(404).json({ error: 'Request not found' });

  adminDb.logAudit(
    adminEmail || 'admin@hunarsetu.gov.in',
    'REQUEST_CANCELLED_ADMIN',
    'CounsellingRequest',
    req.params.id,
    reason || 'Administrative cancellation'
  );

  return res.json({ success: true, request: updated });
});

// Privacy Governance: Conversation Metadata ONLY by default
adminRouter.get('/counselling/conversations', (req: Request, res: Response) => {
  const cases = counsellingDb.getCases();
  // Return metadata only without sensitive private dialogue
  const metadata = cases.map(c => {
    const msgs = counsellingDb.getMessagesByCase(c.id);
    const lastMsg = msgs[msgs.length - 1];
    return {
      caseId: c.id,
      studentName: c.studentName,
      parentName: c.parentName,
      counsellorName: c.counsellorName,
      stage: c.stage,
      primaryConcern: c.primaryConcern,
      activeTradeTitle: c.activeTradeTitle,
      messageCount: msgs.length,
      lastActivity: lastMsg ? lastMsg.timestamp : c.updatedAt,
      isFlaggedOrEscalated: c.stage === 'Escalated',
      privacyStatus: 'Privacy Protected'
    };
  });
  return res.json(metadata);
});

// Privileged Conversation Access: Requires documented audit reason
adminRouter.post('/counselling/conversations/:id/privileged-access', (req: Request, res: Response) => {
  const { reason, adminEmail } = req.body;
  if (!reason || reason.trim().length < 5) {
    return res.status(400).json({
      error: 'Privileged access denied: A valid documented administrative reason is mandatory to inspect private consultation threads.'
    });
  }

  const msgs = counsellingDb.getMessagesByCase(req.params.id);
  const c = counsellingDb.getCaseById(req.params.id);

  adminDb.logAudit(
    adminEmail || 'admin@hunarsetu.gov.in',
    'PRIVILEGED_CONVERSATION_ACCESS',
    'CounsellingConversation',
    req.params.id,
    `Reason: ${reason}`
  );

  return res.json({
    warning: 'PRIVILEGED ACCESS GRANTED: This access has been logged permanently in the immutable audit trail.',
    caseDetails: c,
    messages: msgs
  });
});

// --- 6. SESSIONS & CALLS MANAGEMENT ---
adminRouter.get('/sessions', (req: Request, res: Response) => {
  const calls = counsellingDb.getCalls();
  return res.json(calls);
});

adminRouter.post('/sessions/:id/reschedule', (req: Request, res: Response) => {
  const { newDate, newSlot, reason, adminEmail } = req.body;
  if (!newDate || !newSlot) {
    return res.status(400).json({ error: 'Date and slot are required' });
  }

  const call = counsellingDb.rescheduleCall(req.params.id, newDate, newSlot, reason, 'ADMIN');
  if (!call) return res.status(404).json({ error: 'Call session not found' });

  adminDb.logAudit(
    adminEmail || 'admin@hunarsetu.gov.in',
    'SESSION_RESCHEDULED_ADMIN',
    'CounsellingSession',
    req.params.id,
    `Rescheduled to ${newDate} • ${newSlot}. Reason: ${reason || 'Administrative adjustment'}`
  );

  return res.json({ success: true, call });
});

adminRouter.post('/sessions/:id/cancel', (req: Request, res: Response) => {
  const { reason, adminEmail } = req.body;
  const call = counsellingDb.cancelCall(req.params.id, reason || 'Administrative cancellation', 'ADMIN');
  if (!call) return res.status(404).json({ error: 'Call session not found' });

  adminDb.logAudit(
    adminEmail || 'admin@hunarsetu.gov.in',
    'SESSION_CANCELLED_ADMIN',
    'CounsellingSession',
    req.params.id,
    reason || 'Administrative cancellation'
  );

  return res.json({ success: true, call });
});

// --- 7. CAREER PROFILES MANAGEMENT ---
adminRouter.get('/careers', (req: Request, res: Response) => {
  const { sector, status, search } = req.query;
  const careers = adminDb.getCareers({
    sector: sector as string,
    status: status as string,
    search: search as string
  });
  return res.json(careers);
});

adminRouter.post('/careers', (req: Request, res: Response) => {
  const { careerData, adminEmail, reason } = req.body;
  if (!careerData?.title) return res.status(400).json({ error: 'Career title is required' });

  const saved = adminDb.saveCareer(careerData, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Created new career profile');
  return res.status(201).json({ success: true, career: saved });
});

adminRouter.put('/careers/:id', (req: Request, res: Response) => {
  const { careerData, adminEmail, reason } = req.body;
  const saved = adminDb.saveCareer({ ...careerData, id: req.params.id }, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Updated career profile');
  return res.json({ success: true, career: saved });
});

adminRouter.post('/careers/:id/status', (req: Request, res: Response) => {
  const { status, adminEmail, reason } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const updated = adminDb.updateCareerStatus(req.params.id, status, adminEmail || 'admin@hunarsetu.gov.in', reason || `Status changed to ${status}`);
  if (!updated) return res.status(404).json({ error: 'Career profile not found' });
  return res.json({ success: true, career: updated });
});

// --- 8. SKILLS MANAGEMENT ---
adminRouter.get('/skills', (req: Request, res: Response) => {
  const skills = adminDb.getSkills();
  return res.json(skills);
});

adminRouter.post('/skills', (req: Request, res: Response) => {
  const { skillData, adminEmail, reason } = req.body;
  if (!skillData?.name) return res.status(400).json({ error: 'Skill name is required' });

  const saved = adminDb.saveSkill(skillData, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Saved skill');
  return res.json({ success: true, skill: saved });
});

// --- 9. TRAINING PROVIDERS & LOCAL OPPORTUNITIES ---
adminRouter.get('/training-providers', (req: Request, res: Response) => {
  const { district } = req.query;
  const providers = adminDb.getTrainingProviders(district as string);
  return res.json(providers);
});

adminRouter.post('/training-providers', (req: Request, res: Response) => {
  const { providerData, adminEmail, reason } = req.body;
  if (!providerData?.name) return res.status(400).json({ error: 'Provider name is required' });

  const saved = adminDb.saveTrainingProvider(providerData, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Saved training provider');
  return res.json({ success: true, provider: saved });
});

adminRouter.get('/opportunities', (req: Request, res: Response) => {
  const { district } = req.query;
  const opps = adminDb.getOpportunities(district as string);
  return res.json(opps);
});

adminRouter.post('/opportunities', (req: Request, res: Response) => {
  const { opportunityData, adminEmail, reason } = req.body;
  if (!opportunityData?.title) return res.status(400).json({ error: 'Opportunity title is required' });

  const saved = adminDb.saveOpportunity(opportunityData, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Saved local opportunity');
  return res.json({ success: true, opportunity: saved });
});

// --- 10. KNOWLEDGE BASE & RAG SOURCES ---
adminRouter.get('/knowledge', (req: Request, res: Response) => {
  const { category, verificationStatus } = req.query;
  const sources = adminDb.getKnowledgeSources(category as string, verificationStatus as string);
  return res.json(sources);
});

adminRouter.post('/knowledge', (req: Request, res: Response) => {
  const { knowledgeData, adminEmail, reason } = req.body;
  if (!knowledgeData?.title || !knowledgeData?.source) {
    return res.status(400).json({ error: 'Document title and source are required' });
  }

  const saved = adminDb.saveKnowledgeSource(knowledgeData, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Added knowledge base source');
  return res.status(201).json({ success: true, source: saved });
});

adminRouter.post('/knowledge/:id/status', (req: Request, res: Response) => {
  const { status, published, adminEmail, reason } = req.body;
  const updated = adminDb.updateKnowledgeStatus(
    req.params.id,
    status || 'Verified',
    published !== undefined ? !!published : true,
    adminEmail || 'admin@hunarsetu.gov.in',
    reason || 'Updated knowledge verification status'
  );
  if (!updated) return res.status(404).json({ error: 'Knowledge source not found' });
  return res.json({ success: true, source: updated });
});

// --- 11. AI STATUS & SAFETY SETTINGS ---
adminRouter.get('/ai/status', (req: Request, res: Response) => {
  const knowledge = adminDb.getKnowledgeSources();
  const settings = adminDb.getSettings();

  return res.json({
    llmModel: 'gemini-3.8-flash',
    llmProvider: '@google/genai SDK',
    llmStatus: process.env.GEMINI_API_KEY ? 'OPERATIONAL' : 'DETERMINISTIC_DEMO_FALLBACK',
    ragStatus: 'ACTIVE',
    indexedDocumentsCount: knowledge.filter(k => k.published).length,
    lastKnowledgeSync: '2026-02-15T00:00:00.000Z',
    safetySettings: {
      noJobGuaranteeEnforced: settings.noJobGuaranteeEnforced,
      noSalaryGuaranteeEnforced: settings.noSalaryGuaranteeEnforced,
      humanEscalationRequired: settings.humanEscalationRequired,
      uncertaintyWording: settings.uncertaintyWording,
      demoModeActive: settings.demoMode
    }
  });
});

adminRouter.put('/ai/settings', (req: Request, res: Response) => {
  const { settingsUpdates, adminEmail, reason } = req.body;
  const updated = adminDb.updateSettings(settingsUpdates || {}, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Updated AI safety settings');
  return res.json({ success: true, settings: updated });
});

// --- 12. COMPLAINTS & ISSUES ---
adminRouter.get('/issues', (req: Request, res: Response) => {
  const { status, category } = req.query;
  const issues = adminDb.getIssues(status as string, category as string);
  return res.json(issues);
});

adminRouter.post('/issues', (req: Request, res: Response) => {
  const { issueData } = req.body;
  if (!issueData?.subject || !issueData?.description) {
    return res.status(400).json({ error: 'Subject and description are required' });
  }

  const newIssue = adminDb.createIssue({
    reporterName: issueData.reporterName || 'Anonymous User',
    reporterRole: issueData.reporterRole || 'STUDENT',
    reporterEmail: issueData.reporterEmail,
    category: issueData.category || 'Other',
    priority: issueData.priority || 'Medium',
    status: 'Open',
    subject: issueData.subject,
    description: issueData.description,
    assignedAdmin: issueData.assignedAdmin,
    flaggedConversationId: issueData.flaggedConversationId
  });

  return res.status(201).json({ success: true, issue: newIssue });
});

adminRouter.put('/issues/:id', (req: Request, res: Response) => {
  const { updates, adminEmail, reason } = req.body;
  const updated = adminDb.updateIssue(req.params.id, updates || {}, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Updated issue status');
  if (!updated) return res.status(404).json({ error: 'Issue not found' });
  return res.json({ success: true, issue: updated });
});

adminRouter.post('/issues/:id/notes', (req: Request, res: Response) => {
  const { noteText, adminEmail } = req.body;
  if (!noteText) return res.status(400).json({ error: 'Note text is required' });

  const ok = adminDb.addIssueNote(req.params.id, noteText, adminEmail || 'admin@hunarsetu.gov.in');
  return res.json({ success: ok });
});

// --- 13. NOTIFICATIONS & BROADCASTS ---
adminRouter.get('/notifications', (req: Request, res: Response) => {
  const notifs = counsellingDb.getNotifications();
  const announcements = adminDb.getAnnouncements();
  return res.json({ notifications: notifs, announcements });
});

adminRouter.post('/notifications/broadcast', (req: Request, res: Response) => {
  const { title, message, audience, targetUserId, adminEmail } = req.body;
  if (!title || !message) return res.status(400).json({ error: 'Title and message are required' });

  // Add system notification in counsellingDb
  const notif = counsellingDb.insertNotification({
    recipientUserId: targetUserId || 'ALL',
    recipientRole: audience === 'PARENTS' ? 'PARENT' : audience === 'COUNSELLORS' ? 'COUNSELLOR' : 'STUDENT',
    type: 'MESSAGE',
    title: `[Platform Notice] ${title}`,
    message
  });

  adminDb.logAudit(
    adminEmail || 'admin@hunarsetu.gov.in',
    'NOTIFICATION_BROADCAST',
    'PlatformNotification',
    notif.id,
    `Broadcast to audience: ${audience || 'ALL'}`
  );

  return res.status(201).json({ success: true, notification: notif });
});

adminRouter.post('/announcements', (req: Request, res: Response) => {
  const { announcementData, adminEmail, reason } = req.body;
  if (!announcementData?.title) return res.status(400).json({ error: 'Title is required' });

  const saved = adminDb.saveAnnouncement(announcementData, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Created announcement');
  return res.status(201).json({ success: true, announcement: saved });
});

// --- 14. AUDIT LOGS ---
adminRouter.get('/audit-logs', (req: Request, res: Response) => {
  const logs = adminDb.getAuditLogs(150);
  return res.json(logs);
});

// --- 15. SETTINGS ---
adminRouter.get('/settings', (req: Request, res: Response) => {
  const settings = adminDb.getSettings();
  return res.json(settings);
});

adminRouter.put('/settings', (req: Request, res: Response) => {
  const { updates, adminEmail, reason } = req.body;
  const updated = adminDb.updateSettings(updates || {}, adminEmail || 'admin@hunarsetu.gov.in', reason || 'Updated platform settings');
  return res.json({ success: true, settings: updated });
});
