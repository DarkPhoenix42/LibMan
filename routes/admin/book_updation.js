const { db, execute_query } = require('../../database/db');

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

module.exports = { get_book, add_book, update_book, delete_book };