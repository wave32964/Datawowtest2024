# Datawowtest2024
--go as backend
--nextjs frontednd framework
--postgresql as db
# set up postgresql
<!-- This section explains how to set up the database -->
$ brew install postgresql
$ psql -U postgres
# create your db
CREATE DATABASE datawowtest2024;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE datawowtest2024 TO your_username;

# create env.

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=datawowtest2024

# to run app 
$ cd posts-api
$ go run main.go
$ cd my-app-front-end
$ pnpm run dev

# to run backend 
$ cd posts-api
go run main.go

# to run frontend
$ pnpm run dev
[localhost](http://localhost:3000)

# to setup db
cd posts-api
$ bash setup.sh