import { API_CONFIG, API_ENDPOINTS } from '../config/api';

const apiFetch = (path, options) =>
  fetch(`${API_CONFIG.BASE_URL}${path}`, { credentials: 'include', ...options });

const jsonHeaders = { 'Content-Type': 'application/json' };

export const userService = {
  async getProfile() {
    // Bypass the browser HTTP cache: a conditional 304 would surface cached
    // headers, and a stale ETag here breaks the If-Match flow on PATCH.
    const res = await apiFetch(API_ENDPOINTS.AUTH.CURRENT_USER, { cache: 'no-store' });
    if (!res.ok) return null;
    return { user: await res.json(), etag: res.headers.get('ETag') };
  },

  async signUp({ firstName, lastName, phoneNumber, emailAddress }) {
    const res = await apiFetch(API_ENDPOINTS.USER.SIGNUP, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ firstName, lastName, phoneNumber, emailAddress }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },

  async join({ emailToken, smsCode }) {
    const res = await apiFetch(API_ENDPOINTS.USER.JOIN, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        tokens: { emailAddress: emailToken, phoneNumber: smsCode },
      }),
    });
    return res.ok;
  },

  async updateProfile(patchOps, etag) {
    const res = await apiFetch(API_ENDPOINTS.USER.UPDATE, {
      method: 'PATCH',
      headers: { ...jsonHeaders, 'If-Match': etag },
      body: JSON.stringify(patchOps),
    });
    return { ok: res.ok, stale: res.status === 412 };
  },
};
