import axiosClient from './axiosClient';

export interface WeekGoal {
  id?: number;
  start_date: string;
  end_date: string;
  goal_content: string;
  is_completed: boolean;
  user_id: number;
}

const WeekGoalService = {
  getAll: async (params?: Record<string, any>): Promise<WeekGoal[]> => {
    const response = await axiosClient.get('/weekly-goals', { params });
    return response.data.data; 
  },

  getById: async (id: number): Promise<WeekGoal> => {
    const response = await axiosClient.get(`/weekly-goals/${id}`);
    return response.data;
  },

  create: async (data: Omit<WeekGoal, 'id'>): Promise<WeekGoal> => {
    const response = await axiosClient.post('/weekly-goals', data);
    return response.data;
  },

 patch: async (id: number, data: Partial<WeekGoal>): Promise<WeekGoal> => {
  const response = await axiosClient.patch(`/weekly-goals/${id}`, data);
  return response.data;
},

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/weekly-goals/${id}`);
  },
};

export default WeekGoalService;
