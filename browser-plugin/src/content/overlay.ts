// import { API_BASE_URL } from "@/popup/api";
const API_BASE_URL = 'https://form-filling-automation.vercel.app/api';
// const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Controller for the OutMarket Overlay
 * Handles data mapping and auto-filling web forms
 */
class OverlayController {
  private customerData: any;
  private rawCustomerData: any;
  private mapping: any;
  
  constructor(customerData: any, mappingData: any) {
    this.rawCustomerData = customerData;
    this.customerData = customerData.data;
    this.mapping = mappingData;
  }

  /**
   * Recursively finds all form elements in the current document and accessible iframes
   */
  private getAllForms(doc: Document = document): HTMLFormElement[] {
    let forms = Array.from(doc.querySelectorAll('form'));
    
    const iframes = doc.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          forms = forms.concat(this.getAllForms(iframeDoc));
        }
      } catch (e) {
        // Cross-origin iframe, ignore
        console.warn('[OutMarket] Could not access iframe for forms:', e);
      }
    });
    
    return forms;
  }

  /**
   * Fills the page using AI by sending the DOM and customer data to the LLM
   */
  public async fillUsingAI() {
    console.log('[OutMarket] Starting AI-based fill');
    
    const aiBtn = document.getElementById('om-ai-fill-btn') as HTMLButtonElement;
    const originalText = aiBtn?.textContent;
    if (aiBtn) {
      aiBtn.disabled = true;
      aiBtn.textContent = 'Analyzing...';
    }

    try {
      // Find all forms on the page (including iframes)
      const forms = this.getAllForms();
      let htmlToSend = '';

      if (forms.length > 0) {
        console.log(`[OutMarket] Found ${forms.length} forms (including iframes). Sending form HTML only.`);
        htmlToSend = forms.map(form => form.outerHTML).join('\n');
        console.log('html being sent', htmlToSend);
      } else {
        console.log('[OutMarket] No forms found. Sending pruned body HTML.');
        // Clone the body to remove the overlay before sending to AI
        const bodyClone = document.body.cloneNode(true) as HTMLElement;
        const overlayInClone = bodyClone.querySelector('#outmarket-overlay');
        if (overlayInClone) overlayInClone.remove();
        htmlToSend = bodyClone.innerHTML;
      }

      const response = await new Promise<any>((resolve) => {
        chrome.runtime.sendMessage({
          action: 'proxyFetch',
          url: `${API_BASE_URL}/llm-based-mapper`,
          options: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              htmlString: htmlToSend,
              customerData: this.rawCustomerData
            }),
          }
        }, resolve);
      });

      if (!response || !response.success) {
        throw new Error(response?.error || 'Failed to get response from AI');
      }

      const mapping = response.data;
      console.log('[OutMarket] AI Mapping result:', mapping);

      let filledCount = 0;
      for (const [id, value] of Object.entries(mapping)) {
        const success = this.setElementValue(id, String(value));
        if (success) filledCount++;
      }

      alert(`AI successfully filled ${filledCount} fields!`);
    } catch (error) {
      console.error('[OutMarket] AI fill failed:', error);
      alert('Failed to fill using AI. Please check the console for errors.');
    } finally {
      if (aiBtn) {
        aiBtn.disabled = false;
        aiBtn.textContent = originalText || 'Fill Using AI';
      }
    }
  }

  /**
   * Helper to set a value on an HTML element and trigger events
   */
  private setElementValue(id: string, value: string, doc: Document = document): boolean {
    let element = doc.getElementById(id);
    
    // If not found in current doc, look into same-origin iframes
    if (!element) {
      const iframes = doc.querySelectorAll('iframe');
      for (const iframe of Array.from(iframes)) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const found = this.setElementValue(id, value, iframeDoc);
            if (found) return true;
          }
        } catch (e) {
          // Ignore accessible errors
        }
      }
    }

    if (!element) return false;

    const tagName = element.tagName.toLowerCase();
    const isField = tagName === 'input' || tagName === 'textarea' || tagName === 'select';

    if (!isField) {
      return false;
    }

    try {
      // Use the setter from the element's actual prototype to bypass React overrides
      // and ensure cross-frame compatibility.
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')?.set;
      
      if (setter) {
        setter.call(element, value);
      } else {
        (element as any).value = value;
      }
      
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } catch (e) {
      console.error(`[OutMarket] Failed to set value for ${id}:`, e);
      return false;
    }
  }

  /**
   * Auto-fills the current page's form fields based on the mapping
   */
  public async autoFill() {
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
        if (success) filledCount++;
      }
    }
    
    if (filledCount > 0) {
      alert(`Successfully filled ${filledCount} fields!`);
    } else {
      alert('Could not find any data to fill.');
    }
  }

  /**
   * Helper to get value from nested object or array
   * e.g., "addresses.street" -> data.addresses[0].street
   */
  private getValueByPath(obj: any, path: string): string {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) return '';

      if (Array.isArray(current)) {
        // If it's an array, we take the first element for auto-fill demo
        current = current[0]?.[part];
      } else {
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



async function createOverlay(data: any) {
  const existing = document.getElementById('outmarket-overlay');
  if (existing) existing.remove();

  // Fetch mapping data for the current URL
  let mappingData = null;
  try {
    const currentUrl = window.location.href;
    const response = await new Promise<any>((resolve) => {
      chrome.runtime.sendMessage({
        action: 'proxyFetch',
        url: `${API_BASE_URL}/form-mapping?url=${encodeURIComponent(currentUrl)}`
      }, resolve);
    });

    if (response && response.success && response.data) {
      // Handle both wrapped { success, data: { mapping_data } } and direct { mapping_data } responses
      const apiResponse = response.data;
      mappingData = apiResponse.mapping_data || apiResponse.data?.mapping_data;
      
      if (mappingData) {
        console.log('[OutMarket] Found mapping data:', mappingData);
      }
    }
  } catch (error) {
    console.error('[OutMarket] Failed to fetch mapping data:', error);
  }

  const controller = new OverlayController(data, mappingData);

  const overlay = document.createElement('div');
  overlay.id = 'outmarket-overlay';
  

  overlay.innerHTML = `
    <div class="om-header" id="om-drag-handle">
      <div class="om-header-left">
        <span>Customer Data</span>
        ${mappingData ? 
          '<button id="om-fill-btn">Fill Automatically</button>' : 
          '<button id="om-ai-fill-btn">Fill Using AI</button>'
        }
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
                          `
                        }
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
  overlay.querySelector('#om-close-btn')!.addEventListener('click', () => overlay.remove());

  // Copy Logic
  overlay.querySelectorAll('.om-copy-btn').forEach(btn => {
    (btn as HTMLButtonElement).onclick = () => {
      const inputId = btn.getAttribute('data-id')!;
      const input = document.getElementById(inputId) as HTMLInputElement;
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
    (btn as HTMLButtonElement).onclick = () => {
      const value = btn.getAttribute('data-raw-value')!;
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
  const handle = document.getElementById('om-drag-handle')!;
  makeDraggable(overlay, handle);

  // Resizable logic
  const resizeHandle = document.getElementById('om-resize-handle')!;
  makeResizable(overlay, resizeHandle);
}

function makeDraggable(el: HTMLElement, handle: HTMLElement) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e: MouseEvent) {
    if ((e.target as HTMLElement).id === 'om-fill-btn' || (e.target as HTMLElement).id === 'om-close-btn') return;
    
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    handle.style.cursor = 'grabbing';
  }

  function elementDrag(e: MouseEvent) {
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

function makeResizable(el: HTMLElement, handle: HTMLElement) {
  handle.onmousedown = function(e: MouseEvent) {
    e.preventDefault();
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
  };

  function resize(e: MouseEvent) {
    const width = e.clientX - el.offsetLeft;
    const height = e.clientY - el.offsetTop;
    if (width > 200) el.style.width = width + 'px';
    if (height > 100) el.style.height = height + 'px';
  }

  function stopResize() {
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResize);
  }
}
