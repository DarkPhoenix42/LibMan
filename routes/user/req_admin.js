const { db, execute_query } = require('../../database/db');

const request_admin = async (req, res) => {
    let user_id = req.user.id;
    req.session.msg_type = "error";
    try {
        await execute_query('update users set admin_request_status = "pending" WHERE user_id = ?', [user_id]);
        req.session.message = "Admin request sent successfully!";
        req.session.msg_type = "success";
    }
    catch {
        req.session.message = "Internal Server Error!";
    }
    return res.redirect('/request_admin');
};

module.exports = { request_admin };