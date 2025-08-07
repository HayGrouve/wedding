"use client";

import { ReactNode } from "react";
import Header from "./Header";
import { useScrollSpy } from "@/hooks/useScrollSpy";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  // Track which section is currently active for navigation highlighting
  const activeSection = useScrollSpy({
    sectionIds: ["home", "details", "rsvp"],
    offset: 100,
    threshold: 0.5,
  });

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 
                   bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium
                   transition-all duration-200 focus:outline-none focus:ring-2 
                   focus:ring-ring focus:ring-offset-2"
      >
        Прескочи към съдържанието
      </a>

      {/* Main semantic structure */}
      <div className="min-h-screen flex flex-col">
        {/* Header with Navigation */}
        <header
          role="banner"
          aria-label="Главна навигация"
          className="sticky top-0 z-50 w-full supports-[position:sticky]:sticky"
        >
          <Header activeSection={activeSection} />
        </header>

        {/* Main content area */}
        <main
          id="main-content"
          role="main"
          aria-label="Основно съдържание"
          className="flex-1"
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          role="contentinfo"
          aria-label="Информация за уебсайта"
          className="bg-card border-t py-8 mt-auto"
        >
          <div className="container-wedding text-center">
            <p className="text-muted-foreground">
              Сватбен уебсайт на Ана-Мария & Георги
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              15 септември 2025 г. • София, България
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
