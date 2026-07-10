import axiosClient from './axiosClient';

export const createServiceCard = (data) => axiosClient.post('/service-cards', data);
export const getServiceCardById = (id) => axiosClient.get(`/service-cards/${id}`);
export const getServiceCards = (params) => axiosClient.get('/service-cards', { params });
export const updateServiceCard = (id, data) => axiosClient.patch(`/service-cards/${id}`, data);
export const updateServiceCardStatus = (id, status) =>
  axiosClient.patch(`/service-cards/${id}/status`, { status });
export const updateChecklistItem = (id, payload) =>
  axiosClient.patch(`/service-cards/${id}/checklist`, payload);