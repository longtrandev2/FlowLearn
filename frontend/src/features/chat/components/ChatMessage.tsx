// ============================================================
// ChatMessage – Hiển thị bong bóng tin nhắn (User / AI)
// Đồng bộ Theme Ocean, hỗ trợ Markdown cơ bản
// ============================================================

import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

// ── Markdown parser đơn giản ─────────────────────────────────
/** Parse inline markdown: **bold**, *italic*, `code`, [link](url) */
const parseInlineMarkdown = (text: string): React.ReactNode[] => {
  // Regex bắt: **bold**, *italic*, `code`, [text](url), plain URL
  const inlineRegex =
    /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[([^\]]+)\]\(([^)]+)\))|(https?:\/\/[^\s)\]]+)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Push plain text trước match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // **bold**
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // *italic*
      parts.push(
        <em key={match.index}>{match[4]}</em>
      );
    } else if (match[5]) {
      // `code`
      parts.push(
        <code
          key={match.index}
          className="px-1 py-0.5 rounded bg-black/10 text-[13px] font-mono"
        >
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      // [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[9]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {match[8]}
        </a>
      );
    } else if (match[10]) {
      // Plain URL
      parts.push(
        <a
          key={match.index}
          href={match[10]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity break-all"
        >
          {match[10]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Phần text còn lại
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

/** Render nội dung markdown block-level (list, heading, paragraph) */
const renderMarkdown = (content: string): React.ReactNode => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Dòng trống → spacer nhỏ
    if (!trimmed) {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    // Bullet list: *, -, hoặc numbered (1.)
    if (/^[\*\-•]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length) {
        const li = lines[i].trim();
        if (/^[\*\-•]\s/.test(li)) {
          listItems.push(
            <li key={i} className="ml-4 list-disc">
              {parseInlineMarkdown(li.replace(/^[\*\-•]\s/, ''))}
            </li>
          );
        } else if (/^\d+\.\s/.test(li)) {
          listItems.push(
            <li key={i} className="ml-4 list-decimal">
              {parseInlineMarkdown(li.replace(/^\d+\.\s/, ''))}
            </li>
          );
        } else {
          break;
        }
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="space-y-0.5">
          {listItems}
        </ul>
      );
      continue;
    }

    // Paragraph thường
    elements.push(
      <p key={i}>{parseInlineMarkdown(trimmed)}</p>
    );
    i++;
  }

  return <>{elements}</>;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-2 mb-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex items-center justify-center size-7 rounded-full shrink-0 mt-0.5',
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
          'max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl',
          'overflow-hidden wrap-break-word',
          isUser
            ? 'bg-ocean-500 text-white rounded-tr-sm'
            : 'bg-slate-100 text-slate-800 rounded-tl-sm',
          // Markdown prose style cho AI
          !isUser && '[&_p]:mb-1.5 [&_li]:text-[13px] [&_ul]:my-1 [&_strong]:font-semibold [&_a]:text-ocean-600 [&_code]:text-ocean-700',
          isUser && '[&_a]:text-white'
        )}
      >
        {isUser ? message.content : renderMarkdown(message.content)}
      </div>
    </div>
  );
};
