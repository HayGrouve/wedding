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
import { Menu } from "lucide-react";
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

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({
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
              "border border-gray-300 rounded-md",
              "hover:shadow-md",
              className
            )}
            aria-label="Отвори навигацията"
          >
            <Menu className="h-5 w-5" />
          </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <span className="font-serif">Анна-Мария & Георги</span>
            </SheetTitle>
          </div>
          <SheetDescription>Навигация по уебсайта</SheetDescription>
        </SheetHeader>

                 <div className="mt-8 flex flex-col space-y-1 items-center">
          {navigationItems.map((item, index) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
                                                          className={cn(
                 "flex items-center px-4 py-3 text-lg font-medium rounded-md",
                 "relative",
                 "transition-all duration-200 ease-in-out",
                 "border border-gray-300",
                 "hover:shadow-md focus:shadow-md",
                 "hover:text-gray-900 focus:text-gray-900 focus:outline-none",
                 "animate-in slide-in-from-right-4 fade-in-0",
                 "w-full max-w-xs justify-center"
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
                             13 декември 2025 г.
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
