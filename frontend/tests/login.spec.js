const { test, expect } = require('@playwright/test');

const API_URL = 'https://192.168.1.162:3000';

test.describe('Page de connexion Propelize', () => {

  test('Connexion réussie avec bons identifiants', async ({ page }) => {
    await page.goto(API_URL + '/login.html');
    await page.fill('#name', 'marc');
    await page.fill('#password', 'string');

    await page.click('button[type="submit"]')
    await expect(page.locator('#success')).toHaveText('Connexion réussie');
    // expect(page.url()).toContain('vehicles.html');
  });

  test('Erreur si mauvais identifiants', async ({ page }) => {
    await page.goto(API_URL + '/login.html');
    await page.fill('#name', 'wrong');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('#error')).toHaveText('Erreur lors de la connexion');
  });
});
