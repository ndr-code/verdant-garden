import { Undo2, Redo2, RotateCcw, Edit3, Loader } from 'lucide-react';

interface ControlButtonsProps {
  editMode: boolean;
  onToggleEdit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onExplode: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const ControlButtons = ({
  editMode,
  onToggleEdit,
  onUndo,
  onRedo,
  onReset,
  onExplode,
  canUndo,
  canRedo,
}: ControlButtonsProps) => (
  <div className='absolute top-4 right-4 flex gap-3 z-50'>
    {editMode && (
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title={canUndo ? 'Undo (Ctrl+Z)' : 'No actions to undo'}
        className={`w-12 h-12 cursor-pointer rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center border-0 ${
          !canUndo
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}
      >
        <Undo2 size={20} />
      </button>
    )}
    {editMode && (
      <button
        onClick={onRedo}
        disabled={!canRedo}
        title={canRedo ? 'Redo (Ctrl+Y)' : 'No actions to redo'}
        className={`w-12 h-12 cursor-pointer rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center border-0 ${
          !canRedo
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}
      >
        <Redo2 size={20} />
      </button>
    )}
    {editMode && (
      <button
        onClick={onExplode}
        className='w-12 h-12 cursor-pointer bg-gray-500 hover:bg-red-800 text-white rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center border-0'
        title='Explode (Unmerge all boxes)'
      >
        <Loader size={20} />
      </button>
    )}
    {editMode && (
      <button
        onClick={onReset}
        title='Reset Grid'
        className='w-12 h-12 cursor-pointer bg-gray-500 hover:bg-red-800 text-white rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center border-0'
      >
        <RotateCcw size={20} />
      </button>
    )}
    <button
      onClick={onToggleEdit}
      title={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
      className={`w-12 h-12 cursor-pointer rounded-lg shadow-lg transition-colors duration-200 font-medium flex items-center justify-center border-0 ${
        editMode
          ? 'bg-red-700 hover:bg-red-800 text-white'
          : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
    >
      <Edit3 size={20} />
    </button>
  </div>
);
