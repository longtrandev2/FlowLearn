import React, { useState } from "react";
import GoalSelector from "../features/study-session/components/GoalSelector";
import StudyTabs from "../features/study-session/components/StudyTabs";
import SummaryView from "../features/study-session/components/SummaryView";
import FlashcardView from "../features/study-session/components/FlashcardView";
import QuizView from "../features/study-session/components/QuizView";
import FeedbackView from "../features/study-session/components/FeedbackView";
import { 
  LEARNING_GOALS, 
  mockSummary, 
  mockFlashcards, 
  mockQuizQuestions, 
  mockFeedback 
} from "../features/study-session/data/mockData";

const StudyPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // When user selects goal, auto switch to summary tab
  const handleSelectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
    setActiveTab("summary");
  };

  return (
    // FIX SCROLL: Đổi div ngoài cùng thành h-full, chiếm trọn màn hình và cho phép cuộn dọc (overflow-y-auto)
    <div className="h-full w-full overflow-y-auto bg-slate-50/30 scroll-smooth">
      {/* Thêm padding bottom (pb-24) siêu to để đảm bảo cuộn tít xuống dưới không bị vướng */}
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* UI TWEAK: Làm lại Header cho xịn xò, căn giữa */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Study <span className="text-ocean-600">Session</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Thiết lập mục tiêu để tối ưu hóa thời gian học tập của bạn
          </p>
        </div>

        {!selectedGoal ? (
          <GoalSelector
            goals={LEARNING_GOALS}
            selectedGoal={null}
            onSelect={handleSelectGoal}
          />
        ) : (
          // Thêm animation mượt mà khi chuyển từ màn chọn mục tiêu sang màn học
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StudyTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={["summary", "flashcard", "quiz", "feedback"]}
            />
            
            {/* UI TWEAK: Bọc toàn bộ nội dung học vào một Card trắng bo góc, đổ bóng */}
            <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 min-h-[400px]">
              {activeTab === "summary" && <SummaryView summary={mockSummary} />}
              {activeTab === "flashcard" && <FlashcardView flashcards={mockFlashcards} />}
              {activeTab === "quiz" && (
                <QuizView questions={mockQuizQuestions} onComplete={setQuizScore} />
              )}
              {activeTab === "feedback" && (
                <FeedbackView 
                  feedback={mockFeedback} 
                  onRemedialQuiz={() => setActiveTab("quiz")} 
                />
              )}
            </div>

            {/* UI TWEAK: Cải thiện hiển thị điểm số */}
            {quizScore !== null && activeTab === "quiz" && (
              <div className="mt-8 text-center">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200 shadow-sm">
                  🎯 Điểm bài thi: {quizScore} / {mockQuizQuestions.length}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPage;