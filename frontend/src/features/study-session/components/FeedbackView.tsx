import React from "react";
import type { Feedback } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeedbackViewProps {
  feedback: Feedback;
  onRemedialQuiz?: () => void;
}

const statusMap: Record<string, { color: string; label: string }> = {
  strong: { color: "bg-green-500", label: "Tốt" },
  moderate: { color: "bg-yellow-500", label: "Trung bình" },
  weak: { color: "bg-red-500", label: "Cần cải thiện" },
};

const FeedbackView: React.FC<FeedbackViewProps> = ({ feedback, onRemedialQuiz }) => {
  return (
    <Card className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Phản hồi AI</h2>
      <div className="mb-4">
        <Badge variant="default">Điểm tổng: {feedback.overallScore} / 100</Badge>
      </div>
      <div className="mb-4 text-sm text-muted-foreground">{feedback.aiFeedback}</div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Phân tích theo chủ đề</h3>
        <ul className="space-y-2">
          {feedback.topicBreakdown.map((t) => (
            <li key={t.topic} className="flex items-center gap-2">
              <span className="font-medium">{t.topic}</span>
              <span className="text-xs text-muted">{t.score} / 100</span>
              <span className={`ml-2 px-2 py-0.5 rounded ${statusMap[t.status].color} text-white text-xs`}>
                {statusMap[t.status].label}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Gợi ý cải thiện</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {feedback.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
      {feedback.hasRemedialQuiz && (
        <Button variant="outline" onClick={onRemedialQuiz} className="w-full mt-2">
          Làm quiz bổ sung
        </Button>
      )}
    </Card>
  );
};

export default FeedbackView;
