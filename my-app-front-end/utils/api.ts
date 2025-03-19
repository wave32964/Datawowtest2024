// api.ts
export interface Blog {
    id: number;
    author: string;
    avatar: string;
    category: string;
    title: string;
    excerpt: string;
    comments: number;
    content: string;
    timeAgo: string;
  }
  
  export interface Comment {
    id: number;
    blog_id: number;
    author: string;
    avatar: string;
    content: string;
    timeAgo: string;
  }
  
  // Fetch all blogs
  export const getBlogs = async (): Promise<Blog[]> => {
    const res = await fetch("http://localhost:8080/blogs");
    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }
    return res.json();
  };
  
  // Create a new blog
  export const createBlog = async (newBlog: Blog): Promise<Blog> => {
    const res = await fetch("http://localhost:8080/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBlog),
    });
  
    if (!res.ok) {
      throw new Error("Failed to create blog");
    }
  
    return res.json(); // Return the created blog data
  };
  
// Delete a blog by ID
export const deleteBlog = async (id: number): Promise<void> => {
  const res = await fetch(`http://localhost:8080/blogs/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete blog");
  }
};

  // Update a blog by ID
  export const updateBlog = async (id: number, updatedBlog: Blog): Promise<Blog> => {
    const res = await fetch(`http://localhost:8080/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBlog),
    });
  
    if (!res.ok) {
      throw new Error("Failed to update blog");
    }
  
    return res.json(); // Return the updated blog data
  };
  
  // Create a comment
export const createComment = async (blogId: number, newComment: Comment): Promise<Comment> => {
    const res = await fetch(`http://localhost:8080/blogs/${blogId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });
  
    if (!res.ok) {
      throw new Error("Failed to create comment");
    }
  
    return res.json(); // Return the created comment data
  };

  // api.ts

// Fetch comments for a specific blog post
export const getComments = async (blogId: number): Promise<Comment[]> => {
    const res = await fetch(`http://localhost:8080/blogs/${blogId}/comments`);
    if (!res.ok) {
      throw new Error(`Failed to fetch comments for blog with ID: ${blogId}`);
    }
    return res.json();
  };
  