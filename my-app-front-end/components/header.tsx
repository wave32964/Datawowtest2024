"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/app/hook/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArrowRight, House, MenuIcon, FilePenLine } from "lucide-react";

type HeaderProps = {
  isAuthenticated: boolean;
};

export default function Header({ isAuthenticated }: HeaderProps) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userInitial, setUserInitial] = useState(""); // State for user's first letter

  // Check localStorage for username when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      const username = localStorage.getItem("username");
      if (username && username.length > 0) {
        setUserInitial(username.charAt(0).toUpperCase()); // Get first letter and capitalize it
      }
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header className="py-3 bg-green-500">
      <div className="flex justify-between items-center">
        <p className="ml-[20px] italic text-[20px] text-white font-castoro">
          a Board
        </p>

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
              <SheetTitle className="text-lg font-bold text-white mt-5 ml-7">
                <ArrowRight onClick={() => setIsDrawerOpen(false)} />
              </SheetTitle>

              <div className="flex flex-col space-y-4 ml-7 mt-5 ">
                <Link href="/" passHref>
                  <div className="flex items-center gap-3">
                    <House /> Home
                  </div>
                </Link>
                <Link href="/ourblog" passHref>
                  <div className="flex items-center gap-3">
                    <FilePenLine /> Our blog
                  </div>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="mr-[20px] flex items-center">
            {isAuthenticated ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer flex items-center justify-center">
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="User avatar"
                  />
                  <AvatarFallback>{userInitial || "U"}</AvatarFallback>
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