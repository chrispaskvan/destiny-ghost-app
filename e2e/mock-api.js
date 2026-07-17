export const unregisteredUser = {
  displayName: 'Guardian',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+16305550147',
  emailAddress: 'john.doe@example.com',
  // no dateRegistered → the app treats this as an unregistered ghost user
};

/**
 * Intercept every /api request the app makes and serve canned responses.
 * Stateful, mirroring the real backend: GET /users/current flips from
 * unregistered to registered once POST /users/join succeeds, and
 * PATCH /users enforces If-Match against the current ETag (412 on mismatch),
 * applies the JSON Patch replace ops, and bumps the ETag.
 *
 * Returns the mutable state so specs can assert on captured request bodies
 * or force scenarios (e.g. set `registered = true`, or bump `etag` to
 * simulate an out-of-band document rewrite).
 */
export async function mockApi(page) {
  const state = {
    registered: false,
    rev: 1,
    etag: '"v1"',
    notifications: [
      { type: 'Xur', enabled: true },
      { type: 'Banshee-44', enabled: false },
    ],
    calls: { signUp: [], join: [], patch: [] },
  };

  // Guards first (last-registered route wins): any unmocked /api request
  // fails loudly instead of passing through the Vite proxy to a live API.
  // The cross-origin guard catches env drift — if the app ever resolves its
  // API base to the real host instead of /api, the test fails instead of
  // silently talking to a live backend.
  await page.route('**/api/**', (route) => route.fulfill({ status: 404, body: 'unmocked' }));
  await page.route('https://api*.destiny-ghost.com/**', (route) =>
    route.fulfill({ status: 404, body: 'unmocked cross-origin' }),
  );

  await page.route('**/api/health', (route) =>
    route.fulfill({ json: { destiny2: { world: 'e2e-world' } } }),
  );

  await page.route('**/api/users/current', (route) =>
    route.fulfill({
      json: state.registered
        ? {
            ...unregisteredUser,
            dateRegistered: '2026-07-16T00:00:00.000Z',
            notifications: state.notifications,
          }
        : unregisteredUser,
      headers: { ETag: state.etag },
    }),
  );

  await page.route('**/api/users/signUp', (route) => {
    state.calls.signUp.push(route.request().postDataJSON());
    return route.fulfill({ status: 204 });
  });

  await page.route('**/api/users/join', (route) => {
    state.calls.join.push(route.request().postDataJSON());
    state.registered = true;
    return route.fulfill({ status: 200, json: {} });
  });

  await page.route('**/api/users', (route) => {
    const request = route.request();
    const ifMatch = request.headers()['if-match'] ?? null;
    const ops = request.postDataJSON();
    state.calls.patch.push({ ifMatch, ops });
    if (ifMatch !== state.etag) return route.fulfill({ status: 412 });
    for (const { path, value } of ops) {
      state.notifications[Number(path.split('/')[2])].enabled = value;
    }
    state.etag = `"v${++state.rev}"`;
    return route.fulfill({ status: 204 });
  });

  return state;
}
