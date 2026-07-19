import { expect, test } from '@playwright/test';
import { mockApi, unregisteredUser } from './mock-api.js';

const EMAIL_TOKEN = 'e2e-email-token';
const SMS_CODE = '123456';

test('first-time user registers end to end', async ({ page }) => {
  const api = await mockApi(page);

  // A signed-in-but-unregistered user landing on / is sent to /register.
  await page.goto('/');
  await page.waitForURL('**/register');

  // Consent gates the SIGN UP button.
  await expect(page.getByRole('heading', { name: 'JOIN' })).toBeVisible();
  await page.getByLabel('First Name').fill(unregisteredUser.firstName);
  await page.getByLabel('Last Name').fill(unregisteredUser.lastName);
  await page.getByLabel('Phone Number', { exact: true }).fill(unregisteredUser.phoneNumber);
  await page.getByLabel('Email Address').fill(unregisteredUser.emailAddress);

  const signUp = page.getByRole('button', { name: 'SIGN UP' });
  await expect(signUp).toBeDisabled();
  await page.getByRole('checkbox').check();
  await expect(signUp).toBeEnabled();
  await signUp.click();

  await expect(page.getByRole('heading', { name: 'CHECK YOUR MESSAGES' })).toBeVisible();
  expect(api.calls.signUp).toEqual([
    {
      firstName: unregisteredUser.firstName,
      lastName: unregisteredUser.lastName,
      phoneNumber: unregisteredUser.phoneNumber,
      emailAddress: unregisteredUser.emailAddress,
    },
  ]);

  // The user opens the emailed link and enters the SMS code.
  await page.goto(`/register?token=${EMAIL_TOKEN}`);
  await expect(page.getByRole('heading', { name: 'VERIFY', exact: true })).toBeVisible();
  await page.getByLabel('Verification Code').fill(SMS_CODE);
  await page.getByRole('button', { name: 'CONFIRM' }).click();

  await page.waitForURL('**/profile');
  expect(api.calls.join).toEqual([
    { tokens: { emailAddress: EMAIL_TOKEN, phoneNumber: SMS_CODE } },
  ]);

  // Profile renders the now-registered user.
  await expect(page.getByRole('heading', { name: 'GUARDIAN' })).toBeVisible();
  await expect(page.getByText(/Registered/)).toBeVisible();
  await expect(page.getByRole('switch')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'SAVE' })).toBeDisabled();

  // Home no longer redirects a registered user.
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'SIGN OUT' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'PROFILE' })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});
