import { Clock, Timer, StickyNote, Target, Music } from 'lucide-react';
import { Tooltip, TooltipProvider } from './Tooltip';

interface BottomDockProps {
  onClockClick: () => void;
  onTimerClick: () => void;
  onNotesClick: () => void;
  onGoalsClick: () => void;
  onMusicClick: () => void;
}

export const BottomDock = ({
  onClockClick,
  onTimerClick,
  onNotesClick,
  onGoalsClick,
  onMusicClick,
}: BottomDockProps) => {
  return (
    <TooltipProvider>
      <div className='h-16 bg-white/10 w-full flex-shrink-0 border-t-2 border-white/20 flex items-center justify-center gap-8 px-8'>
        <Tooltip content='Clock'>
          <Clock
            className='w-8 h-8 text-white cursor-pointer hover:text-amber-300 transition-colors'
            onClick={onClockClick}
          />
        </Tooltip>

        <Tooltip content='Pomodoro'>
          <Timer
            className='w-8 h-8 text-white cursor-pointer hover:text-amber-300 transition-colors'
            onClick={onTimerClick}
          />
        </Tooltip>

        <Tooltip content='Notes'>
          <StickyNote
            className='w-8 h-8 text-white cursor-pointer hover:text-amber-300 transition-colors'
            onClick={onNotesClick}
          />
        </Tooltip>

        <Tooltip content='Goals'>
          <Target
            className='w-8 h-8 text-white cursor-pointer hover:text-amber-300 transition-colors'
            onClick={onGoalsClick}
          />
        </Tooltip>

        <Tooltip content='Music'>
          <Music
            className='w-8 h-8 text-white cursor-pointer hover:text-amber-300 transition-colors'
            onClick={onMusicClick}
          />
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
