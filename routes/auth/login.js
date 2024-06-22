const bcrypt = require('bcrypt')
const { db, execute_query } = require('../../database/db')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        req.session.message = 'Username or password is missing.'
        return res.redirect('/login')
    }

    const query = `SELECT * FROM users WHERE username = ?`
    try {
        results = await execute_query(query, [username])
        if (results.length === 0) {
            req.session.message = 'Username or password incorrect!'
            return res.redirect('/login')
        }
        const user = results[0]
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                req.session.message = 'Internal server error!'
                return res.redirect('/login')
            }

            if (!result) {
                req.session.message = 'Username or password incorrect!'
                return res.redirect('/login')
            }

            const token = jwt.sign(
                { user: { id: user.user_id, is_admin: user.is_admin, username: user.username } },
                process.env.JWT_SECRET,
                { expiresIn: '120m' },
            )

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                maxAge: 7200000,
            })
            return res.redirect('/')
        })
    } catch {
        req.session.message = 'Internal server error!'
        return res.redirect('/login')
    }
}

module.exports = { login }
