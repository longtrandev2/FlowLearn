// ============================================================
// ChatWidget – FAB + ChatWindow (Trạng thái Đóng / Mở)
// Nằm fixed góc dưới phải, theme Ocean gradient
// ============================================================

import { useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGeminiChat } from '../hooks/useGeminiChat';
import { ChatWindow } from './ChatWindow';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { messages, isLoading, error, sendMessage, clearMessages } =
    useGeminiChat();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* ── Chat Window (khi mở) ───────────────────────────── */}
      {isOpen && (
        <div
          className={cn(
            'animate-in fade-in slide-in-from-bottom-4 duration-300',
          )}
        >
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            error={error}
            isExpanded={isExpanded}
            onSend={sendMessage}
            onClear={clearMessages}
            onMinimize={() => setIsOpen(false)}
            onToggleExpand={() => setIsExpanded((prev) => !prev)}
          />
        </div>
      )}

      {/* ── FAB – Floating Action Button (khi đóng) ────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'group relative flex items-center justify-center',
            'size-14 rounded-full',
            'bg-linear-to-br from-ocean-500 to-ocean-600',
            'text-white shadow-lg shadow-ocean-500/30',
            'hover:shadow-xl hover:shadow-ocean-500/40 hover:-translate-y-0.5',
            'active:scale-95',
            'transition-all duration-300 ease-out',
            'animate-in fade-in zoom-in-75 duration-300',
          )}
          aria-label="Mở chat với FlowLearn Assistant"
        >
          {/* Icon chính */}
          <MessageCircle className="size-6 transition-transform duration-300 group-hover:scale-110" />

          {/* Sparkle nhỏ ở góc */}
          <Sparkles className="absolute -top-0.5 -right-0.5 size-4 text-ocean-200 animate-pulse" />

          {/* Pulse ring effect */}
          <span className="absolute inset-0 rounded-full bg-ocean-400/30 animate-ping" />
        </button>
      )}
    </div>
  );
};
