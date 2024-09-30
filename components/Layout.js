import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";
import { Toast } from "./ui/toast";
import { useState } from "react";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false)

  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 rounded"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 min-h-screen">
      <div className="block md:hidden">
      <button
      onClick={()=>{setShowNav(true)}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      </div>
      <div className=" flex">
        <Nav show={showNav} />
        <div className="bg-white flex-grow mt-2 mb-2 mr-2 rounded-lg p-4">
          <h1>{children}</h1>
        </div>
      </div>
    </div>
  );
}
