DROP DATABASE IF EXISTS `library`;
CREATE DATABASE `library`;

use library;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    admin_request_status ENUM('pending', 'none') DEFAULT 'none'
);

CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    author VARCHAR(255) NOT NULL DEFAULT 'unknown',
    genre VARCHAR(255) NOT NULL DEFAULT 'unknown',
    available_copies INT(10) UNSIGNED DEFAULT 1
);

CREATE TABLE transactions(
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    user_id INT,
    borrow_date DATE,
    return_date DATE,
    type ENUM('checkin', 'checkout'),
    status ENUM('pending','accepted','rejected'),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
