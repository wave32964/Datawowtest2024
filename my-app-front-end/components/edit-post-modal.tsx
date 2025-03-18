"use client"

import { useState } from "react"
import { Modal } from "./modal-component"
import { Textarea } from "@/components/ui/textarea"

interface EditPostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string) => void
  initialContent: string
}

export function EditPostModal({ isOpen, onClose, onSubmit, initialContent }: EditPostModalProps) {
  const [content, setContent] = useState(initialContent)

  const handleSubmit = () => {
    onSubmit(content)
    onClose()
  }

  return (
    <Modal title="Edit Post" isOpen={isOpen} onClose={onClose} onConfirm={handleSubmit} variant="edit">
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