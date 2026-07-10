import axiosClient from './axiosClient';

export const getAllAppointments = () => axiosClient.get('/appointments');
export const getTodayAppointments = () => axiosClient.get('/appointments/today');
export const getUpcomingAppointments = () => axiosClient.get('/appointments/upcoming');
export const createAppointment = (data) => axiosClient.post('/appointments', data);
export const updateAppointment = (id, data) => axiosClient.patch(`/appointments/${id}`, data);
export const confirmArrival = (id) => axiosClient.patch(`/appointments/${id}/confirm-arrival`);
export const cancelAppointment = (id) => axiosClient.patch(`/appointments/${id}/cancel`);