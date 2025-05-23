const Vehicle = require('../models/vehicle.model');


exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.json(vehicles);
};

exports.getVehiclesByMaxPrice = async (req, res) => {
  const { maxPrice } = req.params;
  const vehicles = await Vehicle.findAll({
    where: { rentalPrice: { [require('sequelize').Op.lte]: parseFloat(maxPrice) } }
  });
  res.json(vehicles);
};
