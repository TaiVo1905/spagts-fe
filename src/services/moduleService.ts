import axiosClient from './axiosClient';
import { User } from '../interface/Interface';

export interface Module {
    id?: number;
    name: string;
    teacher_id?: number;
}



const moduleService = {
    getAll: async () => {
        const response = await axiosClient.get('/modules');
        return response.data;
    },
    getUserModules: async (userId: number) => {
        const response = await axiosClient.get(`/userModules/?user_id=${userId}`);
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
    }
};

export default moduleService;