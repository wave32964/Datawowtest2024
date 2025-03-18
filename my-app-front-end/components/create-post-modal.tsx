"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import { useMediaQuery } from "@/app/hook/use-mobile"
interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

type Community = {
  id: string
  name: string
}

const communities: Community[] = [
  { id: "history", name: "History" },
  { id: "food", name: "Food" },
  { id: "pets", name: "Pets" },
  { id: "health", name: "Health" },
  { id: "fashion", name: "Fashion" },
  { id: "exercise", name: "Exercise" },
  { id: "others", name: "Others" },
]

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg relative flex flex-col",
          isMobile ? "w-full max-w-[2000px]" : "w-full max-w-[685px]",
        )}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Create Post</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-left font-normal">
                {selectedCommunity ? selectedCommunity.name : "Choose a community"}
                <span className="ml-2">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[200px]">
              {communities.map((community) => (
                <DropdownMenuItem
                  key={community.id}
                  onClick={() => setSelectedCommunity(community)}
                  className="flex items-center justify-between"
                >
                  {community.name}
                  {selectedCommunity?.id === community.id && <Check className="h-4 w-4 text-green-500" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full" />

          <Textarea
            placeholder="What's on your mind..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn("w-full resize-none", isMobile ? "h-[300px]" : "h-[234px]")}
          />
        </div>

        <div className={cn("p-4 flex", isMobile ? "flex-col gap-2" : "justify-end gap-4")}>
          <Button variant="outline" onClick={onClose} className={isMobile ? "w-full" : ""}>
            Cancel
          </Button>
          <Button className={cn("bg-green-600 hover:bg-green-700", isMobile ? "w-full" : "")}>Post</Button>
        </div>
      </div>
    </div>
  )
}

