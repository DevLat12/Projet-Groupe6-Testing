const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const User  = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: Aucun token trouvée' });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Utilisateur non trouvé' });
        }
        req.user = { id: user.id, name: user.name};

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Unauthorized: Le token a expiré' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Forbidden: Mauvais token' });
        }
        return res.status(500).json({ message: 'Un probleme est survenue lors de la verification du token' });
    }
};

module.exports = authenticateToken;
