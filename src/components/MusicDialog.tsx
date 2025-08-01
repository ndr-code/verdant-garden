import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface AmbienceTrack {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
}

interface MusicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMinimized: boolean;
  onMinimize: (minimized: boolean) => void;
}

const ambienceTracks: AmbienceTrack[] = [
  {
    id: '1',
    title: 'Rain Forest Sounds',
    description: 'Relaxing rain and forest ambience for focus and sleep',
    youtubeId: 'nDq6TstdEi8',
    category: 'Nature',
  },
  {
    id: '2',
    title: 'Coffee Shop Ambience',
    description: 'Cozy coffee shop sounds for productivity',
    youtubeId: 'h2zkV-l_TbY',
    category: 'Urban',
  },
  {
    id: '3',
    title: 'Ocean Waves',
    description: 'Peaceful ocean waves for relaxation',
    youtubeId: 'WHPEKLQID4U',
    category: 'Nature',
  },
  {
    id: '4',
    title: 'Fireplace Crackling',
    description: 'Warm fireplace sounds for cozy atmosphere',
    youtubeId: 'L_LUpnjgPso',
    category: 'Cozy',
  },
  {
    id: '5',
    title: 'Library Ambience',
    description: 'Quiet library atmosphere for deep focus',
    youtubeId: 'jWBmtGAK-7M',
    category: 'Study',
  },
  {
    id: '6',
    title: 'Thunderstorm',
    description: 'Gentle thunderstorm for sleep and relaxation',
    youtubeId: 'mPZkdNFkNps',
    category: 'Nature',
  },
];

const categories = ['All', 'Nature', 'Urban', 'Cozy', 'Study'];

export const MusicDialog = ({
  open,
  onOpenChange,
  isMinimized,
  onMinimize,
}: MusicDialogProps) => {
  const [selectedTrack, setSelectedTrack] = useState<AmbienceTrack | null>(
    () => {
      const saved = localStorage.getItem('music-selected-track');
      return saved ? JSON.parse(saved) : null;
    }
  );
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem('music-is-playing');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('music-is-muted');
    return saved ? JSON.parse(saved) : false;
  });

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('music-selected-track', JSON.stringify(selectedTrack));
  }, [selectedTrack]);

  useEffect(() => {
    localStorage.setItem('music-is-playing', JSON.stringify(isPlaying));
  }, [isPlaying]);

  useEffect(() => {
    localStorage.setItem('music-is-muted', JSON.stringify(isMuted));
  }, [isMuted]);

  const filteredTracks =
    selectedCategory === 'All'
      ? ambienceTracks
      : ambienceTracks.filter((track) => track.category === selectedCategory);

  const playTrack = (track: AmbienceTrack) => {
    setSelectedTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const stopTrack = () => {
    setSelectedTrack(null);
    setIsPlaying(false);
    // Clear localStorage when stopping
    localStorage.removeItem('music-selected-track');
    localStorage.removeItem('music-is-playing');
  };

  const handleMinimize = () => {
    onMinimize(true);
    onOpenChange(false);
  };

  const handleMaximize = () => {
    onMinimize(false);
    onOpenChange(true);
  };

  // Handle dialog close - minimize instead of close if music is playing
  const handleDialogClose = (open: boolean) => {
    if (!open && selectedTrack) {
      // If music is playing, minimize instead of closing
      handleMinimize();
    } else {
      // If no music, allow normal close
      onOpenChange(open);
    }
  };

  // Mini Player Component
  const MiniPlayer = () => (
    <motion.div
      className='fixed bottom-20 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 w-80 z-[102]'
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className='flex items-center gap-3'>
        <div className='flex-1'>
          <h4 className='font-semibold text-gray-800 text-sm truncate'>
            {selectedTrack?.title}
          </h4>
          <p className='text-xs text-gray-600 truncate'>
            {selectedTrack?.category}
          </p>
        </div>
        <div className='flex items-center gap-1'>
          <button
            onClick={togglePlay}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={toggleMute}
            className='p-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors cursor-pointer'
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button
            onClick={handleMaximize}
            className='p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors cursor-pointer'
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={stopTrack}
            className='p-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors cursor-pointer'
          >
            <Cross2Icon className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>
      {/* Hidden iframe for background music */}
      {selectedTrack && (
        <div className='hidden'>
          <iframe
            width='0'
            height='0'
            src={`https://www.youtube.com/embed/${
              selectedTrack.youtubeId
            }?autoplay=${isPlaying ? 1 : 0}&mute=${
              isMuted ? 1 : 0
            }&loop=1&playlist=${selectedTrack.youtubeId}`}
            title={selectedTrack.title}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          />
        </div>
      )}
    </motion.div>
  );

  return (
    <>
      {/* Mini Player when minimized */}
      <AnimatePresence>
        {isMinimized && selectedTrack && <MiniPlayer />}
      </AnimatePresence>

      {/* Full Dialog */}
      <AnimatePresence>
        {open && (
          <Dialog.Root open={open} onOpenChange={handleDialogClose}>
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
                  className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] z-[101] flex flex-col'
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
                  {/* Fixed Header */}
                  <div className='flex-shrink-0 p-6 pb-4 border-b border-gray-200'>
                    <div className='flex items-center justify-between relative'>
                      <Dialog.Title className='text-2xl font-bold text-gray-600'>
                        Ambient Music
                      </Dialog.Title>

                      {/* Top right controls - Music Controls + Minimize and Close */}
                      <div className='flex items-center gap-2'>
                        {/* Music controls */}
                        {selectedTrack && (
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={togglePlay}
                              className={`p-2 rounded-full transition-colors cursor-pointer ${
                                isPlaying
                                  ? 'bg-red-500 hover:bg-red-600 text-white'
                                  : 'bg-green-500 hover:bg-green-600 text-white'
                              }`}
                            >
                              {isPlaying ? (
                                <Pause size={16} />
                              ) : (
                                <Play size={16} />
                              )}
                            </button>
                            <button
                              onClick={toggleMute}
                              className='p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors cursor-pointer'
                            >
                              {isMuted ? (
                                <VolumeX size={16} />
                              ) : (
                                <Volume2 size={16} />
                              )}
                            </button>
                            <button
                              onClick={stopTrack}
                              className='px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors cursor-pointer text-sm'
                            >
                              Stop
                            </button>
                          </div>
                        )}

                        {/* Window controls */}
                        <div className='flex items-center gap-1 ml-2'>
                          <button
                            onClick={handleMinimize}
                            className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors cursor-pointer'
                            title='Minimize'
                          >
                            <Minimize2 size={16} />
                          </button>
                          <Dialog.Close asChild>
                            <motion.button
                              className='p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-full hover:bg-gray-100'
                              aria-label='Close'
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                // Force close dialog completely
                                setSelectedTrack(null);
                                setIsPlaying(false);
                                localStorage.removeItem('music-selected-track');
                                localStorage.removeItem('music-is-playing');
                                onMinimize(false);
                                onOpenChange(false);
                              }}
                            >
                              <Cross2Icon className='w-4 h-4' />
                            </motion.button>
                          </Dialog.Close>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className='flex-1 overflow-y-auto p-6'>
                    {/* Current Playing Track */}
                    {selectedTrack && (
                      <motion.div
                        className='mb-6 p-4 bg-gray-50 rounded-lg border'
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                          Now Playing: {selectedTrack.title}
                        </h3>
                        <div className='aspect-video bg-black rounded-lg overflow-hidden'>
                          <iframe
                            width='100%'
                            height='100%'
                            src={`https://www.youtube.com/embed/${
                              selectedTrack.youtubeId
                            }?autoplay=${isPlaying ? 1 : 0}&mute=${
                              isMuted ? 1 : 0
                            }&loop=1&playlist=${selectedTrack.youtubeId}`}
                            title={selectedTrack.title}
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                            className='w-full h-full'
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Category Filter */}
                    <div className='mb-6'>
                      <div className='flex gap-2 flex-wrap'>
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                              selectedCategory === category
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tracks Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {filteredTracks.map((track, index) => (
                        <motion.div
                          key={track.id}
                          className={`p-4 border rounded-lg transition-all cursor-pointer ${
                            selectedTrack?.id === track.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => playTrack(track)}
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <h4 className='font-semibold text-gray-800 mb-1'>
                                {track.title}
                              </h4>
                              <p className='text-sm text-gray-600 mb-2'>
                                {track.description}
                              </p>
                              <span className='inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'>
                                {track.category}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playTrack(track);
                              }}
                              className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors cursor-pointer ml-3'
                            >
                              <Play size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </AnimatePresence>
    </>
  );
};
