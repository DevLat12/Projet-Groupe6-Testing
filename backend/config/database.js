const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'propelize',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '', {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        logging: false,
        dialect: 'mysql',
    }
);

module.exports = sequelize;
