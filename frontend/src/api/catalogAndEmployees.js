import axiosClient from './axiosClient';

export const getServiceCatalog = () => axiosClient.get('/service-catalog');
export const getEmployeesByRole = (role) => axiosClient.get('/employees', { params: { role } });