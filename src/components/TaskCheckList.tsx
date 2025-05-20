import React, { useEffect, useState } from 'react';
import WeeklyGoalService, { WeeklyGoal } from '../services/weeklyGoalService';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';
import LoadingToFetchData from './LoadingToFetchData';

type TaskCheckListProps = {
  selectedStartDate: string | null;
  selectedEndDate: string | null;
  semester: number
};

const TaskCheckList: React.FC<TaskCheckListProps> = ({
  semester,
  selectedStartDate,
  selectedEndDate
}) => {
  const [tasks, setTasks] = useState<WeeklyGoal[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();
  const userId = user?.id || 0;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await WeeklyGoalService.getAll(userId, semester);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch weekly goals:', error);
      }
    };
    fetchTasks();
  }, [user, semester]);

  const filteredTasks = tasks.filter(
    (t) => t.start_date === selectedStartDate && t.end_date === selectedEndDate
  );

  const toggleCompletion = async (taskId: number) => {
    const updatedTasks = [...tasks];
    const index = updatedTasks.findIndex((t) => t.id === taskId);
    const task = updatedTasks[index];
    const newStatus = !task.is_completed;

    task.is_completed = newStatus;
    setTasks(updatedTasks);

    try {
      await WeeklyGoalService.update(task.id!, { is_completed: newStatus });
    } catch (error) {
      console.error('Failed to update task:', error);
      task.is_completed = !newStatus;
      setTasks([...updatedTasks]);
    }
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditContent(filteredTasks[index].goal_content || '');
  };

  const saveEdit = async (index: number) => {
    if (editContent.trim() === '') {
      toast.error('Content cannot be empty');
      return;
    }
    const updatedTasks = [...tasks];
    const taskIndex = tasks.findIndex(
      (t) =>
        t.start_date === selectedStartDate &&
        t.end_date === selectedEndDate &&
        t.id === filteredTasks[index].id
    );
    const task = updatedTasks[taskIndex];
    const oldContent = task.goal_content;

    task.goal_content = editContent.trim();
    setTasks(updatedTasks);
    setEditIndex(null);

    try {
      await WeeklyGoalService.update(task.id!, { goal_content: task.goal_content });
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task content:', error);
      task.goal_content = oldContent;
      setTasks([...updatedTasks]);
      toast.error('Failed to update task');
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    if (!selectedStartDate || !selectedEndDate) {
      toast.error('Please enter a task');
      return;
    }

    const newGoal: WeeklyGoal = {
      start_date: selectedStartDate,
      end_date: selectedEndDate,
      goal_content: newTask.trim(),
      is_completed: false,
      student_id: userId,
      semester: semester
    };

    try {
      setIsLoading(true);
      const response = await WeeklyGoalService.add(userId, newGoal);
      setTasks([...tasks, response.data]);
      setNewTask('');
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Failed to add task:', error);
      toast.error('Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && tasks.length === 0) {
    return <LoadingToFetchData/>;
  }

  return (
    <div className='w-full bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden p-4 mb-6'>
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-3">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center gap-3 px-3 bg-white rounded-lg shadow-sm border border-gray-200 min-w-80 max-w-128 text-break"
            >
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={() => toggleCompletion(task.id!)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {editIndex === index ? (
                <input
                  type="text"
                  className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(index);
                    if (e.key === 'Escape') setEditIndex(null);
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-grow text-gray-800 ${task.is_completed ? 'line-through text-gray-400' : ''}`}
                  onDoubleClick={() => startEdit(index)}
                  title="Double click to edit"
                >
                  {task.goal_content}
                </span>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-5 h-5 border border-gray-300 rounded flex-shrink-0"></div>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Add new task"
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCheckList;