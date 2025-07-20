
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressData {
  topic: string;
  name: string;
  completed: number;
  total: number;
  color: string;
}

interface ProgressChartProps {
  data: ProgressData[];
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Прогресс по темам</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => {
            const percentage = item.total > 0 ? (item.completed / item.total) * 100 : 0;
            
            return (
              <div key={item.topic} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.completed}/{item.total} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-700"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: `hsl(var(--${item.color}))`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
