function get_message(req) {
    let message
    if (req.session.message !== undefined) {
        message = req.session.message
        req.session.message = undefined
    }
    return message
}

const login_view = (req, res) => {
    let message = get_message(req)
    return res.render('auth/login.ejs', { message: message, msg_type: 'error' })
}

const register_view = (req, res) => {
    let message = get_message(req)
    return res.render('auth/register.ejs', { message: message, msg_type: 'error' })
}

module.exports = { login_view, register_view }
