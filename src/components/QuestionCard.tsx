import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  question: {
    id: string;
    type: "choice" | "matching" | "text" | "image";
    category: string;
    question: string;
    options?: string[];
    correctAnswer: number | string;
    explanation: string;
    points: number;
    difficulty: "easy" | "medium" | "hard";
  };
  onAnswer: (questionId: string, userAnswer: any, isCorrect: boolean) => void;
  onNext?: () => void;
}

export const QuestionCard = ({ question, onAnswer, onNext }: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    onAnswer(question.id, selectedAnswer, correct);
  };

  const difficultyColors = {
    easy: "bg-success text-success-foreground",
    medium: "bg-warning text-warning-foreground", 
    hard: "bg-destructive text-destructive-foreground"
  };

  const difficultyEmoji = {
    easy: "🌱",
    medium: "🌿", 
    hard: "🌳"
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-bio">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {question.category}
            </Badge>
            <Badge className={`text-xs ${difficultyColors[question.difficulty]}`}>
              {difficultyEmoji[question.difficulty]} {question.difficulty}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-xs">
            {question.points} {question.points === 1 ? 'балл' : 'балла'}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {question.type === "choice" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === index
                    ? showResult
                      ? isCorrect && index === question.correctAnswer
                        ? "border-success bg-success/10 text-success"
                        : index === question.correctAnswer
                        ? "border-success bg-success/10 text-success"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : "border-primary bg-primary/10"
                    : showResult && index === question.correctAnswer
                    ? "border-success bg-success/10 text-success"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                    selectedAnswer === index ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>
        )}

        {showResult && (
          <div className={`p-4 rounded-lg border-2 ${
            isCorrect ? "border-success bg-success/10" : "border-warning bg-warning/10"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{isCorrect ? "✅" : "💡"}</span>
              <span className="font-semibold">
                {isCorrect ? "Правильно!" : "Не совсем верно"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        {!showResult && (
          <Button 
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            variant="nature"
            className="w-full"
          >
            Ответить
          </Button>
        )}

        {showResult && onNext && (
          <Button 
            onClick={onNext}
            variant="bio"
            className="w-full"
          >
            Далее →
          </Button>
        )}
      </CardContent>
    </Card>
  );
};