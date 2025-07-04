const { test, expect } = require('@playwright/test');
const path = require('path');

// Tester la page login.html en local (file://)
test.describe('Page de connexion Propelize', () => {
  test('Connexion réussie avec bons identifiants', async ({ page }) => {
    const filePath = path.resolve(__dirname, '../src/login.html');
    await page.goto('file://' + filePath);
    await page.fill('#email', 'admin@propelize.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300); // attendre la redirection
    expect(page.url()).toContain('vehicles.html');
  });

  test('Erreur si mauvais identifiants', async ({ page }) => {
    const filePath = path.resolve(__dirname, '../src/login.html');
    await page.goto('file://' + filePath);
    await page.fill('#email', 'wrong@propelize.com');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('#error')).toHaveText('Identifiants invalides');
  });
});
