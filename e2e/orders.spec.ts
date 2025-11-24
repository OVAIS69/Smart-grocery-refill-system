import { test, expect } from '@playwright/test';

test.describe('Order Management', () => {
  test('should login as supplier and update order status', async ({ page }) => {
    // Login as supplier
    await page.goto('/login');
    await page.fill('input[type="email"]', 'supplier@demo.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Navigate to orders
    await page.click('text=Orders');
    await expect(page).toHaveURL('/orders');

    // Check if orders are visible
    const ordersTable = page.locator('table');
    if (await ordersTable.isVisible()) {
      // Try to update order status if there are orders
      const updateButton = page.locator('button:has-text("Update Status")').first();
      if (await updateButton.isVisible()) {
        await updateButton.click();
        // Select a new status
        await page.click('button:has-text("confirmed")');
        await expect(page.locator('text=/success/i')).toBeVisible();
      }
    }
  });

  test('should create order from products page', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'manager@demo.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Go to products
    await page.click('text=Products');
    await expect(page).toHaveURL('/products');

    // Click order button on first product
    const orderButton = page.locator('button:has-text("Order")').first();
    if (await orderButton.isVisible()) {
      await orderButton.click();
      // Should show success message or redirect
      await expect(page.locator('text=/success/i').or(page.locator('text=/order/i'))).toBeVisible();
    }
  });
});

