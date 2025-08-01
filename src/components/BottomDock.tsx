import {
  Clock,
  Timer,
  SquarePen,
  ListChecks,
  AudioLines,
  Radio,
} from 'lucide-react';
import { Tooltip, TooltipProvider } from './Tooltip';

interface BottomDockProps {
  onClockClick: () => void;
  onTimerClick: () => void;
  onNotesClick: () => void;
  onTodoClick: () => void;
  onMusicClick: () => void;
  onRadioClick: () => void;
}

export const BottomDock = ({
  onClockClick,
  onTimerClick,
  onNotesClick,
  onTodoClick,
  onMusicClick,
  onRadioClick,
}: BottomDockProps) => {
  return (
    <TooltipProvider>
      <div className='h-16 bg-white/10 w-full flex-shrink-0 border-t-2 border-white/20 flex items-center justify-center gap-8 px-8'>
        <Tooltip content='Clock'>
          <Clock
            className='w-6 h-6 text-white cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all duration-200'
            onClick={onClockClick}
          />
        </Tooltip>

        <Tooltip content='Pomodoro'>
          <Timer
            className='w-6 h-6 text-white cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all duration-200'
            onClick={onTimerClick}
          />
        </Tooltip>

        <Tooltip content='Notes'>
          <SquarePen
            className='w-6 h-6 text-white cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all duration-200'
            onClick={onNotesClick}
          />
        </Tooltip>

        <Tooltip content='Todo'>
          <ListChecks
            className='w-6 h-6 text-white cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all duration-200'
            onClick={onTodoClick}
          />
        </Tooltip>

        <Tooltip content='Music'>
          <AudioLines
            className='w-6 h-6 text-white cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all duration-200'
            onClick={onMusicClick}
          />
        </Tooltip>
        <Tooltip content='Radio'>
          <Radio
            className='w-6 h-6 text-white cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all duration-200'
            onClick={onRadioClick}
          />
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
