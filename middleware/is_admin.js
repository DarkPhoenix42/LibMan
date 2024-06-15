const jwt = require('jsonwebtoken');

const admin_mware = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).redirect('login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        if (decoded.user.is_admin) {
            next();
        }
        else {
            return res.status(401).json({ message: 'Unauthorised' });
        }

    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = admin_mware;