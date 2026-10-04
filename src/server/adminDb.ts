import fs from 'fs';
import path from 'path';
import { NSQF_VOCATIONAL_TRADES } from '../data/nsqfTrades';
import { DISTRICT_CLUSTERS_DATA } from '../data/districtData';

// User Interface
export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'PARENT' | 'COUNSELLOR' | 'ADMIN';
  phone?: string;
  state: string;
  district: string;
  status: 'Active' | 'Suspended' | 'Pending Verification';
  registrationDate: string;
  lastActive: string;
  details?: {
    education?: string;
    interests?: string[];
    savedCareerIds?: string[];
    childName?: string;
    guardianRelation?: string;
    primaryConcern?: string;
    specialization?: string[];
    badgeId?: string;
  };
}

// Career Profile Interface
export interface AdminCareerProfile {
  id: string;
  title: string;
  titleHi: string;
  sector: string;
  sectorHi?: string;
  nsqfLevel: number;
  durationMonths: number;
  eligibility: string;
  eligibilityHi?: string;
  salary: {
    entryLevel: string;
    midLevel3Yr: string;
    senior5Yr: string;
    selfEmployedPotential?: string;
  };
  jobRoles: string[];
  keySkills: string[];
  degreeProgression: string;
  safetyNote: string;
  socialPerceptionRebuttal?: string;
  localDemandClusters: string[];
  dataSource: string;
  dataYear: number;
  sourceUrl?: string;
  evidenceType: 'Government Gazette' | 'NCVET Tracer Study' | 'Industry Council' | 'DGT Directory' | 'Prototype Data';
  status: 'Published' | 'Draft' | 'Archived' | 'Needs Review';
  createdAt: string;
  updatedAt: string;
}

// Skill Library Interface
export interface AdminSkillRecord {
  id: string;
  name: string;
  category: 'Technical' | 'Soft Skills' | 'Digital & Tech' | 'Safety' | 'Tool & Machine Operation';
  description: string;
  associatedCareerIds: string[];
  demandLevel: 'High' | 'Very High' | 'Moderate';
}

// Training Provider Interface
export interface AdminTrainingProvider {
  id: string;
  name: string;
  type: 'Govt ITI' | 'Private ITI' | 'NSTI' | 'PMKVY Center' | 'Polytechnic';
  state: string;
  district: string;
  address: string;
  trades: string[];
  contact: string;
  website?: string;
  source: string;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected' | 'Archived';
  accreditationId?: string;
}

// Local Opportunity Interface
export interface AdminLocalOpportunity {
  id: string;
  title: string;
  careerId: string;
  careerTitle: string;
  state: string;
  district: string;
  organization: string;
  stipendOrSalary?: string;
  eligibility: string;
  type: 'Apprenticeship (NAPS)' | 'Direct Job' | 'Skill Training Scheme' | 'Campus Drive';
  source: string;
  sourceDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Draft' | 'Archived';
}

// Knowledge Base / RAG Document Interface
export interface AdminKnowledgeSource {
  id: string;
  title: string;
  source: string;
  sourceType: 'Official Gazette' | 'NCVET Standard' | 'MSDE Report' | 'DGT Curriculum' | 'AICTE Regulation' | 'National Scheme';
  publicationYear: number;
  region: string;
  category: 'Careers' | 'Vocational Education' | 'ITI' | 'Apprenticeship' | 'Government Schemes' | 'Safety' | 'Education Pathways';
  summary: string;
  documentUrl?: string;
  verificationStatus: 'Verified' | 'Pending Review' | 'Rejected' | 'Archived';
  published: boolean;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Issue / Complaint Interface
export interface AdminIssueRecord {
  id: string;
  reporterName: string;
  reporterRole: 'STUDENT' | 'PARENT' | 'COUNSELLOR' | 'SYSTEM';
  reporterEmail?: string;
  category: 'Counsellor Issue' | 'Wrong Career Info' | 'Wrong Training Info' | 'Technical Problem' | 'Privacy Concern' | 'Harassment/Abuse' | 'Incorrect AI Response' | 'Other';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Under Review' | 'Resolved' | 'Rejected' | 'Escalated';
  subject: string;
  description: string;
  assignedAdmin?: string;
  internalNotes: string[];
  flaggedConversationId?: string;
  resolutionSummary?: string;
  createdAt: string;
  updatedAt: string;
}

// Audit Log Interface
export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  target: string;
  targetId: string;
  timestamp: string;
  reason: string;
  ipAddress?: string;
}

// Settings Interface
export interface AdminPlatformSettings {
  platformName: string;
  supportContact: string;
  defaultLanguage: 'hi' | 'en';
  sessionDurationMinutes: number;
  cancellationPolicy: string;
  aiEnabled: boolean;
  ragEnabled: boolean;
  humanEscalationRequired: boolean;
  noJobGuaranteeEnforced: boolean;
  noSalaryGuaranteeEnforced: boolean;
  uncertaintyWording: string;
  demoMode: boolean;
}

