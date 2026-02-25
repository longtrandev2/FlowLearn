import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GoalId, LearningGoal } from "@/features/study-session/types";
import { LEARNING_GOALS } from "@/features/study-session/data/mockData";
import { cn } from "@/lib/utils";

interface GoalSelectorProps {
  onSelect: (goalId: GoalId) => void;
}

export default function GoalSelector({ onSelect }: GoalSelectorProps) {
  const [selected, setSelected] = useState<GoalId | null>(null);

  return (
    <div className="flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ocean-50 text-ocean-600 rounded-full text-xs font-semibold mb-4">
          <Sparkles size={14} />
          Step 1
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Chọn mục tiêu học tập
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Mục tiêu sẽ ảnh hưởng đến cách hệ thống tạo tóm tắt, flashcard và
          quiz phù hợp nhất cho bạn.
        </p>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
        {LEARNING_GOALS.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            isSelected={selected === goal.id}
            onClick={() => setSelected(goal.id)}
          />
        ))}
      </div>

      {/* Start Button */}
      <Button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        className={cn(
          "h-12 px-8 rounded-xl text-base font-semibold gap-2 transition-all duration-300",
          selected
            ? "bg-ocean-600 hover:bg-ocean-700 text-white shadow-lg shadow-ocean-200 hover:-translate-y-0.5"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        )}
      >
        Bắt đầu học
        <ArrowRight size={18} />
      </Button>
    </div>
  );
}

// ─── Goal Card ──────────────────────────────────────────────────

interface GoalCardProps {
  goal: LearningGoal;
  isSelected: boolean;
  onClick: () => void;
}

function GoalCard({ goal, isSelected, onClick }: GoalCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative text-left p-5 rounded-2xl border-2 transition-all duration-200 group",
        isSelected
          ? "border-ocean-500 bg-ocean-50/60 shadow-md shadow-ocean-100"
          : "border-slate-100 bg-white hover:border-ocean-200 hover:bg-ocean-50/30 hover:shadow-sm"
      )}
    >
      {/* Icon */}
      <span className="text-3xl mb-3 block">{goal.icon}</span>

      {/* Title */}
      <h3
        className={cn(
          "text-base font-bold mb-1 transition-colors",
          isSelected ? "text-ocean-700" : "text-slate-800"
        )}
      >
        {goal.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed mb-3">
        {goal.description}
      </p>

      {/* Strategy hint */}
      <div
        className={cn(
          "text-[11px] font-medium px-2.5 py-1.5 rounded-lg inline-block transition-colors",
          isSelected
            ? "bg-ocean-100 text-ocean-700"
            : "bg-slate-50 text-slate-400 group-hover:bg-ocean-50 group-hover:text-ocean-600"
        )}
      >
        {goal.strategyHint}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-ocean-500 rounded-full flex items-center justify-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-white"
          >
            <path
              d="M2.5 6L5 8.5L9.5 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
