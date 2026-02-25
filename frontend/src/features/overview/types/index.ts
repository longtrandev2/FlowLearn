// ── Overview Feature Types ──

export interface Course {
  id: number;
  title: string;
  type: 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO';
  lastAccessed: string;
  progress: number;
  totalPages: number;
  currentPage: number;
  color: string;
  bgColor: string;
}

export interface StudyDay {
  day: string;
  hours: number;
  label: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  percentile: number;
  weekDays: { day: string; completed: boolean }[];
}

export interface UserProfile {
  name: string;
  avatar: string;
  greeting: string;
}
