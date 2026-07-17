export const unregisteredUser = {
  displayName: 'Guardian',
  firstName: 'John',
  lastName: 'Paskvan',
  phoneNumber: '+16305550147',
  emailAddress: 'john.paskvan@example.com',
  // no dateRegistered → the app treats this as an unregistered ghost user
};

export const registeredUser = {
  ...unregisteredUser,
  dateRegistered: '2026-07-16T00:00:00.000Z',
  notifications: [
    { type: 'Xur', enabled: true },
    { type: 'Banshee-44', enabled: false },
  ],
};

/**
 * Intercept every /api request the app makes and serve canned responses.
 * Stateful: GET /users/current flips from unregistered to registered once
 * POST /users/join succeeds, mirroring the real backend.
 *
 * Returns the mutable state so specs can assert on captured request bodies.
 */
export async function mockApi(page) {
  const state = {
    registered: false,
    calls: { signUp: [], join: [] },
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
      json: state.registered ? registeredUser : unregisteredUser,
      headers: { ETag: state.registered ? '"v2"' : '"v1"' },
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

  return state;
}
