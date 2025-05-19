import React from 'react';
import { useLocation } from 'react-router-dom';
import StudentGoal from '../../components/StudentGoal';
import TaskCheckList from '../../components/TaskCheckList';
import DayGoal from '../../components/DayGoal';

const SelfStudyPage: React.FC = () => {
    const location = useLocation();
    const pathnameSplit = location.pathname.split('/');
    const semester = Number(pathnameSplit[pathnameSplit.length - 1][pathnameSplit[pathnameSplit.length - 1].length - 1]);
    return (
        <div>
            <DayGoal/>
            <TaskCheckList semester = {semester}/>
            <StudentGoal semester = {semester}/>
        </div>
    );
};

export default SelfStudyPage;
