import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, X, Edit3 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface GoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoalsDialog = ({ open, onOpenChange }: GoalsDialogProps) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('goals-tasks-data');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert createdAt string back to Date object
        return parsedTasks.map(
          (task: Omit<Task, 'createdAt'> & { createdAt: string }) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          })
        );
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
        return [];
      }
    }
    return [];
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('goals-tasks-data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTasks([task, ...tasks]);
      setNewTaskTitle('');
      setShowAddForm(false);
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

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
                  <div>
                    <Dialog.Title className='text-2xl font-bold text-gray-600 mb-1'>
                      Goals & Tasks
                    </Dialog.Title>
                    {totalTasks > 0 && (
                      <p className='text-sm text-gray-500'>
                        {completedTasks} of {totalTasks} completed (
                        {Math.round((completedTasks / totalTasks) * 100)}%)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer'
                  >
                    <Plus size={16} />
                    Add Task
                  </button>
                </div>

                {/* Progress Bar */}
                {totalTasks > 0 && (
                  <motion.div
                    className='mb-6'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className='w-full bg-gray-200 rounded-full h-3'>
                      <motion.div
                        className='bg-green-500 h-3 rounded-full transition-all duration-500'
                        style={{
                          width: `${(completedTasks / totalTasks) * 100}%`,
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Add Task Form */}
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
                      placeholder='Enter task title...'
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      className='w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      autoFocus
                    />
                    <div className='flex gap-2'>
                      <button
                        onClick={addTask}
                        className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors cursor-pointer'
                      >
                        Add Task
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewTaskTitle('');
                        }}
                        className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors cursor-pointer'
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Tasks List */}
                <div className='max-h-96 overflow-y-auto'>
                  {tasks.length === 0 ? (
                    <motion.div
                      className='text-center py-8 text-gray-500'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      No tasks yet. Click "Add Task" to create your first goal.
                    </motion.div>
                  ) : (
                    <div className='space-y-2'>
                      {tasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          className={`p-4 border rounded-lg transition-all ${
                            task.completed
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200'
                          }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {editingTask?.id === task.id ? (
                            <div className='flex items-center gap-3'>
                              <input
                                type='text'
                                value={editingTask.title}
                                onChange={(e) =>
                                  setEditingTask({
                                    ...editingTask,
                                    title: e.target.value,
                                  })
                                }
                                onKeyPress={(e) =>
                                  e.key === 'Enter' && updateTask(editingTask)
                                }
                                className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                autoFocus
                              />
                              <button
                                onClick={() => updateTask(editingTask)}
                                className='p-2 text-green-600 hover:bg-green-100 rounded transition-colors cursor-pointer'
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => setEditingTask(null)}
                                className='p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer'
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className='flex items-center gap-3'>
                              <button
                                onClick={() => toggleTask(task.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                                  task.completed
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-300 hover:border-green-400'
                                }`}
                              >
                                {task.completed && <Check size={14} />}
                              </button>
                              <span
                                className={`flex-1 transition-all ${
                                  task.completed
                                    ? 'text-gray-500 line-through'
                                    : 'text-gray-800'
                                }`}
                              >
                                {task.title}
                              </span>
                              <div className='flex gap-1'>
                                <button
                                  onClick={() => setEditingTask(task)}
                                  className='p-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer'
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className='p-1 text-gray-500 hover:text-red-600 transition-colors cursor-pointer'
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <Dialog.Close asChild>
                  <motion.button
                    className='absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
                    aria-label='Close'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Cross2Icon className='w-4 h-4' />
                  </motion.button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};
