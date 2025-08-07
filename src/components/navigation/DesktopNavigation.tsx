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

const navigationItems = [
  {
    id: "home",
    label: "Начало",
    href: "#home",
  },
  {
    id: "details",
    label: "Детайли",
    href: "#details",
  },
  {
    id: "rsvp",
    label: "RSVP",
    href: "#rsvp",
  },
];

interface DesktopNavigationProps {
  className?: string;
}

export default function DesktopNavigation({
  className,
}: DesktopNavigationProps) {
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerHeight = 80; // Account for sticky header
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <NavigationMenu className={cn("hidden md:flex", className)}>
      <NavigationMenuList>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.id}>
            <NavigationMenuLink
              href={item.href}
              className={cn(
                navigationMenuTriggerStyle(),
                "font-medium relative",
                "transition-all duration-200 ease-in-out",
                "border border-gray-300 rounded-md",
                "hover:shadow-md focus:shadow-md",
                "hover:text-gray-900 focus:text-gray-900"
              )}
              onClick={(e) => handleSmoothScroll(e, item.href)}
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
