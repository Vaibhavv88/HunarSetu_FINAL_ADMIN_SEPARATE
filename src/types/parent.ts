export interface ParentDetailedProfile {
  parentName: string;
  guardianRelation: 'Father' | 'Mother' | 'Guardian' | 'Elder Sibling';
  childName: string;
  childAge: number;
  childEducation: 'Class 10' | 'Class 12' | 'ITI' | 'Diploma' | 'College' | 'Other' | '';
  childStream?: string;
  state: string;
  district: string;
  locality?: 'Rural' | 'Semi-Urban' | 'Urban';
  topPriorities: string[];
  mainConcern: string;
  familyGoal: string;
  onboardingCompleted: boolean;
  childConnected: boolean;
  familyConnectionCode?: string;
  savedConcerns: string[];
}

export const DEFAULT_EMPTY_PARENT: ParentDetailedProfile = {
  parentName: '',
  guardianRelation: 'Father',
  childName: '',
  childAge: 0,
  childEducation: '',
  childStream: '',
  state: '',
  district: '',
  locality: '',
  topPriorities: [],
  mainConcern: '',
  familyGoal: '',
  onboardingCompleted: false,
  childConnected: false,
  savedConcerns: []
};
