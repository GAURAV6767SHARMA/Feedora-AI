import api from './api';

export const analysisService = {
  runAnalysis: (businessId, forceAll = false) => api.post('/analysis/run', { businessId, forceAll }),
  getSummary: (businessId) => api.get(`/analysis/summary/${businessId}`),
  getTrends: (businessId) => api.get(`/analysis/trends/${businessId}`),
};
