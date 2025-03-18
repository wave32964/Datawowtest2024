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
import { useMediaQuery } from "../hook/use-mobile";

// Sample post data - in a real app, this would come from an API or database
const posts = [
  {
    id: "1",
    author: "Wittawat",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "History",
    title: "The Beginning of the End of the World",
    excerpt:
      "The afterlife sitcom The Good Place comes to its culmination, the show's two protagonists, Eleanor and Chidi, contemplate their future. Having lived thousands upon thousands of lifetimes together, and having experienced virtually everything this life has to offer...",
    content:
      "The afterlife sitcom The Good Place comes to its culmination, the show's two protagonists, Eleanor and Chidi, contemplate their future. Having lived thousands upon thousands of lifetimes together, and having experienced virtually everything this life has to offer, they decide it's time to walk through the door that leads to true finality. The show's message is that even paradise becomes meaningless without the possibility of an ending.",
    comments: 32,
    timeAgo: "5mo. ago",
  },
  {
    id: "2",
    author: "Zach",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "History",
    title: "The Big Short War",
    excerpt:
      'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. "I would\'ve..."',
    content:
      'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. "I would\'ve lost it."\n\n"Admit it," his father said. "You didn\'t study." "One wrong on the verbal," Wes said. "One wrong on the math," Tim mused. "I\'m still convinced some of the questions were wrong."',
    comments: 4,
    timeAgo: "5mo. ago",
  },
  {
    id: "3",
    author: "Nicholas",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Exercise",
    title: "The Mental Health Benefits of Exercise",
    excerpt:
      "You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?",
    content:
      "You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?\n\nResearch shows that exercise is as effective as antidepressants in some cases and that maintaining an exercise schedule can prevent you from relapsing. Exercise is a powerful tool for people with depression, ADHD, anxiety, and more. It promotes all kinds of changes in the brain, including neural growth, reduced inflammation, and new activity patterns that promote feelings of calm and well-being.",
    comments: 32,
    timeAgo: "3mo. ago",
  },
  {
    id: "4",
    author: "Carl",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "History",
    title: "What Makes a Man Betray His Country?",
    excerpt:
      "The life of Adolf Tolkachev, Soviet dissident and CIA spy. Excerpted from The Billion Dollar Spy: A True Story of Cold War Espionage",
    content:
      "The life of Adolf Tolkachev, Soviet dissident and CIA spy. Excerpted from The Billion Dollar Spy: A True Story of Cold War Espionage.\n\nIn 1977, Adolf Tolkachev, a Russian engineer who worked in a military aviation institute, began passing secrets to the CIA about Soviet radar and avionics systems. His espionage career lasted nearly a decade and provided the United States with information that saved billions in defense spending. What drove him to betray his country? Not money, though the CIA paid him millions of rubles. It was revenge: The Soviet system had destroyed his wife's parents during Stalin's Great Terror.",
    comments: 0,
    timeAgo: "2mo. ago",
  },
];

// Sample comments
const sampleComments = [
  {
    id: "1",
    author: "Wittawat98",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio lacuis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.",
    timeAgo: "12h ago",
  },
  {
    id: "2",
    author: "Hawaii51",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio lacuis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.",
    timeAgo: "1mo. ago",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPost, setSelectedPost] = useState<(typeof posts)[0] | null>(
    null
  );
  const [username, setUsername] = useState<string>("");
  const [comment, setComment] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)");
  const filteredPosts = posts.filter(post => post.author === username);
  useEffect(() => {
    // Check if the user is authenticated by checking for auth_token in localStorage
    const token = localStorage.getItem("auth_token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      // If token exists and username is found, mark as authenticated
      setIsAuthenticated(true);
      setUsername(storedUsername); // Set the username from localStorage
    } else {
      // If no token or username, redirect to login
      router.push("/login");
    }
  }, [router]);

  const handlePostClick = (postId: string) => {
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

            <BlogPostList posts={filteredPosts} onPostClick={handlePostClick} />

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
