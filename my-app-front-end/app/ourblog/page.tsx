"use client";

import { useEffect, useState } from "react";
import { CreatePostModal } from "@/components/create-post-modal";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BlogPostList from "@/components/blog-post-list";
import { Input } from "@/components/ui/input";
import { createBlog, Blog, getBlogs } from "@/utils/api";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "../types/type";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Home,
  FileText,
  Plus,
  ChevronDown,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useMediaQuery } from "../hook/use-mobile";

export default function OurBlogPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPost, setSelectedPost] = useState<(typeof posts)[0] | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>(""); // State to hold the search term
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]); // Add comments state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Track if search input is focused
  const handlePostCreation = (newPost: Blog) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
    setShouldRefetch(true); // Trigger re-fetch to ensure consistency with backend
  };
  const onDeleteSuccess = async () => {
    setShouldRefetch(true);
  };

  const onUpdateSuccess = () => {
    setShouldRefetch(true); // Trigger re-fetch
  };

  // Handle when the search input is focused
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const OnCommentSuccess = () =>{
    console.log("Comment Success")
  }

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };
  const filteredPosts = posts.filter((post) => {
    // Check if the search term is at least 2 characters
    
    const isMatchingSearch =
      searchTerm.length >= 2
        ? post.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true; // If searchTerm is too short, return all posts
  
    // Check if the category is selected
    const isMatchingCategory =
      selectedCategory && selectedCategory !== "" 
        ? selectedCategory === "Others" // If "Other" is selected, exclude posts with category "Other"
          ? post.category.toLowerCase() !== "others"  // Exclude "Other" category posts
          : post.category.toLowerCase() === selectedCategory.toLowerCase() // If a category is selected, filter posts by that category
        : true; // If no category is selected, don't filter by category

    // Return posts that match both search and category (if applicable)
    return isMatchingSearch && isMatchingCategory;
  });

  // Fetch authentication data
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    } else {
      setIsAuthenticated(false);
      setUsername("");

      // If not authenticated, redirect to login page
      router.push("/login");
    }
  }, [router]); // Ensure useRouter is used inside useEffect

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!isAuthenticated || !username) return; // Exit if not authenticated

      try {
        const response = await fetch(`http://localhost:8080/blogs`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const postsData = await response.json();
        const filteredPosts = postsData.filter(
          (post: Post) => post.author === username
        );
        setPosts(filteredPosts); // Update posts state
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setShouldRefetch(false); // Reset refetch flag
      }
    };

    fetchPosts();
  }, [isAuthenticated, username, shouldRefetch]); // Re-run when these change

  const handlePostClick = (postId: number) => {
    if (isMobile) {
      const post = posts.find((p) => p.id === postId);
      setSelectedPost(post || null);
    } else {
      router.push(`/posts/${postId}`);
    }
  };

  const handlePostComment = async () => {
    if (!comment.trim() || !selectedPost) return; // Don't post empty comments or if no post is selected

    const username = localStorage.getItem("username");
    const avatar = "https://example.com/avatar.jpg"; // Replace with actual avatar URL if available

    if (!username) {
      console.error("User is not logged in");
      return;
    }

    const newComment = {
      blog_id: selectedPost.id, // Use the selected post's ID
      author: username,
      avatar: avatar,
      content: comment,
      timeAgo: "Just now", // This can be updated on the backend
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
        setComments((prevComments) => [createdComment, ...prevComments]); // Add new comment to state
        setComment(""); // Clear the input field
        setSelectedPost(null);
        OnCommentSuccess()
        
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
          <h1>Landing Page</h1>
          <p>Redirecting to login page...</p>
        </div>
      </header>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} />
      <div className="flex flex-1 bg-grey-100">
        <aside className="w-64 bg-grey-100 p-4 hidden md:block">
          <nav className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/ourblog"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <FileText className="h-5 w-5" />
              <span>Our Blog</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:mr-60">
          <div className="flex items-center justify-between mb-6">
          <div className="relative w-full md:pr-7">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-10 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus} // Set focused state to true when search is focused
                onBlur={handleSearchBlur} // Set focused state to false when search loses focus
              />
            </div>
            {!(isMobile && isSearchFocused) && (
              <div className="flex items-center gap-3">
               <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2">
                    <h1 className="text-black">Community</h1>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("Food")}
                      className={`hover:bg-gray-100 flex items-center justify-between ${
                        selectedCategory === "Food"
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      <span>Food</span>
                      {selectedCategory === "Food" && (
                        <Check className="h-4 w-4 text-black" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("Pet")}
                      className={`hover:bg-gray-100 flex items-center justify-between ${
                        selectedCategory === "Pet"
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      <span>Pet</span>
                      {selectedCategory === "Pet" && (
                        <Check className="h-4 w-4 text-black" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("Health")}
                      className={`hover:bg-gray-100 flex items-center justify-between ${
                        selectedCategory === "Health"
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      <span>Health</span>
                      {selectedCategory === "Health" && (
                        <Check className="h-4 w-4 text-black" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("Fashion")}
                      className={`hover:bg-gray-100 flex items-center justify-between ${
                        selectedCategory === "Fashion"
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      <span>Fashion</span>
                      {selectedCategory === "Fashion" && (
                        <Check className="h-4 w-4 text-black" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("Exercise")}
                      className={`hover:bg-gray-100 flex items-center justify-between ${
                        selectedCategory === "Exercise"
                          ? "bg-green-100 "
                          : ""
                      }`}
                    >
                      <span>Exercise</span>
                      {selectedCategory === "Exercise" && (
                        <Check className="h-4 w-4 text-black" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("Others")}
                      className={`hover:bg-gray-100 flex items-center justify-between ${
                        selectedCategory === "Others"
                          ? "bg-green-100 "
                          : ""
                      }`}
                    >
                      <span>Other</span>
                      {selectedCategory === "Others" && (
                        <Check className="h-4 w-4 text-black" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-success hover:bg-success text-white font-bold flex items-center gap-1"
                >
                  Create <Plus className="h-1 w-1" />
                </Button>
              </div>
            )}
          </div>

          <BlogPostList
            onDeleteSuccess={onDeleteSuccess}
            onUpdateSuccess={onUpdateSuccess}
            posts={filteredPosts}
            onPostClick={handlePostClick}
            onCommentSuccess={OnCommentSuccess}
          />

          <Dialog
            open={!!selectedPost && isMobile}
            onOpenChange={(open) => !open && setSelectedPost(null)}
          >
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto p-0">
              <DialogTitle className="sr-only">Add Comment</DialogTitle>
              {selectedPost && (
                <div className="border rounded-md p-4">
                  <h3 className="text-xl font-medium mb-2">Add Comments </h3>
                  <Textarea
                    placeholder="What's on your mind..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] mb-4 border-dashed"
                  />
                  <div className="flex flex-col gap-4">
                    <Button variant="outline" className="flex-1">
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
        </main>
      </div>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreation}
      />
    </div>
  );
}
