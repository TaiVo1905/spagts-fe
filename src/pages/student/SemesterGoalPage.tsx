import React, { useState, useEffect } from 'react';
import "../../styles/App.css";
import semesterGoalService, { SemesterGoal } from '../../services/semesterGoalService';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../store/AuthContext';
import moduleService, { Module } from '../../services/moduleService';
import { useRole } from '../../utils/useRole';
import CommentPopover from '../../components/CommentPopover';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../../services/firebaseService';
import { useParams, useLocation } from 'react-router-dom';

const initialGoalsBySemester: Record<string, SemesterGoal[]> = {
    S1: [], S2: [], S3: [], S4: [], S5: [], S6: [],
};

const headers = ['Course', 'What I expect from the course', 'What I expect from the teacher & instructor', 
                'What I expect from myself', "Student's evaluation", "Teacher's evaluation", 'Actions'];

const columnWidths = ['min-w-[200px]', 'min-w-[350px]', 'min-w-[380px]', 'min-w-[350px]', 
                     'min-w-[350px]', 'min-w-[350px]', 'min-w-[60px]'];

const StudentSemesterGoal: React.FC<{ 
    semester: number; 
    goals: SemesterGoal[]; 
    setGoals: (goals: SemesterGoal[]) => void 
}> = ({ semester, goals, setGoals }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [editingCell, setEditingCell] = useState<{ index: number; field: keyof SemesterGoal } | null>(null);
    const [tempValue, setTempValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState<{ index: number; field: keyof SemesterGoal } | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [commentPopover, setCommentPopover] = useState<{
        isOpen: boolean;
        position: { top: number; left: number };
        commentableType: string;
        commentableId: number;
        fieldName: string;
        row: number;
        semester: number;
    } | null>(null);
    const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
    const { isStudent } = useRole();

    useEffect(() => {
        if (!user) return;

        const unsubscribeCallbacks: (() => void)[] = [];

        goals.forEach((goal, index) => {
            ['course', 'courseExpectation', 'teacherExpectation', 'selfExpectation', 'studentEvaluation', 'teacherEvaluation'].forEach((field) => {
                
                const path = `comments/App\\Models\\SemesterGoal/${goal.id}/${field}/${index}`;
                const commentsRef = ref(database, path);
                
                const unsubscribe = onValue(commentsRef, (snapshot) => {
                    const commentsData = snapshot.val();
                    const count = commentsData ? Object.keys(commentsData).length : 0;
                    
                    setCommentsCount(prev => ({
                        ...prev,
                        [`${goal.id}-${field}-${index}`]: count
                    }));
                });

                unsubscribeCallbacks.push(() => off(commentsRef));
            });
        });

        return () => unsubscribeCallbacks.forEach(unsub => unsub());
    }, [goals, user]);

    
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const shouldHighlight = searchParams.get('highlight') === 'true';
        const fieldName = searchParams.get('field');
        const row = searchParams.get('row');

        if (shouldHighlight && fieldName && row !== null) {
            const rowIndex = parseInt(row);
            const goal = goals[rowIndex];
            if (goal?.id !== undefined) {
                const iconId = `comment-icon-${goal.id}-${fieldName}-${rowIndex}`;
                const icon = document.getElementById(iconId);
                if (icon) {
                    const rect = icon.getBoundingClientRect();
                    setCommentPopover({
                        isOpen: true,
                        position: { top: rect.bottom, left: rect.left },
                        commentableType: 'App\\Models\\SemesterGoal',
                        commentableId: goal.id as number,
                        fieldName,
                        row: rowIndex,
                        semester: semester
                    });
                }
            }
        }
    }, [location.search, goals]);

    const handleDoubleClick = (index: number, field: keyof SemesterGoal, value: string) => {
        if (!isStudent) return;
        setEditingCell({ index, field });
        setTempValue(value);
    };

    const saveChanges = async () => {
        if (!editingCell || !user) return;

        const { index, field } = editingCell;
        const goal = goals[index];
        if (!goal?.id || goal.semester === undefined) return;

        if (tempValue !== (goal[field] || '')) {
            setIsSaving({ index, field });
            try {
                const updateData = {
                    ...goal,
                    [field]: tempValue
                };
                await semesterGoalService.update(goal.id, updateData);
                const updatedGoals = goals.map((g, i) => i === index ? { ...g, [field]: tempValue } : g);
                setGoals(updatedGoals);
                toast.success('Goal updated successfully!');
            } catch (error) {
                console.error('Update goal error:', error);
                toast.error('Failed to update goal. Please try again.');
            } finally {
                setIsSaving(null);
            }
        }
        setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveChanges();
        } else if (e.key === 'Escape') {
            setEditingCell(null);
        }
    };

    const handleDelete = async (index: number) => {
        const goal = goals[index];
        if (!goal.id || !user) return;

        if (window.confirm('Are you sure you want to delete this goal?')) {
            setIsDeleting(index);
            try {
                await semesterGoalService.delete(goal.id);
                setGoals(goals.filter((_, i) => i !== index));
                toast.success('Goal deleted successfully!');
            } catch (error) {
                console.error('Delete goal error:', error);
                toast.error('Failed to delete goal. Please try again.');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const renderCell = (index: number, field: keyof SemesterGoal, value: string | number) => {
        const isEditing = editingCell?.index === index && editingCell?.field === field;
        const isSavingCell = isSaving?.index === index && isSaving?.field === field;
        const goal = goals[index];
        if (!goal?.id || goal.semester === undefined) return null;
        
        const commentCount = commentsCount[`${goal.id}-${field}-${index}`] || 0;
        const iconId = `comment-icon-${goal.id}-${field}-${index}`;

        if (isEditing && isStudent) {
            return field === 'course' ? (
                <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={saveChanges}
                    onKeyDown={handleKeyDown}
                    disabled={isSavingCell}
                    className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                    autoFocus
                />
            ) : (
                <textarea
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={saveChanges}
                    onKeyDown={handleKeyDown}
                    disabled={isSavingCell}
                    className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                    rows={3}
                    autoFocus
                />
            );
        }

        return (
            <div className="relative group h-full">
                <div
                    onDoubleClick={() => handleDoubleClick(index, field, value.toString())}
                    className="cursor-pointer hover:bg-gray-100 hover:border-dashed hover:border-gray-300 min-h-[3rem] flex items-center text-[#1B1B1F] h-full p-2"
                >
                    {isSavingCell ? (
                        <div className="flex items-center justify-center w-full">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving...
                        </div>
                    ) : (
                        value || '-'
                    )}
                </div>
                
                <button
                    id={iconId}
                    onClick={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setCommentPopover({
                            isOpen: true,
                            position: { 
                                top: rect.bottom + window.scrollY, 
                                left: rect.left + window.scrollX 
                            },
                            commentableType: 'App\\Models\\SemesterGoal',
                            commentableId: goal.id as number,
                            fieldName: field,
                            row: index,
                            semester: semester
                        });
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
                
                {commentCount > 0 && (
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
            {commentPopover?.isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setCommentPopover(null)}
                >
                    <div 
                        className="absolute z-50"
                        style={{
                            top: `${commentPopover.position.top}px`,
                            left: `${commentPopover.position.left}px`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CommentPopover
                            commentableType={commentPopover.commentableType}
                            commentableId={commentPopover.commentableId}
                            fieldName={commentPopover.fieldName}
                            row={commentPopover.row}
                            onClose={() => setCommentPopover(null)}
                            semester={commentPopover.semester}
                        />
                    </div>
                </div>
            )}
            
            <div className="overflow-x-auto max-w-full max-h-[580px] overflow-y-auto scrollbar-hide">
                <div className="min-w-fit">
                    <div className="flex text-sm font-semibold text-[#21BAEA] bg-[#f9fcff] border-b border-gray-200 sticky top-0 z-10">
                        {headers.map((label, idx) => {
                            const field = ['course', 'courseExpectation', 'teacherExpectation', 'selfExpectation', 'studentEvaluation', 'teacherEvaluation'][idx];
                            const commentCount = Object.entries(commentsCount)
                                .filter(([key]) => key.startsWith(`${field}-`))
                                .reduce((sum, [, count]) => sum + count, 0);
                            
                            return (
                                <div key={idx} className={`${columnWidths[idx]} py-3 px-4 border-r last:border-none flex justify-center items-center whitespace-nowrap`}>
                                    {label}
                                    {commentCount > 0 && (
                                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                            {commentCount}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {goals.length === 0 ? (
                        <div className="py-10 text-start pl-10 text-gray-500">
                            No goals yet. {isStudent && "Click"} <span className="text-[#21BAEA]">{isStudent && "Add new goal"}</span> {isStudent && "to start!"}
                        </div>
                    ) : (
                        goals.map((goal, index) => (
                            <div key={index} className={`flex text-sm text-[#1B1B1F] border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-[#F7FBFC]' : 'bg-white'}`}>
                                {['course', 'courseExpectation', 'teacherExpectation', 'selfExpectation', 'studentEvaluation', 'teacherEvaluation'].map((field, i) => (
                                    <div key={i} className={`${columnWidths[i]} py-3 px-4 break-words whitespace-normal`}>
                                        {renderCell(index, field as keyof SemesterGoal, goal[field as keyof SemesterGoal] || '')}
                                    </div>
                                ))}
                                {isStudent && <div className={`${columnWidths[6]} py-2 px-2 flex justify-center items-center`}>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        disabled={isDeleting === index}
                                        className="inline-block cursor-pointer mx-auto px-2 py-1 text-sm bg-red-50 text-[#EF4444] rounded-md hover:bg-red-100 hover:text-red-700 hover:shadow-sm transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting === index ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>Delete</>
                                        )}
                                    </button>
                                </div>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const SemesterGoalPage: React.FC = () => {
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [goalsBySemester, setGoalsBySemester] = useState(initialGoalsBySemester);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modules, setModules] = useState<Module[]>([]);
    const [loadedSemesters, setLoadedSemesters] = useState<Set<number>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    let { id: studentId } = useParams<{ id: string }>();
    if (!studentId && user) {
        studentId = String(user.id);
    }
    const { isStudent } = useRole();


    useEffect(() => {
        const initializeData = async () => {
            try {
                const { data } = await moduleService.getUserModules(Number(studentId));
                setModules(data || []);
            } catch (error) {
                console.error('Fetch modules error:', error);
                toast.error('Failed to load modules.');
            }
            
            if (user) {
                fetchGoalsForSemester(1);
            }
        };

        initializeData();
    }, [user]);

    const fetchGoalsForSemester = async (semester: number) => {
        if (!user || loadedSemesters.has(semester)) return;

        try {
            const { data } = await semesterGoalService.getAll(Number(studentId) || user.id, semester);
            setGoalsBySemester(prev => ({ 
                ...prev, 
                [`S${semester}`]: data || [] 
            }));
            setLoadedSemesters(prev => new Set(prev).add(semester));
        } catch (error) {
            console.error(`Fetch goals for semester ${semester} error:`, error);
            toast.error(`Failed to load goals for semester ${semester}.`);
        }
    };

    const handleSemesterChange = (semester: number) => {
        setSelectedSemester(semester);
        fetchGoalsForSemester(semester);
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm<SemesterGoal>({
        defaultValues: {
            studentId: user?.id,
            semester: selectedSemester,
            moduleId: 0,
            course: '',
            courseExpectation: '',
            teacherExpectation: '',
            selfExpectation: '',
        },
    });

    const onSubmit = async (data: SemesterGoal) => {
        if (!data.moduleId || !user) {
            toast.error('Please select a module.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { data: addedGoal } = await semesterGoalService.add(Number(studentId), {
                ...data,
                semester: selectedSemester,
            });
            
            setGoalsBySemester(prev => ({
                ...prev,
                [`S${selectedSemester}`]: [...prev[`S${selectedSemester}`], addedGoal],
            }));
            
            toast.success('Goal added successfully!');
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Add goal error:', error);
            toast.error('Failed to add goal.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateGoals = (newGoals: SemesterGoal[]) => {
        setGoalsBySemester(prev => ({ ...prev, [`S${selectedSemester}`]: newGoals }));
    };

    return (
        <div className="w-full bg-white border border-gray-200 overflow-hidden">
            <div className="relative bg-white rounded-2xl shadow-md p-6 min-h-[700px]">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-3">
                        {[1, 2, 3, 4, 5, 6].map((sem) => (
                            <button
                                key={sem}
                                onClick={() => handleSemesterChange(sem)}
                                className={`px-6 py-2 text-sm cursor-pointer font-semibold rounded-xl transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA] ${
                                    selectedSemester === sem
                                        ? 'bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                S{sem}
                            </button>
                        ))}
                    </div>
                    {isStudent && <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center cursor-pointer space-x-2 bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] text-white px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA]"
                    >
                        <span className="text-xl leading-none">＋</span>
                        <span className="text-sm">Add new goal</span>
                    </button>}
                </div>
                <StudentSemesterGoal
                    semester={selectedSemester}
                    goals={goalsBySemester[`S${selectedSemester}`]}
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
                                        {...register('moduleId', { required: 'Module is required', valueAsNumber: true })}
                                        className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value="0">Select a module</option>
                                        {modules.map((module) => (
                                            <option key={module.id} value={module.id}>
                                                {module.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.moduleId && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.moduleId.message}
                                        </p>
                                    )}
                                </div>

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

                                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] rounded-lg hover:from-[#21BAEA] hover:to-[#1AA8D5] focus:outline-none focus:ring-2 focus:ring-[#21BAEA] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SemesterGoalPage;