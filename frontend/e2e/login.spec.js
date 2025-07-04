const { test, expect,request } = require('@playwright/test');
const getLocalIPAddress = require('../../backend/utils/getLocalIP');
const app = require("../../backend/app");


const testUserCredentials = {
  name: `testuser_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  password: 'password123',
};

const IP = getLocalIPAddress();
const API_URL = `https://${IP}:3000`;

test.describe('Page de Connexion', () => {

  test('un utilisateur peut se connecter avec des identifiants valides', async ({ page }) => {
    // 1. Naviguer vers la page de connexion
    await page.goto(`${API_URL}/auth/login`);

    // 2. Remplir les champs du formulaire
    // Remplacez 'input[name="email"]' par le sélecteur réel de votre champ email
    await page.locator('input[name="name"]').fill('testuser_1751505280158_9n6m');
    // Remplacez 'input[name="password"]' par le sélecteur réel de votre champ mot de passe
    await page.locator('input[name="password"]').fill('$2b$10$H3hJy1ho3L78TfQcblk5/O4KpHgrOIWTBwI8KBy2GnyyNKmtbrUKS');

    // 3. Cliquer sur le bouton de connexion
    // Remplacez 'button[type="submit"]' par le sélecteur de votre bouton
    await page.locator('button[type="submit"]').click();

  });

});
