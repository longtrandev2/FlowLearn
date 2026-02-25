
import React, { useState } from "react";
import { GoalSelector } from "../features/study-session/components/GoalSelector";
import { StudyTabs } from "../features/study-session/components/StudyTabs";
import SummaryView from "../features/study-session/components/SummaryView";
import FlashcardView from "../features/study-session/components/FlashcardView";
import QuizView from "../features/study-session/components/QuizView";
import FeedbackView from "../features/study-session/components/FeedbackView";
import { mockGoals, mockSummary, mockFlashcards, mockQuizQuestions, mockFeedback } from "../features/study-session/data/mockData";

const StudyPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState(mockGoals[0].id);
  const [activeTab, setActiveTab] = useState("summary");
  const [quizScore, setQuizScore] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Study Session</h1>
      <GoalSelector
        goals={mockGoals}
        selectedGoal={selectedGoal}
        onSelect={setSelectedGoal}
      />
      <StudyTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={["summary", "flashcard", "quiz", "feedback"]}
      />
      <div className="mt-6">
        {activeTab === "summary" && <SummaryView summary={mockSummary} />}
        {activeTab === "flashcard" && <FlashcardView flashcards={mockFlashcards} />}
        {activeTab === "quiz" && (
          <QuizView questions={mockQuizQuestions} onComplete={setQuizScore} />
        )}
        {activeTab === "feedback" && (
          <FeedbackView feedback={mockFeedback} onRemedialQuiz={() => setActiveTab("quiz")} />
        )}
      </div>
      {quizScore !== null && activeTab === "quiz" && (
        <div className="mt-4 text-center text-green-600 font-semibold">
          Điểm quiz: {quizScore} / {mockQuizQuestions.length}
        </div>
      )}
    </div>
  );
};

export default StudyPage;
