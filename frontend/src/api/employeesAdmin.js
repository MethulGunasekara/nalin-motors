import axiosClient from './axiosClient';

export const getAllEmployees = () => axiosClient.get('/employees');
export const createEmployee = (data) => axiosClient.post('/employees', data);
export const updateEmployee = (id, data) => axiosClient.patch(`/employees/${id}`, data);