const jwt = require('jsonwebtoken');

const checkRole = (allowedRoles = ['admin', 'scorer']) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: Unauthorized role." });
        }
        next();
    };
};

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token; // or req.cookies.jwt, depending on your cookie name

        if (!token) {
            return res.status(401).json({ message: "Authentication required. No token found." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Session expired or invalid token. Please log in again." });
    }
};


module.exports = { checkRole, auth };