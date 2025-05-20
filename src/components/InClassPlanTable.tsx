import React, { useEffect, useState } from 'react';
import inClassPlanService, { InClassPlan } from '../services/inClassPlanService';
import { useAuth } from '../store/AuthContext';
import moduleService from '../services/moduleService';
import { toast } from 'react-hot-toast';

interface Module {
  id: number;
  name: string;
}

type InClassGoalProps = {
  semester: number;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
};

const emptyPlanData: InClassPlan = {
  module_id: 0,
  date: new Date().toISOString().slice(0, 10),
  lesson_learned: '',
  self_assessment: 0,
  difficulties: '',
  plan_to_improve: '',
  problem_solved: false,
  student_id: 0,
  semester: 0
};

const headers = [
  'Date', 
  'Lesson Learned', 
  'Self Assessment', 
  'Difficulties', 
  'Plan to Improve', 
  'Problem Solved'
];

const columnWidths = [
  'min-w-[150px]', 
  'min-w-[200px]', 
  'min-w-[150px]', 
  'min-w-[200px]', 
  'min-w-[200px]', 
  'min-w-[150px]'
];

const InClassPlanTable: React.FC<InClassGoalProps> = ({ semester, selectedStartDate, selectedEndDate }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<InClassPlan[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; field: keyof InClassPlan } | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newPlan, setNewPlan] = useState<InClassPlan>(emptyPlanData);
  const [filteredPlans, setFilteredPlans] = useState<InClassPlan[]>([]);
  const [tempValue, setTempValue] = useState<string>('');

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
      if (!user?.id) {
        setError('Please log in to view plans.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const plansData = (await inClassPlanService.getAll(user.id, semester)).data;
        setPlans(plansData);

        const modulesResponse = (await moduleService.getAll()).data;
        setModules(modulesResponse || []);

        setNewPlan((prev) => ({ ...prev, student_id: user.id, semester: semester }));
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

  const handleDoubleClick = (rowIndex: number, field: keyof InClassPlan, value: string) => {
    setEditingCell({ row: rowIndex, field });
    setTempValue(value.toString());
  };

  const saveChanges = async (rowIndex: number) => {
    if (!editingCell || !user) return;

    const updatedPlan = { 
      ...plans[rowIndex], 
      [editingCell.field]: editingCell.field === 'self_assessment' 
        ? Number(tempValue) 
        : editingCell.field === 'problem_solved'
        ? tempValue === 'true'
        : tempValue
    };

    try {
      if (updatedPlan.id) {
        await inClassPlanService.update(updatedPlan.id, { [editingCell.field]: updatedPlan[editingCell.field] });
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
        await inClassPlanService.delete(plan.id);
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
    field: keyof InClassPlan
  ) => {
    const value = field === 'problem_solved'
      ? (e.target as HTMLInputElement).checked
      : e.target.value;

    setNewPlan((prev) => ({
      ...prev,
      [field]: field === 'self_assessment' || field === 'module_id'
        ? Number(value)
        : value,
    }));
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('Please log in to create a plan.');
      return;
    }
    if (!newPlan.module_id || newPlan.module_id === 0) {
      toast.error('Please select a module.');
      return;
    }

    try {
      setLoading(true);
      const planData = { ...newPlan, student_id: user.id, semester: semester };
      const response = await inClassPlanService.add(user.id, planData);
      setPlans((prev) => [...prev, response.data]); 
      setShowModal(false);
      setNewPlan({ ...emptyPlanData, student_id: user.id, semester: semester });
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
    setNewPlan({ ...emptyPlanData, student_id: user?.id || 0, semester: semester });
  };

  const renderCell = (rowIndex: number, field: keyof InClassPlan, value: string | number | boolean) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.field === field;
    const displayValue = field === 'self_assessment' 
      ? `${value}/10` 
      : field === 'problem_solved' 
      ? value ? 'Yes' : 'No'
      : value;

    if (isEditing) {
      if (field === 'problem_solved') {
        return (
          <select
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => saveChanges(rowIndex)}
            onKeyDown={(e) => handleKeyDown(e, rowIndex)}
            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            autoFocus
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      }

      return (
        <input
          type={field === 'date' ? 'date' : field === 'self_assessment' ? 'number' : 'text'}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => saveChanges(rowIndex)}
          onKeyDown={(e) => handleKeyDown(e, rowIndex)}
          className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          autoFocus
          min={field === 'self_assessment' ? 0 : undefined}
          max={field === 'self_assessment' ? 10 : undefined}
        />
      );
    }

    return (
      <div
        onDoubleClick={() => handleDoubleClick(rowIndex, field, value.toString())}
        className="cursor-pointer hover:bg-gray-100 hover:border-dashed hover:border-gray-300 min-h-[3rem] flex items-center justify-center text-[#1B1B1F]"
      >
        {displayValue || '-'}
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-64"><p>Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-600"><p>Error: {error}</p></div>;

  return (
    <>
      <div className='relative'>
        <h3 className="text-[28px] font-semibold text-[#21BAEA] py-3 pl-2">In-class plan:</h3>
        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-4 flex items-center cursor-pointer space-x-2 bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] text-white px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA] z-40"
        >
          <span className="text-xl leading-none">＋</span>
          <span className="text-sm">Add new plan</span>
        </button>
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
              <div className="min-w-[60px] py-3 px-4 flex justify-center items-center whitespace-nowrap">
                Actions
              </div>
            </div>
            
            {filteredPlans.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No plans yet. Click <span className="text-[#21BAEA]">"Add new plan"</span> to start!
              </div>
            ) : (
              filteredPlans.map((plan, rowIndex) => (
                <div key={rowIndex} className={`flex text-sm text-[#1B1B1F] border-b border-gray-100 hover:bg-gray-50 transition-colors ${rowIndex % 2 === 0 ? 'bg-[#F7FBFC]' : 'bg-white'}`}>
                  {headers.map((_, idx) => {
                    const field = [
                      'date', 
                      'lesson_learned', 
                      'self_assessment', 
                      'difficulties', 
                      'plan_to_improve', 
                      'problem_solved'
                    ][idx] as keyof InClassPlan;
                    return (
                      <div key={idx} className={`${columnWidths[idx]} py-3 px-4 break-words whitespace-normal`}>
                        {renderCell(rowIndex, field, plan[field] || '')}
                      </div>
                    );
                  })}
                  <div className="min-w-[60px] py-2 px-2 flex justify-center items-center">
                    <button
                      onClick={() => handleDelete(rowIndex)}
                      className="inline-block cursor-pointer mx-auto px-2 py-1 text-sm bg-red-50 text-[#EF4444] rounded-md hover:bg-red-100 hover:text-red-700 hover:shadow-sm transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={handleModalClose} />
            
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add New In-Class Plan</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Self Assessment (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newPlan.self_assessment}
                    onChange={(e) => handleModalInputChange(e, 'self_assessment')}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulties</label>
                  <textarea
                    value={newPlan.difficulties}
                    onChange={(e) => handleModalInputChange(e, 'difficulties')}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan to Improve</label>
                  <textarea
                    value={newPlan.plan_to_improve}
                    onChange={(e) => handleModalInputChange(e, 'plan_to_improve')}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="problem_solved"
                    checked={newPlan.problem_solved}
                    onChange={(e) => handleModalInputChange(e, 'problem_solved')}
                    className="w-5 h-5 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="problem_solved" className="block text-sm font-medium text-gray-700">
                    Problem Solved
                  </label>
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
    </>
  );
};

export default InClassPlanTable;