'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LeaderboardEntry } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Trophy } from 'lucide-react';

interface LeaderboardPreviewProps {
  topPlayers: LeaderboardEntry[];
}

export function LeaderboardPreview({ topPlayers }: LeaderboardPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Leaderboard</CardTitle>
            <Trophy className="h-5 w-5 text-chart-5" />
        </div>
        <CardDescription>Top 3 learners this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPlayers.map((player) => {
            const playerAvatar = PlaceHolderImages.find(img => img.id === player.avatarId);
            return (
              <div key={player.rank} className="flex items-center">
                <Avatar className="h-9 w-9">
                  {playerAvatar && <AvatarImage src={playerAvatar.imageUrl} alt={player.name} />}
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.points} points</p>
                </div>
                <div className="ml-auto font-medium">#{player.rank}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
       <CardContent className='pb-4'>
        <Button asChild size="sm" className="w-full">
          <Link href="/leaderboard">
            View Full Leaderboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
