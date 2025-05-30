import React, { useEffect, useState, useRef } from 'react';
import WeeklyGoalService, { WeeklyGoal } from '../services/weeklyGoalService';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';
import LoadingToFetchData from './LoadingToFetchData';
import { useRole } from '../utils/useRole';
import { useLocation, useParams } from 'react-router-dom';
import CommentPopover from './CommentPopover';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../services/firebaseService';
import ReactDOM from 'react-dom';

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
  const {isStudent} = useRole();
  const [tasks, setTasks] = useState<WeeklyGoal[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();
  const { id: studentId } = useParams<{ id: string }>();
  const location = useLocation();
  const [filteredTasks, setFilteredTasks] = useState<WeeklyGoal[]>([]);
  const [commentPopover, setCommentPopover] = useState<{
    isOpen: boolean;
    position: { top: number; left: number };
    commentableType: any;
    commentableId: number;
    fieldName: string;
    row: number;
    iconId: string;
    semester: number;
  } | null>(null);
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const popoverRef = useRef<HTMLDivElement>(null);

  const userId = Number(studentId) || user?.id || 0;

  useEffect(() => {
    setFilteredTasks(tasks.filter(
    (t) => t.start_date === selectedStartDate && t.end_date === selectedEndDate
  ));
  }, [tasks, selectedStartDate, selectedEndDate])

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

  useEffect(() => {
    if (!user) return;
    const unsubscribeCallbacks: (() => void)[] = [];
    filteredTasks.forEach((task, index) => {
      if (!task.id) return;
      const path = `comments/App\\Models\\WeeklyGoal/${task.id}/goal_content/${index}`;
      const key = `${task.id}-goal_content-${index}`;
      const commentsRef = ref(database, path);
      const unsubscribe = onValue(commentsRef, (snapshot) => {
        const commentsData = snapshot.val();
        if (commentsData) {
          const count = Object.keys(commentsData).length;
          setCommentsCount(prev => ({
            ...prev,
            [key]: count
          }));
        } else {
          setCommentsCount(prev => ({
            ...prev,
            [key]: 0
          }));
        }
      });
      unsubscribeCallbacks.push(() => off(commentsRef));
    });
    return () => unsubscribeCallbacks.forEach(unsub => unsub());
  }, [filteredTasks, user]);

  

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

  
  useEffect(() => {
    if (!commentPopover?.isOpen) return;
    function updatePosition() {
      const icon = document.getElementById(commentPopover!.iconId);
      if (icon && popoverRef.current) {
        const rect = icon.getBoundingClientRect();
        const popover = popoverRef.current;
        const popoverWidth = popover.offsetWidth;
        const popoverHeight = popover.offsetHeight;
        const { innerWidth, innerHeight } = window;
        let left = rect.left;
        let top = rect.bottom;

        if (left + popoverWidth > innerWidth) {
          left = innerWidth - popoverWidth - 8;
        }
        
        if (top + popoverHeight > innerHeight) {
          top = rect.top - popoverHeight;
        }
        setCommentPopover(prev => prev && ({
          ...prev,
          position: { top, left }
        }));
      }
    }
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [commentPopover]);

  
  useEffect(() => {
    if (!commentPopover?.isOpen) return;
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setCommentPopover(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [commentPopover]);

  
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const fieldName = searchParams.get('field');
      const row = searchParams.get('row');
  
      if ( fieldName && row !== null) {
        const rowIndex = parseInt(row);
        
        const planToHighlight = filteredTasks[rowIndex];
  
        if (planToHighlight?.id) {
          const iconId = `comment-icon-${planToHighlight.id}-${fieldName}-${rowIndex}`;
          const icon = document.getElementById(iconId);
  
          if (icon) {
            const rect = icon.getBoundingClientRect();
            setCommentPopover({
              isOpen: true,
              position: { top: rect.bottom , left: rect.left },
              commentableType: 'App\\Models\\WeeklyGoal',
              commentableId: planToHighlight.id as number,
              fieldName,
              row: rowIndex,
              iconId: iconId,
              semester: semester
            });
          }
        }
      }
    }, [location.search, filteredTasks]); 

  if (isLoading && tasks.length === 0) {
    return <LoadingToFetchData />;
  }

  if(filteredTasks.length === 0) return;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-5">
          {filteredTasks.map((task, index) => {
            const commentCount = commentsCount[`${task.id}-goal_content-${index}`] || 0;
            const iconId = `comment-icon-${task.id}-goal_content-${index}`;
            return (
              <div
                key={task.id}
                className="flex items-center gap-4 px-5 py-4 bg-gray-50 rounded-2xl border border-gray-300 shadow-sm min-w-80 max-w-md hover:shadow-md transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={isStudent && task.is_completed}
                  onChange={() => toggleCompletion(task.id!)}
                  className="w-5 h-5 accent-blue-600 rounded border-gray-400"
                  readOnly={!isStudent}
                />
                { isStudent && editIndex === index ? (
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(index);
                      if (e.key === 'Escape') setEditIndex(null);
                    }}
                    onBlur={() => setEditIndex(null)}
                    autoFocus
                    className="flex-grow px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                ) : (
                  <div className="flex-grow relative group h-full"
                    onDoubleClick={() => startEdit(index)}
                  >
                    <span
                      className={`text-[15px] text-gray-800 cursor-pointer ${isStudent && task.is_completed ? 'line-through text-gray-400' : ''}`}
                      title="Double click to edit"
                    >
                      {task.goal_content}
                    </span>
                    <button
                      id={iconId}
                      onClick={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setCommentPopover({
                          isOpen: true,
                          commentableType: 'App\\Models\\WeeklyGoal',
                          position: { top: rect.bottom, left: rect.left },
                          commentableId: task.id as number,
                          fieldName: 'goal_content',
                          row: index,
                          iconId: iconId,
                          semester: semester
                        });
                      }}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </button>
                    {(commentCount > 0) && (
                      <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          
          {isStudent && (
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-50 rounded-2xl border border-gray-300 shadow-sm min-w-80 max-w-md">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask();
                }}
                placeholder="Add new task..."
                className="flex-grow px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          )}
        </div>
      </div>
      {commentPopover?.isOpen && ReactDOM.createPortal(
        <div
          ref={popoverRef}
          className="z-50"
          style={{
            position: 'fixed',
            top: commentPopover.position.top,
            left: commentPopover.position.left,
          }}
          onClick={e => e.stopPropagation()}
        >
          <CommentPopover
              commentableType={commentPopover.commentableType}
              commentableId={commentPopover.commentableId}
              fieldName={commentPopover.fieldName}
              row={commentPopover.row}
              onClose={() => setCommentPopover(null)}
              semester = {commentPopover.semester}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default TaskCheckList;