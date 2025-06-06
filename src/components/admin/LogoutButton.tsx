"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  showConfirmation?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "outline",
  size = "sm",
  className = "",
  showConfirmation = true,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear any client-side session data
        sessionStorage.removeItem("admin_redirect");

        // Redirect to home page
        router.push("/");

        // Force a page refresh to ensure all state is cleared
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        console.error("Logout failed:", response.statusText);
        // Still redirect on failure for security
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect on error for security
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const LogoutButtonComponent = (
    <Button
      variant={variant}
      size={size}
      className={`text-muted-foreground hover:text-destructive cursor-pointer ${className}`}
      disabled={isLoggingOut}
      onClick={showConfirmation ? undefined : handleLogout}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Излизане...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Излез
        </>
      )}
    </Button>
  );

  if (!showConfirmation) {
    return LogoutButtonComponent;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{LogoutButtonComponent}</AlertDialogTrigger>
      <AlertDialogContent className="bg-gradient-to-br from-background to-wedding-cream/5 border-wedding-rose/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-wedding-rose">
            Потвърждение за излизане
          </AlertDialogTitle>
          <AlertDialogDescription>
            Сигурни ли сте, че искате да излезете от админ панела? Ще трябва да
            въведете кода за достъп отново за да влезете.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отказ</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Излизане...
              </>
            ) : (
              "Излез"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
