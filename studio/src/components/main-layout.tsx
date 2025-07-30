"use client";

import React from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainNav } from "./main-nav";
import { SiteHeader } from "./site-header";
import { useIsMobile } from "@/hooks/use-mobile";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  // We can't render the sidebar on the server because it requires client-side hooks.
  // We can instead render a skeleton loader on the server.
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SidebarProvider>
      {isClient ? (
        <Sidebar>
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center p-2">
               <h1 className="font-headline text-xl font-semibold ml-2 text-primary">FLECT</h1>
            </div>
            <MainNav />
          </div>
        </Sidebar>
      ) : null}

      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <SiteHeader />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
