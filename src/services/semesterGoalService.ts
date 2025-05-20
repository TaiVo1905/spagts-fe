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
    getAll: async (studentId: number, semester: number) => {
        const response = await axiosClient.get(`semesterGoals?studentId=${studentId}&semester=${semester}`);
        return response.data;
    },
    add: async (studentId: number, data: SemesterGoal) => {
        const response = await axiosClient.post(`users/${studentId}/semesterGoals`, {
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
    delete: async (id: number) => {
        const response = await axiosClient.delete(`semesterGoals/${id}`);
        return response.data;
    },
    update: async (id: number, data: SemesterGoal) => {
        const response = await axiosClient.patch(`semesterGoals/${id}`, data);
        return response.data;
    },
};

export default semesterGoalService;