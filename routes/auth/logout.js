const logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/login')
}

module.exports = { logout }
