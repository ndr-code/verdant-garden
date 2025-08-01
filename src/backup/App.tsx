import { useState, useCallback, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Undo2, Redo2, RotateCcw, Edit3 } from 'lucide-react';

// Types
interface GridBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

interface Position {
  x: number;
  y: number;
}

// Constants
const BOX_SIZE = 80;
const GAP = 4;
const AVAILABLE_COLORS = [
  '#ffffff',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#6b7280',
];

// Components
const ControlButtons = ({
  editMode,
  onToggleEdit,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
}: {
  editMode: boolean;
  onToggleEdit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) => (
  <div className='absolute top-4 right-4 flex gap-3 z-50'>
    {editMode && (
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`w-12 h-12 cursor-pointer rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center ${
          !canUndo
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <Undo2 size={20} />
      </button>
    )}
    {editMode && (
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`w-12 h-12 cursor-pointer rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center ${
          !canRedo
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <Redo2 size={20} />
      </button>
    )}
    {editMode && (
      <button
        onClick={onReset}
        className='w-12 h-12 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center'
      >
        <RotateCcw size={20} />
      </button>
    )}
    <button
      onClick={onToggleEdit}
      className={`w-12 h-12 cursor-pointer rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center ${
        editMode
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
    >
      <Edit3 size={20} />
    </button>
  </div>
);

const ResetDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isResetting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isResetting: boolean;
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className='fixed inset-0 bg-black/50 z-[100]' />
      <Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4 z-[101]'>
        <Dialog.Title className='text-lg font-semibold text-gray-900 mb-4'>
          Confirm Reset
        </Dialog.Title>
        <Dialog.Description className='text-gray-600 mb-6'>
          Are you sure?
        </Dialog.Description>
        <div className='flex gap-3 justify-end'>
          <Dialog.Close asChild>
            <button
              className='cursor-pointer px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              disabled={isResetting}
            >
              Cancel
            </button>
          </Dialog.Close>
          <button
            onClick={onConfirm}
            disabled={isResetting}
            className='cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
          >
            {isResetting && (
              <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
            )}
            {isResetting ? 'Resetting...' : 'Yes, Reset'}
          </button>
        </div>
        <Dialog.Close asChild>
          <button
            className='cursor-pointer absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors'
            aria-label='Close'
          >
            <Cross2Icon className='w-4 h-4' />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

const ContextMenu = ({
  visible,
  x,
  y,
  box,
  onDelete,
  onUnmerge,
  onColorHover,
  onColorLeave,
}: {
  visible: boolean;
  x: number;
  y: number;
  box: GridBox | undefined;
  onDelete: () => void;
  onUnmerge: () => void;
  onColorHover: () => void;
  onColorLeave: (e: React.MouseEvent) => void;
}) => {
  if (!visible || !box) return null;

  const isSmallBox = box.width === 1 && box.height === 1;

  return (
    <div
      className='fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[200]'
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className='w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center gap-2 cursor-pointer'
        onClick={onDelete}
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
          />
        </svg>
        Delete
      </button>
      <button
        className='w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 transition-colors duration-150 flex items-center gap-2 relative cursor-pointer'
        onMouseEnter={onColorHover}
        onMouseLeave={onColorLeave}
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='m15 5 4 4L8 20l-4-4 11-11z'
          />
        </svg>
        Change Color
      </button>
      {!isSmallBox && (
        <button
          className='w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 transition-colors duration-150 flex items-center gap-2 cursor-pointer'
          onClick={onUnmerge}
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
            />
          </svg>
          Unmerge
        </button>
      )}
    </div>
  );
};

const ColorPicker = ({
  visible,
  x,
  y,
  onColorSelect,
  onMouseEnter,
  onMouseLeave,
}: {
  visible: boolean;
  x: number;
  y: number;
  onColorSelect: (color: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  if (!visible) return null;

  return (
    <div
      data-color-picker
      className='fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-[200]'
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='text-sm font-medium text-gray-700 mb-2'>
        Choose Color:
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {AVAILABLE_COLORS.map((color) => (
          <button
            key={color}
            className='w-8 h-8 rounded-md border-2 border-gray-300 hover:border-gray-400 transition-colors duration-150 shadow-sm hover:shadow-md cursor-pointer'
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            title={color === '#ffffff' ? 'White (Default)' : color}
          />
        ))}
      </div>
    </div>
  );
};

// Utility functions
const loadBoxes = (): GridBox[] => {
  try {
    const saved = localStorage.getItem('gridBoxes');
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : [{ id: '0', x: 0, y: 0, width: 1, height: 1 }];
    }
  } catch (error) {
    console.error('Error loading boxes from localStorage:', error);
  }
  return [{ id: '0', x: 0, y: 0, width: 1, height: 1 }];
};

const getBounds = (boxes: GridBox[]) => {
  if (boxes.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  const xs = boxes.map((box) => box.x);
  const ys = boxes.map((box) => box.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
};

const getPixelPosition = (
  x: number,
  y: number,
  bounds: ReturnType<typeof getBounds>
) => ({
  left: (x - bounds.minX) * (BOX_SIZE + GAP),
  top: (y - bounds.minY) * (BOX_SIZE + GAP),
});

// Main App Component
function App() {
  // State
  const [boxes, setBoxes] = useState<GridBox[]>(loadBoxes());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartBox, setDragStartBox] = useState<string | null>(null);
  const [dragOverBox, setDragOverBox] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState<GridBox[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    boxId: '',
  });
  const [colorPicker, setColorPicker] = useState({
    visible: false,
    x: 0,
    y: 0,
    boxId: '',
  });

  // Derived state
  const bounds = getBounds(boxes);
  const gridWidth = (bounds.maxX - bounds.minX + 1) * (BOX_SIZE + GAP) - GAP;
  const gridHeight = (bounds.maxY - bounds.minY + 1) * (BOX_SIZE + GAP) - GAP;

  // Effects
  useEffect(() => {
    try {
      localStorage.setItem('gridBoxes', JSON.stringify(boxes));
    } catch (error) {
      console.error('Error saving boxes to localStorage:', error);
    }
  }, [boxes]);

  useEffect(() => {
    if (history.length === 0) {
      setHistory([JSON.parse(JSON.stringify(boxes))]);
      setHistoryIndex(0);
    }
  }, [boxes, history.length]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging || dragStartBox) {
        setIsDragging(false);
        setDragStartBox(null);
        setDragOverBox(null);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragStartBox && !isDragging) {
        setIsDragging(true);
      }
      if (
        isDragging &&
        e.target &&
        !(e.target as Element).closest('[data-box-id]')
      ) {
        setDragOverBox(null);
      }
    };

    const handleGlobalClick = () => {
      setContextMenu({ visible: false, x: 0, y: 0, boxId: '' });
      setColorPicker({ visible: false, x: 0, y: 0, boxId: '' });
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [isDragging, dragStartBox]);

  // Actions
  const saveToHistory = useCallback(
    (newBoxes: GridBox[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push([...newBoxes]);
        return newHistory.slice(-50);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 49));
    },
    [historyIndex]
  );

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBoxes(JSON.parse(JSON.stringify(history[newIndex])));
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBoxes(JSON.parse(JSON.stringify(history[newIndex])));
    }
  }, [history, historyIndex]);

  const resetGrid = useCallback(() => {
    setShowResetDialog(true);
  }, []);

  const confirmReset = useCallback(async () => {
    setIsResetting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const initialBox: GridBox = { id: '0', x: 0, y: 0, width: 1, height: 1 };
    const newBoxes = [initialBox];
    setBoxes(newBoxes);
    saveToHistory(newBoxes);
    setIsDragging(false);
    setDragStartBox(null);
    setDragOverBox(null);
    setIsResetting(false);
    setShowResetDialog(false);
  }, [saveToHistory]);

  const addBox = useCallback(
    (x: number, y: number) => {
      const newBox: GridBox = {
        id: Date.now().toString(),
        x,
        y,
        width: 1,
        height: 1,
      };
      const newBoxes = [...boxes, newBox];
      setBoxes(newBoxes);
      saveToHistory(newBoxes);
    },
    [boxes, saveToHistory]
  );

  const deleteBox = useCallback(
    (boxId: string) => {
      const newBoxes = boxes.filter((box) => box.id !== boxId);
      setBoxes(newBoxes);
      saveToHistory(newBoxes);
      setContextMenu({ visible: false, x: 0, y: 0, boxId: '' });
    },
    [boxes, saveToHistory]
  );

  const unmergeBox = useCallback(
    (boxId: string) => {
      const boxToUnmerge = boxes.find((box) => box.id === boxId);
      if (!boxToUnmerge) return;

      const individualBoxes: GridBox[] = [];
      for (let i = 0; i < boxToUnmerge.width; i++) {
        for (let j = 0; j < boxToUnmerge.height; j++) {
          individualBoxes.push({
            id: `${Date.now()}-${i}-${j}`,
            x: boxToUnmerge.x + i,
            y: boxToUnmerge.y + j,
            width: 1,
            height: 1,
            color: boxToUnmerge.color,
          });
        }
      }

      const newBoxes = boxes
        .filter((box) => box.id !== boxId)
        .concat(individualBoxes);
      setBoxes(newBoxes);
      saveToHistory(newBoxes);
      setContextMenu({ visible: false, x: 0, y: 0, boxId: '' });
    },
    [boxes, saveToHistory]
  );

  const changeBoxColor = useCallback(
    (boxId: string, newColor: string) => {
      const newBoxes = boxes.map((box) =>
        box.id === boxId ? { ...box, color: newColor } : box
      );
      setBoxes(newBoxes);
      saveToHistory(newBoxes);
      setContextMenu({ visible: false, x: 0, y: 0, boxId: '' });
      setColorPicker({ visible: false, x: 0, y: 0, boxId: '' });
    },
    [boxes, saveToHistory]
  );

  const getGhostPositions = useCallback((): Position[] => {
    const occupiedPositions = new Set<string>();
    const ghostPositions = new Set<string>();

    boxes.forEach((box) => {
      for (let i = 0; i < box.width; i++) {
        for (let j = 0; j < box.height; j++) {
          occupiedPositions.add(`${box.x + i},${box.y + j}`);
        }
      }
    });

    boxes.forEach((box) => {
      for (let i = 0; i < box.width; i++) {
        for (let j = 0; j < box.height; j++) {
          const currentX = box.x + i;
          const currentY = box.y + j;

          const directions = [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
          ];

          directions.forEach((dir) => {
            const newX = currentX + dir.x;
            const newY = currentY + dir.y;
            const posKey = `${newX},${newY}`;

            if (!occupiedPositions.has(posKey)) {
              ghostPositions.add(posKey);
            }
          });
        }
      }
    });

    return Array.from(ghostPositions).map((pos) => {
      const [x, y] = pos.split(',').map(Number);
      return { x, y };
    });
  }, [boxes]);

  const areAdjacent = useCallback((box1: GridBox, box2: GridBox): boolean => {
    const box1Positions = [];
    for (let i = 0; i < box1.width; i++) {
      for (let j = 0; j < box1.height; j++) {
        box1Positions.push({ x: box1.x + i, y: box1.y + j });
      }
    }

    const box2Positions = [];
    for (let i = 0; i < box2.width; i++) {
      for (let j = 0; j < box2.height; j++) {
        box2Positions.push({ x: box2.x + i, y: box2.y + j });
      }
    }

    for (const pos1 of box1Positions) {
      for (const pos2 of box2Positions) {
        const dx = Math.abs(pos1.x - pos2.x);
        const dy = Math.abs(pos1.y - pos2.y);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
          return true;
        }
      }
    }
    return false;
  }, []);

  const mergeBoxes = useCallback(
    (sourceId: string, targetId: string) => {
      const sourceBox = boxes.find((box) => box.id === sourceId);
      const targetBox = boxes.find((box) => box.id === targetId);

      if (sourceBox && targetBox && areAdjacent(sourceBox, targetBox)) {
        let minX = Math.min(sourceBox.x, targetBox.x);
        let maxX = Math.max(
          sourceBox.x + sourceBox.width - 1,
          targetBox.x + targetBox.width - 1
        );
        let minY = Math.min(sourceBox.y, targetBox.y);
        let maxY = Math.max(
          sourceBox.y + sourceBox.height - 1,
          targetBox.y + targetBox.height - 1
        );

        const boxesToRemove = new Set([sourceId, targetId]);
        let hasOverlaps = true;

        while (hasOverlaps) {
          hasOverlaps = false;
          boxes.forEach((box) => {
            if (!boxesToRemove.has(box.id)) {
              const boxMinX = box.x;
              const boxMaxX = box.x + box.width - 1;
              const boxMinY = box.y;
              const boxMaxY = box.y + box.height - 1;

              const overlapsX = !(boxMaxX < minX || boxMinX > maxX);
              const overlapsY = !(boxMaxY < minY || boxMinY > maxY);

              if (overlapsX && overlapsY) {
                boxesToRemove.add(box.id);
                hasOverlaps = true;
                minX = Math.min(minX, boxMinX);
                maxX = Math.max(maxX, boxMaxX);
                minY = Math.min(minY, boxMinY);
                maxY = Math.max(maxY, boxMaxY);
              }
            }
          });
        }

        const mergedBox: GridBox = {
          id: Date.now().toString(),
          x: minX,
          y: minY,
          width: maxX - minX + 1,
          height: maxY - minY + 1,
          color: sourceBox.color,
        };

        const newBoxes = boxes
          .filter((box) => !boxesToRemove.has(box.id))
          .concat(mergedBox);
        setBoxes(newBoxes);
        saveToHistory(newBoxes);
        setIsDragging(false);
        setDragStartBox(null);
        setDragOverBox(null);
      }
    },
    [boxes, areAdjacent, saveToHistory]
  );

  // Event handlers
  const handleColorHover = useCallback(() => {
    setColorPicker({
      visible: true,
      x: contextMenu.x + 155,
      y: contextMenu.y + 30,
      boxId: contextMenu.boxId,
    });
  }, [contextMenu]);

  const handleColorLeave = useCallback((e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget?.closest('[data-color-picker]')) {
      setColorPicker({ visible: false, x: 0, y: 0, boxId: '' });
    }
  }, []);

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center p-8 relative'>
      <ControlButtons
        editMode={editMode}
        onToggleEdit={toggleEditMode}
        onUndo={undo}
        onRedo={redo}
        onReset={resetGrid}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      <ResetDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={confirmReset}
        isResetting={isResetting}
      />

      <div
        className='relative'
        style={{
          width: Math.max(gridWidth, BOX_SIZE),
          height: Math.max(gridHeight, BOX_SIZE),
        }}
      >
        {/* Ghost boxes */}
        {editMode &&
          getGhostPositions().map((pos) => {
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
                  e.currentTarget.style.borderColor =
                    'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.1';
                  e.currentTarget.style.backgroundColor =
                    'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.borderColor =
                    'rgba(255, 255, 255, 0.7)';
                }}
                onClick={() => addBox(pos.x, pos.y)}
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
                } ${
                  isDragging && dragStartBox === box.id ? 'opacity-70' : ''
                } ${dragOverBox === box.id ? 'ring-2 ring-blue-400' : ''}`}
                style={{
                  backgroundColor: box.color || '#ffffff',
                  width: BOX_SIZE * box.width + GAP * (box.width - 1),
                  height: BOX_SIZE * box.height + GAP * (box.height - 1),
                  left: position.left,
                  top: position.top,
                  zIndex: 5,
                }}
                onMouseDown={(e) => {
                  if (e.button === 0 && editMode) {
                    e.preventDefault();
                    setDragStartBox(box.id);
                    setDragOverBox(null);
                    setIsDragging(false);
                  }
                }}
                onContextMenu={(e) => {
                  if (editMode) {
                    e.preventDefault();
                    setContextMenu({
                      visible: true,
                      x: e.clientX,
                      y: e.clientY,
                      boxId: box.id,
                    });
                  }
                }}
                onMouseEnter={() => {
                  if (dragStartBox && dragStartBox !== box.id && editMode) {
                    setDragOverBox(box.id);
                    setIsDragging(true);
                  }
                }}
                onMouseLeave={() => {
                  if (isDragging && editMode && dragOverBox === box.id) {
                    setDragOverBox(null);
                  }
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  if (
                    isDragging &&
                    dragStartBox &&
                    dragOverBox &&
                    dragStartBox !== dragOverBox &&
                    editMode
                  ) {
                    mergeBoxes(dragStartBox, dragOverBox);
                  }
                  setIsDragging(false);
                  setDragStartBox(null);
                  setDragOverBox(null);
                }}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        box={boxes.find((box) => box.id === contextMenu.boxId)}
        onDelete={() => deleteBox(contextMenu.boxId)}
        onUnmerge={() => unmergeBox(contextMenu.boxId)}
        onColorHover={handleColorHover}
        onColorLeave={handleColorLeave}
      />

      <ColorPicker
        visible={colorPicker.visible}
        x={colorPicker.x}
        y={colorPicker.y}
        onColorSelect={(color) => changeBoxColor(colorPicker.boxId, color)}
        onMouseEnter={() =>
          setColorPicker((prev) => ({ ...prev, visible: true }))
        }
        onMouseLeave={() =>
          setColorPicker({ visible: false, x: 0, y: 0, boxId: '' })
        }
      />
    </div>
  );
}

export default App;
