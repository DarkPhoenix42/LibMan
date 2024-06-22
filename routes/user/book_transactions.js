const { db, execute_query } = require('../../database/db')

const checkout_book = async (req, res) => {
    let book_id = req.params.book_id
    let user_id = req.user.id
    let date = new Date()

    req.session.msg_type = 'error'
    let query = 'SELECT * FROM books WHERE book_id = ?'
    try {
        let results = await execute_query(query, [book_id])
        if (results.length === 0) {
            req.session.message = 'Invalid book_id!'
            return res.redirect('/books')
        } else if (results[0].available_copies === 0) {
            req.session.message = 'Book is not available for checkout!'
            return res.redirect('/books')
        }
        query =
            'SELECT * FROM transactions WHERE user_id = ? AND book_id = ? AND status="pending" AND type="checkout"'

        results = await execute_query(query, [user_id, book_id])

        if (results.length > 0) {
            req.session.message = 'Book checkout already requested!'
            return res.redirect('/books')
        }
        
        query =
            'INSERT INTO transactions (book_id, user_id, borrow_date, type, status) VALUES (?, ?, ?, ?, ?)'

        await execute_query(query, [book_id, user_id, date, 'checkout', 'pending'])
        req.session.message = 'Book checkout requested successfully!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Failed to request book checkout!'
    }

    return res.redirect('/books')
}

const checkin_book = async (req, res) => {
    let transaction_id = req.params.transaction_id
    let user_id = req.user.id

    req.session.msg_type = 'error'
    let query = 'SELECT * FROM transactions WHERE transaction_id = ?'
    try {
        results = await execute_query(query, [transaction_id])

        if (results.length === 0) {
            req.session.message = 'Invalid transaction_id!'
            return res.redirect('/checkin')
        } else if (results[0].type !== 'checkout' && results[0].status === 'accepted') {
            req.session.message = 'Cannot check in book that is not checked out!'
            return res.redirect('/checkin')
        } else if (results[0].user_id !== user_id) {
            req.session.message = 'Cannot check in book that is not checked out by you!'
            return res.redirect('/checkin')
        }
        query =
            'UPDATE transactions SET type = "checkin", status = "pending" WHERE transaction_id = ?'

        await execute_query(query, [transaction_id])
        req.session.message = 'Book checkin requested successfully!'
        req.session.msg_type = 'success'
    } catch {
        req.session.message = 'Failed to request book checkin!'
    }
    return res.redirect('/checkin')
}

module.exports = { checkout_book, checkin_book }
