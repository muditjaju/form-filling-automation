// export const API_BASE_URL = 'http://localhost:3000/api';
export const API_BASE_URL = 'https://form-filling-automation.vercel.app/api';

export interface Customer {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

export const api = {
  async login(email: string, pin: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pin, role: 'admin' })
    });
    return await response.json();
  },

  async fetchCustomers(adminId: string) {
    const response = await fetch(`${API_BASE_URL}/customers?admin_id=${adminId}&status=IN_PROGRESS`);
    return await response.json();
  },

  async searchCustomers(emailQuery: string) {
    const response = await fetch(`${API_BASE_URL}/customers/search?email=${emailQuery}`);
    return await response.json();
  }
};
