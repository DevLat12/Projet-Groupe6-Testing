const { test, expect } = require('@playwright/test');
const API_URL = 'https://localhost:3000';
const data = {
  name: 'mello',
  password: 'string'
};
test.describe('Tableau de bord véhicules', () => {
  test('Affichage des véhicules après connexion', async ({ page }) => {

    await page.goto(API_URL + '/login.html');

    await page.fill('#name', data.name);
    await page.fill('#password', data.password);

    await Promise.all([
      page.waitForURL('**/vehicles.html'),
      page.click('button[type="submit"]')
    ]);

    await page.waitForSelector('#vehiclesTable tbody tr');
    await expect(page.locator('#vehiclesTable tbody tr')).toHaveCount(1);
  });
});
