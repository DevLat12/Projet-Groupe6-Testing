// src/config/jwtConfig.js
require('dotenv').config({ path: '../.env' }); // Ajustez le chemin si nécessaire

module.exports = {
    secret: process.env.ACCESS_TOKEN_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
};