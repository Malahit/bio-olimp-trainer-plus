
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  points: number;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const progressPercentage = Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);
  
  return (
    <Card className={`transition-all duration-300 ${
      achievement.isUnlocked 
        ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-md" 
        : "bg-muted/50 border-muted"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${achievement.isUnlocked ? '' : 'grayscale opacity-50'}`}>
              {achievement.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
          {achievement.isUnlocked && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              +{achievement.points} баллов
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Прогресс</span>
            <span>{achievement.currentProgress}/{achievement.requirement}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                achievement.isUnlocked ? 'bg-yellow-500' : 'bg-primary'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
