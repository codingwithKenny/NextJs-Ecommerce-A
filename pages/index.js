import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";


export default function Home() {
  const {data: session} = useSession()

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
       <h1> Hello,<b>{session?.user?.name}</b></h1 >
       <div className="flex bg-gray-300 rounded-lg">
       <img className="w-6 h-6 rounded-lg" src={session?.user?.image}></img>
       <span>{session?.user?.email}</span>
       </div>
      </div>
    </Layout>
  )
}
