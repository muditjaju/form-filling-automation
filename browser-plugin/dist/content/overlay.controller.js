/**
 * Controller for the OutMarket Overlay
 * Handles data mapping and auto-filling web forms
 */
export class OverlayController {
    customerData;
    // Fake mapping object as requested
    mapping = {
        "mappings": {
            "given-name": ["firstName", "middleName"],
            "last-name": ["lastName"],
            "insurance-amount": ["amount"],
            "address": ["addresses.street", "addresses.city"],
            "zip-code": []
        }
    };
    constructor(customerData) {
        this.customerData = customerData;
    }
    /**
     * Auto-fills the current page's form fields based on the mapping
     */
    async autoFill() {
        console.log('[OutMarket] Starting auto-fill with data:', this.customerData);
        const mappings = this.mapping.mappings;
        for (const [destId, sourceKeys] of Object.entries(mappings)) {
            const element = document.getElementById(destId);
            if (!element || !(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
                console.warn(`[OutMarket] Destination element with ID "${destId}" not found or not an input.`);
                continue;
            }
            let concatenatedValue = '';
            if (Array.isArray(sourceKeys)) {
                concatenatedValue = sourceKeys
                    .map(key => this.getValueByPath(this.customerData, key))
                    .filter(val => val !== undefined && val !== null && val !== '')
                    .join(' ')
                    .trim();
            }
            if (concatenatedValue) {
                element.value = concatenatedValue;
                // Trigger events to notify page scripts (React, Vue, etc.)
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`[OutMarket] Filled ${destId} with "${concatenatedValue}"`);
            }
        }
        alert('Form auto-filled successfully!');
    }
    /**
     * Helper to get value from nested object or array
     * e.g., "addresses.street" -> data.addresses[0].street
     */
    getValueByPath(obj, path) {
        const parts = path.split('.');
        let current = obj;
        for (const part of parts) {
            if (current === null || current === undefined)
                return '';
            if (Array.isArray(current)) {
                // If it's an array, we take the first element for auto-fill demo
                current = current[0]?.[part];
            }
            else {
                current = current[part];
            }
        }
        return current ? String(current) : '';
    }
}
