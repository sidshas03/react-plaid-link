import React, { useCallback, useState } from 'react';

import {
  usePlaidLink,
  PlaidLinkOnSuccess,
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOptions,
  PlaidEmbeddedLink,
} from 'react-plaid-link';

/**
 * Example component demonstrating the sandbox banner fix
 * This component shows both popup and embedded link implementations
 * with automatic sandbox banner overlap prevention.
 */
const SandboxFixExample = () => {
  const [token, setToken] = useState<string | null>(null);

  // Generate a link_token when component mounts
  React.useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch('/api/create_link_token', {
          method: 'POST',
        });
        const { link_token } = await response.json();
        setToken(link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
        // For demo purposes, use a mock token
        setToken('mock-link-token');
      }
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
    console.log('Success:', publicToken, metadata);
  }, []);

  const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
    console.log('Event:', eventName, metadata);
  }, []);

  const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
    console.log('Exit:', error, metadata);
  }, []);

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    onEvent,
    onExit,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Plaid Link Sandbox Banner Fix Example</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Popup Link (with automatic sandbox fix)</h2>
        <p>
          This button opens Plaid Link in a popup. The sandbox banner overlap fix
          is automatically applied when in sandbox mode.
        </p>
        <button 
          onClick={() => open()} 
          disabled={!ready}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: ready ? 'pointer' : 'not-allowed',
            opacity: ready ? 1 : 0.6
          }}
        >
          {ready ? 'Connect Bank Account (Popup)' : 'Loading...'}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Embedded Link (with automatic sandbox fix)</h2>
        <p>
          This shows Plaid Link embedded directly in the page. The sandbox banner
          overlap fix is automatically applied when in sandbox mode.
        </p>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px', 
          padding: '20px',
          minHeight: '400px'
        }}>
          <PlaidEmbeddedLink
            token={token}
            onSuccess={onSuccess}
            onEvent={onEvent}
            onExit={onExit}
            style={{ height: '350px', width: '100%' }}
          />
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      }}>
        <h3>How the Fix Works:</h3>
        <ul>
          <li>
            <strong>Automatic Detection:</strong> The fix automatically detects when you&apos;re 
            running in sandbox mode (localhost, sandbox hostnames, or when plaidSandboxMode is set).
          </li>
          <li>
            <strong>CSS Injection:</strong> When in sandbox mode, CSS is automatically injected 
            to add bottom margin/padding to prevent the sandbox banner from hiding CTAs.
          </li>
          <li>
            <strong>Multiple Selectors:</strong> The fix targets various Plaid Link iframe 
            selectors to ensure compatibility across different versions.
          </li>
          <li>
            <strong>No Configuration Required:</strong> The fix works automatically without 
            any additional configuration needed.
          </li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '15px', 
        borderRadius: '4px',
        border: '1px solid #ffeaa7',
        marginTop: '20px'
      }}>
        <h3>Testing the Fix:</h3>
        <ol>
          <li>Run this example in sandbox mode (localhost or sandbox environment)</li>
          <li>Open the popup or use the embedded link</li>
          <li>Resize your browser window to a smaller size (e.g., 500x600px)</li>
          <li>Verify that CTAs at the bottom of the Plaid Link interface are accessible</li>
          <li>Check that the sandbox banner doesn&apos;t overlap with the Plaid Link content</li>
        </ol>
      </div>
    </div>
  );
};

export default SandboxFixExample;
