'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useAppState, useAppDispatch } from '@/lib/state';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BadgeIcon } from '@/components/profile/badge-icon';

export default function LeaderboardPage() {
  const { leaderboard } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const lastUpdated = localStorage.getItem('leaderboardLastUpdated');
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (!lastUpdated || now - parseInt(lastUpdated) > twentyFourHours) {
      dispatch({ type: 'UPDATE_LEADERBOARD' });
      localStorage.setItem('leaderboardLastUpdated', now.toString());
    }
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See who's at the top of the learning game!</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Weekly rankings based on points earned from completing segments and projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="hidden md:table-cell text-center">Badges</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((player) => {
                const playerAvatar = PlaceHolderImages.find(img => img.id === player.avatarId);
                return (
                  <TableRow key={player.rank}>
                    <TableCell className="font-bold text-lg text-primary">#{player.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          {playerAvatar && <AvatarImage src={playerAvatar.imageUrl} alt={player.name} />}
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{player.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{player.points.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center justify-center gap-2">
                        {player.badges.map(badge => (
                          <BadgeIcon key={badge.id} badge={badge} />
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
