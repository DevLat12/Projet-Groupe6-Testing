const Vehicle = require('../models/vehicle.model');


exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.json(vehicles);
};


