const { test, expect } = require('@playwright/test');
const API_URL = 'https://192.168.1.162:3000';

test.describe('Tableau de bord véhicules', () => {
  test('Affichage des véhicules après connexion', async ({ page }) => {
    // Aller à la page de connexion
    await page.goto(API_URL + '/login.html');

    // Remplir les identifiants
    await page.fill('#name', 'marc');
    await page.fill('#password', 'string');

    // Clic et attendre redirection AJAX
    await Promise.all([
      page.waitForURL('**/vehicles.html'),
      page.click('button[type="submit"]')
    ]);

    // Attendre que les données des véhicules soient chargées (si AJAX)
    await page.waitForSelector('#vehiclesTable tbody tr');

    // Vérifier que les données attendues sont présentes
    await expect(page.locator('#vehiclesTable tbody')).toContainText('FERCTYY');
    await expect(page.locator('#vehiclesTable tbody')).toContainText('OPNIQ');
  });
});
