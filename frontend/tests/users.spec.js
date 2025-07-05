const { test, expect } = require('@playwright/test');

const API_URL = 'https://192.168.1.162:3000';

test.describe('Gestion des utilisateurs', () => {
  test('Ajout d\'un utilisateur et présence dans la liste', async ({ page }) => {
    await page.goto(API_URL + '/users.html');

    await page.waitForSelector('#usersTable');

    // Ouvrir le modal
    await page.click('button[data-bs-target="#addUserModal"]');

    // Remplir le formulaire
    await page.fill('#addUserForm #userName', 'mello');
    await page.fill('#addUserForm #userPassword', 'string');

    // Cliquer pour soumettre
    await page.click('#addUserForm button[type="submit"]');

    // Attendre que l'utilisateur apparaisse dans le tableau
    await expect(page.locator('#usersTable tbody')).toContainText('mello');
  });
});
