
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import type { OlympiadQuestion, QuestionType } from '@/types/olympiad';

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'multiple_choice', label: 'Выбор ответа' },
  { value: 'true_false', label: 'Да/Нет' },
  { value: 'matching', label: 'Соответствие' },
  { value: 'open_answer', label: 'Открытый ответ' }
];

const themes = [
  'Ботаника',
  'Зоология', 
  'Экология',
  'Анатомия',
  'Общая биология'
];

interface AddQuestionFormProps {
  onSubmit: (question: OlympiadQuestion) => void;
}

export default function AddQuestionForm({ onSubmit }: AddQuestionFormProps) {
  const [type, setType] = useState<QuestionType>('multiple_choice');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState('0');
  const [theme, setTheme] = useState('');
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!question.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите текст вопроса",
        variant: "destructive"
      });
      return;
    }

    if (!theme) {
      toast({
        title: "Ошибка", 
        description: "Выберите тему вопроса",
        variant: "destructive"
      });
      return;
    }

    if (type === 'multiple_choice' && options.some(opt => !opt.trim())) {
      toast({
        title: "Ошибка",
        description: "Заполните все варианты ответов",
        variant: "destructive"
      });
      return;
    }

    const newQuestion: OlympiadQuestion = {
      id: `custom_${Date.now()}`,
      type,
      question: question.trim(),
      options: type === 'multiple_choice' ? options : [],
      correctIndex: type === 'multiple_choice' ? parseInt(correctIndex) : undefined,
      theme,
      explanation: explanation.trim() || `Правильный ответ: ${options[parseInt(correctIndex)] || 'Не указан'}`,
      difficulty,
      source: 'user-added',
      category: theme,
      points: difficulty * 10
    };

    onSubmit(newQuestion);
    
    // Сброс формы
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectIndex('0');
    setExplanation('');
    
    toast({
      title: "Успешно!",
      description: "Вопрос добавлен в базу",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📝 Добавить новый вопрос
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Тип вопроса</Label>
            <Select value={type} onValueChange={(value) => setType(value as QuestionType)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Тема</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тему" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Сложность</Label>
          <RadioGroup 
            value={difficulty.toString()} 
            onValueChange={(value) => setDifficulty(parseInt(value) as 1 | 2 | 3)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="diff1" />
              <Label htmlFor="diff1">Легкая</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="diff2" />
              <Label htmlFor="diff2">Средняя</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="diff3" />
              <Label htmlFor="diff3">Сложная</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="question">Текст вопроса</Label>
          <Textarea
            id="question"
            placeholder="Введите текст вопроса..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {type === 'multiple_choice' && (
          <div className="space-y-4">
            <Label>Варианты ответов</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroup
                    value={correctIndex}
                    onValueChange={setCorrectIndex}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={i.toString()} id={`opt${i}`} />
                      <Label htmlFor={`opt${i}`} className="text-sm">
                        {String.fromCharCode(65 + i)}
                      </Label>
                    </div>
                  </RadioGroup>
                  <Input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[i] = e.target.value;
                      setOptions(newOpts);
                    }}
                    placeholder={`Вариант ${String.fromCharCode(65 + i)}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="explanation">Объяснение (опционально)</Label>
          <Textarea
            id="explanation"
            placeholder="Объясните правильный ответ..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full"
          variant="bio"
        >
          Добавить вопрос
        </Button>
      </CardContent>
    </Card>
  );
}
