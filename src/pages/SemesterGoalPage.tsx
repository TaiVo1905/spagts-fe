// src/pages/SemesterGoalPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import CommentPopover from '../components/CommentPopover';

interface SemesterGoal {
  id: number;
  content: string;
  semester_id: number;
  created_at: string;
  updated_at: string;
}

const SemesterGoalPage: React.FC = () => {
  const { semesterId } = useParams<{ semesterId: string }>();
  const [goals, setGoals] = useState<SemesterGoal[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ fieldName: string; row: number } | null>(null);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const response = await axiosClient.get(`/semesters/${semesterId}/goals`);
        setGoals(response.data.data);
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    };

    loadGoals();
  }, [semesterId]);

  const handleCellClick = (fieldName: string, row: number) => {
    setSelectedCell({ fieldName, row });
  };

  const handleCloseCommentPopover = () => {
    setSelectedCell(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Semester Goals</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Goal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {goals.map((goal, index) => (
              <tr key={goal.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{goal.content}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleCellClick('content', index)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Comment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCell && (
        <CommentPopover
          commentableType="semester_goal"
          commentableId={parseInt(semesterId!)}
          fieldName={selectedCell.fieldName}
          row={selectedCell.row}
          onClose={handleCloseCommentPopover}
        />
      )}
    </div>
  );
};

export default SemesterGoalPage; 