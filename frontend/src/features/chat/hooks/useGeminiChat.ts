// ============================================================
// useGeminiChat – Custom Hook
// Quản lý state tin nhắn & gọi Google Gemini API
// Thiết kế tách biệt logic, dễ thay thế bằng Backend RAG
// ============================================================

import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message, ChatState } from '../types';

/** Tạo ID duy nhất cho mỗi tin nhắn */
const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

/** System prompt mặc định cho FlowLearn Assistant */
const SYSTEM_INSTRUCTION = `Bạn là FlowLearn Assistant – trợ lý AI thông minh của nền tảng học tập FlowLearn.
Hãy trả lời ngắn gọn, chính xác, thân thiện. Hỗ trợ người dùng về việc học tập, tóm tắt tài liệu, giải thích khái niệm.
Trả lời bằng tiếng Việt trừ khi người dùng hỏi bằng ngôn ngữ khác.`;

/** Khởi tạo Gemini client (singleton) */
const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
  if (!apiKey) {
    throw new Error(
      'Missing VITE_GEMINI_API_KEY. Hãy thêm vào file .env:\nVITE_GEMINI_API_KEY=your_api_key_here'
    );
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Custom hook quản lý chat với Gemini AI.
 *
 * @returns messages, isLoading, error, sendMessage, clearMessages
 */
export const useGeminiChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  // Giữ reference đến chat session để duy trì ngữ cảnh hội thoại
  const chatSessionRef = useRef<ReturnType<
    ReturnType<GoogleGenerativeAI['getGenerativeModel']>['startChat']
  > | null>(null);

  /** Khởi tạo hoặc lấy lại chat session */
  const getChatSession = useCallback(() => {
    if (!chatSessionRef.current) {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION,
      });
      chatSessionRef.current = model.startChat({
        history: [],
      });
    }
    return chatSessionRef.current;
  }, []);

  /** Gửi tin nhắn và nhận phản hồi từ Gemini */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Tạo tin nhắn của user
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        const chatSession = getChatSession();
        const result = await chatSession.sendMessage(content.trim());
        const responseText = result.response.text();

        // Tạo tin nhắn của AI
        const aiMessage: Message = {
          id: generateId(),
          role: 'model',
          content: responseText,
          timestamp: new Date().toISOString(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
          isLoading: false,
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    },
    [getChatSession]
  );

  /** Xóa toàn bộ lịch sử chat và reset session */
  const clearMessages = useCallback(() => {
    chatSessionRef.current = null;
    setState({ messages: [], isLoading: false, error: null });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearMessages,
  };
};
