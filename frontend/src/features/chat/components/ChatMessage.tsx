// ============================================================
// ChatMessage – Hiển thị bong bóng tin nhắn (User / AI)
// Đồng bộ Theme Ocean, hỗ trợ line-break cơ bản
// ============================================================

import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-end gap-2 mb-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex items-center justify-center size-7 rounded-full shrink-0',
          isUser
            ? 'bg-ocean-500 text-white'
            : 'bg-ocean-100 text-ocean-600'
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>

      {/* Bong bóng tin nhắn */}
      <div
        className={cn(
          'max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl',
          isUser
            ? 'bg-ocean-500 text-white rounded-br-sm'
            : 'bg-slate-100 text-slate-800 rounded-bl-sm'
        )}
      >
        {/* Render line-break: tách theo \n */}
        {message.content.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
};
