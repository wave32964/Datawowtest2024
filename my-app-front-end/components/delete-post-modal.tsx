"use client"

import { Modal } from "./modal-component"

interface DeletePostModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

export function DeletePostModal({ isOpen, onClose, onDelete }: DeletePostModalProps) {
  return (
    <Modal
      title="Please confirm if you wish to delete this post"
      description="Are you sure you want to delete this post? This action is permanent and cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onDelete}
      variant="delete"
    />
  )
}