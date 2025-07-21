
// types/olympiad.d.ts
export type QuestionType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'matching' 
  | 'open_answer';

export interface OlympiadQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer?: string; // Changed from correctIndex to align with existing Question type
  correctIndex?: number; // Keep for backward compatibility
  theme: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
  source?: string;
  category?: string;
  points?: number;
}

export interface QuestionAnalysis {
  totalQuestions: number;
  topThemes: Array<{
    name: string;
    count: number;
    percent: number;
  }>;
  typeDistribution: Record<string, number>;
}
