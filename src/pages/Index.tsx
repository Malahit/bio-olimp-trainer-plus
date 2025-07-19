import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopicCard } from "@/components/TopicCard";
import { StatsCard } from "@/components/StatsCard";
import { QuestionCard } from "@/components/QuestionCard";
import { categories, questions, getUserProgress, saveUserProgress } from "@/data/questions";
import { useToast } from "@/hooks/use-toast";
import bioHeroImage from "@/assets/bio-hero.jpg";

const Index = () => {
  const [currentView, setCurrentView] = useState<"dashboard" | "practice" | "topic">("dashboard");
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userProgress, setUserProgress] = useState(getUserProgress());
  const [practiceQuestions, setPracticeQuestions] = useState(questions);
  const { toast } = useToast();

  useEffect(() => {
    saveUserProgress(userProgress);
  }, [userProgress]);

  const handleTopicClick = (topicId: string) => {
    setCurrentTopic(topicId);
    const topicQuestions = questions.filter(q => 
      q.category.toLowerCase() === topicId.toLowerCase()
    );
    setPracticeQuestions(topicQuestions);
    setCurrentQuestionIndex(0);
    setCurrentView("practice");
  };

  const handleStartPractice = () => {
    setPracticeQuestions(questions);
    setCurrentQuestionIndex(0);
    setCurrentView("practice");
  };

  const handleAnswer = (questionId: string, userAnswer: any, isCorrect: boolean) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const newProgress = { ...userProgress };
    
    if (!newProgress.completedQuestions.includes(questionId)) {
      newProgress.completedQuestions.push(questionId);
      
      if (isCorrect) {
        newProgress.totalPoints += question.points;
        const category = question.category.toLowerCase();
        if (newProgress.scores[category] !== undefined) {
          newProgress.scores[category] += question.points;
        }
      }
    }

    setUserProgress(newProgress);

    if (isCorrect) {
      toast({
        title: "Правильно! 🎉",
        description: `Вы получили ${question.points} ${question.points === 1 ? 'балл' : 'балла'}!`,
      });
    }

    // Переход к следующему вопросу через 3 секунды
    setTimeout(() => {
      if (currentQuestionIndex < practiceQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCurrentView("dashboard");
        toast({
          title: "Тренировка завершена! 🏆",
          description: "Отличная работа! Ваш прогресс сохранён.",
        });
      }
    }, 3000);
  };

  const getTopicProgress = (topicId: string) => {
    const topicQuestions = questions.filter(q => 
      q.category.toLowerCase() === topicId.toLowerCase()
    );
    const completedCount = topicQuestions.filter(q => 
      userProgress.completedQuestions.includes(q.id)
    ).length;
    
    return {
      completed: completedCount,
      total: topicQuestions.length,
      percentage: topicQuestions.length > 0 ? (completedCount / topicQuestions.length) * 100 : 0
    };
  };

  const totalQuestions = questions.length;
  const completedQuestions = userProgress.completedQuestions.length;
  const overallProgress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

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
              <div className="text-4xl animate-pulse">🧬</div>
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
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                📊 Посмотреть прогресс
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Общий прогресс"
            value={`${Math.round(overallProgress)}%`}
            icon="📊"
            description={`${completedQuestions}/${totalQuestions} заданий`}
            variant="success"
          />
          <StatsCard
            title="Баллы"
            value={userProgress.totalPoints}
            icon="💎"
            description="за правильные ответы"
            variant="info"
          />
          <StatsCard
            title="Изучено тем"
            value={categories.filter(cat => getTopicProgress(cat.id).completed > 0).length}
            icon="📚"
            description={`из ${categories.length} доступных`}
            variant="warning"
          />
          <StatsCard
            title="Уровень"
            value={Math.floor(userProgress.totalPoints / 10) + 1}
            icon="🏆"
            description="Натуралист-исследователь"
            variant="default"
          />
        </div>

        {/* Быстрый старт */}
        <div className="mb-8">
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
                const incorrectQuestions = questions.filter(q => 
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

        {/* Темы для изучения */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Темы для изучения</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const progress = getTopicProgress(category.id);
              return (
                <TopicCard
                  key={category.id}
                  title={category.name}
                  description={category.description}
                  icon={category.icon}
                  progress={progress.percentage}
                  totalQuestions={progress.total}
                  completedQuestions={progress.completed}
                  onClick={() => handleTopicClick(category.id)}
                  color={category.color}
                />
              );
            })}
          </div>
        </div>

        {/* Достижения */}
        {userProgress.completedQuestions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Ваши достижения</h2>
            <div className="flex flex-wrap gap-2">
              {userProgress.completedQuestions.length >= 5 && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  🌱 Первые шаги в биологии
                </Badge>
              )}
              {userProgress.totalPoints >= 20 && (
                <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                  🏆 Знаток биологии
                </Badge>
              )}
              {overallProgress >= 50 && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  🔬 Исследователь природы
                </Badge>
              )}
              {overallProgress === 100 && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  👨‍🔬 Мастер биологии
                </Badge>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
