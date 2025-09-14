/**
 * Utility functions to handle sandbox banner overlap issues
 */

/**
 * Utility function to detect if we're in sandbox mode
 */
export const isSandboxMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if we're in sandbox mode by looking at the environment
  // This can be detected by checking the token or other indicators
  return window.location.hostname.includes('sandbox') || 
         window.location.hostname.includes('localhost') ||
         window.location.hostname.includes('127.0.0.1') ||
         (window as any).plaidSandboxMode === true;
};

/**
 * Inject CSS to fix sandbox banner overlap issue for popup links
 */
export const injectSandboxFixCSS = (): void => {
  if (typeof document === 'undefined') return;
  
  // Check if CSS is already injected
  if (document.getElementById('plaid-sandbox-fix')) return;
  
  const style = document.createElement('style');
  style.id = 'plaid-sandbox-fix';
  style.textContent = `
    /* Fix for sandbox banner overlapping Plaid Link popup CTAs */
    .plaid-link-iframe {
      margin-bottom: 60px !important;
    }
    
    /* Alternative approach: ensure popup is positioned above sandbox banner */
    .plaid-link-popup {
      bottom: 60px !important;
      max-height: calc(100vh - 60px) !important;
    }
    
    /* For newer Plaid Link versions that might use different class names */
    [data-plaid-link] iframe {
      margin-bottom: 60px !important;
    }
    
    /* Ensure the popup container accounts for sandbox banner */
    .plaid-link-container {
      padding-bottom: 60px !important;
    }
    
    /* Additional selectors for various Plaid Link implementations */
    iframe[src*="plaid.com"] {
      margin-bottom: 60px !important;
    }
    
    /* Target the actual popup iframe more specifically */
    .plaid-link-iframe,
    iframe[src*="link.plaid.com"],
    iframe[src*="cdn.plaid.com"] {
      margin-bottom: 60px !important;
      max-height: calc(100vh - 60px) !important;
    }
  `;
  
  document.head.appendChild(style);
};

/**
 * Inject CSS to fix sandbox banner overlap issue for embedded links
 */
export const injectEmbeddedSandboxFixCSS = (): void => {
  if (typeof document === 'undefined') return;
  
  // Check if CSS is already injected
  if (document.getElementById('plaid-sandbox-fix-embedded')) return;
  
  const style = document.createElement('style');
  style.id = 'plaid-sandbox-fix-embedded';
  style.textContent = `
    /* Fix for sandbox banner overlapping embedded Plaid Link CTAs */
    .plaid-embedded-link {
      margin-bottom: 60px !important;
      padding-bottom: 60px !important;
    }
    
    /* Ensure embedded iframe accounts for sandbox banner */
    .plaid-embedded-link iframe {
      margin-bottom: 60px !important;
      max-height: calc(100vh - 60px) !important;
    }
    
    /* Additional selectors for embedded links */
    .plaid-embedded-link [data-plaid-link] {
      margin-bottom: 60px !important;
    }
  `;
  
  document.head.appendChild(style);
};

/**
 * Apply sandbox fix for popup links
 */
export const applySandboxFix = (): void => {
  if (isSandboxMode()) {
    injectSandboxFixCSS();
  }
};

/**
 * Apply sandbox fix for embedded links
 */
export const applyEmbeddedSandboxFix = (): void => {
  if (isSandboxMode()) {
    injectEmbeddedSandboxFixCSS();
  }
};
