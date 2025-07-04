const Vehicle = require('../models/vehicle.model');
const User = require('../models/user.model');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await sequelize.sync({ force: true });
  await Vehicle.bulkCreate([
   {  registrationNumber: 'AA123BB', mark: 'Toyota', modele: 'Corolla', annee: 2019, rentalPrice: 45.99 },
   { registrationNumber: 'BB456CC', mark: 'Ford', modele: 'Transit', annee: 2021, rentalPrice: 80.50  },
   { registrationNumber: 'CC789DD', mark: 'Honda', modele: 'Civic', annee: 2018, rentalPrice: 55.00  }  
  ]);

    await User.bulkCreate([
        {username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'admin'},
        {username: 'user1', password: await bcrypt.hash('user123', 10), role: 'user'},
        {username: 'user2', password: await bcrypt.hash('user456', 10), role: 'user'}
    ]);
  console.log("Seed terminé");
};

seed();
