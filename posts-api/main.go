package main

import (
	"log"
	"net/http"
	"posts-api/handlers"
	"posts-api/models"
	"sync"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

var blogs []models.Blog
var mu sync.Mutex
var currentID int = 0

func main() {
	// Initialize some example blog data
	blogs = []models.Blog{
		{ID: 1, Author: "John Doe", Avatar: "/avatar1.jpg", Category: "Tech", Title: "First Blog Post", Excerpt: "This is the first post", Comments: 5, Content: "This is the content of the first post.", TimeAgo: "2 hours ago"},
		{ID: 2, Author: "Jane Doe", Avatar: "/avatar2.jpg", Category: "Health", Title: "Health Tips", Excerpt: "This is a blog about health", Comments: 2, Content: "Content about health.", TimeAgo: "1 hour ago"},
	}
	currentID = 2 // Set to the highest ID in the initial data

	r := mux.NewRouter()

	// Register routes with handlers that use the shared blogs slice
	r.HandleFunc("/blogs", handlers.CreateBlog(&blogs, &currentID)).Methods("POST")
	r.HandleFunc("/blogs", handlers.GetBlog(&blogs)).Methods("GET")
	r.HandleFunc("/blogs/{id}", handlers.GetBlog(&blogs)).Methods("GET")
	r.HandleFunc("/blogs/{id}", handlers.DeleteBlog(&blogs)).Methods("DELETE") // DELETE route
	r.HandleFunc("/blogs/{id}", handlers.UpdateBlog(&blogs)).Methods("PUT")    // PUT route

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type"},
	})

	handlerWithCORS := c.Handler(r)

	log.Println("Server started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handlerWithCORS))
}
