import api from './api';

export const marketingService = {
  generateCampaign: (data) => api.post('/marketing/generate', data),
  saveCampaign: (data) => api.post('/campaigns', data),
  getCampaigns: (businessId) => api.get(`/campaigns/${businessId}`),
  updateCampaign: (id, data) => api.patch(`/campaigns/${id}`, data),
};
