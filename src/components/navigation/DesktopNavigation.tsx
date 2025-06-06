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
    id: "gallery",
    label: "Галерия",
    href: "#gallery",
  },
  {
    id: "rsvp",
    label: "RSVP",
    href: "#rsvp",
  },
];

interface DesktopNavigationProps {
  activeSection?: string;
  className?: string;
}

export default function DesktopNavigation({
  activeSection,
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
                "font-medium relative overflow-hidden group",
                "transition-all duration-300 ease-in-out",
                "hover:text-primary focus:text-primary",
                "hover:bg-primary/10 focus:bg-primary/10",
                "hover:scale-105 active:scale-95",
                "before:absolute before:inset-0 before:bg-primary/5",
                "before:scale-x-0 before:transition-transform before:duration-300",
                "hover:before:scale-x-100",
                activeSection === item.id && [
                  "text-primary bg-primary/10 scale-105",
                  "shadow-sm before:scale-x-100",
                ]
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
