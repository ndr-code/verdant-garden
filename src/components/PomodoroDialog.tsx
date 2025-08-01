import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PomodoroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PomodoroDialog = ({ open, onOpenChange }: PomodoroDialogProps) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: number;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);

      if (session === 'work') {
        setSession('break');
        setTimeLeft(breakDuration * 60);
      } else {
        setSession('work');
        setTimeLeft(workDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, session, workDuration, breakDuration]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (session === 'work') {
      setTimeLeft(workDuration * 60);
    } else {
      setTimeLeft(breakDuration * 60);
    }
  };

  const switchSession = () => {
    setIsRunning(false);
    if (session === 'work') {
      setSession('break');
      setTimeLeft(breakDuration * 60);
    } else {
      setSession('work');
      setTimeLeft(workDuration * 60);
    }
  };

  const updateWorkDuration = (newDuration: number) => {
    setWorkDuration(newDuration);
    if (session === 'work') {
      setTimeLeft(newDuration * 60);
    }
  };

  const updateBreakDuration = (newDuration: number) => {
    setBreakDuration(newDuration);
    if (session === 'break') {
      setTimeLeft(newDuration * 60);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]'
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

                {/* Duration Controls */}
                <motion.div
                  className='grid grid-cols-2 gap-4 mb-6 w-full'
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
                          updateWorkDuration(Math.max(1, workDuration - 1))
                        }
                        className='w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 cursor-pointer'
                        disabled={isRunning}
                      >
                        -
                      </button>
                      <span className='text-lg font-mono w-12 text-center'>
                        {workDuration}m
                      </span>
                      <button
                        onClick={() => updateWorkDuration(workDuration + 1)}
                        className='w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 cursor-pointer'
                        disabled={isRunning}
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
                          updateBreakDuration(Math.max(1, breakDuration - 1))
                        }
                        className='w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 cursor-pointer'
                        disabled={isRunning}
                      >
                        -
                      </button>
                      <span className='text-lg font-mono w-12 text-center'>
                        {breakDuration}m
                      </span>
                      <button
                        onClick={() => updateBreakDuration(breakDuration + 1)}
                        className='w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-700 cursor-pointer'
                        disabled={isRunning}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </motion.div>

                <div className='text-center mb-6'>
                  <motion.div
                    className='text-sm font-medium text-gray-500 mb-2'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {session === 'work' ? 'Work Session' : 'Break Time'}
                  </motion.div>

                  <motion.div
                    className={`text-6xl font-mono font-bold mb-4 ${
                      session === 'work' ? 'text-red-500' : 'text-green-500'
                    }`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>

                  <motion.div
                    className='flex justify-center gap-4'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                  >
                    <button
                      onClick={toggleTimer}
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors cursor-pointer ${
                        isRunning
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isRunning ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <button
                      onClick={resetTimer}
                      className='flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors cursor-pointer'
                    >
                      <RotateCcw size={20} />
                    </button>
                  </motion.div>

                  <motion.div
                    className='mt-4'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      onClick={switchSession}
                      className='text-sm text-gray-600 hover:text-gray-800 transition-colors underline cursor-pointer'
                    >
                      Switch to {session === 'work' ? 'Break' : 'Work'} Session
                    </button>
                  </motion.div>
                </div>

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
