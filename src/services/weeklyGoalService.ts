import axiosClient from './axiosClient';

export interface WeeklyGoal {
  id?: number;
  start_date: string;
  end_date: string;
  goal_content: string;
  is_completed: boolean;
  student_id: number;
  semester: number;
}

const WeeklyGoalService = {
  getWeeklyGoals: async (student_id: number, semester: number) => {
    const response = await axiosClient.get(`users/${student_id}/weekly-goals?semester=${semester}`);
    return response.data; 
  },

  getWeeklyGoalById: async (id: number): Promise<WeeklyGoal> => {
    const response = await axiosClient.get(`/weekly-goals/${id}`);
    return response.data;
  },

  addWeeklyGoal: async (student_id: number, data: WeeklyGoal) => {
    const response = await axiosClient.post(`users/${student_id}/weekly-goals`, data);
    return response.data;
  },

 updateWeeklyGoal: async (id: number, data: WeeklyGoal): Promise<WeeklyGoal> => {
  const response = await axiosClient.patch(`/weekly-goals/${id}`, data);
  return response.data;
},

  deleteWeeklyGoal: async (id: number): Promise<void> => {
    await axiosClient.delete(`/weekly-goals/${id}`);
  },
};

export default WeeklyGoalService;
