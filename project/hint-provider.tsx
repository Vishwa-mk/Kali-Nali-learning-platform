'use client';

import { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHintAction } from '@/app/actions';
import type { Segment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface HintProviderProps {
  segment: Segment;
  solutionAttempt: string;
}

type Hint = {
  hint: string;
  explanation: string;
};

export function HintProvider({ segment, solutionAttempt }: HintProviderProps) {
  const [hint, setHint] = useState<Hint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetHint = async () => {
    setIsLoading(true);
    setError(null);
    setHint(null);
    try {
      const result = await getHintAction(segment, solutionAttempt);
      setHint(result);
    } catch (e) {
      setError('Failed to load hint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGetHint} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Hint...
          </>
        ) : (
          <>
            <Lightbulb className="mr-2 h-4 w-4" />
            I'm Stuck, Get a Hint
          </>
        )}
      </Button>

      {error && (
         <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hint && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Lightbulb className="h-5 w-5 text-chart-4" />
              Adaptive Hint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Suggestion</h3>
              <p className="text-sm text-muted-foreground">{hint.hint}</p>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Explanation</h3>
                <p className="text-sm text-muted-foreground">{hint.explanation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
