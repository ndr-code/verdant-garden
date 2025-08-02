import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface NotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotesDialog = ({ open, onOpenChange }: NotesDialogProps) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes-data');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert createdAt string back to Date object
        return parsedNotes.map(
          (note: Omit<Note, 'createdAt'> & { createdAt: string }) => ({
            ...note,
            createdAt: new Date(note.createdAt),
          })
        );
      } catch (error) {
        console.error('Error parsing saved notes:', error);
        return [];
      }
    }
    return [];
  });
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes-data', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title.trim() || 'Untitled',
        content: newNote.content.trim(),
        createdAt: new Date(),
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '' });
      setShowAddForm(false);
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
    setEditingNote(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
                className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 rounded-lg p-6 shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden z-[101]'
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
                <div className='flex items-center justify-between mb-6'>
                  <Dialog.Title className='text-2xl font-bold text-gray-600'>
                    Notes
                  </Dialog.Title>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className='flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer'
                    >
                      <Plus size={16} />
                      Add Note
                    </button>
                    <Dialog.Close asChild>
                      <motion.button
                        className='p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-full hover:bg-gray-100'
                        aria-label='Close'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Cross2Icon className='w-4 h-4' />
                      </motion.button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Add Note Form */}
                {showAddForm && (
                  <motion.div
                    className='mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50'
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type='text'
                      placeholder='Note title...'
                      value={newNote.title}
                      onChange={(e) =>
                        setNewNote({ ...newNote, title: e.target.value })
                      }
                      className='w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <textarea
                      placeholder='Write your note here...'
                      value={newNote.content}
                      onChange={(e) =>
                        setNewNote({ ...newNote, content: e.target.value })
                      }
                      className='w-full p-2 mb-3 border border-gray-300 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <div className='flex gap-2'>
                      <button
                        onClick={addNote}
                        className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors cursor-pointer'
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewNote({ title: '', content: '' });
                        }}
                        className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors cursor-pointer'
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Notes List */}
                <div className='max-h-96 overflow-y-auto'>
                  {notes.length === 0 ? (
                    <motion.div
                      className='text-center py-8 text-gray-500'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      No notes yet. Click "Add Note" to create your first note.
                    </motion.div>
                  ) : (
                    <div className='space-y-3'>
                      {notes.map((note, index) => (
                        <motion.div
                          key={note.id}
                          className='p-4 border border-gray-200 rounded-lg bg-white shadow-sm'
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {editingNote?.id === note.id ? (
                            <div>
                              <input
                                type='text'
                                value={editingNote.title}
                                onChange={(e) =>
                                  setEditingNote({
                                    ...editingNote,
                                    title: e.target.value,
                                  })
                                }
                                className='w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                              />
                              <textarea
                                value={editingNote.content}
                                onChange={(e) =>
                                  setEditingNote({
                                    ...editingNote,
                                    content: e.target.value,
                                  })
                                }
                                className='w-full p-2 mb-2 border border-gray-300 rounded-md h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                              />
                              <div className='flex gap-2'>
                                <button
                                  onClick={() => updateNote(editingNote)}
                                  className='px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors cursor-pointer'
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingNote(null)}
                                  className='px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-colors cursor-pointer'
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className='flex items-start justify-between mb-2'>
                                <h3 className='font-semibold text-gray-800 text-lg'>
                                  {note.title}
                                </h3>
                                <div className='flex gap-1'>
                                  <button
                                    onClick={() => setEditingNote(note)}
                                    className='p-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer'
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteNote(note.id)}
                                    className='p-1 text-gray-500 hover:text-red-600 transition-colors cursor-pointer'
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              <p className='text-gray-600 mb-2 whitespace-pre-wrap'>
                                {note.content}
                              </p>
                              <p className='text-xs text-gray-400'>
                                {formatDate(note.createdAt)}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};
