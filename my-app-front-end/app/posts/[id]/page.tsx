"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Home, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components
import { Comment } from "@/app/types/type";

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

export default function PostDetail({ params: paramsPromise }: PostDetailProps) {
  const router = useRouter();
  const [post, setPost] = useState<Blog | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Add mobile detection state

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed (e.g., 'md' = 768px)
    };
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resolve params
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    };
    fetchParams();
  }, [paramsPromise]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setIsAuthenticated(true);
    else router.push("/login");
  }, [router]);

  // Fetch blog details and comments (unchanged)
  useEffect(() => {
    if (params?.id) {
      const blogId = parseInt(params.id, 10);
      const fetchBlog = async () => {
        try {
          const response = await fetch(`http://localhost:8080/blogs/${blogId}`);
          if (response.ok) setPost(await response.json());
          else console.error("Failed to fetch blog details");
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
          if (!response.ok || response.status === 204) {
            setComments([]);
            return;
          }
          const data = await response.json();
          setComments(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching comments:", error);
          setComments([]);
        }
      };
      fetchComments();
    }
  }, [params]);

  const handlePostComment = async () => {
    if (!comment.trim() || !params?.id) return;
    const username = localStorage.getItem("username");
    if (!username) return console.error("User is not logged in");

    const newComment = {
      blog_id: parseInt(params.id, 10),
      author: username,
      avatar: "https://example.com/avatar.jpg",
      content: comment,
      timeAgo: "Just now",
    };

    try {
      const response = await fetch(`http://localhost:8080/blogs/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      if (response.ok) {
        const createdComment = await response.json();
        setComments((prev) => [createdComment, ...prev]);
        setComment("");
        setShowCommentForm(false); // Close form or dialog after posting
      } else console.error("Failed to post comment");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <header className="bg-gray-800 p-4">
        <h1>Post Detail</h1>
        <p>Redirecting to login page...</p>
      </header>
    );
  }

  if (!post) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} />
      <div className="flex flex-1 bg-slate-200">
        <aside className="w-64 bg-grey-100 p-4 hidden md:block">
          <nav className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <Home className="h-5 w-5" /> <span>Home</span>
            </Link>
            <Link href="/ourblog" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <FileText className="h-5 w-5" /> <span>Our Blog</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 bg-white p-4 md:p-6">
          <Link
            href="#"
            onClick={(e) => { e.preventDefault(); router.back(); }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="max-w-3xl mx-auto">
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

            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <div className="prose mb-6">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-4 text-slate-500">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{comments.length} Comments</span>
            </div>

            {/* Comment Section */}
            <div className="mb-6">
              {!showCommentForm ? (
                <Button
                  onClick={() => setShowCommentForm(true)}
                  variant="outline"
                  className="w-auto px-4 py-2 text-[#5a9e6f] border-[#5a9e6f] hover:bg-[#f8faf8] hover:text-[#4a8e5f] hover:border-[#4a8e5f]"
                >
                  Add Comments
                </Button>
              ) : !isMobile ? (
                // Desktop Inline Form
                <div className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px] mb-4 border-dashed md:border-solid"
                  />
                  <div className="flex justify-between gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowCommentForm(false);
                        setComment("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePostComment}
                      className="flex-1 bg-[#5a9e6f] hover:bg-[#4a8e5f] text-white"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Mobile Dialog */}
            <Dialog
              open={showCommentForm && isMobile}
              onOpenChange={(open) => {
                if (!open) {
                  setShowCommentForm(false);
                  setComment("");
                }
              }}
            >
              <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto p-0">
                <DialogTitle className="sr-only">Add Comment</DialogTitle>
                {post && (
                  <div className="border rounded-md p-4 h-[400px]">
                    <h3 className="text-xl font-medium mb-2 mt-6">Add Comments</h3>
                    <Textarea
                      placeholder="What's on your mind..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[180px] mb-4 border-dashed"
                    />
                    <div className="flex flex-col gap-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowCommentForm(false);
                          setComment("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePostComment}
                        className="flex-1 bg-[#5a9e6f] hover:bg-[#4a8e5f] text-white"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

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