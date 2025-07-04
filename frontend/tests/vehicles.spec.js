const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Tableau de bord véhicules', () => {
  test('Affichage des véhicules après connexion', async ({ page }) => {
    // Aller à login, faire la connexion, vérifier la redirection et le contenu
    const loginPath = path.resolve(__dirname, '../src/login.html');
    await page.goto('file://' + loginPath);
    await page.fill('#email', 'admin@propelize.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    expect(page.url()).toContain('vehicles.html');
    // Vérifier la présence d'un véhicule
    await expect(page.locator('table')).toContainText('Tesla Model S');
    await expect(page.locator('table')).toContainText('Renault Zoe');
  });
});
