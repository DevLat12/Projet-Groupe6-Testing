const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401).json({ message: "Token d'accès requis" });


    jwt.verify(token, jwtConfig.secret, (err, user) => {
        if (err) return res.sendStatus(403).json({ message: "Token invalide" });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;