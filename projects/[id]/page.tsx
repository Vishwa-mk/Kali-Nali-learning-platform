'use client';

import { projects as initialProjects } from '@/lib/data';
import { useAppState, useAppDispatch } from '@/lib/state';
import { notFound } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Radio } from 'lucide-react';
import { SegmentItem } from '@/components/project/segment-item';
import { cn } from '@/lib/utils';
import { Quiz } from '@/components/project/quiz';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { segments, quizzes, projects, currentUser } = useAppState();
  const project = projects.find(p => p.id === params.id);
  
  if (!project) {
    notFound();
  }

  const projectSegments = segments.filter(s => s.projectId === params.id);
  const projectQuiz = quizzes.find(q => q.projectId === params.id);

  const completedSegmentIds = currentUser.stats.completedSegmentIds || [];
  const completedSegmentsCount = projectSegments.filter(s => completedSegmentIds.includes(s.id)).length;
  
  const allSegmentsCompleted = completedSegmentsCount >= project.totalSegments;

  // Find the first uncompleted segment to set as the default open accordion item
  const firstUncompletedSegment = projectSegments.find(segment => !completedSegmentIds.includes(segment.id));

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">{project.title}</h1>
        <p className="text-muted-foreground max-w-3xl mt-2">{project.description}</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
              <CardTitle>Project Segments</CardTitle>
              <CardDescription>Complete each segment to build your project.</CardDescription>
          </CardHeader>
          <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue={firstUncompletedSegment?.id}>
              {projectSegments.map((segment) => {
                  const isCompleted = completedSegmentIds.includes(segment.id);
                  const isCurrent = firstUncompletedSegment?.id === segment.id && !allSegmentsCompleted;
                  
                  return (
                      <AccordionItem key={segment.id} value={segment.id} disabled={!isCurrent && !isCompleted}>
                          <AccordionTrigger>
                              <div className="flex items-center gap-3">
                                  {isCompleted ? (
                                      <CheckCircle className="h-5 w-5 text-accent" />
                                  ) : isCurrent ? (
                                      <Radio className="h-5 w-5 text-primary animate-pulse" />
                                  ) : (
                                      <CheckCircle className="h-5 w-5 text-muted-foreground/50" />
                                  )}
                                  <span className={cn('transition-colors', isCompleted && !isCurrent ? 'font-normal text-muted-foreground' : 'font-semibold', isCurrent && 'text-primary')}>{segment.title}</span>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <SegmentItem segment={segment} isCurrent={isCurrent} />
                          </AccordionContent>
                      </AccordionItem>
                  )
              })}
              </Accordion>
          </CardContent>
        </Card>

        {allSegmentsCompleted && projectQuiz && (
            <Quiz quiz={projectQuiz} />
        )}
      </div>
    </div>
  );
}