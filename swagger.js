const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const getLocalIPAddress = require('./utils/getLocalIp');


const ip = getLocalIPAddress();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vehicle API",
      version: "1.0.0",
      description: "A simple Express API for managing vehicles",
    },
    servers: [
      {
        url: `https://${ip}:3000`,
        description: "Serveur dynamique basé sur l'adresse IP locale"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: ["./routes/*.js"], // Documentation via JSDoc dans les routes
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs,
  ip
};
