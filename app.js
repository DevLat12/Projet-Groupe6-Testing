// const express = require('express');
// const https = require('https');
// const fs = require('fs');
// const path = require('path');
// const vehicleRoutes = require('./routes/vehicle.routes');
// const sequelize = require('./config/database');
// const getLocalIPAddress = require('./utils/getLocalIp');
// const generateSSL = require('./utils/generateSSL');
// const { swaggerUi, specs , ip } = require('./swagger');


// const app = express();
// app.use(express.json());
// app.use('/vehicles', vehicleRoutes);

// sequelize.authenticate()
//   .then(() => console.log("Connexion à la base de données réussie."))
//   .catch(err => console.error("Erreur de connexion à la base de données :", err));

// if (require.main === module) {
//   const ip = getLocalIPAddress();
//   const ssl = generateSSL(ip);
//   const PORT = 3000;

//   https.createServer({ key: ssl.key, cert: ssl.cert }, app)
//     .listen(PORT, ip, () => {
//       console.log(`Serveur sécurisé lancé sur https://${ip}:${PORT}`);
//     });
// }

// app.get('/', (req, res) => {
//   res.send('Bienvenue sur l\'API Propelize 🚗 ! Utilisez /vehicles pour accéder aux données.');
// });

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// module.exports = app;

const express = require('express');
const https = require('https');
const fs = require('fs');
const vehicleRoutes = require('./routes/vehicle.routes');
const sequelize = require('./config/database');
const { swaggerUi, specs, ip } = require('./swagger');
const generateSSL = require('./utils/generateSSL');

const app = express();
app.use(express.json());

// Point d’entrée Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes de l’API
app.use('/vehicles', vehicleRoutes);

// Connexion à la base
sequelize.authenticate()
  .then(() => console.log("Connexion à la base réussie"))
  .catch(err => console.error("Erreur de DB :", err));

if (require.main === module) {
  const ssl = generateSSL(ip);
  const PORT = 3000;

  https.createServer({ key: ssl.key, cert: ssl.cert }, app)
    .listen(PORT, ip, () => {
      console.log(`🚀 Serveur HTTPS lancé : https://${ip}:${PORT}`);
      console.log(`📘 Swagger UI dispo : https://${ip}:${PORT}/api-docs`);
    });
}

module.exports = app;
