package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"posts-api/models"
	"strconv"

	"github.com/gorilla/mux"
)

// CreateBlog creates a new blog post
func CreateBlog(blogs *[]models.Blog, currentID *int) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var blog models.Blog
		if err := json.NewDecoder(r.Body).Decode(&blog); err != nil {
			log.Printf("Failed to decode request body: %v", err)
			http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
			return
		}

		*currentID++
		blog.ID = *currentID
		*blogs = append(*blogs, blog)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(blog); err != nil {
			log.Printf("Failed to encode response: %v", err)
		}
	}
}

// GetBlog retrieves a blog or all blogs
func GetBlog(blogs *[]models.Blog) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idParam := vars["id"]

		if idParam != "" {
			id, err := strconv.Atoi(idParam)
			if err != nil || id <= 0 {
				http.Error(w, "Invalid blog ID", http.StatusBadRequest)
				return
			}

			for _, blog := range *blogs {
				if blog.ID == id {
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusOK)
					if err := json.NewEncoder(w).Encode(blog); err != nil {
						http.Error(w, "Failed to encode response", http.StatusInternalServerError)
					}
					return
				}
			}
			http.Error(w, "Blog not found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(*blogs); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

// DeleteBlog deletes a blog post by ID
func DeleteBlog(blogs *[]models.Blog) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get the ID from the URL parameter
		idParam := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idParam) // Convert the ID to an integer
		if err != nil || id <= 0 {
			http.Error(w, "Invalid blog ID", http.StatusBadRequest) // Return an error if the ID is invalid
			return
		}

		// Iterate over the blogs to find the one that matches the ID
		for i, blog := range *blogs {
			if blog.ID == id {
				// Blog found, delete it by removing the item from the slice
				*blogs = append((*blogs)[:i], (*blogs)[i+1:]...)
				w.WriteHeader(http.StatusNoContent) // Return success status (204 No Content)
				return
			}
		}

		// If the blog with the given ID is not found
		http.Error(w, "Blog not found", http.StatusNotFound)
	}
}

// UpdateBlog updates a blog post by ID
func UpdateBlog(blogs *[]models.Blog) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idParam := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idParam)
		if err != nil || id <= 0 {
			http.Error(w, "Invalid blog ID", http.StatusBadRequest)
			return
		}

		var updatedBlog models.Blog
		if err := json.NewDecoder(r.Body).Decode(&updatedBlog); err != nil {
			log.Printf("Failed to decode request body: %v", err)
			http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
			return
		}

		// Find the blog to update and update its fields
		for i, blog := range *blogs {
			if blog.ID == id {
				// Update the blog post details
				(*blogs)[i].Title = updatedBlog.Title
				(*blogs)[i].Category = updatedBlog.Category
				(*blogs)[i].Content = updatedBlog.Content
				(*blogs)[i].Excerpt = updatedBlog.Excerpt
				(*blogs)[i].Comments = updatedBlog.Comments
				(*blogs)[i].TimeAgo = updatedBlog.TimeAgo

				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusOK)
				if err := json.NewEncoder(w).Encode((*blogs)[i]); err != nil {
					log.Printf("Failed to encode response: %v", err)
				}
				return
			}
		}

		http.Error(w, "Blog not found", http.StatusNotFound)
	}
}
