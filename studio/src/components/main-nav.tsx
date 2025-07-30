"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Siren,
  ShieldCheck,
  BookOpen,
  MessageSquareWarning,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const useIsActive = (path: string) => {
  const pathname = usePathname();
  if (path === "/dashboard") {
    return pathname === path;
  }
  return pathname.startsWith(path);
};

export function MainNav() {
  const isActive = useIsActive;

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/alerts",
      label: "Live Alerts",
      icon: Siren,
    },
    {
      href: "/dashboard/reports",
      label: "Community Reports",
      icon: MessageSquareWarning,
    },
    {
      href: "/dashboard/safety",
      label: "My Area Safety",
      icon: ShieldCheck,
    },
    {
      href: "/dashboard/education",
      label: "Education",
      icon: BookOpen,
    },
  ];

  return (
    <SidebarMenu className="p-2">
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={isActive(item.href)}
            tooltip={item.label}
            className="justify-start w-full"
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
