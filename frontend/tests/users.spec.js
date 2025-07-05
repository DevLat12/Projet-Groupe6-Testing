const { test, expect } = require('@playwright/test');
const API_URL = 'https://192.168.1.162:3000';

test.describe('Gestion des utilisateurs', () => {
  test('Ajout d\'un utilisateur et présence dans la liste', async ({ page }) => {
    // Aller à login, faire la connexion, aller à users.html
    // Connexion
    await page.goto(API_URL + '/login.html');
    await page.fill('#name', 'marc');
    await page.fill('#password', 'string');
    await Promise.all([
      page.waitForNavigation({ url: /vehicles\.html/ }),
      page.click('button[type="submit"]')
    ]);
    await Promise.all([
      page.waitForNavigation({ url: /users\.html/ }),
      page.click('a[href="users.html"]') // clique sur le lien du menu pour aller sur users.html
    ]);
    // Ouvre le modal d'ajout
    await page.click('button[data-bs-target="#addUserModal"]');
    // Remplis le formulaire dans le modal
    await page.fill('#addUserForm #userName', 'mello');
    await page.fill('#addUserForm #userPassword', 'string');
    await page.click('#addUserForm button[type="submit"]');
    // Vérifier la présence dans la table
    await expect(page.locator('#usersTable tbody')).toContainText('mello');
  });
});
