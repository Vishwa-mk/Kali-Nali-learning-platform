import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const projectImage = PlaceHolderImages.find(img => img.id === project.imageId);
  const progress = project.totalSegments > 0 ? (project.completedSegments / project.totalSegments) * 100 : 0;
  const isStarted = project.completedSegments > 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            {projectImage && (
                <Image
                    src={projectImage.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint={projectImage.imageHint}
                />
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-xl mb-2">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 p-6 pt-0">
         <div>
            <p className="text-sm text-muted-foreground mb-2">
                {project.completedSegments} / {project.totalSegments} Segments Completed
            </p>
            <Progress value={progress} aria-label={`${progress}% complete`} />
        </div>
        <Button asChild className="w-full">
          <Link href={`/projects/${project.id}`}>
            {isStarted ? "Continue Project" : "Start Project"} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
