export interface AdminState {
  email: string;
  adminId: string;
}

class StateManager {
  private currentAdmin: AdminState | null = null;

  async getStoredAdmin(): Promise<AdminState | null> {
    const stored = await chrome.storage.local.get(['adminEmail', 'adminId']);
    if (stored.adminEmail && stored.adminId) {
      this.currentAdmin = { 
        email: stored.adminEmail as string, 
        adminId: stored.adminId as string 
      };
      return this.currentAdmin;
    }
    return null;
  }

  async setAdmin(email: string, adminId: string) {
    this.currentAdmin = { email, adminId };
    await chrome.storage.local.set({ adminEmail: email, adminId: adminId });
  }

  async clearAdmin() {
    this.currentAdmin = null;
    await chrome.storage.local.remove(['adminEmail', 'adminId']);
  }

  getAdmin() {
    return this.currentAdmin;
  }
}

export const state = new StateManager();
