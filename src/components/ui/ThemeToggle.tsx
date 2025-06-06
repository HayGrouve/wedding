"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 hover:bg-wedding-sage/10 dark:hover:bg-wedding-sage/20"
          title="Смени тема"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Смени тема</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background/95 backdrop-blur-sm border-border/50"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-wedding-sage/10 cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Светла</span>
          {theme === "light" && (
            <span className="ml-auto text-wedding-rose">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-wedding-sage/10 cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Тъмна</span>
          {theme === "dark" && (
            <span className="ml-auto text-wedding-rose">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-wedding-sage/10 cursor-pointer"
        >
          <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-sun to-moon"></div>
          <span>Системна</span>
          {theme === "system" && (
            <span className="ml-auto text-wedding-rose">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
