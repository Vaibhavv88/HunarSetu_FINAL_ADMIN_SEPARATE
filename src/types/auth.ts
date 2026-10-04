export type UserRole = 'selector' | 'student' | 'family' | 'counsellor' | 'admin';

export interface CounsellorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  badgeId: string;
  assignedRegion: string;
  specialization: string;
  activeTicketsCount: number;
  resolvedTicketsCount: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinedDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  type: 'urgent_dispute' | 'new_escalation' | 'scheduled_call' | 'system';
  ticketId?: string;
  timestamp: string;
  read: boolean;
  district?: string;
  learnerName?: string;
}
