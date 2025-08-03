import { useState, useEffect } from 'react';

// Import types and constants
import { BOX_SIZE, GAP } from './constants';

// Import components
import { ControlButtons } from './components/ControlButtons';
import { ResetDialog } from './components/ResetDialog';
import { ContextMenu } from './components/ContextMenu';
import { ColorPicker } from './components/ColorPicker';
import Grid from './components/Grid';
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
    assignmentMode,
    mergePreview,
    explodingBoxId,
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
    getGhostPositions,
    handleColorHover,
    handleColorLeave,
    setShowResetDialog,
    setDragStartBox,
    setDragOverBox,
    setIsDragging,
    setContextMenu,
    setColorPicker,
    startAssignmentMode,
    cancelAssignmentMode,
    assignWidgetToBox,
    deleteWidget,
    startWidgetDrag,
    endWidgetDrag,
    handleWidgetDragEnterGrid,
    handleWidgetDragLeaveGrid,
  } = useEditMode();

  // Dialog state
  const [showClockDialog, setShowClockDialog] = useState(false);
  const [clockDialogMode, setClockDialogMode] = useState<'assign' | 'view'>(
    'assign'
  );
  const [selectedClockBoxId, setSelectedClockBoxId] = useState<string | null>(
    null
  );
  const [showPomodoroDialog, setShowPomodoroDialog] = useState(false);
  const [pomodoroDialogMode, setPomodoroDialogMode] = useState<
    'assign' | 'view'
  >('assign');
  const [selectedPomodoroBoxId, setSelectedPomodoroBoxId] = useState<
    string | null
  >(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showTodoDialog, setShowTodoDialog] = useState(false);
  const [showMusicDialog, setShowMusicDialog] = useState(false);
  const [showRadioDialog, setShowRadioDialog] = useState(false);
  const [isMusicMinimized, setIsMusicMinimized] = useState(false);

  // Mouse tracking for click vs drag detection
  const [mouseDownPos, setMouseDownPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Derived state
  const bounds = getBounds(boxes);
  const gridWidth = (bounds.maxX - bounds.minX + 1) * (BOX_SIZE + GAP) - GAP;
  const gridHeight = (bounds.maxY - bounds.minY + 1) * (BOX_SIZE + GAP) - GAP;

  // Handle widget assignment by drag
  const handleAssignWidgetByDrag = (boxId: string, widgetType: string) => {
    // Find the box and check if it doesn't already have a widget
    const box = boxes.find((b) => b.id === boxId);
    if (box && !box.widget) {
      // Start assignment mode with the specific widget type
      if (
        widgetType === 'clock' ||
        widgetType === 'pomodoro' ||
        widgetType === 'notes' ||
        widgetType === 'todo' ||
        widgetType === 'music' ||
        widgetType === 'radio'
      ) {
        startAssignmentMode(widgetType);
        // Assign immediately without delay since assignment mode is now active
        assignWidgetToBox(boxId);
      }
    }
  };

  // ESC key to cancel assignment mode, Ctrl+Z/Y for undo/redo in edit mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && assignmentMode.active) {
        cancelAssignmentMode();
      }

      // Undo/Redo shortcuts in edit mode
      if (editMode && (e.ctrlKey || e.metaKey)) {
        if (e.key === 'z' && !e.shiftKey && historyIndex > 0) {
          e.preventDefault();
          undo();
        } else if (
          (e.key === 'y' || (e.key === 'z' && e.shiftKey)) &&
          historyIndex < history.length - 1
        ) {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    assignmentMode.active,
    editMode,
    historyIndex,
    history.length,
    cancelAssignmentMode,
    undo,
    redo,
  ]);

  return (
    <div
      className={`min-h-screen flex flex-col relative transition-all duration-300 ${
        editMode ? 'border-12 bg-gray-800 edit-mode-border' : 'bg-gray-900'
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
          onExplode={explodeAllBoxes}
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
          assignmentMode={assignmentMode}
          mergePreview={mergePreview}
          explodingBoxId={explodingBoxId}
          onAddBox={addBox}
          onAssignWidget={assignWidgetToBox}
          onAssignWidgetByDrag={handleAssignWidgetByDrag}
          onWidgetDragEnterGrid={handleWidgetDragEnterGrid}
          onWidgetDragLeaveGrid={handleWidgetDragLeaveGrid}
          onClockWidgetClick={(boxId: string) => {
            if (!editMode) {
              setSelectedClockBoxId(boxId);
              setClockDialogMode('view');
              setShowClockDialog(true);
            }
          }}
          onPomodoroWidgetClick={(boxId: string) => {
            if (!editMode) {
              setSelectedPomodoroBoxId(boxId);
              setPomodoroDialogMode('view');
              setShowPomodoroDialog(true);
            }
          }}
          onMouseDown={(e, boxId) => {
            if (e.button === 0 && editMode) {
              e.preventDefault();
              setMouseDownPos({ x: e.clientX, y: e.clientY });
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
            e.stopPropagation();

            // Check if this was a click (no significant mouse movement) vs drag
            if (mouseDownPos && editMode && dragStartBox) {
              const mouseMovement =
                Math.abs(e.clientX - mouseDownPos.x) +
                Math.abs(e.clientY - mouseDownPos.y);
              const isClick = mouseMovement < 5; // Less than 5px movement = click

              if (isClick) {
                // This was a click, show context menu with slight delay
                setTimeout(() => {
                  setContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    boxId: dragStartBox,
                  });
                }, 50);
              } else if (
                isDragging &&
                dragStartBox &&
                dragOverBox &&
                dragStartBox !== dragOverBox
              ) {
                // This was a drag, merge boxes
                mergeBoxes(dragStartBox, dragOverBox);
              }
            }

            // Reset states
            setIsDragging(false);
            setDragStartBox(null);
            setDragOverBox(null);
            setMouseDownPos(null);
          }}
          onGhostBoxDrop={(ghostX, ghostY) => {
            if (dragStartBox && editMode) {
              // Simple approach: just add a box at ghost position
              addBox(ghostX, ghostY);
              setIsDragging(false);
              setDragStartBox(null);
              setDragOverBox(null);
            }
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
          onDeleteWidget={() => deleteWidget(contextMenu.boxId)}
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

        <ClockDialog
          open={showClockDialog}
          onOpenChange={setShowClockDialog}
          onAssignToGrid={() => startAssignmentMode('clock')}
          onRemoveWidget={() => {
            if (selectedClockBoxId) {
              deleteWidget(selectedClockBoxId);
              setSelectedClockBoxId(null);
            }
          }}
          mode={clockDialogMode}
        />
        <PomodoroDialog
          open={showPomodoroDialog}
          onOpenChange={setShowPomodoroDialog}
          onAssignToGrid={() => startAssignmentMode('pomodoro')}
          onRemoveWidget={() => {
            if (selectedPomodoroBoxId) {
              deleteWidget(selectedPomodoroBoxId);
              setSelectedPomodoroBoxId(null);
            }
          }}
          mode={pomodoroDialogMode}
        />
        <NotesDialog open={showNotesDialog} onOpenChange={setShowNotesDialog} />
        <TodoDialog open={showTodoDialog} onOpenChange={setShowTodoDialog} />
        <RadioDialog open={showRadioDialog} onOpenChange={setShowRadioDialog} />
        <MusicDialog
          open={showMusicDialog}
          onOpenChange={setShowMusicDialog}
          isMinimized={isMusicMinimized}
          onMinimize={setIsMusicMinimized}
          editMode={editMode}
        />
      </div>

      {/* Bottom Dock */}
      <BottomDock
        editMode={editMode}
        onWidgetDragStart={startWidgetDrag}
        onWidgetDragEnd={endWidgetDrag}
        onClockClick={() => {
          if (!editMode) {
            setClockDialogMode('assign');
            setSelectedClockBoxId(null);
            setShowClockDialog(true);
          }
        }}
        onTimerClick={() => {
          if (!editMode) {
            setPomodoroDialogMode('assign');
            setSelectedPomodoroBoxId(null);
            setShowPomodoroDialog(true);
          }
        }}
        onNotesClick={() => {
          if (!editMode) {
            setShowNotesDialog(true);
          }
        }}
        onTodoClick={() => {
          if (!editMode) {
            setShowTodoDialog(true);
          }
        }}
        onMusicClick={() => {
          if (!editMode) {
            if (isMusicMinimized) {
              setIsMusicMinimized(false);
              setShowMusicDialog(true);
            } else {
              setShowMusicDialog(true);
            }
          }
        }}
        onRadioClick={() => {
          if (!editMode) {
            setShowRadioDialog(true);
          }
        }}
      />
    </div>
  );
}

export default App;
