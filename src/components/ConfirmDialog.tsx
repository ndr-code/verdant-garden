import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isProcessing: boolean;
  title: string;
  description: string;
  confirmText: string;
  processingText: string;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
  title,
  description,
  confirmText,
  processingText,
}: ConfirmDialogProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className='fixed inset-0 bg-gray-900/70 z-[100] backdrop-blur-md' />
      <Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4 z-[101]'>
        <Dialog.Title className='text-lg font-semibold text-gray-900 mb-4'>
          {title}
        </Dialog.Title>
        <Dialog.Description className='text-gray-600 mb-6'>
          {description}
        </Dialog.Description>
        <div className='flex gap-3 justify-end'>
          <Dialog.Close asChild>
            <button
              className='cursor-pointer px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              disabled={isProcessing}
            >
              Cancel
            </button>
          </Dialog.Close>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className='cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
          >
            {isProcessing && (
              <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
            )}
            {isProcessing ? processingText : confirmText}
          </button>
        </div>
        <Dialog.Close asChild>
          <button
            className='cursor-pointer absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors'
            aria-label='Close'
          >
            <Cross2Icon className='w-4 h-4' />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
