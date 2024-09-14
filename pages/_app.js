import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster"; // This component will handle toast rendering
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <Component {...pageProps} />
        <Toaster />
      </ToastProvider>
    </SessionProvider>
  );
}