// Announcement Interface
export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  audience: 'ALL' | 'STUDENTS' | 'PARENTS' | 'COUNSELLORS';
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Scheduled' | 'Published' | 'Expired';
  createdAt: string;
}

export interface AdminDatabaseSchema {
  users: AdminUserRecord[];
  career_profiles: AdminCareerProfile[];
  career_skills: AdminSkillRecord[];
  training_providers: AdminTrainingProvider[];
  local_opportunities: AdminLocalOpportunity[];
  knowledge_sources: AdminKnowledgeSource[];
  admin_issues: AdminIssueRecord[];
  admin_audit_logs: AdminAuditLog[];
  admin_settings: AdminPlatformSettings;
  admin_announcements: AdminAnnouncement[];
}

const ADMIN_DB_FILE = path.resolve(process.cwd(), 'data', 'admin_db.json');

// Initial seed generators
function getInitialAdminData(): AdminDatabaseSchema {
  // Seed Users
  const users: AdminUserRecord[] = [
{
      id: 'USR-COUNS-101',
      name: 'Dr. Priya Sharma',
      email: 'counsellor@hunarsetu.gov.in',
      role: 'COUNSELLOR',
      phone: '+91 94150 12345',
      state: 'Uttar Pradesh',
      district: 'Kanpur Nagar',
      status: 'Active',
      registrationDate: '2026-01-15',
      lastActive: 'Just Now',
      details: {
        badgeId: 'NSDC-CERT-4891',
        specialization: ['Vocational Education (NSQF 4-7)', 'Parent-Student Conflict Mediation', 'Lateral B.Tech Pathways']
      }
    },
    {
      id: 'USR-COUNS-102',
      name: 'Er. Rajesh Kumar Maurya',
      email: 'rajesh.maurya@hunarsetu.gov.in',
      role: 'COUNSELLOR',
      phone: '+91 98390 67890',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      status: 'Active',
      registrationDate: '2026-03-02',
      lastActive: 'Today',
      details: {
        badgeId: 'DGT-MED-7712',
        specialization: ['Drone Assembly', 'Automotive CNC', 'Railway Technical Cadre']
      }
    },
    {
      id: 'USR-COUNS-103',
      name: 'Anjali Deshmukh',
      email: 'anjali.deshmukh@gmail.com',
      role: 'COUNSELLOR',
      phone: '+91 98230 45678',
      state: 'Maharashtra',
      district: 'Pune',
      status: 'Pending Verification',
      registrationDate: '2026-02-12',
      lastActive: '1 day ago',
      details: {
        badgeId: 'MSDE-PEND-3011',
        specialization: ['EV Powertrain Tech', 'Industrial Electronics']
      }
    },
    {
      id: 'USR-ADM-001',
      name: 'National Admin Desk',
      email: 'admin@hunarsetu.gov.in',
      role: 'ADMIN',
      phone: '+91 11 2345 6789',
      state: 'National',
      district: 'New Delhi',
      status: 'Active',
      registrationDate: '2026-01-01',
      lastActive: 'Just Now'
    }
  ];

  // Seed Careers from NSQF Trades
  const careers: AdminCareerProfile[] = NSQF_VOCATIONAL_TRADES.map(t => ({
    id: t.id,
    title: t.title,
    titleHi: t.titleHi,
    sector: t.sector,
    sectorHi: t.sectorHi,
    nsqfLevel: t.nsqfLevel,
    durationMonths: t.durationMonths,
    eligibility: t.eligibility,
    eligibilityHi: t.eligibilityHi,
    salary: t.salary,
    jobRoles: t.jobRoles,
    keySkills: t.keySkills,
    degreeProgression: t.degreeProgression,
    safetyNote: t.safetyNote,
    socialPerceptionRebuttal: t.socialPerceptionRebuttal,
    localDemandClusters: t.localDemandClusters,
    dataSource: t.dataSource,
    dataYear: t.dataYear,
    sourceUrl: 'https://ncvet.gov.in',
    evidenceType: 'NCVET Tracer Study',
    status: 'Published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-02-15T00:00:00.000Z'
  }));

  // Seed Skills
  const skills: AdminSkillRecord[] = [
    {
      id: 'SKILL-01',
      name: 'Solar Panel Mounting & Alignment',
      category: 'Technical',
      description: 'Mounting photovoltaic solar modules with secure wind-load brackets and azimuth angle calibration.',
      associatedCareerIds: ['solar-technician'],
      demandLevel: 'Very High'
    },
    {
      id: 'SKILL-02',
      name: 'Electrical Circuit Wiring & Earthing',
      category: 'Technical',
      description: 'Single and three-phase wiring, conduit bending, earth pit resistance testing, and MCB protection.',
      associatedCareerIds: ['solar-technician', 'electrician'],
      demandLevel: 'Very High'
    },
    {
      id: 'SKILL-03',
      name: 'Remote Drone Flight & GPS Navigation',
      category: 'Digital & Tech',
      description: 'DGCA compliant RPAS flying, telemetry monitoring, fail-safe RTL programming, and payload spray calibration.',
      associatedCareerIds: ['drone-technician'],
      demandLevel: 'High'
    },
    {
      id: 'SKILL-04',
      name: 'G-Code / M-Code CNC Programming',
      category: 'Tool & Machine Operation',
      description: 'Programming multi-axis CNC lathes and milling cutters with precise micrometer tolerances.',
      associatedCareerIds: ['cnc-machinist'],
      demandLevel: 'Very High'
    },
    {
      id: 'SKILL-05',
      name: 'TIG & MIG Shielded Arc Welding',
      category: 'Technical',
      description: 'Gas tungsten and metal inert gas welding on stainless steel and pressure vessels.',
      associatedCareerIds: ['welder-fabricator'],
      demandLevel: 'High'
    },
    {
      id: 'SKILL-06',
      name: 'High-Voltage Safety & PPE Compliance',
      category: 'Safety',
      description: 'Lockout-Tagout (LOTO) protocols, 10kV insulation safety, and emergency CPR protocols.',
      associatedCareerIds: ['solar-technician', 'electrician', 'ev-technician'],
      demandLevel: 'Very High'
    },
    {
      id: 'SKILL-07',
      name: 'Patient Vital Monitoring & First Aid',
      category: 'Technical',
      description: 'Taking blood pressure, pulse oximetry, sterile dressing, and patient emergency evacuation.',
      associatedCareerIds: ['healthcare-gda'],
      demandLevel: 'Very High'
    },
    {
      id: 'SKILL-08',
      name: 'Client Career Consultation & Mediation',
      category: 'Soft Skills',
      description: 'Active listening, empathy, conflict resolution between youth aspirations and parental anxieties.',
      associatedCareerIds: ['counsellor'],
      demandLevel: 'High'
    }
  ];

  // Seed Training Providers from District Clusters
  const providers: AdminTrainingProvider[] = [];
  DISTRICT_CLUSTERS_DATA.forEach((cluster, idx) => {
    cluster.trainingCenters.forEach((tc, tcIdx) => {
      providers.push({
        id: `PROV-${cluster.district.slice(0, 3).toUpperCase()}-${tcIdx + 1}`,
        name: tc.name,
        type: tc.type as any,
        state: cluster.state,
        district: cluster.district,
        address: `${tc.name}, ${cluster.district}, ${cluster.state}`,
        trades: tc.trades,
        contact: tc.contact,
        source: 'DGT State ITI Portal & MSDE National Portal',
        verificationStatus: 'Verified',
        accreditationId: `DGT-ACC-${1000 + idx * 10 + tcIdx}`
      });
    });
  });

  // Seed Local Opportunities
  const opportunities: AdminLocalOpportunity[] = [
    {
      id: 'OPP-101',
      title: 'Solar Rooftop Apprentice (PM Surya Ghar Scheme)',
      careerId: 'solar-technician',
      careerTitle: 'Solar PV System Installation & Maintenance Technician',
      state: 'Uttar Pradesh',
      district: 'Kanpur Nagar',
      organization: 'Tata Power Solar Rooftop EPC Partner',
      stipendOrSalary: '₹12,500/month stipend + NAPS Govt DBT',
      eligibility: 'Class 10th or ITI Passed (Electrical/Solar)',
      type: 'Apprenticeship (NAPS)',
      source: 'National Apprenticeship Promotion Scheme (NAPS)',
      sourceDate: '2026-01-15',
      expiryDate: '2026-06-30',
      status: 'Active'
    },
    {
      id: 'OPP-102',
      title: 'Agricultural Kisan Drone Pilot Associate',
      careerId: 'drone-technician',
      careerTitle: 'Drone Manufacturing & Remote Pilot Technician',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      organization: 'Purvanchal Agro-Drone FPO Services',
      stipendOrSalary: '₹18,000 - ₹24,000/month',
      eligibility: 'Class 10th with Basic Computer Knowledge',
      type: 'Direct Job',
      source: 'Ministry of Civil Aviation / Sub-Mission on Agri Mechanization',
      sourceDate: '2026-02-01',
      expiryDate: '2026-08-31',
      status: 'Active'
    },
    {
      id: 'OPP-103',
      title: 'CNC Machine Operator Trainee',
      careerId: 'cnc-machinist',
      careerTitle: 'CNC Machinist & Precision Tooling Operator',
      state: 'Uttar Pradesh',
      district: 'Kanpur Nagar',
      organization: 'Lohia Corp Machinery',
      stipendOrSalary: '₹14,000/month during 6-mo OJT',
      eligibility: 'Class 10th with ITI Machinist/Fitter',
      type: 'Skill Training Scheme',
      source: 'Capital Goods Skill Council (CGSC)',
      sourceDate: '2026-01-20',
      expiryDate: '2026-07-15',
      status: 'Active'
    },
    {
      id: 'OPP-104',
      title: 'Hospital Patient Care GDA Trainee',
      careerId: 'healthcare-gda',
      careerTitle: 'General Duty Healthcare Assistant (GDA)',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      organization: 'Apex Super-speciality Hospital & Research Center',
      stipendOrSalary: '₹11,000/month + Uniform & Meals',
      eligibility: 'Class 10th Passed',
      type: 'Apprenticeship (NAPS)',
      source: 'Healthcare Sector Skill Council (HSSC)',
      sourceDate: '2026-02-10',
      expiryDate: '2026-09-30',
      status: 'Active'
    }
  ];

  // Seed Knowledge Base / RAG Sources
  const knowledgeSources: AdminKnowledgeSource[] = [
    {
      id: 'KB-101',
      title: 'NCVET National Credit Framework (NCrF) Credit Accumulation Rules',
      source: 'National Council for Vocational Education and Training (NCVET)',
      sourceType: 'Official Gazette',
      publicationYear: 2026,
      region: 'India (National)',
      category: 'Vocational Education',
      summary: 'Governs horizontal and vertical mobility between ITI certificates and higher academic education under NEP 2020.',
      documentUrl: 'https://ncvet.gov.in/ncrf-guidelines',
      verificationStatus: 'Verified',
      published: true,
      uploadedBy: 'admin@hunarsetu.gov.in',
      createdAt: '2026-01-05T10:00:00.000Z',
      updatedAt: '2026-01-05T10:00:00.000Z'
    },
    {
      id: 'KB-102',
      title: 'AICTE Lateral Entry Norms: 2-Year ITI / Diploma to 2nd Year B.Tech',
      source: 'All India Council for Technical Education (AICTE)',
      sourceType: 'AICTE Regulation',
      publicationYear: 2026,
      region: 'India (National)',
      category: 'Education Pathways',
      summary: 'Allows direct lateral admission into the second year of engineering (B.Tech/B.E.) for accredited vocational diploma holders.',
      documentUrl: 'https://aicte-india.org/approval-process-handbook',
      verificationStatus: 'Verified',
      published: true,
      uploadedBy: 'admin@hunarsetu.gov.in',
      createdAt: '2026-01-08T11:30:00.000Z',
      updatedAt: '2026-01-08T11:30:00.000Z'
    },
    {
      id: 'KB-103',
      title: 'PM Surya Ghar Muft Bijli Yojana: Skilling Guidelines for Suryamitras',
      source: 'Ministry of New and Renewable Energy (MNRE)',
      sourceType: 'National Scheme',
      publicationYear: 2026,
      region: 'India (National)',
      category: 'Government Schemes',
      summary: 'Outlines target of 1 crore rooftop installations and mandate to certify 3 lakh solar technicians with subsidized training.',
      documentUrl: 'https://pmsuryaghar.gov.in/guidelines',
      verificationStatus: 'Verified',
      published: true,
      uploadedBy: 'admin@hunarsetu.gov.in',
      createdAt: '2026-01-12T09:00:00.000Z',
      updatedAt: '2026-01-12T09:00:00.000Z'
    },
    {
      id: 'KB-104',
      title: 'DGCA Remote Pilot Certification & Drone Operations Handbook',
      source: 'Directorate General of Civil Aviation (DGCA)',
      sourceType: 'Official Gazette',
      publicationYear: 2026,
      region: 'India (National)',
      category: 'Safety',
      summary: 'Standard operating procedure for agricultural drone operations, Remote Pilot Certificate (RPC) issuance, and safety corridors.',
      documentUrl: 'https://dgca.gov.in/drone-regulations',
      verificationStatus: 'Verified',
      published: true,
      uploadedBy: 'admin@hunarsetu.gov.in',
      createdAt: '2026-01-15T14:00:00.000Z',
      updatedAt: '2026-01-15T14:00:00.000Z'
    },
    {
      id: 'KB-105',
      title: 'DGT Craftsmen Training Scheme (CTS) Annual Wage & Placement Survey',
      source: 'Directorate General of Training (DGT), MSDE',
      sourceType: 'MSDE Report',
      publicationYear: 2026,
      region: 'Uttar Pradesh, Maharashtra, Gujarat',
      category: 'Careers',
      summary: 'Empirical starting salaries across 10 engineering trades with 1-year and 3-year post-completion wage growth benchmarks.',
      documentUrl: 'https://dgt.gov.in/annual-tracer-report',
      verificationStatus: 'Verified',
      published: true,
      uploadedBy: 'admin@hunarsetu.gov.in',
      createdAt: '2026-01-20T16:00:00.000Z',
      updatedAt: '2026-01-20T16:00:00.000Z'
    }
  ];

  // Seed Issues & Complaints
  const issues: AdminIssueRecord[] = [];

  // Seed Audit Logs
  const auditLogs: AdminAuditLog[] = [];

  // Seed Settings
  const settings: AdminPlatformSettings = {
    platformName: 'HunarSetu (हुनर सेतु) - Career Guidance Platform',
    supportContact: 'support@hunarsetu.gov.in | Toll-Free 1800-120-SKILL',
    defaultLanguage: 'hi',
    sessionDurationMinutes: 30,
    cancellationPolicy: 'Cancellations must be requested at least 2 hours prior to scheduled session.',
    aiEnabled: true,
    ragEnabled: true,
    humanEscalationRequired: true,
    noJobGuaranteeEnforced: true,
    noSalaryGuaranteeEnforced: true,
    uncertaintyWording: 'I do not have enough verified government data to state this with absolute certainty. Let us consult a certified human counsellor.',
    demoMode: false
  };

  // Seed Announcements
  const announcements: AdminAnnouncement[] = [];

  return {
    users,
    career_profiles: careers,
    career_skills: skills,
    training_providers: providers,
    local_opportunities: opportunities,
    knowledge_sources: knowledgeSources,
    admin_issues: issues,
    admin_audit_logs: auditLogs,
    admin_settings: settings,
    admin_announcements: announcements
  };
}

