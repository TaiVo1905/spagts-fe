import React, { useEffect, useState } from 'react';
import WeeklyGoalService, { WeeklyGoal } from '../services/weeklyGoalService';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import { toast } from 'react-hot-toast';
import { useRole } from '../utils/useRole';
import { useParams } from 'react-router-dom';

type Week = {
  startDate: string;
  endDate: string;
  label: string;
};

type DayGoalProps = {
  semester: number,
  selectedStartDate: string | null;
  selectedEndDate: string | null;
  setSelectedStartDate: (date: string) => void;
  setSelectedEndDate: (date: string) => void;
  onWeekSelect?: (week: Week | null) => void;
};

function formatRangeDate(startDateStr: string, endDateStr: string): string {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth() + 1;
  const startYear = startDate.getFullYear();

  const endDay = endDate.getDate();
  const endMonth = endDate.getMonth() + 1;
  const endYear = endDate.getFullYear();

  if (startYear === endYear) {
    return `${startDay}/${startMonth} - ${endDay}/${endMonth}/${startYear}`;
  } else {
    return `${startDay}/${startMonth}/${startYear} - ${endDay}/${endMonth}/${endYear}`;
  }
}

const WeeklyTime: React.FC<DayGoalProps> = ({
  semester,
  setSelectedStartDate,
  setSelectedEndDate,
  onWeekSelect,
}) => {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useAuth();
  const { id: studentId } = useParams<{ id: string }>();
  const userId = Number(studentId) || user?.id || 0;

  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newGoalContent, setNewGoalContent] = useState('');

  const fetchWeeks = async () => {
    try {
      const data: WeeklyGoal[] = (await WeeklyGoalService.getAll(userId, semester)).data;
      const uniqueWeeksMap = new Map<string, Week>();

      data.forEach((goal) => {
        const key = `${goal.start_date}~${goal.end_date}`;
        if (!uniqueWeeksMap.has(key)) {
          uniqueWeeksMap.set(key, {
            startDate: goal.start_date,
            endDate: goal.end_date,
            label: formatRangeDate(goal.start_date, goal.end_date),
          });
        }
      });

      const uniqueWeeks = Array.from(uniqueWeeksMap.values());
      setWeeks(uniqueWeeks);

      if (uniqueWeeks.length > 0) {
        setSelectedIndex(0);
        setSelectedStartDate(uniqueWeeks[0].startDate);
        setSelectedEndDate(uniqueWeeks[0].endDate);
        onWeekSelect && onWeekSelect(uniqueWeeks[0]);
      } else {
        onWeekSelect && onWeekSelect(null);
      }
    } catch (error) {
      toast.error('Failed to load weekly goals');
    }
  };

  useEffect(() => {
    fetchWeeks();
  }, [semester, userId]);

  const handleClickWeek = (index: number) => {
    setSelectedIndex(index);
    const week = weeks[index];
    setSelectedStartDate(week.startDate);
    setSelectedEndDate(week.endDate);
    onWeekSelect && onWeekSelect(week);
  };

  const handleAddWeekClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStartDate || !newEndDate || !newGoalContent.trim()) {
      toast.error('Please enter start date, end date and goal content');
      return;
    }

    if (new Date(newEndDate) <= new Date(newStartDate)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const payload = {
        start_date: newStartDate,
        end_date: newEndDate,
        goal_content: newGoalContent.trim(),
        is_completed: false,
        student_id: userId,
        semester: semester
      };

      await WeeklyGoalService.add(userId, payload);

      setShowAddForm(false);
      setNewStartDate('');
      setNewEndDate('');
      setNewGoalContent('');
      await fetchWeeks();
      toast.success('Weekly goal added successfully!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Invalid data');
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden mb-6">
      <div className="p-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3">
          {weeks.length === 0 && (
            <div className="py-4 text-center text-gray-500 w-full">
              No weekly goals yet. {useRole().isStudent && 'Click "Add Week" to get started!'}
            </div>
          )}
          {useRole().isStudent && <button
            onClick={handleAddWeekClick}
            className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA] bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
          >
            <span className="text-lg leading-none">＋</span>
            <span className="text-sm">Add Week</span>
          </button>}
          {weeks.map((week, index) => (
            <button
              key={index}
              onClick={() => handleClickWeek(index)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA] ${
                selectedIndex === index
                  ? 'bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              Week {index + 1}: {week.label}
            </button>
          ))}
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowAddForm(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add New Weekly Goal</h2>
            <div className="h-0.5 bg-gray-100 mb-6" />

            <form onSubmit={handleAddFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newGoalContent}
                  onChange={(e) => setNewGoalContent(e.target.value)}
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
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
  );
};

export default WeeklyTime;