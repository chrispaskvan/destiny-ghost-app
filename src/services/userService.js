import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { getCsrfToken } from './csrfToken';

const apiFetch = (path, options) =>
  fetch(`${API_CONFIG.BASE_URL}${path}`, { ...options, credentials: 'include' });

const jsonHeaders = { 'Content-Type': 'application/json' };

export const userService = {
  async getProfile() {
    // Bypass the browser HTTP cache: a conditional 304 would surface cached
    // headers, and a stale ETag here breaks the If-Match flow on PATCH.
    const res = await apiFetch(API_ENDPOINTS.AUTH.CURRENT_USER, { cache: 'no-store' });
    if (!res.ok) return null;
    // Warm the CSRF token cache now, alongside this read, rather than on the
    // first mutating call (e.g. Save). Any authenticated request in between
    // may silently refresh the Bungie token, which rewrites the user
    // document and changes its ETag — widening the window for a stale
    // If-Match later. Best-effort: a failure here just means the next call
    // fetches it fresh.
    getCsrfToken().catch(() => {});
    return { user: await res.json(), etag: res.headers.get('ETag') };
  },

  async signUp({ firstName, lastName, phoneNumber, emailAddress }) {
    const csrfToken = await getCsrfToken();
    const res = await apiFetch(API_ENDPOINTS.USER.SIGNUP, {
      method: 'POST',
      headers: { ...jsonHeaders, 'x-csrf-token': csrfToken },
      body: JSON.stringify({ firstName, lastName, phoneNumber, emailAddress }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },

  async join({ emailToken, smsCode }) {
    const csrfToken = await getCsrfToken();
    const res = await apiFetch(API_ENDPOINTS.USER.JOIN, {
      method: 'POST',
      headers: { ...jsonHeaders, 'x-csrf-token': csrfToken },
      body: JSON.stringify({
        tokens: { emailAddress: emailToken, phoneNumber: smsCode },
      }),
    });
    return res.ok;
  },

  async updateProfile(patchOps, etag) {
    const csrfToken = await getCsrfToken();
    const res = await apiFetch(API_ENDPOINTS.USER.UPDATE, {
      method: 'PATCH',
      // Omit If-Match when no ETag is known — the API answers 428, a clearer
      // signal than the guaranteed 412 from a literal "null" header.
      headers: { ...jsonHeaders, ...(etag && { 'If-Match': etag }), 'x-csrf-token': csrfToken },
      body: JSON.stringify(patchOps),
    });
    return { ok: res.ok, stale: res.status === 412 };
  },
};
