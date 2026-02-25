import React, { useState } from "react";
import type { QuizQuestion } from "../types";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { Badge } from "../../../../components/ui/badge";

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (key: string) => {
    setSelected(key);
  };

  const handleNext = () => {
    if (selected === null) return;
    setAnswers([...answers, selected]);
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
      if (onComplete) {
        const score = questions.reduce(
          (acc, q, i) => acc + (q.correctKey === [...answers, selected][i] ? 1 : 0),
          0
        );
        onComplete(score);
      }
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
  };

  if (questions.length === 0) {
    return <div className="text-center text-muted">Không có câu hỏi nào.</div>;
  }

  if (showResult) {
    const score = questions.reduce(
      (acc, q, i) => acc + (q.correctKey === answers[i] ? 1 : 0),
      0
    );
    return (
      <Card className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Kết quả</h2>
        <div className="mb-4">
          <Badge variant="default">Điểm: {score} / {questions.length}</Badge>
        </div>
        <Button onClick={handleRestart} variant="outline">Làm lại</Button>
      </Card>
    );
  }

  const q = questions[current];
  return (
    <Card className="max-w-md mx-auto p-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-muted">Câu hỏi {current + 1} / {questions.length}</span>
        <Progress value={((current + 1) / questions.length) * 100} className="w-32 h-2" />
      </div>
      <h3 className="font-semibold mb-4">{q.question}</h3>
      <div className="space-y-2 mb-4">
        {q.options.map((opt) => (
          <Button
            key={opt.key}
            variant={selected === opt.key ? "default" : "outline"}
            className="w-full text-left"
            onClick={() => handleSelect(opt.key)}
          >
            <span className="font-bold mr-2">{opt.key}</span> {opt.text}
          </Button>
        ))}
      </div>
      <Button
        onClick={handleNext}
        disabled={selected === null}
        className="w-full mt-2"
      >
        {current === questions.length - 1 ? "Hoàn thành" : "Tiếp tục"}
      </Button>
    </Card>
  );
};

export default QuizView;
