import type { Badge as BadgeType } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BadgeIconProps {
  badge: BadgeType;
}

export function BadgeIcon({ badge }: BadgeIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={cn('flex items-center justify-center rounded-full bg-muted p-1.5')}>
            <badge.Icon className={cn('h-6 w-6', badge.color)} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{badge.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
