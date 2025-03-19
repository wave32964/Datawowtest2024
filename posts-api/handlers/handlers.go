package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"posts-api/models"
	"strconv"

	"posts-api/db"

	"github.com/gorilla/mux"
)

// CreateBlog creates a new blog post in the database
func CreateBlog() http.HandlerFunc {
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

		// Insert into the database
		query := `INSERT INTO blogs (author, avatar, category, title, excerpt, content, comments, timeAgo) 
		          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
		err := db.DB.QueryRow(query, blog.Author, blog.Avatar, blog.Category, blog.Title, blog.Excerpt, blog.Content, blog.Comments, blog.TimeAgo).Scan(&blog.ID)
		if err != nil {
			log.Printf("Failed to insert blog: %v", err)
			http.Error(w, "Failed to create blog", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(blog); err != nil {
			log.Printf("Failed to encode response: %v", err)
		}
	}
}

// GetBlog retrieves a blog or all blogs from the database
func GetBlog() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idParam := vars["id"]

		if idParam != "" {
			id, err := strconv.Atoi(idParam)
			if err != nil || id <= 0 {
				http.Error(w, "Invalid blog ID", http.StatusBadRequest)
				return
			}

			var blog models.Blog
			query := `SELECT id, author, avatar, category, title, excerpt, content, comments, timeAgo 
			          FROM blogs WHERE id = $1`
			err = db.DB.QueryRow(query, id).Scan(&blog.ID, &blog.Author, &blog.Avatar, &blog.Category, &blog.Title, &blog.Excerpt, &blog.Content, &blog.Comments, &blog.TimeAgo)
			if err == sql.ErrNoRows {
				http.Error(w, "Blog not found", http.StatusNotFound)
				return
			} else if err != nil {
				http.Error(w, "Failed to retrieve blog", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			if err := json.NewEncoder(w).Encode(blog); err != nil {
				http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			}
			return
		}

		// Retrieve all blogs
		rows, err := db.DB.Query(`SELECT id, author, avatar, category, title, excerpt, content, comments, timeAgo FROM blogs`)
		if err != nil {
			http.Error(w, "Failed to retrieve blogs", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var blogs []models.Blog
		for rows.Next() {
			var blog models.Blog
			if err := rows.Scan(&blog.ID, &blog.Author, &blog.Avatar, &blog.Category, &blog.Title, &blog.Excerpt, &blog.Content, &blog.Comments, &blog.TimeAgo); err != nil {
				http.Error(w, "Failed to parse blogs", http.StatusInternalServerError)
				return
			}
			blogs = append(blogs, blog)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(blogs); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

func CreateComment() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Decode request body
		var comment models.Comment // Use db.Comment here
		err := json.NewDecoder(r.Body).Decode(&comment)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Use blog_id from request body, not URL
		blogID := comment.BlogID

		// Insert comment into the database
		query := `INSERT INTO comments (blog_id, author, avatar, content, timeAgo) 
                  VALUES ($1, $2, $3, $4, $5) RETURNING id`
		err = db.DB.QueryRow(query, blogID, comment.Author, comment.Avatar, comment.Content, comment.TimeAgo).Scan(&comment.ID)
		if err != nil {
			http.Error(w, "Failed to create comment", http.StatusInternalServerError)
			return
		}

		// Return the created comment
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(comment)
	}
}

// GetComments retrieves comments for a specific blog post
func GetComments() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		blogID := vars["id"]

		// Ensure that blog ID is valid
		id, err := strconv.Atoi(blogID)
		if err != nil || id <= 0 {
			http.Error(w, "Invalid blog ID", http.StatusBadRequest)
			return
		}

		// Query to get comments for the specific blog post
		query := `SELECT id, blog_id, author, avatar, content, timeAgo 
                  FROM comments WHERE blog_id = $1`
		rows, err := db.DB.Query(query, id)
		if err != nil {
			http.Error(w, "Failed to retrieve comments", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var comments []models.Comment
		for rows.Next() {
			var comment models.Comment
			if err := rows.Scan(&comment.ID, &comment.BlogID, &comment.Author, &comment.Avatar, &comment.Content, &comment.TimeAgo); err != nil {
				http.Error(w, "Failed to parse comment", http.StatusInternalServerError)
				return
			}
			comments = append(comments, comment)
		}

		// Handle case when no comments are found
		if len(comments) == 0 {
			http.Error(w, "No comments found for this blog", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(comments); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

// DeleteBlog deletes a blog post by ID from the database
func DeleteBlog() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get the ID from the URL parameter
		idParam := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idParam)
		if err != nil || id <= 0 {
			http.Error(w, "Invalid blog ID", http.StatusBadRequest)
			return
		}

		// Delete the blog from the database
		query := `DELETE FROM blogs WHERE id = $1`
		result, err := db.DB.Exec(query, id)
		if err != nil {
			http.Error(w, "Failed to delete blog", http.StatusInternalServerError)
			return
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil || rowsAffected == 0 {
			http.Error(w, "Blog not found", http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusNoContent) // Return success status (204 No Content)
	}
}

// UpdateBlog updates a blog post by ID in the database
func UpdateBlog() http.HandlerFunc {
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

		// Update the blog in the database
		query := `UPDATE blogs SET title = $1, category = $2, content = $3, excerpt = $4, comments = $5, timeAgo = $6 WHERE id = $7`
		result, err := db.DB.Exec(query, updatedBlog.Title, updatedBlog.Category, updatedBlog.Content, updatedBlog.Excerpt, updatedBlog.Comments, updatedBlog.TimeAgo, id)
		if err != nil {
			http.Error(w, "Failed to update blog", http.StatusInternalServerError)
			return
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil || rowsAffected == 0 {
			http.Error(w, "Blog not found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(updatedBlog); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}
