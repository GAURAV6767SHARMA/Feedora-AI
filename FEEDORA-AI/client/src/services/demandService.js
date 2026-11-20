import api from './api';

export const demandService = {
  getDemandRadar: (businessId) => api.get(`/demand/${businessId}`),
};
