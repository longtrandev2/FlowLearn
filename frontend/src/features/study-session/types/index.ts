// ─── Study Session Types ────────────────────────────────────────
// Dùng cho StudyPage: GoalSelector, Summary, Flashcard, Quiz, Feedback.
// Hỗ trợ scope = file (1 file) hoặc folder (nhiều file).

// ─── Study Scope ────────────────────────────────────────────────

export type StudyScope = "file" | "folder";

export interface StudyScopeInfo {
  scope: StudyScope;
  /** id của file hoặc folder */
  id: string;
  /** Tên hiển thị (tên file hoặc tên folder) */
  name: string;
  /** Số file trong scope (1 nếu scope = file) */
  fileCount: number;
}

// ─── Learning Goals (US-03) ─────────────────────────────────────

export type GoalId =
  | "exam-prep"
  | "deep-understanding"
  | "quick-review"
  | "eli5"
  | "memorize";

export interface LearningGoal {
  id: GoalId;
  icon: string;
  title: string;
  description: string;
  /** Mô tả ngắn cách goal ảnh hưởng tới nội dung */
  strategyHint: string;
}

// ─── Summary (US-04) ────────────────────────────────────────────

export interface Summary {
  /** Markdown content */
  content: string;
  /** Goal đã sinh summary này */
  goalId: GoalId;
  /** Số từ */
  wordCount: number;
}

// ─── Flashcard (US-05) ──────────────────────────────────────────

export type FlashcardImportance = "core" | "support" | "advanced";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  importance: FlashcardImportance;
}

export const IMPORTANCE_STYLE: Record<
  FlashcardImportance,
  { label: string; bg: string; text: string; dot: string }
> = {
  core: {
    label: "Core",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  support: {
    label: "Support",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  advanced: {
    label: "Advanced",
    bg: "bg-violet-50",
    text: "text-violet-600",
    dot: "bg-violet-500",
  },
};

// ─── Quiz (US-06) ───────────────────────────────────────────────

export type CognitiveLevel = "recall" | "understand" | "apply";

export interface QuizOption {
  key: string; // "A", "B", "C", "D"
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctKey: string;
  cognitiveLevel: CognitiveLevel;
  /** Giải thích đáp án đúng (hiện sau khi nộp bài) */
  explanation: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  score: number; // 0-100
  timeSpentSeconds: number;
  /** Kết quả từng câu */
  answers: {
    questionId: string;
    selectedKey: string | null;
    isCorrect: boolean;
  }[];
}

export const COGNITIVE_LEVEL_STYLE: Record<
  CognitiveLevel,
  { label: string; bg: string; text: string }
> = {
  recall: { label: "Recall", bg: "bg-green-50", text: "text-green-600" },
  understand: {
    label: "Understand",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  apply: { label: "Apply", bg: "bg-purple-50", text: "text-purple-600" },
};

// ─── Feedback (US-07) ───────────────────────────────────────────

export interface TopicStrength {
  topic: string;
  /** 0-100 */
  score: number;
  status: "strong" | "moderate" | "weak";
}

export interface Feedback {
  overallScore: number;
  /** Tổng kết ngắn từ AI */
  aiFeedback: string;
  /** Phân tích theo topic */
  topicBreakdown: TopicStrength[];
  /** Gợi ý nội dung nên ôn lại */
  suggestions: string[];
  /** Có bài quiz bổ trợ (remedial) không */
  hasRemedialQuiz: boolean;
}

// ─── Study Session State ────────────────────────────────────────

export type StudyTab = "summary" | "flashcard" | "quiz" | "feedback";

export interface StudySessionState {
  scopeInfo: StudyScopeInfo | null;
  selectedGoal: GoalId | null;
  activeTab: StudyTab;
  /** Đã chọn goal và bắt đầu học chưa */
  isSessionStarted: boolean;
}
