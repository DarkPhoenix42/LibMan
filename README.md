# LibMan

## Description

This project is a library management system that allows users to efficiently manage their library collections.

## Features

- Separate admin and client portals
  
### Admin can
- Manage the book catalog (list, update, add/remove books).
- Approve/deny checkout and check-in requests from clients.
- Approve/deny requests from users seeking admin privileges.

### Users can
- View the list of available books.
- Request checkout and check-in of books from the admin.
- View their borrowing history.

## Setup

1. Clone the repository.
2. Start a my sql server and source the file database/schema.sql
3. Set the environment variables as shown in .envsample in a file called `config.env`.
4. Start the server using `node server.js`
5. Connect to the server at `localhost:3000`
6. Optionally, after registering a first user, you can source the database/fill.sql to fill the library with some sample books.
7. The first registered user is made admin by default.