const { db, execute_query } = require('../../database/db');

function get_message(req) {
    let message, msg_type;
    if (req.session.message !== undefined) {
        message = req.session.message;
        msg_type = req.session.msg_type;
        req.session.message = undefined;
        req.session.msg_type = undefined;
    }
    return { message, msg_type };
}

const home_view = (req, res) => {
    if (req.user.is_admin) {
        return res.redirect('/admin');
    }
    return res.render('user/home.ejs');
};

const view_books = async (req, res) => {
    let { message, msg_type } = get_message(req);

    try {
        results = await execute_query('SELECT * FROM books WHERE available_copies != 0');
        return res.render('books.ejs', { books: results, message: message, msg_type: msg_type });
    }
    catch {
        return res.render("books.ejs", { books: [], message: 'Internal Server Error', msg_type: "error" });
    }
};

const view_checkin = async (req, res) => {
    let user_id = req.user.id;
    let { message, msg_type } = get_message(req);

    try {
        const query = 'SELECT t.*, b.title FROM transactions t JOIN books b ON t.book_id = b.book_id WHERE t.user_id = ? AND t.type = "checkout" AND t.status = "accepted"';
        results = await execute_query(query, [user_id]);
        return res.render('user/checkin.ejs', { transactions: results, message: message, msg_type: msg_type });
    }
    catch {
        return res.render("user/checkin.ejs", { transactions: [], message: 'Internal Server Error', msg_type: "error" });
    }
};

const view_history = async (req, res) => {
    let user_id = req.user.id;
    try {
        const query = 'SELECT t.*, b.title FROM transactions t JOIN books b ON t.book_id = b.book_id WHERE t.user_id = ?';
        results = await execute_query(query, [user_id]);
        return res.render('user/history.ejs', { transactions: results });
    }
    catch {
        return res.render("user/history.ejs", { transactions: [], message: 'Internal Server Error', msg_type: "error" });
    }
};

const view_request_admin = async (req, res) => {
    let { message, msg_type } = get_message(req);
    return res.render('user/request_admin.ejs', { message: message, msg_type: msg_type });
};

module.exports = { home_view, view_books, view_checkin, view_history, view_request_admin };