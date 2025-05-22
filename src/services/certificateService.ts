import axiosClient from './axiosClient';

export interface CertificatePayload {
  studentId?: number;
  semester: number;
  imageUrl: File | null;
  module: string;
  date: Date | string;
  description: string;
}

const certificateService = {
  getAll: async(studentId: number, semester: number) => {
    return (await axiosClient.get(`/achievements?studentId=${studentId}&semester=${semester}`)).data
  },

  add: async(data: CertificatePayload) => {
    return (await axiosClient.post('/achievements', data)).data;
  },

  delete: async (cerId: number) => {
    const response = await axiosClient.delete(`/achievements/${cerId}`);
    return response.data;
  },

  update: async (id: number, data: FormData) => {
    return (await axiosClient.post(`/achievements/${id}`, data)).data;
  },
};

export default certificateService;