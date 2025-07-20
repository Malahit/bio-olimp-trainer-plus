
import { useState, useCallback } from "react";

interface FeedbackData {
  questionId: string;
  feedback: string;
  type: "positive" | "negative" | "error";
  timestamp: number;
}

interface QuestionStats {
  [questionId: string]: {
    positive: number;
    negative: number;
    errors: number;
    totalFeedback: number;
    flagged: boolean;
  };
}

export const useQuestionFeedback = () => {
  const [questionStats, setQuestionStats] = useState<QuestionStats>(() => {
    const saved = localStorage.getItem('bio-question-stats');
    return saved ? JSON.parse(saved) : {};
  });

  const submitFeedback = useCallback((questionId: string, feedback: string, type: "positive" | "negative" | "error") => {
    const feedbackData: FeedbackData = {
      questionId,
      feedback,
      type,
      timestamp: Date.now()
    };

    // Сохраняем отзыв
    const existingFeedback = JSON.parse(localStorage.getItem('bio-question-feedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('bio-question-feedback', JSON.stringify(existingFeedback));

    // Обновляем статистику
    setQuestionStats(prev => {
      const current = prev[questionId] || {
        positive: 0,
        negative: 0,
        errors: 0,
        totalFeedback: 0,
        flagged: false
      };

      const updated = {
        ...current,
        [type]: current[type] + 1,
        totalFeedback: current.totalFeedback + 1,
        flagged: type === "error" || (current.negative + (type === "negative" ? 1 : 0)) > 2
      };

      const newStats = { ...prev, [questionId]: updated };
      localStorage.setItem('bio-question-stats', JSON.stringify(newStats));
      return newStats;
    });

    console.log(`Отзыв отправлен для вопроса ${questionId}:`, feedbackData);
  }, []);

  const getQuestionStatus = useCallback((questionId: string) => {
    const stats = questionStats[questionId];
    if (!stats) return "pending";
    
    if (stats.flagged) return "flagged";
    if (stats.positive > 5 && stats.negative <= 1) return "verified";
    return "pending";
  }, [questionStats]);

  const getQuestionStats = useCallback((questionId: string) => {
    return questionStats[questionId] || {
      positive: 0,
      negative: 0,
      errors: 0,
      totalFeedback: 0,
      flagged: false
    };
  }, [questionStats]);

  return {
    submitFeedback,
    getQuestionStatus,
    getQuestionStats,
    questionStats
  };
};
