// On importe les modules nécessaires
import request from 'supertest';
import {describe, it, expect, beforeAll} from 'vitest';
import app from '../app';
import sequelize from '../config/database';

// Avant tous les tests, on synchronise la base de données Sequelize.
// L'option { force: false } évite de supprimer les données existantes.
beforeAll(async () => {
    await sequelize.sync({force: false});
});


// Groupe de tests nommé "Vehicle API"
describe('Vehicle API', () => {
    let vehicleId = 1;

    const vehiculeId = 1;
    console.log(vehiculeId);
    // Test 1 : Vérifie que l'on peut lister les véhicules
    it('Liste les véhicules', async () => {
        // On envoie une requête GET à /vehicles
        const res = await request(app).get('/vehicles');

        // On s'attend à une réponse HTTP 200 (OK)
        expect(res.statusCode).toBe(200);

        // On vérifie que la réponse est bien un tableau (liste de véhicules)
        expect(Array.isArray(res.body)).toBe(true);
    });


    it('Ajoute un véhicule', async () => {
        // On envoie une requête POST à /vehicles avec un corps JSON contenant les infos du véhicule
        const res = await request(app).post('/vehicles').send({
            mark: "Nissan", modele: "Juke", annee: 2020, rentalPrice: 60.00
        });

        // On s'attend à ce que la réponse HTTP ait le statut 201 (créé)
        expect(res.statusCode).toBe(201);

        // On vérifie que la réponse contient bien la marque "Nissan"
        expect(res.body.mark).toBe("Nissan");
    });


    it('Filtre par prix de location maximum', async () => {
        const res = await request(app).get('/vehicles/price/70');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].rentalPrice).toBeLessThanOrEqual(70);
    });

    it('Recherche par numéro d\'immatriculation', async () => {
        const res = await request(app).get('/vehicle/search/TEST123');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message","Véhicule trouvé");
    });

    it('Récupère un véhicule par ID', async () => {
        const res = await request(app).get(`/vehicles/${vehicleId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(vehicleId);
    });


    it('Modifie un véhicule', async () => {
        const res = await request(app).put(`/vehicles/${vehiculeId}`).send({
            mark: "BMWX",
            modele: "Toyota",
            rentalPrice: 65.0
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Mis à jour avec succès");
    });

    it('Supprime un véhicule', async () => {
        const res = await request(app).delete(`/vehicles/${vehicleId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Supprimé avec succès");
    });


});
