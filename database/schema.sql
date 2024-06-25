DROP DATABASE IF EXISTS `libman`;
CREATE DATABASE `libman`;

use libman;

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

INSERT INTO books (title, author, genre, available_copies) VALUES
("And Then There Were None", "Agatha Christie", "Mystery", 25),
("1984", "George Orwell", "Dystopian", 20),
("To Kill a Mockingbird", "Harper Lee", "Fiction", 15),
("The Great Gatsby", "F. Scott Fitzgerald", "Classic", 18),
("Pride and Prejudice", "Jane Austen", "Romance", 22),
("The Catcher in the Rye", "J.D. Salinger", "Coming-of-age", 17),
("Harry Potter and the Philosopher's Stone", "J.K. Rowling", "Fantasy", 30),
("The Hobbit", "J.R.R. Tolkien", "Fantasy", 25),
("The Da Vinci Code", "Dan Brown", "Thriller", 21),
("The Lord of the Rings", "J.R.R. Tolkien", "Fantasy", 28),
("The Hunger Games", "Suzanne Collins", "Dystopian", 19),
("The Alchemist", "Paulo Coelho", "Fiction", 23),
("The Girl with the Dragon Tattoo", "Stieg Larsson", "Mystery", 16),
("Gone with the Wind", "Margaret Mitchell", "Historical Fiction", 20),
("The Adventures of Huckleberry Finn", "Mark Twain", "Adventure", 14),
("The Shining", "Stephen King", "Horror", 18),
("Brave New World", "Aldous Huxley", "Dystopian", 24),
("The Picture of Dorian Gray", "Oscar Wilde", "Gothic Fiction", 19),
("The Road", "Cormac McCarthy", "Post-apocalyptic", 15),
("Frankenstein", "Mary Shelley", "Gothic Horror", 20);
