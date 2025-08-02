import { motion } from 'framer-motion';
import { useGlobalTime } from '../hooks';

interface ClockProps {
  size?:
    | 'tiny'
    | 'narrow'
    | 'wide'
    | 'small'
    | 'medium-wide'
    | 'medium-tall'
    | 'large'
    | 'xlarge';
  showDate?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export const Clock = ({
  size = 'small',
  showDate = true,
  className = '',
  width = 2,
  height = 2,
}: ClockProps) => {
  const currentTime = useGlobalTime();

  const getResponsiveXLargeSize = () => {
    const totalArea = width * height;
    const maxDimension = Math.max(width, height);

    // Calculate font size based on area and max dimension
    let timeSize = 'text-4xl'; // minimum
    let dateSize = 'text-sm'; // minimum

    if (totalArea >= 49) {
      // 7x7 and above
      timeSize = 'text-8xl';
      dateSize = 'text-3xl';
    } else if (totalArea >= 36) {
      // 6x6
      timeSize = 'text-8xl';
      dateSize = 'text-2xl';
    } else if (totalArea >= 25) {
      // 5x5
      timeSize = 'text-7xl';
      dateSize = 'text-xl';
    } else if (maxDimension >= 5) {
      timeSize = 'text-5xl';
      dateSize = 'text-md';
    } else if (maxDimension >= 4) {
      timeSize = 'text-4xl';
      dateSize = 'text-sm';
    }

    return { timeSize, dateSize };
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'tiny':
        return {
          timeClass: 'text-sm font-mono font-bold',
          dateClass: 'text-2xs',
        };
      case 'narrow':
        return {
          timeClass: 'text-2xl font-mono font-bold py-0.5',
          dateClass: 'text-xs pt-2',
        };
      case 'wide':
        return {
          timeClass: 'text-xl font-mono font-bold',
          dateClass: 'text-xs -translate-y-1',
        };
      case 'small':
        return {
          timeClass: 'text-xl font-mono font-bold',
          dateClass: 'text-xs',
        };
      case 'medium-wide':
        return {
          timeClass: 'text-4xl font-mono font-bold py-0.5',
          dateClass: 'text-sm py-2',
        };
      case 'medium-tall':
        return {
          timeClass: 'text-3xl font-mono font-bold',
          dateClass: 'text-sm',
        };
      case 'large':
        return {
          timeClass: 'text-4xl font-mono font-bold',
          dateClass: 'text-sm',
        };
      case 'xlarge': {
        const { timeSize, dateSize } = getResponsiveXLargeSize();
        return {
          timeClass: `${timeSize} font-mono font-bold`,
          dateClass: dateSize,
        };
      }
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
      {size === 'narrow' ? (
        // Vertical layout for narrow variant
        <div className='flex flex-col items-center justify-center'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
        </div>
      ) : size === 'medium-wide' ? (
        // Vertical layout for medium-wide variant (hours, minutes, seconds)
        <div className='flex flex-col items-center justify-center'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
        </div>
      ) : (
        // Regular horizontal layout for other variants
        <motion.div
          className={`${timeClass} text-neutral-600 mb-1`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {size === 'tiny'
            ? currentTime.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })
            : currentTime.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
        </motion.div>
      )}

      {showDate && (
        <motion.div
          className={`${dateClass} text-gray-600`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          {size === 'tiny' || size === 'narrow' || size === 'wide'
            ? currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : size === 'medium-wide'
            ? currentTime.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : size === 'large' || size === 'xlarge'
            ? currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : currentTime.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
        </motion.div>
      )}
    </div>
  );
};
