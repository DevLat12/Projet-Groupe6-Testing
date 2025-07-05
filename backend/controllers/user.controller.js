const user = require('../models/user.model');


exports.getAllUser = async (req, res) => {
    const users = await  user.findAll();
    res.json(users);
};

exports.createUser = async (req, res) => {
    try {
        const user = await user.create(req.body);
        res.status(201).json({message:"Véhicule crée avec succès", user: user});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};



exports.deleteUser = async (req, res) => {
    const deleted = await user.destroy({where: {id: req.params.id}});
    if (!deleted) return res.status(404).json({message: "Non trouvé"});
    res.json({message: "Supprimé avec succès"});
}

exports.updateUserById = async (req, res) => {
    const [updated] = await user.update(req.body, {where: {id: req.params.id}});
    if (!updated) return res.status(404).json({message: "Non trouvé"});
    res.json({message: "Mis à jour avec succès"});
};


exports.getUserById = async (req, res) => {
    const user = await user.findByPk(req.params.id);
    if (!user) return res.status(404).json({message: "Non trouvé"});
    res.json(user);
};