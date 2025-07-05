const { test, expect } = require('@playwright/test');
const API_URL = 'https://192.168.1.162:3000';

test.describe('Tableau de bord véhicules', () => {
  test('Affichage des véhicules après connexion', async ({ page }) => {

    await page.goto(API_URL + '/login.html');

    await page.fill('#name', 'marc');
    await page.fill('#password', 'string');

    await Promise.all([
      page.waitForURL('**/vehicles.html'),
      page.click('button[type="submit"]')
    ]);

    await page.waitForSelector('#vehiclesTable tbody tr');

    await expect(page.locator('#vehiclesTable tbody')).toContainText('FERCTYY');
    await expect(page.locator('#vehiclesTable tbody')).toContainText('OPNIQ');
  });
});
