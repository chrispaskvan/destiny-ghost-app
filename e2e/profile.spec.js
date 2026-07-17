import { expect, test } from '@playwright/test';
import { mockApi } from './mock-api.js';

test('saves subscription toggles with If-Match optimistic concurrency', async ({ page }) => {
  const api = await mockApi(page);
  api.registered = true;

  await page.goto('/profile');
  await expect(page.getByRole('heading', { name: 'GUARDIAN' })).toBeVisible();

  const save = page.getByRole('button', { name: 'SAVE' });
  await expect(save).toBeDisabled();

  // Toggle Xur off; only the changed op is sent, with the served ETag.
  await page.getByRole('switch').first().click();
  await expect(save).toBeEnabled();
  await save.click();
  await expect(page.getByText('SAVED')).toBeVisible();
  expect(api.calls.patch).toEqual([
    { ifMatch: '"v1"', ops: [{ op: 'replace', path: '/notifications/0/enabled', value: false }] },
  ]);

  // Simulate an out-of-band document rewrite (e.g. a token refresh) bumping
  // the ETag: the first PATCH gets 412, and the hook rebases on a fresh
  // profile and retries once with the new ETag.
  api.etag = '"v9"';
  await page.getByRole('switch').nth(1).click();
  await save.click();
  await expect(page.getByText('SAVED')).toBeVisible();
  expect(api.calls.patch.slice(1)).toEqual([
    { ifMatch: '"v2"', ops: [{ op: 'replace', path: '/notifications/1/enabled', value: true }] },
    { ifMatch: '"v9"', ops: [{ op: 'replace', path: '/notifications/1/enabled', value: true }] },
  ]);

  // The retried save persisted: reload and confirm the toggle state held.
  await page.reload();
  await expect(page.getByRole('switch').first()).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('switch').nth(1)).toHaveAttribute('aria-checked', 'true');
  await expect(save).toBeDisabled();
});
