
import React, { useEffect, useState } from 'react';
import selfstudyPlanService, { SelfstudyPlan } from '../services/selfstudyplanService';
import Button from '../components/Button';
import axiosClient from '../services/axiosClient';
import { useAuth } from '../store/AuthContext'; 

interface Module {
  id: number;
  name: string;
}

const emptyPlanData: Omit<SelfstudyPlan, 'id'> = {
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
  student_id:0,
  

};

const StudentGoal: React.FC = () => {
  const { user } = useAuth();
  console.log('Current user:', user); 
  const [plans, setPlans] = useState<SelfstudyPlan[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; field: keyof SelfstudyPlan } | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newPlan, setNewPlan] = useState<Omit<SelfstudyPlan, 'id'>>(emptyPlanData);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setError('Please log in to view plans.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const plansData = await selfstudyPlanService.getAll();
        setPlans(plansData);

        const modulesResponse = await axiosClient.get('/modules');
        setModules(modulesResponse.data.data || []);

        setNewPlan((prev) => ({ ...prev, student_id: user.id }));

        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching data');
        console.error('Fetch error:', err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    field: keyof SelfstudyPlan
  ) => {
    const value = e.target.value;
    const updatedPlans = [...plans];
    updatedPlans[rowIndex] = {
      ...updatedPlans[rowIndex],
      [field]:
        field === 'time_allocation' || field === 'concentration'
          ? Number(value)
          : value,
    };
    setPlans(updatedPlans);
  };

  const handleBlur = async (rowIndex: number, field: keyof SelfstudyPlan) => {
    const updatedPlan = plans[rowIndex];
    if (!updatedPlan.id) {
      alert('Không thể cập nhật: Kế hoạch thiếu ID.');
      console.error('Kế hoạch thiếu id:', updatedPlan);
      setEditingCell(null);
      return;
    }
    try {
      const updatedField = { [field]: updatedPlan[field] };
      await selfstudyPlanService.update(updatedPlan.id, updatedField);
    } catch (err: any) {
      alert('Cập nhật thất bại: ' + (err.message || err));
    }
    setEditingCell(null);
  };

  const handleAdd = () => {
    if (!user || !user.id) {
      alert('Please log in to create a plan.');
      return;
    }
    setShowModal(true);
  };

  const handleModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: keyof Omit<SelfstudyPlan, 'id'>
  ) => {
    const value = e.target.value;
    setNewPlan((prev) => ({
      ...prev,
      [field]:
        field === 'time_allocation' || field === 'concentration' || field === 'module_id'
          ? Number(value)
          : value,
    }));
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user || !user.id) {
    alert('Vui lòng đăng nhập để tạo kế hoạch.');
    return;
  }
  if (!newPlan.module_id || newPlan.module_id === 0) {
    alert('Vui lòng chọn một Module.');
    return;
  }

  try {
    setLoading(true);
    const planData = { ...newPlan, student_id: user.id };
    console.log('Dữ liệu gửi đi:', planData);
    const createdPlan = await selfstudyPlanService.create(planData);
    setPlans((prev) => [...prev, createdPlan.data]); 
    setShowModal(false);
    setNewPlan({ ...emptyPlanData, student_id: user.id });
  } catch (err: any) {
    console.error('Lỗi khi tạo kế hoạch:', err.response?.data);
    alert('Thêm thất bại: ' + (err.response?.data?.message || err.message || err));
  } finally {
    setLoading(false);
  }
};
  const handleModalClose = () => {
    setShowModal(false);
    setNewPlan({ ...emptyPlanData, student_id: user?.id || 0 });
  };

  const fields: (keyof SelfstudyPlan)[] = [
    'date',
    'lesson_learned',
    'time_allocation',
    'learning_resources',
    'learning_activities',
    'concentration',
    'follow_plan_reflection',
    'evaluation',
    'reinforcing_techniques',
    'note',
  ];

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  if (plans.length === 0 && !showModal) return <p className="text-center mt-10">No plans found.</p>;

 return (
    <div className="relative m-5 w-[70%]">
      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
        <table className="w-full table-fixed border-collapse rounded-lg shadow-md">
          <thead className="h-[58px] bg-white text-[#007bff] sticky top-0 z-10">
            <tr>
              <th className="border-b border-gray-300 text-center w-[150px] px-2 py-3">Date</th>
              <th className="border-b border-gray-300 text-center w-[200px] px-2 py-3">Lesson Learned</th>
              <th className="border-b border-gray-300 text-center w-[150px] px-2 py-3">Time Allocation</th>
              <th className="border-b border-gray-300 text-center w-[200px] px-2 py-3">Learning Resources</th>
              <th className="border-b border-gray-300 text-center w-[200px] px-2 py-3">Learning Activities</th>
              <th className="border-b border-gray-300 text-center w-[120px] px-2 py-3">Concentration</th>
              <th className="border-b border-gray-300 text-center w-[200px] px-2 py-3">Plan Reflection</th>
              <th className="border-b border-gray-300 text-center w-[150px] px-2 py-3">Evaluation</th>
              <th className="border-b border-gray-300 text-center w-[200px] px-2 py-3">Reinforcing Techniques</th>
              <th className="border-b border-gray-300 text-center w-[200px] px-2 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, rowIndex) => (
              <tr
                key={plan.id ?? rowIndex}
                className="even:bg-[rgba(98,77,227,0.1)] odd:bg-white hover:bg-[#e3f2fd]"
              >
                {fields.map((field) => (
                  <td
                    key={field}
                    className="border-b border-gray-300 text-center text-[16px] px-2 py-4 cursor-pointer"
                    onClick={() => setEditingCell({ row: rowIndex, field })}
                  >
                    {editingCell?.row === rowIndex && editingCell?.field === field ? (
                      <input
                        type={
                          field === 'time_allocation' || field === 'concentration'
                            ? 'number'
                            : field === 'date'
                            ? 'date'
                            : 'text'
                        }
                        value={plans[rowIndex][field] ?? ''}
                        onChange={(e) => handleInputChange(e, rowIndex, field)}
                        onBlur={() => handleBlur(rowIndex, field)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
                        autoFocus
                        className="w-full text-center border border-blue-400 rounded px-1 py-0.5"
                      />
                    ) : field === 'time_allocation' ? (
                      `${plan[field]} mins`
                    ) : field === 'concentration' ? (
                      `${plan[field]}/10`
                    ) : (
                      plan[field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add Self-Study Plan</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Module <span className="text-red-600">*</span>
                </label>
                <select
                  value={newPlan.module_id}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, module_id: Number(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded p-2"
                  required
                >
                  <option value={0} disabled>
                    Select module
                  </option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newPlan.date}
                  onChange={(e) => handleModalInputChange(e, 'date')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Lesson Learned</label>
                <input
                  type="text"
                  value={newPlan.lesson_learned}
                  onChange={(e) => handleModalInputChange(e, 'lesson_learned')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Time Allocation (minutes)</label>
                <input
                  type="number"
                  min="0"
                  value={newPlan.time_allocation}
                  onChange={(e) => handleModalInputChange(e, 'time_allocation')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Learning Resources</label>
                <input
                  type="text"
                  value={newPlan.learning_resources}
                  onChange={(e) => handleModalInputChange(e, 'learning_resources')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Learning Activities</label>
                <input
                  type="text"
                  value={newPlan.learning_activities}
                  onChange={(e) => handleModalInputChange(e, 'learning_activities')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Concentration (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={newPlan.concentration}
                  onChange={(e) => handleModalInputChange(e, 'concentration')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Plan Reflection</label>
                <textarea
                  value={newPlan.follow_plan_reflection}
                  onChange={(e) => handleModalInputChange(e, 'follow_plan_reflection')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Evaluation</label>
                <input
                  type="text"
                  value={newPlan.evaluation}
                  onChange={(e) => handleModalInputChange(e, 'evaluation')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Reinforcing Techniques</label>
                <input
                  type="text"
                  value={newPlan.reinforcing_techniques}
                  onChange={(e) => handleModalInputChange(e, 'reinforcing_techniques')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Note</label>
                <textarea
                  value={newPlan.note}
                  onChange={(e) => handleModalInputChange(e, 'note')}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2 text-white">
  <Button text="Cancle" onClick={handleModalClose} />
  <button
    type="submit"
    className="bg-[#24BAEA] text-white px-4 py-2 rounded-lg		 hover:bg-[#0a8dba] "
  >
    Save
  </button>
</div>
</form>
</div>
</div>
      )}
      <div className="fixed bottom-4 right-4 z-50 mr-5 text-white">
        <Button text="+ Add" onClick={handleAdd} />
      </div>
    </div>
  );
};

export default StudentGoal;