import request from 'supertest';
import {describe, it, expect, beforeAll,beforeEach,afterAll} from 'vitest';
import app from '../app';
import sequelize from '../config/database';

const User = require("../models/user.model");

// Variables pour stocker les tokens entre les tests
let accessToken = null;
let refreshToken = null;
let testUser = null;

const testUserCredentials = {
    name: `testuser_${Date.now()}`, // Nom d'utilisateur unique pour chaque exécution de test
    password: 'password123',
};

const vehicleApiPrefix = '/api'; // Si vous avez un préfixe global pour vos API
                                 // Sinon, laissez vide ou adaptez aux routes spécifiques

beforeAll(async () => {
    await sequelize.sync({ force: false });
});

beforeEach(async () => {
    // Nettoyer la table User avant chaque test pour éviter les conflits
    await User.destroy({ where: {}, truncate: true, cascade: true }); // 'cascade' si des relations existent
    accessToken = null;
    refreshToken = null;
    testUser = null;
});

afterAll(async () => {
    // Nettoyage final si nécessaire et fermeture de la connexion
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await sequelize.close();
});

describe('/authentication API', () => {
    describe('POST /auth/register', () => {
        it('devrait enregistrer un nouvel utilisateur avec succès', async () => {
            const res = await request(app)
                .post(`/auth/register`)
                .send(testUserCredentials);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Utilisateur créé avec succès');
            expect(res.body).toHaveProperty('user');
            testUser = res.body.user; // Sauvegarder pour d'autres tests si besoin
        });

        it('devrait retourner une erreur 409 si l\'utilisateur existe déjà', async () => {
            // Enregistrer l'utilisateur une première fois
            await request(app)
                .post(`/auth/register`)
                .send(testUserCredentials);

            // Tenter de l'enregistrer à nouveau
            const res = await request(app)
                .post(`/auth/register`)
                .send(testUserCredentials);

            expect(res.statusCode).toBe(409);
            expect(res.body).toHaveProperty('message', 'L\'utilisateur existe deja');
        });

        it('devrait retourner une erreur 400 si le nom ou le mot de passe est manquant', async () => {
            const res = await request(app)
                .post(`/auth/register`)
                .send({ name: 'test' /* password manquant */ });
            expect(res.statusCode).toBe(400);

            const res2 = await request(app)
                .post(`/auth/register`)
                .send({ password: 'password123' /* name manquant */ });
            expect(res2.statusCode).toBe(400);
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            // S'assurer qu'un utilisateur de test existe avant les tests de login
            await request(app)
                .post(`/auth/register`)
                .send(testUserCredentials);
        });

        it('devrait connecter un utilisateur avec des identifiants valides et retourner des tokens', async () => {
            const res = await request(app)
                .post(`/auth/login`)
                .send(testUserCredentials);

            expect(res.statusCode).toBe(200);
            expect(res.body.tokens).toHaveProperty('accessToken');
            expect(res.body.tokens).toHaveProperty('refreshToken');
            expect(res.body.user.name).toBe(testUserCredentials.name);

            // Stocker les tokens pour les tests suivants
            accessToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
        });

        it('devrait retourner une erreur 401 pour un mot de passe incorrect', async () => {
            const res = await request(app)
                .post(`/auth/login`)
                .send({ name: testUserCredentials.name, password: 'wrongpassword' });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Mot de passe incorrect');
        });

        it('devrait retourner une erreur 401 pour un utilisateur inexistant', async () => {
            const res = await request(app)
                .post(`/auth/login`)
                .send({ name: 'nonexistentuser', password: 'password123' });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Nom d\'utilisateur ou mot de passe incorrect');
        });
    });

    describe('Accès aux routes protégées (Véhicules)', () => {
        // Utiliser une route que vous avez marquée comme protégée, par exemple POST /vehicles
        const protectedRoute = `/vehicles/`; // Endpoint pour créer un véhicule

        beforeEach(async () => {
            // Enregistrer et connecter un utilisateur pour obtenir un token valide
            await request(app)
                .post(`/auth/register`)
                .send(testUserCredentials);
            const loginRes = await request(app)
                .post(`/auth/login`)
                .send(testUserCredentials);
            accessToken = loginRes.body.accessToken;
            refreshToken = loginRes.body.refreshToken; // Au cas où on teste le refresh
        });

        it('devrait refuser l\'accès à une route protégée sans token', async () => {
            const res = await request(app)
                .post(protectedRoute) // Tenter de créer un véhicule
                .send({ mark: "Test", modele: "TestModel", registrationNumber: `TEST${Date.now()}`, rentalPrice: 50 });
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid or missing token');
        });

        it('devrait refuser l\'accès à une route protégée avec un token invalide/malformé', async () => {
            const res = await request(app)
                .post(protectedRoute)
                .set('/authorization', 'Bearer aninvalidtoken')
                .send({ mark: "Test", modele: "TestModel", registrationNumber: `TEST${Date.now()}`, rentalPrice: 50 });
            expect(res.statusCode).toBe(403); // Ou 401 selon votre implémentation du middleware
            expect(res.body).toHaveProperty('message', 'Forbidden: Invalid token');
        });

        it('devrait autoriser l\'accès à une route protégée avec un token valide', async () => {
            const res = await request(app)
                .post(protectedRoute)
                .set('/authorization', `Bearer ${accessToken}`)
                .send({ mark: "Test/auth", modele: "TestModel/auth", registrationNumber: `TEST/auth${Date.now()}`, rentalPrice: 55 });

            expect(res.statusCode).toBe(201); // Succès de la création du véhicule
            expect(res.body).toHaveProperty('mark', 'Test/auth');
        });

        // Test pour token expiré (plus complexe à mettre en place car il faut manipuler le temps ou attendre)
        // Pour simplifier, on peut le tester manuellement ou utiliser des librairies de mock de temps (comme `sinon` avec `useFakeTimers`)
        // Ou générer un token avec une expiration très courte dans le test.
    });

    describe('POST /auth/refresh-token', () => {
        beforeEach(async () => {
            await request(app)
                .post(`/auth/register`)
                .send(testUserCredentials);
            const loginRes = await request(app)
                .post(`/auth/login`)
                .send(testUserCredentials);
            refreshToken = loginRes.body.refreshToken; // On a besoin d'un refresh token valide
        });

        it('devrait retourner un nouvel accessToken avec un refreshToken valide', async () => {
            const res = await request(app)
                .post(`/auth/refresh-token`)
                .send({ token: refreshToken });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken'); // Si vous renvoyez aussi un nouveau refresh token
            expect(res.body.accessToken).not.toBe(accessToken); // Doit être différent de l'ancien
        });

        it('devrait retourner une erreur 401 si aucun refresh token n\'est fourni', async () => {
            const res = await request(app)
                .post(`/auth/refresh-token`)
                .send({}); // Pas de token

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Refresh token not provided');
        });

        it('devrait retourner une erreur 403 pour un refreshToken invalide/malformé', async () => {
            const res = await request(app)
                .post(`/auth/refresh-token`)
                .send({ token: 'aninvalidrefreshtoken' });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Invalid refresh token');
        });

    });
});

