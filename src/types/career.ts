export type NSQFLevel = 3 | 4 | 5 | 6 | 7;

export interface SalaryProgression {
  entryLevel: string; // e.g., "₹14,000 - ₹18,000 / month"
  midLevel3Yr: string; // e.g., "₹25,000 - ₹35,000 / month"
  senior5Yr: string; // e.g., "₹45,000 - ₹65,000+ / month"
  selfEmployedPotential: string; // e.g., "₹40,000 - ₹80,000 / month (Govt Electrical Contractor)"
}

export interface CareerRoadmapStep {
  stepNumber: number;
  stageName: string;
  stageNameHi: string;
  nsqfLevel: string;
  duration: string;
  institution: string;
  keyOutcomes: string;
}

export interface VocationalTrade {
  id: string;
  title: string;
  titleHi: string;
  sector: string;
  sectorHi: string;
  nsqfLevel: NSQFLevel;
  durationMonths: number;
  eligibility: string;
  eligibilityHi: string;
  shortDescription: string;
  shortDescriptionHi: string;
  tagline: string;
  taglineHi: string;
  jobRoles: string[];
  jobRolesHi: string[];
  salary: SalaryProgression;
  placementRate: number; // percentage
  apprenticeshipAvailable: boolean;
  degreeProgression: string; // e.g. "Lateral entry to 2nd year Polytechnic Diploma -> B.Voc / B.Tech"
  degreeProgressionHi: string;
  safetyIndex: 'High' | 'Moderate' | 'Very Safe';
  safetyNote: string;
  safetyNoteHi: string;
  socialPerceptionRebuttal: string;
  socialPerceptionRebuttalHi: string;
  localDemandClusters: string[];
  keySkills: string[];
  dataSource: string;
  dataYear: number;
  iconName: string;
}

export interface ParentConcernItem {
  id: string;
  concernKey: 'income' | 'job_security' | 'social_status' | 'safety' | 'further_study' | 'relocation';
  question: string;
  questionHi: string;
  shortSummary: string;
  shortSummaryHi: string;
  evidencePoints: string[];
  evidencePointsHi: string[];
  reassurance: string;
  reassuranceHi: string;
  governmentSafetyNets: string[];
  governmentSafetyNetsHi: string[];
  sourceAttribution: string;
}

export interface DistrictCluster {
  state: string;
  district: string;
  districtHi: string;
  keyIndustries: string[];
  topDemandedTrades: string[];
  governmentITIs: number;
  privateITIs: number;
  activeApprenticeships: number;
  notableEmployers: string[];
  trainingCenters: {
    name: string;
    type: 'Govt ITI' | 'NSTI' | 'PMKVY Center' | 'Industry Partner Center';
    trades: string[];
    contact: string;
  }[];
}

export interface LearnerProfile {
  name: string;
  age: number;
  gender: string;
  state: string;
  district: string;
  localityType: 'Rural' | 'Semi-Urban' | 'Urban';
  educationLevel: 'Below 10th' | 'Class 10th Passed' | 'Class 12th (Arts/Comm)' | 'Class 12th (Science)' | 'College Dropout';
  interests: string[];
  preferredWorkStyle: 'Hands-on Machines' | 'Digital & Tech' | 'Outdoor & Travel' | 'People & Service' | 'Design & Creative';
  willingToRelocate: boolean;
  priority: 'Immediate Job' | 'High Earning Potential' | 'Government Sector' | 'Self Employment / Shop';
  selectedTradeId?: string;
}

export interface ParentProfile {
  guardianRelation: 'Father' | 'Mother' | 'Guardian' | 'Elder Sibling';
  guardianName: string;
  primaryConcern: 'income' | 'job_security' | 'social_status' | 'safety' | 'further_study' | 'relocation';
  concernSeverity: 'Mild' | 'Moderate' | 'Critical / Unconvinced';
  aspiredCareerForChild: string; // e.g. "Govt Clerk / Police / General BA"
  willingToSupportTrainingCost: boolean;
  maxTrainingMonthsAcceptable: number;
  specificDoubt: string;
}

export interface CounsellorTicket {
  id: string;
  learnerName: string;
  parentName: string;
  phone: string;
  district: string;
  state: string;
  preferredLanguage: 'Hindi' | 'English';
  chosenTrade: string;
  coreDispute: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
  priority: 'High' | 'Medium';
}

export interface MatchScoreBreakdown {
  tradeId: string;
  overallScore: number; // 0 - 100
  interestFit: number;
  eligibilityFit: number;
  districtFit: number;
  incomeFit: number;
  growthFit: number;
  explanation: string;
  explanationHi: string;
}
