const Vehicle = require('../models/vehicle.model');


exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.json(vehicles);
};

<<<<<<< HEAD
exports.searchByRegistration = async (req, res) => {
  const { registrationNumber } = req.params;
  const vehicle = await Vehicle.findOne({ where: { registrationNumber } });
  if (!vehicle) return res.status(404).json({ message: "Véhicule non trouvé" });
  res.json(vehicle);
};

exports.deleteVehicle = async (req, res) => {
  const deleted = await Vehicle.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: "Non trouvé" });
  res.json({ message: "Supprimé avec succès" });

}

exports.updateVehicleById = async (req, res) => {
  const [updated] = await Vehicle.update(req.body, { where: { id: req.params.id } });
  if (!updated) return res.status(404).json({ message: "Non trouvé" });
  res.json({ message: "Mis à jour avec succès" });
};
=======
exports.getVehiclesByMaxPrice = async (req, res) => {
  const { maxPrice } = req.params;
  const vehicles = await Vehicle.findAll({
    where: { rentalPrice: { [require('sequelize').Op.lte]: parseFloat(maxPrice) } }
  });
  res.json(vehicles);
};
>>>>>>> origin/searchByMaxPrice
