export interface StudentProfile {
  name: string;
  education: 'Class 10' | 'Class 12' | 'ITI' | 'Diploma' | 'College' | 'Other' | '';
  stream?: string;
  state: string;
  district: string;
  locality?: 'Rural' | 'Semi-Urban' | 'Urban' | '';
  interests: string[];
  workPreference: string;
  careerGoal: string;
  onboardingCompleted: boolean;
  assessmentCompleted: boolean;
  assessmentScores?: {
    practicalWork: 'Low' | 'Medium' | 'High';
    technology: 'Low' | 'Medium' | 'High';
    creativeWork: 'Low' | 'Medium' | 'High';
    peopleOriented: 'Low' | 'Medium' | 'High';
  };
  savedCareerIds: string[];
  lastExploredTradeId?: string;
  careerPlanTasks: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  familySharedSummary?: string;
}

export const DEFAULT_EMPTY_STUDENT: StudentProfile = {
  name: '',
  education: '',
  stream: '',
  state: '',
  district: '',
  locality: '',
  interests: [],
  workPreference: '',
  careerGoal: '',
  onboardingCompleted: false,
  assessmentCompleted: false,
  savedCareerIds: [],
  careerPlanTasks: [
    { id: 't1', text: 'Complete your eligibility check', completed: false },
    { id: 't2', text: 'Explore suitable training options', completed: false },
    { id: 't3', text: 'Discuss verified options with your family', completed: false },
    { id: 't4', text: 'Review your selected career path', completed: false }
  ]
};
