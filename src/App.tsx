import { useState } from 'react';

// Import types and constants
import { BOX_SIZE, GAP } from './constants';

// Import components
import { ControlButtons } from './components/ControlButtons';
import { ResetDialog } from './components/ResetDialog';
import { ContextMenu } from './components/ContextMenu';
import { ColorPicker } from './components/ColorPicker';
import { Grid } from './components/Grid';
import { ClockDialog } from './components/ClockDialog';
import { PomodoroDialog } from './components/PomodoroDialog';
import { NotesDialog } from './components/NotesDialog';
import { TodoDialog } from './components/TodoDialog';
import { MusicDialog } from './components/MusicDialog';
import { RadioDialog } from './components/RadioDialog';
import { BottomDock } from './components/BottomDock';

// Import custom hooks and utilities
import { useEditMode } from './hooks';
import { getBounds } from './utils';

// Main App Component
function App() {
  // Edit Mode Hook
  const {
    boxes,
    isDragging,
    dragStartBox,
    dragOverBox,
    showResetDialog,
    isResetting,
    editMode,
    historyIndex,
    history,
    contextMenu,
    colorPicker,
    toggleEditMode,
    undo,
    redo,
    resetGrid,
    confirmReset,
    addBox,
    deleteBox,
    unmergeBox,
    changeBoxColor,
    mergeBoxes,
    getGhostPositions,
    handleColorHover,
    handleColorLeave,
    setShowResetDialog,
    setDragStartBox,
    setDragOverBox,
    setIsDragging,
    setContextMenu,
    setColorPicker,
  } = useEditMode();

  // Dialog state
  const [showClockDialog, setShowClockDialog] = useState(false);
  const [showPomodoroDialog, setShowPomodoroDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showTodoDialog, setShowTodoDialog] = useState(false);
  const [showMusicDialog, setShowMusicDialog] = useState(false);
  const [showRadioDialog, setShowRadioDialog] = useState(false);
  const [isMusicMinimized, setIsMusicMinimized] = useState(false);

  // Derived state
  const bounds = getBounds(boxes);
  const gridWidth = (bounds.maxX - bounds.minX + 1) * (BOX_SIZE + GAP) - GAP;
  const gridHeight = (bounds.maxY - bounds.minY + 1) * (BOX_SIZE + GAP) - GAP;

  return (
    <div
      className={`min-h-screen bg-gray-900 flex flex-col relative ${
        editMode ? 'border-4 border-white/80' : ''
      }`}
    >
      {/* Main Content Area */}
      <div className='flex-1 flex items-center justify-center p-8 relative'>
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

        <Grid
          boxes={boxes}
          editMode={editMode}
          isDragging={isDragging}
          dragStartBox={dragStartBox}
          dragOverBox={dragOverBox}
          bounds={bounds}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          ghostPositions={getGhostPositions()}
          onAddBox={addBox}
          onMouseDown={(e, boxId) => {
            if (e.button === 0 && editMode) {
              e.preventDefault();
              setDragStartBox(boxId);
              setDragOverBox(null);
              setIsDragging(false);
            }
          }}
          onContextMenu={(e, boxId) => {
            if (editMode) {
              e.preventDefault();
              setContextMenu({
                visible: true,
                x: e.clientX,
                y: e.clientY,
                boxId: boxId,
              });
            }
          }}
          onMouseEnter={(boxId) => {
            if (dragStartBox && dragStartBox !== boxId && editMode) {
              setDragOverBox(boxId);
              setIsDragging(true);
            }
          }}
          onMouseLeave={(boxId) => {
            if (isDragging && editMode && dragOverBox === boxId) {
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
        />

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

        <ClockDialog open={showClockDialog} onOpenChange={setShowClockDialog} />
        <PomodoroDialog
          open={showPomodoroDialog}
          onOpenChange={setShowPomodoroDialog}
        />
        <NotesDialog open={showNotesDialog} onOpenChange={setShowNotesDialog} />
        <TodoDialog open={showTodoDialog} onOpenChange={setShowTodoDialog} />
        <RadioDialog open={showRadioDialog} onOpenChange={setShowRadioDialog} />
        <MusicDialog
          open={showMusicDialog}
          onOpenChange={setShowMusicDialog}
          isMinimized={isMusicMinimized}
          onMinimize={setIsMusicMinimized}
        />
      </div>

      {/* Bottom Dock */}
      <BottomDock
        onClockClick={() => setShowClockDialog(true)}
        onTimerClick={() => setShowPomodoroDialog(true)}
        onNotesClick={() => setShowNotesDialog(true)}
        onTodoClick={() => setShowTodoDialog(true)}
        onMusicClick={() => {
          if (isMusicMinimized) {
            setIsMusicMinimized(false);
            setShowMusicDialog(true);
          } else {
            setShowMusicDialog(true);
          }
        }}
        onRadioClick={() => setShowRadioDialog(true)}
      />
    </div>
  );
}

export default App;
