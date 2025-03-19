package main

import (
	"log"
	"net/http"
	"os"
	"posts-api/db"
	"posts-api/handlers"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file:", err)
	} else {
		log.Println("Successfully loaded .env file")
	}
	// Debug: print environment variables
	log.Println("DB_USER:", os.Getenv("DB_USER"))
	log.Println("DB_NAME:", os.Getenv("DB_NAME"))
	log.Println("DB_PASSWORD:", os.Getenv("DB_PASSWORD"))

	// Initialize the database
	db.InitDB() // Make sure this matches the function name in db package
	r := mux.NewRouter()

	// Register routes with handlers that interact with the database
	r.HandleFunc("/blogs", handlers.CreateBlog()).Methods("POST")
	r.HandleFunc("/blogs", handlers.GetBlog()).Methods("GET")
	r.HandleFunc("/blogs/{id}", handlers.GetBlog()).Methods("GET")
	r.HandleFunc("/blogs/{id}", handlers.DeleteBlog()).Methods("DELETE") // DELETE route
	r.HandleFunc("/blogs/{id}", handlers.UpdateBlog()).Methods("PUT")    // PUT route
	r.HandleFunc("/blogs/comments", handlers.CreateComment()).Methods("POST")
	r.HandleFunc("/blogs/{id}/comments", handlers.GetComments()).Methods("GET")

	// Set up CORS middleware to allow cross-origin requests
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type"},
	})

	handlerWithCORS := c.Handler(r)

	log.Println("Server started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handlerWithCORS))
}
