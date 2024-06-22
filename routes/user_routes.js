const { checkout_book, checkin_book } = require('./user/book_transactions')

const { request_admin } = require('./user/req_admin')

const {
    home_view,
    view_books,
    view_checkin,
    view_history,
    view_request_admin,
} = require('./user/views')

module.exports = {
    checkout_book,
    checkin_book,
    request_admin,
    home_view,
    view_books,
    view_checkin,
    view_history,
    view_request_admin,
}
