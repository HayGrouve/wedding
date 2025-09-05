"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import useActiveSection from "@/hooks/useActiveSection";

const navigationItems = [
  { id: "home", label: "Начало", href: "#home" },
  { id: "schedule", label: "Програма", href: "#schedule" },
  { id: "details", label: "Детайли", href: "#details" },
  { id: "rsvp", label: "Присъствие", href: "#rsvp" },
];

function getHeaderHeight(): number {
  const el = document.querySelector<HTMLElement>('header[role="banner"]');
  return el?.offsetHeight ?? 80;
}

interface DesktopNavigationProps {
  className?: string;
}

export default function DesktopNavigation({ className }: DesktopNavigationProps) {
  const activeId = useActiveSection(navigationItems.map((n) => n.id), "home");

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    const targetId = href.replace("#", "");
    if (targetId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      e.currentTarget.blur();
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerHeight = getHeaderHeight();
      const extra = 18; // slight additional offset to avoid any gap
      const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementTop - headerHeight + extra);

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      // Remove focus to avoid lingering focus styles
      e.currentTarget.blur();
    }
  };

  return (
    <NavigationMenu className={cn("hidden md:flex", className)}>
      <NavigationMenuList>
        {navigationItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuLink
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "font-medium relative",
                  "transition-all duration-200 ease-in-out",
                  "border rounded-md",
                  isActive ? "border-primary text-gray-900 shadow-md" : "border-gray-300",
                  "hover:shadow-md focus-visible:shadow-md",
                  "hover:text-gray-900 focus-visible:text-gray-900"
                )}
                onClick={(e) => handleSmoothScroll(e, item.href)}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
