import type { GridBox } from '../types';

export const getBounds = (boxes: GridBox[]) => {
  if (boxes.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

  const minX = Math.min(...boxes.map((box) => box.x));
  const maxX = Math.max(...boxes.map((box) => box.x + box.width - 1));
  const minY = Math.min(...boxes.map((box) => box.y));
  const maxY = Math.max(...boxes.map((box) => box.y + box.height - 1));

  return { minX, maxX, minY, maxY };
};
