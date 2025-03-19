"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
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
  const [posts, setPosts] = useState<Blog[]>([]); // Initialize state to store blog posts
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // Check if the user is authenticated by checking for auth_token in localStorage
    const token = localStorage.getItem("auth_token");

    if (token) {
      // If token exists, mark as authenticated
      setIsAuthenticated(true);
    } else {
      // If no token, redirect to login
      router.push("/login");
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
    if (isMobile) {
      // When on mobile, we can set the selected post based on its id
      const post = posts.find(p => p.id === postId); // Find the full post object based on the id
      setSelectedPost(post || null);
    } else {
      router.push(`/posts/${postId}`); // Use the postId for navigation
    }
  };

  const handlePostComment = () => {
    // Handle posting comment logic here
    console.log("Posted comment:", comment);
    setComment("");
  };

  const handlePostCreation = (newPost: Blog) => {
    // Update posts state with the new post to trigger re-render
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isAuthenticated={isAuthenticated} />
        <div className="flex flex-1 bg-slate-200">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-200 p-4 hidden md:block">
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
            {/* Search and actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-10 bg-slate-100 border-slate-200"
                />
              </div>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 ">
                    <h1 className="text-black">Community</h1>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem className="hover:bg-gray-100">
                      <span>Food</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-100">
                      <span>Pet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-100">
                      <span>Health</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-100">
                      <span>Fashion</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-100">
                      <span>Exercise</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="hover:bg-gray-100">
                      <span>Other</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={() => setIsModalOpen(true)} className="bg-success hover:bg-success text-white flex items-center gap-1">
                  Create <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <BlogPostList posts={posts} onPostClick={handlePostClick} />

            {/* Mobile Post Detail Modal */}
            <Dialog  open={!!selectedPost && isMobile} onOpenChange={(open) => !open && setSelectedPost(null)}>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto p-0">

      <DialogTitle className="sr-only">Add Comment</DialogTitle>


    {selectedPost && (
      <div className="border rounded-md p-4">
        <h3 className="text-xl font-medium mb-2">
          Add Comments
        </h3>
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
<CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPostCreated={handlePostCreation} />
          </main>
        </div>
      </div>
    );
  }

  return (
    <header className="bg-gray-800 p-4">
      <div>
        <h1>Landing Page</h1>
        <p>Redirecting to login page...</p>
      </div>
    </header>
  );
}
