'use client';

import Image from 'next/image';
import { useAppState } from '@/lib/state';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default function ProfilePage() {
    const { currentUser } = useAppState();
    const userAvatar = PlaceHolderImages.find(img => img.id === currentUser.avatarId);
    
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-col items-center gap-4 bg-muted/50 p-6 text-center">
                     <Avatar className="h-24 w-24 border-4 border-background">
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={currentUser.name} />}
                        <AvatarFallback className="text-4xl">{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl font-headline">{currentUser.name}</CardTitle>
                        <CardDescription>learner@example.com</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <StatCard label="Projects Completed" value={currentUser.stats.projectsCompleted} />
                        <StatCard label="Segments Completed" value={currentUser.stats.segmentsCompleted} />
                        <StatCard label="Current Streak" value={`${currentUser.stats.currentStreak} days`} />
                    </div>
                    
                    <Separator className="my-6" />

                    <h3 className="text-lg font-semibold mb-4">My Badges</h3>
                    {currentUser.badges.length > 0 ? (
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {currentUser.badges.map((badge) => (
                                <Card key={badge.id} className="flex flex-col items-center justify-center p-4">
                                    <div className="mb-2 rounded-full bg-primary/10 p-3">
                                        <badge.Icon className={cn('h-8 w-8', badge.color)} />
                                    </div>
                                    <p className="font-semibold text-sm text-center">{badge.name}</p>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No badges earned yet. Keep learning to collect them!</p>
                    )}

                    <Separator className="my-6" />

                     <h3 className="text-lg font-semibold mb-4">Quiz Performance</h3>
                    {currentUser.stats.quizScores.length > 0 ? (
                        <div className="space-y-4">
                            {currentUser.stats.quizScores.map((result) => {
                                const percentage = (result.score / result.totalQuestions) * 100;
                                return (
                                <div key={result.projectId}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-medium">{result.projectName}</p>
                                        <p className="text-sm text-muted-foreground">{result.score} / {result.totalQuestions}</p>
                                    </div>
                                    <Progress value={percentage} aria-label={`${result.projectName} score: ${percentage}%`} />
                                </div>
                            )})}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No quiz results yet. Complete a project quiz to see your performance!</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
