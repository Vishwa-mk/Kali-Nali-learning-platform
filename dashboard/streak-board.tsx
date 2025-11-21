import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StreakBoardProps {
  streak: number;
}

export function StreakBoard({ streak }: StreakBoardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
        <Flame className="h-5 w-5 text-chart-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{streak} Days</div>
        <p className="text-xs text-muted-foreground">
          Keep it up to earn new badges!
        </p>
      </CardContent>
    </Card>
  );
}
