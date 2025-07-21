
import type { OlympiadQuestion, QuestionAnalysis } from '@/types/olympiad';

export const analyzeQuestions = (questions: OlympiadQuestion[]): QuestionAnalysis => {
  if (questions.length === 0) {
    return {
      totalQuestions: 0,
      topThemes: [],
      typeDistribution: {}
    };
  }
  
  // Анализ тем
  const themeCount: Record<string, number> = {};
  questions.forEach(q => {
    themeCount[q.theme] = (themeCount[q.theme] || 0) + 1;
  });
  
  const total = questions.length;
  const topThemes = Object.entries(themeCount)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Анализ типов вопросов
  const typePatterns = {
    multiple_choice: /выберите|какой|что из|вариант/i,
    true_false: /правда ли|верно ли|согласны ли/i,
    matching: /соответств|установите|сопоставьте/i,
    open_answer: /объясните|опишите|назовите/i
  };
  
  const typeDistribution: Record<string, number> = {};
  questions.forEach(q => {
    const questionText = q.question.toLowerCase();
    let detectedType = q.type || 'other';
    
    // Если тип не указан, пытаемся определить по тексту
    if (!q.type) {
      for (const [type, pattern] of Object.entries(typePatterns)) {
        if (pattern.test(questionText)) {
          detectedType = type;
          break;
        }
      }
    }
    
    typeDistribution[detectedType] = (typeDistribution[detectedType] || 0) + 1;
  });
  
  // Конвертация в проценты
  for (const type in typeDistribution) {
    typeDistribution[type] = Math.round((typeDistribution[type] / total) * 100);
  }
  
  return {
    totalQuestions: total,
    topThemes,
    typeDistribution
  };
};

export const getQuestionStats = (questions: OlympiadQuestion[]) => {
  const stats = {
    total: questions.length,
    byDifficulty: { 1: 0, 2: 0, 3: 0 },
    bySource: { original: 0, userAdded: 0 },
    byTheme: {} as Record<string, number>
  };

  questions.forEach(q => {
    stats.byDifficulty[q.difficulty]++;
    stats.bySource[q.source === 'user-added' ? 'userAdded' : 'original']++;
    stats.byTheme[q.theme] = (stats.byTheme[q.theme] || 0) + 1;
  });

  return stats;
};
