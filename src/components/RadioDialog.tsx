import { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio } from 'lucide-react';

interface RadioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RadioDialog = ({ open, onOpenChange }: RadioDialogProps) => {
  const radioContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && radioContainerRef.current) {
      // Clear any existing content
      radioContainerRef.current.innerHTML = '';

      // Create the script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://jak101fm.audioplus.audio/embed.js';
      script.setAttribute('data-player', '');
      script.id = 'player-embed';

      // Append script to the container
      radioContainerRef.current.appendChild(script);
    }
  }, [open]);

  // Cleanup script when dialog closes
  useEffect(() => {
    return () => {
      const existingScript = document.getElementById('player-embed');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

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
                className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 rounded-lg shadow-xl max-w-lg w-full mx-4 z-[101]'
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
                {/* Header */}
                <div className='flex items-center justify-between p-6 pb-4 border-b border-gray-200'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-red-500 rounded-full'>
                      <Radio className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <Dialog.Title className='text-xl font-bold text-gray-800'>
                        JAK 101 FM
                      </Dialog.Title>
                      <p className='text-sm text-gray-600'>Live Radio Stream</p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <motion.button
                      className='p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-full hover:bg-gray-100'
                      aria-label='Close'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Cross2Icon className='w-5 h-5' />
                    </motion.button>
                  </Dialog.Close>
                </div>

                {/* Radio Player Content */}
                <div className='p-6'>
                  <motion.div
                    className='bg-gradient-to-br from-red-900 via-red-800 to-orange-900 rounded-lg p-6 mb-4'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className='text-center text-white mb-4'>
                      <h3 className='text-lg font-semibold mb-2'>Now Live</h3>
                      <div className='flex items-center justify-center gap-2 mb-4'>
                        <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
                        <span className='text-sm'>Broadcasting Live</span>
                      </div>
                    </div>

                    {/* Radio Player Container */}
                    <div
                      ref={radioContainerRef}
                      className='bg-white/10 rounded-lg p-4 min-h-[120px] flex items-center justify-center'
                    >
                      <div className='text-center text-white/80'>
                        <Radio className='w-8 h-8 mx-auto mb-2 animate-pulse' />
                        <p className='text-sm'>Loading radio player...</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Radio Info */}
                  <motion.div
                    className='bg-gray-50 rounded-lg p-4'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className='font-semibold text-gray-800 mb-2'>
                      About JAK 101 FM
                    </h4>
                    <p className='text-sm text-gray-600 mb-3'>
                      Jakarta's premier radio station delivering the best music,
                      news, and entertainment 24/7.
                    </p>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='font-medium text-gray-700'>
                          Frequency:
                        </span>
                        <p className='text-gray-600'>101.0 FM</p>
                      </div>
                      <div>
                        <span className='font-medium text-gray-700'>
                          Location:
                        </span>
                        <p className='text-gray-600'>Jakarta, Indonesia</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};
