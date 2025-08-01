import { AVAILABLE_COLORS } from '../constants';

interface ColorPickerProps {
  visible: boolean;
  x: number;
  y: number;
  onColorSelect: (color: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ColorPicker = ({
  visible,
  x,
  y,
  onColorSelect,
  onMouseEnter,
  onMouseLeave,
}: ColorPickerProps) => {
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
