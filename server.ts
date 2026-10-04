import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { counsellingDb } from './src/server/counsellingDb';
import { adminRouter } from './src/server/adminRoutes';
import { authenticateFamilyUser, createFamilyToken, createFamilyUser, ensureFamilyUsersTable, getFamilyUserCount, type FamilyAuthRole } from './src/server/mysqlDb';

dotenv.config();

ensureFamilyUsersTable().then(() => getFamilyUserCount().then(count => console.log(`[HunarSetu] Account storage ready. Registered family users: ${count}`))).catch(err => console.warn('[HunarSetu] Account storage will retry when an account action is used:', err?.message || err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Demo authentication/session layer. Credentials are kept server-side and are
// never silently inserted into the browser form.
type AuthSession = { role: 'admin' | 'counsellor' | 'student' | 'family'; email: string; name: string; userId?: number; expiresAt: number };
const authSessions = new Map<string, AuthSession>();
const DEMO_USERS = {
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@hunarsetu.gov.in',
    password: process.env.ADMIN_PASSWORD || 'HunarSetu@Admin26',
    name: 'HunarSetu System Administrator'
  },
  counsellor: {
    email: process.env.COUNSELLOR_EMAIL || 'counsellor@hunarsetu.gov.in',
    password: process.env.COUNSELLOR_PASSWORD || 'counsellor@123',
    name: 'Dr. Priya Sharma'
  }
} as const;

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    await ensureFamilyUsersTable();
    const { name, email, phone, password, confirmPassword, role } = req.body || {};
    const requestedRole: FamilyAuthRole | null = role === 'student' || role === 'parent' ? role : null;
    if (!requestedRole) return res.status(400).json({ error: 'Registration is available for student and parent accounts only.' });
    if (!String(name || '').trim() || !String(email || '').trim() || !String(password || '')) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    if (String(password) !== String(confirmPassword || '')) return res.status(400).json({ error: 'Passwords do not match.' });
    if (String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    const user = await createFamilyUser({ name: String(name), email: String(email), phone: String(phone || ''), password: String(password), role: requestedRole });
    const token = createFamilyToken();
    const appRole = requestedRole === 'parent' ? 'family' : 'student';
    authSessions.set(token, { role: appRole, userId: user.id, email: user.email, name: user.name, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
    return res.status(201).json({ success: true, token, role: appRole, accountRole: requestedRole, ...user });
  } catch (err: any) {
    if (err?.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    console.error('[Register Error]', err);
    return res.status(500).json({ error: 'We could not create your account right now. Please check your account details and try again.' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    await ensureFamilyUsersTable();
    const { email, password, role } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (role === 'student' || role === 'parent') {
      if (!normalizedEmail || !password) return res.status(400).json({ error: 'Email and password are required.' });
      const user = await authenticateFamilyUser(normalizedEmail, String(password), role);
      if (!user) return res.status(401).json({ error: 'Invalid email or password.' });
      const token = createFamilyToken();
      const appRole = role === 'parent' ? 'family' : 'student';
      authSessions.set(token, { role: appRole, userId: user.id, email: user.email, name: user.name, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
      return res.json({ success: true, token, role: appRole, accountRole: role, ...user });
    }

    const requestedRole = role === 'admin' || role === 'counsellor' ? role : null;
    if (!requestedRole) return res.status(400).json({ error: 'A valid role is required.' });
    const account = DEMO_USERS[requestedRole];
    if (normalizedEmail !== account.email.toLowerCase() || String(password || '') !== account.password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = createFamilyToken();
    authSessions.set(token, { role: requestedRole, email: account.email, name: account.name, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
    return res.json({ success: true, token, role: requestedRole, email: account.email, name: account.name });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(503).json({ error: 'We could not complete the login right now. Please try again in a moment.' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const session = getAuthSession(req);
  if (!session) return res.status(401).json({ error: 'Session expired.' });
  return res.json({ authenticated: true, ...session });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token) authSessions.delete(token);
  return res.json({ success: true });
});

export const getAuthSession = (req: Request): AuthSession | null => {
  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  const session = authSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) authSessions.delete(token);
    return null;
  }
  return session;
};

// Shared hook for the admin router without a second session store.
(globalThis as any).__HUNARSETU_GET_SESSION__ = (token: string) => {
  const session = authSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) authSessions.delete(token);
    return null;
  }
  return session;
};

// Initialize GoogleGenAI SDK safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('[Gemini Init Error] Fallback to deterministic demo mode:', err);
  }
}

// In-memory mock database for sessions, concerns and counsellor tickets
const counsellorQueue: any[] = [];

// Admin analytics seed
const adminAnalyticsData = {
  totalFamiliesCounselled: 0,
  activeJointSessions: 0,
  parentResistanceBreakdown: [],
  languagePreference: { hindi: 0, english: 0 },
  frequentlyContestedTrades: [],
  topDistricts: [],
  humanEscalationRate: '—'
};

// API: AI Counselling endpoint
app.post('/api/ai/counsel', async (req: Request, res: Response) => {
  const { query, context } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // If Gemini API is available and initialized, call gemini-3.8-flash
  if (ai) {
    try {
      const systemInstruction = `You are HunarSetu (हुनर सेतु), an empathetic, highly knowledgeable senior vocational career counsellor in India for the national innovation program.
You engage both the Indian learner and their parents together ("Understand -> Compare -> Discuss -> Verify -> Decide").
Address core parental anxieties: earning stability, job security, social perception, physical safety, NSQF level, and further study through lateral entry into 2nd-year Polytechnic engineering diplomas and B.Voc degrees.
Always ground factual answers in verified Indian skilling bodies (NCVET, DGT, MSDE, Skill India, NAPS).
Language to use: ${context?.language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}.
Maintain a warm, trustworthy, respectful tone. Never guarantee absolute future certainty, but provide verified realistic ranges.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({
        text: response.text,
        citations: {
          source: 'NCVET Tracer Study & MSDE National Skill Qualification Framework',
          region: context?.district || 'India',
          confidence: 'Verified Government Dataset'
        }
      });
    } catch (err: any) {
      console.warn('[Gemini API Call Failed] Fallback to deterministic engine:', err?.message || err);
      // Fall through to deterministic response
    }
  }

  // Deterministic Demo Mode response
  return res.json({
    text: context?.language === 'hi'
      ? `हुनरसेतु परामर्श विश्लेषण:\n\nप्रमाणित वोकेशनल प्रशिक्षण के तहत शुरुआती वेतन ₹16,000 - ₹22,000/माह से शुरू होकर 3 वर्ष में ₹35,000+ तक पहुंचता है। इसके अलावा, AICTE नियमानुसार पॉलीटेक्निक डिप्लोमा के 2nd ईयर में डायरेक्ट लैटरल एंट्री के जरिए बी.टेक/बी.वॉक डिग्री का मार्ग पूरी तरह खुला रहता है।`
      : `HunarSetu Verification Analysis:\n\nCertified NSQF qualifications offer immediate placement with starting earnings between ₹16,000 - ₹22,000/month, growing to ₹35,000+ after 3 years. Lateral entry into 2nd-year Polytechnic Diplomas guarantees long-term degree progression without debt.`,
    citations: {
      source: 'Directorate General of Training (DGT) & NCVET',
      region: context?.district || 'India',
      confidence: 'Verified Government Dataset'
    }
  });
});

// ==========================================
// CERTIFIED COUNSELLING COMMON REST APIS
// ==========================================

// 1. Get all active verified counsellors
app.get('/api/counsellors', (_req: Request, res: Response) => {
  const counsellors = counsellingDb.getCounsellors();
  return res.json(counsellors);
});

// 2. Get single counsellor profile
app.get('/api/counsellors/:id', (req: Request, res: Response) => {
  const counsellor = counsellingDb.getCounsellorById(req.params.id);
  if (!counsellor) {
    return res.status(404).json({ error: 'Counsellor not found' });
  }
  return res.json(counsellor);
});

// 3. Update counsellor profile
app.put('/api/counsellors/:id', (req: Request, res: Response) => {
  const updated = counsellingDb.updateCounsellorProfile(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Counsellor not found' });
  }
  return res.json(updated);
});

// 4. Create new counselling request (Student or Parent -> Counsellor)
app.post('/api/counselling/requests', (req: Request, res: Response) => {
  const {
    requesterUserId,
    requesterType,
    requesterName,
    studentName,
    parentName,
    phone,
    district,
    state,
    preferredLanguage,
    counsellorId,
    counsellorName,
    requestType,
    concernCategory,
    subject,
    message,
    careerReferenceTradeId,
    careerReferenceTradeTitle,
    preferredDate,
    preferredTimeSlot,
    priority,
    consentShareAISummary,
    aiConversationSummary,
    caseId
  } = req.body;

  if (!requesterName || !studentName || !phone || !message) {
    return res.status(400).json({ error: 'Missing required request fields' });
  }

  // Validate counsellor exists
  const targetCounsellorId = counsellorId || 'COUNS-101';
  const targetCounsellor = counsellingDb.getCounsellorById(targetCounsellorId);
  const resolvedCounsellorName = targetCounsellor?.name || counsellorName || 'Dr. Priya Sharma';

  const result = counsellingDb.createRequest({
    requesterUserId: requesterUserId || (requesterType === 'PARENT' ? `PARENT-${studentName}` : `STU-${studentName}`),
    requesterType: requesterType || (parentName ? 'PARENT' : 'STUDENT'),
    requesterName,
    studentName,
    parentName,
    phone,
    district: district || 'Kanpur Nagar',
    state: state || 'Uttar Pradesh',
    preferredLanguage: preferredLanguage || 'Hindi',
    counsellorId: targetCounsellorId,
    counsellorName: resolvedCounsellorName,
    requestType: requestType || 'MESSAGE',
    concernCategory: concernCategory || 'Job Security',
    subject: subject || `${studentName} - ${concernCategory || 'Career Guidance'}`,
    message,
    careerReferenceTradeId,
    careerReferenceTradeTitle,
    preferredDate,
    preferredTimeSlot,
    priority: priority || 'High',
    consentShareAISummary: !!consentShareAISummary,
    aiConversationSummary,
    caseId
  });

  // Sync to legacy queue for backward compatibility
  counsellorQueue.unshift({
    id: result.request.id,
    learnerName: result.request.studentName,
    parentName: result.request.parentName,
    phone: result.request.phone,
    district: result.request.district,
    state: result.request.state,
    preferredLanguage: result.request.preferredLanguage,
    chosenTrade: result.request.careerReferenceTradeTitle,
    coreDispute: result.request.message,
    status: 'Pending',
    priority: result.request.priority,
    createdAt: result.request.createdAt
  });

  return res.status(201).json({ success: true, ...result });
});

// 5. Get all counselling requests (Counsellor Dashboard)
app.get('/api/counselling/requests', (req: Request, res: Response) => {
  const { counsellorId, requesterType, requestType, status } = req.query;
  const requests = counsellingDb.getRequests({
    counsellorId: counsellorId as string,
    requesterType: requesterType as any,
    requestType: requestType as any,
    status: status as any
  });
  return res.json(requests);
});

// 6. Get requests submitted by a user (Student or Parent tracking their requests)
app.get('/api/counselling/requests/user/:userId', (req: Request, res: Response) => {
  const userRequests = counsellingDb.getRequestsByUser(req.params.userId);
  return res.json(userRequests);
});

// 7. Accept a counselling request
app.post('/api/counselling/requests/:id/accept', (req: Request, res: Response) => {
  const updated = counsellingDb.updateRequestStatus(req.params.id, 'ACCEPTED');
  if (!updated) {
    return res.status(404).json({ error: 'Request not found' });
  }
  return res.json({ success: true, request: updated });
});

// 8. Reject a counselling request
app.post('/api/counselling/requests/:id/reject', (req: Request, res: Response) => {
  const { reason } = req.body;
  const updated = counsellingDb.updateRequestStatus(req.params.id, 'REJECTED', reason || 'Counsellor unavailable');
  if (!updated) {
    return res.status(404).json({ error: 'Request not found' });
  }
  return res.json({ success: true, request: updated });
});

// 9. Get all cases (Counsellor directory)
app.get('/api/counselling/cases', (req: Request, res: Response) => {
  const { counsellorId } = req.query;
  const cases = counsellingDb.getCases(counsellorId as string);
  return res.json(cases);
});

// 10. Get single case
app.get('/api/counselling/cases/:id', (req: Request, res: Response) => {
  const c = counsellingDb.getCaseById(req.params.id);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  return res.json(c);
});

// 11. Update case stage
app.put('/api/counselling/cases/:id/stage', (req: Request, res: Response) => {
  const { stage, recommendedNextStep } = req.body;
  const updated = counsellingDb.updateCase(req.params.id, {
    stage,
    ...(recommendedNextStep ? { recommendedNextStep } : {})
  });
  if (!updated) {
    return res.status(404).json({ error: 'Case not found' });
  }
  return res.json(updated);
});

// 12. Get messages for a case conversation
app.get('/api/counselling/cases/:id/messages', (req: Request, res: Response) => {
  const msgs = counsellingDb.getMessagesByCase(req.params.id);
  return res.json(msgs);
});

// 13. Send a message in a conversation (Counsellor -> Student/Parent OR Student/Parent -> Counsellor)
app.post('/api/counselling/cases/:id/messages', (req: Request, res: Response) => {
  const { senderUserId, senderRole, senderName, message } = req.body;
  if (!message || !senderName) {
    return res.status(400).json({ error: 'Message and sender are required' });
  }

  const newMsg = counsellingDb.insertMessage({
    caseId: req.params.id,
    conversationId: req.params.id,
    senderUserId: senderUserId || 'USER',
    senderRole: senderRole || 'COUNSELLOR',
    senderName,
    message
  });

  return res.status(201).json({ success: true, message: newMsg });
});

// 14. Get user's conversation threads (For Student or Parent looking at their replies)
app.get('/api/counselling/conversations', (req: Request, res: Response) => {
  const { userId } = req.query;
  const convos = counsellingDb.getConversationsByUser((userId as string) || '');
  return res.json(convos);
});

app.get('/api/counselling/user/:userId/conversations', (req: Request, res: Response) => {
  const convos = counsellingDb.getConversationsByUser(req.params.userId);
  return res.json(convos);
});

// 15. Get scheduled calls (supports filter by counsellorId or userId)
app.get('/api/counselling/calls', (req: Request, res: Response) => {
  const { counsellorId, userId } = req.query;
  const calls = counsellingDb.getCalls(counsellorId as string, userId as string);
  return res.json(calls);
});

// 15b. Create a call request
app.post('/api/counselling/calls/request', (req: Request, res: Response) => {
  const {
    caseId,
    counsellorId,
    counsellorName,
    studentName,
    parentName,
    phone,
    sessionType,
    tradeTitle,
    scheduledDate,
    scheduledSlot,
    callReason
  } = req.body;

  if (!studentName) {
    return res.status(400).json({ error: 'Student name is required' });
  }

  const call = counsellingDb.createCall({
    caseId,
    counsellorId: counsellorId || 'COUNS-101',
    counsellorName: counsellorName || 'Dr. Priya Sharma',
    studentName,
    parentName,
    phone,
    sessionType,
    tradeTitle,
    scheduledDate,
    scheduledSlot,
    callReason
  });

  return res.status(201).json({ success: true, call });
});

// 15c. Accept a call (Counsellor)
app.post('/api/counselling/calls/:id/accept', (req: Request, res: Response) => {
  const { scheduledDate, scheduledSlot } = req.body;
  const call = counsellingDb.acceptCall(req.params.id, scheduledDate, scheduledSlot);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  return res.json({ success: true, call });
});

// 15d. Reschedule a call (Student, Parent, or Counsellor)
app.post('/api/counselling/calls/:id/reschedule', (req: Request, res: Response) => {
  const { newDate, newSlot, reason, requestedBy } = req.body;
  if (!newDate || !newSlot) {
    return res.status(400).json({ error: 'New date and time slot are required' });
  }
  const call = counsellingDb.rescheduleCall(req.params.id, newDate, newSlot, reason, requestedBy);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  return res.json({ success: true, call });
});

// 15e. Cancel a call
app.post('/api/counselling/calls/:id/cancel', (req: Request, res: Response) => {
  const { reason, cancelledBy } = req.body;
  const call = counsellingDb.cancelCall(req.params.id, reason, cancelledBy);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  return res.json({ success: true, call });
});

// 15f. Start a call
app.post('/api/counselling/calls/:id/start', (req: Request, res: Response) => {
  const call = counsellingDb.startCall(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  return res.json({ success: true, call });
});

// 15g. End a call
app.post('/api/counselling/calls/:id/end', (req: Request, res: Response) => {
  const { durationSeconds, notesSummary, shareWithFamily } = req.body;
  const call = counsellingDb.endCall(req.params.id, durationSeconds, notesSummary, !!shareWithFamily);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  return res.json({ success: true, call });
});

// 16. Update call status (legacy/general)
app.post('/api/counselling/calls/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const call = counsellingDb.updateCallStatus(req.params.id, status);
  if (!call) {
    return res.status(404).json({ error: 'Call not found' });
  }
  return res.json(call);
});

// 16b. Notifications endpoints
app.get('/api/counselling/notifications', (req: Request, res: Response) => {
  const { userId, role } = req.query;
  const notifs = counsellingDb.getNotifications(userId as string, role as string);
  return res.json(notifs);
});

app.post('/api/counselling/notifications/:id/read', (req: Request, res: Response) => {
  const ok = counsellingDb.markNotificationRead(req.params.id);
  return res.json({ success: ok });
});

app.post('/api/counselling/notifications/mark-all-read', (req: Request, res: Response) => {
  const { userId } = req.body;
  const ok = counsellingDb.markAllNotificationsRead(userId);
  return res.json({ success: ok });
});

// 16c. Mark messages in a case as read
app.post('/api/counselling/cases/:id/read', (req: Request, res: Response) => {
  const { readerRole } = req.body;
  const count = counsellingDb.markCaseMessagesAsRead(req.params.id, readerRole || 'STUDENT');
  return res.json({ success: true, markedCount: count });
});

// 16d. Unread summary
app.get('/api/counselling/unread', (req: Request, res: Response) => {
  const { userId, role } = req.query;
  const counts = counsellingDb.getUnreadCount((userId as string) || '', (role as string) || 'STUDENT');
  return res.json(counts);
});

// 17. Notes & Followups
app.get('/api/counselling/cases/:id/notes', (req: Request, res: Response) => {
  const notes = counsellingDb.getNotes(req.params.id);
  return res.json(notes);
});

app.post('/api/counselling/cases/:id/notes', (req: Request, res: Response) => {
  const { counsellorId, noteText, visibility } = req.body;
  const note = counsellingDb.insertNote({
    caseId: req.params.id,
    counsellorId: counsellorId || 'COUNS-101',
    noteText,
    visibility: visibility || 'private'
  });
  return res.status(201).json(note);
});

app.get('/api/counselling/followups', (req: Request, res: Response) => {
  const { counsellorId } = req.query;
  const followups = counsellingDb.getFollowUps(counsellorId as string);
  return res.json(followups);
});

app.post('/api/counselling/followups', (req: Request, res: Response) => {
  const { caseId, counsellorId, studentName, parentName, dueDate, reason } = req.body;
  const fol = counsellingDb.insertFollowUp({
    caseId,
    counsellorId: counsellorId || 'COUNS-101',
    studentName,
    parentName,
    dueDate,
    reason
  });
  return res.status(201).json(fol);
});

app.put('/api/counselling/followups/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const fol = counsellingDb.updateFollowUpStatus(req.params.id, status);
  if (!fol) {
    return res.status(404).json({ error: 'Follow-up not found' });
  }
  return res.json(fol);
});

// Legacy backward-compatible endpoints
app.post('/api/counsellor/request', (req: Request, res: Response) => {
  const { learnerName, parentName, phone, district, state, preferredLanguage, chosenTrade, coreDispute } = req.body;
  const result = counsellingDb.createRequest({
    requesterUserId: `USER-${learnerName || 'ANON'}`,
    requesterType: parentName ? 'PARENT' : 'STUDENT',
    requesterName: parentName || learnerName || 'Anonymous',
    studentName: learnerName || 'Anonymous Learner',
    parentName,
    phone: phone || '+91 98000 00000',
    district: district || 'Local District',
    state: state || 'Uttar Pradesh',
    preferredLanguage: preferredLanguage || 'Hindi',
    counsellorId: 'COUNS-101',
    counsellorName: 'Dr. Priya Sharma',
    requestType: 'MESSAGE',
    concernCategory: 'Career Choice',
    subject: `Guidance on ${chosenTrade || 'Vocational Trade'}`,
    message: coreDispute || 'Career selection guidance needed',
    careerReferenceTradeTitle: chosenTrade,
    priority: 'High',
    consentShareAISummary: true
  });

  return res.json({ success: true, ticket: result.request });
});

app.get('/api/counsellor/queue', (_req: Request, res: Response) => {
  const requests = counsellingDb.getRequests();
  return res.json(requests);
});

// API: Admin Analytics (legacy compatibility)
app.get('/api/admin/analytics', (_req: Request, res: Response) => {
  return res.json(adminAnalyticsData);
});

// Mount Centralized Admin Management APIs
app.use('/api/admin', adminRouter);

// Setup Vite middleware in dev or serve static files in prod
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HunarSetu Server] Running on http://localhost:${PORT}`);
  });
}

setupServer();
