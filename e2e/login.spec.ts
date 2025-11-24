import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login and view products', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[type="email"]', 'manager@demo.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Navigate to products
    await page.click('text=Products');
    await expect(page).toHaveURL('/products');
    await expect(page.locator('text=Products')).toBeVisible();
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=/invalid email/i')).toBeVisible();
  });
});

