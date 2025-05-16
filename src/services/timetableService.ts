import axiosClient from './axiosClient';

export const getEvents = async (user_id: number) => {
  const response = await axiosClient.get(`/timetables?user_id=${user_id}`);
  return response.data.data;
};

export const createEvent = async (eventData: any, user_id: number) => {
  const formattedData = {
    ...eventData,
    user_id,
    all_day: eventData.allDay,
    start: new Date(eventData.start).toISOString(),
    end: new Date(eventData.end).toISOString(),
    color: eventData.color || '#3b82f6',
  };
  
  const response = await axiosClient.post('/timetables', formattedData);
  return response.data.data;
};

export const updateEvent = async (id: number, eventData: any, user_id: number) => {
  const formattedData = {
    ...eventData,
    user_id,
    all_day: eventData.allDay,
    start: new Date(eventData.start).toISOString(),
    end: new Date(eventData.end).toISOString(),
    color: eventData.color || '#3b82f6',
  };
  
  const response = await axiosClient.put(`/timetables/${id}`, formattedData);
  return response.data.data;
};

export const deleteEvent = async (id: number, user_id: number) => {
  await axiosClient.delete(`/timetables/${id}?user_id=${user_id}`);
  return id;
};