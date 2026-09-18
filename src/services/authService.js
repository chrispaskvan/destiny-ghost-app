import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { getCsrfToken, clearCsrfToken } from './csrfToken';

const apiFetch = (path, options) =>
  fetch(`${API_CONFIG.BASE_URL}${path}`, { credentials: 'include', ...options });

export const authService = {
  async getBungieSignInUrl(redirectPath = '/auth/callback') {
    const redirectUri = `${window.location.origin}${redirectPath}`;
    const res = await apiFetch(
      `${API_ENDPOINTS.DESTINY.SIGNIN_URL}?redirect_uri=${encodeURIComponent(redirectUri)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  },

  async getUser() {
    const res = await apiFetch(API_ENDPOINTS.AUTH.CURRENT_USER);
    if (!res.ok) return null;
    // Warm the CSRF token cache now, alongside this read, rather than on the
    // first mutating call. That first call could happen long after this
    // request (e.g. on Save) and any authenticated request in between may
    // silently refresh the Bungie token, which rewrites the user document
    // and changes its ETag — widening the window for a stale If-Match on a
    // later PATCH. Best-effort: a failure here just means the next call
    // fetches it fresh.
    getCsrfToken().catch(() => {});
    return res.json();
  },

  async signOut() {
    const csrfToken = await getCsrfToken();
    const res = await apiFetch(API_ENDPOINTS.USER.SIGNOUT, {
      method: 'POST',
      headers: { 'x-csrf-token': csrfToken },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    clearCsrfToken();
  },

  async completeSignIn(code, state) {
    const params = new URLSearchParams({ code, ...(state && { state }) });
    const res = await apiFetch(`${API_ENDPOINTS.AUTH.BUNGIE_SIGNIN}?${params}`);
    return res.ok;
  },
};
