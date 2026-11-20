import api from './api';

export const experimentService = {
  createExperiment: (data) => api.post('/experiments', data),
  getExperiments: (businessId) => api.get(`/experiments/${businessId}`),
  updateExperiment: (id, data) => api.patch(`/experiments/${id}`, data)
};
