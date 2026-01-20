"use strict";
// import { API_BASE_URL } from "@/popup/api";
const API_BASE_URL = 'https://form-filling-automation.vercel.app/api';
/**
 * Controller for the OutMarket Overlay
 * Handles data mapping and auto-filling web forms
 */
class OverlayController {
    customerData;
    rawCustomerData;
    mapping;
    constructor(customerData, mappingData) {
        this.rawCustomerData = customerData;
        this.customerData = customerData.data;
        this.mapping = mappingData;
    }
    /**
     * Fills the page using AI by sending the DOM and customer data to the LLM
     */
    async fillUsingAI() {
        console.log('[OutMarket] Starting AI-based fill');
        // Show a loading state if possible, for now just an alert/log
        const aiBtn = document.getElementById('om-ai-fill-btn');
        const originalText = aiBtn?.textContent;
        if (aiBtn) {
            aiBtn.disabled = true;
            aiBtn.textContent = 'Analyzing...';
        }
        try {
            const response = await fetch(`${API_BASE_URL}/llm-based-mapper`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    htmlString: document.body.innerHTML,
                    customerData: this.rawCustomerData
                }),
            });
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            const mapping = await response.json();
            console.log('[OutMarket] AI Mapping result:', mapping);
            let filledCount = 0;
            for (const [id, value] of Object.entries(mapping)) {
                const success = this.setElementValue(id, String(value));
                if (success)
                    filledCount++;
            }
            alert(`AI successfully filled ${filledCount} fields!`);
        }
        catch (error) {
            console.error('[OutMarket] AI fill failed:', error);
            alert('Failed to fill using AI. Please check the console for errors.');
        }
        finally {
            if (aiBtn) {
                aiBtn.disabled = false;
                aiBtn.textContent = originalText || 'Fill Using AI';
            }
        }
    }
    /**
     * Helper to set a value on an HTML element and trigger events
     */
    setElementValue(id, value) {
        const element = document.getElementById(id);
        if (!element || !(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
            return false;
        }
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
        try {
            if (element instanceof HTMLInputElement && nativeInputValueSetter) {
                nativeInputValueSetter.call(element, value);
            }
            else if (element instanceof HTMLTextAreaElement && nativeTextAreaValueSetter) {
                nativeTextAreaValueSetter.call(element, value);
            }
            else if (element instanceof HTMLSelectElement && nativeSelectValueSetter) {
                nativeSelectValueSetter.call(element, value);
            }
            else {
                element.value = value;
            }
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        catch (e) {
            console.error(`[OutMarket] Failed to set value for ${id}:`, e);
            return false;
        }
    }
    /**
     * Auto-fills the current page's form fields based on the mapping
     */
    async autoFill() {
        console.log('[OutMarket] Starting auto-fill');
        const mappings = this.mapping.mappings;
        let filledCount = 0;
        for (const [destId, sourceKeys] of Object.entries(mappings)) {
            let concatenatedValue = '';
            if (Array.isArray(sourceKeys)) {
                const values = sourceKeys.map(key => this.getValueByPath(this.customerData, key));
                concatenatedValue = values
                    .filter(val => val !== undefined && val !== null && val !== '')
                    .join(' ')
                    .trim();
            }
            if (concatenatedValue) {
                const success = this.setElementValue(destId, concatenatedValue);
                if (success)
                    filledCount++;
            }
        }
        if (filledCount > 0) {
            alert(`Successfully filled ${filledCount} fields!`);
        }
        else {
            alert('Could not find any data to fill.');
        }
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
        // Fix: Handle 0 or false as valid values
        return (current !== undefined && current !== null) ? String(current) : '';
    }
}
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'showOverlay') {
        await createOverlay(request.data);
    }
});
async function createOverlay(data) {
    const existing = document.getElementById('outmarket-overlay');
    if (existing)
        existing.remove();
    // Fetch mapping data for the current URL
    let mappingData = null;
    try {
        const currentUrl = window.location.href;
        const response = await fetch(`${API_BASE_URL}/form-mapping?url=${encodeURIComponent(currentUrl)}`);
        const result = await response.json();
        if (result.success && result.data) {
            mappingData = result.data.mapping_data;
            console.log('[OutMarket] Found mapping data:', mappingData);
        }
    }
    catch (error) {
        console.error('[OutMarket] Failed to fetch mapping data:', error);
    }
    const controller = new OverlayController(data, mappingData);
    const overlay = document.createElement('div');
    overlay.id = 'outmarket-overlay';
    const showFillBtn = !!mappingData;
    overlay.innerHTML = `
    <div class="om-header" id="om-drag-handle">
      <div class="om-header-left">
        <span>Customer Data</span>
        ${mappingData ?
        '<button id="om-fill-btn">Fill Automatically</button>' :
        '<button id="om-ai-fill-btn">Fill Using AI</button>'}
      </div>
      <button id="om-close-btn">✕</button>
    </div>
    <div class="om-body">
      ${Object.entries(data.data || {}).map(([key, value]) => {
        if (Array.isArray(value)) {
            return `
            <div class="om-field om-array-field">
              <label class="om-array-label">${key.toUpperCase()}</label>
              <div class="om-array-items">
                ${value.map((item, index) => {
                const itemTitle = `${key.replace(/s$/, '')} #${index + 1}`;
                const isObject = typeof item === 'object' && item !== null;
                const itemConcatenated = isObject ?
                    Object.values(item).filter(v => v).join(', ') : item;
                return `
                    <div class="om-array-entry">
                      <div class="om-entry-header">
                        <span>${itemTitle}</span>
                        <button class="om-copy-all-btn" data-raw-value="${itemConcatenated.replace(/"/g, '&quot;')}">Copy Entry</button>
                      </div>
                      <div class="om-entry-body">
                        ${isObject ?
                    Object.entries(item).map(([subKey, subVal]) => `
                            <div class="om-field nested">
                              <label>${subKey}</label>
                              <div class="om-value-container">
                                <input type="text" value="${subVal !== null && subVal !== undefined ? subVal : ''}" readonly id="om-input-${key}-${index}-${subKey}">
                                <button class="om-copy-btn" data-id="om-input-${key}-${index}-${subKey}">Copy</button>
                              </div>
                            </div>
                          `).join('')
                    :
                        `
                          <div class="om-value-container">
                            <input type="text" value="${item !== null && item !== undefined ? item : ''}" readonly id="om-input-${key}-${index}">
                            <button class="om-copy-btn" data-id="om-input-${key}-${index}">Copy</button>
                          </div>
                          `}
                      </div>
                    </div>
                  `;
            }).join('')}
              </div>
            </div>
          `;
        }
        return `
          <div class="om-field">
            <label>${key}</label>
            <div class="om-value-container">
              <input type="text" value="${value !== null && value !== undefined ? value : ''}" readonly id="om-input-${key}">
              <button class="om-copy-btn" data-id="om-input-${key}">Copy</button>
            </div>
          </div>
        `;
    }).join('')}
    </div>
    <div id="om-resize-handle"></div>
  `;
    document.body.appendChild(overlay);
    // Auto-fill Logic
    const fillBtn = overlay.querySelector('#om-fill-btn');
    if (fillBtn) {
        fillBtn.addEventListener('click', () => {
            controller.autoFill();
        });
    }
    // AI Fill Logic
    const aiFillBtn = overlay.querySelector('#om-ai-fill-btn');
    if (aiFillBtn) {
        aiFillBtn.addEventListener('click', () => {
            controller.fillUsingAI();
        });
    }
    // Close Logic
    overlay.querySelector('#om-close-btn').addEventListener('click', () => overlay.remove());
    // Copy Logic
    overlay.querySelectorAll('.om-copy-btn').forEach(btn => {
        btn.onclick = () => {
            const inputId = btn.getAttribute('data-id');
            const input = document.getElementById(inputId);
            if (input) {
                input.select();
                document.execCommand('copy');
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = originalText, 2000);
            }
        };
    });
    // Copy All Logic (for arrays)
    overlay.querySelectorAll('.om-copy-all-btn').forEach(btn => {
        btn.onclick = () => {
            const value = btn.getAttribute('data-raw-value');
            const tempInput = document.createElement('textarea');
            tempInput.style.position = 'fixed';
            tempInput.style.left = '-9999px';
            tempInput.value = value;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            const originalText = btn.textContent;
            btn.textContent = 'Joined & Copied!';
            setTimeout(() => btn.textContent = originalText, 2000);
        };
    });
    // Draggable logic
    const handle = document.getElementById('om-drag-handle');
    makeDraggable(overlay, handle);
    // Resizable logic
    const resizeHandle = document.getElementById('om-resize-handle');
    makeResizable(overlay, resizeHandle);
}
function makeDraggable(el, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        if (e.target.id === 'om-fill-btn' || e.target.id === 'om-close-btn')
            return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        handle.style.cursor = 'grabbing';
    }
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.right = 'auto';
        el.style.bottom = 'auto';
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        handle.style.cursor = 'grab';
    }
}
function makeResizable(el, handle) {
    handle.onmousedown = function (e) {
        e.preventDefault();
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    };
    function resize(e) {
        const width = e.clientX - el.offsetLeft;
        const height = e.clientY - el.offsetTop;
        if (width > 200)
            el.style.width = width + 'px';
        if (height > 100)
            el.style.height = height + 'px';
    }
    function stopResize() {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
    }
}
