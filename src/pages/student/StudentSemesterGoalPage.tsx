import React, { useState } from 'react';
import "../../styles/App.css";

interface Goal {
    course: string;
    courseExpectation: string;
    teacherExpectation: string;
    selfExpectation: string;
    studentEvaluation: string;
    teacherEvaluation: string;
}

const initialGoalsBySemester: Record<string, Goal[]> = {
    S1: [],
    S2: [],
    S3: [],
    S4: [],
    S5: [],
    S6: [],
};

const headers = [
    'Course',
    'What I expect from the course',
    'What I expect from the teacher & instructor',
    'What I expect from myself',
    "Student's evaluation",
    "Teacher's evaluation",
    'Actions',
];

const columnWidths = [
    'min-w-[200px]',
    'min-w-[350px]',
    'min-w-[380px]',
    'min-w-[350px]',
    'min-w-[350px]',
    'min-w-[350px]',
    'min-w-[60px]',
];

const StudentSemesterGoal: React.FC<{ semester: string; goals: Goal[]; setGoals: (goals: Goal[]) => void }> = ({ semester, goals, setGoals }) => {
    const [editingCell, setEditingCell] = useState<{ index: number; field: keyof Goal } | null>(null);

    const handleInputChange = (index: number, field: keyof Goal, value: string) => {
        const updatedGoals = goals.map((goal, i) =>
            i === index ? { ...goal, [field]: value } : goal
        );
        setGoals(updatedGoals);
    };

    const handleDelete = (index: number) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            setGoals(goals.filter((_, i) => i !== index));
        }
    };

    const renderCell = (index: number, field: keyof Goal, value: string) => {
        const isEditing = editingCell?.index === index && editingCell?.field === field;

        if (isEditing) {
            if (field === 'course') {
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(index, field, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setEditingCell(null); }}
                        className="w-full p-1 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#21BAEA]"
                        autoFocus
                    />
                );
            }
            return (
                <textarea
                    value={value}
                    onChange={(e) => handleInputChange(index, field, e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) setEditingCell(null); }}
                    className="w-full p-1 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#21BAEA]"
                    rows={3}
                    autoFocus
                />
            );
        }

        return (
            <div
                onClick={() => setEditingCell({ index, field })}
                className={`cursor-pointer hover:bg-gray-100 hover:border-dashed hover:border-gray-200 min-h-[3rem] flex items-center ${!value ? 'justify-center text-gray-400 italic' : ''}`}
            >
                {value || '-'}
            </div>
        );
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-w-full max-h-[580px] overflow-y-auto scrollbar-hide">
                <div className="min-w-fit mx-auto">
                    <div className="flex text-base font-semibold text-[#21BAEA] bg-[#f9fcff] border-b border-gray-200 items-center sticky top-0 z-10">
                        {headers.map((label, idx) => (
                            <div
                                key={idx}
                                className={`${columnWidths[idx]} py-5 px-5 border-r last:border-none flex justify-center items-center whitespace-nowrap !important`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                    {goals.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                            No goals yet. Click <span className="text-[#21BAEA]">"Add new goal"</span> to start!
                        </div>
                    ) : (
                        goals.map((goal, index) => (
                            <div
                                key={index}
                                className={`flex text-sm text-[#1B1B1F] border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-[#F7FBFC]' : 'bg-white'}`}
                            >
                                <div className={`${columnWidths[0]} py-5 px-5 break-words whitespace-normal`}>
                                    {renderCell(index, 'course', goal.course)}
                                </div>
                                <div className={`${columnWidths[1]} py-5 px-5 break-words whitespace-normal`}>
                                    {renderCell(index, 'courseExpectation', goal.courseExpectation)}
                                </div>
                                <div className={`${columnWidths[2]} py-5 px-5 break-words whitespace-normal`}>
                                    {renderCell(index, 'teacherExpectation', goal.teacherExpectation)}
                                </div>
                                <div className={`${columnWidths[3]} py-5 px-5 break-words whitespace-normal`}>
                                    {renderCell(index, 'selfExpectation', goal.selfExpectation)}
                                </div>
                                <div className={`${columnWidths[4]} py-5 px-5 break-words whitespace-normal`}>
                                    {renderCell(index, 'studentEvaluation', goal.studentEvaluation)}
                                </div>
                                <div className={`${columnWidths[5]} py-5 px-5 break-words whitespace-normal`}>
                                    {renderCell(index, 'teacherEvaluation', goal.teacherEvaluation)}
                                </div>
                                <div className={`${columnWidths[6]} py-2 px-8 flex justify-center items-center`}>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="inline-block mx-auto px-2 py-1 text-sm bg-red-50 text-[#EF4444] rounded-md hover:bg-red-100 hover:text-red-700 hover:shadow-sm transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        aria-label={`Delete goal for ${goal.course || 'row ' + (index + 1)}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const StudentSemesterGoalPage: React.FC = () => {
    const [selectedSemester, setSelectedSemester] = useState('S1');
    const [goalsBySemester, setGoalsBySemester] = useState<Record<string, Goal[]>>(initialGoalsBySemester);
    const semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

    const handleAddNewGoal = () => {
        const newGoal: Goal = {
            course: '',
            courseExpectation: '',
            teacherExpectation: '',
            selfExpectation: '',
            studentEvaluation: '',
            teacherEvaluation: '',
        };
        setGoalsBySemester((prev) => ({
            ...prev,
            [selectedSemester]: [...prev[selectedSemester], newGoal],
        }));
    };

    const updateGoals = (newGoals: Goal[]) => {
        setGoalsBySemester((prev) => ({
            ...prev,
            [selectedSemester]: newGoals,
        }));
    };

    return (
        <div className="w-full bg-white border border-gray-200 overflow-hidden ">
            <div className="relative bg-white rounded-2xl shadow-md p-6 min-h-[700px]">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-3">
                        {semesters.map((sem) => (
                            <button
                                key={sem}
                                onClick={() => setSelectedSemester(sem)}
                                className={`px-6 py-2 text-sm font-semibold rounded-xl transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA] ${selectedSemester === sem
                                    ? 'bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {sem}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleAddNewGoal}
                        className="flex items-center space-x-2 bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] text-white px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA]"
                        aria-label="Add new goal"
                    >
                        <span className="text-xl leading-none">＋</span>
                        <span className="text-sm">Add new goal</span>
                    </button>
                </div>
                <StudentSemesterGoal
                    semester={selectedSemester}
                    goals={goalsBySemester[selectedSemester]}
                    setGoals={updateGoals}
                />
            </div>
        </div>
    );
};

export default StudentSemesterGoalPage;