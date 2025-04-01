"use client"

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Post } from "@/app/types/type";
interface EditPostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string) => void
  itemId?: number
  post: Post
  onUpdateSuccess?: () => void
}

type Community = {
  id: string;
  name: string;
};

const communities: Community[] = [
  { id: "history", name: "History" },
  { id: "pets", name: "Pets" },
  { id: "health", name: "Health" },
  { id: "fashion", name: "Fashion" },
  { id: "exercise", name: "Exercise" },
  { id: "others", name: "Others" },
];

export function EditPostModal({
  isOpen,
  onClose,
  onSubmit,
  post,
  itemId,
  onUpdateSuccess,
}: EditPostModalProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (post && isOpen) {
      setContent(post.content || "");
      setTitle(post.title || "");
      setCategory(post.category || "");
    }
  }, [post, isOpen]);

  const handleSubmit = async () => {
    try {
      onSubmit(content);
      
      const response = await fetch(`http://localhost:3001/blogs/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...post,
          title,
          content,
          category, // This will now contain the selected category
        }),
      });

      if (response.ok) {
        console.log("Item successfully updated");
        onUpdateSuccess && onUpdateSuccess();
      } else {
        console.error("Failed to update the item");
      }
    } catch (error) {
      console.error("Error occurred during the operation:", error);
    } finally {
      onClose();
    }
  };


  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "visible" : "invisible"}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-2xl font-semibold">Edit Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Editable Dropdown for Category */}
          <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-full justify-center font-bold md:w-[120px] md:text-left">
        {/* Apply text-success to the selected category */}
        <span className={category ? "text-success" : "text-black"}>
          {category || "Select Category"}
        </span>
        <span className="ml-2">
          <ChevronDown className="text-success" />
        </span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent className="w-full min-w-[200px]">
      {communities.map((community) => (
        <DropdownMenuItem
          key={community.id}
          onClick={() => setCategory(community.name)}
          className="flex items-center justify-between bg-white hover:text-green-600"
        >
          <p className="text-black">
            {community.name}
          </p>
          {category.toLowerCase() === community.name.toLowerCase() && (
            <Check className="h-4 w-4 text-black" />
          )}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>

          {title && (
            <div className="mb-4">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Post title"
              />
            </div>
          )}

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] w-full border rounded-md p-3"
            placeholder="Enter post content..."
          />
        </div>

        <div className="flex justify-end gap-2 p-4">
          <Button variant="outline" onClick={onClose} className="px-6 text-success py-2 rounded-md">
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSubmit}
            className="px-6 py-2 bg-success hover:bg-green-600 text-white rounded-md"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}