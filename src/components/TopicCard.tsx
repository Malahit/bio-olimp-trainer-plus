import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TopicCardProps {
  title: string;
  description: string;
  icon: string;
  progress: number;
  totalQuestions: number;
  completedQuestions: number;
  onClick: () => void;
  color?: "botany" | "zoology" | "ecology" | "anatomy";
}

export const TopicCard = ({
  title,
  description,
  icon,
  progress,
  totalQuestions,
  completedQuestions,
  onClick,
  color = "botany"
}: TopicCardProps) => {
  const colorVariants = {
    botany: "hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 border-green-200",
    zoology: "hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 border-blue-200",
    ecology: "hover:bg-gradient-to-br hover:from-yellow-50 hover:to-yellow-100 border-yellow-200",
    anatomy: "hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 border-red-200"
  };

  return (
    <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-bio ${colorVariants[color]} animate-float`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-pulse">{icon}</div>
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Прогресс</span>
            <span>{completedQuestions}/{totalQuestions}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <Button 
            onClick={onClick} 
            variant="nature" 
            className="w-full"
          >
            Изучать
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};