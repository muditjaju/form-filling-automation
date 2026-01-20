import { parse } from 'node-html-parser';

/**
 * Prunes the HTML DOM string to only include relevant form elements.
 * This helps reduce token usage and focuses the LLM on input fields.
 */
export function pruneHtml(htmlString: string): string {
  const root = parse(htmlString);
  
  // Extract only input, select, textarea, label, and button elements
  const relevantElements = root.querySelectorAll('input, select, textarea, label, button');
  
  let prunedHtml = '';
  
  relevantElements.forEach(el => {
    // Keep only essential attributes to save tokens
    const tagName = el.tagName.toLowerCase();
    const id = el.getAttribute('id');
    const name = el.getAttribute('name');
    const type = el.getAttribute('type');
    const placeholder = el.getAttribute('placeholder');
    const labelFor = el.getAttribute('for');
    const textContent = el.textContent.trim();
    
    let elString = `<${tagName}`;
    if (id) elString += ` id="${id}"`;
    if (name) elString += ` name="${name}"`;
    if (type) elString += ` type="${type}"`;
    if (placeholder) elString += ` placeholder="${placeholder}"`;
    if (labelFor) elString += ` for="${labelFor}"`;
    elString += '>';
    
    if (textContent) {
      elString += textContent;
    }
    
    elString += `</${tagName}>\n`;
    prunedHtml += elString;
  });
  
  return prunedHtml;
}
