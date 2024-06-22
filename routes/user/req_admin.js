const { db, execute_query } = require('../../database/db')

const request_admin = async (req, res) => {
    let user_id = req.user.id
    const query = 'UPDATE users SET admin_request_status = "pending" WHERE user_id = ?'
    try {
        await execute_query(query, [user_id])
        req.session.message = 'Admin request sent successfully!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Internal Server Error!'
        req.session.msg_type = 'error'
    }
    return res.redirect('/request_admin')
}

module.exports = { request_admin }
