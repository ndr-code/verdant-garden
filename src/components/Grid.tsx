import React from 'react';
import type { GridBox, Position } from '../types';
import { BOX_SIZE, GAP } from '../constants';
import { Clock } from './Clock';
import { Pomodoro } from './Pomodoro';
import { Notes } from './Notes';

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
  mergePreview: {
    visible: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    boxIds: string[];
  } | null;
  explodingBoxId: string | null;
  invalidMergeTarget: string | null;
  onAddBox: (x: number, y: number) => void;
  onAssignWidget: (boxId: string) => void;
  onAssignWidgetByDrag?: (boxId: string, widgetType: string) => void;
  onClockWidgetClick: (boxId: string) => void;
  onPomodoroWidgetClick: (boxId: string) => void;
  onNotesWidgetClick: (boxId: string) => void;
  onMouseDown: (e: React.MouseEvent, boxId: string) => void;
  onContextMenu: (e: React.MouseEvent, boxId: string) => void;
  onMouseEnter: (boxId: string) => void;
  onMouseLeave: (boxId: string) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onGhostBoxDrop?: (ghostX: number, ghostY: number) => void;
  onWidgetDragEnterGrid?: () => void;
  onWidgetDragLeaveGrid?: () => void;
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
  mergePreview,
  explodingBoxId,
  invalidMergeTarget,
  onAddBox,
  onAssignWidget,
  onAssignWidgetByDrag,
  onClockWidgetClick,
  onPomodoroWidgetClick,
  onNotesWidgetClick,
  onMouseDown,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onGhostBoxDrop,
  onWidgetDragEnterGrid,
  onWidgetDragLeaveGrid,
}) => {
  const renderWidgetContent = (box: GridBox) => {
    if (!box.widget) return null;

    // Determine size based on box dimensions
    const getWidgetSize = (
      box: GridBox
    ):
      | 'tiny'
      | 'narrow'
      | 'wide'
      | 'small'
      | 'medium-wide'
      | 'medium-tall'
      | 'large'
      | 'xlarge' => {
      const { width, height } = box;

      // Map specific dimensions to widget sizes
      if (width === 1 && height === 1) return 'tiny'; // 1x1
      if (width === 1 && height > 1) return 'narrow'; // 1xN (any height)
      if (height === 1 && width > 1) return 'wide'; // Nx1 (any width)
      if (width === 2 && height === 2) return 'small'; // 2x2
      if (width === 2 && height === 3) return 'medium-wide'; // 2x3
      if (width === 3 && height === 2) return 'medium-tall'; // 3x2
      if (width === 3 && height === 3) return 'large'; // 3x3

      // For anything larger than 3x3
      return 'xlarge'; // >3x3
    };

    const widgetSize = getWidgetSize(box);

    switch (box.widget.type) {
      case 'clock':
        return (
          <Clock size={widgetSize} width={box.width} height={box.height} />
        );
      case 'pomodoro':
        return (
          <Pomodoro size={widgetSize} width={box.width} height={box.height} />
        );
      case 'notes':
        return (
          <Notes size={widgetSize} width={box.width} height={box.height} />
        );
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
      } else if (box.widget.type === 'notes') {
        onNotesWidgetClick(box.id);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, boxId: string) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData('widget-type');
    if (widgetType && !editMode && onAssignWidgetByDrag) {
      // Find the box and check if it doesn't already have a widget
      const box = boxes.find((b) => b.id === boxId);
      if (box && !box.widget) {
        // Trigger widget assignment with specific type
        onAssignWidgetByDrag(boxId, widgetType);
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
      onDragEnter={() => {
        if (onWidgetDragEnterGrid) {
          onWidgetDragEnterGrid();
        }
      }}
      onDragLeave={(e) => {
        if (onWidgetDragLeaveGrid) {
          // Check if we're really leaving the grid (not just entering a child element)
          const rect = e.currentTarget.getBoundingClientRect();
          const isLeavingGrid =
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom;

          if (isLeavingGrid) {
            onWidgetDragLeaveGrid();
          }
        }
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
                // Handle drag over ghost box
                if (dragStartBox) {
                  onMouseEnter(`ghost-${pos.x}-${pos.y}`);
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.1';
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                // Handle drag leave ghost box
                if (dragStartBox) {
                  onMouseLeave(`ghost-${pos.x}-${pos.y}`);
                }
              }}
              onClick={() => {
                if (dragStartBox && isDragging) {
                  // Handle drop to ghost box
                  if (onGhostBoxDrop) {
                    onGhostBoxDrop(pos.x, pos.y);
                  }
                } else {
                  // Normal add box behavior
                  onAddBox(pos.x, pos.y);
                }
              }}
            />
          );
        })}

      {/* Merge preview */}
      {mergePreview && mergePreview.visible && (
        <div
          className='absolute rounded-xl border-4 border-white bg-white/40 pointer-events-none z-10'
          style={{
            left: (mergePreview.x - bounds.minX) * (BOX_SIZE + GAP),
            top: (mergePreview.y - bounds.minY) * (BOX_SIZE + GAP),
            width:
              mergePreview.width * BOX_SIZE + (mergePreview.width - 1) * GAP,
            height:
              mergePreview.height * BOX_SIZE + (mergePreview.height - 1) * GAP,
          }}
        />
      )}

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
                ${invalidMergeTarget === box.id ? 'ring-3 ring-red-500' : ''}
                ${assignmentMode.active && !box.widget ? 'assignment-glow' : ''}
                ${assignmentMode.active && box.widget ? 'opacity-50' : ''}
                ${explodingBoxId === box.id ? 'animate-explode' : ''}
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
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, box.id)}
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
                    animation: 'dash',
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
