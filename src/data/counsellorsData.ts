import { CounsellorUser, NotificationItem } from '../types/auth';

export const INITIAL_COUNSELLORS: CounsellorUser[] = [
  {
    id: 'COUNS-101',
    name: 'Dr. Sunita Sharma',
    email: 'counsellor@hunarsetu.gov.in',
    phone: '+91 94150 12345',
    badgeId: 'NSDC-CERT-4891',
    assignedRegion: 'Kanpur Nagar & Central UP',
    specialization: 'Green Energy (Solar/EV) & Industrial Trades',
    activeTicketsCount: 4,
    resolvedTicketsCount: 142,
    status: 'Active',
    joinedDate: '15 Jan 2026'
  },
  {
    id: 'COUNS-102',
    name: 'Er. Rajesh Kumar Maurya',
    email: 'rajesh.maurya@hunarsetu.gov.in',
    phone: '+91 98390 67890',
    badgeId: 'DGT-MED-7712',
    assignedRegion: 'Varanasi & Purvanchal',
    specialization: 'Aviation (Drones), Mechanical CNC & Lateral Entry',
    activeTicketsCount: 3,
    resolvedTicketsCount: 98,
    status: 'Active',
    joinedDate: '02 Mar 2026'
  },
  {
    id: 'COUNS-103',
    name: 'Meenakshi Iyer',
    email: 'meenakshi.iyer@hunarsetu.gov.in',
    phone: '+91 98200 45678',
    badgeId: 'MSDE-WOMEN-3341',
    assignedRegion: 'Pune & Western Maharashtra',
    specialization: 'Healthcare GDA & Women Entrepreneurship in Skilling',
    activeTicketsCount: 2,
    resolvedTicketsCount: 115,
    status: 'Active',
    joinedDate: '10 Nov 2023'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
