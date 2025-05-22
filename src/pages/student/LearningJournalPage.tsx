
import React, { useState } from 'react';
import SelfStudyPlanTable from '../../components/SelfStudyPlanTable';
import InClassPlanTable from '../../components/InClassPlanTable';
import TaskCheckList from '../../components/TaskCheckList';
import WeeklyTime from '../../components/WeeklyTime';
import { useLocation } from 'react-router-dom';

const LearningJournalPage: React.FC = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const location = useLocation();
  const pathnameSplit = location.pathname.split('/');
  const semester = Number(pathnameSplit[pathnameSplit.length - 1][pathnameSplit[pathnameSplit.length - 1].length - 1]);
  return (
    <div className='w-[calc(100vw-300px)] p-6'>
        <WeeklyTime
        semester={semester}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedStartDate={setSelectedStartDate}
        setSelectedEndDate={setSelectedEndDate}
      // onAddWeek={handleAddWeek}  
      />
      <TaskCheckList
        semester={semester}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
      />
      <div className="bg-white rounded-2xl p-4 shadow" style={{ marginBottom: '24px' }}>
        <InClassPlanTable
          semester={semester}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
        />
      </div>
      <div className="bg-white rounded-2xl p-4 shadow" style={{ marginBottom: '24px' }}>
        <SelfStudyPlanTable
          semester={semester}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
        />
      </div>
    </div>
  );
};

export default LearningJournalPage;