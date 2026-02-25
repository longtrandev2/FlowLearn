// ============================================================
// ChatWindow – Khung Chat chính
// Header (nút Minimize/Expand) + Body (tin nhắn) + Footer (Input)
// ============================================================

import { useRef, useEffect, useState, type KeyboardEvent } from 'react';
import {
  Minus,
  Maximize2,
  Minimize2,
  Send,
  Trash2,
  Bot,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import type { Message } from '../types';

// ── Props ────────────────────────────────────────────────────
interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isExpanded: boolean;
  onSend: (content: string) => void;
  onClear: () => void;
  onMinimize: () => void;
  onToggleExpand: () => void;
}

// ── Component ────────────────────────────────────────────────
export const ChatWindow = ({
  messages,
  isLoading,
  error,
  isExpanded,
  onSend,
  onClear,
  onMinimize,
  onToggleExpand,
}: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll xuống đáy khi có tin nhắn mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input khi mở
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden transition-all duration-300 ease-in-out',
        isExpanded ? 'w-110 h-150' : 'w-92.5 h-125'
      )}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-linear-to-r from-ocean-600 to-ocean-500">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-8 rounded-full bg-white/20 backdrop-blur-sm">
            <Bot className="size-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">
              FlowLearn Assistant
            </h3>
            <p className="text-[11px] text-ocean-100 leading-tight">
              Trợ lý AI thông minh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Xóa lịch sử */}
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            title="Xóa lịch sử"
          >
            <Trash2 className="size-3.5" />
          </button>

          {/* Expand / Collapse */}
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
          >
            {isExpanded ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
          </button>

          {/* Minimize (đóng về FAB) */}
          <button
            onClick={onMinimize}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            title="Thu nhỏ"
          >
            <Minus className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ── Body (Khu vực tin nhắn) ─────────────────────────── */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Tin nhắn chào mừng mặc định */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex items-center justify-center size-14 rounded-full bg-ocean-50 mb-4">
                <Bot className="size-7 text-ocean-500" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                Xin chào! 👋
              </h4>
              <p className="text-xs text-slate-400 max-w-60 leading-relaxed">
                Mình là FlowLearn Assistant. Hãy hỏi mình bất cứ điều gì về việc
                học tập nhé!
              </p>
            </div>
          )}

          {/* Danh sách tin nhắn */}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-end gap-2 mb-3">
              <div className="flex items-center justify-center size-7 rounded-full bg-ocean-100 text-ocean-600 shrink-0">
                <Bot className="size-4" />
              </div>
              <div className="bg-slate-100 text-slate-500 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                <div className="flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span className="text-xs">Đang suy nghĩ...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mx-2 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* Anchor để auto-scroll */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* ── Footer (Khu vực nhập liệu) ─────────────────────── */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className={cn(
              'flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5',
              'text-sm text-slate-700 placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-ocean-400/40 focus:border-ocean-400',
              'max-h-24 transition-colors'
            )}
            style={{
              height: 'auto',
              minHeight: '40px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 96)}px`;
            }}
          />

          {/* Nút Send */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              'flex items-center justify-center size-10 rounded-xl transition-all duration-200 shrink-0',
              input.trim() && !isLoading
                ? 'bg-ocean-500 text-white hover:bg-ocean-600 shadow-sm shadow-ocean-500/25'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            )}
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
