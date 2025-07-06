import request from 'supertest';
import {describe, it, expect, beforeAll, beforeEach, afterAll} from 'vitest';
import app from '../../app';

let accessToken = null;
let refreshToken = null;
let testUser = null;

const testUserCredentials = {
    name: `testuser_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    password: 'password123',
};


describe('API d\'authentification', () => {
    describe('POST /auth/register', () => {
        it('devrait enregistrer un nouvel utilisateur avec succès', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(testUserCredentials);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Utilisateur créé avec succès');
            expect(res.body).toHaveProperty('user');
            testUser = res.body.user;
        });

        it('devrait retourner une erreur 409 si l\'utilisateur existe déjà', async () => {
            await request(app)
                .post('/auth/register')
                .send(testUserCredentials);

            const res = await request(app)
                .post('/auth/register')
                .send(testUserCredentials);

            expect(res.statusCode).toBe(409);
            expect(res.body).toHaveProperty('message', 'L\'utilisateur existe deja');
        });

        it('devrait retourner une erreur 400 si le nom ou le mot de passe est manquant', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({name: 'test'});
            expect(res.statusCode).toBe(400);

            const res2 = await request(app)
                .post('/auth/register')
                .send({password: 'password123'});
            expect(res2.statusCode).toBe(400);
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/auth/register')
                .send(testUserCredentials);
        });

        it('devrait connecter un utilisateur avec des identifiants valides et retourner des jetons', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send(testUserCredentials);

            expect(res.statusCode).toBe(200);
            expect(res.body.tokens).toHaveProperty('accessToken');
            expect(res.body.tokens).toHaveProperty('refreshToken');
            expect(res.body.user.name).toBe(testUserCredentials.name);

            accessToken = res.body.tokens.accessToken;
            refreshToken = res.body.tokens.refreshToken;
        });

        it('devrait retourner une erreur 401 pour un mot de passe incorrect', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    name: testUserCredentials.name, password: 'mauvaisMotDePasse'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Mot de passe incorrect');
        });

        it('devrait retourner une erreur 401 pour un utilisateur inexistant', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    name: 'utilisateurInexistant', password: 'password123'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Nom d\'utilisateur ou mot de passe incorrect');
        });
    });

    describe('Routes protégées (Véhicules)', () => {
        const routeProtegee = '/vehicles';

        beforeEach(async () => {
            await request(app)
                .post('/auth/register')
                .send(testUserCredentials);
            const loginRes = await request(app)
                .post('/auth/login')
                .send(testUserCredentials);
            accessToken = loginRes.body.tokens.accessToken;
            refreshToken = loginRes.body.tokens.refreshToken;
        });

        it('devrait refuser l\'accès sans jeton', async () => {
            const res = await request(app)
                .post(routeProtegee)
                .send({
                    mark: "Test", modele: "ModèleTest", registrationNumber: `TEST${Date.now()}`, rentalPrice: 50
                });
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized: Aucun token trouvée');
        });

        it('devrait refuser l\'accès avec un jeton invalide', async () => {
            const res = await request(app)
                .post(routeProtegee)
                .set('Authorization', 'Bearer jetonInvalide')
                .send({
                    mark: "Test", modele: "ModèleTest", registrationNumber: `TEST${Date.now()}`, rentalPrice: 50
                });
            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Forbidden: Mauvais token');
        });

        it('devrait autoriser l\'accès avec un jeton valide', async () => {
            const res = await request(app)
                .post(routeProtegee)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    mark: "Test/auth",
                    modele: "ModèleTest/auth",
                    registrationNumber: `TEST/auth${Date.now()}`,
                    rentalPrice: 55
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.vehicule).toHaveProperty('mark', 'Test/auth');
        });
    });

    describe('POST /auth/refresh-token', () => {
        beforeEach(async () => {
            await request(app)
                .post('/auth/register')
                .send(testUserCredentials);
            const loginRes = await request(app)
                .post('/auth/login')
                .send(testUserCredentials);
            refreshToken = loginRes.body.tokens.refreshToken;
        });

        it('devrait retourner un nouveau jeton d\'accès avec un jeton de rafraîchissement valide', async () => {
            const res = await request(app)
                .post('/auth/refresh-token')
                .send({refreshToken});

            expect(res.statusCode).toBe(200);
            expect(res.body.tokens).toHaveProperty('accessToken');
            expect(res.body.tokens).toHaveProperty('refreshToken');
            expect(res.body.tokens.accessToken).not.toBe(accessToken);
        });

        it('devrait retourner une erreur 401 si aucun jeton de rafraîchissement n\'est fourni', async () => {
            const res = await request(app)
                .post('/auth/refresh-token')
                .send({});

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Refresh token requis');
        });

        it('devrait retourner une erreur 403 pour un jeton de rafraîchissement invalide', async () => {
            const res = await request(app)
                .post('/auth/refresh-token')
                .send({refreshToken: 'invalid-refresh-token'});

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Refresh token invalide');
        });
    });
});