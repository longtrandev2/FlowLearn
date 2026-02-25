import { FileText, Layers, BookOpen, MessageSquare } from "lucide-react";
import type { StudyTab } from "@/features/study-session/types";
import { cn } from "@/lib/utils";

interface StudyTabsProps {
  activeTab: StudyTab;
  onTabChange: (tab: StudyTab) => void;
}

const TABS: { id: StudyTab; label: string; icon: React.ReactNode }[] = [
  { id: "summary", label: "Summary", icon: <FileText size={16} /> },
  { id: "flashcard", label: "Flashcard", icon: <Layers size={16} /> },
  { id: "quiz", label: "Quiz", icon: <BookOpen size={16} /> },
  { id: "feedback", label: "Feedback", icon: <MessageSquare size={16} /> },
];

export default function StudyTabs({ activeTab, onTabChange }: StudyTabsProps) {
  return (
    <div className="border-b border-slate-100">
      <nav className="flex gap-1" aria-label="Study tabs">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200",
                isActive
                  ? "border-ocean-500 text-ocean-700"
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  isActive ? "text-ocean-500" : "text-slate-400"
                )}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
