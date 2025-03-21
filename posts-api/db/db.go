package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// InitializeDB (or InitDB, based on your naming preference) initializes the database connection
func InitDB() {
	var err error
	// Load environment variables
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432" // Default to 5432 if no port is provided
	}
	connStr := "postgres://" + dbUser + ":" + dbPassword + "@localhost:" + port + "/" + dbName + "?sslmode=disable"

	// Construct the connection string
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error opening database connection: ", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}
	log.Println("Successfully connected to the database!")
}
