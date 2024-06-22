const bcrypt = require('bcrypt');
const { db, execute_query } = require('../database/db');
const jwt = require('jsonwebtoken');

const login_view = (req, res) => {
    return res.render('../views/auth/login.ejs');
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).render('login', { message: 'Username or password is missing.' });
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    try {
        results = await execute_query(query, [username]);
        if (results.length === 0) {
            return res.status(400).render('login', { message: 'Username or password incorrect!' });
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).render('login', { message: 'Internal server error!' });
            }

            if (!result) {
                return res.status(400).render('login', {
                    message: 'Username or password incorrect!'
                });
            }
            const token = jwt.sign(
                { user: { id: user.user_id, is_admin: user.is_admin, username: user.username } },
                process.env.JWT_SECRET,
                { expiresIn: "120m" }
            );

            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                maxAge: 7200000,
            });
            return res.redirect('/');

        });
    }
    catch {
        return res.status(500).render('login', { message: 'Internal server error!' });
    }

};



const register_view = (req, res) => {
    return res.render('../views/auth/register.ejs');
};


function check_password(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
};

const register = async (req, res) => {

    const { username, password, confirm_password } = req.body;
    if (!username || !password || !confirm_password) {
        return res.status(400).render('register', { message: 'Username or password is missing.' });
    }

    const username_regex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!username_regex.test(username)) {
        return res.status(400).render('register', { message: 'Username must be between 3 and 20 characters long and can only contain letters, numbers, and underscores.' });
    }

    if (check_password(password) === false) {
        return res.status(400).render('register', { message: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one digit.' });
    }

    if (password !== confirm_password) {
        return res.status(400).render('register', { message: 'Passwords do not match!' });
    }

    let is_first_user = false;
    let hashed_password = '';
    try {
        hashed_password = await bcrypt.hash(password, 10);
        const empty_check_query = 'SELECT EXISTS (SELECT 1 FROM users) AS contains_entries;';
        const result = await execute_query(empty_check_query);
        is_first_user = ((result[0].contains_entries) === 0);
    }
    catch {
        return res.status(500).render('register', { message: 'Internal server error!' });
    }

    var query = `INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)`;
    db.query(query, [username, hashed_password, is_first_user], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(500).render('register', { message: 'Username already exists!' });
            }
            return res.status(500).render('register', { message: 'Internal server error!' });
        }

        return res.redirect('/login');
    });
};

const logout = (req, res) => {
    res.clearCookie("jwt");
    return res.redirect("/login");
};

module.exports = { login_view, login, register_view, register, logout };
