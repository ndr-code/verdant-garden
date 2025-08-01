import type { GridBox } from '../types';

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  box: GridBox | undefined;
  onDelete: () => void;
  onUnmerge: () => void;
  onColorHover: () => void;
  onColorLeave: (e: React.MouseEvent) => void;
}

export const ContextMenu = ({
  visible,
  x,
  y,
  box,
  onDelete,
  onUnmerge,
  onColorHover,
  onColorLeave,
}: ContextMenuProps) => {
  if (!visible || !box) return null;

  const isSmallBox = box.width === 1 && box.height === 1;

  return (
    <div
      className='fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[200]'
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className='w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center gap-2 cursor-pointer border-0 bg-transparent'
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
        className='w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 transition-colors duration-150 flex items-center gap-2 relative cursor-pointer border-0 bg-transparent'
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
          className='w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 transition-colors duration-150 flex items-center gap-2 cursor-pointer border-0 bg-transparent'
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
