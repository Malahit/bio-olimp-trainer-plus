
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ThemeBadgeProps {
  theme: string;
  className?: string;
}

export const ThemeBadge = ({ theme, className }: ThemeBadgeProps) => {
  const getThemeColor = (theme: string) => {
    switch (theme.toLowerCase()) {
      case 'зоология':
      case 'zoology':
        return 'bg-amber-100 text-amber-800';
      case 'ботаника':
      case 'botany':
        return 'bg-green-100 text-green-800';
      case 'экология':
      case 'ecology':
        return 'bg-blue-100 text-blue-800';
      case 'анатомия':
      case 'anatomy':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn(getThemeColor(theme), className)}
    >
      {theme}
    </Badge>
  );
};
