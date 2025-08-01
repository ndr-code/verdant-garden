import type { GridBox, Position } from '../types';
import { BOX_SIZE, GAP } from '../constants';

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
  onAddBox: (x: number, y: number) => void;
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

export const Grid = ({
  boxes,
  editMode,
  isDragging,
  dragStartBox,
  dragOverBox,
  bounds,
  gridWidth,
  gridHeight,
  ghostPositions,
  onAddBox,
  onMouseDown,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
}: GridProps) => {
  return (
    <div
      className='relative'
      style={{
        width: Math.max(gridWidth, BOX_SIZE),
        height: Math.max(gridHeight, BOX_SIZE),
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
              className={`absolute rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                editMode ? 'cursor-pointer' : 'cursor-default'
              } ${isDragging && dragStartBox === box.id ? 'opacity-70' : ''} ${
                dragOverBox === box.id ? 'ring-2 ring-blue-400' : ''
              }`}
              style={{
                backgroundColor: box.color || '#ffffff',
                width: BOX_SIZE * box.width + GAP * (box.width - 1),
                height: BOX_SIZE * box.height + GAP * (box.height - 1),
                left: position.left,
                top: position.top,
                zIndex: 5,
              }}
              onMouseDown={(e) => onMouseDown(e, box.id)}
              onContextMenu={(e) => onContextMenu(e, box.id)}
              onMouseEnter={() => onMouseEnter(box.id)}
              onMouseLeave={() => onMouseLeave(box.id)}
              onMouseUp={onMouseUp}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
};
