"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Home, FileText } from "lucide-react";

type PostDetailProps = {
  params: Promise<{ id: string }>;
};

type Blog = {
  id: number;
  author: string;
  avatar: string;
  title: string;
  content: string;
  timeAgo: string;
};

type Comment = {
  id: number;
  blog_id: number;
  author: string;
  avatar: string;
  content: string;
  timeAgo: string;
};

export default function PostDetail({ params: paramsPromise }: PostDetailProps) {

  const router = useRouter();
  const [post, setPost] = useState<Blog | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [params, setParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // Wait for params to resolve
    const fetchParams = async () => {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    };

    fetchParams();
  }, [paramsPromise]);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch blog details
  useEffect(() => {
    if (params?.id) {
      const blogId = parseInt(params.id, 10);  // Convert to integer

      const fetchBlog = async () => {
        try {
          const response = await fetch(`http://localhost:8080/blogs/${blogId}`);
          if (response.ok) {
            const blogData = await response.json();
            setPost(blogData);
          } else {
            console.error("Failed to fetch blog details");
          }
        } catch (error) {
          console.error("Error fetching blog details:", error);
        }
      };

      fetchBlog();
    }
  }, [params]);

  useEffect(() => {
    if (params?.id) {
      const blogId = parseInt(params.id, 10);
  
      const fetchComments = async () => {
        try {
          const response = await fetch(`http://localhost:8080/blogs/${blogId}/comments`);
          
          if (!response) {
            console.error("No response received from server.");
            setComments([]);
            return;
          }
  
          // Handle specific status codes
          if (response.status === 404 || response.status === 204) {
            console.log("No comments yet for this blog post.");
            setComments([]);
            return;
          }
  
          if (!response.ok) {
            console.error("Failed to fetch comments. Status:", response.status);
            setComments([]);
            return;
          }
  
          const data = await response.json();
  
          if (data && Array.isArray(data)) {
            setComments(data);
          } else {
            console.log("No comments yet for this blog post.");
            setComments([]);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
          setComments([]);
        }
      };
  
      fetchComments();
    }
  }, [params]);
  
  
  

  const handlePostComment = async () => {
    if (!comment.trim()) return; // Don't post empty comments
    const username = localStorage.getItem("username");
    const avatar = "https://example.com/avatar.jpg"; // You can also store and use a real avatar URL
  
    if (!username) {
      console.error("User is not logged in");
      return;
    }
    const blogId = parseInt(params?.id ?? "", 10); // If params is null, use an empty string as a fallback

    const newComment = {
      blog_id: blogId, // Replace this with the actual blog_id dynamically
      author: username, // Get the username from localStorage
      avatar: avatar, // Replace with the actual user's avatar URL (if stored)
      content: comment,
      timeAgo: "Just now", // You can update this as needed
    };
  
    try {
      const response = await fetch(`http://localhost:8080/blogs/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
  
      if (response.ok) {
        const createdComment = await response.json();
        setComments((prevComments) => [createdComment, ...prevComments]); // Prepend new comment
        setComment(""); // Clear the input field
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  

  if (!isAuthenticated) {
    return (
      <header className="bg-gray-800 p-4">
        <div>
          <h1>Post Detail</h1>
          <p>Redirecting to login page...</p>
        </div>
      </header>
    );
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} />

      <div className="flex flex-1 bg-slate-200">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-200 p-4 hidden md:block">
          <nav className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link href="/ourblog" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <FileText className="h-5 w-5" />
              <span>Our Blog</span>
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-white p-4 md:p-6">
          {/* Back button */}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          {/* Post content */}
          <div className="max-w-3xl mx-auto">
            {/* Author info */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-sm text-slate-500">{post.timeAgo}</div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full md:block hidden"></div>
            </div>

            {/* Post title and content */}
            <h1 className="text-2xl font-bold mb-4 hidden md:block">{post.title}</h1>
            <div className="prose mb-6 hidden md:block">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Comment form */}
            <div className="mb-6">
              <Textarea
                placeholder="What's on your mind..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] mb-4 border-dashed md:border-solid"
              />
              <div className="flex justify-between gap-4">
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handlePostComment} className="flex-1 bg-[#5a9e6f] hover:bg-[#4a8e5f] text-white">
                  Post
                </Button>
              </div>
            </div>

            {/* Render Comments */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={comment.avatar} alt={comment.author} />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs text-slate-500">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-slate-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
