const jwtConfig = require('../config/jwtConfig'); // Chemin vers votre config JWT
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateAccessToken = (user) => {
    const accessToken = jwt.sign({ id: user.id , name:user.name},
        jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

    const refreshToken = jwt.sign({ id: user.id },
        jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });

    return { accessToken, refreshToken };
}

exports.register = async (req, res) => {
    try{
        const { name, password } = req.body;

        if(!name || !password){
            return res.status(400).json({message:"Veuillez remplir toute les informations demandé"});
        }
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { name } });
        if (existingUser) {
            return res.status(409).json({ message: "L'utilisateur existe deja" });
        }

        // Créez un nouvel utilisateur
        const newUser = await User.create({ name, password });

        // Générez le token d'accès et de rafraîchissement
        const tokens = generateAccessToken(newUser);

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: {
                id: newUser.id,
                name: newUser.name,
            },
            tokens,
        });
        
    }catch (error) {
        console.error('Erreur durant le processus:', error);
        res.status(500).json({ message: 'Un probleme est survenue' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password } = req.body;

        // Vérifiez si l'utilisateur existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Mettez à jour les informations de l'utilisateur
        if (name) user.name = name;
        if (password) user.password = password;

        await user.save();

        res.status(200).json({
            message: "Utilisateur mis à jour avec succès",
            user: {
                id: user.id,
                name: user.name,
            },  
        });
    } catch (error) {
        console.error('Erreur durant le processus:', error);
        res.status(500).json({ message: 'Un probleme est survenue' });
    }
}

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

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token requis" });
    }

    jwt.verify(refreshToken, jwtConfig.refreshSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Refresh token invalide" });
        }

        // Générez un nouveau token d'accès
        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
            message: "Nouveau token d'accès généré",
            tokens: newAccessToken,
        });
    });
}
