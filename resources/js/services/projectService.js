import api from './api';

export const projectService = {
  // Deals (formerly Projects)
  async getProjects(params = {}) {
    // We use the same 'projects' endpoint for now as mapped in api.php
    const response = await api.get('/projects', { params });
    return response.data.deals || response.data.projects;
  },

  async getProject(id) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(dealData) {
    const response = await api.post('/projects', dealData);
    return response.data;
  },

  async updateProject(id, dealData) {
    const response = await api.put(`/projects/${id}`, dealData);
    return response.data;
  },

  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  async addMember(dealId, userId) {
    const response = await api.post(`/projects/${dealId}/members`, {
      user_id: userId
    });
    return response.data;
  },

  // Contacts
  async getContacts() {
    const response = await api.get('/contacts');
    return response.data.contacts;
  },

  async createContact(contactData) {
    const response = await api.post('/contacts', contactData);
    return response.data;
  }
};