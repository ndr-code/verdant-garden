import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PomodoroProps {
  size?:
    | 'tiny'
    | 'narrow'
    | 'wide'
    | 'small'
    | 'medium-wide'
    | 'medium-tall'
    | 'large'
    | 'xlarge';
  className?: string;
  workDuration?: number;
  breakDuration?: number;
  width?: number;
  height?: number;
}

export const Pomodoro = ({
  size = 'small',
  className = '',
  workDuration = 25,
  breakDuration = 5,
}: PomodoroProps) => {
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
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

  const getSizeClasses = () => {
    switch (size) {
      case 'tiny':
        return {
          timeClass: 'text-xs font-mono font-bold',
          sessionClass: 'text-xs',
          buttonClass: 'w-4 h-4',
          iconSize: 10,
          gap: 'gap-1',
        };
      case 'narrow':
        return {
          timeClass: 'text-sm font-mono font-bold',
          sessionClass: 'text-xs',
          buttonClass: 'w-5 h-5',
          iconSize: 12,
          gap: 'gap-1',
        };
      case 'wide':
        return {
          timeClass: 'text-sm font-mono font-bold',
          sessionClass: 'text-xs',
          buttonClass: 'w-5 h-5',
          iconSize: 12,
          gap: 'gap-1',
        };
      case 'small':
        return {
          timeClass: 'text-lg font-mono font-bold',
          sessionClass: 'text-xs',
          buttonClass: 'w-6 h-6',
          iconSize: 12,
          gap: 'gap-1',
        };
      case 'medium-wide':
        return {
          timeClass: 'text-2xl font-mono font-bold',
          sessionClass: 'text-sm',
          buttonClass: 'w-8 h-8',
          iconSize: 16,
          gap: 'gap-2',
        };
      case 'medium-tall':
        return {
          timeClass: 'text-3xl font-mono font-bold',
          sessionClass: 'text-sm',
          buttonClass: 'w-8 h-8',
          iconSize: 16,
          gap: 'gap-2',
        };
      case 'large':
        return {
          timeClass: 'text-6xl font-mono font-bold',
          sessionClass: 'text-xl',
          buttonClass: 'w-12 h-12',
          iconSize: 20,
          gap: 'gap-4',
        };
      case 'xlarge':
        return {
          timeClass: 'text-8xl font-mono font-bold',
          sessionClass: 'text-2xl',
          buttonClass: 'w-16 h-16',
          iconSize: 24,
          gap: 'gap-6',
        };
      default:
        return {
          timeClass: 'text-2xl font-mono font-bold',
          sessionClass: 'text-sm',
          buttonClass: 'w-8 h-8',
          iconSize: 16,
          gap: 'gap-2',
        };
    }
  };

  const { timeClass, sessionClass, buttonClass, iconSize, gap } =
    getSizeClasses();

  return (
    <div className={`text-center ${className}`}>
      <div className={`${sessionClass} text-gray-500 mb-1`}>
        {session === 'work' ? 'Work' : 'Break'}
      </div>

      <motion.div
        className={`${timeClass} mb-2 ${
          session === 'work' ? 'text-red-500' : 'text-green-500'
        }`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {formatTime(timeLeft)}
      </motion.div>

      {size !== 'small' && (
        <div className={`flex justify-center ${gap}`}>
          <button
            onClick={toggleTimer}
            className={`${buttonClass} rounded-full transition-colors cursor-pointer flex items-center justify-center ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRunning ? <Pause size={iconSize} /> : <Play size={iconSize} />}
          </button>

          <button
            onClick={resetTimer}
            className={`${buttonClass} rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors cursor-pointer flex items-center justify-center`}
          >
            <RotateCcw size={iconSize} />
          </button>
        </div>
      )}
    </div>
  );
};
