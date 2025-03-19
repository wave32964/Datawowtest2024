"use client"

import { useState } from "react"
import { Modal } from "./modal-component"
import { Textarea } from "@/components/ui/textarea"

interface EditPostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string) => void
  itemId: number
  post:Post
  onUpdateSuccess?: () => void
}

interface Post {
    id: number;
    author: string;
    avatar: string;
    category: string;
    title: string;
    excerpt: string;
    content: string;
    comments: number;
    timeAgo: string; // You can adjust this field as needed
  }

export function EditPostModal({ isOpen, onClose, onSubmit,post,itemId,onUpdateSuccess}: EditPostModalProps) {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    onSubmit(content)
  
    onClose()
  }



  return (
    <Modal title="Edit Post" isOpen={isOpen} itemId={itemId} post={post} initialContent={content} onClose={onClose} onUpdateSuccess={onUpdateSuccess} variant="edit">
      <div className="py-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px]"
          placeholder="Enter post content..."
        />
      </div>
    </Modal>
  )
}