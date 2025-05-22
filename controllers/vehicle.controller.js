const Vehicle = require('../models/vehicle.model');


exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.json(vehicles);
};

exports.updateVehicleById = async (req, res) => {
  const [updated] = await Vehicle.update(req.body, { where: { id: req.params.id } });
  if (!updated) return res.status(404).json({ message: "Non trouvé" });
  res.json({ message: "Mis à jour avec succès" });
};
