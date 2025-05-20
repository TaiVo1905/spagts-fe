import axiosClient from './axiosClient';

export interface Module {
    id: number;
    name: string;
}

const moduleService = {
    getAll: async () => {
        const response = await axiosClient.get('/modules');
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
};

export default moduleService;