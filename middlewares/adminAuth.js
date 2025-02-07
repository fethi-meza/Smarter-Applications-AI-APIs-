const jwt = require('jsonwebtoken');

const AdminAuth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access Denied' });

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        
        // Set the user in the request object
        req.user = verified.user; 

        // Check if the user is an admin
        if (!req.user.is_Admin) return res.status(403).json({ error: 'Forbidden' });

        next(); 
    } catch (err) {
        console.error('Token verification error:', err); 
        res.status(400).json({ error: 'Invalid Token' });
    }
}

module.exports = AdminAuth;