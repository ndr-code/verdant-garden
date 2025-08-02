import React from 'react';
import type { GridBox, Position } from '../types';
import { BOX_SIZE, GAP } from '../constants';
import { Clock } from './Clock';
import { Pomodoro } from './Pomodoro';

interface GridProps {
  boxes: GridBox[];
  editMode: boolean;
  isDragging: boolean;
  dragStartBox: string | null;
  dragOverBox: string | null;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  gridWidth: number;
  gridHeight: number;
  ghostPositions: Position[];
  assignmentMode: {
    active: boolean;
    widgetType: string | null;
  };
  onAddBox: (x: number, y: number) => void;
  onAssignWidget: (boxId: string) => void;
  onClockWidgetClick: (boxId: string) => void;
  onPomodoroWidgetClick: (boxId: string) => void;
  onMouseDown: (e: React.MouseEvent, boxId: string) => void;
  onContextMenu: (e: React.MouseEvent, boxId: string) => void;
  onMouseEnter: (boxId: string) => void;
  onMouseLeave: (boxId: string) => void;
  onMouseUp: (e: React.MouseEvent) => void;
}

const getPixelPosition = (
  x: number,
  y: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
) => ({
  left: (x - bounds.minX) * (BOX_SIZE + GAP),
  top: (y - bounds.minY) * (BOX_SIZE + GAP),
});

const Grid: React.FC<GridProps> = ({
  boxes,
  editMode,
  isDragging,
  dragStartBox,
  dragOverBox,
  bounds,
  gridWidth,
  gridHeight,
  ghostPositions,
  assignmentMode,
  onAddBox,
  onAssignWidget,
  onClockWidgetClick,
  onPomodoroWidgetClick,
  onMouseDown,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
}) => {
  const renderWidgetContent = (box: GridBox) => {
    if (!box.widget) return null;

    // Determine size based on box dimensions
    const getWidgetSize = (box: GridBox) => {
      const totalArea = box.width * box.height;
      if (totalArea >= 4) return 'large'; // 2x2 or bigger
      if (totalArea >= 2) return 'medium'; // 1x2 or 2x1
      return 'small'; // 1x1
    };

    const widgetSize = getWidgetSize(box);

    switch (box.widget.type) {
      case 'clock':
        return <Clock size={widgetSize} />;
      case 'pomodoro':
        return <Pomodoro size={widgetSize} />;
      default:
        return null;
    }
  };

  const handleBoxClick = (box: GridBox) => {
    if (assignmentMode.active) {
      onAssignWidget(box.id);
    } else if (box.widget) {
      if (box.widget.type === 'clock') {
        onClockWidgetClick(box.id);
      } else if (box.widget.type === 'pomodoro') {
        onPomodoroWidgetClick(box.id);
      }
    }
  };

  return (
    <div
      className='relative'
      style={{
        width: Math.max(gridWidth, BOX_SIZE),
        height: Math.max(gridHeight, BOX_SIZE),
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        left: '50%',
        top: '50%',
      }}
    >
      {/* Ghost boxes */}
      {editMode &&
        ghostPositions.map((pos) => {
          const position = getPixelPosition(pos.x, pos.y, bounds);
          return (
            <div
              key={`ghost-${pos.x}-${pos.y}`}
              className='absolute rounded-xl border-2 transition-all duration-200 cursor-pointer opacity-10'
              style={{
                width: BOX_SIZE,
                height: BOX_SIZE,
                left: position.left,
                top: position.top,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.1';
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
              }}
              onClick={() => onAddBox(pos.x, pos.y)}
            />
          );
        })}

      {/* Grid boxes */}
      {boxes.map((box) => {
        const position = getPixelPosition(box.x, box.y, bounds);

        return (
          <div key={box.id}>
            <div
              data-box-id={box.id}
              className={`absolute rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer
                ${isDragging && dragStartBox === box.id ? 'opacity-70' : ''} 
                ${dragOverBox === box.id ? 'ring-2 ring-blue-400' : ''}
                ${assignmentMode.active && !box.widget ? 'assignment-glow' : ''}
                ${assignmentMode.active && box.widget ? 'opacity-50' : ''}
              `}
              style={{
                backgroundColor: box.color || '#ffffff',
                width: BOX_SIZE * box.width + GAP * (box.width - 1),
                height: BOX_SIZE * box.height + GAP * (box.height - 1),
                left: position.left,
                top: position.top,
                zIndex: 5,
              }}
              onClick={() => handleBoxClick(box)}
              onMouseDown={(e) => onMouseDown(e, box.id)}
              onContextMenu={(e) => onContextMenu(e, box.id)}
              onMouseEnter={() => onMouseEnter(box.id)}
              onMouseLeave={() => onMouseLeave(box.id)}
              onMouseUp={onMouseUp}
              draggable={false}
            >
              {/* Widget content */}
              {box.widget && (
                <div className='w-full h-full flex items-center justify-center'>
                  <div className='flex items-center justify-center'>
                    {renderWidgetContent(box)}
                  </div>
                </div>
              )}

              {/* Assignment mode overlay */}
              {assignmentMode.active && !box.widget && (
                <div
                  className='absolute inset-0 rounded-xl opacity-30'
                  style={{
                    background: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 8px,
                      rgba(59, 130, 246, 0.6) 8px,
                      rgba(59, 130, 246, 0.6) 16px
                    )`,
                    animation: 'moveStripes 1.5s linear infinite',
                    backgroundSize: '800px 800px',
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
