import { API_CONFIG, API_ENDPOINTS } from '../config/api';

// Cached in memory only: a synchronizer token scoped to the current session,
// re-issued on every fresh page load (there's no point persisting it).
let cachedToken = null;

// The API's mutating /users routes require this value echoed back via the
// x-csrf-token header (see GET /users/current/csrfToken). Fetch once and
// reuse it for the life of the tab.
export async function getCsrfToken() {
  if (cachedToken) return cachedToken;

  const res = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.CSRF_TOKEN}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  ({ csrfToken: cachedToken } = await res.json());
  return cachedToken;
}

// Call after the session that minted the cached token is gone (sign-out),
// so a future sign-in fetches a fresh token instead of reusing a dead one.
export function clearCsrfToken() {
  cachedToken = null;
}
