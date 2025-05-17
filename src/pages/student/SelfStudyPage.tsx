import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentGoal from '../../components/StudentGoal';
import TaskCheckList from '../../components/TaskCheckList';
import DayGoal from '../../components/DayGoal';

const SelfStudyPage: React.FC = () => {
    return (
        <div>
            <DayGoal/>
            <TaskCheckList/>
            <div className="flex">
                <div className="flex-1 p-4">
                   <StudentGoal/>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SelfStudyPage;
