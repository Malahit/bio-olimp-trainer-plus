export interface Question {
  id: string;
  type: "choice" | "matching" | "text" | "image";
  category: string;
  question: string;
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
}

export const questions: Question[] = [
  // Ботаника
  {
    id: "bot_001",
    type: "choice",
    category: "Ботаника",
    question: "Какие органы у кувшиночника видоизменились в ловчие аппараты?",
    options: ["Цветок", "Лист", "Стебель", "Корень"],
    correctAnswer: 1,
    explanation: "У растений рода Непентес (кувшиночник) листья преобразованы в кувшинчики для ловли насекомых. Это эволюционная адаптация к жизни на бедных азотом почвах.",
    points: 2,
    difficulty: "medium"
  },
  {
    id: "bot_002",
    type: "choice", 
    category: "Ботаника",
    question: "Что является универсальной элементарной единицей живого?",
    options: ["Атом", "Молекула", "Клетка", "Ткань"],
    correctAnswer: 2,
    explanation: "Клетка - основная структурная и функциональная единица всех живых организмов. Все живые существа состоят из одной или множества клеток.",
    points: 1,
    difficulty: "easy"
  },
  {
    id: "bot_003",
    type: "choice",
    category: "Ботаника", 
    question: "Где в растении происходит фотосинтез?",
    options: ["В корнях", "В хлоропластах", "В вакуолях", "В ядре"],
    correctAnswer: 1,
    explanation: "Фотосинтез происходит в хлоропластах - особых органеллах растительных клеток, содержащих зеленый пигмент хлорофилл.",
    points: 2,
    difficulty: "easy"
  },
  
  // Зоология
  {
    id: "zoo_001",
    type: "choice",
    category: "Зоология",
    question: "К какой группе животных относится дождевой червь?",
    options: ["Круглые черви", "Кольчатые черви", "Плоские черви", "Моллюски"],
    correctAnswer: 1,
    explanation: "Дождевой червь относится к кольчатым червям (тип Annelida). Их тело разделено на сегменты-кольца, что является характерной особенностью этого типа.",
    points: 2,
    difficulty: "medium"
  },
  {
    id: "zoo_002", 
    type: "choice",
    category: "Зоология",
    question: "Сколько камер имеет сердце у рыб?",
    options: ["Одну", "Две", "Три", "Четыре"],
    correctAnswer: 1,
    explanation: "У рыб двухкамерное сердце, состоящее из одного предсердия и одного желудочка. Это обеспечивает однокруговое кровообращение.",
    points: 2,
    difficulty: "medium"
  },
  {
    id: "zoo_003",
    type: "choice", 
    category: "Зоология",
    question: "Какое животное является хищником?",
    options: ["Заяц", "Корова", "Волк", "Олень"],
    correctAnswer: 2,
    explanation: "Волк - типичный хищник, который охотится на других животных. У хищников есть характерные признаки: острые клыки, когти, бинокулярное зрение.",
    points: 1,
    difficulty: "easy"
  },

  // Экология
  {
    id: "eco_001",
    type: "choice",
    category: "Экология", 
    question: "Что такое пищевая цепь?",
    options: [
      "Способ питания животных",
      "Последовательность передачи энергии от организма к организму",
      "Места обитания животных", 
      "Размножение растений"
    ],
    correctAnswer: 1,
    explanation: "Пищевая цепь - это последовательность организмов, где каждый последующий питается предыдущим. Она показывает путь передачи энергии в экосистеме.",
    points: 2,
    difficulty: "medium"
  },
  {
    id: "eco_002",
    type: "choice",
    category: "Экология",
    question: "Какие организмы называются продуцентами?",
    options: ["Хищники", "Растения", "Грибы", "Паразиты"],
    correctAnswer: 1,
    explanation: "Продуценты (производители) - это автотрофные организмы, главным образом растения, которые создают органические вещества из неорганических путем фотосинтеза.",
    points: 2,
    difficulty: "medium"
  },

  // Анатомия человека
  {
    id: "ana_001", 
    type: "choice",
    category: "Анатомия",
    question: "Сколько костей в скелете взрослого человека?",
    options: ["156", "206", "256", "306"],
    correctAnswer: 1,
    explanation: "В скелете взрослого человека насчитывается около 206 костей. У новорожденных костей больше (около 270), но с возрастом некоторые срастаются.",
    points: 2,
    difficulty: "hard"
  },
  {
    id: "ana_002",
    type: "choice", 
    category: "Анатомия",
    question: "Где находится самая маленькая кость человека?",
    options: ["В пальце", "В ухе", "В носу", "В запястье"],
    correctAnswer: 1,
    explanation: "Самая маленькая кость человека - стремечко (стремя) - находится в среднем ухе. Её длина всего 2-3,5 мм.",
    points: 3,
    difficulty: "hard"
  }
];

export const categories = [
  {
    id: "botany",
    name: "Ботаника", 
    description: "Растения, грибы, фотосинтез",
    icon: "🌿",
    color: "botany" as const
  },
  {
    id: "zoology", 
    name: "Зоология",
    description: "Животные, адаптации, классификация", 
    icon: "🦉",
    color: "zoology" as const
  },
  {
    id: "ecology",
    name: "Экология",
    description: "Экосистемы, пищевые цепи, среда обитания",
    icon: "🌍", 
    color: "ecology" as const
  },
  {
    id: "anatomy",
    name: "Анатомия",
    description: "Строение человека, системы органов",
    icon: "🫀",
    color: "anatomy" as const
  }
];

export const getQuestionsByCategory = (categoryId: string): Question[] => {
  return questions.filter(q => q.category.toLowerCase() === categoryId.toLowerCase());
};

export const getUserProgress = () => {
  const saved = localStorage.getItem('bioOlympProgress');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    completedQuestions: [],
    scores: {
      botany: 0,
      zoology: 0, 
      ecology: 0,
      anatomy: 0
    },
    totalPoints: 0,
    achievements: []
  };
};

export const saveUserProgress = (progress: any) => {
  localStorage.setItem('bioOlympProgress', JSON.stringify(progress));
};