class AdminDatabase {
  private data: AdminDatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): AdminDatabaseSchema {
    try {
      if (fs.existsSync(ADMIN_DB_FILE)) {
        const raw = fs.readFileSync(ADMIN_DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Verify key properties exist
        if (parsed.users && parsed.career_profiles && parsed.knowledge_sources) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[AdminDb] Could not read admin_db.json, re-seeding:', err);
    }

    const initial = getInitialAdminData();
    this.saveToDisk(initial);
    return initial;
  }

  private saveToDisk(data: AdminDatabaseSchema) {
    try {
      const dir = path.dirname(ADMIN_DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(ADMIN_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[AdminDb] Failed to write admin_db.json:', err);
    }
  }

  public commit() {
    this.saveToDisk(this.data);
  }

  // --- AUDIT LOGGING ---
  public logAudit(adminEmail: string, action: string, target: string, targetId: string, reason: string, ipAddress?: string): AdminAuditLog {
    const log: AdminAuditLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminEmail: adminEmail || 'admin@hunarsetu.gov.in',
      action,
      target,
      targetId,
      timestamp: new Date().toISOString(),
      reason,
      ipAddress: ipAddress || '127.0.0.1'
    };
    if (!this.data.admin_audit_logs) this.data.admin_audit_logs = [];
    this.data.admin_audit_logs.unshift(log);
    this.commit();
    return log;
  }

  public getAuditLogs(limit = 100): AdminAuditLog[] {
    return (this.data.admin_audit_logs || []).slice(0, limit);
  }

  // --- USERS MANAGEMENT ---
  public getUsers(filters?: { role?: string; status?: string; search?: string; state?: string; district?: string }): AdminUserRecord[] {
    let list = this.data.users || [];
    if (filters?.role && filters.role !== 'ALL') {
      list = list.filter(u => u.role === filters.role?.toUpperCase());
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(u => u.status === filters.status);
    }
    if (filters?.state && filters.state !== 'ALL') {
      list = list.filter(u => u.state.toLowerCase() === filters.state?.toLowerCase());
    }
    if (filters?.district && filters.district !== 'ALL') {
      list = list.filter(u => u.district.toLowerCase() === filters.district?.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.district.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getUserById(id: string): AdminUserRecord | undefined {
    return (this.data.users || []).find(u => u.id === id);
  }

  public updateUserStatus(id: string, status: AdminUserRecord['status'], adminEmail: string, reason: string): AdminUserRecord | null {
    const user = this.getUserById(id);
    if (!user) return null;
    user.status = status;
    this.logAudit(adminEmail, `USER_STATUS_${status.toUpperCase().replace(/\s+/g, '_')}`, 'User', id, reason);
    this.commit();
    return user;
  }

  public updateUserProfile(id: string, updates: Partial<AdminUserRecord>, adminEmail: string, reason: string): AdminUserRecord | null {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    this.logAudit(adminEmail, 'USER_PROFILE_UPDATED', 'User', id, reason);
    this.commit();
    return user;
  }

  // --- CAREER PROFILES ---
  public getCareers(filters?: { sector?: string; status?: string; search?: string }): AdminCareerProfile[] {
    let list = this.data.career_profiles || [];
    if (filters?.sector && filters.sector !== 'ALL') {
      list = list.filter(c => c.sector.toLowerCase().includes(filters.sector!.toLowerCase()));
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.titleHi.includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getCareerById(id: string): AdminCareerProfile | undefined {
    return (this.data.career_profiles || []).find(c => c.id === id);
  }

  public saveCareer(careerData: Partial<AdminCareerProfile>, adminEmail: string, reason: string): AdminCareerProfile {
    const existingIndex = (this.data.career_profiles || []).findIndex(c => c.id === careerData.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated = {
        ...this.data.career_profiles[existingIndex],
        ...careerData,
        updatedAt: now
      };
      this.data.career_profiles[existingIndex] = updated;
      this.logAudit(adminEmail, 'CAREER_UPDATED', 'CareerProfile', updated.id, reason);
      this.commit();
      return updated;
    } else {
      const newCareer: AdminCareerProfile = {
        id: careerData.id || `career-${Date.now()}`,
        title: careerData.title || 'Untitled Trade',
        titleHi: careerData.titleHi || 'नया ट्रेड',
        sector: careerData.sector || 'Technical Trades',
        nsqfLevel: careerData.nsqfLevel || 4,
        durationMonths: careerData.durationMonths || 12,
        eligibility: careerData.eligibility || 'Class 10th Passed',
        salary: careerData.salary || {
          entryLevel: '₹15,000 - ₹20,000 / month',
          midLevel3Yr: '₹25,000 - ₹35,000 / month',
          senior5Yr: '₹45,000 - ₹60,000 / month'
        },
        jobRoles: careerData.jobRoles || ['Technician'],
        keySkills: careerData.keySkills || ['Hands-on Operation'],
        degreeProgression: careerData.degreeProgression || 'Eligible for Diploma lateral entry -> B.Tech.',
        safetyNote: careerData.safetyNote || 'Mandatory standard safety training.',
        localDemandClusters: careerData.localDemandClusters || ['Kanpur Nagar', 'Varanasi'],
        dataSource: careerData.dataSource || 'National Skill Development Agency & NCVET',
        dataYear: careerData.dataYear || 2026,
        sourceUrl: careerData.sourceUrl || 'https://ncvet.gov.in',
        evidenceType: careerData.evidenceType || 'Government Gazette',
        status: careerData.status || 'Published',
        createdAt: now,
        updatedAt: now
      };
      this.data.career_profiles.unshift(newCareer);
      this.logAudit(adminEmail, 'CAREER_CREATED', 'CareerProfile', newCareer.id, reason);
      this.commit();
      return newCareer;
    }
  }

  public updateCareerStatus(id: string, status: AdminCareerProfile['status'], adminEmail: string, reason: string): AdminCareerProfile | null {
    const career = this.getCareerById(id);
    if (!career) return null;
    career.status = status;
    career.updatedAt = new Date().toISOString();
    this.logAudit(adminEmail, `CAREER_STATUS_${status.toUpperCase()}`, 'CareerProfile', id, reason);
    this.commit();
    return career;
  }

  // --- SKILLS LIBRARY ---
  public getSkills(): AdminSkillRecord[] {
    return this.data.career_skills || [];
  }

  public saveSkill(skill: Partial<AdminSkillRecord>, adminEmail: string, reason: string): AdminSkillRecord {
    const existingIdx = (this.data.career_skills || []).findIndex(s => s.id === skill.id);
    if (existingIdx >= 0) {
      const updated = { ...this.data.career_skills[existingIdx], ...skill };
      this.data.career_skills[existingIdx] = updated;
      this.logAudit(adminEmail, 'SKILL_UPDATED', 'Skill', updated.id, reason);
      this.commit();
      return updated;
    } else {
      const newSkill: AdminSkillRecord = {
        id: skill.id || `SKILL-${Date.now()}`,
        name: skill.name || 'New Skill',
        category: skill.category || 'Technical',
        description: skill.description || '',
        associatedCareerIds: skill.associatedCareerIds || [],
        demandLevel: skill.demandLevel || 'High'
      };
      this.data.career_skills.unshift(newSkill);
      this.logAudit(adminEmail, 'SKILL_CREATED', 'Skill', newSkill.id, reason);
      this.commit();
      return newSkill;
    }
  }

  // --- TRAINING PROVIDERS ---
  public getTrainingProviders(district?: string): AdminTrainingProvider[] {
    let list = this.data.training_providers || [];
    if (district && district !== 'ALL') {
      list = list.filter(p => p.district.toLowerCase() === district.toLowerCase());
    }
    return list;
  }

  public saveTrainingProvider(provider: Partial<AdminTrainingProvider>, adminEmail: string, reason: string): AdminTrainingProvider {
    const existingIdx = (this.data.training_providers || []).findIndex(p => p.id === provider.id);
    if (existingIdx >= 0) {
      const updated = { ...this.data.training_providers[existingIdx], ...provider };
      this.data.training_providers[existingIdx] = updated;
      this.logAudit(adminEmail, 'TRAINING_PROVIDER_UPDATED', 'TrainingProvider', updated.id, reason);
      this.commit();
      return updated;
    } else {
      const newP: AdminTrainingProvider = {
        id: provider.id || `PROV-${Date.now()}`,
        name: provider.name || 'New Training Center',
        type: provider.type || 'Govt ITI',
        state: provider.state || 'Uttar Pradesh',
        district: provider.district || 'Kanpur Nagar',
        address: provider.address || '',
        trades: provider.trades || [],
        contact: provider.contact || '',
        source: provider.source || 'State DGT ITI Directory',
        verificationStatus: provider.verificationStatus || 'Verified'
      };
      this.data.training_providers.unshift(newP);
      this.logAudit(adminEmail, 'TRAINING_PROVIDER_CREATED', 'TrainingProvider', newP.id, reason);
      this.commit();
      return newP;
    }
  }

  // --- LOCAL OPPORTUNITIES ---
  public getOpportunities(district?: string): AdminLocalOpportunity[] {
    let list = this.data.local_opportunities || [];
    if (district && district !== 'ALL') {
      list = list.filter(o => o.district.toLowerCase() === district.toLowerCase());
    }
    return list;
  }

  public saveOpportunity(opp: Partial<AdminLocalOpportunity>, adminEmail: string, reason: string): AdminLocalOpportunity {
    const existingIdx = (this.data.local_opportunities || []).findIndex(o => o.id === opp.id);
    if (existingIdx >= 0) {
      const updated = { ...this.data.local_opportunities[existingIdx], ...opp };
      this.data.local_opportunities[existingIdx] = updated;
      this.logAudit(adminEmail, 'OPPORTUNITY_UPDATED', 'LocalOpportunity', updated.id, reason);
      this.commit();
      return updated;
    } else {
      const newOpp: AdminLocalOpportunity = {
        id: opp.id || `OPP-${Date.now()}`,
        title: opp.title || 'New Apprenticeship / Job Drive',
        careerId: opp.careerId || 'solar-technician',
        careerTitle: opp.careerTitle || 'Vocational Trade',
        state: opp.state || 'Uttar Pradesh',
        district: opp.district || 'Kanpur Nagar',
        organization: opp.organization || 'Local Partner Enterprise',
        eligibility: opp.eligibility || 'Class 10th Passed',
        type: opp.type || 'Apprenticeship (NAPS)',
        source: opp.source || 'NAPS Portal',
        sourceDate: new Date().toISOString().split('T')[0],
        expiryDate: opp.expiryDate || '2026-12-31',
        status: opp.status || 'Active'
      };
      this.data.local_opportunities.unshift(newOpp);
      this.logAudit(adminEmail, 'OPPORTUNITY_CREATED', 'LocalOpportunity', newOpp.id, reason);
      this.commit();
      return newOpp;
    }
  }

  // --- KNOWLEDGE BASE / RAG ---
  public getKnowledgeSources(category?: string, verificationStatus?: string): AdminKnowledgeSource[] {
    let list = this.data.knowledge_sources || [];
    if (category && category !== 'ALL') {
      list = list.filter(k => k.category === category);
    }
    if (verificationStatus && verificationStatus !== 'ALL') {
      list = list.filter(k => k.verificationStatus === verificationStatus);
    }
    return list;
  }

  public saveKnowledgeSource(source: Partial<AdminKnowledgeSource>, adminEmail: string, reason: string): AdminKnowledgeSource {
    const existingIdx = (this.data.knowledge_sources || []).findIndex(k => k.id === source.id);
    const now = new Date().toISOString();

    if (existingIdx >= 0) {
      const updated = { ...this.data.knowledge_sources[existingIdx], ...source, updatedAt: now };
      this.data.knowledge_sources[existingIdx] = updated;
      this.logAudit(adminEmail, 'KNOWLEDGE_SOURCE_UPDATED', 'KnowledgeSource', updated.id, reason);
      this.commit();
      return updated;
    } else {
      const newSource: AdminKnowledgeSource = {
        id: source.id || `KB-${Date.now()}`,
        title: source.title || 'Untitled Document',
        source: source.source || 'Official Government Gazette',
        sourceType: source.sourceType || 'Official Gazette',
        publicationYear: source.publicationYear || 2026,
        region: source.region || 'India (National)',
        category: source.category || 'Vocational Education',
        summary: source.summary || '',
        documentUrl: source.documentUrl,
        verificationStatus: source.verificationStatus || 'Verified',
        published: source.published !== undefined ? source.published : true,
        uploadedBy: adminEmail || 'admin@hunarsetu.gov.in',
        createdAt: now,
        updatedAt: now
      };
      this.data.knowledge_sources.unshift(newSource);
      this.logAudit(adminEmail, 'KNOWLEDGE_SOURCE_CREATED', 'KnowledgeSource', newSource.id, reason);
      this.commit();
      return newSource;
    }
  }

  public updateKnowledgeStatus(id: string, status: AdminKnowledgeSource['verificationStatus'], published: boolean, adminEmail: string, reason: string): AdminKnowledgeSource | null {
    const src = (this.data.knowledge_sources || []).find(k => k.id === id);
    if (!src) return null;
    src.verificationStatus = status;
    src.published = published;
    src.updatedAt = new Date().toISOString();
    this.logAudit(adminEmail, `KNOWLEDGE_STATUS_${status.toUpperCase()}`, 'KnowledgeSource', id, reason);
    this.commit();
    return src;
  }

  // --- ISSUES & COMPLAINTS ---
  public getIssues(status?: string, category?: string): AdminIssueRecord[] {
    let list = this.data.admin_issues || [];
    if (status && status !== 'ALL') {
      list = list.filter(i => i.status === status);
    }
    if (category && category !== 'ALL') {
      list = list.filter(i => i.category === category);
    }
    return list;
  }

  public createIssue(issue: Omit<AdminIssueRecord, 'id' | 'createdAt' | 'updatedAt' | 'internalNotes'>): AdminIssueRecord {
    const newIssue: AdminIssueRecord = {
      ...issue,
      id: `ISSUE-${Date.now()}`,
      internalNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!this.data.admin_issues) this.data.admin_issues = [];
    this.data.admin_issues.unshift(newIssue);
    this.commit();
    return newIssue;
  }

  public updateIssue(id: string, updates: Partial<AdminIssueRecord>, adminEmail: string, reason: string): AdminIssueRecord | null {
    const issue = (this.data.admin_issues || []).find(i => i.id === id);
    if (!issue) return null;
    Object.assign(issue, updates);
    issue.updatedAt = new Date().toISOString();
    this.logAudit(adminEmail, 'ISSUE_UPDATED', 'Issue', id, reason);
    this.commit();
    return issue;
  }

  public addIssueNote(id: string, noteText: string, adminEmail: string): boolean {
    const issue = (this.data.admin_issues || []).find(i => i.id === id);
    if (!issue) return false;
    if (!issue.internalNotes) issue.internalNotes = [];
    issue.internalNotes.push(`[${new Date().toLocaleTimeString()} by ${adminEmail}]: ${noteText}`);
    issue.updatedAt = new Date().toISOString();
    this.logAudit(adminEmail, 'ISSUE_NOTE_ADDED', 'Issue', id, 'Added internal administrator resolution note');
    this.commit();
    return true;
  }

  // --- SETTINGS ---
  public getSettings(): AdminPlatformSettings {
    return this.data.admin_settings;
  }

  public updateSettings(updates: Partial<AdminPlatformSettings>, adminEmail: string, reason: string): AdminPlatformSettings {
    Object.assign(this.data.admin_settings, updates);
    this.logAudit(adminEmail, 'SETTINGS_UPDATED', 'PlatformSettings', 'GLOBAL', reason);
    this.commit();
    return this.data.admin_settings;
  }

  // --- ANNOUNCEMENTS ---
  public getAnnouncements(): AdminAnnouncement[] {
    return this.data.admin_announcements || [];
  }

  public saveAnnouncement(ann: Partial<AdminAnnouncement>, adminEmail: string, reason: string): AdminAnnouncement {
    const existingIdx = (this.data.admin_announcements || []).findIndex(a => a.id === ann.id);
    if (existingIdx >= 0) {
      const updated = { ...this.data.admin_announcements[existingIdx], ...ann };
      this.data.admin_announcements[existingIdx] = updated;
      this.logAudit(adminEmail, 'ANNOUNCEMENT_UPDATED', 'Announcement', updated.id, reason);
      this.commit();
      return updated;
    } else {
      const newA: AdminAnnouncement = {
        id: `ANN-${Date.now()}`,
        title: ann.title || 'New Announcement',
        message: ann.message || '',
        audience: ann.audience || 'ALL',
        startDate: ann.startDate || new Date().toISOString().split('T')[0],
        endDate: ann.endDate || '2026-12-31',
        status: ann.status || 'Published',
        createdAt: new Date().toISOString()
      };
      if (!this.data.admin_announcements) this.data.admin_announcements = [];
      this.data.admin_announcements.unshift(newA);
      this.logAudit(adminEmail, 'ANNOUNCEMENT_CREATED', 'Announcement', newA.id, reason);
      this.commit();
      return newA;
    }
  }
}

export const adminDb = new AdminDatabase();
