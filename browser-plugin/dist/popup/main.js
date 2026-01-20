import { api } from './api.js';
import { state } from './state.js';
import { ui } from './ui.js';
// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const admin = await state.getStoredAdmin();
    if (admin) {
        ui.showScreen('dashboard');
        loadCustomers();
    }
});
// Login Logic
ui.loginBtn.addEventListener('click', async () => {
    const email = ui.emailInput.value;
    const pin = ui.pinInput.value;
    if (!email || !pin) {
        ui.loginError.textContent = 'Please enter both email and PIN';
        return;
    }
    ui.loginBtn.disabled = true;
    ui.loginError.textContent = '';
    try {
        const result = await api.login(email, pin);
        if (result.success) {
            const adminId = result.id || email;
            await state.setAdmin(email, adminId);
            ui.showScreen('dashboard');
            loadCustomers();
        }
        else {
            ui.loginError.textContent = result.error || 'Login failed';
        }
    }
    catch (error) {
        ui.loginError.textContent = 'Server connection failed';
    }
    finally {
        ui.loginBtn.disabled = false;
    }
});
// Logout Logic
ui.logoutBtn.addEventListener('click', async () => {
    await state.clearAdmin();
    ui.showScreen('login');
});
// Search Logic
ui.searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length > 2) {
        ui.setLoading(true, 'Searching...');
        const result = await api.searchCustomers(query);
        if (result.success) {
            ui.renderCustomers(result.data, showOverlay);
        }
    }
    else if (query.length === 0) {
        loadCustomers();
    }
});
async function loadCustomers() {
    const admin = state.getAdmin();
    if (!admin)
        return;
    ui.setLoading(true);
    try {
        const result = await api.fetchCustomers(admin.adminId);
        if (result.success) {
            ui.renderCustomers(result.data, showOverlay);
        }
        else {
            ui.customerList.innerHTML = `<div class="empty-state">Error: ${result.error}</div>`;
        }
    }
    catch (error) {
        ui.customerList.innerHTML = '<div class="empty-state">Failed to load customers</div>';
    }
}
async function showOverlay(customer) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
        try {
            await chrome.tabs.sendMessage(tab.id, { action: 'showOverlay', data: customer });
            ui.statusMsg.textContent = 'Overlay shown!';
            ui.statusMsg.className = 'success';
            setTimeout(() => ui.statusMsg.textContent = '', 3000);
        }
        catch (error) {
            console.error('Message error:', error);
            ui.statusMsg.textContent = 'Please refresh the webpage to enable the overlay.';
            ui.statusMsg.className = 'error';
        }
    }
    else {
        ui.statusMsg.textContent = 'No active tab found';
        ui.statusMsg.className = 'error';
    }
}
