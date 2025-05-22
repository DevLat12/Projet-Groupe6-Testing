const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  registrationNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  mark: { type: DataTypes.STRING, allowNull: false },
  modele: { type: DataTypes.STRING, allowNull: false },
  annee: { type: DataTypes.INTEGER },
  rentalPrice: { type: DataTypes.DOUBLE, allowNull: false }
});

module.exports = Vehicle;
