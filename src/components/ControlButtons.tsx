import { Undo2, Redo2, RotateCcw, Edit3 } from 'lucide-react';

interface ControlButtonsProps {
  editMode: boolean;
  onToggleEdit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const ControlButtons = ({
  editMode,
  onToggleEdit,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
}: ControlButtonsProps) => (
  <div className='absolute top-4 right-4 flex gap-3 z-50'>
    {editMode && (
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`w-12 h-12 cursor-pointer rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center border-0 ${
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
        className={`w-12 h-12 cursor-pointer rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center border-0 ${
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
        className='w-12 h-12 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center border-0'
      >
        <RotateCcw size={20} />
      </button>
    )}
    <button
      onClick={onToggleEdit}
      className={`w-12 h-12 cursor-pointer rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center border-0 ${
        editMode
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
    >
      <Edit3 size={20} />
    </button>
  </div>
);
