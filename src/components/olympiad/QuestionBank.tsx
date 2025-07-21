
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeBadge } from "@/components/ui/ThemeBadge";
import { Trash2, Search } from "lucide-react";
import type { OlympiadQuestion } from '@/types/olympiad';

interface QuestionBankProps {
  questions: OlympiadQuestion[];
  onQuestionSelect?: (question: OlympiadQuestion) => void;
  onQuestionDelete?: (questionId: string) => void;
}

export default function QuestionBank({ 
  questions, 
  onQuestionSelect, 
  onQuestionDelete 
}: QuestionBankProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'all' || q.theme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const themes = Array.from(new Set(questions.map(q => q.theme)));

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🗂️ База вопросов
          </span>
          <Badge variant="outline">
            {filteredQuestions.length} из {questions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Фильтры */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по тексту вопроса..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">Все темы</option>
            {themes.map(theme => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>

        {/* Список вопросов */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {questions.length === 0 
                ? "Пока нет добавленных вопросов"
                : "Нет вопросов, соответствующих фильтрам"
              }
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onQuestionSelect?.(question)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ThemeBadge theme={question.theme} />
                      <Badge 
                        variant="outline" 
                        className={getDifficultyColor(question.difficulty)}
                      >
                        Сложность: {question.difficulty}
                      </Badge>
                      {question.source === 'user-added' && (
                        <Badge variant="secondary">
                          Ваш
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium mb-2 line-clamp-2">
                      {question.question}
                    </p>
                    {question.type === 'multiple_choice' && (
                      <div className="text-xs text-muted-foreground">
                        Вариантов ответов: {question.options.length}
                      </div>
                    )}
                  </div>
                  
                  {onQuestionDelete && question.source === 'user-added' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuestionDelete(question.id);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
