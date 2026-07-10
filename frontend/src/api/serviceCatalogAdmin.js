import axiosClient from './axiosClient';

export const getCatalog = () => axiosClient.get('/service-catalog');
export const createCatalogItem = (data) => axiosClient.post('/service-catalog', data);
export const updateCatalogItem = (id, data) => axiosClient.patch(`/service-catalog/${id}`, data);