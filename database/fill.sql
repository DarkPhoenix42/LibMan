use library;

INSERT INTO books (title, author, genre, available_copies) VALUES
("And Then there were none", "Agatha Christie", "Mystery", 25),
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

INSERT INTO users (username, password, is_admin, admin_request_status) VALUES ("user1", "$2b$10$K3ZicfX3hY126fEVYccCSeJH.kvWXRfEfIpYGq4IW/Qt4ig4DwB0C", false, "pending");
