
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
  correctIndex?: number;
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
