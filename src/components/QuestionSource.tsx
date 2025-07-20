
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Users, Award } from "lucide-react";

interface QuestionSourceProps {
  sources?: {
    textbook?: string;
    olympiad?: string;
    expert?: string;
    year?: number;
    difficulty?: string;
    verifiedBy?: string;
  };
  relatedTopics?: string[];
  onViewSource?: (source: string) => void;
}

export const QuestionSource = ({ sources, relatedTopics, onViewSource }: QuestionSourceProps) => {
  if (!sources && !relatedTopics?.length) return null;

  return (
    <Card className="mt-4 bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Источники и дополнительная информация
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {sources?.textbook && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{sources.textbook}</span>
            </div>
            {onViewSource && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewSource(sources.textbook)}
                className="h-6 px-2"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}

        {sources?.olympiad && (
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {sources.olympiad}
              {sources.year && ` (${sources.year})`}
            </span>
            {sources.difficulty && (
              <Badge variant="secondary" className="text-xs">
                {sources.difficulty}
              </Badge>
            )}
          </div>
        )}

        {sources?.expert && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Проверено: {sources.expert}</span>
            <Badge variant="default" className="text-xs bg-success text-success-foreground">
              ✓ Верифицировано
            </Badge>
          </div>
        )}

        {relatedTopics && relatedTopics.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-2">Связанные темы:</div>
            <div className="flex flex-wrap gap-1">
              {relatedTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 text-xs text-muted-foreground border-t border-border/50">
          📚 Рекомендуем изучить теоретический материал по данной теме перед решением задач
        </div>
      </CardContent>
    </Card>
  );
};
