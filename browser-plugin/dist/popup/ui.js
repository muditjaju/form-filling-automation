export const ui = {
    loginScreen: document.getElementById('login-screen'),
    dashboardScreen: document.getElementById('dashboard-screen'),
    emailInput: document.getElementById('email'),
    pinInput: document.getElementById('pin'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    loginError: document.getElementById('login-error'),
    customerList: document.getElementById('customer-list'),
    searchInput: document.getElementById('search-input'),
    statusMsg: document.getElementById('status-msg'),
    showScreen(screen) {
        if (screen === 'login') {
            this.loginScreen.classList.remove('hidden');
            this.dashboardScreen.classList.add('hidden');
        }
        else {
            this.loginScreen.classList.add('hidden');
            this.dashboardScreen.classList.remove('hidden');
        }
    },
    renderCustomers(customers, onSelect) {
        if (!customers || customers.length === 0) {
            this.customerList.innerHTML = '<div class="empty-state">No customers found</div>';
            return;
        }
        this.customerList.innerHTML = '';
        customers.forEach(customer => {
            const div = document.createElement('div');
            div.className = 'customer-item';
            div.innerHTML = `
        <div class="customer-name">${customer.id || 'N/A'}</div>
        <div class="customer-email">${customer.email}</div>
      `;
            div.onclick = () => onSelect(customer);
            this.customerList.appendChild(div);
        });
    },
    setLoading(isLoading, message = 'Loading...') {
        if (isLoading) {
            this.customerList.innerHTML = `<div class="empty-state">${message}</div>`;
        }
    }
};
