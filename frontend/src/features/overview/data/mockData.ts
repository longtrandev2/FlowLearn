// ── Mock Data for Overview Dashboard ──

import type { Course, StudyDay, StreakData, UserProfile } from '../types';

export const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Triết học Mác - Lênin',
    type: 'PDF',
    lastAccessed: 'Just now',
    progress: 75,
    totalPages: 120,
    currentPage: 90,
    color: 'text-ocean-600',
    bgColor: 'bg-ocean-50',
  },
  {
    id: 2,
    title: 'Tư tưởng Hồ Chí Minh',
    type: 'DOCX',
    lastAccessed: '2h ago',
    progress: 30,
    totalPages: 80,
    currentPage: 24,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 3,
    title: 'Lịch sử Đảng CSVN',
    type: 'PDF',
    lastAccessed: 'Yesterday',
    progress: 10,
    totalPages: 150,
    currentPage: 15,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    id: 4,
    title: 'Kinh tế chính trị',
    type: 'PPTX',
    lastAccessed: '3 days ago',
    progress: 55,
    totalPages: 60,
    currentPage: 33,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
];

export const mockStudyData: StudyDay[] = [
  { day: 'Mon', hours: 2.5, label: '2h 30m' },
  { day: 'Tue', hours: 4.0, label: '4h 00m' },
  { day: 'Wed', hours: 1.5, label: '1h 30m' },
  { day: 'Thu', hours: 5.0, label: '5h 00m' },
  { day: 'Fri', hours: 3.0, label: '3h 00m' },
  { day: 'Sat', hours: 1.0, label: '1h 00m' },
  { day: 'Sun', hours: 4.5, label: '4h 30m' },
];

export const mockStreak: StreakData = {
  currentStreak: 12,
  longestStreak: 21,
  percentile: 85,
  weekDays: [
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'T', completed: true },
    { day: 'F', completed: true },
    { day: 'S', completed: false },
    { day: 'S', completed: false },
  ],
};

export const mockUser: UserProfile = {
  name: 'Long',
  avatar: 'https://github.com/shadcn.png',
  greeting: "Let's learn something new today!",
};
