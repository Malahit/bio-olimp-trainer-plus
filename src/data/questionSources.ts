
// Источники для вопросов - помогает улучшить достоверность
export const questionSources = {
  // Учебники
  textbooks: {
    "bio5_pasechnik": "Биология. 5 класс. Пасечник В.В.",
    "bio5_pleshakov": "Биология. 5 класс. Плешakov А.А., Сонин Н.И.",
    "bio5_sivoglazov": "Биология. 5 класс. Сивоглазов В.И.",
  },
  
  // Олимпиады
  olympiads: {
    "vos_2023": "Всероссийская олимпиада школьников 2023",
    "vos_2022": "Всероссийская олимпиада школьников 2022", 
    "municipal_2023": "Муниципальный этап 2023",
    "regional_2023": "Региональный этап 2023",
  },
  
  // Эксперты (для будущей верификации)
  experts: {
    "teacher_biology": "Учитель биологии высшей категории",
    "university_prof": "Профессор кафедры биологии",
    "olympiad_coach": "Тренер олимпиадной команды",
  }
};

// Соответствие вопросов и источников
export const questionSourceMapping: { [questionId: string]: {
  textbook?: string;
  olympiad?: string;
  expert?: string;
  year?: number;
  difficulty?: string;
  verifiedBy?: string;
}} = {
  // Примеры для демонстрации системы
  "botany_1": {
    textbook: questionSources.textbooks.bio5_pasechnik,
    olympiad: questionSources.olympiads.vos_2023,
    year: 2023,
    difficulty: "Школьный этап",
    verifiedBy: questionSources.experts.teacher_biology
  },
  
  "zoology_1": {
    textbook: questionSources.textbooks.bio5_pleshakov,
    year: 2023,
  },
  
  // Остальные вопросы пока без источников (сгенерированы ИИ)
};

// Связанные темы для углубленного изучения
export const relatedTopicsMapping: { [questionId: string]: string[] } = {
  "botany_1": ["Строение растительной клетки", "Фотосинтез", "Классификация растений"],
  "zoology_1": ["Систематика животных", "Адаптации", "Пищевые цепи"],
  "ecology_1": ["Экосистемы", "Биогеоценоз", "Охрана природы"],
  "anatomy_1": ["Системы органов", "Ткани", "Гомеостаз"],
};
