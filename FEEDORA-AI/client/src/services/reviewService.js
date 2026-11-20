import api from './api';

export const reviewService = {
  getReviews: (params) => api.get('/reviews', { params }),
  getReviewById: (id) => api.get(`/reviews/${id}`),
  createReview: (data) => api.post('/reviews', data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  uploadCsv: (businessId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('businessId', businessId);
    return api.post('/reviews/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  draftReply: (id, tone) => api.post(`/reviews/${id}/draft-reply`, { tone }),
  saveReply: (id, ownerReply) => api.patch(`/reviews/${id}/reply`, { ownerReply }),
  submitPublicReview: (data) => api.post('/reviews/public', data),
  getUrgentReviews: (businessId) => api.get(`/reviews/urgent/${businessId}`)
};
