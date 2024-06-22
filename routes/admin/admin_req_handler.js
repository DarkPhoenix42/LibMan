const { db, execute_query } = require('../../database/db')

const accept_admin = async (req, res) => {
    const user_id = req.params.user_id
    const query = 'UPDATE users SET is_admin = 1, admin_request_status = "none" WHERE user_id = ?'
    try {
        await execute_query(query, [user_id])
        req.session.message = 'Admin request accepted!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Internal Server Error!'
        req.session.msg_type = 'error'
    }
    return res.redirect('/admin/admin_requests')
}

const reject_admin = async (req, res) => {
    const user_id = req.params.user_id
    const query = 'UPDATE users SET admin_request_status = "none" WHERE user_id = ?'
    try {
        await execute_query(query, [user_id])
        req.session.message = 'Admin request rejected!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Internal Server Error!'
        req.session.msg_type = 'error'
    }
    return res.redirect('/admin/admin_requests')
}

module.exports = { accept_admin, reject_admin }
