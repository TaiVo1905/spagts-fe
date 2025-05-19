import axiosClient from './axiosClient';

export interface SemesterGoal {
    id?: number;
    studentId?: number;
    semester: number;
    moduleId: number;
    course?: string;
    courseExpectation: string;
    teacherExpectation: string;
    selfExpectation: string;
    studentEvaluation?: string; 
    teacherEvaluation?: string; 
}

const semesterGoalService = {
    getSemesterGoals: async (studentId: number, semester: number) => {
        const response = await axiosClient.get(`users/${studentId}/goals?semester=${semester}`);
        return response.data;
    },
    addSemesterGoal: async (studentId: number, data: SemesterGoal) => {
        const response = await axiosClient.post(`users/${studentId}/goals`, {
            studentId,
            moduleId: data.moduleId,
            semester: data.semester,
            courseExpectation: data.courseExpectation,
            teacherExpectation: data.teacherExpectation,
            selfExpectation: data.selfExpectation,
            studentEvaluation: data.studentEvaluation,
            teacherEvaluation: data.teacherEvaluation
        });
        return response.data;
    },
    deleteSemesterGoal: async (id: number) => {
        const response = await axiosClient.delete(`goals/${id}`);
        return response.data;
    },
    updateSemesterGoal: async (id: number, data: SemesterGoal) => {
        const response = await axiosClient.patch(`goals/${id}`, data);
        return response.data;
    },
};

export default semesterGoalService;