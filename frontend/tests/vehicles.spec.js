const { test, expect } = require('@playwright/test');
const API_URL = 'https://192.168.1.162:3000';

test.describe('Tableau de bord véhicules', () => {
  test('Affichage des véhicules après connexion', async ({ page }) => {
    // Aller à login, faire la connexion, vérifier la redirection et le contenu
    await page.goto(API_URL + '/login.html');
    await page.fill('#name', 'marc');
    await page.fill('#password', 'string');
    await Promise.all([
      page.waitForNavigation({ url: /vehicles\.html/ }),
      page.click('button[type="submit"]')
    ]);
    // Vérifier la présence des véhicules dans le tableau
    await expect(page.locator('#vehiclesTable tbody')).toContainText('FERCTYY');
    await expect(page.locator('#vehiclesTable tbody')).toContainText('OPNIQ');
  });
});
