import { useEffect, useState } from 'react';
import WeeklyGoalService, { WeeklyGoal } from '../services/weeklyGoalService';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';
import LoadingToFetchData from './LoadingToFetchData';


interface Props {
semester: number
}

const TaskCheckList: React.FC<Props> = ({semester}) => {
  const [tasks, setTasks] = useState<WeeklyGoal[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user) return;
        setIsLoading(true);
        const response = await WeeklyGoalService.getWeeklyGoals(user.id, semester);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch weekly goals:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [user, semester]);

  const toggleCompletion = async (index: number) => {
    const updatedTasks = [...tasks];
    const task = updatedTasks[index];
    const newStatus = !task.is_completed;

    // Optimistic update
    task.is_completed = newStatus;
    setTasks(updatedTasks);
    if (!user) return
    try {
      const updatedData = {
        start_date: task.start_date,
        end_date: task.end_date,
        goal_content: task.goal_content,
        is_completed: newStatus,
        student_id: user.id,
        semester: semester
      };
      await WeeklyGoalService.updateWeeklyGoal(task.id!, updatedData);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert on error
      task.is_completed = !newStatus;
      setTasks([...updatedTasks]);
      toast.error('Failed to update task');
    }
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditContent(tasks[index].goal_content);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditContent('');
  };

  const saveEdit = async (index: number) => {
    if (editContent.trim() === '') {
      toast.error('Content cannot be empty');
      return;
    }

    const updatedTasks = [...tasks];
    const task = updatedTasks[index];
    const oldContent = task.goal_content;

    // Optimistic update
    task.goal_content = editContent.trim();
    setTasks(updatedTasks);
    setEditIndex(null);
    if(!user) return

    try {
      const updatedData = {
        start_date: task.start_date,
        end_date: task.end_date,
        goal_content: task.goal_content,
        is_completed: task.is_completed,
        student_id: user.id,
        semester: semester
      };
      await WeeklyGoalService.updateWeeklyGoal(task.id!, updatedData);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task content:', error);
      // Revert on error
      task.goal_content = oldContent;
      setTasks([...updatedTasks]);
      toast.error('Failed to update task');
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      toast.error('Please enter a task');
      return;
    }
    if(!user) return
    const today = new Date().toISOString().slice(0, 10);
    const newGoal: WeeklyGoal = {
      start_date: today,
      end_date: today,
      goal_content: newTask.trim(),
      is_completed: false,
      student_id: user.id,
      semester: semester
    };

    try {
      setIsLoading(true);
      const response = await WeeklyGoalService.addWeeklyGoal(user.id, newGoal);
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
    <>
      <div className="m-4 p-3 w-[calc(100vw-300px)] border border-[#ccc] rounded-lg shadow">
        <div
          className="flex gap-10 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>
            {`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          {tasks.map((task, index) => (
            <div
              key={task.id || index}
              className="flex-shrink-0 w-[480px] bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={() => toggleCompletion(index)}
                className="accent-blue-500 w-5 h-5"
                disabled={isLoading}
              />
              {editIndex === index ? (
                <div className="flex-grow flex gap-2">
                  <input
                    type="text"
                    className="p-1 border border-gray-300 rounded-lg flex-grow"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(index);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(index)}
                    className="px-2 py-1 bg-(--primary-color) text-white rounded hover:bg-(--primary-color)/70"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span
                  className={`text-base flex-grow cursor-pointer ${
                    task.is_completed ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                  onDoubleClick={() => startEdit(index)}
                  title="Double click to edit"
                >
                  {task.goal_content}
                </span>
              )}
            </div>
          ))}

          <div className="flex-shrink-0 w-[480px] bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full"
              placeholder="New goal content"
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              disabled={isLoading}
            />
            <button
              onClick={addTask}
              className="px-3 py-2 bg-(--primary-color) text-white rounded hover:bg-(--primary-color)/70"
              disabled={isLoading || !newTask.trim()}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCheckList;