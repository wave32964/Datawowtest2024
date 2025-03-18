"use client"

import type * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModalProps {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  children?: React.ReactNode
  variant?: "edit" | "delete"
  className?: string
}

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  children,
  variant = "edit",
  className,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("sm:max-w-[425px] p-0 gap-0", "w-[90vw] max-w-[425px] rounded-md", className)}>
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription className="mt-2 text-sm">{description}</DialogDescription>}
        </DialogHeader>

        <div className="px-4 py-3">{children}</div>

        <DialogFooter className="flex p-4 pt-2 gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button
            variant={variant === "delete" ? "destructive" : "default"}
            onClick={onConfirm}
            className="flex-1 sm:flex-none"
          >
            {variant === "delete" ? "Delete" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}