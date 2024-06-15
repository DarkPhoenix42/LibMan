const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require('express');
const cookie_parser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');

const jwt_middleware = require('./middleware/jwt');
const admin_mware = require('./middleware/is_admin');

const { db } = require('./database/db');
const auth = require('./routes/auth_route');
const user_route = require('./routes/user_route');
const admin_route = require('./routes/admin_route');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));



app.get('/login', auth.login_view);
app.post('/login', auth.login);

app.get('/register', auth.register_view);
app.post('/register', auth.register);

app.use(jwt_middleware)
app.get('/', user_route.home_view);

app.get('/books', user_route.view_books)
app.post('/checkout/:book_id', user_route.checkout_book)

app.get('/checkin', user_route.view_checkin)
app.post('/checkin/:transaction_id', user_route.checkin_book)

app.get('/history', user_route.view_history)
app.get('/logout', auth.logout);


app.use(admin_mware);
app.get('/admin', admin_route.home_view);

app.get('/admin/admin_requests', admin_route.view_admin_requests);
app.post('/admin/accept_admin/:user_id', admin_route.accept_admin);
app.post('/admin/reject_admin/:user_id', admin_route.reject_admin);

app.get('/admin/checkout_requests', admin_route.view_checkout_requests);
app.post('/admin/accept_checkout/:transaction_id', admin_route.accept_checkout);
app.post('/admin/reject_checkout/:transaction_id', admin_route.reject_checkout);

app.get('/admin/checkin_requests', admin_route.view_checkin_requests);
app.post('/admin/accept_checkin/:transaction_id', admin_route.accept_checkin);
app.post('/admin/reject_checkin/:transaction_id', admin_route.reject_checkin);

app.post('/admin/get_book/:book_id', admin_route.get_book);

app.get('/admin/add_book', admin_route.view_add_book);
app.post('/admin/add_book', admin_route.add_book);

app.get('/admin/delete_book', admin_route.view_delete_book);
app.post('/admin/delete_book', admin_route.delete_book);

app.get('/admin/update_book', admin_route.view_update_book);
app.post('/admin/update_book', admin_route.update_book);

app.get('/admin/transaction_history', admin_route.view_transaction_history);

db.connect();

app.listen(3000, function () {
    console.log('Node server running @ http://localhost:3000')
});


