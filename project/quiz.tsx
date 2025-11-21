'use client';

import { useState } from 'react';
import type { ProjectQuiz } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, X, ChevronsRight, Repeat, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppState, useAppDispatch } from '@/lib/state';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface QuizProps {
  quiz: ProjectQuiz;
}

export function Quiz({ quiz }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showBadgeAlert, setShowBadgeAlert] = useState(false);
  const router = useRouter();

  const { projects, currentUser } = useAppState();
  const dispatch = useAppDispatch();
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestion.id];
  const isCorrect = selectedOption === currentQuestion.correctAnswer;
  const projectName = projects.find(p => p.id === quiz.projectId)?.title || 'Project';

  const handleSelectOption = (option: string) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const calculateScore = () => {
    return quiz.questions.reduce((score, question) => {
        return selectedAnswers[question.id] === question.correctAnswer ? score + 1 : score;
    }, 0);
  };
  
  const handleSubmit = () => {
    if (!selectedOption) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    setSubmitted(false);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const score = calculateScore();
      const totalQuestions = quiz.questions.length;
      
      const wasPerfectScore = score === totalQuestions;
      const hadBadgeBefore = currentUser.badges.some(b => b.id === 'b6');

      dispatch({
        type: 'SUBMIT_QUIZ',
        payload: {
          projectId: quiz.projectId,
          score,
          totalQuestions
        }
      });
      
      setQuizFinished(true);
      
      if (wasPerfectScore && !hadBadgeBefore) {
        setShowBadgeAlert(true);
      }
    }
  };


  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ', payload: { projectId: quiz.projectId }});
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const score = calculateScore();
    const totalQuestions = quiz.questions.length;
    const chartData = [
        { name: 'Correct', value: score },
        { name: 'Incorrect', value: totalQuestions - score },
    ];
    const COLORS = ['hsl(var(--accent))', 'hsl(var(--destructive))'];

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Quiz Results for "{projectName}"</CardTitle>
                <CardDescription>You scored {score} out of {totalQuestions}!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6">
                <div className="w-full h-52">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, value }) => `${name}: ${value}`}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-4">
                    <Button onClick={resetQuiz} variant="outline">
                        <Repeat className="mr-2 h-4 w-4" />
                        Retake Quiz
                    </Button>
                    <Button onClick={() => router.push('/profile')}>
                        View My Profile
                        <ChevronsRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
        <AlertDialog open={showBadgeAlert} onOpenChange={setShowBadgeAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-chart-4" />
                        New Badge Unlocked!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Congratulations! You've earned the "Quiz Whiz" badge for acing the quiz.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setShowBadgeAlert(false)}>Awesome!</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{projectName} Quiz</CardTitle>
        <CardDescription>Test your knowledge on what you've learned.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p className="font-semibold mb-4">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}: {currentQuestion.question}
          </p>
          
          <RadioGroup 
            value={selectedOption} 
            onValueChange={handleSelectOption}
            className="space-y-2"
          >
            {currentQuestion.options.map(option => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = currentQuestion.correctAnswer === option;
              
              return (
                <Label
                  key={option}
                  className={cn(
                    "flex items-center gap-3 rounded-md border p-3 transition-colors",
                    "cursor-pointer hover:bg-muted",
                    submitted && isCorrectAnswer && "border-accent bg-accent/20 text-accent-foreground",
                    submitted && isSelected && !isCorrectAnswer && "border-destructive bg-destructive/20 text-destructive-foreground"
                  )}
                >
                  <RadioGroupItem value={option} />
                  <span>{option}</span>
                  {submitted && isCorrectAnswer && <Check className="ml-auto h-5 w-5 text-accent" />}
                  {submitted && isSelected && !isCorrectAnswer && <X className="ml-auto h-5 w-5 text-destructive" />}
                </Label>
              );
            })}
          </RadioGroup>

          <div className="mt-6 flex justify-end">
            {!submitted ? (
              <Button onClick={handleSubmit} disabled={!selectedOption}>Submit Answer</Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ChevronsRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
