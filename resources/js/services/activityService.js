import api from './api';

export const activityService = {
  async getActivities(dealId, filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/projects/${dealId}/tasks?${params}`);
    return response.data.tasks;
  },

  async getActivity(dealId, activityId) {
    const response = await api.get(`/projects/${dealId}/tasks/${activityId}`);
    return response.data.task;
  },

  async createActivity(dealId, activityData) {
    const response = await api.post(`/projects/${dealId}/tasks`, activityData);
    return response.data;
  },

  async updateActivity(dealId, activityId, activityData) {
    const response = await api.put(`/projects/${dealId}/tasks/${activityId}`, activityData);
    return response.data;
  },

  async deleteActivity(dealId, activityId) {
    const response = await api.delete(`/projects/${dealId}/tasks/${activityId}`);
    return response.data;
  },

  async getMyActivities() {
    const response = await api.get('/my-tasks');
    return response.data.tasks;
  },

  async getComments(activityId) {
    const response = await api.get(`/tasks/${activityId}/comments`);
    return response.data.comments;
  },

  async addComment(activityId, content) {
    const response = await api.post(`/tasks/${activityId}/comments`, { content });
    return response.data;
  },
};