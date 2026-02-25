import ReactMarkdown from "react-markdown";
import { BookOpen, Clock, Hash } from "lucide-react";
import type { Summary } from "@/features/study-session/types";
import { LEARNING_GOALS } from "@/features/study-session/data/mockData";

interface SummaryViewProps {
  summary: Summary;
}

export default function SummaryView({ summary }: SummaryViewProps) {
  const goal = LEARNING_GOALS.find((g) => g.id === summary.goalId);

  return (
    <div className="py-6 px-1">
      {/* Meta bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {goal && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ocean-50 text-ocean-600 rounded-lg text-xs font-semibold">
            <BookOpen size={13} />
            <span>
              {goal.icon} {goal.title}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Hash size={13} />
          <span>{summary.wordCount} từ</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={13} />
          <span>~{Math.ceil(summary.wordCount / 200)} phút đọc</span>
        </div>
      </div>

      {/* Markdown content */}
      <article className="prose prose-slate prose-sm max-w-none prose-headings:text-slate-800 prose-h2:text-lg prose-h2:font-bold prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2 prose-h2:mb-4 prose-h3:text-base prose-h3:font-semibold prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-700 prose-li:text-slate-600 prose-blockquote:border-ocean-300 prose-blockquote:bg-ocean-50/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:text-ocean-700 prose-table:text-sm prose-th:bg-slate-50 prose-th:text-slate-700 prose-td:text-slate-600">
        <ReactMarkdown>{summary.content}</ReactMarkdown>
      </article>
    </div>
  );
}
