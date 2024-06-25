const { db, execute_query } = require('../../database/db')

const accept_checkout = async (req, res) => {
    const transaction_id = req.params.transaction_id
    let date = new Date()
    let query =
        'UPDATE transactions SET status = "accepted", borrow_date = ? WHERE transaction_id = ?'
    try {
        await execute_query(query, [date, transaction_id])
        query =
            'UPDATE books SET available_copies = available_copies - 1 WHERE book_id = (SELECT book_id FROM transactions WHERE transaction_id = ?)'
        await execute_query(query, [transaction_id])
        req.session.message = 'Checkout request accepted!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Internal Server Error!'
        req.session.msg_type = 'error'
    }
    return res.redirect('/admin/checkout_requests')
}

const reject_checkout = async (req, res) => {
    const transaction_id = req.params.transaction_id
    let date = new Date()
    const query =
        'UPDATE transactions SET status = "rejected", borrow_date = ? WHERE transaction_id = ?'
    try {
        await execute_query(query, [date, transaction_id])
        req.session.message = 'Checkout request rejected!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Internal Server Error!'
        req.session.msg_type = 'error'
    }

    return res.redirect('/admin/checkout_requests')
}

const accept_checkin = async (req, res) => {
    const transaction_id = req.params.transaction_id
    let date = new Date()
    let query =
        'UPDATE transactions SET status = "accepted", return_date = ? WHERE transaction_id = ?'
    try {
        await execute_query(query, [date, transaction_id])
        query =
            'UPDATE books SET available_copies = available_copies + 1 WHERE book_id = (SELECT book_id FROM transactions WHERE transaction_id = ?)'
        await execute_query(query, [transaction_id])
        req.session.message = 'Checkin request accepted!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Internal Server Error!'
        req.session.msg_type = 'error'
    }

    return res.redirect('/admin/checkin_requests')
}

const reject_checkin = async (req, res) => {
    const transaction_id = req.params.transaction_id
    let date = new Date()
    const query =
        'UPDATE transactions SET status = "rejected", return_date= ? WHERE transaction_id = ?'
    try {
        await execute_query(query, [date, transaction_id])
        req.session.message = 'Checkin request rejected!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Internal Server Error!'
        req.session.msg_type = 'error'
    }

    return res.redirect('/admin/checkin_requests')
}

module.exports = { accept_checkout, reject_checkout, accept_checkin, reject_checkin }
