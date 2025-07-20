
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Flag, ThumbsUp, ThumbsDown, BookOpen } from "lucide-react";

interface QuestionFeedbackProps {
  questionId: string;
  questionSource?: string;
  verificationStatus?: "verified" | "pending" | "flagged";
  onFeedback?: (questionId: string, feedback: string, type: "positive" | "negative" | "error") => void;
}

export const QuestionFeedback = ({ 
  questionId, 
  questionSource, 
  verificationStatus = "pending",
  onFeedback 
}: QuestionFeedbackProps) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState<"positive" | "negative" | "error">("positive");

  const handleSubmitFeedback = () => {
    if (feedbackText.trim() && onFeedback) {
      onFeedback(questionId, feedbackText, feedbackType);
      setFeedbackText("");
      setShowFeedback(false);
    }
  };

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return <Badge variant="default" className="bg-success text-success-foreground">✓ Проверено экспертом</Badge>;
      case "flagged":
        return <Badge variant="destructive">⚠ Требует проверки</Badge>;
      default:
        return <Badge variant="secondary">📝 Сгенерировано ИИ</Badge>;
    }
  };

  return (
    <Card className="mt-4 border-muted">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getVerificationBadge()}
            {questionSource && (
              <Badge variant="outline" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                {questionSource}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFeedbackType("positive");
                setShowFeedback(!showFeedback);
              }}
              className="h-8 px-2"
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFeedbackType("negative");
                setShowFeedback(!showFeedback);
              }}
              className="h-8 px-2"
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFeedbackType("error");
                setShowFeedback(!showFeedback);
              }}
              className="h-8 px-2 text-destructive hover:text-destructive"
            >
              <Flag className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showFeedback && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {feedbackType === "positive" && "Поделитесь, что вам понравилось в этом вопросе:"}
              {feedbackType === "negative" && "Расскажите, что можно улучшить:"}
              {feedbackType === "error" && "Опишите найденную ошибку:"}
            </div>
            
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Ваши комментарии..."
              className="min-h-[80px]"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitFeedback}
                disabled={!feedbackText.trim()}
                variant="bio"
                size="sm"
              >
                Отправить отзыв
              </Button>
              <Button
                onClick={() => setShowFeedback(false)}
                variant="ghost"
                size="sm"
              >
                Отмена
              </Button>
            </div>
          </div>
        )}

        <div className="mt-3 text-xs text-muted-foreground">
          💡 Ваши отзывы помогают улучшать качество заданий для всех учеников
        </div>
      </CardContent>
    </Card>
  );
};
