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

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({ className }: MobileNavigationProps) {
  const [open, setOpen] = React.useState(false);
  const activeId = useActiveSection(navigationItems.map((n) => n.id), "home");

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    const targetId = href.replace("#", "");
    if (targetId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      (e.currentTarget as HTMLAnchorElement).blur();
      setOpen(false);
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerHeight = getHeaderHeight();
      const extra = 18;
      const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementTop - headerHeight + extra);

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      (e.currentTarget as HTMLAnchorElement).blur();
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
          {navigationItems.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center px-4 py-3 text-lg font-medium rounded-md",
                  "relative",
                  "transition-all duration-200 ease-in-out",
                  "border",
                  isActive ? "border-primary text-gray-900 shadow-md" : "border-gray-300",
                  "hover:shadow-md focus-visible:shadow-md",
                  "hover:text-gray-900 focus-visible:text-gray-900 focus-visible:outline-none",
                  "animate-in slide-in-from-right-4 fade-in-0",
                  "w-full max-w-46 justify-center"
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationDuration: "400ms",
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Wedding date info */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">13 декември 2025 г.</p>
            <p className="text-xs text-muted-foreground mt-1">София, България</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
