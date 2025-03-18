"use client"

import type React from "react"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/app/hook/use-mobile"

interface ModalProps {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  children?: React.ReactNode
  variant?: "edit" | "delete"
}

export function Modal({ title, description, isOpen, onClose, onConfirm, children, variant = "edit" }: ModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Ensure the modal state is synced with the isOpen prop
//   useEffect(() => {
//     if (!isOpen) {
//       onClose()
//     }
//   }, [isOpen, onClose])

const buttonColor = variant === "delete" 
? "bg-red-600 hover:bg-red-700 text-white" 
: "bg-success hover:bg-green-700 text-white";

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
            <Button className={`${buttonColor} px-4 py-2`} onClick={onConfirm}>
              {variant === "delete" ? "Delete" : "Submits"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
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
        <Button className={`${buttonColor} px-4 py-2`} onClick={onConfirm}>
          {variant === "delete" ? "Delete" : "Submits"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}