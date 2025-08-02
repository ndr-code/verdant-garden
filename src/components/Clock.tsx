import { motion } from 'framer-motion';
import { useGlobalTime } from '../hooks';

interface ClockProps {
  size?: 'small' | 'medium' | 'large';
  showDate?: boolean;
  className?: string;
}

export const Clock = ({
  size = 'medium',
  showDate = true,
  className = '',
}: ClockProps) => {
  const currentTime = useGlobalTime();

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          timeClass: 'text-sm font-mono font-bold',
          dateClass: 'text-xs',
        };
      case 'medium':
        return {
          timeClass: 'text-2xl font-mono font-bold',
          dateClass: 'text-sm',
        };
      case 'large':
        return {
          timeClass: 'text-6xl font-mono font-bold',
          dateClass: 'text-xl',
        };
      default:
        return {
          timeClass: 'text-2xl font-mono font-bold',
          dateClass: 'text-sm',
        };
    }
  };

  const { timeClass, dateClass } = getSizeClasses();

  return (
    <div className={`text-center ${className}`}>
      <motion.div
        className={`${timeClass} text-neutral-600 mb-1`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {currentTime.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </motion.div>

      {showDate && (
        <motion.div
          className={`${dateClass} text-gray-600`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          {size === 'small'
            ? currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : currentTime.toLocaleDateString('en-US', {
                weekday: size === 'large' ? 'long' : 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
        </motion.div>
      )}
    </div>
  );
};
