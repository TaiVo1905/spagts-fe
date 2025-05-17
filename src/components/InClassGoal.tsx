// InClassGoal.tsx
import React, { useEffect, useState } from 'react';
import inclassPlanService, { InclassPlan } from '../services/inclassService';
import Button from '../components/Button';

const emptyPlanData: Omit<InclassPlan, 'id'> = {
  date: new Date().toISOString().slice(0, 10),
  lesson_learned: '',
  self_assessment: 0,
  difficulties: '',
  plan_to_improve: '',
  problem_solved: false,
  
};

const InClassGoal: React.FC = () => {
  const [plans, setPlans] = useState<InclassPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; field: keyof InclassPlan } | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await inclassPlanService.getAll();
        setPlans(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    field: keyof InclassPlan
  ) => {
    const value = field === 'problem_solved'
      ? e.target.checked
      : field === 'self_assessment'
      ? Number(e.target.value)
      : e.target.value;

    const updatedPlans = [...plans];
    updatedPlans[rowIndex] = {
      ...updatedPlans[rowIndex],
      [field]: value,
    };
    setPlans(updatedPlans);
  };

  const handleBlur = async (rowIndex: number, field: keyof InclassPlan) => {
    const updatedPlan = plans[rowIndex];
    try {
      await inclassPlanService.update(updatedPlan.id, updatedPlan);
    } catch (err: any) {
      alert('Update failed: ' + (err.message || err));
    }
    setEditingCell(null);
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      const newPlan = await inclassPlanService.create(emptyPlanData);
      setPlans(prev => {
        const updatedPlans = [...prev, newPlan];
        setEditingCell({ row: updatedPlans.length - 1, field: 'lesson_learned' });
        return updatedPlans;
      });
    } catch (err: any) {
      alert('Add failed: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const fields: (keyof InclassPlan)[] = [
    'date',
    'lesson_learned',
    'self_assessment',
    'difficulties',
    'plan_to_improve',
    'problem_solved',
  ];

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  if (plans.length === 0) return <p className="text-center mt-10">No plans found.</p>;

  return (
    <div className="relative overflow-x-auto overflow-y-auto max-h-[500px] m-5 w-[70%]">
      <table className="w-full table-fixed border-collapse rounded-lg shadow-md">
        <thead className="h-[58px] bg-white text-[#007bff] sticky top-0 z-10">
          <tr>
            <th className="border-b border-gray-300 text-center w-[150px] px-2 py-3">Date</th>
            <th className="border-b border-gray-300 text-center w-[200px] px-2 py-3">Lesson Learned</th>
            <th className="border-b border-gray-300 text-center w-[150px] px-2 py-3">Self Assessment</th>
            <th className="border-b border-gray-300 text-center w-[200px] px-2 py-3">Difficulties</th>
            <th className="border-b border-gray-300 text-center w-[200px] px-2 py-3">Plan to Improve</th>
            <th className="border-b border-gray-300 text-center w-[120px] px-2 py-3">Problem Solved</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, rowIndex) => (
            <tr key={plan.id} className="even:bg-[rgba(98,77,227,0.1)] odd:bg-white hover:bg-[#e3f2fd]">
              {fields.map((field) => (
                <td
                  key={field}
                  className="border-b border-gray-300 text-center text-[16px] px-2 py-4 cursor-pointer"
                  onClick={() => setEditingCell({ row: rowIndex, field })}
                >
                  {editingCell?.row === rowIndex && editingCell?.field === field ? (
                    field === 'problem_solved' ? (
                      <input
                        type="checkbox"
                        checked={!!plans[rowIndex][field]}
                        onChange={(e) => handleInputChange(e, rowIndex, field)}
                        onBlur={() => handleBlur(rowIndex, field)}
                        autoFocus
                      />
                    ) : (
                      <input
                        type={field === 'self_assessment' ? 'number' : field === 'date' ? 'date' : 'text'}
                        value={plans[rowIndex][field] as any}
                        onChange={(e) => handleInputChange(e, rowIndex, field)}
                        onBlur={() => handleBlur(rowIndex, field)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.currentTarget.blur();
                        }}
                        autoFocus
                        className="w-full text-center border border-blue-400 rounded px-1 py-0.5"
                      />
                    )
                  ) : field === 'problem_solved' ? (
                    plan[field] ? '✅' : '❌'
                  ) : field === 'self_assessment' ? (
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

      <div className="fixed bottom-4 right-4 z-50 mr-5 text-white">
        <Button text="+ Add" onClick={handleAdd} />
      </div>
    </div>
  );
};

export default InClassGoal;
