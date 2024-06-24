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
2. Set the environment variables as shown in .envsample in a file called `config.env`.
3. Note that if you are using docker, modify the docker-compose file so that `MYSQL_ROOT_PASSWORD` and `DB_PASS` in config.env are same.  
4. Start the docker containers using `docker compose up` and connect at `localhost:3000`.

## Note
The first user is made admin by default.