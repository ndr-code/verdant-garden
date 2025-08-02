import { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Play } from 'lucide-react';

interface RadioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RadioDialog = ({ open, onOpenChange }: RadioDialogProps) => {
  // Load JAK FM embed script
  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      // Remove existing script if any
      const existingScript = document.getElementById('jak-fm-embed');
      if (existingScript) {
        existingScript.remove();
      }

      // Add JAK FM embed script
      const script = document.createElement('script');
      script.id = 'jak-fm-embed';
      script.type = 'text/javascript';
      script.src = 'https://jak101fm.audioplus.audio/embed.js';
      script.setAttribute('data-player', '');
      script.async = true;

      document.head.appendChild(script);

      return () => {
        // Cleanup script when component unmounts or player stops
        const scriptToRemove = document.getElementById('jak-fm-embed');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [open]);

  // Open in popup window
  const openInPopup = () => {
    const popupFeatures = [
      'width=900',
      'height=400',
      'resizable=yes',
      'scrollbars=yes',
      'toolbar=no',
      'menubar=no',
      'location=no',
      'directories=no',
      'status=no',
    ].join(',');

    window.open(
      'https://jak101fm.audioplus.audio/#play',
      'jak101fm_popup',
      popupFeatures
    );
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
                aria-describedby='radio-description'
              >
                {/* Header */}
                <div className='flex items-center justify-between p-6 pb-4 border-b border-gray-200'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-red-500 rounded-full'>
                      <Radio className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <Dialog.Title className='text-xl font-bold text-gray-800'>
                        Live Radio Stream
                      </Dialog.Title>
                      <Dialog.Description
                        id='radio-description'
                        className='text-sm text-gray-600'
                      >
                        Listen to your favorite radio station
                      </Dialog.Description>
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
                    <div className='text-center text-white mb-6'>
                      <h3 className='text-xl font-bold mb-2'></h3>
                      <div className='flex items-center justify-center gap-2 mb-6'>
                        <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
                        <span className='text-sm'>Broadcasting Live</span>
                      </div>
                    </div>

                    {/* Radio Player - Embedded */}
                    <div className='text-center space-y-4'>
                      <div>
                        <Radio className='w-16 h-16 mx-auto mb-4 text-white/80' />

                        {/* Primary Play Button */}
                        <button
                          onClick={openInPopup}
                          className='p-4 bg-white text-red-700 hover:scale-110 rounded-lg transition-all duration-300 font-semibold flex items-center gap-3 mx-auto text-md cursor-pointer'
                        >
                          <Play className='w-6 h-6' />
                          Play Favorite Radio
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Radio Info Section (Optional) */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className='text-center'>
                      <p className='text-sm text-gray-600'>
                        Streaming will be played in a new popup window.
                      </p>
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
