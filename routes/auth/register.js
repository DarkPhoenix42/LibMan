const bcrypt = require('bcrypt')
const { db, execute_query } = require('../../database/db')

function check_password(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return re.test(str)
}

const register = async (req, res) => {
    const { username, password, confirm_password } = req.body
    if (!username || !password || !confirm_password) {
        req.session.message = 'Username or password is missing.'
        return res.redirect('/register')
    }

    const username_regex = /^[a-zA-Z0-9_]{3,20}$/
    if (!username_regex.test(username)) {
        req.session.message =
            'Username must be between 3 and 20 characters long and can only contain letters, numbers, and underscores.'
        return res.redirect('/register')
    }

    if (check_password(password) === false) {
        req.session.message =
            'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one digit.'
        return res.redirect('/register')
    }

    if (password !== confirm_password) {
        req.session.message = 'Passwords do not match!'
        return res.redirect('/register')
    }

    let is_first_user = false
    let hashed_password = ''
    try {
        hashed_password = await bcrypt.hash(password, 10)
        const empty_check_query = 'SELECT EXISTS (SELECT 1 FROM users) AS contains_entries;'
        const result = await execute_query(empty_check_query)
        is_first_user = result[0].contains_entries === 0
    } catch {
        req.session.message = 'Internal server error!'
        return res.redirect('/register')
    }

    var query = `INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)`
    db.query(query, [username, hashed_password, is_first_user], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                req.session.message = 'Username already exists!'
            }

            req.session.message = 'Internal server error!'
            return res.redirect('/register')
        }

        return res.redirect('/login')
    })
}
module.exports = { register }
