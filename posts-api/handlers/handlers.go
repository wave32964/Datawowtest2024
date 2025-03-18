// handlers/handlers.go
package handlers

import (
	"encoding/json"
	"net/http"
	"posts-api/models"
	"strconv"
)

var blogs []models.Blog
var currentID int = 0

// CreateBlog creates a new blog post
func CreateBlog(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var blog models.Blog
	if err := json.NewDecoder(r.Body).Decode(&blog); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	currentID++
	blog.ID = currentID
	blogs = append(blogs, blog)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(blog)
}

// GetBlogs returns all blog posts
func GetBlogs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blogs)
}

// GetBlog returns a single blog post by ID
func GetBlog(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Path[len("/blogs/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	for _, blog := range blogs {
		if blog.ID == id {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(blog)
			return
		}
	}
	http.Error(w, "Blog not found", http.StatusNotFound)
}

// UpdateBlog updates an existing blog post
func UpdateBlog(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Path[len("/blogs/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var updatedBlog models.Blog
	if err := json.NewDecoder(r.Body).Decode(&updatedBlog); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	for i, blog := range blogs {
		if blog.ID == id {
			updatedBlog.ID = id
			blogs[i] = updatedBlog
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(updatedBlog)
			return
		}
	}
	http.Error(w, "Blog not found", http.StatusNotFound)
}

// DeleteBlog deletes a blog post
func DeleteBlog(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Path[len("/blogs/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	for i, blog := range blogs {
		if blog.ID == id {
			blogs = append(blogs[:i], blogs[i+1:]...)
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}
	http.Error(w, "Blog not found", http.StatusNotFound)
}
