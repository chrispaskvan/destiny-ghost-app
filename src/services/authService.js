import { API_CONFIG, API_ENDPOINTS } from '../config/api';

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
    return res.ok ? res.json() : null;
  },

  async signOut() {
    const res = await apiFetch(API_ENDPOINTS.USER.SIGNOUT, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },

  async completeSignIn(code, state) {
    const params = new URLSearchParams({ code, ...(state && { state }) });
    const res = await apiFetch(`${API_ENDPOINTS.AUTH.BUNGIE_SIGNIN}?${params}`);
    return res.ok;
  },
};
