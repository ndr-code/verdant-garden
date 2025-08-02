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
  onWidgetDragStart?: (widgetType: string) => void;
  onWidgetDragEnd?: () => void;
}

export const BottomDock = ({
  editMode = false,
  onClockClick,
  onTimerClick,
  onNotesClick,
  onTodoClick,
  onMusicClick,
  onRadioClick,
  onWidgetDragStart,
  onWidgetDragEnd,
}: BottomDockProps) => {
  const handleDragStart = (e: React.DragEvent, widgetType: string) => {
    if (editMode) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('widget-type', widgetType);
    e.dataTransfer.effectAllowed = 'copy';
    // Notify parent component that widget drag has started
    if (onWidgetDragStart) {
      onWidgetDragStart(widgetType);
    }
  };

  const handleDragEnd = () => {
    // Notify parent component that widget drag has ended
    if (onWidgetDragEnd) {
      onWidgetDragEnd();
    }
  };

  return (
    <TooltipProvider>
      <div className='h-16 bg-white/10 w-full flex-shrink-0 border-t-2 rounded-lg border-white/20 flex items-center justify-center gap-8 px-8'>
        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Clock'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'clock')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <Clock
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onClockClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Pomodoro'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'pomodoro')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <Timer
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onTimerClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Notes'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'notes')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <SquarePen
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onNotesClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Todo'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'todo')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <ListChecks
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onTodoClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Music'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'music')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <AudioLines
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onMusicClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Radio'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'radio')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <Radio
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onRadioClick}
            />
          </div>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
