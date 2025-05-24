import request from 'supertest';
import {describe, it, expect, beforeAll, beforeEach, afterAll} from 'vitest';
import app from '../app';
import sequelize from '../config/database';
import User from '../models/user.model';


let accessToken = null;
let refreshToken = null;
let testUser = null;

const testUserCredentials = {
    name: `testuser_${Date.now()}`, password: 'password123',
};

beforeAll(async () => {
    await sequelize.sync({force: false});
});

beforeEach(async () => {
    await User.destroy({where: {}, truncate: true, cascade: true});
    accessToken = null;
    refreshToken = null;
    testUser = null;
});

afterAll(async () => {
    await User.destroy({where: {}, truncate: true, cascade: true});
    await sequelize.close();
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