import { useState } from "react";
import { ArrowRight, Sparkles, Check } from "lucide-react";
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
    // FIX SCROLL: Thêm h-full, overflow-y-auto và pb-12 để đảm bảo cuộn mượt và không bị che nút ở đáy
    <div className="flex flex-col items-center w-full h-full overflow-y-auto pb-12 pt-8 px-4 sm:px-6 scroll-smooth">
      
      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-50 text-ocean-700 rounded-full text-sm font-bold mb-5 shadow-sm border border-ocean-100">
          <Sparkles size={16} className="text-ocean-500" />
          Bước 1
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
          Chọn mục tiêu học tập
        </h2>
        <p className="text-base text-slate-500 leading-relaxed">
          Mục tiêu sẽ ảnh hưởng đến cách hệ thống FlowLearn tạo tóm tắt, 
          flashcard và quiz phù hợp nhất cho lộ trình của bạn.
        </p>
      </div>

      {/* Goal Cards Grid - Nới rộng max-w và gap để thoáng hơn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
        {LEARNING_GOALS.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            isSelected={selected === goal.id}
            onClick={() => setSelected(goal.id)}
          />
        ))}
      </div>

      {/* Start Button - Cố định kích thước và tạo hiệu ứng floating nhẹ */}
      <Button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        className={cn(
          "h-14 px-10 rounded-2xl text-lg font-bold gap-3 transition-all duration-300",
          selected
            ? "bg-ocean-600 hover:bg-ocean-700 text-white shadow-xl shadow-ocean-200/50 hover:-translate-y-1"
            : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
        )}
      >
        Bắt đầu học ngay
        <ArrowRight size={20} className={cn("transition-transform", selected && "animate-pulse")} />
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
      // UI FIX: Thêm flex flex-col và h-full để các card cao bằng nhau dù text dài ngắn khác nhau
      className={cn(
        "relative flex flex-col text-left p-6 rounded-3xl border-2 transition-all duration-300 group h-full focus:outline-none",
        isSelected
          ? "border-ocean-500 bg-ocean-50 shadow-lg shadow-ocean-100/50 -translate-y-1"
          : "border-slate-100 bg-white hover:border-ocean-200 hover:shadow-md hover:-translate-y-1"
      )}
    >
      {/* Icon Wrapper - Tạo điểm nhấn Ocean */}
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-colors",
        isSelected ? "bg-white shadow-sm" : "bg-slate-50 group-hover:bg-ocean-50"
      )}>
        {goal.icon}
      </div>

      {/* Title */}
      <h3
        className={cn(
          "text-lg font-bold mb-2 transition-colors",
          isSelected ? "text-ocean-800" : "text-slate-800"
        )}
      >
        {goal.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed mb-6">
        {goal.description}
      </p>

      {/* Strategy hint - Dùng mt-auto để luôn bị đẩy xuống đáy card, giúp các card đều nhau */}
      <div
        className={cn(
          "mt-auto text-xs font-semibold px-3 py-2 rounded-xl inline-block transition-colors border",
          isSelected
            ? "bg-white text-ocean-700 border-ocean-100"
            : "bg-slate-50 text-slate-500 border-transparent group-hover:bg-white group-hover:border-ocean-100 group-hover:text-ocean-600"
        )}
      >
        {goal.strategyHint}
      </div>

      {/* Selected indicator - Đổi sang dùng icon Check của Lucide cho đồng bộ */}
      {isSelected && (
        <div className="absolute top-5 right-5 w-7 h-7 bg-ocean-500 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200">
          <Check size={16} strokeWidth={3} className="text-white" />
        </div>
      )}
    </button>
  );
}