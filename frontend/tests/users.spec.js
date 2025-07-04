const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Gestion des utilisateurs', () => {
  test('Ajout d\'un utilisateur et présence dans la liste', async ({ page }) => {
    // Aller à login, faire la connexion, aller à users.html
    const loginPath = path.resolve(__dirname, '../src/login.html');
    const usersPath = path.resolve(__dirname, '../src/users.html');
    await page.goto('file://' + loginPath);
    await page.fill('#email', 'admin@propelize.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    await page.goto('file://' + usersPath);
    // Ajouter un utilisateur
    await page.fill('#userName', 'Charlie');
    await page.fill('#userEmail', 'charlie@propelize.com');
    await page.click('button[type="submit"]');
    // Vérifier la présence dans la liste
    await expect(page.locator('#usersList')).toContainText('Charlie');
    await expect(page.locator('#usersList')).toContainText('charlie@propelize.com');
  });
});
