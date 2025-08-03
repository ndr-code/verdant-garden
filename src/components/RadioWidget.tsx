import { motion } from 'framer-motion';
import { Radio, RadioIcon, Waves } from 'lucide-react';

interface RadioWidgetProps {
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
  width?: number;
  height?: number;
}

export const RadioWidget = ({
  size = 'small',
  className = '',
  width = 2,
  height = 2,
}: RadioWidgetProps) => {
  const getIconSize = () => {
    const totalArea = width * height;
    const maxDimension = Math.max(width, height);

    if (size === 'tiny') return 14; // 1x1
    if (size === 'narrow' || size === 'wide') return 18; // 1xN or Nx1
    if (size === 'small') return 24; // 2x2
    if (size === 'medium-wide' || size === 'medium-tall') return 32; // 2x3 or 3x2
    if (size === 'large') return 48; // 3x3

    // For xlarge, calculate dynamically
    if (totalArea >= 49) return 80; // 7x7 and above
    if (totalArea >= 36) return 72; // 6x6
    if (totalArea >= 25) return 64; // 5x5
    if (maxDimension >= 5) return 56; // 5xN or Nx5

    return 48; // default
  };

  const getTextSize = () => {
    const totalArea = width * height;

    if (size === 'tiny') return ''; // No text for tiny
    if (size === 'narrow' || size === 'wide') return 'text-xs'; // 1xN or Nx1
    if (size === 'small') return 'text-sm'; // 2x2
    if (size === 'medium-wide' || size === 'medium-tall') return 'text-base'; // 2x3 or 3x2
    if (size === 'large') return 'text-lg'; // 3x3

    // For xlarge
    if (totalArea >= 49) return 'text-4xl'; // 7x7 and above
    if (totalArea >= 36) return 'text-3xl'; // 6x6
    if (totalArea >= 25) return 'text-2xl'; // 5x5

    return 'text-xl'; // default
  };

  const shouldShowText = () => {
    return size !== 'tiny' && (width >= 2 || height >= 2);
  };

  const getIcon = () => {
    const iconSize = getIconSize();

    // Use different radio icons based on size for variety
    if (size === 'tiny' || size === 'narrow' || size === 'wide') {
      return <Radio size={iconSize} className='text-gray-800' />;
    } else if (
      size === 'small' ||
      size === 'medium-wide' ||
      size === 'medium-tall'
    ) {
      return <RadioIcon size={iconSize} className='text-gray-800' />;
    } else {
      return <Waves size={iconSize} className='text-gray-800' />;
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-center text-gray-800 ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <div className='flex flex-col items-center justify-center space-y-1'>
        {getIcon()}
        {shouldShowText() && (
          <motion.span
            className={`font-medium text-gray-800 text-center leading-tight ${getTextSize()}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            Radio
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};
