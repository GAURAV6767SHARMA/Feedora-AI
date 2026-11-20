import api from './api';

export const advisorService = {
  generateRecommendations: (businessId) => api.post('/advisor/generate', { businessId }),
  getRecommendations: (businessId) => api.get(`/recommendations/${businessId}`),
  updateStatus: (id, status) => api.patch(`/recommendations/status/${id}`, { status }),
};
