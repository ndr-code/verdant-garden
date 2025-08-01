import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio,  Play, Pause } from 'lucide-react';

interface RadioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RadioDialog = ({ open, onOpenChange }: RadioDialogProps) => {
  const [showPlayer, setShowPlayer] = useState(false);

  // Load JAK FM embed script
  useEffect(() => {
    if (showPlayer && typeof window !== 'undefined') {
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
  }, [showPlayer]);

  // Stop radio
  const stopRadio = () => {
    setShowPlayer(false);
  };

  // Open in new window as fallback
  const openInNewWindow = () => {
    window.open('https://jak101fm.audioplus.audio/#play', '_blank');
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
                        JAK 101 FM
                      </Dialog.Title>
                      <Dialog.Description
                        id='radio-description'
                        className='text-sm text-gray-600'
                      >
                        Live Radio Stream
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
                      <h3 className='text-xl font-bold mb-2'>JAK 101 FM</h3>
                      <div className='flex items-center justify-center gap-2 mb-6'>
                        <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
                        <span className='text-sm'>Broadcasting Live</span>
                      </div>
                    </div>

                    {/* Radio Player - Embedded */}
                    <div className='text-center space-y-4'>
                      {!showPlayer ? (
                        // Play Button State
                        <div className='bg-white/10 rounded-lg p-6'>
                          <Radio className='w-16 h-16 mx-auto mb-4 text-white/80' />
                          <h4 className='text-white font-semibold mb-2 text-lg'>
                            Listen to JAK 101 FM
                          </h4>
                          <p className='text-white/80 text-sm mb-6'>
                            Jakarta's premier radio station delivering the best
                            music, news, and entertainment 24/7.
                          </p>

                          {/* Primary Play Button */}
                          <button
                            onClick={openInNewWindow}
                            className='px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto text-lg cursor-pointer'
                          >
                            <Play className='w-6 h-6' />
                            🎵 Play JAK 101 FM
                          </button>
                        </div>
                      ) : (
                        // Radio Player State
                        <div className='bg-white/10 rounded-lg p-4'>
                          <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-2'>
                              <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                              <span className='text-white text-sm font-medium'>
                                Now Playing
                              </span>
                            </div>
                            <button
                              onClick={stopRadio}
                              className='px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors cursor-pointer'
                            >
                              <Pause className='w-4 h-4 inline mr-1' />
                              Stop
                            </button>
                          </div>

                          {/* Embedded JAK FM Player using proper script */}
                          <div className='bg-black/20 rounded-lg overflow-hidden p-4'>
                            <div
                              id='player-embed'
                              className='min-h-[150px] flex items-center justify-center'
                            >
                              {/* The JAK FM embed script will populate this div */}
                              <div className='text-white/60 text-sm'>
                                Loading JAK 101 FM Player...
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stream info */}
                      <div className='text-center text-white/60 text-xs'>
                        <p>🎵 Live from Jakarta, Indonesia • 101.0 FM</p>
                        <p className='mt-1'>All Great Things For Your Day!</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Radio Info Section (Optional) */}
                  <motion.div
                    className='bg-gray-50 rounded-lg p-4'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className='text-center'>
                      <h4 className='font-semibold text-gray-800 mb-2'>
                        About JAK 101 FM
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Jakarta's premier radio station • 101.0 FM • Jakarta,
                        Indonesia
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
