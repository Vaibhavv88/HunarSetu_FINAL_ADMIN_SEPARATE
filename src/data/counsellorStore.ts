import {
  CounsellorProfile,
  CounsellingRequest,
  CounsellingCase,
  CounsellingMessage,
  CounsellingFollowUp,
  CounsellingSessionRecord
} from '../types/counsellor';

export const DEMO_COUNSELLOR_PRIYA: CounsellorProfile = {
  id: 'COUNS-101',
  name: 'Dr. Priya Sharma',
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
  areasOfExpertise: ['Renewable Energy', 'Automotive & EV', 'Electronics & Mechatronics'],
  state: 'Uttar Pradesh',
  district: 'Kanpur Nagar',
  phone: '+91 94150 12345',
  email: 'counsellor@hunarsetu.gov.in',
  bio: 'Certified Career Counsellor with 7+ years guiding students and families across Uttar Pradesh into high-demand technical vocations, apprenticeships, and NEP degree pathways.',
  bioHi: 'प्रमाणित व्यावसायिक करियर काउंसलर (7+ वर्ष अनुभव)। उत्तर प्रदेश के छात्रों और परिवारों को उच्च-मांग वाले तकनीकी ट्रेड्स, सवेतन अप्रेंटिसशिप और बी.टेक डिग्री सीढ़ी में मार्गदर्शन।',
  verificationStatus: 'Verified',
  verificationDate: '15 Jan 2026',
  isDemoCounsellor: false,
  onboardingCompleted: true,
  availability: [
    { day: 'Monday', startTime: '10:00 AM', endTime: '06:00 PM', slotDurationMinutes: 30 },
    { day: 'Tuesday', startTime: '10:00 AM', endTime: '06:00 PM', slotDurationMinutes: 30 },
    { day: 'Wednesday', startTime: '10:00 AM', endTime: '06:00 PM', slotDurationMinutes: 30 },
    { day: 'Thursday', startTime: '10:00 AM', endTime: '06:00 PM', slotDurationMinutes: 30 },
    { day: 'Friday', startTime: '10:00 AM', endTime: '06:00 PM', slotDurationMinutes: 30 },
    { day: 'Saturday', startTime: '10:00 AM', endTime: '02:00 PM', slotDurationMinutes: 30 }
  ],
  maxDailySessions: 8
};

export const INITIAL_COUNSELLING_REQUESTS: CounsellingRequest[] = [];

export const INITIAL_COUNSELLING_CASES: CounsellingCase[] = [];

export const INITIAL_MESSAGES: { [caseId: string]: CounsellingMessage[] } = {};
