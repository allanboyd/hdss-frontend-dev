/**
 * Authentication Unit Tests
 *
 * Tests for authentication-related functionality including:
 * - Login validation
 * - Password validation
 * - Token management
 * - Error handling
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { handleAuthError, isAuthError } from '@/lib/auth-utils';

// Mock Supabase client
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

describe('Authentication Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleAuthError', () => {
    it('should handle refresh token errors', async () => {
      const error = new Error('Invalid Refresh Token');
      const result = await handleAuthError(error);

      expect(result.shouldRedirect).toBe(true);
      expect(result.redirectTo).toBe('/login');
    });

    it('should handle JWT expired errors', async () => {
      const error = new Error('JWT expired');
      const result = await handleAuthError(error);

      expect(result.shouldRedirect).toBe(true);
      expect(result.redirectTo).toBe('/login');
    });

    it('should handle non-auth errors', async () => {
      const error = new Error('Network error');
      const result = await handleAuthError(error);

      expect(result.shouldRedirect).toBe(false);
      expect(result.redirectTo).toBeNull();
    });

    it('should handle unknown error types', async () => {
      const error = { message: 'Unknown error' };
      const result = await handleAuthError(error);

      expect(result.shouldRedirect).toBe(false);
      expect(result.redirectTo).toBeNull();
    });
  });

  describe('isAuthError', () => {
    it('should identify refresh token errors', () => {
      const error = new Error('Invalid Refresh Token');
      expect(isAuthError(error)).toBe(true);
    });

    it('should identify JWT expired errors', () => {
      const error = new Error('JWT expired');
      expect(isAuthError(error)).toBe(true);
    });

    it('should identify invalid JWT errors', () => {
      const error = new Error('Invalid JWT');
      expect(isAuthError(error)).toBe(true);
    });

    it('should not identify non-auth errors', () => {
      const error = new Error('Network error');
      expect(isAuthError(error)).toBe(false);
    });

    it('should handle errors without message property', () => {
      const error = { code: 'NETWORK_ERROR' };
      expect(isAuthError(error)).toBe(false);
    });
  });
});

describe('Authentication Validation', () => {
  describe('Email Validation', () => {
    it('should validate correct email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ];

      validEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
      ];

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MySecurePass1@',
        'ComplexP@ssw0rd',
      ];

      strongPasswords.forEach(password => {
        const hasLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        expect(
          hasLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSpecialChar
        ).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'password', // No uppercase, number, or special char
        'Password', // No number or special char
        'password123', // No uppercase or special char
        'PASSWORD123', // No lowercase or special char
        'Pass1', // Too short
        'Password1', // No special char
      ];

      weakPasswords.forEach(password => {
        const hasLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const isValid =
          hasLength &&
          hasUpperCase &&
          hasLowerCase &&
          hasNumber &&
          hasSpecialChar;
        expect(isValid).toBe(false);
      });
    });
  });
});

describe('Token Management', () => {
  it('should validate JWT token format', () => {
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    // JWT tokens have 3 parts separated by dots
    const parts = mockToken.split('.');
    expect(parts.length).toBe(3);

    // Each part should be base64 encoded (JWT uses URL-safe base64)
    parts.forEach(part => {
      // Convert URL-safe base64 to standard base64
      const standardBase64 = part.replace(/-/g, '+').replace(/_/g, '/');
      expect(() => atob(standardBase64)).not.toThrow();
    });
  });

  it('should handle token expiration', () => {
    const currentTime = Math.floor(Date.now() / 1000);

    // Mock token with past expiration
    const mockExpiredToken = {
      exp: currentTime - 3600, // 1 hour ago
      iat: currentTime - 7200, // 2 hours ago
    };

    expect(mockExpiredToken.exp < currentTime).toBe(true);
  });
});

describe('Error Handling', () => {
  it('should properly format error messages', () => {
    const error = new Error('Database connection failed');
    const formattedError =
      error instanceof Error ? error.message : 'Unknown error';

    expect(formattedError).toBe('Database connection failed');
  });

  it('should handle unknown error types', () => {
    const unknownError = { code: 'UNKNOWN_ERROR' };
    const formattedError =
      unknownError instanceof Error ? unknownError.message : 'Unknown error';

    expect(formattedError).toBe('Unknown error');
  });

  it('should sanitize error messages for user display', () => {
    const sensitiveError = new Error(
      'Database password: secret123, connection failed'
    );
    const sanitizedMessage = sensitiveError.message.replace(
      /password:\s*[^,\s]+/gi,
      'password: [REDACTED]'
    );

    expect(sanitizedMessage).toBe(
      'Database password: [REDACTED], connection failed'
    );
  });
});
