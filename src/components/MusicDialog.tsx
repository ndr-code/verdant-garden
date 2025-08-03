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
  SkipForward,
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
  editMode?: boolean;
}

const ambienceTracks: AmbienceTrack[] = [
  {
    id: '1',
    title: 'Ocean Waves',
    description: 'Peaceful ocean waves for relaxation',
    youtubeId: 'WHPEKLQID4U',
    category: 'Nature',
  },
  {
    id: '2',
    title: 'Thunderstorm',
    description: 'Gentle thunderstorm for sleep and relaxation',
    youtubeId: 'mPZkdNFkNps',
    category: 'Nature',
  },
  {
    id: '3',
    title: 'Clock Ticking',
    description: 'Ticking Clock Sound for relaxation',
    youtubeId: 'xyCQFLOSWGc',
    category: 'Clock',
  },
  {
    id: '4',
    title: 'Calm Piano Music and Rain',
    description: 'Calm piano music with rain sounds for relaxation',
    youtubeId: 'TXzlmOqwsE8',
    category: 'Piano',
  },
  {
    id: '5',
    title: 'Olafur Arnalds - Ágúst Rain',
    description: 'Listen to the soothing sounds of rain and piano',
    youtubeId: 'sD9fSNseEIU',
    category: 'Piano',
  },
  {
    id: '5',
    title: 'Olafur Arnalds - Memories ',
    description: 'Listen to Memories by Olafur Arnalds',
    youtubeId: 'SNEO45OlmR0',
    category: 'Piano',
  },
  {
    id: '6',
    title: 'Ólafur Arnalds: NPR Music Tiny Desk Concert ',
    description: 'Listen to NPR Music Tiny Desk Concert by Ólafur Arnalds',
    youtubeId: 'TpO_8tk6yNQ',
    category: 'Piano',
  },
];

