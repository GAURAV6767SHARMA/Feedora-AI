import api from './api';

export const settingsService = {
  getSettings: () => api.get('/settings'),
  updateGeminiKey: (apiKey, model) => api.post('/settings/gemini-key', { apiKey, model }),
  exportData: (businessId) => api.get(`/settings/export/${businessId}`)
};
