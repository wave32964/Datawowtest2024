"use client"
import React from 'react' // Add this import
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Home, FileText, MessageSquare } from "lucide-react"

// Sample post data - in a real app, this would come from an API or database
const posts = [
  {
    id: "1",
    author: "Wittawat",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "History",
    title: "The Beginning of the End of the World",
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
    content:
      'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. "I would\'ve lost it."\n\n"Admit it," his father said. "You didn\'t study." "One wrong on the verbal," Wes said. "One wrong on the math," Tim mused. "I\'m still convinced some of the questions were wrong."',
    comments: 32,
    timeAgo: "5mo. ago",
  },
  {
    id: "3",
    author: "Nicholas",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Exercise",
    title: "The Mental Health Benefits of Exercise",
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
    content:
      "The life of Adolf Tolkachev, Soviet dissident and CIA spy. Excerpted from The Billion Dollar Spy: A True Story of Cold War Espionage.\n\nIn 1977, Adolf Tolkachev, a Russian engineer who worked in a military aviation institute, began passing secrets to the CIA about Soviet radar and avionics systems. His espionage career lasted nearly a decade and provided the United States with information that saved billions in defense spending. What drove him to betray his country? Not money, though the CIA paid him millions of rubles. It was revenge: The Soviet system had destroyed his wife's parents during Stalin's Great Terror.",
    comments: 15,
    timeAgo: "2mo. ago",
  },
]

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
  {
    id: "3",
    author: "Helo_re",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio lacuis sed aliquet.",
    timeAgo: "3mo. ago",
  },
]
type PostDetailProps = {
    params: Promise<{ id: string }>; 
  };
  
  export default function PostDetail({ params: paramsPromise }: PostDetailProps) {
    const params = React.use(paramsPromise)
  const router = useRouter()
  const [comment, setComment] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Find the post with the matching ID
  const post = posts.find((p) => p.id === params.id) || posts[0]

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("auth_token")
    if (token) {
      setIsAuthenticated(true)
    } else {
      router.push("/login")
    }
  }, [router])

  const handlePostComment = () => {
    // Handle posting comment logic here
    console.log("Posted comment:", comment)
    setComment("")
  }

  if (!isAuthenticated) {
    return (
      <header className="bg-gray-800 p-4">
        <div>
          <h1>Post Detail</h1>
          <p>Redirecting to login page...</p>
        </div>
      </header>
    )
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
            <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <FileText className="h-5 w-5" />
              <span>Our Blog</span>
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-white p-4 md:p-6 md:mr-60">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 mb-4">
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
              {/* Online indicator - green dot */}
              <div className="w-2 h-2 bg-green-500 rounded-full md:block hidden"></div>
            </div>

            {/* Category - only visible on desktop */}
            <div className="hidden md:block mb-2">
              <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
                {post.category}
              </span>
            </div>

            {/* Post title - only visible on desktop */}
            <h1 className="text-2xl font-bold mb-4 hidden md:block">{post.title}</h1>

            {/* Post content - only visible on desktop */}
            <div className="prose mb-6 hidden md:block">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Comment count - only visible on desktop */}
            <div className="flex items-center text-slate-500 text-sm mb-6 hidden md:block">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.comments} Comments</span>
            </div>

            {/* Comment form */}
            <div className="mb-6">
              <div className="border rounded-md p-4 md:p-0 md:border-0">
                <h3 className="text-lg font-medium mb-2 md:hidden">Add Comments</h3>
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
            </div>

            {/* Comments */}
            <div className="space-y-6">
              {sampleComments.map((comment, index) => (
                <div key={comment.id} className={`flex gap-3 ${index === 2 ? "hidden md:flex" : ""}`}>
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
  )
}

