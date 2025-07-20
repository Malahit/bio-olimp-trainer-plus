
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserStatsProps {
  totalPoints: number;
  completedQuestions: number;
  totalQuestions: number;
  currentStreak: number;
  averageScore: number;
  timeSpent: number; // в минутах
}

export const UserStats = ({ 
  totalPoints, 
  completedQuestions, 
  totalQuestions, 
  currentStreak, 
  averageScore,
  timeSpent 
}: UserStatsProps) => {
  const completionRate = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
  const level = Math.floor(totalPoints / 100) + 1;
  const pointsToNextLevel = (level * 100) - totalPoints;
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}ч ${mins}м`;
    }
    return `${mins}м`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Уровень</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{level}</div>
          <p className="text-xs text-muted-foreground">
            До {level + 1} уровня: {pointsToNextLevel} баллов
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Общий прогресс</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
          <p className="text-xs text-muted-foreground">
            {completedQuestions} из {totalQuestions} заданий
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Серия побед</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-lg">🔥</div>
          </div>
          <p className="text-xs text-muted-foreground">
            дней подряд
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Время обучения</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{formatTime(timeSpent)}</div>
          <p className="text-xs text-muted-foreground">
            всего изучено
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
