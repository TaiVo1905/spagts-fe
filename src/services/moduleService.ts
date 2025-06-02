import axiosClient from './axiosClient';

export interface Module {
    id: number;
    name: string;
    teacher_id?: number;
    classIds: number[];
}

const moduleService = {
    getAll: async () => {
        const response = await axiosClient.get('/modules');
        return response.data;
    },

    get: async (id: number) => {
        const response = await axiosClient.get(`/modules/${id}`);
        return response.data;
    },

    getUserModules: async (userId: number) => {
        const response = await axiosClient.get(`/userModules/?user_id=${userId}&perPage=100`);
        return response.data;
    },

    add: async (data: Module) => {
        const response = await axiosClient.post('/modules', data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosClient.delete(`/modules/${id}`);
        return response.data;
    },

    update: async (id: number, data: Module) => {
        const response = await axiosClient.patch(`/modules/${id}`, data);
        return response.data;
    },

    addClassesToModule: async (moduleId: number, classIds: number[]) => {
        const response = await axiosClient.post(`/modules/${moduleId}/classes`, { classIds });
        return response.data;
    },

    getModuleClasses: async (moduleId: number) => {
        const response = await axiosClient.get(`/modules/${moduleId}/classes`);
        return response.data;
    }
};

export default moduleService;