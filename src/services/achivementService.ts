import axiosClient from './axiosClient';

import { Certificate } from '../interface/Interface';


export interface CertificatePayload {
  id: number;
  imageUrl: string;
  module: string;
  date: Date;
  description: string;
}

const achivementService = {
  getCertificates: () => axiosClient.get<Certificate[]>('/achievements'),

  addCertificate: (data: CertificatePayload) => axiosClient.post('/achievements', data),
  deleteCertificate: async (cerId: number) => {
    try {
      const response = await axiosClient.delete(`/achievements/${cerId}`);
      return response.data;
    } catch (error) {
      console.error('Delete Certificate error:', error);
      throw error;
    }
  },
  updateCertificate: async (cerId: number, data: { imageUrl?: string; module?: string ; date?: Date; description?: String}) => {
    try {
        const response = await axiosClient.patch(`/achievements/${cerId}`, data);
        return response.data;
    } catch (error) {
        console.error('Update Certificate error:', error);
        throw error;
    }
},};
export default achivementService;