"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MessageSquare, Home, FileText, Plus, ChevronDown, Search } from "lucide-react"

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
    comments: 32,
  },
  {
    id: "2",
    author: "Zach",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "History",
    title: "The Big Short War",
    excerpt:
      'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. "I would\'ve..."',
    comments: 4,
  },
  {
    id: "3",
    author: "Nicholas",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Exercise",
    title: "The Mental Health Benefits of Exercise",
    excerpt:
      "You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?",
    comments: 32,
  },
  {
    id: "4",
    author: "Carl",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "History",
    title: "What Makes a Man Betray His Country?",
    excerpt:
      "The life of Adolf Tolkachev, Soviet dissident and CIA spy. Excerpted from The Billion Dollar Spy: A True Story of Cold War Espionage",
    comments: 0,
  },
]

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if the user is authenticated by checking for auth_token in localStorage
    const token = localStorage.getItem("auth_token")

    if (token) {
      // If token exists, mark as authenticated
      setIsAuthenticated(true)
    } else {
      // If no token, redirect to login
      router.push("/login")
    }
  }, [router])

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isAuthenticated={isAuthenticated} />
        <div className="flex flex-1 bg-slate-200">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-200 p-4 hidden md:block">
            <nav className="space-y-4">
              <Link href="#" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
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
                <Input type="search" placeholder="Search" className="pl-10 bg-slate-100 border-slate-200" />
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
                <Button className="bg-success hover:bg-success text-white flex items-center gap-1">
                  Create <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Blog posts */}
            <div className="bg-white rounded-2xl">
              {posts.map((post, index) => (
                <div key={post.id}>
                  <Link href={`/posts/${post.id}`} className="block p-6 transition-colors hover:bg-slate-50">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={post.avatar} alt={post.author} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{post.author}</span>
                        </div>
                        <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1">
                          {post.category}
                        </span>
                        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                        <p className="text-slate-600 mb-3 line-clamp-2">{post.excerpt}</p>
                        {post.comments > 0 && (
                          <div className="flex items-center text-slate-500 text-sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{post.comments} Comments</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  {index < posts.length - 1 && <div className="w-full h-px bg-gray-300 my-4"></div>}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <header className="bg-gray-800 p-4">
      <div>
        <h1>Landing Page</h1>
        <p>Redirecting to login page...</p>
      </div>
    </header>
  )
}

