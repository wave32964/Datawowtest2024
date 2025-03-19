"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMediaQuery } from "@/app/hook/use-mobile"

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

interface ModalProps {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  post?: Post
  children?: React.ReactNode
  variant?: "edit" | "delete"
  itemId?: number // ID of the item to be deleted (optional for "edit" variant)
  initialContent?: string // Content for the update (only for edit variant)
  onDeleteSuccess?: () => void // Callback to handle successful deletion
  onUpdateSuccess?: () => void // Callback for successful update
}

export function Modal({
  title,
  post,
  description,
  isOpen,
  onClose,
  children,
  variant = "edit",
  itemId,
  initialContent,
  onDeleteSuccess,
  onUpdateSuccess,
}: ModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const buttonColor = variant === "delete" 
    ? "bg-red-600 hover:bg-red-700 text-white" 
    : "bg-success hover:bg-green-700 text-white";

  // Unified handleClick function for both delete and update
  const handleClick = async () => {
    if (!itemId) return; // Ensure itemId is provided for both actions

    try {
      if (variant === "delete") {
        // Perform delete action
        const response = await fetch(`http://localhost:8080/blogs/${itemId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log("Item successfully deleted");
          onDeleteSuccess && onDeleteSuccess(); // Trigger the parent re-fetch or re-render
        } else {
          console.error("Failed to delete the item");
        }
      } else if (variant === "edit" ) {
        // Perform update (edit) action
        const response = await fetch(`http://localhost:8080/blogs/${itemId}`, {
            method: "PUT", // Use PUT to update the resource
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...post, // Spread the original post data to retain all values
              content: initialContent, // Only update the content
            }),
          });
    

        if (response.ok) {
          console.log("Item successfully updated");
          onUpdateSuccess && onUpdateSuccess(); // Trigger success callback for update
        } else {
          console.error("Failed to update the item");
        }
      }
    } catch (error) {
      console.error("Error occurred during the operation:", error);
    } finally {
      onClose(); // Close the modal after the action
    }
  };

  // Return the modal content with different styles based on the variant (edit or delete)
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className={`sm:max-w-[425px] ${variant === "delete" ? "h-[300px]" : "h-[685px]"}`}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className={`${buttonColor} px-4 py-2`} onClick={handleClick}>
              {variant === "delete" ? "Delete" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[425px] ${variant === "delete" ? "h-[250px]" : "h-[700px]"}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className={`${buttonColor} px-4 py-2`} onClick={handleClick}>
            {variant === "delete" ? "Delete" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
