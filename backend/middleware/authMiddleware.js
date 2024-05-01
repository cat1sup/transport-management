const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).send({ message: 'No token provided!' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add decoded user info to the request for use in subsequent middleware/routes
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        // Handle error from token verification (e.g., token expired, invalid, etc.)
        return res.status(401).send({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
