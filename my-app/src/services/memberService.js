// API service for member operations
const API_URL = import.meta.env.VITE_API_URL;

export const memberService = {
  async getMembers({ page = 0, pageSize = 5, search = '' } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      size: String(pageSize),
    });

    if (search?.trim()) {
      params.set('search', search.trim());
    }

    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }
    return response.json();
  },

  async createMember(member) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create member');
    }
    
    return response.json();
  },

  async updateMember(id, member) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update member');
    }
    
    return response.json();
  },

  async deleteMember(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete member');
    }
  }
};
