import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
  trend?: "up" | "down" | "stable";
  variant?: "default" | "success" | "warning" | "info";
}

export const StatsCard = ({
  title,
  value,
  icon,
  description,
  trend,
  variant = "default"
}: StatsCardProps) => {
  const variantStyles = {
    default: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
    success: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
    warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
    info: "border-info/20 bg-gradient-to-br from-info/5 to-info/10"
  };

  const trendIcon = {
    up: "📈",
    down: "📉",
    stable: "➡️"
  };

  return (
    <Card className={`transition-all duration-300 hover:scale-105 hover:shadow-bio ${variantStyles[variant]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {trend && <span>{trendIcon[trend]}</span>}
            <span>{description}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};