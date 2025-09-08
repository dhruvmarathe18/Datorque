"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { ChatWidget } from "@/components/ui/chat-widget";

export function ConditionalComponents() {
  const pathname = usePathname();
  
  // Hide Navigation, Footer and ChatWidget on webinar page
  const isWebinarPage = pathname === "/webinar";
  
  if (isWebinarPage) {
    return null;
  }
  
  return (
    <>
      <Navigation />
      <Footer />
      <ChatWidget />
    </>
  );
}
