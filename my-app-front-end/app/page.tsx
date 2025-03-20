"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Check } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BlogPostList from "@/components/blog-post-list";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useMediaQuery } from "./hook/use-mobile";
import { CreatePostModal } from "@/components/create-post-modal";
import { createBlog, Blog, getBlogs } from "@/utils/api"; // Import getBlogs to fetch posts

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State to hold the search term
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // State to hold selected category
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Track if search input is focused
  const [newPost, setNewPost] = useState<Blog>({
    id: 1, // Leave ID empty initially
    title: "",
    category: "",
    content: "",
    author: "Anonymous",
    avatar: "/placeholder.svg?height=40&width=40",
    excerpt: "",
    comments: 0,
    timeAgo: "Just now",
  });
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]); // Add comments state
  const [posts, setPosts] = useState<Blog[]>([]); // Initialize state to store blog posts
  const isMobile = useMediaQuery("(max-width: 768px)");
  // Filter posts based on the search term only if the searchTerm is 2 characters or more
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
          ? post.category.toLowerCase() !== "others" // Exclude "Other" category posts
          : post.category.toLowerCase() === selectedCategory.toLowerCase() // If a category is selected, filter posts by that category
        : true; // If no category is selected, don't filter by category

    // Return posts that match both search and category (if applicable)
    return isMatchingSearch && isMatchingCategory;
  });
  // Handle when the search input is focused
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Handle when the search input is blurred
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  useEffect(() => {
    // Check if the user is authenticated by checking for auth_token in localStorage
    const token = localStorage.getItem("auth_token");

    if (token) {
      // If token exists, mark as authenticated
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    // Fetch the blog posts when the component mounts
    const fetchBlogs = async () => {
      try {
        const fetchedBlogs = await getBlogs(); // Fetch blog posts using the getBlogs function
        setPosts(fetchedBlogs); // Update the posts state with the fetched data
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs(); // Call the function to fetch the blogs
  }, []);

  const handlePostClick = (postId: number) => {
    // if (isMobile) {
    //   // When on mobile, we can set the selected post based on its id
    //   const post = posts.find((p) => p.id === postId); // Find the full post object based on the id
    //   setSelectedPost(post || null);
    // } else {
    router.push(`/posts/${postId}`); // Use the postId for navigation
    // }
  };
  const OnCommentSuccess = () => {
    console.log("Comment Success");
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
        OnCommentSuccess();
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  const handlePostCreation = (newPost: Blog) => {
    // Update posts state with the new post to trigger re-render
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} />
      <div className="flex flex-1 bg-grey-100">
        {/* Sidebar */}
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

        {/* Main content */}
        <main className="flex-1 p-4 md:mr-60 ">
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
                  Create <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <BlogPostList
            posts={filteredPosts}
            onPostClick={handlePostClick}
            onCommentSuccess={OnCommentSuccess}
          />

          {/* Mobile Post Detail Modal */}
          <Dialog
            open={!!selectedPost && isMobile}
            onOpenChange={(open) => !open && setSelectedPost(null)}
          >
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto p-0">
              <DialogTitle className="sr-only">Add Comment</DialogTitle>

              {selectedPost && (
                <div className="border rounded-md p-4 h-[400px]">
                  <h3 className="text-xl font-medium mb-2 mt-6">
                    Add Comments
                  </h3>
                  <Textarea
                    placeholder="What's on your mind..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[180px] mb-4 border-dashed"
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
          <CreatePostModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPostCreated={handlePostCreation}
          />
        </main>
      </div>
    </div>
  );
}
