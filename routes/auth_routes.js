const { login_view, register_view } = require('./auth/views')
const { login } = require('./auth/login')
const { register } = require('./auth/register')
const { logout } = require('./auth/logout')

module.exports = { login_view, login, register_view, register, logout }
