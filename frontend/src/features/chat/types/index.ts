// ============================================================
// Chat Feature - Type Definitions
// Cấu trúc dùng cho ChatBot Widget (Gemini AI)
// Thiết kế sẵn để dễ thay thế bằng Backend RAG nội bộ
// ============================================================

/** Vai trò của người gửi tin nhắn */
export type MessageRole = 'user' | 'model';

/** Một tin nhắn trong cuộc hội thoại */
export interface Message {
  /** ID duy nhất (UUID hoặc timestamp-based) */
  id: string;
  /** Vai trò: 'user' = người dùng, 'model' = AI */
  role: MessageRole;
  /** Nội dung text của tin nhắn */
  content: string;
  /** Thời điểm gửi (ISO string) */
  timestamp: string;
}

/** Trạng thái của Chat Hook */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
