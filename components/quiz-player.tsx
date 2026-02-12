"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { QuizQuestion } from "@/lib/quiz";

type Props = {
  questions: QuizQuestion[];
};

export function QuizPlayer({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const completion = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      return total + (answers[question.id] === question.answerIndex ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  function updateAnswer(questionId: string, answerIndex: number) {
    if (submitted) {
      return;
    }

    setAnswers((current) => ({ ...current, [questionId]: answerIndex }));
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="flex flex-col gap-6">
      <Card className="gap-3 py-4">
        <CardContent className="space-y-3 px-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-muted-foreground">
              {answeredCount}/{questions.length} answered
            </p>
            {submitted ? (
              <p className="font-semibold text-foreground">
                Score: {score}/{questions.length}
              </p>
            ) : null}
          </div>
          <Progress value={completion} />
        </CardContent>
      </Card>

      <ol className="flex flex-col gap-4">
        {questions.map((question, index) => {
          const selectedAnswer = answers[question.id];
          const isAnswered = selectedAnswer !== undefined;

          return (
            <li key={question.id}>
              <Card className="gap-4 py-4">
                <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
                  <CardTitle className="text-base">
                    {index + 1}. {question.question}
                  </CardTitle>
                  <Badge variant="outline">{question.difficulty}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <RadioGroup
                    value={selectedAnswer?.toString()}
                    onValueChange={(value) => updateAnswer(question.id, Number(value))}
                    disabled={submitted}
                    className="gap-2"
                  >
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswer === optionIndex;
                      const isCorrect = optionIndex === question.answerIndex;

                      let optionClassName =
                        "flex items-start gap-3 rounded-md border p-3 transition";

                      if (submitted && isCorrect) {
                        optionClassName +=
                          " border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40";
                      } else if (submitted && isSelected && !isCorrect) {
                        optionClassName +=
                          " border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40";
                      } else if (isSelected) {
                        optionClassName += " border-ring bg-accent/40 text-foreground";
                      } else {
                        optionClassName += " border-border bg-background hover:bg-accent/30";
                      }

                      const inputId = `${question.id}-${optionIndex}`;

                      return (
                        <div key={inputId} className={optionClassName}>
                          <RadioGroupItem value={optionIndex.toString()} id={inputId} />
                          <Label htmlFor={inputId} className="leading-relaxed font-normal">
                            {option}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>

                  {submitted && isAnswered ? (
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-3">
        {submitted ? (
          <Button type="button" onClick={resetQuiz} variant="outline">
            Retry quiz
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={answeredCount !== questions.length}
          >
            Submit answers
          </Button>
        )}
      </div>
    </section>
  );
}

