import React from 'react';
import { Outlet } from 'react-router-dom';
import InClassGoal from '../../components/InClassGoal';
import TaskCheckList from '../../components/TaskCheckList';
import DayGoal from '../../components/DayGoal';

const SelfStudyPage: React.FC = () => {
    return (
        <div>
            <DayGoal/>
            <TaskCheckList/>
            <div className="flex">
                <div className="flex-1 p-4">
                   <InClassGoal/>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SelfStudyPage;
