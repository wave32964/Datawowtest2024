"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/app/hook/use-mobile";
import { createBlog, Blog,CreateBlog } from "@/utils/api"; // Import createBlog API function
import { ChevronDown } from "lucide-react";
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: CreateBlog) => void; // Adjusted to accept the new post as a parameter
}

type Community = {
  id: string;
  name: string;
};

const communities: Community[] = [
  { id: "history", name: "History" },
  { id: "food", name: "Food" },
  { id: "pets", name: "Pets" },
  { id: "health", name: "Health" },
  { id: "fashion", name: "Fashion" },
  { id: "exercise", name: "Exercise" },
  { id: "others", name: "Others" },
];

export function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [username, setUsername] = useState<string>("Anonymous"); // Default to "Anonymous"

  // Use useEffect to access localStorage after component mounts on the client
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername); // Set username if it exists in localStorage
    }
  }, []);

  if (!isOpen) return null;

  const handleCreatePost = async () => {
    try {
      const newPost: CreateBlog = {
        author: username, // Use the username from localStorage
        avatar: "/placeholder.svg?height=40&width=40", // Placeholder avatar
        category: selectedCommunity?.name ?? "",
        title: title,
        excerpt: content.slice(0, 100), // Generate an excerpt from the content
        content: content,
        comments: 0,
        timeAgo: "Just now",
      };
      // Call the API to create the post
      const createdPost = await createBlog(newPost);
      onPostCreated(createdPost);

      // Optionally, you can add the created post to the in-memory posts or handle it as needed
      console.log("Created post:", createdPost);

      // Reset the form fields
      setTitle("");
      setContent("");
      setSelectedCommunity(null);

      // Close the modal after the post is created
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create the post");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg relative flex flex-col",
          isMobile ? "w-full max-w-[2000px]" : "w-full max-w-[685px]"
        )}
      >
        <div className="flex justify-between items-center p-4 ">
          <h2 className="text-2xl font-semibold">Create Post</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-center font-bold md:w-[200px]  md:text-left text-success"
              >
                {selectedCommunity
                  ? selectedCommunity.name
                  : "Choose a community"}
                <span className="ml-2">
                  <ChevronDown className="text-success" />
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-full min-w-[200px]">
              {communities.map((community) => (
                <DropdownMenuItem
                  key={community.id}
                  onClick={() => setSelectedCommunity(community)}
                  className={`flex items-center justify-between ${
                    selectedCommunity?.id === community.id
                      ? "bg-green-100 text-black"
                      : "bg-white text-black"
                  } hover:text-green-600`}
                >
                  <p className="text-black ">{community.name}</p>
                  {selectedCommunity?.id === community.id && (
                    <Check className="h-4 w-4 text-black" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />

          <Textarea
            placeholder="What's on your mind..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "w-full resize-none",
              isMobile ? "h-[300px]" : "h-[234px]"
            )}
          />
        </div>

        <div
          className={cn(
            "p-4 flex",
            isMobile ? "flex-col gap-2" : "justify-end gap-4"
          )}
        >
          <Button
            variant="outline"
            onClick={onClose}
            className={isMobile ? "w-full text-success " : "text-success"}
          >
            Cancel
          </Button>
          <Button
            className={cn(
              "bg-green-600 hover:bg-green-700",
              isMobile ? "w-full" : "w-[60px]"
            )}
            onClick={handleCreatePost}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
