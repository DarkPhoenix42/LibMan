const { db, execute_query } = require('../../database/db')

const get_book = async (req, res) => {
    let book_id = req.params.book_id
    const query = 'SELECT * FROM books WHERE book_id = ?'
    try {
        results = await execute_query(query, [book_id])
        return res.send(results[0])
    } catch {
        return res.send({})
    }
}

const add_book = async (req, res) => {
    const { title, author, genre, available_copies } = req.body
    let query = 'SELECT * FROM books WHERE title = ? AND author = ? AND genre = ?'
    try {
        let results = await execute_query(query, [title, author, genre])
        if (results.length > 0) {
            query =
                'UPDATE books SET available_copies = available_copies + ? WHERE title = ? AND author = ? AND genre = ?'
            await execute_query(query, [available_copies, title, author, genre])
            req.session.message = 'Book already exists, so added copies instead!'
        } else {
            query = 'INSERT INTO books (title, author, genre, available_copies) VALUES (?, ?, ?, ?)'
            await execute_query(query, [title, author, genre, available_copies])
            req.session.message = 'Book added successfully!'
        }
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Failed to add book!'
        req.session.msg_type = 'error'
    }
    return res.redirect('/admin/add_book')
}

const update_book = async (req, res) => {
    const { book_id, title, author, genre, available_copies } = req.body
    let query =
        'UPDATE books SET title = ?, author = ?, genre = ?, available_copies = ? WHERE book_id = ?'
    try {
        await execute_query(query, [title, author, genre, available_copies, book_id])
        req.session.message = 'Book updated successfully!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Failed to update book!'
        req.session.msg_type = 'error'
    }
    return res.redirect('/admin/update_book')
}

const delete_book = async (req, res) => {
    const { book_id } = req.body
    let query = 'SELECT * FROM transactions WHERE book_id = ? AND status="pending"'
    try {
        results = await execute_query(query, [book_id])

        if (results.length > 0) {
            req.session.message = 'Cannot delete book with pending transactions!'
            req.session.msg_type = 'error'
            return res.redirect('/admin/delete_book')
        }

        query = 'DELETE FROM transactions WHERE book_id = ?'
        await execute_query(query, [book_id])
        req.session.message = 'Book Deleted successfully!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Failed to delete book!'
        req.session.msg_type = 'error'
    }

    return res.redirect('/admin/delete_book')
}

module.exports = { get_book, add_book, update_book, delete_book }
