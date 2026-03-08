/**
 * Session management utilities for guest checkout
 * Generates and manages guest session IDs stored in localStorage
 */

const SESSION_ID_KEY = 'maltiti_guest_session_id';

/**
 * Generate a unique session ID
 * Format: timestamp-random
 */
export const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `guest_${timestamp}_${randomPart}`;
};

/**
 * Get or create a session ID for guest users
 * @returns The existing or newly created session ID
 */
export const getGuestSessionId = (): string => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return '';
  }

  try {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);

    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }

    return sessionId;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    // Fallback to a temporary session ID
    return generateSessionId();
  }
};

/**
 * Clear the guest session ID
 * Useful when user logs in or after successful checkout
 */
export const clearGuestSessionId = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(SESSION_ID_KEY);
  } catch (error) {
    console.error('Error clearing session ID:', error);
  }
};

/**
 * Check if a valid guest session ID exists
 */
export const hasGuestSession = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    return !!sessionId;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};
