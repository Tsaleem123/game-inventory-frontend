import { jwtDecode } from 'jwt-decode';

/**
 * Central place for reading and clearing the login session.
 *
 * The backend issues JWTs that expire (ExpiryMinutes, no clock skew). Before
 * this helper existed the UI treated "a token exists in localStorage" as
 * "logged in", so an expired token kept the UI looking logged in while every
 * protected API call failed with 401 Unauthorized.
 */

const TOKEN_KEY = 'token';
const EXPIRED_FLAG_KEY = 'sessionExpired';

/** True if the token is malformed or its `exp` claim is in the past. */
export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    return !exp || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

/** Remembers (for this tab) that the session ended, so the login page can say why. */
function flagExpired(): void {
  try {
    sessionStorage.setItem(EXPIRED_FLAG_KEY, '1');
  } catch {
    /* storage unavailable: the message is a nicety, not required */
  }
}

/** Removes the stored token (used by logout and when the session expires). */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Returns the stored token only if it is still valid. An expired token is
 * cleared and null is returned, so callers treat the user as logged out.
 */
export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  if (isTokenExpired(token)) {
    clearToken();
    flagExpired();
    return null;
  }
  return token;
}

/**
 * Called when the API rejects the token (HTTP 401): clears it and sends the
 * user to the login page, which shows a "session expired" message.
 */
export function handleSessionExpired(): void {
  clearToken();
  flagExpired();
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
}

/** Reads and clears the "session expired" flag. Used once by the login page. */
export function consumeSessionExpiredFlag(): boolean {
  try {
    const expired = sessionStorage.getItem(EXPIRED_FLAG_KEY) === '1';
    sessionStorage.removeItem(EXPIRED_FLAG_KEY);
    return expired;
  } catch {
    return false;
  }
}
