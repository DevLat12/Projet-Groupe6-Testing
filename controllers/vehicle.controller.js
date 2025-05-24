const Vehicle = require('../models/vehicle.model');


exports.getAllVehicles = async (req, res) => {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
};

exports.createVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.searchByRegistration = async (req, res) => {
    const {registrationNumber} = req.params;
    const vehicle = await Vehicle.findOne({where: {registrationNumber}});
    if (!vehicle) return res.status(404).json({message: "Véhicule non trouvé"});
    res.json({
        message: "Véhicule trouvé",
        vehicule: vehicle
    });
};

exports.deleteVehicle = async (req, res) => {
    const deleted = await Vehicle.destroy({where: {id: req.params.id}});
    if (!deleted) return res.status(404).json({message: "Non trouvé"});
    res.json({message: "Supprimé avec succès"});

}

exports.updateVehicleById = async (req, res) => {
    const [updated] = await Vehicle.update(req.body, {where: {id: req.params.id}});
    if (!updated) return res.status(404).json({message: "Non trouvé"});
    res.json({message: "Mis à jour avec succès"});
};
exports.getVehiclesByMaxPrice = async (req, res) => {
    const {maxPrice} = req.params;
    const vehicles = await Vehicle.findAll({
        where: {rentalPrice: {[require('sequelize').Op.lte]: parseFloat(maxPrice)}}
    });
    if (vehicles.length <= 0)
        res.json({message: "Aucun vehicule trouve"})
    else
        res.json(vehicles);
};

exports.getVehicleById = async (req, res) => {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({message: "Non trouvé"});
    res.json(vehicle);
};