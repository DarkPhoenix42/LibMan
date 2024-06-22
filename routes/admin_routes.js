const { accept_admin, reject_admin } = require('./admin/admin_req_handler')

const {
    accept_checkout,
    reject_checkout,
    accept_checkin,
    reject_checkin,
} = require('./admin/book_req_handler')

const { get_book, add_book, update_book, delete_book } = require('./admin/book_updation')

const {
    home_view,
    view_books,
    view_admin_requests,
    view_checkout_requests,
    view_checkin_requests,
    view_add_book,
    view_update_book,
    view_delete_book,
    view_transaction_history,
} = require('./admin/views')

module.exports = {
    accept_admin,
    reject_admin,
    accept_checkout,
    reject_checkout,
    accept_checkin,
    reject_checkin,
    get_book,
    add_book,
    update_book,
    delete_book,
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
