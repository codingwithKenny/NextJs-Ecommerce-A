import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";
import { Toast } from "./ui/toast";


export default function Layout({children}) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <button
            onClick={() => signIn('google')}
            className="bg-white p-2 rounded"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mb-2 mr-2 rounded-lg p-4">
        <h1>
         {children}
        </h1>
       
      </div>
    </div>
  );
}
