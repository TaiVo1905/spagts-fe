import axiosClient from './axiosClient';

export const studentService = {
    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('imageUrl', file);
        console.log('Sending file:', file.name);
        try {
            axiosClient.post("/users/1", { "imageUrl": file }
            )
                .then(res => {
                    console.log('Response:', res.data);
                    return res.data.imageUrl;
                })
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    },

    updateProfile: async (userId: number, data: { name?: string; email?: string }) => {
        try {
            const response = await axiosClient.patch(`/users/${userId}`, data);
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },
};