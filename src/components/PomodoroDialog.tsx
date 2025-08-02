import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Pomodoro } from './Pomodoro';

interface PomodoroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignToGrid?: () => void;
  onRemoveWidget?: () => void;
  mode?: 'assign' | 'view';
}

export const PomodoroDialog = ({
  open,
  onOpenChange,
  onAssignToGrid,
  onRemoveWidget,
  mode = 'assign',
}: PomodoroDialogProps) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const handleAssignToGrid = () => {
    onAssignToGrid?.();
    onOpenChange(false);
  };

  const handleRemoveWidget = () => {
    onRemoveWidget?.();
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                className='fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className='flex flex-col items-center justify-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 rounded-lg p-8 shadow-xl max-w-md w-full mx-4 z-[101]'
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  y: -20,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
              >
                <Dialog.Title className='text-2xl font-bold text-gray-600 mb-6 text-center'>
                  Pomodoro Timer
                </Dialog.Title>

                <Pomodoro
                  size='large'
                  className='mb-6'
                  workDuration={workDuration}
                  breakDuration={breakDuration}
                />

                {mode === 'assign' ? (
                  <motion.button
                    className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer'
                    onClick={handleAssignToGrid}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                  >
                    Assign to Grid
                  </motion.button>
                ) : (
                  <motion.button
                    className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer'
                    onClick={handleRemoveWidget}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                  >
                    Remove Widget
                  </motion.button>
                )}

                {/* Duration Controls (only in assign mode) */}
                {mode === 'assign' && (
                  <motion.div
                    className='grid grid-cols-2 gap-4 mt-6 w-full'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    <div className='text-center'>
                      <label className='block text-sm font-medium text-gray-600 mb-2'>
                        Work Duration
                      </label>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          onClick={() =>
                            setWorkDuration(Math.max(1, workDuration - 1))
                          }
                          className='w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 cursor-pointer'
                        >
                          -
                        </button>
                        <span className='text-lg font-mono w-12 text-center'>
                          {workDuration}m
                        </span>
                        <button
                          onClick={() => setWorkDuration(workDuration + 1)}
                          className='w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 cursor-pointer'
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className='text-center'>
                      <label className='block text-sm font-medium text-gray-600 mb-2'>
                        Break Duration
                      </label>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          onClick={() =>
                            setBreakDuration(Math.max(1, breakDuration - 1))
                          }
                          className='w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 cursor-pointer'
                        >
                          -
                        </button>
                        <span className='text-lg font-mono w-12 text-center'>
                          {breakDuration}m
                        </span>
                        <button
                          onClick={() => setBreakDuration(breakDuration + 1)}
                          className='w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 cursor-pointer'
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Dialog.Close asChild>
                  <motion.button
                    className='cursor-pointer absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors'
                    aria-label='Close'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Cross2Icon className='w-4 h-4' />
                  </motion.button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};
