// components/ClientWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ChatBot from "@/app/_components/Chatbot/ChatBot";
import LoadingSpinner from "@/app/_components/LoadingSpinner/page"; // Make sure this file exists

const publicRoutes = ["/", "/login", "/signup", "/verify-code"];

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [routeLoading, setRouteLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  const pathname = usePathname();
  const router = useRouter();

  // 👇 Trigger spinner on route change
  useEffect(() => {
    setRouteLoading(true);
    const timeout = setTimeout(() => setRouteLoading(false), 500); // Adjust duration

    return () => clearTimeout(timeout);
  }, [pathname]);

  // 👇 Global Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        const res = await fetch("/api/isLoggedIn");
        const data = await res.json();
        
        setIsLoggedIn(data.isLoggedIn);

        // If the user is NOT logged in and trying to access a protected route
        if (!data.isLoggedIn && !publicRoutes.includes(pathname)) {
          router.push("/login");
        }
      } catch {
        setIsLoggedIn(false);
        if (!publicRoutes.includes(pathname)) {
          router.push("/login");
        }
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // If we are checking auth on a protected route, show loading spinner to prevent flash
  if (authLoading && !publicRoutes.includes(pathname)) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {routeLoading && <LoadingSpinner />}
      {children}
      <ChatBot isLoggedIn={isLoggedIn} />
    </>
  );
}
