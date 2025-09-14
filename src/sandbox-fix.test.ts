/**
 * Tests for sandbox fix functionality
 */

import { isSandboxMode, injectSandboxFixCSS, injectEmbeddedSandboxFixCSS } from './sandbox-fix';

// Mock window and document for testing
const mockWindow = {
  location: {
    hostname: 'localhost'
  }
};

const mockDocument = {
  getElementById: jest.fn(),
  createElement: jest.fn(),
  head: {
    appendChild: jest.fn()
  }
};

// Mock global objects
Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true
});

Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true
});

describe('sandbox-fix', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDocument.getElementById.mockReturnValue(null);
    mockDocument.createElement.mockReturnValue({
      id: '',
      textContent: ''
    });
  });

  describe('isSandboxMode', () => {
    it('should return true for localhost', () => {
      mockWindow.location.hostname = 'localhost';
      expect(isSandboxMode()).toBe(true);
    });

    it('should return true for sandbox hostname', () => {
      mockWindow.location.hostname = 'sandbox.example.com';
      expect(isSandboxMode()).toBe(true);
    });

    it('should return true for 127.0.0.1', () => {
      mockWindow.location.hostname = '127.0.0.1';
      expect(isSandboxMode()).toBe(true);
    });

    it('should return true when plaidSandboxMode is set', () => {
      mockWindow.location.hostname = 'example.com';
      (mockWindow as any).plaidSandboxMode = true;
      expect(isSandboxMode()).toBe(true);
    });

    it('should return false for production hostname', () => {
      mockWindow.location.hostname = 'example.com';
      (mockWindow as any).plaidSandboxMode = false;
      expect(isSandboxMode()).toBe(false);
    });
  });

  describe('injectSandboxFixCSS', () => {
    it('should inject CSS when not already present', () => {
      mockDocument.getElementById.mockReturnValue(null);
      
      injectSandboxFixCSS();
      
      expect(mockDocument.getElementById).toHaveBeenCalledWith('plaid-sandbox-fix');
      expect(mockDocument.createElement).toHaveBeenCalledWith('style');
      expect(mockDocument.head.appendChild).toHaveBeenCalled();
    });

    it('should not inject CSS when already present', () => {
      mockDocument.getElementById.mockReturnValue({ id: 'plaid-sandbox-fix' });
      
      injectSandboxFixCSS();
      
      expect(mockDocument.createElement).not.toHaveBeenCalled();
      expect(mockDocument.head.appendChild).not.toHaveBeenCalled();
    });
  });

  describe('injectEmbeddedSandboxFixCSS', () => {
    it('should inject CSS when not already present', () => {
      mockDocument.getElementById.mockReturnValue(null);
      
      injectEmbeddedSandboxFixCSS();
      
      expect(mockDocument.getElementById).toHaveBeenCalledWith('plaid-sandbox-fix-embedded');
      expect(mockDocument.createElement).toHaveBeenCalledWith('style');
      expect(mockDocument.head.appendChild).toHaveBeenCalled();
    });

    it('should not inject CSS when already present', () => {
      mockDocument.getElementById.mockReturnValue({ id: 'plaid-sandbox-fix-embedded' });
      
      injectEmbeddedSandboxFixCSS();
      
      expect(mockDocument.createElement).not.toHaveBeenCalled();
      expect(mockDocument.head.appendChild).not.toHaveBeenCalled();
    });
  });
});
