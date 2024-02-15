import api from './api';

export const taskService = {
  async getTasks(projectId, filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/projects/${projectId}/tasks?${params}`);
    return response.data.tasks;
  },

  async getTask(projectId, taskId) {
    const response = await api.get(`/projects/${projectId}/tasks/${taskId}`);
    return response.data.task;
  },

  async createTask(projectId, taskData) {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data;
  },

  async updateTask(projectId, taskId, taskData) {
    const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
    return response.data;
  },

  async deleteTask(projectId, taskId) {
    const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },

  async getMyTasks() {
    const response = await api.get('/my-tasks');
    return response.data.tasks;
  },

  async getComments(taskId) {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data.comments;
  },

  async addComment(taskId, content) {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },
};