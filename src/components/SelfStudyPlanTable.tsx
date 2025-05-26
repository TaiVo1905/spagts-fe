import React, { useEffect, useState, useRef } from 'react';
import selfStudyPlanService, { SelfStudyPlan } from '../services/selfstudyplanService';
import axiosClient from '../services/axiosClient';
import { useAuth } from '../store/AuthContext';
import { toast } from 'react-hot-toast';
import { useRole } from '../utils/useRole';
import { useParams } from 'react-router-dom';
import CommentPopover from './CommentPopover';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../services/firebaseService';
import ReactDOM from 'react-dom';

interface Module {
  id: number;
  name: string;
}

type StudentGoalProps = {
  semester: number;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
};

const emptyPlanData: SelfStudyPlan = {
  module_id: 0,   
  date: new Date().toISOString().slice(0, 10),
  lesson_learned: '',
  time_allocation: 0,
  learning_resources: '',
  learning_activities: '',
  concentration: 0,
  follow_plan_reflection: '',
  evaluation: '',
  reinforcing_techniques: '',
  note: '',
  student_id: 0,
  semester: 0
};

const headers = [
  'Date', 
  'Lesson Learned', 
  'Time Allocation', 
  'Learning Resources', 
  'Learning Activities', 
  'Concentration', 
  'Plan Reflection', 
  'Evaluation', 
  'Reinforcing Techniques', 
  'Note'
];

const columnWidths = [
  'min-w-[150px]', 
  'min-w-[200px]', 
  'min-w-[150px]', 
  'min-w-[200px]', 
  'min-w-[200px]', 
  'min-w-[120px]', 
  'min-w-[200px]', 
  'min-w-[150px]', 
  'min-w-[200px]', 
  'min-w-[200px]'
];

