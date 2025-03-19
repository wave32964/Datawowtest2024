"use client"

import { Button } from "@/components/ui/button"

interface DeletePostModalProps {
  isOpen: boolean
  itemId: number
  onClose: () => void
  onDeleteSuccess?: () => void
  onDelete: () => void
}

export function DeletePostModal({ isOpen, onClose, onDelete, onDeleteSuccess, itemId }: DeletePostModalProps) {
  const handleDelete = async () => {
    try {
      // Perform delete action
      const response = await fetch(`http://localhost:8080/blogs/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Item successfully deleted");
        onDelete(); // Trigger the provided onDelete callback
        if (onDeleteSuccess) {
          onDeleteSuccess(); // Trigger the success callback if provided
        }
        onClose(); // Close the modal
      } else {
        console.error("Failed to delete the item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm md:max-w-md mx-4 overflow-hidden">
        <div className="p-5">
          <h2 className="text-lg font-medium mb-4">Please confirm if you wish to delete the post</h2>

          <p className="text-sm text-gray-600 mb-6 md:justify-center flex">
            Are you sure you want to delete this post?
            <br />
            Once deleted, it cannot be recovered.
          </p>

          <div className="flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="w-full md:w-[200px] border border-gray-300 py-2"
            >
              Cancel
            </Button>

            <Button 
              onClick={handleDelete} 
              className="w-full md:w-[200px] md:ml-2 bg-red-500 hover:bg-red-600 text-white py-2"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}