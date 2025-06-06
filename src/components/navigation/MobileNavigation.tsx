"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Heart } from "lucide-react";
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

interface MobileNavigationProps {
  activeSection?: string;
  className?: string;
}

export default function MobileNavigation({
  activeSection,
  className,
}: MobileNavigationProps) {
  const [open, setOpen] = React.useState(false);

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

      // Close the mobile menu after navigation
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "md:hidden transition-all duration-200",
            "hover:scale-110 active:scale-90",
            "hover:bg-primary/10",
            className
          )}
          aria-label="Отвори навигацията"
        >
          <Menu className="h-5 w-5 transition-transform duration-200 menu-float" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-serif">Ана-Мария & Иван</span>
          </SheetTitle>
          <SheetDescription>Навигация по уебсайта</SheetDescription>
        </SheetHeader>

        <div className="mt-8 flex flex-col space-y-1">
          {navigationItems.map((item, index) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className={cn(
                "flex items-center px-4 py-3 text-lg font-medium rounded-md",
                "relative overflow-hidden group",
                "transition-all duration-300 ease-in-out",
                "hover:bg-primary/10 focus:bg-primary/10",
                "hover:text-primary focus:text-primary focus:outline-none",
                "hover:translate-x-2 hover:shadow-md",
                "before:absolute before:left-0 before:top-0 before:h-full before:w-1",
                "before:bg-primary before:scale-y-0 before:transition-transform before:duration-300",
                "before:origin-bottom hover:before:scale-y-100",
                "animate-in slide-in-from-right-4 fade-in-0",
                activeSection === item.id && [
                  "text-primary bg-primary/10 translate-x-2 shadow-md",
                  "before:scale-y-100",
                ]
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animationDuration: "400ms",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Wedding date info */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">
              15 септември 2025 г.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              София, България
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
