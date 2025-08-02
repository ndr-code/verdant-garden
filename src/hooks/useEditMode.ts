import { useState, useCallback, useEffect } from 'react';
import type { GridBox, Position } from '../types';

// Constants
const MAX_GRID_SIZE = 7;

// Utility functions
const getDefaultBoxes = (): GridBox[] => [
  { id: '0', x: 0, y: 0, width: 2, height: 1 },
  { id: '1', x: 2, y: 0, width: 1, height: 2 },
  { id: '2', x: 0, y: 1, width: 2, height: 2 },
  { id: '3', x: 2, y: 2, width: 1, height: 1 },
];

const loadBoxes = (): GridBox[] => {
  try {
    const saved = localStorage.getItem('gridBoxes');
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : getDefaultBoxes();
    }
  } catch (error) {
    console.error('Error loading boxes from localStorage:', error);
  }
  return getDefaultBoxes();
};

export const useEditMode = () => {
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
  const [assignmentMode, setAssignmentMode] = useState<{
    active: boolean;
    widgetType:
      | 'clock'
      | 'pomodoro'
      | 'notes'
      | 'todo'
      | 'music'
      | 'radio'
      | null;
  }>({
    active: false,
    widgetType: null,
  });
  const [isDraggingWidget, setIsDraggingWidget] = useState(false);
  const [draggedWidgetType, setDraggedWidgetType] = useState<string | null>(
    null
  );
  const [mergePreview, setMergePreview] = useState<{
    visible: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    boxIds: string[];
  } | null>(null);
  const [dragArea, setDragArea] = useState<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    startBox: GridBox;
  } | null>(null);

  // Effects
  const clearMergePreview = useCallback(() => {
    setMergePreview(null);
  }, []);

  const clearDragArea = useCallback(() => {
    setDragArea(null);
  }, []);

  const calculateMergePreview = useCallback(
    (sourceId: string, targetId: string) => {
      const sourceBox = boxes.find((box) => box.id === sourceId);
      const targetBox = boxes.find((box) => box.id === targetId);

      if (!sourceBox || !targetBox) {
        setMergePreview(null);
        return;
      }

      // Check if boxes are adjacent for traditional merge
      const areAdjacentBoxes = (() => {
        const box1Positions = [];
        for (let i = 0; i < sourceBox.width; i++) {
          for (let j = 0; j < sourceBox.height; j++) {
            box1Positions.push({ x: sourceBox.x + i, y: sourceBox.y + j });
          }
        }

        const box2Positions = [];
        for (let i = 0; i < targetBox.width; i++) {
          for (let j = 0; j < targetBox.height; j++) {
            box2Positions.push({ x: targetBox.x + i, y: targetBox.y + j });
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
      })();

      if (areAdjacentBoxes) {
        // Traditional adjacent merge calculation
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

        const boxesToMerge = new Set([sourceId, targetId]);
        let hasOverlaps = true;

        while (hasOverlaps) {
          hasOverlaps = false;
          boxes.forEach((box) => {
            if (!boxesToMerge.has(box.id)) {
              const boxMinX = box.x;
              const boxMaxX = box.x + box.width - 1;
              const boxMinY = box.y;
              const boxMaxY = box.y + box.height - 1;

              const overlapsX = !(boxMaxX < minX || boxMinX > maxX);
              const overlapsY = !(boxMaxY < minY || boxMinY > maxY);

              if (overlapsX && overlapsY) {
                boxesToMerge.add(box.id);
                hasOverlaps = true;
                minX = Math.min(minX, boxMinX);
                maxX = Math.max(maxX, boxMaxX);
                minY = Math.min(minY, boxMinY);
                maxY = Math.max(maxY, boxMaxY);
              }
            }
          });
        }

        const width = maxX - minX + 1;
        const height = maxY - minY + 1;

        if (width <= MAX_GRID_SIZE && height <= MAX_GRID_SIZE) {
          setMergePreview({
            visible: true,
            x: minX,
            y: minY,
            width,
            height,
            boxIds: Array.from(boxesToMerge),
          });
        } else {
          setMergePreview(null);
        }
      } else {
        // Multi-box merge calculation
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

        const boxesToMerge = new Set([sourceId, targetId]);

        boxes.forEach((box) => {
          if (!boxesToMerge.has(box.id)) {
            const boxMinX = box.x;
            const boxMaxX = box.x + box.width - 1;
            const boxMinY = box.y;
            const boxMaxY = box.y + box.height - 1;

            const overlapsX = !(boxMaxX < minX || boxMinX > maxX);
            const overlapsY = !(boxMaxY < minY || boxMinY > maxY);

            if (overlapsX && overlapsY) {
              boxesToMerge.add(box.id);
              minX = Math.min(minX, boxMinX);
              maxX = Math.max(maxX, boxMaxX);
              minY = Math.min(minY, boxMinY);
              maxY = Math.max(maxY, boxMaxY);
            }
          }
        });

        const mergeWidth = maxX - minX + 1;
        const mergeHeight = maxY - minY + 1;
        let canMerge = true;

        // Check for gaps
        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            let positionCovered = false;

            for (const boxId of boxesToMerge) {
              const box = boxes.find((b) => b.id === boxId);
              if (box) {
                const boxMinX = box.x;
                const boxMaxX = box.x + box.width - 1;
                const boxMinY = box.y;
                const boxMaxY = box.y + box.height - 1;

                if (
                  x >= boxMinX &&
                  x <= boxMaxX &&
                  y >= boxMinY &&
                  y <= boxMaxY
                ) {
                  positionCovered = true;
                  break;
                }
              }
            }

            if (!positionCovered) {
              canMerge = false;
              break;
            }
          }
          if (!canMerge) break;
        }

        if (
          canMerge &&
          mergeWidth <= MAX_GRID_SIZE &&
          mergeHeight <= MAX_GRID_SIZE
        ) {
          setMergePreview({
            visible: true,
            x: minX,
            y: minY,
            width: mergeWidth,
            height: mergeHeight,
            boxIds: Array.from(boxesToMerge),
          });
        } else {
          setMergePreview(null);
        }
      }
    },
    [boxes]
  );

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
        clearMergePreview();
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
        clearMergePreview();
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      // Small delay to avoid immediate closure of context menu that was just opened
      setTimeout(() => {
        const target = e.target as Element;
        const isContextMenuClick = target?.closest('[data-context-menu]');

        if (!isContextMenuClick) {
          setContextMenu({ visible: false, x: 0, y: 0, boxId: '' });
          setColorPicker({ visible: false, x: 0, y: 0, boxId: '' });
          clearMergePreview();
        }
      }, 10);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [isDragging, dragStartBox, clearMergePreview]);

  useEffect(() => {
    if (
      isDragging &&
      dragStartBox &&
      dragOverBox &&
      dragStartBox !== dragOverBox
    ) {
      calculateMergePreview(dragStartBox, dragOverBox);
    } else if (!isDragging) {
      clearMergePreview();
    }
  }, [
    isDragging,
    dragStartBox,
    dragOverBox,
    calculateMergePreview,
    clearMergePreview,
  ]);

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
    const newBoxes = getDefaultBoxes();
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
      // Get current grid bounds
      let minX = x,
        maxX = x,
        minY = y,
        maxY = y;
      if (boxes.length > 0) {
        minX = Math.min(x, ...boxes.map((box) => box.x));
        maxX = Math.max(x, ...boxes.map((box) => box.x + box.width - 1));
        minY = Math.min(y, ...boxes.map((box) => box.y));
        maxY = Math.max(y, ...boxes.map((box) => box.y + box.height - 1));
      }

      // Check if adding this box would exceed 7x7 grid
      const gridWidth = maxX - minX + 1;
      const gridHeight = maxY - minY + 1;

      if (gridWidth > MAX_GRID_SIZE || gridHeight > MAX_GRID_SIZE) {
        return;
      }

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

  const explodeAllBoxes = useCallback(() => {
    const allIndividualBoxes: GridBox[] = [];

    boxes.forEach((box) => {
      if (box.width === 1 && box.height === 1) {
        // Box is already individual, keep as is but remove widget
        allIndividualBoxes.push({
          ...box,
          widget: undefined,
        });
      } else {
        // Break down merged box into individual boxes without widgets
        for (let i = 0; i < box.width; i++) {
          for (let j = 0; j < box.height; j++) {
            allIndividualBoxes.push({
              id: `${Date.now()}-${box.id}-${i}-${j}`,
              x: box.x + i,
              y: box.y + j,
              width: 1,
              height: 1,
              color: box.color,
              // Explicitly set widget to undefined to remove all widgets
              widget: undefined,
            });
          }
        }
      }
    });

    setBoxes(allIndividualBoxes);
    saveToHistory(allIndividualBoxes);
  }, [boxes, saveToHistory]);

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

    // Get current grid bounds
    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = 0;
    if (boxes.length > 0) {
      minX = Math.min(...boxes.map((box) => box.x));
      maxX = Math.max(...boxes.map((box) => box.x + box.width - 1));
      minY = Math.min(...boxes.map((box) => box.y));
      maxY = Math.max(...boxes.map((box) => box.y + box.height - 1));
    }

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
            { x: 0, y: -1 }, // atas
            { x: 1, y: 0 }, // kanan
            { x: 0, y: 1 }, // bawah
            { x: -1, y: 0 }, // kiri
          ];

          directions.forEach((dir) => {
            const newX = currentX + dir.x;
            const newY = currentY + dir.y;
            const posKey = `${newX},${newY}`;

            if (!occupiedPositions.has(posKey)) {
              // Calculate bounds if this position is added
              const newMinX = Math.min(minX, newX);
              const newMaxX = Math.max(maxX, newX);
              const newMinY = Math.min(minY, newY);
              const newMaxY = Math.max(maxY, newY);

              const newGridWidth = newMaxX - newMinX + 1;
              const newGridHeight = newMaxY - newMinY + 1;

              // Allow position if either:
              // 1. Both width and height are within limits, OR
              // 2. Only width exceeds limit but height is within limit (vertical expansion), OR
              // 3. Only height exceeds limit but width is within limit (horizontal expansion)
              const widthOk = newGridWidth <= MAX_GRID_SIZE;
              const heightOk = newGridHeight <= MAX_GRID_SIZE;

              if (widthOk && heightOk) {
                ghostPositions.add(posKey);
              } else if (!widthOk && heightOk && dir.x === 0) {
                // Width exceeded but height OK, allow vertical movement (up/down)
                ghostPositions.add(posKey);
              } else if (widthOk && !heightOk && dir.y === 0) {
                // Height exceeded but width OK, allow horizontal movement (left/right)
                ghostPositions.add(posKey);
              }
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

      if (sourceBox && targetBox) {
        // Check if boxes are adjacent for traditional merge
        if (areAdjacent(sourceBox, targetBox)) {
          // Traditional adjacent merge - expand to include overlapping boxes
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
            widget: sourceBox.widget || targetBox.widget,
          };

          // Check if merged box would exceed 7x7 grid
          const gridWidth = maxX - minX + 1;
          const gridHeight = maxY - minY + 1;

          if (gridWidth <= MAX_GRID_SIZE && gridHeight <= MAX_GRID_SIZE) {
            const newBoxes = boxes
              .filter((box) => !boxesToRemove.has(box.id))
              .concat(mergedBox);
            setBoxes(newBoxes);
            saveToHistory(newBoxes);
          }
        } else {
          // Multi-box merge for non-adjacent boxes
          // Calculate the bounding box that would contain both source and target
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

          // Find all boxes that would be included in this rectangular area
          const boxesToMerge = new Set([sourceId, targetId]);

          boxes.forEach((box) => {
            if (!boxesToMerge.has(box.id)) {
              const boxMinX = box.x;
              const boxMaxX = box.x + box.width - 1;
              const boxMinY = box.y;
              const boxMaxY = box.y + box.height - 1;

              // Check if this box overlaps with or is contained within the merge area
              const overlapsX = !(boxMaxX < minX || boxMinX > maxX);
              const overlapsY = !(boxMaxY < minY || boxMinY > maxY);

              if (overlapsX && overlapsY) {
                boxesToMerge.add(box.id);
                // Expand the bounding box to include this box
                minX = Math.min(minX, boxMinX);
                maxX = Math.max(maxX, boxMaxX);
                minY = Math.min(minY, boxMinY);
                maxY = Math.max(maxY, boxMaxY);
              }
            }
          });

          // Check if there are any gaps in the rectangular area that would be created
          const mergeWidth = maxX - minX + 1;
          const mergeHeight = maxY - minY + 1;
          let canMerge = true;

          // Check if the merge area forms a valid rectangle (no gaps)
          for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
              let positionCovered = false;

              for (const boxId of boxesToMerge) {
                const box = boxes.find((b) => b.id === boxId);
                if (box) {
                  const boxMinX = box.x;
                  const boxMaxX = box.x + box.width - 1;
                  const boxMinY = box.y;
                  const boxMaxY = box.y + box.height - 1;

                  if (
                    x >= boxMinX &&
                    x <= boxMaxX &&
                    y >= boxMinY &&
                    y <= boxMaxY
                  ) {
                    positionCovered = true;
                    break;
                  }
                }
              }

              if (!positionCovered) {
                canMerge = false;
                break;
              }
            }
            if (!canMerge) break;
          }

          // Check if merged box would exceed 7x7 grid limits
          if (mergeWidth > MAX_GRID_SIZE || mergeHeight > MAX_GRID_SIZE) {
            canMerge = false;
          }

          if (canMerge) {
            const mergedBox: GridBox = {
              id: Date.now().toString(),
              x: minX,
              y: minY,
              width: mergeWidth,
              height: mergeHeight,
              color: sourceBox.color,
              widget: sourceBox.widget || targetBox.widget,
            };

            const newBoxes = boxes
              .filter((box) => !boxesToMerge.has(box.id))
              .concat(mergedBox);
            setBoxes(newBoxes);
            saveToHistory(newBoxes);
          }
        }

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

  // Assignment mode functions
  const startAssignmentMode = useCallback(
    (
      widgetType: 'clock' | 'pomodoro' | 'notes' | 'todo' | 'music' | 'radio'
    ) => {
      setAssignmentMode({ active: true, widgetType });
    },
    []
  );

  const cancelAssignmentMode = useCallback(() => {
    setAssignmentMode({ active: false, widgetType: null });
  }, []);

  const assignWidgetToBox = useCallback(
    (boxId: string) => {
      if (!assignmentMode.active || !assignmentMode.widgetType) return;

      const newBoxes = boxes.map((box) =>
        box.id === boxId
          ? { ...box, widget: { type: assignmentMode.widgetType!, data: {} } }
          : box
      );

      setBoxes(newBoxes);
      saveToHistory(newBoxes);
      setAssignmentMode({ active: false, widgetType: null });
    },
    [boxes, assignmentMode, saveToHistory]
  );

  const deleteWidget = useCallback(
    (boxId: string) => {
      const newBoxes = boxes.map((box) =>
        box.id === boxId ? { ...box, widget: undefined } : box
      );

      setBoxes(newBoxes);
      saveToHistory(newBoxes);
    },
    [boxes, saveToHistory]
  );

  // Widget drag handlers
  const startWidgetDrag = useCallback((widgetType: string) => {
    setIsDraggingWidget(true);
    setDraggedWidgetType(widgetType);
  }, []);

  const endWidgetDrag = useCallback(() => {
    setIsDraggingWidget(false);
    setDraggedWidgetType(null);
    // Cancel assignment mode if it was activated during drag
    if (assignmentMode.active) {
      setAssignmentMode({ active: false, widgetType: null });
    }
  }, [assignmentMode.active]);

  const handleWidgetDragEnterGrid = useCallback(() => {
    if (isDraggingWidget && draggedWidgetType && !editMode) {
      // Auto-activate assignment mode when widget is dragged over grid
      if (
        draggedWidgetType === 'clock' ||
        draggedWidgetType === 'pomodoro' ||
        draggedWidgetType === 'notes' ||
        draggedWidgetType === 'todo' ||
        draggedWidgetType === 'music' ||
        draggedWidgetType === 'radio'
      ) {
        setAssignmentMode({ active: true, widgetType: draggedWidgetType });
      }
    }
  }, [isDraggingWidget, draggedWidgetType, editMode]);

  const handleWidgetDragLeaveGrid = useCallback(() => {
    // Deactivate assignment mode when widget leaves grid area
    if (assignmentMode.active && isDraggingWidget) {
      setAssignmentMode({ active: false, widgetType: null });
    }
  }, [assignmentMode.active, isDraggingWidget]);

  return {
    // State
    boxes,
    isDragging,
    dragStartBox,
    dragOverBox,
    showResetDialog,
    isResetting,
    editMode,
    history,
    historyIndex,
    contextMenu,
    colorPicker,
    assignmentMode,
    mergePreview,
    dragArea,
    isDraggingWidget,
    draggedWidgetType,

    // Actions
    toggleEditMode,
    undo,
    redo,
    resetGrid,
    confirmReset,
    addBox,
    deleteBox,
    unmergeBox,
    explodeAllBoxes,
    changeBoxColor,
    mergeBoxes,

    // Utilities
    getGhostPositions,
    calculateMergePreview,
    clearMergePreview,
    clearDragArea,

    // Event handlers
    handleColorHover,
    handleColorLeave,

    // Setters (for event handlers)
    setShowResetDialog,
    setDragStartBox,
    setDragOverBox,
    setIsDragging,
    setContextMenu,
    setColorPicker,

    // Assignment mode
    startAssignmentMode,
    cancelAssignmentMode,
    assignWidgetToBox,
    deleteWidget,

    // Widget drag handlers
    startWidgetDrag,
    endWidgetDrag,
    handleWidgetDragEnterGrid,
    handleWidgetDragLeaveGrid,
  };
};