const SelfStudyPlanTable: React.FC<StudentGoalProps> = ({ semester, selectedStartDate, selectedEndDate }) => {
  const { user } = useAuth();
  const { id: studentId } = useParams<{ id: string }>();
  const [plans, setPlans] = useState<SelfStudyPlan[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; field: keyof SelfStudyPlan } | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newPlan, setNewPlan] = useState<SelfStudyPlan>(emptyPlanData);
  const [filteredPlans, setFilteredPlans] = useState<SelfStudyPlan[]>([]);
  const [tempValue, setTempValue] = useState<string>('');
  const userId = Number(studentId) || user?.id || 0;
  const [commentPopover, setCommentPopover] = useState<{
    isOpen: boolean;
    position: { top: number; left: number };
    commentableId: number;
    fieldName: string;
    row: number;
    iconId: string;
  } | null>(null);
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedStartDate || !selectedEndDate) {
      setFilteredPlans(plans);
      return;
    }

    const filtered = plans.filter(plan => {
      const planDate = new Date(plan.date);
      return planDate >= new Date(selectedStartDate) && planDate <= new Date(selectedEndDate);
    });

    setFilteredPlans(filtered);
  }, [plans, selectedStartDate, selectedEndDate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setError('Please log in to view plans.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if(!userId) return;
        const response = await selfStudyPlanService.getAll(userId, semester);
        setPlans(response.data);

        const modulesResponse = await axiosClient.get('/modules');
        setModules(modulesResponse.data.data || []);

        setNewPlan((prev: SelfStudyPlan): SelfStudyPlan => ({
          ...emptyPlanData,
          ...prev,
          student_id: userId,
          semester: semester,
        }));
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching data');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, semester]);

  useEffect(() => {
    if (!user) return;
    const unsubscribeCallbacks: (() => void)[] = [];
    filteredPlans.forEach((plan, rowIndex) => {
      if (!plan.id) return;
      [
        'date', 'lesson_learned', 'time_allocation', 'learning_resources', 'learning_activities',
        'concentration', 'follow_plan_reflection', 'evaluation', 'reinforcing_techniques', 'note'
      ].forEach((field) => {
        const path = `comments/App\\Models\\SelfStudyPlan/${plan.id}/${field}/${rowIndex}`;
        const key = `${plan.id}-${field}-${rowIndex}`;
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
    });
    return () => unsubscribeCallbacks.forEach(unsub => unsub());
  }, [filteredPlans, user]);

  
  useEffect(() => {
    if (!commentPopover?.isOpen) return;
    function updatePosition() {
      const icon = document.getElementById(commentPopover.iconId);
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

  const handleDoubleClick = (rowIndex: number, field: keyof SelfStudyPlan, value: string) => {
    setEditingCell({ row: rowIndex, field });
    setTempValue(value.toString());
  };

  const saveChanges = async (rowIndex: number) => {
    if (!editingCell || !user) return;

    const updatedPlan = { 
      ...plans[rowIndex], 
      [editingCell.field]: editingCell.field === 'time_allocation' || editingCell.field === 'concentration' 
        ? Number(tempValue) 
        : tempValue 
    };

    try {
      if (updatedPlan.id) {
        await selfStudyPlanService.update(updatedPlan.id, { [editingCell.field]: updatedPlan[editingCell.field] });
        const updatedPlans = plans.map((plan, i) => i === rowIndex ? updatedPlan : plan);
        setPlans(updatedPlans);
        toast.success('Plan updated successfully!');
      }
    } catch (err: any) {
      console.error('Update plan error:', err);
      toast.error('Failed to update plan. Please try again.');
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveChanges(rowIndex);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleDelete = async (rowIndex: number) => {
    const plan = plans[rowIndex];
    if (!plan.id || !user) return;

    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await selfStudyPlanService.delete(plan.id);
        setPlans(plans.filter((_, i) => i !== rowIndex));
        toast.success('Plan deleted successfully!');
      } catch (error) {
        console.error('Delete plan error:', error);
        toast.error('Failed to delete plan. Please try again.');
      }
    }
  };

  const handleAdd = () => {
    if (!user || !user.id) {
      toast.error('Please log in to create a plan.');
      return;
    }
    setShowModal(true);
  };

  const handleModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: keyof SelfStudyPlan
  ) => {
    const value = e.target.value;
    setNewPlan((prev: SelfStudyPlan) => ({
      ...emptyPlanData,
      ...prev,
      [field]:
        field === 'time_allocation' || field === 'concentration' || field === 'module_id'
          ? Number(value)
          : value,
      student_id: prev.student_id ?? userId,
      semester: prev.semester ?? semester,
      module_id: field === 'module_id' ? Number(value) : prev.module_id,
      date: field === 'date' ? value : prev.date,
      lesson_learned: field === 'lesson_learned' ? value : prev.lesson_learned,
      time_allocation: field === 'time_allocation' ? Number(value) : prev.time_allocation,
      learning_resources: field === 'learning_resources' ? value : prev.learning_resources,
      learning_activities: field === 'learning_activities' ? value : prev.learning_activities,
      concentration: field === 'concentration' ? Number(value) : prev.concentration,
      follow_plan_reflection: field === 'follow_plan_reflection' ? value : prev.follow_plan_reflection,
      evaluation: field === 'evaluation' ? value : prev.evaluation,
      reinforcing_techniques: field === 'reinforcing_techniques' ? value : prev.reinforcing_techniques,
      note: field === 'note' ? value : prev.note,
    }) as SelfStudyPlan);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) {
      toast.error('Please log in to create a plan.');
      return;
    }
    if (!newPlan.module_id || newPlan.module_id === 0) {
      toast.error('Please select a module.');
      return;
    }

    try {
      setLoading(true);
      const planData = { ...newPlan, student_id: userId as number, semester: semester };
      if (!userId) return;
      const response = await selfStudyPlanService.add(userId as number, planData);
      setPlans((prev) => [...prev, response.data]);
      setShowModal(false);
      setNewPlan({ ...emptyPlanData, student_id: userId as number, semester: semester });
      toast.success('Plan added successfully!');
    } catch (err: any) {
      console.error('Add plan error:', err);
      toast.error(err.response?.data?.message || 'Failed to add plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewPlan({ ...emptyPlanData, student_id: user?.id || 0, semester: semester});
  };

  const renderCell = (rowIndex: number, field: keyof SelfStudyPlan, value: string | number) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.field === field;
    const plan = filteredPlans[rowIndex] as SelfStudyPlan;
    if (!plan || !plan.id) return null;
    const commentCount = commentsCount[`${plan.id}-${field}-${rowIndex}`] || 0;
    const displayValue = field === 'time_allocation' 
      ? `${value} mins` 
      : field === 'concentration' 
      ? `${value}/10` 
      : value;
    const iconId = `comment-icon-${plan.id}-${field}-${rowIndex}`;

    if (useRole().isStudent && isEditing) {
      return (
        <input
          type={field === 'date' ? 'date' : field === 'time_allocation' || field === 'concentration' ? 'number' : 'text'}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => saveChanges(rowIndex)}
          onKeyDown={(e) => handleKeyDown(e, rowIndex)}
          className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          autoFocus
          min={field === 'concentration' ? 0 : field === 'time_allocation' ? 1 : undefined}
          max={field === 'concentration' ? 10 : undefined}
        />
      );
    }
    return (
      <div className="relative group h-full">
        <div
          onDoubleClick={() => handleDoubleClick(rowIndex, field, value.toString())}
          className="cursor-pointer hover:bg-gray-100 hover:border-dashed hover:border-gray-300 min-h-[3rem] flex items-center justify-center text-[#1B1B1F] h-full p-2"
        >
          {displayValue || '-'}
        </div>
        <button
          id={iconId}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setCommentPopover({
              isOpen: true,
              position: { top: rect.bottom, left: rect.left },
              commentableId: plan.id!,
              fieldName: field,
              row: rowIndex,
              iconId,
            });
          }}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
        {commentCount > 0 && (
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-64"><p>Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-600"><p>Error: {error}</p></div>;

  return (
    <>
      <div className='relative'>
        <h3 className="text-[28px] font-semibold text-[#21BAEA] py-3 pl-2">Self-study plan:</h3>
        {useRole().isStudent && <button
          onClick={handleAdd}
          className="absolute bottom-4 right-4 flex items-center cursor-pointer space-x-2 bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] text-white px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA] z-40"
        >
          <span className="text-xl leading-none">＋</span>
          <span className="text-sm">Add new plan</span>
        </button>}
      </div>
      <div className="w-full bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto max-w-full max-h-[580px] overflow-y-auto scrollbar-hide">
          <div className="min-w-fit">
            <div className="flex text-sm font-semibold text-[#21BAEA] bg-[#f9fcff] border-b border-gray-200 sticky top-0 z-10">
              {headers.map((label, idx) => (
                <div key={idx} className={`${columnWidths[idx]} py-3 px-4 border-r last:border-none flex justify-center items-center whitespace-nowrap`}>
                  {label}
                </div>
              ))}
              {useRole().isStudent && <div className="min-w-[60px] py-3 px-4 flex justify-center items-center whitespace-nowrap">
                Actions
              </div>}
            </div>
            
            {filteredPlans.length === 0 ? (
              <div className="py-10 text-start pl-10 text-gray-500">
                No plans yet. {useRole().isStudent && "Click"} <span className="text-[#21BAEA]">{useRole().isStudent && "'Add new plan'"}</span> {useRole().isStudent && "to start!"}             </div>
            ) : (
              filteredPlans.map((plan, rowIndex) => (
                <div key={rowIndex} className={`flex text-sm text-[#1B1B1F] border-b border-gray-100 hover:bg-gray-50 transition-colors ${rowIndex % 2 === 0 ? 'bg-[#F7FBFC]' : 'bg-white'}`}>
                  {headers.map((_, idx) => {
                    const field = [
                      'date', 
                      'lesson_learned', 
                      'time_allocation', 
                      'learning_resources', 
                      'learning_activities', 
                      'concentration', 
                      'follow_plan_reflection', 
                      'evaluation', 
                      'reinforcing_techniques', 
                      'note'
                    ][idx] as keyof SelfStudyPlan;
                    return (
                      <div key={idx} className={`${columnWidths[idx]} py-3 px-4 break-words whitespace-normal`}>
                        {renderCell(rowIndex, field, plan[field] || '')}
                      </div>
                    );
                  })}
                  {useRole().isStudent && <div className="min-w-[60px] py-2 px-2 flex justify-center items-center">
                    <button
                      onClick={() => handleDelete(rowIndex)}
                      className="inline-block cursor-pointer mx-auto px-2 py-1 text-sm bg-red-50 text-[#EF4444] rounded-md hover:bg-red-100 hover:text-red-700 hover:shadow-sm transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>}
                </div>
              ))
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={handleModalClose} />
            
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add New Plan</h2>
              <div className="h-0.5 bg-gray-100 mb-6" />

              <form onSubmit={handleModalSubmit} className="space-y-5 overflow-auto max-h-[80vh] tailwind-custom-scrollbar px-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newPlan.module_id}
                    onChange={(e) => handleModalInputChange(e, 'module_id')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  >
                    <option value={0}>Select a module</option>
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newPlan.date}
                    onChange={(e) => handleModalInputChange(e, 'date')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Learned</label>
                  <input
                    type="text"
                    value={newPlan.lesson_learned}
                    onChange={(e) => handleModalInputChange(e, 'lesson_learned')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Allocation (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPlan.time_allocation}
                    onChange={(e) => handleModalInputChange(e, 'time_allocation')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Learning Resources</label>
                  <input
                    type="text"
                    value={newPlan.learning_resources}
                    onChange={(e) => handleModalInputChange(e, 'learning_resources')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Learning Activities</label>
                  <input
                    type="text"
                    value={newPlan.learning_activities}
                    onChange={(e) => handleModalInputChange(e, 'learning_activities')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Concentration (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newPlan.concentration}
                    onChange={(e) => handleModalInputChange(e, 'concentration')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Reflection</label>
                  <textarea
                    value={newPlan.follow_plan_reflection}
                    onChange={(e) => handleModalInputChange(e, 'follow_plan_reflection')}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation</label>
                  <input
                    type="text"
                    value={newPlan.evaluation}
                    onChange={(e) => handleModalInputChange(e, 'evaluation')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reinforcing Techniques</label>
                  <input
                    type="text"
                    value={newPlan.reinforcing_techniques}
                    onChange={(e) => handleModalInputChange(e, 'reinforcing_techniques')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                  <textarea
                    value={newPlan.note}
                    onChange={(e) => handleModalInputChange(e, 'note')}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] rounded-lg hover:from-[#21BAEA] hover:to-[#1AA8D5] focus:outline-none focus:ring-2 focus:ring-[#21BAEA] transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
            commentableType="App\\Models\\SelfStudyPlan"
            commentableId={commentPopover.commentableId}
            fieldName={commentPopover.fieldName}
            row={commentPopover.row}
            onClose={() => setCommentPopover(null)}
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default SelfStudyPlanTable;
