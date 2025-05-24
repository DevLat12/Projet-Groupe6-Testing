const jwtConfig = require('../config/jwtConfig'); // Chemin vers votre config JWT
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');



exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;

        if(!name || !password)
        {
            return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
        }
        // Vérifiez si l'utilisateur existe
        const user = await User.findOne({ where: { name } });
        if (!user) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }

        // Vérifiez le mot de passe
        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Générez le token d'accès et de rafraîchissement
        const tokens = generateAccessToken(user);

        res.status(200).json({
            message: "Connexion réussie",
            user: {
                id: user.id,
                name: user.name,
            },
            tokens,
        });
    } catch (error) {
        console.error('Erreur durant le processus:', error);
        res.status(500).json({ message: 'Un probleme est survenue' });
    }
}