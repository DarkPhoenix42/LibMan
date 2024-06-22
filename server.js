const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const express = require('express')
const cookie_parser = require('cookie-parser')
const cors = require('cors')
const session = require('express-session')

const jwt_middleware = require('./middleware/jwt')
const admin_middleware = require('./middleware/is_admin')

const { db } = require('./database/db')
const auth_routes = require('./routes/auth_routes')
const user_routes = require('./routes/user_routes')
const admin_routes = require('./routes/admin_routes')

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookie_parser())
app.use(cors())

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    }),
)

app.get('/login', auth_routes.login_view)
app.post('/login', auth_routes.login)

app.get('/register', auth_routes.register_view)
app.post('/register', auth_routes.register)

app.use(jwt_middleware)
app.get('/', user_routes.home_view)

app.get('/books', user_routes.view_books)
app.post('/checkout/:book_id', user_routes.checkout_book)

app.get('/checkin', user_routes.view_checkin)
app.post('/checkin/:transaction_id', user_routes.checkin_book)

app.get('/request_admin', user_routes.view_request_admin)
app.post('/request_admin', user_routes.request_admin)

app.get('/history', user_routes.view_history)
app.get('/logout', auth_routes.logout)

app.use(admin_middleware)
app.get('/admin', admin_routes.home_view)
app.get('/admin/books', admin_routes.view_books)

app.get('/admin/admin_requests', admin_routes.view_admin_requests)
app.post('/admin/accept_admin/:user_id', admin_routes.accept_admin)
app.post('/admin/reject_admin/:user_id', admin_routes.reject_admin)

app.get('/admin/checkout_requests', admin_routes.view_checkout_requests)
app.post('/admin/accept_checkout/:transaction_id', admin_routes.accept_checkout)
app.post('/admin/reject_checkout/:transaction_id', admin_routes.reject_checkout)

app.get('/admin/checkin_requests', admin_routes.view_checkin_requests)
app.post('/admin/accept_checkin/:transaction_id', admin_routes.accept_checkin)
app.post('/admin/reject_checkin/:transaction_id', admin_routes.reject_checkin)

app.post('/admin/get_book/:book_id', admin_routes.get_book)

app.get('/admin/add_book', admin_routes.view_add_book)
app.post('/admin/add_book', admin_routes.add_book)

app.get('/admin/delete_book', admin_routes.view_delete_book)
app.post('/admin/delete_book', admin_routes.delete_book)

app.get('/admin/update_book', admin_routes.view_update_book)
app.post('/admin/update_book', admin_routes.update_book)

app.get('/admin/transaction_history', admin_routes.view_transaction_history)

db.connect()

app.listen(3000, function () {
    console.log('Node server running @ http://localhost:3000')
})
