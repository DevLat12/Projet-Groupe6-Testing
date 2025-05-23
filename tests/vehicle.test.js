// On importe les modules nécessaires
import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../app';
import sequelize from '../config/database';

// Avant tous les tests, on synchronise la base de données Sequelize.
// L'option { force: false } évite de supprimer les données existantes.
beforeAll(async () => {
  await sequelize.sync({ force: false });
});

// Groupe de tests nommé "Vehicle API"
describe('Vehicle API', () => {

  // Test 1 : Vérifie que l'on peut ajouter un véhicule
  it('Ajoute un véhicule', async () => {
    // On envoie une requête POST à /vehicles avec un corps JSON contenant les infos du véhicule
    const res = await request(app).post('/vehicles').send({
      marque: "Nissan", modele: "Juke", annee: 2020, rentalPrice: 60.00
    });

    // On s'attend à ce que la réponse HTTP ait le statut 201 (créé)
    expect(res.statusCode).toBe(201);

    // On vérifie que la réponse contient bien la marque "Nissan"
    expect(res.body.marque).toBe("Nissan");
  });

  // Test 2 : Vérifie que l'on peut lister les véhicules
  it('Liste les véhicules', async () => {
    // On envoie une requête GET à /vehicles
    const res = await request(app).get('/vehicles');

    // On s'attend à une réponse HTTP 200 (OK)
    expect(res.statusCode).toBe(200);

    // On vérifie que la réponse est bien un tableau (liste de véhicules)
    expect(Array.isArray(res.body)).toBe(true);
  });




});
