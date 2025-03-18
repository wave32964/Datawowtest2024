// models/blog.go

package main

import (
	"log"
	"net/http"
	"posts-api/handlers"
)

func main() {
	// Define routes
	http.HandleFunc("/blogs", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handlers.GetBlogs(w, r)
		case http.MethodPost:
			handlers.CreateBlog(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/blogs/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handlers.GetBlog(w, r)
		case http.MethodPut:
			handlers.UpdateBlog(w, r)
		case http.MethodDelete:
			handlers.DeleteBlog(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Start server
	log.Println("Server starting on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
