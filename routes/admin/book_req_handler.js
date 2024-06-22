const { db, execute_query } = require('../../database/db');

const accept_checkout = async (req, res) => {
    const transaction_id = req.params.transaction_id;
    let date = new Date();
    const query = `update transactions set status = "accepted", borrow_date= ? where transaction_id = ${transaction_id}`;
    try {
        await execute_query(query, [date]);
        req.session.message = 'Checkout request accepted!';
        req.session.msg_type = 'success';
    } catch {
        req.session.message = 'Internal Server Error!';
        req.session.msg_type = 'error';
    }

    return res.redirect('/admin/checkout_requests');

};

const reject_checkout = async (req, res) => {
    const transaction_id = req.params.transaction_id;
    let date = new Date();
    const query = `update transactions set status = "rejected", borrow_date=? where transaction_id = ?`;
    try {
        await execute_query(query, [date, transaction_id]);
        await execute_query('update books set available_copies = available_copies + 1 where book_id = (select book_id from transactions where transaction_id = ?)', [transaction_id]);
        req.session.message = 'Checkout request rejected!';
        req.session.msg_type = 'success';
    } catch {
        req.session.message = 'Internal Server Error!';
        req.session.msg_type = 'error';
    }

    return res.redirect('/admin/checkout_requests');

};


const accept_checkin = async (req, res) => {
    const transaction_id = req.params.transaction_id;
    let date = new Date();
    const query = `update transactions set status = "accepted", return_date = ? where transaction_id = ?`;
    try {
        await execute_query(query, [date, transaction_id]);
        await execute_query('update books set available_copies = available_copies + 1 where book_id = (select book_id from transactions where transaction_id = ?)', [transaction_id]);
        req.session.message = 'Checkin request accepted!';
        req.session.msg_type = 'success';
    } catch {
        req.session.message = 'Internal Server Error!';
        req.session.msg_type = 'error';
    }

    return res.redirect('/admin/checkin_requests');

};
const reject_checkin = async (req, res) => {
    const transaction_id = req.params.transaction_id;
    let date = new Date();
    const query = `update transactions set status = "rejected", return_date= ? where transaction_id = ${transaction_id}`;
    try {
        await execute_query(query, [date]);
        req.session.message = 'Checkin request rejected!';
        req.session.msg_type = 'success';
    } catch {
        req.session.message = 'Internal Server Error!';
        req.session.msg_type = 'error';
    }

    return res.redirect('/admin/checkin_requests');

};

module.exports = { accept_checkout, reject_checkout, accept_checkin, reject_checkin };