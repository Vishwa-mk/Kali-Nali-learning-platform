'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Segment } from '@/lib/types';
import { HintProvider } from './hint-provider';
import { CodeEditor } from './code-editor';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAppDispatch } from '@/lib/state';

interface SegmentItemProps {
  segment: Segment;
  isCurrent: boolean;
}

export function SegmentItem({ segment, isCurrent }: SegmentItemProps) {
  const [solution, setSolution] = useState('');
  const dispatch = useAppDispatch();

  const handleCompleteSegment = () => {
    dispatch({
      type: 'COMPLETE_SEGMENT',
      payload: {
        projectId: segment.projectId,
        segmentId: segment.id,
      }
    });
  };

  return (
    <div className='space-y-4'>
      <Tabs defaultValue="instructions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="solution">My Solution</TabsTrigger>
          <TabsTrigger value="hints">Hints</TabsTrigger>
        </TabsList>
        <TabsContent value="instructions" className="mt-4 prose prose-sm max-w-none">
          <p className='text-muted-foreground'>{segment.instructions}</p>
        </TabsContent>
        <TabsContent value="solution" className="mt-4">
          <div className="space-y-2">
              <label htmlFor={`solution-${segment.id}`} className="text-sm font-medium">Your Code / Solution:</label>
              <CodeEditor
                value={solution}
                onChange={setSolution}
                language="javascript"
                height="400px"
                placeholder="// Write your JavaScript code here..."
              />
          </div>
        </TabsContent>
        <TabsContent value="hints" className="mt-4">
          <HintProvider segment={segment} solutionAttempt={solution} />
        </TabsContent>
      </Tabs>
      {isCurrent && (
        <div className="flex justify-end">
          <Button onClick={handleCompleteSegment}>
            <Check className="mr-2 h-4 w-4" />
            Mark as Complete
          </Button>
        </div>
      )}
    </div>
  );
}
