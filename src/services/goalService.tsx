import axiosClient from './axiosClient';

export interface Module {
    id: number;
    name: string;
    teacher_id: number;
}

export interface Goal {
    id?: number;
    userId?: number;
    semester: string;
    modules_id: number;
    course: string;
    courseExpectation: string;
    teacherExpectation: string;
    selfExpectation: string;
    studentEvaluation: string; 
    teacherEvaluation: string; 
}

export interface AddGoalPayload {
    student_id: number,
    semester: string;
    modules_id: number; 
    course: string;
    courseExpectation: string;
    teacherExpectation: string;
    selfExpectation: string;
    studentEvaluation?: string | null;
    teacherEvaluation?: string | null; 
}

interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

const goalService = {
    getGoals: () => axiosClient.get<Goal[]>('/goals'),
    addGoal: (data: AddGoalPayload) => axiosClient.post<Goal>('/goals', data),
    deleteGoal: (id: number) => axiosClient.delete(`/goals/${id}`),
    updateGoal: (id: number, data: Partial<AddGoalPayload>) => axiosClient.patch<Goal>(`/goals/${id}`, data),
    getModules: async () => {
        try {
            const response = await axiosClient.get<PaginatedResponse<Module>>('/modules');
            const modules = response?.data?.data;
            if (!Array.isArray(modules)) {
                console.warn('Expected an array of modules, but received:', modules);
                return [];
            }
            return modules;
        } catch (error) {
            console.error('Failed to fetch modules:', error);
            return [];
        }
    },
};

export default goalService;