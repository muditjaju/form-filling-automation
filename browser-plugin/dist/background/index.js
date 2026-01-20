"use strict";
/**
 * Background script for OutMarket Helper
 * Handles message requests from content scripts to perform network calls,
 * bypassing CORS restrictions.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'proxyFetch') {
        const { url, options } = request;
        fetch(url, options)
            .then(async (response) => {
            const data = await response.json();
            sendResponse({ success: response.ok, data, status: response.status });
        })
            .catch(error => {
            console.error('Background Fetch Error:', error);
            sendResponse({ success: false, error: error.message });
        });
        return true; // Keep message channel open for async response
    }
});
