import api from './api';

export const growthService = {
  getGrowthData: (businessId) => api.get(`/growth/${businessId}`),
};
