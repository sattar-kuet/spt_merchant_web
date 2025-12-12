import Cookies from 'js-cookie';

// Keys
const TOKEN_KEY = 'access_token';
const TOKEN_EXPIRES_AT = 'access_token_expires_at';

// store token in cookie and expiry timestamp in localStorage
export const setAuthToken = (token: string, ttlSeconds?: number) => {
  // set cookie (keep around for a reasonable time for server-side usage),
  // but client-side expiry is enforced using expires_at in localStorage.
  Cookies.set(TOKEN_KEY, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    // do not rely on cookie expiry for client-side logout; keep a long cookie lifetime
    expires: 30 // 30 days cookie as fallback
  });

  if (ttlSeconds && typeof ttlSeconds === 'number') {
    try {
      const expiresAt = Date.now() + ttlSeconds * 1000;
      localStorage.setItem(TOKEN_EXPIRES_AT, String(expiresAt));
    } catch (e) {
      // ignore storage errors
      // eslint-disable-next-line no-console
      console.error('setAuthToken: failed to save expiry', e);
    }
  } else {
    // clear any previous expiry if ttl not provided
    try {
      localStorage.removeItem(TOKEN_EXPIRES_AT);
    } catch (e) {
      // ignore
    }
  }
};

export const getAuthToken = () => {
  try {
    const expiresAt = localStorage.getItem(TOKEN_EXPIRES_AT);
    if (expiresAt) {
      const at = Number(expiresAt);
      if (!Number.isNaN(at) && Date.now() > at) {
        // token expired, remove both
        removeAuthToken();
        return null;
      }
    }
  } catch (e) {
    // if localStorage is unavailable, continue
  }

  return Cookies.get(TOKEN_KEY) || null;
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_EXPIRES_AT);
  } catch (e) {
    // ignore
  }
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};