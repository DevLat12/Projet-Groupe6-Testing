const Vehicle = require('../models/vehicle.model');
const sequelize = require('../config/database');

const seed = async () => {
  await sequelize.sync({ force: true });
  await Vehicle.bulkCreate([
   {  registrationNumber: 'AA123BB', mark: 'Toyota', modele: 'Corolla', annee: 2019, rentalPrice: 45.99 },
   { registrationNumber: 'BB456CC', mark: 'Ford', modele: 'Transit', annee: 2021, rentalPrice: 80.50  },
   { registrationNumber: 'CC789DD', mark: 'Honda', modele: 'Civic', annee: 2018, rentalPrice: 55.00  }  
  ]);
  console.log("Seed terminé");
};

seed();
