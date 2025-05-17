import React, { useEffect, useState } from 'react';
import WeekGoalService, { WeekGoal } from '../services/WeekGoalService';

const TaskCheckList = () => {
  const [tasks, setTasks] = useState<WeekGoal[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await WeekGoalService.getAll();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch weekly goals:', error);
      }
    };
    fetchTasks();
  }, []);

  const toggleCompletion = async (index: number) => {
    const updatedTasks = [...tasks];
    const task = updatedTasks[index];
    const newStatus = !task.is_completed;

    task.is_completed = newStatus;
    setTasks(updatedTasks);

    const updatedData = {
      start_date: task.start_date,
      end_date: task.end_date,
      user_id: task.user_id,
      goal_content: task.goal_content,
      is_completed: newStatus,
    };

    try {
      await WeekGoalService.patch(task.id!, updatedData);
    } catch (error) {
      console.error('Failed to update task:', error);
      task.is_completed = !newStatus; 
      setTasks([...updatedTasks]);
    }
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditContent(tasks[index].goal_content);
  };

  const saveEdit = async (index: number) => {
    if (editContent.trim() === '') {
      alert('Nội dung không được để trống');
      return;
    }

    const updatedTasks = [...tasks];
    const task = updatedTasks[index];
    const oldContent = task.goal_content;

    task.goal_content = editContent.trim();
    setTasks(updatedTasks);
    setEditIndex(null);

    const updatedData = {
      start_date: task.start_date,
      end_date: task.end_date,
      user_id: task.user_id,
      goal_content: task.goal_content,
      is_completed: task.is_completed,
    };

    try {
      await WeekGoalService.patch(task.id!, updatedData);
    } catch (error) {
      console.error('Failed to update task content:', error);
      task.goal_content = oldContent; 
      setTasks([...updatedTasks]);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    const today = new Date().toISOString().slice(0, 10);

    const newGoal: Omit<WeekGoal, 'id'> = {
      start_date: today,
      end_date: today,
      goal_content: newTask.trim(),
      is_completed: false,
      user_id: 1, 
    };

    try {
      const created = await WeekGoalService.create(newGoal);
      setTasks([...tasks, created]);
      setNewTask('');
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Tạo mục tiêu mới thất bại, vui lòng thử lại!');
    }
  };

  return (
    <div className="my-5 w-[70%] ml-5">
      <div
        className="flex gap-10 pl-8 p-4 overflow-x-auto rounded-lg shadow"
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
            key={task.id}
            className="flex-shrink-0 w-[480px] bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
          >
            <input
              type="checkbox"
              checked={task.is_completed}
              onChange={() => toggleCompletion(index)}
              className="accent-blue-500 w-5 h-5"
            />
            {editIndex === index ? (
              <input
                type="text"
                className="p-1 border border-gray-300 rounded-lg flex-grow"
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
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCheckList;
