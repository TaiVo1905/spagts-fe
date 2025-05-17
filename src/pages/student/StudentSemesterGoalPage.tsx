import React, { useState, useEffect } from 'react';
import "../../styles/App.css";
import goalService, { Goal, AddGoalPayload, Module } from '../../services/goalService';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../store/AuthContext';

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

    const handleInputChange = async (index: number, field: keyof Goal, value: string) => {
        const updatedGoals = goals.map((goal, i) =>
            i === index ? { ...goal, [field]: value } : goal
        );
        setGoals(updatedGoals);

        if (goals[index].id) {
            try {
                await goalService.updateGoal(goals[index].id, { [field]: value });
                toast.success('Goal updated successfully!');
            } catch (error) {
                console.error('Update goal error:', error);
                toast.error('Failed to update goal. Please try again.');
            }
        }
    };

    const handleDelete = async (index: number) => {
        const goal = goals[index];
        if (!goal.id) return;

        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await goalService.deleteGoal(goal.id);
                setGoals(goals.filter((_, i) => i !== index));
                toast.success('Goal deleted successfully!');
            } catch (error) {
                console.error('Delete goal error:', error);
                toast.error('Failed to delete goal. Please try again.');
            }
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
                        className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    rows={3}
                    autoFocus
                />
            );
        }

        return (
            <div
                onClick={() => setEditingCell({ index, field })}
                className="cursor-pointer hover:bg-gray-100 hover:border-dashed hover:border-gray-300 min-h-[3rem] flex items-center text-[#1B1B1F]"
            >
                {value || '-'}
            </div>
        );
    };

    return (
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
            <div className="overflow-x-auto max-w-full max-h-[580px] overflow-y-auto scrollbar-hide">
                <div className="min-w-fit">
                    <div className="flex text-sm font-semibold text-[#21BAEA] bg-[#f9fcff] border-b border-gray-200 sticky top-0 z-10">
                        {headers.map((label, idx) => (
                            <div
                                key={idx}
                                className={`${columnWidths[idx]} py-3 px-4 border-r last:border-none flex justify-center items-center whitespace-nowrap`}
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
                                key={goal.id || index}
                                className={`flex text-sm text-[#1B1B1F] border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-[#F7FBFC]' : 'bg-white'}`}
                            >
                                <div className={`${columnWidths[0]} py-3 px-4 break-words whitespace-normal`}>
                                    {renderCell(index, 'course', goal.course)}
                                </div>
                                <div className={`${columnWidths[1]} py-3 px-4 break-words whitespace-normal`}>
                                    {renderCell(index, 'courseExpectation', goal.courseExpectation)}
                                </div>
                                <div className={`${columnWidths[2]} py-3 px-4 break-words whitespace-normal`}>
                                    {renderCell(index, 'teacherExpectation', goal.teacherExpectation)}
                                </div>
                                <div className={`${columnWidths[3]} py-3 px-4 break-words whitespace-normal`}>
                                    {renderCell(index, 'selfExpectation', goal.selfExpectation)}
                                </div>
                                <div className={`${columnWidths[4]} py-3 px-4 break-words whitespace-normal`}>
                                    {renderCell(index, 'studentEvaluation', goal.studentEvaluation || '')}
                                </div>
                                <div className={`${columnWidths[5]} py-3 px-4 break-words whitespace-normal`}>
                                    {renderCell(index, 'teacherEvaluation', goal.teacherEvaluation || '')}
                                </div>
                                <div className={`${columnWidths[6]} py-2 px-2 flex justify-center items-center`}>
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modules, setModules] = useState<Module[]>([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await goalService.getModules();
                setModules(response || []);
            } catch (error) {
                console.error('Fetch modules error:', error);
                toast.error('Failed to load modules. Please try again.');
                setModules([]);
            }
        };

        fetchModules();
    }, []);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await goalService.getGoals();
                const goals = response.data;

                const groupedGoals: Record<string, Goal[]> = {
                    S1: [],
                    S2: [],
                    S3: [],
                    S4: [],
                    S5: [],
                    S6: [],
                };

                goals.forEach((goal) => {
                    if (groupedGoals[goal.semester]) {
                        groupedGoals[goal.semester].push(goal);
                    }
                });

                setGoalsBySemester(groupedGoals);
            } catch (error) {
                console.error('Fetch goals error:', error);
                toast.error('Failed to load goals. Please try again.');
            }
        };

        fetchGoals();
    }, []);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<AddGoalPayload>({
        defaultValues: {
            student_id: user?.id,
            semester: selectedSemester,
            modules_id: 0,
            course: '',
            courseExpectation: '',
            teacherExpectation: '',
            selfExpectation: '',
            studentEvaluation: '',
            teacherEvaluation: '',
        },
    });

    const onSubmit = async (data: AddGoalPayload) => {
        try {
            data.semester = selectedSemester;
            if (!data.modules_id || data.modules_id === 0) {
                toast.error('Please select a module.');
                return;
            }
            const { studentEvaluation, teacherEvaluation, ...payload } = data;
            const response = await goalService.addGoal(payload);
            const addedGoal: Goal = {
                ...response.data,
                studentEvaluation: '',
                teacherEvaluation: '',
            };

            setGoalsBySemester((prev) => ({
                ...prev,
                [selectedSemester]: [...prev[selectedSemester], addedGoal],
            }));
            toast.success('Goal added successfully!');
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Add goal error:', error);
            toast.error('Failed to add goal. Please try again.');
        }
    };

    const updateGoals = (newGoals: Goal[]) => {
        setGoalsBySemester((prev) => ({
            ...prev,
            [selectedSemester]: newGoals,
        }));
    };

    return (
        <div className="w-full bg-white border border-gray-200 overflow-hidden">
            <div className="relative bg-white rounded-2xl shadow-md p-6 min-h-[700px]">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-3">
                        {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map((sem) => (
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
                        onClick={() => setIsModalOpen(true)}
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
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={() => setIsModalOpen(false)}
                        />

                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Add New Goal
                            </h2>
                            <div className="h-0.5 bg-gray-100 mb-6" />

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Module <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register('modules_id', { required: 'Module is required', valueAsNumber: true })}
                                        className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value="0">Select a module</option>
                                        {modules.map((module) => (
                                            <option key={module.id} value={module.id}>
                                                {module.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.modules_id && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.modules_id.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Course <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('course', { required: 'Course is required' })}
                                        className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        placeholder="Enter course name"
                                    />
                                    {errors.course && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.course.message}
                                        </p>
                                    )}
                                </div>

                                {/* Course Expectation */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Course Expectation <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register('courseExpectation', {
                                            required: 'Course expectation is required',
                                        })}
                                        className="w-full h-20 p-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                                        placeholder="What do you expect from the course?"
                                    />
                                    {errors.courseExpectation && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.courseExpectation.message}
                                        </p>
                                    )}
                                </div>

                                {/* Teacher Expectation */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Teacher Expectation <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register('teacherExpectation', {
                                            required: 'Teacher expectation is required',
                                        })}
                                        className="w-full h-20 p-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                                        placeholder="What do you expect from the teacher?"
                                    />
                                    {errors.teacherExpectation && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.teacherExpectation.message}
                                        </p>
                                    )}
                                </div>

                                {/* Self Expectation */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Self Expectation <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register('selfExpectation', {
                                            required: 'Self expectation is required',
                                        })}
                                        className="w-full h-20 p-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                                        placeholder="What do you expect from yourself?"
                                    />
                                    {errors.selfExpectation && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.selfExpectation.message}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] rounded-lg hover:from-[#21BAEA] hover:to-[#1AA8D5] focus:outline-none focus:ring-2 focus:ring-[#21BAEA] transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default StudentSemesterGoalPage;