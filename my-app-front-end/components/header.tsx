// components/Header.tsx

"use client"; // Add this line to mark the file as a client-side component

import { Button } from "./ui/button";
import { useRouter } from "next/navigation"; // Import useRouter hook
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
type HeaderProps = {
  isAuthenticated: boolean; // Define the type for `token`
};
export default function Header({ isAuthenticated }: HeaderProps) {
  const router = useRouter(); // Get the router instance
  
  const handleLogin = () => {
    router.push("/login"); // Redirect to login page when button is clicked
  };
  return (
    <header className="py-3 bg-green-500">
      <div className="flex justify-between items-center">
        <p className="ml-[20px] italic text-[20px] text-white font-castoro">a Board</p>

        <div className="mr-[20px] flex items-center">
          {/* If authenticated, display the avatar */}
          {isAuthenticated ? (
            <div

              className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer flex items-center justify-center"
            >
              {/* You can use a placeholder avatar or a user's avatar */}
              <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Wittawat" />
              <AvatarFallback>W</AvatarFallback>
            </Avatar>
            </div>
          ) : (
            // If not authenticated, show the Sign In button
            <Button
              onClick={handleLogin}
              className="bg-success hover:bg-success w-auto"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
