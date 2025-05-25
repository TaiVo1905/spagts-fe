import React, { useEffect, useState } from 'react';
import WeeklyGoalService, { WeeklyGoal } from '../services/weeklyGoalService';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';
import LoadingToFetchData from './LoadingToFetchData';
import { useRole } from '../utils/useRole';
import { useParams } from 'react-router-dom';

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
  const { id: studentId } = useParams<{ id: string }>();

  const userId = Number(studentId) || user?.id || 0;

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
    return <LoadingToFetchData />;
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-5">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center gap-4 px-5 py-4 bg-gray-50 rounded-2xl border border-gray-300 shadow-sm min-w-80 max-w-md hover:shadow-md transition-all duration-200"
            >
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={() => useRole().isStudent && toggleCompletion(task.id!)}
                className="w-5 h-5 accent-blue-600 rounded border-gray-400"
                readOnly={!useRole().isStudent}
              />
              { useRole().isStudent && editIndex === index ? (
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(index);
                    if (e.key === 'Escape') setEditIndex(null);
                  }}
                  autoFocus
                  className="flex-grow px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              ) : (
                <span
                  className={`flex-grow text-[15px] text-gray-800 cursor-pointer ${task.is_completed ? 'line-through text-gray-400' : ''
                    }`}
                  onDoubleClick={() => startEdit(index)}
                  title="Double click to edit"
                >
                  {task.goal_content}
                </span>
              )}
            </div>
          ))}

          {/* New task input box */}
          {useRole().isStudent && <div className="flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border-2 border-dashed border-gray-300 min-w-80 max-w-md shadow-sm hover:border-blue-400 transition-all">
            {/* <div className="w-5 h-5 border border-gray-300 rounded bg-white"></div> */}
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new goal..."
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="flex-grow px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400 text-sm"
            />
          </div>}
        </div>
      </div>
    </div>
  );
};

export default TaskCheckList;