// Mini Player Component - moved outside to prevent re-animation
const MiniPlayer = ({
  selectedTrack,
  isPlaying,
  isMuted,
  volume,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onMaximize,
  onStop,
  onNext,
  editMode = false,
}: {
  selectedTrack: AmbienceTrack;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onMaximize: () => void;
  onStop: () => void;
  onNext: () => void;
  editMode?: boolean;
}) => (
  <motion.div
    className={`fixed bottom-20 right-4 backdrop-blur-sm rounded-lg shadow-xl p-4 w-80 z-[102] ${
      editMode ? 'bg-white/10' : 'bg-white/95'
    }`}
    initial={{ opacity: 0, y: 50, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.8 }}
    transition={{ duration: 0.3 }}
  >
    <div className='flex items-center gap-3 mb-2'>
      <div className='flex-1 min-w-0'>
        <h4
          className={`font-semibold text-sm truncate ${
            editMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          {selectedTrack?.title}
        </h4>
        <p
          className={`text-xs truncate ${
            editMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {selectedTrack?.category}
        </p>
      </div>
      <div className='flex items-center gap-1 flex-shrink-0'>
        <button
          onClick={editMode ? undefined : onTogglePlay}
          disabled={editMode}
          className={`p-1.5 rounded-full transition-colors ${
            editMode
              ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-900'
              : `cursor-pointer ${
                  isPlaying
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-400 hover:bg-blue-600 text-white'
                }`
          }`}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={editMode ? undefined : onNext}
          disabled={editMode}
          className={`p-1.5 rounded-full transition-colors ${
            editMode
              ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-900'
              : 'bg-gray-400 hover:bg-blue-600 text-white cursor-pointer'
          }`}
          title={editMode ? 'Disabled in Edit Mode' : 'Next Track'}
        >
          <SkipForward size={14} />
        </button>
        <button
          onClick={editMode ? undefined : onToggleMute}
          disabled={editMode}
          className={`p-1.5 rounded-full transition-colors ${
            editMode
              ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-900'
              : isMuted
              ? 'bg-red-700 hover:bg-blue-600 text-white cursor-pointer'
              : 'bg-gray-400 hover:bg-blue-600 text-white cursor-pointer'
          }`}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <button
          onClick={editMode ? undefined : onMaximize}
          disabled={editMode}
          className={`p-1.5 rounded-full transition-colors ${
            editMode
              ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-900'
              : 'bg-gray-400 hover:bg-blue-600 text-white cursor-pointer'
          }`}
        >
          <Maximize2 size={14} />
        </button>
        <button
          onClick={editMode ? undefined : onStop}
          disabled={editMode}
          className={`p-1.5 rounded-full transition-colors ${
            editMode
              ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-900'
              : 'bg-gray-400 hover:bg-blue-600 text-white cursor-pointer'
          }`}
        >
          <Cross2Icon className='w-3.5 h-3.5' />
        </button>
      </div>
    </div>

    {/* Volume Slider */}
    <div className='flex items-center gap-2'>
      <Volume2
        size={12}
        className={editMode ? 'text-gray-300' : 'text-gray-500'}
      />
      <input
        type='range'
        min='0'
        max='100'
        value={volume}
        onChange={
          editMode ? undefined : (e) => onVolumeChange(Number(e.target.value))
        }
        disabled={editMode}
        className={`flex-1 h-1 bg-gray-200 rounded-lg appearance-none slider ${
          editMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${isMuted ? 'muted' : ''}`}
        style={{
          background: `linear-gradient(to right, ${
            isMuted ? '#b91c1c' : '#3b82f6'
          } 0%, ${
            isMuted ? '#b91c1c' : '#3b82f6'
          } ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`,
        }}
      />
      <span
        className={`text-xs w-8 text-right ${
          editMode ? 'text-gray-300' : 'text-gray-500'
        }`}
      >
        {volume}
      </span>
    </div>
  </motion.div>
);

export const MusicDialog = ({
  open,
  onOpenChange,
  isMinimized,
  onMinimize,
  editMode = false,
}: MusicDialogProps) => {
  const [selectedTrack, setSelectedTrack] = useState<AmbienceTrack | null>(
    () => {
      const saved = localStorage.getItem('music-selected-track');
      return saved ? JSON.parse(saved) : null;
    }
  );
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem('music-is-playing');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('music-is-muted');
    return saved ? JSON.parse(saved) : false;
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('music-volume');
    return saved ? JSON.parse(saved) : 50;
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

  useEffect(() => {
    localStorage.setItem('music-volume', JSON.stringify(volume));

    // Update YouTube player volume when volume changes
    const iframe = document.querySelector(
      '#youtube-player'
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        `{"event":"command","func":"setVolume","args":[${volume}]}`,
        'https://www.youtube.com'
      );
    }
  }, [volume]);

  // Handle play/pause state changes
  useEffect(() => {
    const iframe = document.querySelector(
      '#youtube-player'
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      if (isPlaying) {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          'https://www.youtube.com'
        );
      } else {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          'https://www.youtube.com'
        );
      }
    }
  }, [isPlaying]);

  // Handle mute state changes
  useEffect(() => {
    const iframe = document.querySelector(
      '#youtube-player'
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      if (isMuted) {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"mute","args":""}',
          'https://www.youtube.com'
        );
      } else {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"unMute","args":""}',
          'https://www.youtube.com'
        );
      }
    }
  }, [isMuted]);

  const playTrack = (track: AmbienceTrack) => {
    setSelectedTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // If unmuting, set volume after a short delay to avoid conflicts
    if (!newMutedState) {
      setTimeout(() => {
        const iframe = document.querySelector(
          '#youtube-player'
        ) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            `{"event":"command","func":"setVolume","args":[${volume}]}`,
            'https://www.youtube.com'
          );
        }
      }, 150);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);

    // Update iframe volume via postMessage
    const iframe = document.querySelector(
      '#youtube-player'
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        `{"event":"command","func":"setVolume","args":[${newVolume}]}`,
        'https://www.youtube.com'
      );
    }
  };

  const stopTrack = () => {
    setSelectedTrack(null);
    setIsPlaying(false);
    // Clear localStorage when stopping
    localStorage.removeItem('music-selected-track');
    localStorage.removeItem('music-is-playing');
  };

  const nextTrack = () => {
    if (!selectedTrack) return;

    const currentIndex = ambienceTracks.findIndex(
      (track) => track.id === selectedTrack.id
    );
    const nextIndex = (currentIndex + 1) % ambienceTracks.length;
    const nextTrackToPlay = ambienceTracks[nextIndex];

    setSelectedTrack(nextTrackToPlay);
    setIsPlaying(true);
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

  return (
    <>
      {/* Persistent iframe for continuous music playback */}
      {selectedTrack && (
        <div className='fixed -top-full -left-full w-0 h-0 overflow-hidden pointer-events-none z-[-1]'>
          <iframe
            id='youtube-player'
            key={selectedTrack.youtubeId} // Force re-mount only when track changes
            width='320'
            height='180'
            src={`https://www.youtube.com/embed/${
              selectedTrack.youtubeId
            }?autoplay=${isPlaying ? 1 : 0}&mute=${
              isMuted ? 1 : 0
            }&loop=1&playlist=${selectedTrack.youtubeId}&enablejsapi=1&origin=${
              window.location.origin
            }`}
            title={selectedTrack.title}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            onLoad={() => {
              // Set initial volume when iframe loads
              setTimeout(() => {
                const iframe = document.querySelector(
                  '#youtube-player'
                ) as HTMLIFrameElement;
                if (iframe && iframe.contentWindow) {
                  iframe.contentWindow.postMessage(
                    `{"event":"command","func":"setVolume","args":[${volume}]}`,
                    'https://www.youtube.com'
                  );
                }
              }, 1000);
            }}
          />
        </div>
      )}

      {/* Mini Player when minimized */}
      <AnimatePresence>
        {isMinimized && selectedTrack && (
          <MiniPlayer
            selectedTrack={selectedTrack}
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onVolumeChange={handleVolumeChange}
            onMaximize={handleMaximize}
            onStop={stopTrack}
            onNext={nextTrack}
            editMode={editMode}
          />
        )}
      </AnimatePresence>

      {/* Full Dialog */}
      <AnimatePresence>
        {open && (
          <Dialog.Root open={open} onOpenChange={handleDialogClose}>
            <Dialog.Portal>
              <Dialog.Overlay asChild>
                <motion.div
                  className='fixed inset-0  bg-gray-900/50 backdrop-blur-sm z-[100]'
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
                                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              }`}
                            >
                              {isPlaying ? (
                                <Pause size={16} />
                              ) : (
                                <Play size={16} />
                              )}
                            </button>
                            <button
                              onClick={nextTrack}
                              className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors cursor-pointer'
                              title='Next Track'
                            >
                              <SkipForward size={16} />
                            </button>
                            <button
                              onClick={toggleMute}
                              className={`p-2 rounded-full transition-colors cursor-pointer ${
                                isMuted
                                  ? 'bg-red-800 hover:bg-red-900 text-white'
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              }`}
                            >
                              {isMuted ? (
                                <VolumeX size={16} />
                              ) : (
                                <Volume2 size={16} />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Window controls */}
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={handleMinimize}
                            className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors cursor-pointer'
                            title='Minimize'
                          >
                            <Minimize2 size={16} />
                          </button>
                          <Dialog.Close asChild>
                            <motion.button
                              className='p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors cursor-pointer'
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
                        <div className='h-60 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 rounded-lg overflow-hidden relative flex items-center justify-center'>
                          <div className='text-center text-white'>
                            <div className='w-16 h-16 mx-auto mb-4 relative'>
                              <div
                                className={`absolute inset-0 rounded-full border-4 border-white/30 ${
                                  isPlaying ? 'animate-pulse' : ''
                                }`}
                              ></div>
                              <div className='absolute inset-2 rounded-full bg-white/20 flex items-center justify-center'>
                                {isPlaying ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 3,
                                      repeat: Infinity,
                                      ease: 'linear',
                                    }}
                                  >
                                    <Volume2 size={24} />
                                  </motion.div>
                                ) : (
                                  <Pause size={24} />
                                )}
                              </div>
                            </div>
                            <h4 className='text-lg font-semibold mb-1'>
                              {selectedTrack.title}
                            </h4>
                            <p className='text-sm text-white/80'>
                              {selectedTrack.description}
                            </p>
                            <div className='mt-4 flex items-center justify-center gap-2'>
                              <span className='px-3 py-1 bg-white/20 rounded-full text-sm'>
                                {selectedTrack.category}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  isPlaying ? 'bg-green-500' : 'bg-gray-500'
                                }`}
                              >
                                {isPlaying ? 'Playing' : 'Paused'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {/* Tracks Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {ambienceTracks.map((track, index) => (
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
