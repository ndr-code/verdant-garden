import type { GridBox } from '../types';

export const getBounds = (boxes: GridBox[]) => {
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
