import clientPromise from '@/pages/lib/mongodb';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const adminDetails = ["okunlolaridwanat@gmail.com"];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    signIn: async ({ user, account }) => {
      console.log("User:", user);
      console.log("Account:", account);
      return true; // or implement your logic here
    },
    session: ({ session }) => {
      if (adminDetails.includes(session?.user?.email)) {
        return session;
      }
      return null; // Return null to deny access
    },
  },
  
  
};

export default NextAuth(authOptions);


export async function isAdminRequest(req,res){
  const session = await getServerSession(req,res,authOptions)
  if(!adminDetails.includes(session?.user?.email)){
    throw "not an admin"

  }




}