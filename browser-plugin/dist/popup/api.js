export const API_BASE_URL = 'http://localhost:3000/api';
export const api = {
    async login(email, pin) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pin, role: 'admin' })
        });
        return await response.json();
    },
    async fetchCustomers(adminId) {
        const response = await fetch(`${API_BASE_URL}/customers?admin_id=${adminId}&status=IN_PROGRESS`);
        return await response.json();
    },
    async searchCustomers(emailQuery) {
        const response = await fetch(`${API_BASE_URL}/customers/search?email=${emailQuery}`);
        return await response.json();
    }
};
