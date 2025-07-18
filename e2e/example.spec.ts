import { test, expect } from '@playwright/test';

test('homepage has title and heading', async ({ page }) => {
  await page.goto('/');

  // Expect the title to contain "Login"
  await expect(page).toHaveTitle(/Login/);

  // Expect the text "Login" to be visible on the page
  await expect(page.getByText('Login')).toBeVisible();

  // Expect the text "Don't have an account? Sign up." to be visible
  await expect(page.getByText("Don't have an account? Sign up.")).toBeVisible();
});