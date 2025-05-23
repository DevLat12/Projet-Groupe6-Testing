const Vehicle = require('../models/vehicle.model');


exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.json(vehicles);
};

exports.deleteVehicle = async (req, res) => {
  const deleted = await Vehicle.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: "Non trouvé" });
  res.json({ message: "Supprimé avec succès" });
};

