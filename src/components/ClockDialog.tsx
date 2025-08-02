import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from './Clock';

interface ClockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignToGrid?: () => void;
  onRemoveWidget?: () => void;
  mode?: 'assign' | 'view'; // New prop to determine mode
}

export const ClockDialog = ({
  open,
  onOpenChange,
  onAssignToGrid,
  onRemoveWidget,
  mode = 'assign',
}: ClockDialogProps) => {
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
                  Digital Clock
                </Dialog.Title>

                <Clock size='large' showDate={true} className='mb-6' />

                {mode === 'assign' ? (
                  <motion.button
                    className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer'
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
                    className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-sm rounded-lg font-medium transition-colors duration-200 cursor-pointer'
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
