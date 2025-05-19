import axiosClient from './axiosClient';

export interface Module {
    id: number;
    name: string;
}

const moduleService = {
    getModules: async () => {
        const response = await axiosClient.get('/modules');
        return response.data;
    },
    addModule: async (data: Module) => {
        const response = await axiosClient.post('/modules', data);
        return response.data;
    },
    deleteModule: async (id: number) => {
        const response = await axiosClient.delete(`/modules/${id}`);
        return response.data;
    },
    updateModule: async (id: number, data: Module) => {
        const response = await axiosClient.patch(`/modules/${id}`, data);
        return response.data;
    },
};

export default moduleService;