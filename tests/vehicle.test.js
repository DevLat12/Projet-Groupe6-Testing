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
  let vehicleId = null;

  // Test 1 : Vérifie que l'on peut lister les véhicules
  it('Liste les véhicules', async () => {
    // On envoie une requête GET à /vehicles
    const res = await request(app).get('/vehicles');

    // On s'attend à une réponse HTTP 200 (OK)
    expect(res.statusCode).toBe(200);

    // On vérifie que la réponse est bien un tableau (liste de véhicules)
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Modifie un véhicule', async () => {
    const res = await request(app).put(`/vehicles/${vehicleId}`).send({
      marque: "Nissan",
      modele: "Qashqai",
      rentalPrice: 65.0
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Mis à jour avec succès");
  });


});
