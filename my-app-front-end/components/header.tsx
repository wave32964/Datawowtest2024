"use client"; // Add this line to mark the file as a client-side component
import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation"; // Import useRouter hook
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/app/hook/use-mobile"; // Hook to detect mobile screens
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"; // Import SheetTitle from Radix UI
import { ArrowRight, AxeIcon,House, MenuIcon,FilePenLine, TvIcon } from "lucide-react";

type HeaderProps = {
  isAuthenticated: boolean; // Define the type for `token`
};

export default function Header({ isAuthenticated }: HeaderProps) {
  const router = useRouter(); // Get the router instance
  const isMobile = useMediaQuery("(max-width: 768px)"); // Detect mobile screen size

  const handleLogin = () => {
    router.push("/login"); // Redirect to login page when button is clicked
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to manage drawer visibility

  return (
    <header className="py-3 bg-green-500">
      <div className="flex justify-between items-center">
        <p className="ml-[20px] italic text-[20px] text-white font-castoro">
          a Board
        </p>

        {/* If on mobile, show the drawer button */}
        {isMobile ? (
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button className="text-white bg-transparent hover:bg-green-700 w-auto">
                <MenuIcon />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-[#2d4739] text-white p-0 w-[280px]"
            >
              {/* Sheet Title for Drawer */}
              <SheetTitle className="text-lg font-bold text-white mt-5 ml-7">
                <ArrowRight />
              </SheetTitle>

              {/* Add your drawer content here */}
              <div className="flex flex-col space-y-4 ml-7 mt-5 ">
                <Link href="/" passHref>
                <div className="flex items-center gap-3">
                <House /> Home
                </div>
                </Link>

                {/* Our Blog Link */}
                <Link href="/ourblog" passHref>
                <div className="flex items-center gap-3">
                <FilePenLine /> Our blog
                </div>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          // Non-mobile (desktop) view will show the login button or avatar
          <div className="mr-[20px] flex items-center">
            {isAuthenticated ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer flex items-center justify-center">
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Wittawat"
                  />
                  <AvatarFallback>W</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-success hover:bg-success w-auto"
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
