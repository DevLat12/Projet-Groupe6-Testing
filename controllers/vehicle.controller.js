const Vehicle = require('../models/vehicle.model');


exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.json(vehicles);
};

exports.searchByRegistration = async (req, res) => {
  const { registrationNumber } = req.params;
  const vehicle = await Vehicle.findOne({ where: { registrationNumber } });

  if (!vehicle) return res.status(404).json({ message: "Véhicule non trouvé" });
  res.json(vehicle);
};