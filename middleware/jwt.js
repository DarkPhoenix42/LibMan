const jwt = require('jsonwebtoken')

const jwt_middleware = (req, res, next) => {
    const token = req.cookies.jwt

    if (!token) {
        return res.status(401).redirect('login')
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token!' })
    }
}

module.exports = jwt_middleware
