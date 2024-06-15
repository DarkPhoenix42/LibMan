const { db, execute_query } = require('../database/db');

const home_view = (req, res) => {
    return res.render('../views/admin_home.ejs');
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
};

const view_admin_requests = async (req, res) => {
    let { message, msg_type } = get_message(req);

    const query = 'select * from users where admin_request_status = "pending"';
    try {
        results = await execute_query(query, []);
        return res.render('../views/admin_requests.ejs', { requests: results, message: message, msg_type: msg_type });
    }
    catch {
        return res.redirect('/admin/admin_requests', { requests: [], message: 'Internal Server Error!', msg_type: 'error' });
    }
};

const accept_admin = async (req, res) => {
    const user_id = req.params.user_id;
    const query = `update users set is_admin = 1, admin_request_status = "none" where user_id = ?`;

    try {
        await execute_query(query, [user_id]);
        req.session.message = 'Admin request accepted!';
        req.session.msg_type = 'success';
    } catch {
        req.session.message = 'Internal Server Error!';
        req.session.msg_type = 'error';
    }
    return res.redirect('/admin/admin_requests');

};

const reject_admin = async (req, res) => {
    const user_id = req.params.user_id;
    const query = `update users set admin_request_status = "none" where user_id = ${user_id}`;
    try {
        await execute_query(query, []);
        req.session.message = 'Admin request rejected!';
        req.session.msg_type = 'success';
    } catch {
        req.session.message = 'Internal Server Error!';
        req.session.msg_type = 'error';

    }
    return res.redirect('/admin/admin_requests');
};

const view_checkout_requests = async (req, res) => {
    const query = 'SELECT t.*, b.title, u.username FROM transactions t JOIN books b ON t.book_id = b.book_id JOIN users u ON t.user_id = u.user_id WHERE t.type = "checkout" AND t.status = "pending"';
    let { message, msg_type } = get_message(req);

    try {
        results = await execute_query(query, []);
        return res.render('../views/checkout_requests.ejs', { checkout_requests: results, message: message, msg_type: msg_type });
    }
    catch {
        return res.redirect('/admin/checkout_requests', { checkout_requests: [], message: 'Internal Server Error', msg_type: 'error' });
    }

};

const view_checkin_requests = async (req, res) => {
    const query = 'SELECT t.*, b.title, u.username FROM transactions t JOIN books b ON t.book_id = b.book_id JOIN users u ON t.user_id = u.user_id WHERE t.type = "checkin" AND t.status = "pending"';
    let { message, msg_type } = get_message(req);

    try {
        results = await execute_query(query, []);
        return res.render('../views/checkin_requests.ejs', { checkin_requests: results, message: message, msg_type: msg_type });
    }
    catch {
        return res.redirect('/admin/checkin_requests', { checkin_requests: [], message: 'Internal Server Error!', msg_type: 'error' });
    }
};


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

const view_add_book = (req, res) => {
    let { message, msg_type } = get_message(req);
    res.render("../views/add_book.ejs", { message: message, msg_type: msg_type });
};

const get_book = async (req, res) => {
    let book_id = req.params.book_id;
    const query = 'select * from books where book_id = ?';
    try {
        results = await execute_query(query, [book_id]);
        return res.send(results[0]);
    }
    catch {
        return;
    }
};

const add_book = async (req, res) => {
    const { title, author, genre, available_copies } = req.body;
    const query = 'insert into books (title, author, genre, available_copies) values (?, ?, ?, ?)';
    req.session.msg_type = "error";
    try {
        await execute_query(query, [title, author, genre, available_copies]);
        req.session.message = "Book added successfully!";
        req.session.msg_type = "success";
    }
    catch {
        req.session.message = "Failed to add book!";
    }
    return res.redirect('/admin/add_book');
};

const view_update_book = async (req, res) => {
    const query = 'select * from books';
    let { message, msg_type } = get_message(req);

    try {
        results = await execute_query(query);
        return res.render("../views/update_book.ejs", { books: results, message: message, msg_type: msg_type });
    }
    catch {
        return res.render("../views/update_book.ejs", { books: [], message: "Failed to Fetch Books!", msg_type: "error" });
    }
};

const update_book = async (req, res) => {
    const { book_id, title, author, genre, available_copies } = req.body;
    const query = 'update books set title = ?, author = ?, genre = ?, available_copies = ? where book_id = ?';
    req.session.msg_type = "error";
    try {
        await execute_query(query, [title, author, genre, available_copies, book_id]);
        req.session.message = "Book updated successfully!";
        req.session.msg_type = "success";
    }
    catch {
        req.session.message = "Failed to update book!";
    }
    return res.redirect('/admin/update_book');

};

const view_delete_book = async (req, res) => {
    const query = 'select * from books';
    let { message, msg_type } = get_message(req);

    try {
        results = await execute_query(query);
        return res.render("../views/delete_book.ejs", { books: results, message: message, msg_type: msg_type });
    }
    catch {
        return res.render("../views/delete_book.ejs", { books: [], message: "Failed to Fetch Books!", msg_type: "error" });

    }

};

const delete_book = async (req, res) => {
    const { book_id } = req.body;
    const query = 'delete from books where book_id = ?';
    req.session.msg_type = "error";
    try {

        await execute_query(query, [book_id]);
        req.session.message = "Book Deleted successfully!";
        req.session.msg_type = "success";
    }
    catch {
        req.session.message = "Failed to delete book!";
    }

    return res.redirect("/admin/delete_book");
};

const view_transaction_history = async (req, res) => {
    const query = 'SELECT t.*, b.title, u.username FROM transactions t JOIN books b ON t.book_id = b.book_id JOIN users u ON t.user_id = u.user_id';
    try {
        results = await execute_query(query);
        return res.render('../views/transactions.ejs', { transactions: results });
    }
    catch {
        return res.render("../views/transactions.ejs", {
            transactions: [],
            message: 'Internal Server Error!', msg_type: 'error'
        });
    }
};

module.exports = { home_view, view_admin_requests, accept_admin, reject_admin, view_checkout_requests, view_checkin_requests, accept_checkout, reject_checkout, accept_checkin, reject_checkin, view_add_book, add_book, view_update_book, update_book, view_delete_book, delete_book, view_transaction_history, get_book };
