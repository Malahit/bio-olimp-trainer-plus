import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopicCard } from "@/components/TopicCard";
import { StatsCard } from "@/components/StatsCard";
import { QuestionCard } from "@/components/QuestionCard";
import { AchievementCard } from "@/components/AchievementCard";
import { ProgressChart } from "@/components/ProgressChart";
import { UserStats } from "@/components/UserStats";
import AddQuestionForm from "@/components/olympiad/AddQuestionForm";
import QuestionBank from "@/components/olympiad/QuestionBank";
import { categories, questions, getUserProgress, saveUserProgress } from "@/data/questions";
import { analyzeQuestions, getQuestionStats } from "@/lib/patternAnalysis";
import { useToast } from "@/hooks/use-toast";
import type { OlympiadQuestion } from "@/types/olympiad";
import bioHeroImage from "@/assets/bio-hero.jpg";

const Index = () => {
  const [currentView, setCurrentView] = useState<"dashboard" | "practice" | "achievements" | "management">("dashboard");
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userProgress, setUserProgress] = useState(getUserProgress());
  const [practiceQuestions, setPracticeQuestions] = useState(questions);
  const [userQuestions, setUserQuestions] = useState<OlympiadQuestion[]>([]);
  const [allQuestions, setAllQuestions] = useState(questions);
  const [sessionStartTime] = useState(Date.now());
  const { toast } = useToast();

  // Функция для конвертации OlympiadQuestion в Question
  const convertOlympiadToQuestion = (q: OlympiadQuestion) => ({
    ...q,
    type: q.type === 'multiple_choice' ? 'choice' as const : 
          q.type === 'true_false' ? 'choice' as const :
          q.type === 'matching' ? 'matching' as const : 'text' as const,
    correctAnswer: q.correctAnswer || (q.correctIndex !== undefined ? q.options[q.correctIndex] : ''),
    category: q.category || q.theme,
    points: q.points || 10, // Ensure points is always defined
    difficulty: typeof q.difficulty === 'string' ? 
      (q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3) : 
      q.difficulty || 2,
    explanation: q.explanation || '',
    options: q.options || []
  });

  // Загрузка пользовательских вопросов при старте
  useEffect(() => {
    const savedQuestions = localStorage.getItem('userOlympiadQuestions');
    if (savedQuestions) {
      const parsed = JSON.parse(savedQuestions);
      setUserQuestions(parsed);
      // Convert OlympiadQuestion to Question format for compatibility
      const convertedQuestions = parsed.map(convertOlympiadToQuestion);
      setAllQuestions([...questions, ...convertedQuestions]);
    }
  }, []);

  useEffect(() => {
    saveUserProgress(userProgress);
  }, [userProgress]);

  // Сохранение пользовательских вопросов
  const saveUserQuestions = (newQuestions: OlympiadQuestion[]) => {
    localStorage.setItem('userOlympiadQuestions', JSON.stringify(newQuestions));
    setUserQuestions(newQuestions);
    // Convert to Question format for compatibility
    const convertedQuestions = newQuestions.map(convertOlympiadToQuestion);
    setAllQuestions([...questions, ...convertedQuestions]);
  };

  // Добавление нового вопроса
  const handleAddQuestion = (newQuestion: OlympiadQuestion) => {
    const updatedQuestions = [...userQuestions, newQuestion];
    saveUserQuestions(updatedQuestions);
    toast({
      title: "Вопрос добавлен! 🎉",
      description: "Новый вопрос успешно добавлен в базу данных.",
    });
  };

  // Удаление вопроса
  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = userQuestions.filter(q => q.id !== questionId);
    saveUserQuestions(updatedQuestions);
    toast({
      title: "Вопрос удален",
      description: "Вопрос успешно удален из базы данных.",
    });
  };

  // Система достижений
  const achievements = [
    {
      id: "first_steps",
      title: "Первые шаги",
      description: "Решите первые 5 заданий",
      icon: "🌱",
      requirement: 5,
      currentProgress: userProgress.completedQuestions.length,
      isUnlocked: userProgress.completedQuestions.length >= 5,
      points: 10
    },
    {
      id: "question_creator",
      title: "Создатель вопросов",
      description: "Добавьте свои 5 вопросов",
      icon: "✍️",
      requirement: 5,
      currentProgress: userQuestions.length,
      isUnlocked: userQuestions.length >= 5,
      points: 25
    },
    {
      id: "botanist",
      title: "Ботаник",
      description: "Изучите все задания по ботанике",
      icon: "🌿",
      requirement: questions.filter(q => q.category === "Ботаника").length,
      currentProgress: questions.filter(q => 
        q.category === "Ботаника" && userProgress.completedQuestions.includes(q.id)
      ).length,
      isUnlocked: questions.filter(q => 
        q.category === "Ботаника" && userProgress.completedQuestions.includes(q.id)
      ).length === questions.filter(q => q.category === "Ботаника").length,
      points: 50
    },
    {
      id: "zoologist",
      title: "Зоолог",
      description: "Изучите все задания по зоологии",
      icon: "🦉",
      requirement: questions.filter(q => q.category === "Зоология").length,
      currentProgress: questions.filter(q => 
        q.category === "Зоология" && userProgress.completedQuestions.includes(q.id)
      ).length,
      isUnlocked: questions.filter(q => 
        q.category === "Зоология" && userProgress.completedQuestions.includes(q.id)
      ).length === questions.filter(q => q.category === "Зоология").length,
      points: 50
    },
    {
      id: "points_master",
      title: "Мастер баллов",
      description: "Наберите 500 баллов",
      icon: "⭐",
      requirement: 500,
      currentProgress: userProgress.totalPoints,
      isUnlocked: userProgress.totalPoints >= 500,
      points: 100
    }
  ];

  const handleTopicClick = (topicId: string) => {
    setCurrentTopic(topicId);
    const topicQuestions = allQuestions.filter(q => q.category === topicId);
    setPracticeQuestions(topicQuestions);
    setCurrentQuestionIndex(0);
    setCurrentView("practice");
  };

  const handleStartPractice = () => {
    setPracticeQuestions(allQuestions);
    setCurrentQuestionIndex(0);
    setCurrentView("practice");
  };

  const handleAnswer = (questionId: string, userAnswer: any, isCorrect: boolean) => {
    const question = allQuestions.find(q => q.id === questionId);
    if (!question) return;

    const newProgress = { ...userProgress };
    
    if (!newProgress.completedQuestions.includes(questionId)) {
      newProgress.completedQuestions.push(questionId);
      
      if (isCorrect) {
        newProgress.totalPoints += question.points || 10;
        const category = question.category?.toLowerCase();
        if (category && newProgress.scores[category] !== undefined) {
          newProgress.scores[category] += question.points || 10;
        }
      }
    }

    setUserProgress(newProgress);

    if (isCorrect) {
      toast({
        title: "Правильно! 🎉",
        description: `Вы получили ${question.points || 10} ${(question.points || 10) === 1 ? 'балл' : 'балла'}!`,
      });
    }
  };

  const getTopicProgress = (topicId: string) => {
    const topicQuestions = allQuestions.filter(q => q.category === topicId);
    const completedCount = topicQuestions.filter(q => 
      userProgress.completedQuestions.includes(q.id)
    ).length;
    
    return {
      completed: completedCount,
      total: topicQuestions.length,
      percentage: topicQuestions.length > 0 ? (completedCount / topicQuestions.length) * 100 : 0
    };
  };

  const totalQuestions = allQuestions.length;
  const completedQuestions = userProgress.completedQuestions.length;
  const overallProgress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  // Данные для графика прогресса
  const progressData = categories.map(category => {
    const progress = getTopicProgress(category.name);
    return {
      topic: category.id,
      name: category.name,
      completed: progress.completed,
      total: progress.total,
      color: category.color || "primary"
    };
  });

  // Анализ вопросов - convert to OlympiadQuestion format
  const olympiadQuestions = allQuestions.map(q => ({
    id: q.id,
    type: 'multiple_choice' as const,
    question: q.question,
    options: q.options || [],
    correctAnswer: String(q.correctAnswer || ''), // Ensure it's always a string
    theme: q.category || 'general',
    explanation: q.explanation || '',
    difficulty: (typeof q.difficulty === 'string' ? 
      (q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3) : 
      q.difficulty || 2) as 1 | 2 | 3,
    source: 'default',
    category: q.category || 'general',
    points: q.points || 10,
    correctIndex: q.options?.findIndex(opt => opt === q.correctAnswer) || 0
  }));
  
  const questionAnalysis = analyzeQuestions(olympiadQuestions);
  const questionStats = getQuestionStats(olympiadQuestions);

  if (currentView === "practice" && practiceQuestions.length > 0) {
    const currentQuestion = practiceQuestions[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView("dashboard")}
              className="hover:bg-muted"
            >
              ← Назад к главной
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                Вопрос {currentQuestionIndex + 1} из {practiceQuestions.length}
              </Badge>
              <Badge variant="secondary">
                💎 {userProgress.totalPoints} баллов
              </Badge>
            </div>
          </div>

          <div className="animate-fade-in">
            <QuestionCard 
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNext={() => {
                if (currentQuestionIndex < practiceQuestions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else {
                  setCurrentView("dashboard");
                  toast({
                    title: "Тренировка завершена! 🏆",
                    description: "Отличная работа! Ваш прогресс сохранён.",
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок */}
      <header className="bg-gradient-primary text-primary-foreground shadow-bio">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🧬</div>
              <div>
                <h1 className="text-3xl font-bold">БиоОлимп Тренажёр</h1>
                <p className="text-primary-foreground/80">Интерактивная подготовка к олимпиадам по биологии</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{userProgress.totalPoints}</div>
              <div className="text-sm text-primary-foreground/80">баллов заработано</div>
            </div>
          </div>
        </div>
      </header>

      {/* Героическая секция */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${bioHeroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-glow/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">
              Изучай биологию интерактивно! 🧬
            </h2>
            <p className="text-xl mb-6 text-white/90 animate-fade-in">
              Подготовься к олимпиадам с помощью интерактивных заданий, 
              геймификации и персонального трекинга прогресса
            </p>
            <div className="flex gap-4 animate-fade-in">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={handleStartPractice}
                className="shadow-glow hover:scale-105"
              >
                🚀 Начать изучение
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentView("management")}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                📝 Управление вопросами
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="topics">Темы</TabsTrigger>
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
            <TabsTrigger value="achievements">Достижения</TabsTrigger>
            <TabsTrigger value="management">Управление</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Статистика пользователя */}
            <UserStats
              totalPoints={userProgress.totalPoints}
              completedQuestions={completedQuestions}
              totalQuestions={totalQuestions}
              currentStreak={3}
              averageScore={85}
              timeSpent={120}
            />

            {/* Статистика вопросов */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard 
                title="Всего вопросов"
                value={questionStats.total}
                icon="📊"
                subtitle={`${questionStats.bySource.userAdded} добавлено вами`}
              />
              <StatsCard 
                title="Популярная тема"
                value={questionAnalysis.topThemes[0]?.name || 'Нет данных'}
                icon="🎯"
                subtitle={`${questionAnalysis.topThemes[0]?.percent || 0}% от общего`}
              />
              <StatsCard 
                title="Сложность"
                value={`${questionStats.byDifficulty[2]} средних`}
                icon="⚡"
                subtitle={`${questionStats.byDifficulty[1]} легких, ${questionStats.byDifficulty[3]} сложных`}
              />
            </div>

            {/* Быстрый старт */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Начать тренировку</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="bio" 
                  size="lg" 
                  className="h-16 text-lg"
                  onClick={handleStartPractice}
                >
                  🎯 Все темы - Случайные вопросы
                </Button>
                <Button 
                  variant="leaf" 
                  size="lg" 
                  className="h-16 text-lg"
                  onClick={() => {
                    const incorrectQuestions = allQuestions.filter(q => 
                      !userProgress.completedQuestions.includes(q.id)
                    );
                    if (incorrectQuestions.length > 0) {
                      setPracticeQuestions(incorrectQuestions);
                      setCurrentQuestionIndex(0);
                      setCurrentView("practice");
                    } else {
                      toast({
                        title: "🎉 Все задания выполнены!",
                        description: "Вы большой молодец! Попробуйте повторить изученное.",
                      });
                    }
                  }}
                >
                  🔄 Неизученные темы
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Темы для изучения</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const progress = getTopicProgress(category.name);
                return (
                  <TopicCard
                    key={category.id}
                    title={category.name}
                    description={category.description}
                    icon={category.icon}
                    progress={progress.percentage}
                    totalQuestions={progress.total}
                    completedQuestions={progress.completed}
                    onClick={() => handleTopicClick(category.name)}
                    color={category.color}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Ваш прогресс</h2>
            <ProgressChart data={progressData} />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Достижения</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Управление вопросами</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AddQuestionForm onSubmit={handleAddQuestion} />
              <QuestionBank 
                questions={userQuestions}
                onQuestionDelete={handleDeleteQuestion}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
