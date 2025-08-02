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
  editMode?: boolean;
  onClockClick: () => void;
  onTimerClick: () => void;
  onNotesClick: () => void;
  onTodoClick: () => void;
  onMusicClick: () => void;
  onRadioClick: () => void;
}

export const BottomDock = ({
  editMode = false,
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
        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Clock'}>
          <Clock
            className={`w-6 h-6 text-white transition-all duration-200 ${
              editMode
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
            }`}
            onClick={editMode ? undefined : onClockClick}
          />
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Pomodoro'}>
          <Timer
            className={`w-6 h-6 text-white transition-all duration-200 ${
              editMode
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
            }`}
            onClick={editMode ? undefined : onTimerClick}
          />
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Notes'}>
          <SquarePen
            className={`w-6 h-6 text-white transition-all duration-200 ${
              editMode
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
            }`}
            onClick={editMode ? undefined : onNotesClick}
          />
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Todo'}>
          <ListChecks
            className={`w-6 h-6 text-white transition-all duration-200 ${
              editMode
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
            }`}
            onClick={editMode ? undefined : onTodoClick}
          />
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Music'}>
          <AudioLines
            className={`w-6 h-6 text-white transition-all duration-200 ${
              editMode
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
            }`}
            onClick={editMode ? undefined : onMusicClick}
          />
        </Tooltip>
        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Radio'}>
          <Radio
            className={`w-6 h-6 text-white transition-all duration-200 ${
              editMode
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
            }`}
            onClick={editMode ? undefined : onRadioClick}
          />
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
