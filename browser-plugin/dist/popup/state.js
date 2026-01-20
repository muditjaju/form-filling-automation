class StateManager {
    currentAdmin = null;
    async getStoredAdmin() {
        const stored = await chrome.storage.local.get(['adminEmail', 'adminId']);
        if (stored.adminEmail && stored.adminId) {
            this.currentAdmin = {
                email: stored.adminEmail,
                adminId: stored.adminId
            };
            return this.currentAdmin;
        }
        return null;
    }
    async setAdmin(email, adminId) {
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
