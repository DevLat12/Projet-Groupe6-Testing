// On importe les modules nécessaires
import request from 'supertest';
import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import app from '../app';
import sequelize from '../config/database';



let accessTokenVehicule = null;
let refreshTokenVehicule = null;
let vehiculeId = 1;

afterAll(async () => {
    await sequelize.query(`DELETE from vehicles`)
    // Supprimer l'utilisateur de test (si tu as une route admin ou accès direct à la base)
    await sequelize.query(`DELETE FROM users `);
});


// Groupe de tests nommé "Vehicle API"
describe('Vehicle API', () => {
    it('Inscrit et connecte un utilisateur', async () => {
        await request(app)
            .post('/auth/register')
            .send({ name: "testuser", password: "password123" });

        const loginRes = await request(app)
            .post('/auth/login')
            .send({ name: "testuser", password: "password123" });

        accessTokenVehicule = loginRes.body.tokens.accessToken;
        refreshTokenVehicule = loginRes.body.tokens.refreshToken;

        expect(accessTokenVehicule).toBeDefined();
    });

    // Test 1 : Vérifie que l'on peut lister les véhicules
    it('Liste les véhicules', async () => {
        // On envoie une requête GET à /vehicles
        const res =  await request(app).get('/vehicles');

        // On s'attend à une réponse HTTP 200 (OK)
        expect(res.statusCode).toBe(200);

        // On vérifie que la réponse est bien un tableau (liste de véhicules)
        expect(Array.isArray(res.body)).toBe(true);
    });


    it('Ajoute un véhicule', async () => {
        const res = await request(app).post('/vehicles')
            .set('Authorization', `Bearer ${accessTokenVehicule}`)
            .send({
                modele: "Juke",
                mark: "Nissan",
                annee: 2020,
                rentalPrice: 60.00,
                registrationNumber: "TEST123"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.vehicule.mark).toBe("Nissan");
        vehiculeId = res.body.vehicule.id;
    });


    it('Filtre par prix de location maximum', async () => {
        const res =  await request(app).get('/vehicles/price/60');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].rentalPrice).toBeLessThanOrEqual(70);
    });

    it('Recherche par numéro d\'immatriculation', async () => {
        const res = await request(app).get('/vehicles/search/TEST123');
        expect(res.statusCode).toBe(200);
        expect(res.body.vehicule.registrationNumber).toBe("TEST123");
    });

    it('Récupère un véhicule par ID', async () => {
        const res = await request(app).get(`/vehicles/${vehiculeId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(vehiculeId);
    });


    it('Modifie un véhicule', async () => {
        const res = await request(app).put(`/vehicles/${vehiculeId}`)
            .set('Authorization', `Bearer ${accessTokenVehicule}`)
            .send({
            mark: "BMWX",
            modele: "Toyota",
            rentalPrice: 65.0
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Mis à jour avec succès");
    });

    it('Supprime un véhicule', async () => {
        const res = await request(app).delete(`/vehicles/${vehiculeId}`).set('Authorization', `Bearer ${accessTokenVehicule}`)
        ;
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Supprimé avec succès");
    });


});