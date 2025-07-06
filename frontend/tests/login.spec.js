const {test, expect} = require('@playwright/test');

// Définir l'URL de base du backend (adapter le port/IP si besoin)
const BASE_URL = 'https://localhost:3000';

test.describe('Page de connexion Propelize', () => {

    // Données de test
    const data = {
        name: 'mello',
        password: 'string'
    };
    // Créer l'utilisateur de test avant tous les tests
    test.beforeAll(async ({request}) => {
        
        // Créer un nouvel utilisateur
        const response = await request.post(`${BASE_URL}/auth/register`, {
            data: {
                name: data.name,
                password: data.password
            }
        });
        // Accepte 201 (créé) ou 409 (déjà existant)
        test.expect([201, 409]).toContain(response.status());
    });

    test('Connexion réussie avec bons identifiants', async ({page}) => {

        await page.goto(`${BASE_URL}/login.html`);
        await page.fill('#name', data.name);
        await page.fill('#password', data.password);

        await page.click('button[type="submit"]')
        await expect(page.locator('#success')).toHaveText('Connexion réussie');
        // expect(page.url()).toContain('vehicles.html');
    });

    test('Erreur si mauvais identifiants', async ({page}) => {
        await page.goto(`${BASE_URL}/login.html`);
        await page.fill('#name', 'wrong');
        await page.fill('#password', 'wrongpass');
        await page.click('button[type="submit"]');
        await expect(page.locator('#error')).toHaveText('Erreur lors de la connexion');
    });
});
