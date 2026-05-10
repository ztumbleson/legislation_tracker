const API_BASE = 'http://localhost:3000';

const api = {
  // --- Legislators ---

  async getLegislators() {
    const res = await fetch(`${API_BASE}/legislators`);
    if (!res.ok) throw new Error('Failed to fetch legislators');
    return res.json();
  },

  async createLegislator(data) {
    const res = await fetch(`${API_BASE}/legislators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create legislator');
    }
    return res.json();
  },

  async updateLegislator(id, data) {
    const res = await fetch(`${API_BASE}/legislators/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update legislator');
    }
    return res.json();
  },

  async deleteLegislator(id) {
    const res = await fetch(`${API_BASE}/legislators/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete legislator');
  },

  async getLegislationByLegislator(id) {
    const res = await fetch(`${API_BASE}/legislators/${id}/legislation`);
    if (!res.ok) throw new Error('Failed to fetch sponsored legislation');
    return res.json();
  },

  // --- Legislation ---

  async getLegislation() {
    const res = await fetch(`${API_BASE}/legislation`);
    if (!res.ok) throw new Error('Failed to fetch legislation');
    return res.json();
  },

  async createLegislation(data) {
    const res = await fetch(`${API_BASE}/legislation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create legislation');
    }
    return res.json();
  },

  async updateLegislation(id, data) {
    const res = await fetch(`${API_BASE}/legislation/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update legislation');
    }
    return res.json();
  },

  async deleteLegislation(id) {
    const res = await fetch(`${API_BASE}/legislation/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete legislation');
  },
};

export default api;
