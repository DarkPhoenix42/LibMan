const { db, execute_query } = require('../database/db');


const home_view = (req, res) => {
    if (req.user.is_admin) {
        return res.redirect('/admin');
    }
    return res.render('../views/user_home.ejs');
};
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

const view_books = async (req, res) => {
    let { message, msg_type } = get_message(req);

    try {
        results = await execute_query('SELECT * FROM books WHERE available_copies != 0');
        return res.render('../views/books.ejs', { books: results, message: message, msg_type: msg_type });
    }
    catch {
        return res.render("../views/books.ejs", { books: [], message: 'Internal Server Error', msg_type: "error" });
    }

}

const view_checkin = async (req, res) => {
    let user_id = req.user.id;
    let { message, msg_type } = get_message(req);

    try {
        const query = 'SELECT t.*, b.title FROM transactions t JOIN books b ON t.book_id = b.book_id WHERE t.user_id = ? AND t.type = "checkout" AND t.status = "accepted"';
        results = await execute_query(query, [user_id]);
        return res.render('../views/user_checkin.ejs', { transactions: results, message: message, msg_type: msg_type });
    }
    catch {
        return res.render("../views/user_checkin.ejs", { transactions: [], message: 'Internal Server Error', msg_type: "error" });
    }
}

const checkout_book = async (req, res) => {
    let book_id = req.params.book_id;
    let user_id = req.user.id;
    let date = new Date();

    req.session.msg_type = "error";
    try {
        results = await execute_query('SELECT * FROM books WHERE book_id = ?', [book_id]);
        if (results.length === 0) {
            req.session.message = "Invalid book_id!";
            return res.redirect('/checkin');
        }
        else if (results[0].available_copies === 0) {
            req.session.message = "Book is not available for checkout!";
            return res.redirect('/checkin');
        }

        const query = 'INSERT INTO transactions (book_id, user_id, borrow_date, type, status) VALUES (?, ?, ?, ?, ?)';
        await execute_query(query, [book_id, user_id, date, 'checkout', 'pending']);
        await execute_query('UPDATE books SET available_copies = available_copies - 1 WHERE book_id = ?', [book_id])

        req.session.message = "Book checkout requested successfully!";
        req.session.msg_type = "success";
    }
    catch {
        req.session.message = "Failed to request book checkout!";
    }

    return res.redirect('/books');
}

const checkin_book = async (req, res) => {
    let transaction_id = req.params.transaction_id;
    let user_id = req.user.id;

    req.session.msg_type = "error";
    try {
        results = await execute_query('SELECT * FROM transactions WHERE transaction_id = ?', [transaction_id]);
        if (results.length === 0) {
            req.session.message = "Invalid transaction_id!";
            return res.redirect('/checkin');
        }
        else if (results[0].type !== "checkout" && results[0].status === "accepted") {
            req.session.message = 'Cannot check in book that is not checked out!';
            return res.redirect('/checkin');
        }
        else if (results[0].user_id !== user_id) {
            req.session.message = 'Cannot check in book that is not checked out by you!';
            return res.redirect('/checkin');

        }

        await execute_query('UPDATE transactions SET type = "checkin", status = "pending" WHERE transaction_id = ?', [transaction_id]);
        req.session.message = "Book checkin requested successfully!";
        req.session.msg_type = "success";
    }
    catch {
        req.session.message = "Failed to request book checkin!";
    }
    return res.redirect('/checkin');

}

const view_history = async (req, res) => {
    let user_id = req.user.id;
    try {
        const query = 'SELECT t.*, b.title FROM transactions t JOIN books b ON t.book_id = b.book_id WHERE t.user_id = ?';
        results = await execute_query(query, [user_id]);
        return res.render('../views/user_history.ejs', { transactions: results });
    }
    catch {
        return res.render("../views/user_history.ejs", { transactions: [], message: 'Internal Server Error', msg_type: "error" });
    }
}

const view_request_admin = async (req, res) => {
    let { message, msg_type } = get_message(req);
    return res.render('../views/user_request_admin.ejs', { message: message, msg_type: msg_type });
}

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
}

module.exports = { home_view, view_books, view_checkin, checkout_book, checkin_book, view_history, view_request_admin, request_admin };