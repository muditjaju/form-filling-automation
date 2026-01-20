import { Customer } from './api';

export const ui = {
  loginScreen: document.getElementById('login-screen') as HTMLDivElement,
  dashboardScreen: document.getElementById('dashboard-screen') as HTMLDivElement,
  emailInput: document.getElementById('email') as HTMLInputElement,
  pinInput: document.getElementById('pin') as HTMLInputElement,
  loginBtn: document.getElementById('login-btn') as HTMLButtonElement,
  logoutBtn: document.getElementById('logout-btn') as HTMLButtonElement,
  loginError: document.getElementById('login-error') as HTMLDivElement,
  customerList: document.getElementById('customer-list') as HTMLDivElement,
  searchInput: document.getElementById('search-input') as HTMLInputElement,
  statusMsg: document.getElementById('status-msg') as HTMLDivElement,

  showScreen(screen: 'login' | 'dashboard') {
    if (screen === 'login') {
      this.loginScreen.classList.remove('hidden');
      this.dashboardScreen.classList.add('hidden');
    } else {
      this.loginScreen.classList.add('hidden');
      this.dashboardScreen.classList.remove('hidden');
    }
  },

  renderCustomers(customers: Customer[], onSelect: (c: Customer) => void) {
    if (!customers || customers.length === 0) {
      this.customerList.innerHTML = '<div class="empty-state">No customers found</div>';
      return;
    }

    this.customerList.innerHTML = '';
    customers.forEach(customer => {
      const div = document.createElement('div');
      div.className = 'customer-item';
      div.innerHTML = `
        <div class="customer-name">${customer.name || 'N/A'}</div>
        <div class="customer-email">${customer.email}</div>
      `;
      div.onclick = () => onSelect(customer);
      this.customerList.appendChild(div);
    });
  },

  setLoading(isLoading: boolean, message: string = 'Loading...') {
    if (isLoading) {
      this.customerList.innerHTML = `<div class="empty-state">${message}</div>`;
    }
  }
};
