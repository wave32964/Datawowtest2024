"use client"; // Make sure to mark the component as client-side

import { useRouter } from "next/navigation"; // Import useRouter hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const router = useRouter(); // Get the router instance

  const handleLogin = () => {
    // Simulate authentication, set an auth token in localStorage
    localStorage.setItem("auth_token", "authenticated-token");

    // After login, redirect to the home page
    router.push("/"); // Redirect to home page after successful login
  };

  return (
    // <div className="min-h-screen bg-green-500 flex overflow-hidden ">
    //   <div className="justify-center flex items-center w-3/5">
    //     <div className="w-[384px] h-[178px]">
    //       <div className="text-2xl font-semibold mb-4 text-white">Sign In</div>
    //       <Input
    //         id="username"
    //         type="text"
    //         placeholder="Username"
    //         className=" placeholder:text-gray-500 bg-white w-full text-color-text p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
    //       />
    //       <Button onClick={handleLogin} className="bg-success hover:bg-success w-[384px] mt-[20px]">
    //         Sign In
    //       </Button>
    //     </div>
    //   </div>
    //   <div className="w-2/5 bg-green-300 rounded-[36px] justify-center flex items-center">
    //   <div className="text-center"> {/* This will center the text */}
    //     <img
    //       src="/Full-stack Developer Assignment.svg" // Path to your image (can be local or from an external source)
    //       alt="Description of image"
    //       className=" "
    //     />
    //     <p className=" italic  text-lg text-white font-castoro">a Board</p></div>
    //   </div>
    // </div>
    <div className="min-h-screen bg-green-500 flex flex-col md:flex-row">
      {/* Mobile Layout - Logo Section (top) */}
      <div className="bg-green-300 rounded-b-[36px]">
        <div className="md:hidden flex flex-col items-center pt-24 pb-12">
          <div className="w-32 h-32 relative">
            <img
              src="/Full-stack Developer Assignment.svg" // Path to your image (can be local or from an external source)
              alt="Description of image"
              className=" "
              width={128}
              height={128}
            />
          </div>
          <p className="italic text-lg text-white font-serif mt-2">a Board</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex flex-col md:justify-center px-6 md:px-0 md:items-center mt-60 md:mt-20 mb-12 md:mb-50">
        <div className="w-full max-w-[384px] md:ml-auto md:mr-[250px]">
          <h1 className="text-2xl font-semibold mb-6 text-white">Sign in</h1>
          <Input
            id="username"
            type="text"
            placeholder="Username"
            className="bg-white w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a9e6f] focus:border-[#5a9e6f] placeholder:text-gray-500"
          />
          <Button
            onClick={handleLogin}
            className="w-full mt-5 bg-[#5a9e6f] hover:bg-[#4a8e5f] text-white py-3"
          >
            Sign In
          </Button>
        </div>

        {/* Mobile indicator line */}
        <div className="md:hidden w-12 h-1 bg-white/50 rounded-full mx-auto mt-auto mb-6"></div>
      </div>

      {/* Desktop Layout - Right Side with Logo */}
      <div className="hidden md:flex md:w-2/5 bg-green-300 rounded-l-[36px] items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 relative mx-auto">
            <img
              src="/Full-stack Developer Assignment.svg" // Path to your image (can be local or from an external source)
              alt="Description of image"
              className=" "

            />
          </div>
          <p className="italic  text-white font-serif  text-[28px]">a Board</p>
        </div>
      </div>
    </div>
  );
}
