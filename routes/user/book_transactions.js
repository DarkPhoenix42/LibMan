const { db, execute_query } = require('../../database/db');

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
        await execute_query('UPDATE books SET available_copies = available_copies - 1 WHERE book_id = ?', [book_id]);

        req.session.message = "Book checkout requested successfully!";
        req.session.msg_type = "success";
    }
    catch {
        req.session.message = "Failed to request book checkout!";
    }

    return res.redirect('/books');
};

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
};

module.exports = { checkout_book, checkin_book };

