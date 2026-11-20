import api from './api';

export const businessService = {
  getBusinesses: () => api.get('/businesses'),
  getBusinessById: (id) => api.get(`/businesses/${id}`),
  createBusiness: (data) => api.post('/businesses', data),
  updateBusiness: (id, data) => api.patch(`/businesses/${id}`, data),
  resetDemo: () => api.post('/businesses/demo/reset'),
  seedDataset: (datasetType) => api.post(`/businesses/seed/${datasetType}`),
  getHealth: () => {
    const healthUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/health` : '/api/health';
    return fetch(healthUrl).then(r => r.json());
  }
};

export default businessService;
