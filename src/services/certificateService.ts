import axiosClient from './axiosClient';
import { Certificate } from '../interface/Interface';

export interface CertificatePayload {
  id?: number;
  imageUrl: File | string;
  module: string;
  date: Date | string;
  description: string;
}

const certificateService = {
  getCertificates: () => axiosClient.get<Certificate[]>('/achievements'),

  addCertificate: (data: CertificatePayload) => {
    const formData = new FormData();
    if (data.imageUrl instanceof File) {
      formData.append('imageUrl', data.imageUrl);
    }
    formData.append('module', data.module);
    formData.append('date', data.date.toString());
    formData.append('description', data.description);
    return axiosClient.post('/achievements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteCertificate: async (cerId: number) => {
    try {
      const response = await axiosClient.delete(`/achievements/${cerId}`);
      return response.data;
    } catch (error) {
      console.error('Delete Certificate error:', error);
      throw error;
    }
  },

  updateCertificate: async (cerId: number, data: CertificatePayload) => {
    try {
      const formData = new FormData();
      if (data.imageUrl instanceof File) {
        formData.append('imageUrl', data.imageUrl);
      }
      if (data.module) formData.append('module', data.module);
      if (data.date) formData.append('date', data.date.toString());
      if (data.description) formData.append('description', data.description);

      const response = await axiosClient.patch(`/achievements/${cerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update Certificate error:', error);
      throw error;
    }
  },
};

export default certificateService;