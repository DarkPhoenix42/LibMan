const { db, execute_query } = require('../../database/db')

function get_message(req) {
    let message, msg_type
    if (req.session.message !== undefined) {
        message = req.session.message
        msg_type = req.session.msg_type
        req.session.message = undefined
        req.session.msg_type = undefined
    }
    return { message, msg_type }
}

const home_view = (req, res) => {
    return res.render('admin/home.ejs')
}

const view_books = async (req, res) => {
    let { message, msg_type } = get_message(req)

    let query = 'SELECT * FROM books'
    try {
        results = await execute_query(query, [])
        return res.render('admin/books.ejs', {
            books: results,
            message: message,
            msg_type: msg_type,
        })
    } catch {
        return res.render('admin/books.ejs', {
            books: [],
            message: 'Internal Server Error',
            msg_type: 'error',
        })
    }
}
const view_admin_requests = async (req, res) => {
    let { message, msg_type } = get_message(req)
    const query = 'SELECT * FROM users WHERE admin_request_status = "pending"'
    try {
        results = await execute_query(query, [])
        return res.render('admin/admin_requests.ejs', {
            requests: results,
            message: message,
            msg_type: msg_type,
        })
    } catch {
        return res.render('admin/admin_requests.ejs', {
            requests: [],
            message: 'Internal Server Error!',
            msg_type: 'error',
        })
    }
}

const view_checkout_requests = async (req, res) => {
    let { message, msg_type } = get_message(req)
    const query =
        'SELECT t.*, b.title, u.username FROM transactions t JOIN books b ON t.book_id = b.book_id JOIN users u ON t.user_id = u.user_id WHERE t.type = "checkout" AND t.status = "pending"'

    try {
        results = await execute_query(query, [])
        return res.render('admin/checkout_requests.ejs', {
            checkout_requests: results,
            message: message,
            msg_type: msg_type,
        })
    } catch {
        return res.render('admin/checkout_requests.ejs', {
            checkout_requests: [],
            message: 'Internal Server Error',
            msg_type: 'error',
        })
    }
}

const view_checkin_requests = async (req, res) => {
    let { message, msg_type } = get_message(req)
    const query =
        'SELECT t.*, b.title, u.username FROM transactions t JOIN books b ON t.book_id = b.book_id JOIN users u ON t.user_id = u.user_id WHERE t.type = "checkin" AND t.status = "pending"'

    try {
        results = await execute_query(query, [])
        return res.render('admin/checkin_requests.ejs', {
            checkin_requests: results,
            message: message,
            msg_type: msg_type,
        })
    } catch {
        return res.render('admin/checkin_requests.ejs', {
            checkin_requests: [],
            message: 'Internal Server Error!',
            msg_type: 'error',
        })
    }
}
const view_delete_book = async (req, res) => {
    let { message, msg_type } = get_message(req)
    const query = 'SELECT * FROM books'

    try {
        results = await execute_query(query)
        return res.render('admin/delete_book.ejs', {
            books: results,
            message: message,
            msg_type: msg_type,
        })
    } catch {
        return res.render('admin/delete_book.ejs', {
            books: [],
            message: 'Failed to Fetch Books!',
            msg_type: 'error',
        })
    }
}
const view_update_book = async (req, res) => {
    let { message, msg_type } = get_message(req)
    const query = 'SELECT * FROM books'

    try {
        results = await execute_query(query)
        return res.render('admin/update_book.ejs', {
            books: results,
            message: message,
            msg_type: msg_type,
        })
    } catch {
        return res.render('admin/update_book.ejs', {
            books: [],
            message: 'Failed to Fetch Books!',
            msg_type: 'error',
        })
    }
}

const view_add_book = (req, res) => {
    let { message, msg_type } = get_message(req)
    res.render('admin/add_book.ejs', { message: message, msg_type: msg_type })
}

const view_transaction_history = async (req, res) => {
    const query =
        'SELECT t.*, b.title, u.username FROM transactions t JOIN books b ON t.book_id = b.book_id JOIN users u ON t.user_id = u.user_id'
    try {
        results = await execute_query(query)
        return res.render('admin/transactions.ejs', { transactions: results })
    } catch {
        return res.render('admin/transactions.ejs', {
            transactions: [],
            message: 'Internal Server Error!',
            msg_type: 'error',
        })
    }
}

module.exports = {
    home_view,
    view_books,
    view_admin_requests,
    view_checkout_requests,
    view_checkin_requests,
    view_add_book,
    view_update_book,
    view_delete_book,
    view_transaction_history,
}
